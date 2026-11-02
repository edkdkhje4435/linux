/* Terminal giả lập Linux (chạy hoàn toàn trên trình duyệt, KHÔNG đụng tới máy thật).
 * Hỗ trợ: pwd ls cd mkdir rmdir touch cat echo cp mv rm chmod head tail wc grep sort
 *         whoami id date uname clear help man  +  pipe (|)  +  redirect (> >>)  +  glob (*, ?)
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
      etc: dir({ hostname: file('linux-lab\n') }),
      tmp: dir({})
    });
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
      if (c === '|') { push(); toks.push({ t: 'op', v: '|' }); continue; }
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
  }

  Shell.defaultTree = defaultTree;
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
    if (!dn || dn.type !== 'dir') return [arg];
    var re = new RegExp('^' + pat.replace(/[.+^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*').replace(/\?/g, '.') + '$');
    var out = Object.keys(dn.children).sort().filter(function (n) {
      return re.test(n) && (n[0] !== '.' || pat[0] === '.');
    }).map(function (n) { return dpart + n; });
    return out.length ? out : [arg];
  };

  P.run = function (line) {
    line = line.trim();
    if (!line) return { out: '', err: '' };
    var tk = tokenize(line);
    if (tk.error) return { out: '', err: 'bash: ' + tk.error + '\n' };
    var toks = tk.toks, segs = [[]];
    toks.forEach(function (t) { if (t.t === 'op' && t.v === '|') segs.push([]); else segs[segs.length - 1].push(t); });
    var stdin = null, errAll = '', out = '';
    for (var s = 0; s < segs.length; s++) {
      var seg = segs[s], words = [], redir = null;
      for (var i = 0; i < seg.length; i++) {
        var t = seg[i];
        if (t.t === 'op') {
          var nxt = seg[i + 1];
          if (!nxt || nxt.t !== 'w') return { out: '', err: "bash: syntax error near unexpected token `newline'\n" };
          redir = { mode: t.v, path: nxt.v }; i++;
        } else if (t.quoted) { words.push(t.v); } else { Array.prototype.push.apply(words, this.glob(t.v)); }
      }
      if (!words.length) return { out: '', err: "bash: syntax error near unexpected token `|'\n" };
      var name = words[0], args = words.slice(1);
      var fn = this.cmds[name];
      var r;
      if (!fn) r = { out: '', err: name + ': command not found\n' };
      else r = fn.call(this, args, stdin) || { out: '' };
      errAll += r.err || '';
      out = r.out || '';
      if (r.clear) return { out: '', err: errAll, clear: true };
      if (redir) {
        var w = this.writeFile(redir.path, out, redir.mode === '>>');
        if (w) errAll += w;
        out = '';
      }
      stdin = out;
    }
    return { out: out, err: errAll };
  };

  P.writeFile = function (path, content, append) {
    var a = this.abs(path), sp = this.split(a), pd = this.get(sp.dir);
    if (!pd || pd.type !== 'dir') return 'bash: ' + path + ': No such file or directory\n';
    var ex = pd.children[sp.name];
    if (ex && ex.type === 'dir') return 'bash: ' + path + ': Is a directory\n';
    if (ex && !(ex.mode & 0o200)) return 'bash: ' + path + ': Permission denied\n';
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

  P.cmds = {
    pwd: function () { return { out: this.cwd + '\n' }; },
    whoami: function () { return { out: this.user + '\n' }; },
    id: function () { return { out: 'uid=1000(' + this.user + ') gid=1000(' + this.user + ') groups=1000(' + this.user + ')\n' }; },
    date: function () { return { out: 'Mon Nov  2 12:00:00 +07 2026\n' }; },
    uname: function (a) { return { out: a.indexOf('-a') >= 0 ? 'Linux linux-lab 6.1.0 #1 SMP x86_64 GNU/Linux\n' : 'Linux\n' }; },
    clear: function () { return { clear: true }; },
    echo: function (a) { return { out: a.join(' ') + '\n' }; },

    cd: function (a) {
      var target = a[0] || '~';
      if (target === '-') target = this.prev || '~';
      var ab = this.abs(target), n = this.get(ab);
      if (!n) return { err: 'bash: cd: ' + target + ': No such file or directory\n' };
      if (n.type !== 'dir') return { err: 'bash: cd: ' + target + ': Not a directory\n' };
      this.prev = this.cwd; this.cwd = ab; return {};
    },

    ls: function (args) {
      var o = opts(args), paths = o.a.length ? o.a : ['.'], out = '', err = '', self = this;
      function fmt(name, n) {
        if (!o.f.l) return name;
        var size = n.type === 'file' ? n.content.length : 4096;
        return modeStr(n) + ' 1 ' + self.user + ' ' + self.user + ' ' + String(size).padStart(5) + ' ' + NOW + ' ' + name;
      }
      paths.forEach(function (p, idx) {
        var n = self.get(self.abs(p));
        if (!n) { err += "ls: cannot access '" + p + "': No such file or directory\n"; return; }
        if (paths.length > 1 && n.type === 'dir') out += (idx ? '\n' : '') + p + ':\n';
        if (n.type === 'file') { out += fmt(p, n) + '\n'; return; }
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
        delete self.get(self.split(ab).dir).children[self.split(ab).name];
      });
      return { err: err };
    },

    touch: function (args) {
      var err = '', self = this;
      if (!args.length) return { err: 'touch: missing file operand\n' };
      args.forEach(function (p) {
        var ab = self.abs(p), sp = self.split(ab), pd = self.get(sp.dir);
        if (!pd || pd.type !== 'dir') { err += "touch: cannot touch '" + p + "': No such file or directory\n"; return; }
        if (!pd.children[sp.name]) pd.children[sp.name] = file('');
      });
      return { err: err };
    },

    cat: function (args, stdin) {
      if (!args.length) return { out: stdin == null ? '' : stdin };
      var out = '', err = '', self = this;
      args.forEach(function (p) {
        var n = self.get(self.abs(p));
        if (!n) err += 'cat: ' + p + ': No such file or directory\n';
        else if (n.type === 'dir') err += 'cat: ' + p + ': Is a directory\n';
        else if (!(n.mode & 0o400)) err += 'cat: ' + p + ': Permission denied\n';
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
        var sp = self.split(ab);
        delete self.get(sp.dir).children[sp.name];
        if (self.cwd === ab || self.cwd.indexOf(ab + '/') === 0) self.cwd = sp.dir;
      });
      return { err: err };
    },

    chmod: function (args) {
      if (args.length < 2) return { err: 'chmod: missing operand\n' };
      var spec = args[0], err = '', self = this;
      args.slice(1).forEach(function (p) {
        var n = self.get(self.abs(p));
        if (!n) { err += "chmod: cannot access '" + p + "': No such file or directory\n"; return; }
        if (/^[0-7]{3,4}$/.test(spec)) { n.mode = parseInt(spec, 8) & 0o777; return; }
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
        if (!ok) err += "chmod: invalid mode: '" + spec + "'\n";
      });
      return { err: err };
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
      return { out: out };
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
      return { out: 'Lệnh hỗ trợ trong terminal giả lập:\n  pwd  ls  cd  mkdir  rmdir  touch  cat  echo  cp  mv  rm\n  chmod  head  tail  wc  grep  sort  whoami  id  date  uname  clear  man\n\nMẹo: phím mũi tên Lên/Xuống gọi lại lệnh cũ, phím Tab tự điền tên.\nThử: echo xin chao > a.txt   rồi   cat a.txt | grep -i "xin"\n' };
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
      if (dn && dn.type === 'dir') {
        cands = Object.keys(dn.children).filter(function (c) { return c.indexOf(pre) === 0 && (c[0] !== '.' || pre[0] === '.'); })
          .map(function (c) { return c + (dn.children[c].type === 'dir' ? '/' : ''); });
      }
    }
    return { prefix: line.slice(0, line.length - pre.length), pre: pre, cands: cands.sort() };
  };

  if (typeof module !== 'undefined' && module.exports) module.exports = Shell;
  else root.Shell = Shell;
})(typeof window !== 'undefined' ? window : globalThis);
