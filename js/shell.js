/* Terminal giả lập Linux (chạy hoàn toàn trên trình duyệt, KHÔNG đụng tới máy thật).
 * Hỗ trợ: pwd ls cd mkdir rmdir touch cat echo cp mv rm chmod head tail wc grep sort
 *         find tar df du free ps pgrep systemctl journalctl sudo ip ping
 *         whoami id date uname clear help man
 *         + pipe (|) + chuỗi lệnh (&&, ||, ;) + redirect (> >>) + glob (*, ?)
 */
(function (root) {
  'use strict';

  var HOME = '/home/hocvien';
  var NOW = 'Nov  2 12:00';

  function dir(children, mode) { return { type: 'dir', mode: mode == null ? 0o755 : mode, children: children || {} }; }
  function file(content, mode) { return { type: 'file', mode: mode == null ? 0o644 : mode, content: content || '' }; }

  function defaultTree() {
    return dir({
      home: dir({
        hocvien: dir({
          'ghichu.txt': file('Hom nay hoc Linux.\nTerminal that ra rat logic.\n'),
          Documents: dir({ 'baocao.txt': file('Bao cao tuan 1\n') }),
          Downloads: dir({}),
          '.cauhinh': file('an=1\n')
        })
      }),
      etc: dir({
        hostname: file('linux-lab\n'),
        hosts: file('127.0.0.1   localhost\n192.168.1.50 linux-lab\n'),
        nginx: dir({ 'nginx.conf': file('worker_processes auto;\nhttp { server { listen 80; } }\n') })
      }),
      var: dir({
        log: dir({
          messages: file('Nov  2 10:00:01 linux-lab systemd[1]: Started OpenSSH server daemon.\nNov  2 10:05:12 linux-lab nginx[1120]: [emerg] bind() to 0.0.0.0:80 failed (98: Address already in use)\nNov  2 10:05:12 linux-lab systemd[1]: nginx.service: Failed with result \'exit-code\'.\n'),
          'secure.log': file('Nov  2 09:50:11 linux-lab sshd[982]: Accepted publickey for hocvien from 192.168.1.10 port 51234 ssh2\n')
        })
      }),
      tmp: dir({})
    });
  }

  function defaultServices() {
    return {
      sshd: { active: true, enabled: true, pid: 982, desc: 'OpenSSH server daemon', logs: [
        'Nov 02 09:50:00 linux-lab systemd[1]: Starting OpenSSH server daemon...',
        'Nov 02 09:50:01 linux-lab sshd[982]: Server listening on 0.0.0.0 port 22.',
        'Nov 02 09:50:01 linux-lab systemd[1]: Started OpenSSH server daemon.'
      ] },
      nginx: { active: true, enabled: true, pid: 1120, desc: 'The nginx HTTP and reverse proxy server', logs: [
        'Nov 02 10:00:00 linux-lab systemd[1]: Starting The nginx HTTP and reverse proxy server...',
        'Nov 02 10:00:01 linux-lab systemd[1]: Started The nginx HTTP and reverse proxy server.'
      ] },
      crond: { active: true, enabled: true, pid: 740, desc: 'Command Scheduler', logs: [
        'Nov 02 09:00:00 linux-lab systemd[1]: Started Command Scheduler.'
      ] },
      firewalld: { active: true, enabled: true, pid: 650, desc: 'firewalld - dynamic firewall daemon', logs: [
        'Nov 02 09:00:00 linux-lab systemd[1]: Started firewalld - dynamic firewall daemon.'
      ] }
    };
  }

  function deepClone(o) { return JSON.parse(JSON.stringify(o)); }

  function modeStr(node) {
    var s = node.type === 'dir' ? 'd' : '-';
    for (var i = 2; i >= 0; i--) {
      var b = (node.mode >> (i * 3)) & 7;
      s += (b & 4 ? 'r' : '-') + (b & 2 ? 'w' : '-') + (b & 1 ? 'x' : '-');
    }
    return s;
  }

  function tokenize(line) {
    var toks = [], cur = '', has = false, quoted = false, q = null;
    function push() { if (has) { toks.push({ t: 'w', v: cur, quoted: quoted }); } cur = ''; has = false; quoted = false; }
    for (var i = 0; i < line.length; i++) {
      var c = line[i];
      if (q) { if (c === q) { q = null; } else { cur += c; } continue; }
      if (c === '"' || c === "'") { q = c; has = true; quoted = true; continue; }
      if (c === ' ' || c === '\t') { push(); continue; }
      if (c === ';') { push(); toks.push({ t: 'sep', v: ';' }); continue; }
      if (c === '&' && line[i + 1] === '&') { push(); toks.push({ t: 'sep', v: '&&' }); i++; continue; }
      if (c === '|') {
        push();
        if (line[i + 1] === '|') { toks.push({ t: 'sep', v: '||' }); i++; }
        else { toks.push({ t: 'op', v: '|' }); }
        continue;
      }
      if (c === '2' && line[i + 1] === '>' && !has) {
        if (line.slice(i, i + 4) === '2>&1') { i += 3; continue; }
        if (line.slice(i, i + 12) === '2>/dev/null') { i += 10; continue; }
      }
      if (c === '>') {
        push();
        if (line[i + 1] === '>') { toks.push({ t: 'op', v: '>>' }); i++; } else { toks.push({ t: 'op', v: '>' }); }
        continue;
      }
      cur += c; has = true;
    }
    if (q) { return { error: 'unexpected EOF while looking for matching quote' }; }
    push();
    return { toks: toks };
  }

  function Shell(tree, opts) {
    opts = opts || {};
    this.root = tree || defaultTree();
    this.home = opts.home || HOME;
    this.cwd = opts.cwd || this.home;
    this.user = opts.user || 'hocvien';
    this.host = opts.host || 'linux-lab';
    this.services = opts.services ? deepClone(opts.services) : defaultServices();
    this.asRoot = false;
  }

  Shell.defaultTree = defaultTree;
  Shell.defaultServices = defaultServices;
  Shell.dir = dir;
  Shell.file = file;
  Shell.clone = deepClone;

  var P = Shell.prototype;

  P.abs = function (p) {
    if (p === '~' || p.indexOf('~/') === 0) p = this.home + p.slice(1);
    if (p[0] !== '/') p = this.cwd + '/' + p;
    var parts = [];
    p.split('/').forEach(function (s) {
      if (!s || s === '.') return;
      if (s === '..') parts.pop(); else parts.push(s);
    });
    return '/' + parts.join('/');
  };

  P.get = function (abs) {
    var n = this.root;
    if (abs === '/') return n;
    var segs = abs.slice(1).split('/');
    for (var i = 0; i < segs.length; i++) {
      if (n.type !== 'dir' || !Object.prototype.hasOwnProperty.call(n.children, segs[i])) return null;
      n = n.children[segs[i]];
    }
    return n;
  };

  // Kiểm tra quyền đi qua (x) trên các thư mục cha
  P.canTraverse = function (abs) {
    if (this.asRoot) return true;
    var n = this.root;
    if (!(n.mode & 0o100)) return false;
    if (abs === '/') return true;
    var segs = abs.slice(1).split('/');
    for (var i = 0; i < segs.length - 1; i++) {
      n = n.children[segs[i]];
      if (!n || n.type !== 'dir') return true;
      if (!(n.mode & 0o100)) return false;
    }
    return true;
  };

  P.canRead = function (n) { return this.asRoot || !!(n.mode & 0o400); };
  P.canWrite = function (n) { return this.asRoot || !!(n.mode & 0o200); };
  P.canExec = function (n) { return this.asRoot || !!(n.mode & 0o100); };

  P.split = function (abs) {
    var i = abs.lastIndexOf('/');
    return { dir: i === 0 ? '/' : abs.slice(0, i), name: abs.slice(i + 1) };
  };
  P.prompt = function () {
    var d = this.cwd === this.home ? '~' : (this.cwd.indexOf(this.home + '/') === 0 ? '~' + this.cwd.slice(this.home.length) : this.cwd);
    return this.user + '@' + this.host + ':' + d + '$ ';
  };
  P.readFile = function (path) { var n = this.get(this.abs(path)); return n && n.type === 'file' ? n.content : null; };
  P.exists = function (path) { return !!this.get(this.abs(path)); };
  P.node = function (path) { return this.get(this.abs(path)); };

  // glob: chỉ hỗ trợ ở phần cuối của đường dẫn
  P.glob = function (arg) {
    if (!/[*?]/.test(arg)) return [arg];
    var i = arg.lastIndexOf('/');
    var dpart = i >= 0 ? arg.slice(0, i + 1) : '';
    var pat = i >= 0 ? arg.slice(i + 1) : arg;
    var dn = this.get(this.abs(dpart || '.'));
    if (!dn || dn.type !== 'dir' || !this.canRead(dn)) return [arg];
    var re = new RegExp('^' + pat.replace(/[.+^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*').replace(/\?/g, '.') + '$');
    var out = Object.keys(dn.children).sort().filter(function (n) {
      return re.test(n) && (n[0] !== '.' || pat[0] === '.');
    }).map(function (n) { return dpart + n; });
    return out.length ? out : [arg];
  };

  P.run = function (line) {
    line = line.trim();
    if (!line || line[0] === '#') return { out: '', err: '', code: 0 };
    var tk = tokenize(line);
    if (tk.error) return { out: '', err: 'bash: ' + tk.error + '\n', code: 2 };

    // Tách theo ; && ||
    var chains = [], curTokens = [], lastSep = null;
    tk.toks.forEach(function (t) {
      if (t.t === 'sep') {
        chains.push({ sep: lastSep, toks: curTokens });
        curTokens = [];
        lastSep = t.v;
      } else {
        curTokens.push(t);
      }
    });
    if (curTokens.length || lastSep) chains.push({ sep: lastSep, toks: curTokens });

    var totalOut = '', totalErr = '', lastCode = 0, didClear = false;
    for (var c = 0; c < chains.length; c++) {
      var item = chains[c];
      if (!item.toks.length) continue;
      if (item.sep === '&&' && lastCode !== 0) continue;
      if (item.sep === '||' && lastCode === 0) continue;
      var res = this.runPipeline(item.toks);
      if (res.clear) { totalOut = ''; totalErr = ''; didClear = true; }
      totalOut += res.out || '';
      totalErr += res.err || '';
      lastCode = res.code != null ? res.code : (res.err ? 1 : 0);
    }
    return { out: totalOut, err: totalErr, code: lastCode, clear: didClear };
  };

  P.runPipeline = function (toks) {
    var segs = [[]];
    toks.forEach(function (t) { if (t.t === 'op' && t.v === '|') segs.push([]); else segs[segs.length - 1].push(t); });
    var stdin = null, errAll = '', out = '', code = 0;
    for (var s = 0; s < segs.length; s++) {
      var seg = segs[s], words = [], redir = null;
      for (var i = 0; i < seg.length; i++) {
        var t = seg[i];
        if (t.t === 'op') {
          var nxt = seg[i + 1];
          if (!nxt || nxt.t !== 'w') return { out: '', err: "bash: syntax error near unexpected token `newline'\n", code: 2 };
          redir = { mode: t.v, path: nxt.v }; i++;
        } else if (t.quoted) { words.push(t.v); } else { Array.prototype.push.apply(words, this.glob(t.v)); }
      }
      if (!words.length) return { out: '', err: "bash: syntax error near unexpected token `|'\n", code: 2 };
      var name = words[0], args = words.slice(1);
      var fn = this.cmds[name];
      var r;
      if (!fn) r = { out: '', err: name + ': command not found\n', code: 127 };
      else r = fn.call(this, args, stdin) || { out: '' };
      errAll += r.err || '';
      out = r.out || '';
      code = r.code != null ? r.code : (r.err ? 1 : 0);
      if (r.clear) return { out: '', err: errAll, clear: true, code: 0 };
      if (redir) {
        if (redir.path === '/dev/null') { out = ''; }
        else {
          var w = this.writeFile(redir.path, out, redir.mode === '>>');
          if (w) { errAll += w; code = 1; }
          out = '';
        }
      }
      stdin = out;
    }
    return { out: out, err: errAll, code: code };
  };

  P.writeFile = function (path, content, append) {
    var a = this.abs(path), sp = this.split(a), pd = this.get(sp.dir);
    if (!this.canTraverse(a)) return 'bash: ' + path + ': Permission denied\n';
    if (!pd || pd.type !== 'dir') return 'bash: ' + path + ': No such file or directory\n';
    var ex = pd.children[sp.name];
    if (ex && ex.type === 'dir') return 'bash: ' + path + ': Is a directory\n';
    if (ex && !this.canWrite(ex)) return 'bash: ' + path + ': Permission denied\n';
    if (!ex && !this.canWrite(pd)) return 'bash: ' + path + ': Permission denied\n';
    if (ex) ex.content = append ? ex.content + content : content;
    else pd.children[sp.name] = file(content);
    return '';
  };

  function lines(text) { var a = text.split('\n'); if (a[a.length - 1] === '') a.pop(); return a; }
  function opts(args) {
    var flags = {}, rest = [], endOpts = false;
    args.forEach(function (a) {
      if (!endOpts && a === '--') { endOpts = true; return; }
      if (!endOpts && a.length > 1 && a[0] === '-' && !/^-\d+$/.test(a)) {
        if (a[1] === '-') flags[a.slice(2)] = true;
        else a.slice(1).split('').forEach(function (c) { flags[c] = true; });
      } else rest.push(a);
    });
    return { f: flags, a: rest };
  }

  function copyNode(n) { return deepClone(n); }

  function calcSize(node) {
    if (node.type === 'file') return Math.max(1, node.content.length);
    var sum = 4096;
    Object.keys(node.children || {}).forEach(function (k) { sum += calcSize(node.children[k]); });
    return sum;
  }

  function humanSize(bytes) {
    if (bytes < 1024) return bytes + 'B';
    var kb = Math.ceil(bytes / 1024);
    if (kb < 1024) return kb + 'K';
    return (kb / 1024).toFixed(1) + 'M';
  }

  P.cmds = {
    pwd: function () { return { out: this.cwd + '\n' }; },
    whoami: function () { return { out: (this.asRoot ? 'root' : this.user) + '\n' }; },
    id: function () {
      if (this.asRoot) return { out: 'uid=0(root) gid=0(root) groups=0(root)\n' };
      return { out: 'uid=1000(' + this.user + ') gid=1000(' + this.user + ') groups=1000(' + this.user + '),10(wheel)\n' };
    },
    date: function (a) {
      if (a[0] && a[0][0] === '+') {
        var s = a[0].slice(1).replace('%Y', '2026').replace('%m', '11').replace('%d', '02').replace('%H', '12').replace('%M', '00');
        return { out: s + '\n' };
      }
      return { out: 'Mon Nov  2 12:00:00 +07 2026\n' };
    },
    uname: function (a) { return { out: a.indexOf('-a') >= 0 ? 'Linux linux-lab 6.1.0 #1 SMP x86_64 GNU/Linux\n' : 'Linux\n' }; },
    clear: function () { return { clear: true }; },
    echo: function (a) { return { out: a.join(' ') + '\n' }; },
    true: function () { return { out: '', code: 0 }; },
    false: function () { return { out: '', code: 1 }; },

    sudo: function (args, stdin) {
      if (!args.length) return { err: 'usage: sudo command [args...]\n', code: 1 };
      var fn = this.cmds[args[0]];
      if (!fn) return { err: 'sudo: ' + args[0] + ': command not found\n', code: 127 };
      var prev = this.asRoot;
      this.asRoot = true;
      try { return fn.call(this, args.slice(1), stdin) || { out: '' }; }
      finally { this.asRoot = prev; }
    },

    cd: function (a) {
      var target = a[0] || '~';
      if (target === '-') target = this.prev || '~';
      var ab = this.abs(target), n = this.get(ab);
      if (!this.canTraverse(ab)) return { err: 'bash: cd: ' + target + ': Permission denied\n', code: 1 };
      if (!n) return { err: 'bash: cd: ' + target + ': No such file or directory\n', code: 1 };
      if (n.type !== 'dir') return { err: 'bash: cd: ' + target + ': Not a directory\n', code: 1 };
      if (!this.canExec(n)) return { err: 'bash: cd: ' + target + ': Permission denied\n', code: 1 };
      this.prev = this.cwd; this.cwd = ab; return {};
    },

    ls: function (args) {
      var o = opts(args), paths = o.a.length ? o.a : ['.'], out = '', err = '', fileItems = [], dirPaths = [], self = this;
      function fmt(name, n) {
        if (!o.f.l) return name;
        var size = n.type === 'file' ? n.content.length : 4096;
        var szStr = o.f.h ? humanSize(size) : String(size);
        return modeStr(n) + ' 1 ' + self.user + ' ' + self.user + ' ' + szStr.padStart(5) + ' ' + NOW + ' ' + name;
      }
      paths.forEach(function (p) {
        var ab = self.abs(p);
        if (!self.canTraverse(ab)) { err += "ls: cannot access '" + p + "': Permission denied\n"; return; }
        var n = self.get(ab);
        if (!n) { err += "ls: cannot access '" + p + "': No such file or directory\n"; return; }
        if (n.type === 'file' || o.f.d) { fileItems.push(fmt(p, n)); return; }
        dirPaths.push({ p: p, n: n });
      });
      if (fileItems.length) {
        out += fileItems.join(o.f.l ? '\n' : '  ') + '\n';
      }
      dirPaths.forEach(function (d, idx) {
        var p = d.p, n = d.n;
        if (!self.canRead(n)) { err += "ls: cannot open directory '" + p + "': Permission denied\n"; return; }
        if (paths.length > 1) out += (fileItems.length || idx ? '\n' : '') + p + ':\n';
        var names = Object.keys(n.children).sort(function (x, y) { return x.toLowerCase() < y.toLowerCase() ? -1 : 1; });
        if (!o.f.a) names = names.filter(function (x) { return x[0] !== '.'; });
        var items = names.map(function (x) { return fmt(x, n.children[x]); });
        if (o.f.a) { items.unshift(fmt('..', n)); items.unshift(fmt('.', n)); }
        if (o.f.l) out += 'total ' + items.length * 4 + '\n' + items.join('\n') + (items.length ? '\n' : '');
        else out += items.join('  ') + (items.length ? '\n' : '');
      });
      return { out: out, err: err };
    },

    mkdir: function (args) {
      var o = opts(args), err = '', self = this;
      if (!o.a.length) return { err: 'mkdir: missing operand\n' };
      o.a.forEach(function (p) {
        var ab = self.abs(p), sp = self.split(ab), pd = self.get(sp.dir);
        if (self.get(ab)) { if (!o.f.p) err += "mkdir: cannot create directory '" + p + "': File exists\n"; return; }
        if (!pd) {
          if (!o.f.p) { err += "mkdir: cannot create directory '" + p + "': No such file or directory\n"; return; }
          var cur = self.root;
          ab.slice(1).split('/').forEach(function (s) {
            if (!cur.children[s]) cur.children[s] = dir();
            cur = cur.children[s];
          });
          return;
        }
        if (pd.type !== 'dir') { err += "mkdir: cannot create directory '" + p + "': Not a directory\n"; return; }
        if (!self.canWrite(pd) || !self.canExec(pd)) { err += "mkdir: cannot create directory '" + p + "': Permission denied\n"; return; }
        pd.children[sp.name] = dir();
      });
      return { err: err };
    },

    rmdir: function (args) {
      var err = '', self = this;
      args.forEach(function (p) {
        var ab = self.abs(p), n = self.get(ab);
        if (!n) { err += "rmdir: failed to remove '" + p + "': No such file or directory\n"; return; }
        if (n.type !== 'dir') { err += "rmdir: failed to remove '" + p + "': Not a directory\n"; return; }
        if (Object.keys(n.children).length) { err += "rmdir: failed to remove '" + p + "': Directory not empty\n"; return; }
        var pd = self.get(self.split(ab).dir);
        if (!self.canWrite(pd)) { err += "rmdir: failed to remove '" + p + "': Permission denied\n"; return; }
        delete pd.children[self.split(ab).name];
      });
      return { err: err };
    },

    touch: function (args) {
      var err = '', self = this;
      if (!args.length) return { err: 'touch: missing file operand\n' };
      args.forEach(function (p) {
        var ab = self.abs(p), sp = self.split(ab), pd = self.get(sp.dir);
        if (!pd || pd.type !== 'dir') { err += "touch: cannot touch '" + p + "': No such file or directory\n"; return; }
        if (!self.canWrite(pd) || !self.canExec(pd)) { err += "touch: cannot touch '" + p + "': Permission denied\n"; return; }
        if (!pd.children[sp.name]) pd.children[sp.name] = file('');
      });
      return { err: err };
    },

    cat: function (args, stdin) {
      if (!args.length) return { out: stdin == null ? '' : stdin };
      var out = '', err = '', self = this;
      args.forEach(function (p) {
        var ab = self.abs(p);
        if (!self.canTraverse(ab)) { err += 'cat: ' + p + ': Permission denied\n'; return; }
        var n = self.get(ab);
        if (!n) err += 'cat: ' + p + ': No such file or directory\n';
        else if (n.type === 'dir') err += 'cat: ' + p + ': Is a directory\n';
        else if (!self.canRead(n)) err += 'cat: ' + p + ': Permission denied\n';
        else out += n.content;
      });
      return { out: out, err: err };
    },

    cp: function (args) {
      var o = opts(args), a = o.a, self = this;
      if (a.length < 2) return { err: 'cp: missing destination file operand\n' };
      var dst = a[a.length - 1], srcs = a.slice(0, -1), err = '';
      var dAbs = this.abs(dst), dn = this.get(dAbs);
      if (srcs.length > 1 && !(dn && dn.type === 'dir')) return { err: "cp: target '" + dst + "' is not a directory\n" };
      srcs.forEach(function (s) {
        var sAbs = self.abs(s), sn = self.get(sAbs);
        if (!sn) { err += "cp: cannot stat '" + s + "': No such file or directory\n"; return; }
        if (sn.type === 'dir' && !(o.f.r || o.f.R)) { err += "cp: -r not specified; omitting directory '" + s + "'\n"; return; }
        if (!self.canRead(sn)) { err += "cp: cannot open '" + s + "' for reading: Permission denied\n"; return; }
        var target;
        if (dn && dn.type === 'dir') { dn.children[self.split(sAbs).name] = copyNode(sn); return; }
        var sp = self.split(dAbs), pd = self.get(sp.dir);
        if (!pd || pd.type !== 'dir') { err += "cp: cannot create regular file '" + dst + "': No such file or directory\n"; return; }
        target = copyNode(sn); pd.children[sp.name] = target;
      });
      return { err: err };
    },

    mv: function (args) {
      var a = opts(args).a, self = this;
      if (a.length < 2) return { err: 'mv: missing destination file operand\n' };
      var dst = a[a.length - 1], srcs = a.slice(0, -1), err = '';
      var dAbs = this.abs(dst), dn = this.get(dAbs);
      if (srcs.length > 1 && !(dn && dn.type === 'dir')) return { err: "mv: target '" + dst + "' is not a directory\n" };
      srcs.forEach(function (s) {
        var sAbs = self.abs(s), sn = self.get(sAbs);
        if (!sn) { err += "mv: cannot stat '" + s + "': No such file or directory\n"; return; }
        if (sAbs === '/' || (dAbs + '/').indexOf(sAbs + '/') === 0 && dAbs !== sAbs && sn.type === 'dir') { err += "mv: cannot move '" + s + "' to a subdirectory of itself\n"; return; }
        var ssp = self.split(sAbs);
        var tp, tn;
        if (dn && dn.type === 'dir') { tp = dn; tn = ssp.name; }
        else {
          var dsp = self.split(dAbs); tp = self.get(dsp.dir); tn = dsp.name;
          if (!tp || tp.type !== 'dir') { err += "mv: cannot move '" + s + "' to '" + dst + "': No such file or directory\n"; return; }
        }
        if (tp === self.get(ssp.dir) && tn === ssp.name) return;
        delete self.get(ssp.dir).children[ssp.name];
        tp.children[tn] = sn;
      });
      return { err: err };
    },

    rm: function (args) {
      var o = opts(args), err = '', self = this;
      if (!o.a.length && !o.f.f) return { err: 'rm: missing operand\n' };
      o.a.forEach(function (p) {
        var ab = self.abs(p);
        if (ab === '/' || ab === self.home || ab === '/home') {
          err += "rm: it is dangerous to operate recursively on '" + p + "'\n[Mô phỏng] Trên máy thật, lệnh này có thể xóa sạch dữ liệu của bạn. Luôn kiểm tra kỹ đường dẫn trước khi nhấn Enter!\n";
          return;
        }
        var n = self.get(ab);
        if (!n) { if (!o.f.f) err += "rm: cannot remove '" + p + "': No such file or directory\n"; return; }
        if (n.type === 'dir' && !(o.f.r || o.f.R)) { err += "rm: cannot remove '" + p + "': Is a directory\n"; return; }
        var sp = self.split(ab), pd = self.get(sp.dir);
        if (!self.canWrite(pd)) { err += "rm: cannot remove '" + p + "': Permission denied\n"; return; }
        delete pd.children[sp.name];
        if (self.cwd === ab || self.cwd.indexOf(ab + '/') === 0) self.cwd = sp.dir;
      });
      return { err: err };
    },

    chmod: function (args) {
      var o = opts(args), rest = o.a;
      if (rest.length < 2) return { err: 'chmod: missing operand\n' };
      var spec = rest[0], err = '', self = this;
      function applyMode(n) {
        if (/^[0-7]{3,4}$/.test(spec)) { n.mode = parseInt(spec, 8) & 0o777; return true; }
        var ok = true;
        spec.split(',').forEach(function (part) {
          var m = /^([ugoa]*)([+\-=])([rwx]+)$/.exec(part);
          if (!m) { ok = false; return; }
          var who = m[1] || 'a', bits = 0;
          if (m[3].indexOf('r') >= 0) bits |= 4;
          if (m[3].indexOf('w') >= 0) bits |= 2;
          if (m[3].indexOf('x') >= 0) bits |= 1;
          var mask = 0;
          if (who.indexOf('a') >= 0) who = 'ugo';
          if (who.indexOf('u') >= 0) mask |= bits << 6;
          if (who.indexOf('g') >= 0) mask |= bits << 3;
          if (who.indexOf('o') >= 0) mask |= bits;
          if (m[2] === '+') n.mode |= mask;
          else if (m[2] === '-') n.mode &= ~mask;
          else {
            var clear = 0;
            if (who.indexOf('u') >= 0) clear |= 7 << 6;
            if (who.indexOf('g') >= 0) clear |= 7 << 3;
            if (who.indexOf('o') >= 0) clear |= 7;
            n.mode = (n.mode & ~clear) | mask;
          }
        });
        return ok;
      }
      function walk(n) {
        if (!applyMode(n)) return false;
        if ((o.f.R || o.f.r) && n.type === 'dir') {
          Object.keys(n.children).forEach(function (k) { walk(n.children[k]); });
        }
        return true;
      }
      rest.slice(1).forEach(function (p) {
        var n = self.get(self.abs(p));
        if (!n) { err += "chmod: cannot access '" + p + "': No such file or directory\n"; return; }
        if (!walk(n)) err += "chmod: invalid mode: '" + spec + "'\n";
      });
      return { err: err };
    },

    find: function (args) {
      var paths = [], namePat = null, typeFilter = null, i = 0;
      while (i < args.length) {
        var a = args[i];
        if (a === '-name' && args[i + 1] != null) { namePat = args[i + 1]; i += 2; }
        else if (a === '-type' && args[i + 1] != null) { typeFilter = args[i + 1]; i += 2; }
        else if (a[0] === '-') { i++; }
        else { paths.push(a); i++; }
      }
      if (!paths.length) paths = ['.'];
      var re = namePat ? new RegExp('^' + namePat.replace(/[.+^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*').replace(/\?/g, '.') + '$') : null;
      var out = [], err = '', self = this;
      function walk(node, displayPath, baseName) {
        var matchType = !typeFilter || (typeFilter === 'f' && node.type === 'file') || (typeFilter === 'd' && node.type === 'dir');
        var matchName = !re || re.test(baseName);
        if (matchType && matchName) out.push(displayPath);
        if (node.type === 'dir' && self.canRead(node) && self.canExec(node)) {
          Object.keys(node.children).sort().forEach(function (k) {
            var childDisp = displayPath === '/' ? '/' + k : displayPath + '/' + k;
            walk(node.children[k], childDisp, k);
          });
        }
      }
      paths.forEach(function (p) {
        var clean = p.length > 1 ? p.replace(/\/+$/, '') : p;
        var n = self.get(self.abs(clean));
        if (!n) { err += "find: '" + p + "': No such file or directory\n"; return; }
        var sp = self.split(self.abs(clean));
        walk(n, clean, sp.name || '/');
      });
      return { out: out.length ? out.join('\n') + '\n' : '', err: err };
    },

    tar: function (args) {
      var o = opts(args), a = o.a, self = this;
      if (!a.length) return { err: 'tar: You must specify one of the -Acdtrux options\n' };
      var archPath = a[0], srcs = a.slice(1);
      if (o.f.c) {
        if (!srcs.length) return { err: 'tar: Cowardly refusing to create an empty archive\n' };
        var entries = [], err = '', out = '';
        function collect(node, rel) {
          if (o.f.v) out += rel + (node.type === 'dir' ? '/' : '') + '\n';
          if (node.type === 'file') entries.push({ path: rel, type: 'file', mode: node.mode, content: node.content });
          else {
            entries.push({ path: rel, type: 'dir', mode: node.mode });
            Object.keys(node.children).sort().forEach(function (k) { collect(node.children[k], rel + '/' + k); });
          }
        }
        srcs.forEach(function (s) {
          var clean = s.replace(/\/+$/, '');
          var n = self.get(self.abs(clean));
          if (!n) { err += 'tar: ' + s + ': Cannot stat: No such file or directory\n'; return; }
          collect(n, clean);
        });
        if (err) return { err: err };
        var w = this.writeFile(archPath, JSON.stringify({ _tar: 1, entries: entries }), false);
        if (w) return { err: w };
        return { out: out };
      }
      var raw = this.readFile(archPath);
      if (raw == null) return { err: 'tar: ' + archPath + ': Cannot open: No such file or directory\n' };
      var data;
      try { data = JSON.parse(raw); } catch (e) { data = null; }
      if (!data || !data._tar) return { err: 'tar: This does not look like a tar archive\n' };
      if (o.f.t) {
        return { out: data.entries.map(function (e) { return e.path + (e.type === 'dir' ? '/' : ''); }).join('\n') + '\n' };
      }
      if (o.f.x) {
        var xout = '';
        data.entries.forEach(function (e) {
          if (o.f.v) xout += e.path + '\n';
          if (e.type === 'dir') self.cmds.mkdir.call(self, ['-p', e.path]);
          else {
            var sp = self.split(self.abs(e.path));
            self.cmds.mkdir.call(self, ['-p', sp.dir]);
            self.writeFile(e.path, e.content || '', false);
          }
        });
        return { out: xout };
      }
      return { err: 'tar: Hãy dùng -czf (nén), -tzf (xem danh sách) hoặc -xzf (giải nén)\n' };
    },

    df: function (args) {
      var o = opts(args);
      if (o.f.i) {
        return { out: 'Filesystem      Inodes  IUsed   IFree IUse% Mounted on\n/dev/sda1       524288  42150  482138    9% /\ntmpfs           128000     18  127982    1% /tmp\n' };
      }
      if (o.f.h) {
        return { out: 'Filesystem      Size  Used Avail Use% Mounted on\n/dev/sda1        20G  6.4G   14G  32% /\ntmpfs           500M  1.2M  499M   1% /tmp\n' };
      }
      return { out: 'Filesystem     1K-blocks    Used Available Use% Mounted on\n/dev/sda1       20971520 6710886  14260634  32% /\ntmpfs             512000    1228    510772   1% /tmp\n' };
    },

    du: function (args) {
      var o = opts(args), paths = o.a.length ? o.a : ['.'], out = '', err = '', self = this;
      function fmt(sz, p) {
        var v = o.f.h ? humanSize(sz) : String(Math.max(1, Math.ceil(sz / 1024)));
        return v.padEnd(6) + '\t' + p + '\n';
      }
      function walk(n, p) {
        if (n.type === 'dir') {
          Object.keys(n.children).sort().forEach(function (k) {
            var ch = n.children[k], cp = p === '.' ? './' + k : p.replace(/\/+$/, '') + '/' + k;
            if (ch.type === 'dir') walk(ch, cp);
            else if (o.f.a) out += fmt(calcSize(ch), cp);
          });
        }
        out += fmt(calcSize(n), p);
      }
      paths.forEach(function (p) {
        var n = self.get(self.abs(p));
        if (!n) { err += "du: cannot access '" + p + "': No such file or directory\n"; return; }
        if (o.f.s || n.type === 'file') out += fmt(calcSize(n), p);
        else walk(n, p);
      });
      return { out: out, err: err };
    },

    free: function (args) {
      var o = opts(args);
      if (o.f.h) {
        return { out: '               total        used        free      shared  buff/cache   available\nMem:           3.8Gi       820Mi       2.1Gi        12Mi       910Mi       2.7Gi\nSwap:          2.0Gi          0B       2.0Gi\n' };
      }
      return { out: '               total        used        free      shared  buff/cache   available\nMem:         3984588      839680     2202009       12288      942899     2831155\nSwap:        2097152           0     2097152\n' };
    },

    ps: function () {
      var rows = [
        'USER       PID %CPU %MEM COMMAND',
        'root         1  0.0  0.3 /usr/lib/systemd/systemd'
      ];
      var sv = this.services;
      if (sv.firewalld && sv.firewalld.active) rows.push('root       ' + sv.firewalld.pid + '  0.0  0.6 /usr/sbin/firewalld');
      if (sv.crond && sv.crond.active) rows.push('root       ' + sv.crond.pid + '  0.0  0.1 /usr/sbin/crond -n');
      if (sv.sshd && sv.sshd.active) rows.push('root       ' + sv.sshd.pid + '  0.0  0.2 /usr/sbin/sshd -D');
      if (sv.nginx && sv.nginx.active) {
        rows.push('root      ' + sv.nginx.pid + '  0.0  0.4 nginx: master process /usr/sbin/nginx');
        rows.push('nginx     ' + (sv.nginx.pid + 1) + '  0.0  0.4 nginx: worker process');
      }
      rows.push(this.user.padEnd(10) + '1450  0.0  0.2 -bash');
      return { out: rows.join('\n') + '\n' };
    },

    pgrep: function (args) {
      var o = opts(args);
      if (!o.a.length) return { err: 'pgrep: no matching criteria specified\n', code: 2 };
      var pat = new RegExp(o.a[0]);
      var list = lines(this.cmds.ps.call(this, []).out).slice(1).map(function (ln) {
        var m = /^\S+\s+(\d+)\s+\S+\s+\S+\s+(.*)$/.exec(ln);
        return m ? { pid: m[1], cmd: m[2] } : null;
      }).filter(function (x) { return x && pat.test(x.cmd); });
      if (o.f.c) return { out: list.length + '\n', code: list.length ? 0 : 1 };
      if (!list.length) return { out: '', code: 1 };
      return { out: list.map(function (x) { return o.f.l ? x.pid + ' ' + x.cmd.split(' ')[0] : x.pid; }).join('\n') + '\n', code: 0 };
    },

    systemctl: function (args) {
      var o = opts(args), a = o.a;
      if (!a.length) return { out: 'UNIT              LOAD   ACTIVE SUB     DESCRIPTION\nsshd.service      loaded active running OpenSSH server daemon\nnginx.service     loaded ' + (this.services.nginx.active ? 'active running' : 'failed failed ') + ' The nginx HTTP server\ncrond.service     loaded active running Command Scheduler\n' };
      var act = a[0], name = (a[1] || '').replace(/\.service$/, '');
      var sv = this.services[name];
      if (!sv) return { err: 'Unit ' + (a[1] || '') + '.service could not be found.\n', code: 4 };
      if (act === 'is-active') {
        var state = sv.active ? 'active' : 'inactive';
        return { out: o.f.quiet || o.f.q ? '' : state + '\n', code: sv.active ? 0 : 3 };
      }
      if (act === 'is-enabled') {
        var en = sv.enabled ? 'enabled' : 'disabled';
        return { out: o.f.quiet || o.f.q ? '' : en + '\n', code: sv.enabled ? 0 : 1 };
      }
      if (act === 'status') {
        var st = sv.active ? 'active (running)' : 'inactive (dead)';
        var dot = sv.active ? '●' : '○';
        return {
          out: dot + ' ' + name + '.service - ' + sv.desc + '\n' +
            '     Loaded: loaded (/usr/lib/systemd/system/' + name + '.service; ' + (sv.enabled ? 'enabled' : 'disabled') + ')\n' +
            '     Active: ' + st + '\n' +
            (sv.active ? '   Main PID: ' + sv.pid + ' (' + name + ')\n' : '') +
            '\n' + sv.logs.slice(-3).join('\n') + '\n',
          code: sv.active ? 0 : 3
        };
      }
      if (act === 'start' || act === 'stop' || act === 'restart' || act === 'enable' || act === 'disable') {
        if (!this.asRoot) return { err: 'Permission denied (Access denied): cần quyền quản trị. Hãy chạy với sudo: sudo systemctl ' + args.join(' ') + '\n', code: 1 };
        if (act === 'start' || act === 'restart') {
          sv.active = true;
          sv.logs.push('Nov 02 12:00:00 linux-lab systemd[1]: Started ' + sv.desc + '.');
        } else if (act === 'stop') {
          sv.active = false;
          sv.logs.push('Nov 02 12:00:00 linux-lab systemd[1]: Stopped ' + sv.desc + '.');
        } else if (act === 'enable') {
          sv.enabled = true; if (o.f.now) sv.active = true;
        } else if (act === 'disable') {
          sv.enabled = false;
        }
        return { out: '', code: 0 };
      }
      return { err: 'Unknown systemctl operation: ' + act + '\n', code: 1 };
    },

    journalctl: function (args) {
      var u = null, n = 20, i = 0;
      while (i < args.length) {
        if (args[i] === '-u' && args[i + 1]) { u = args[i + 1].replace(/\.service$/, ''); i += 2; }
        else if (args[i] === '-n' && args[i + 1]) { n = parseInt(args[i + 1], 10); i += 2; }
        else i++;
      }
      var logs = [];
      if (u) {
        var sv = this.services[u];
        if (!sv) return { out: '-- No entries --\n' };
        logs = sv.logs;
      } else {
        var self = this;
        Object.keys(this.services).forEach(function (k) { logs = logs.concat(self.services[k].logs); });
      }
      return { out: logs.slice(-n).join('\n') + '\n' };
    },

    ip: function (args) {
      if (!args.length || args[0] === 'a' || args[0] === 'addr') {
        return { out: '1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 state UNKNOWN\n    inet 127.0.0.1/8 scope host lo\n2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 state UP\n    inet 192.168.1.50/24 brd 192.168.1.255 scope global eth0\n' };
      }
      if (args[0] === 'r' || args[0] === 'route') {
        return { out: 'default via 192.168.1.1 dev eth0 proto static metric 100\n192.168.1.0/24 dev eth0 proto kernel scope link src 192.168.1.50 metric 100\n' };
      }
      return { err: 'Usage: ip [ a | route ]\n', code: 1 };
    },

    ping: function (args) {
      var o = opts(args), host = o.a[o.a.length - 1];
      if (!host) return { err: 'ping: usage error: Destination address required\n', code: 1 };
      return { out: 'PING ' + host + ' (8.8.8.8) 56(84) bytes of data.\n64 bytes from ' + host + ': icmp_seq=1 ttl=115 time=12.4 ms\n64 bytes from ' + host + ': icmp_seq=2 ttl=115 time=11.8 ms\n--- ' + host + ' ping statistics ---\n2 packets transmitted, 2 received, 0% packet loss\n' };
    },

    head: function (args, stdin) { return headTail.call(this, args, stdin, true); },
    tail: function (args, stdin) { return headTail.call(this, args, stdin, false); },

    wc: function (args, stdin) {
      var o = opts(args), text = stdin, name = '';
      if (o.a.length) { text = this.readFile(o.a[0]); name = ' ' + o.a[0]; if (text == null) return { err: 'wc: ' + o.a[0] + ': No such file or directory\n' }; }
      if (text == null) text = '';
      var l = (text.match(/\n/g) || []).length, w = (text.trim() ? text.trim().split(/\s+/).length : 0), c = text.length;
      if (o.f.l) return { out: l + name + '\n' };
      if (o.f.w) return { out: w + name + '\n' };
      if (o.f.c) return { out: c + name + '\n' };
      return { out: ' ' + l + ' ' + w + ' ' + c + name + '\n' };
    },

    grep: function (args, stdin) {
      var o = opts(args);
      if (!o.a.length) return { err: 'Usage: grep [OPTION]... PATTERN [FILE]...\n' };
      var pat = o.a[0], text = stdin;
      if (o.a.length > 1) { text = this.readFile(o.a[1]); if (text == null) return { err: 'grep: ' + o.a[1] + ': No such file or directory\n' }; }
      if (text == null) text = '';
      var re;
      try { re = new RegExp(pat, o.f.i ? 'i' : ''); } catch (e) { return { err: 'grep: Invalid regular expression\n' }; }
      var res = [];
      lines(text).forEach(function (ln, i) {
        if (re.test(ln) !== !!o.f.v) res.push((o.f.n ? (i + 1) + ':' : '') + ln);
      });
      var out = res.length ? res.join('\n') + '\n' : '';
      if (o.f.c) out = res.length + '\n';
      return { out: out, code: res.length ? 0 : 1 };
    },

    sort: function (args, stdin) {
      var o = opts(args), text = stdin;
      if (o.a.length) { text = this.readFile(o.a[0]); if (text == null) return { err: 'sort: cannot read: ' + o.a[0] + ': No such file or directory\n' }; }
      var l = lines(text || '').sort(); if (o.f.r) l.reverse();
      return { out: l.length ? l.join('\n') + '\n' : '' };
    },

    man: function (a) {
      if (!a[0]) return { err: 'What manual page do you want?\n' };
      var d = root.CHEATSHEET && root.CHEATSHEET.filter(function (x) { return x.cmd.split(' ')[0] === a[0]; })[0];
      if (!d) return { err: 'No manual entry for ' + a[0] + '\n' };
      return { out: a[0].toUpperCase() + '(1)\n\nMÔ TẢ\n    ' + d.desc + '\n\nVÍ DỤ\n    ' + d.ex + '\n\n(Đây là bản rút gọn. Trên máy thật hãy dùng: man ' + a[0] + ' hoặc ' + a[0] + ' --help)\n' };
    },

    help: function () {
      return { out: 'Lệnh hỗ trợ trong terminal giả lập:\n' +
        '  [File & thư mục] pwd  ls  cd  mkdir  rmdir  touch  cat  echo  cp  mv  rm  find  tar\n' +
        '  [Nội dung & lọc] head  tail  wc  grep  sort  (|  >  >>  &&  ||)\n' +
        '  [Quyền & hệ thống] chmod  whoami  id  sudo  df  du  free  ps  pgrep  systemctl  journalctl\n' +
        '  [Mạng & trợ giúp] ip  ping  date  uname  clear  man  help\n\n' +
        'Lưu ý: Đây là môi trường MÔ PHỎNG trong trình duyệt để luyện lệnh an toàn.\n' +
        'Khi cần chạy gói phần mềm thật (dnf/apt/ssh), hãy mở WSL2, Máy ảo hoặc Google Cloud Shell.\n' };
    }
  };

  function headTail(args, stdin, isHead) {
    var n = 10, rest = [], i;
    for (i = 0; i < args.length; i++) {
      if (args[i] === '-n' && args[i + 1]) { n = parseInt(args[i + 1], 10); i++; }
      else if (/^-\d+$/.test(args[i])) n = parseInt(args[i].slice(1), 10);
      else rest.push(args[i]);
    }
    var text = stdin;
    if (rest.length) { text = this.readFile(rest[0]); if (text == null) return { err: (isHead ? 'head' : 'tail') + ": cannot open '" + rest[0] + "' for reading: No such file or directory\n" }; }
    var l = lines(text || '');
    l = isHead ? l.slice(0, n) : l.slice(Math.max(0, l.length - n));
    return { out: l.length ? l.join('\n') + '\n' : '' };
  }

  // Tab completion: trả về danh sách gợi ý cho từ cuối cùng
  P.complete = function (line) {
    var m = /(\S*)$/.exec(line), word = m ? m[1] : '';
    var isFirst = line.trim() === word;
    var i = word.lastIndexOf('/'), dpart = i >= 0 ? word.slice(0, i + 1) : '', pre = i >= 0 ? word.slice(i + 1) : word;
    var cands = [];
    if (isFirst && !dpart) {
      cands = Object.keys(this.cmds).filter(function (c) { return c.indexOf(pre) === 0; });
    } else {
      var dn = this.get(this.abs(dpart || '.'));
      if (dn && dn.type === 'dir' && this.canRead(dn)) {
        cands = Object.keys(dn.children).filter(function (c) { return c.indexOf(pre) === 0 && (c[0] !== '.' || pre[0] === '.'); })
          .map(function (c) { return c + (dn.children[c].type === 'dir' ? '/' : ''); });
      }
    }
    return { prefix: line.slice(0, line.length - pre.length), pre: pre, cands: cands.sort() };
  };

  if (typeof module !== 'undefined' && module.exports) module.exports = Shell;
  else root.Shell = Shell;
})(typeof window !== 'undefined' ? window : globalThis);
