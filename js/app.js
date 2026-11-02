/* Ứng dụng một trang (SPA) không cần build – chỉ cần HTML/CSS/JS tĩnh. */
(function () {
  'use strict';
  var $ = function (s, el) { return (el || document).querySelector(s); };
  var $$ = function (s, el) { return Array.prototype.slice.call((el || document).querySelectorAll(s)); };
  var view = $('#view'), sidebar = $('#sidebar');
  var LESSONS = window.LESSONS, CHALLENGES = window.CHALLENGES, CHEAT = window.CHEATSHEET, RES = window.RESOURCES;
  var READING = window.READING, PLAYBOOK = window.PLAYBOOK, FINAL = window.FINAL_CHECK, VIDEOS = window.VIDEOS;
  var lastSearchQuery = '';

  /* ---------- Tự sửa nhãn nút nếu HTML cũ bị lỗi mã hóa ---------- */
  if ($('#aiFab')) { $('#aiFab').textContent = '🤖 Hỏi AI'; $('#aiFab').title = 'Hỏi gia sư AI'; }
  if ($('#themeBtn')) { $('#themeBtn').textContent = '🌓'; $('#themeBtn').title = 'Đổi sáng/tối'; }
  if ($('#menuBtn')) { $('#menuBtn').textContent = '☰'; $('#menuBtn').title = 'Mở menu'; }

  /* ---------- Tiện ích ---------- */
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function stripHtml(html) { return String(html || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim(); }
  function load(k, d) { try { return JSON.parse(localStorage.getItem(k)) || d; } catch (e) { return d; } }
  var progress = load('lh_progress', {});
  function normProgress() {
    progress.lessons = progress.lessons || {}; progress.quiz = progress.quiz || {}; progress.practice = progress.practice || {};
    progress.reading = progress.reading || {}; progress.final = progress.final || {};
  }
  normProgress();
  function save() { localStorage.setItem('lh_progress', JSON.stringify(progress)); }
  function lessonById(id) { return LESSONS.filter(function (l) { return l.id === id; })[0]; }
  function chById(id) { return CHALLENGES.filter(function (c) { return c.id === id; })[0]; }
  function totalPct() {
    var done = LESSONS.filter(function (l) { return progress.lessons[l.id]; }).length + CHALLENGES.filter(function (c) { return progress.practice[c.id]; }).length;
    return Math.round(100 * done / (LESSONS.length + CHALLENGES.length));
  }

  /* ---------- Giao diện sáng/tối ---------- */
  function applyTheme(t) { document.documentElement.setAttribute('data-theme', t); localStorage.setItem('lh_theme', t); }
  applyTheme(localStorage.getItem('lh_theme') || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));
  $('#themeBtn').onclick = function () { applyTheme(document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'); };
  $('#menuBtn').onclick = function () { sidebar.classList.toggle('open'); };

  /* ---------- Sidebar ---------- */
  function renderSidebar(route) {
    var h = '<div style="padding:0 8px"><b>Tiến độ của bạn: ' + totalPct() + '%</b></div><div class="pbar"><i style="width:' + totalPct() + '%"></i></div>';
    h += '<form id="sbSearchForm" style="margin:10px 4px 4px"><input id="sbSearchInp" class="search" style="padding:6px 10px;font-size:.86rem" placeholder="🔍 Tìm bài, lệnh, lỗi…" value="' + esc(lastSearchQuery) + '"></form>';
    function link(href, text, tick) { return '<a href="' + href + '" class="' + (route === href ? 'active' : '') + '">' + text + (tick ? '<span class="tick">✓</span>' : '') + '</a>'; }
    h += '<h4>Bắt đầu</h4>' + link('#/', '🏠 Trang chủ') + link('#/mindset', '🧠 Cách học & tư duy') + link('#/search', '🔍 Tìm kiếm toàn trang');
    h += '<h4>Bài học</h4>';
    LESSONS.forEach(function (l, i) { h += link('#/lesson/' + l.id, (i + 1) + '. ' + esc(l.title.split(' (')[0]), progress.lessons[l.id]); });
    h += '<h4>Thực hành</h4>' + link('#/practice', '⌨️ Phòng luyện tập', CHALLENGES.every(function (c) { return progress.practice[c.id]; }));
    h += '<h4>Kỹ năng thực chiến</h4>' + link('#/reading', '👓 Phòng đọc code', READING.every(function (r) { return progress.reading[r.id]; })) + link('#/problems', '🧰 Cẩm nang xử lý sự cố') + link('#/final', '🎯 Checklist cuối khóa', FINAL.every(function (x, i) { return progress.final[i]; }));
    h += '<h4>Công cụ</h4>' + link('#/cheatsheet', '📖 Tra cứu lệnh') + link('#/videos', '🎬 Video đã kiểm tra') + link('#/resources', '🔗 Tài nguyên khác') + link('#/publish', '🚀 Đăng web & API AI') + link('#/own', '🛠️ Cấu trúc mã nguồn');
    sidebar.innerHTML = h;
    sidebar.classList.remove('open');
    var sForm = $('#sbSearchForm', sidebar), sInp = $('#sbSearchInp', sidebar);
    if (sForm && sInp) {
      sForm.onsubmit = function (e) {
        e.preventDefault();
        lastSearchQuery = sInp.value.trim();
        if (location.hash === '#/search') pageSearch();
        else location.hash = '#/search';
      };
    }
  }

  /* ---------- Terminal component ---------- */
  function mountTerminal(el, setup, onRun) {
    var sh, hist = [], hi = 0;
    el.innerHTML = '<div class="term"><div class="term-head"><i style="background:#ef4444"></i><i style="background:#f59e0b"></i><i style="background:#22c55e"></i>&nbsp;Terminal mô phỏng trong trình duyệt (an toàn – dùng WSL2/Máy ảo cho Linux thật)<span class="sp"></span><button type="button" data-act="reset">↺ Làm lại</button></div><div class="term-body"></div></div>';
    var body = $('.term-body', el);
    var line, input, promptEl;
    function reset() {
      var s = setup(); sh = new Shell(s.tree, { cwd: s.cwd, services: s.services }); hist = []; hi = 0; body.innerHTML = ''; line = null;
      print('Gõ <b>help</b> để xem lệnh hỗ trợ (hỗ trợ cả <code>&amp;&amp;</code>, <code>||</code>, <code>|</code>, <code>find</code>, <code>tar</code>, <code>systemctl</code>…). Dùng <b>Tab</b> tự điền, <b>↑</b>/<b>↓</b> gọi lại lệnh.', 'ln', true);
      newLine(); if (onRun) onRun(sh, hist, true);
    }
    function print(t, cls, html) {
      var d = document.createElement('div'); d.className = (cls || 'ln') + ' ln';
      if (html) d.innerHTML = t; else d.textContent = t;
      body.insertBefore(d, line || null);
    }
    function newLine() {
      line = document.createElement('div'); line.className = 'term-line';
      promptEl = document.createElement('span'); promptEl.className = 'pr'; promptEl.textContent = sh.prompt();
      input = document.createElement('input'); input.type = 'text'; input.spellcheck = false; input.autocomplete = 'off';
      input.setAttribute('autocapitalize', 'off'); input.setAttribute('aria-label', 'Nhập lệnh');
      line.appendChild(promptEl); line.appendChild(input); body.appendChild(line);
      input.addEventListener('keydown', onKey); body.scrollTop = body.scrollHeight;
    }
    function lcp(arr) { var p = arr[0]; arr.forEach(function (s) { while (s.indexOf(p) !== 0) p = p.slice(0, -1); }); return p; }
    function onKey(e) {
      if (e.key === 'Enter') {
        var cmd = input.value, pr = promptEl.textContent;
        line.remove(); line = null;
        print(pr + cmd, 'pr');
        if (cmd.trim()) { hist.push(cmd.trim()); }
        hi = hist.length;
        var t = cmd.trim();
        if (t === 'history') {
          print(hist.map(function (h, i) { return String(i + 1).padStart(4) + '  ' + h; }).join('\n'));
        } else {
          var r = sh.run(cmd);
          if (r.clear) body.innerHTML = '';
          if (r.out) { print(r.out.replace(/\n$/, '')); }
          if (r.err) { print(r.err.replace(/\n$/, ''), 'err'); }
        }
        newLine(); input.focus();
        if (onRun) onRun(sh, hist, false);
      } else if (e.key === 'ArrowUp') { e.preventDefault(); if (hi > 0) { hi--; input.value = hist[hi]; } }
      else if (e.key === 'ArrowDown') { e.preventDefault(); if (hi < hist.length - 1) { hi++; input.value = hist[hi]; } else { hi = hist.length; input.value = ''; } }
      else if (e.key === 'Tab') {
        e.preventDefault();
        var c = sh.complete(input.value);
        if (c.cands.length === 1) input.value = c.prefix + c.cands[0] + (/\/$/.test(c.cands[0]) ? '' : ' ');
        else if (c.cands.length > 1) {
          var common = lcp(c.cands);
          if (common.length > c.pre.length) input.value = c.prefix + common;
          else print(promptEl.textContent + input.value + '\n' + c.cands.join('  '));
        }
      } else if (e.key === 'l' && e.ctrlKey) { e.preventDefault(); body.innerHTML = ''; var v = input.value; line.remove(); newLine(); input.value = v; input.focus(); }
    }
    body.addEventListener('click', function () { if (input && !getSelection().toString()) input.focus(); });
    $('[data-act=reset]', el).onclick = reset;
    reset();
    return { reset: reset, shell: function () { return sh; }, history: function () { return hist; } };
  }

  /* ---------- Chung: nút sao chép cho <pre> ---------- */
  function enhance(root) {
    $$('pre', root).forEach(function (pre) {
      if ($('.copy-btn', pre)) return;
      var b = document.createElement('button'); b.className = 'copy-btn'; b.type = 'button'; b.textContent = 'Sao chép';
      b.onclick = function () {
        var code = $('code', pre); var text = (code || pre).innerText.replace(/Sao chép$|Đã chép$/, '').trimEnd();
        (navigator.clipboard ? navigator.clipboard.writeText(text) : Promise.reject()).then(function () { b.textContent = 'Đã chép'; setTimeout(function () { b.textContent = 'Sao chép'; }, 1200); }, function () { });
      };
      pre.appendChild(b);
    });
  }

  /* ---------- Hộp Sao lưu / Khôi phục tiến độ ---------- */
  function progressBackupBox() {
    return '<details class="card" style="margin-top:18px"><summary style="cursor:pointer;font-weight:700">💾 Sao lưu / Khôi phục tiến độ học tập (đổi máy hoặc trình duyệt)</summary>' +
      '<p style="margin:8px 0">Tiến độ của bạn được lưu cục bộ trên trình duyệt này. Sao chép mã dưới đây để cất giữ hoặc dán mã từ máy khác vào để khôi phục:</p>' +
      '<textarea id="progBox" class="search" rows="2" style="font-family:monospace;font-size:.82rem">' + esc(JSON.stringify(progress)) + '</textarea>' +
      '<div class="row"><button type="button" class="btn small" id="progCopyBtn">📋 Sao chép mã tiến độ</button>' +
      '<button type="button" class="btn small alt" id="progLoadBtn">📥 Khôi phục từ ô trên</button>' +
      '<button type="button" class="btn small alt" id="progResetBtn">🗑️ Xóa tiến độ</button>' +
      '<span id="progMsg" style="font-size:.88rem;color:var(--ok)"></span></div></details>';
  }
  function bindProgressBackup() {
    var box = $('#progBox'), msg = $('#progMsg');
    if (!box) return;
    $('#progCopyBtn').onclick = function () {
      box.value = JSON.stringify(progress);
      box.select();
      if (navigator.clipboard) navigator.clipboard.writeText(box.value);
      msg.textContent = '✓ Đã chép mã tiến độ!';
    };
    $('#progLoadBtn').onclick = function () {
      try {
        var obj = JSON.parse(box.value.trim());
        if (!obj || typeof obj !== 'object') throw new Error('Mã không hợp lệ');
        progress = obj; normProgress(); save();
        msg.textContent = '✓ Đã khôi phục tiến độ!';
        setTimeout(function () { route(); }, 400);
      } catch (e) {
        msg.style.color = 'var(--bad)';
        msg.textContent = '⚠️ Mã tiến độ không đúng định dạng JSON.';
      }
    };
    $('#progResetBtn').onclick = function () {
      if (!confirm('Bạn có chắc muốn xóa toàn bộ tiến độ học tập trên trình duyệt này?')) return;
      progress = {}; normProgress(); save(); route();
    };
  }

  /* ---------- Trang: Chủ ---------- */
  function pageHome() {
    var h = '<section class="hero"><h1>Học Linux từ con số 0 🐧</h1><p>Đọc – gõ lệnh thật – tự kiểm tra – hỏi gia sư AI. Học theo lộ trình rõ ràng, bằng tiếng Việt, trên một terminal mô phỏng an toàn ngay trong trình duyệt.</p><div class="term-demo">hocvien@linux-lab:~$ ls -l\nhocvien@linux-lab:~$ cd Documents &amp;&amp; cat baocao.txt\nhocvien@linux-lab:~/Documents$ <span style="opacity:.6">▌</span></div><div class="row" style="margin-top:18px"><a class="btn" href="#/lesson/' + LESSONS[0].id + '">Bắt đầu bài 1 →</a><a class="btn alt" style="color:#e2e8f0;border-color:#475569" href="#/practice">Vào phòng luyện tập</a><a class="btn alt" style="color:#e2e8f0;border-color:#475569" href="#/search">🔍 Tìm kiếm nhanh</a></div></section>';
    h += '<h3>Tiến độ: ' + totalPct() + '%</h3><div class="pbar" style="margin:0"><i style="width:' + totalPct() + '%"></i></div>';
    h += '<h3>Lộ trình học</h3><div class="grid">';
    LESSONS.forEach(function (l, i) {
      h += '<a class="card" href="#/lesson/' + l.id + '"><h4>' + (i + 1) + '. ' + esc(l.title) + '</h4><p>' + esc(l.summary) + '</p><p style="margin-top:8px"><span class="badge">' + l.level + '</span> ⏱ ' + l.minutes + ' phút ' + (progress.lessons[l.id] ? '<span class="done">✓ Xong</span>' : '') + '</p></a>';
    });
    h += '</div><h3>Trang web này có gì?</h3><div class="grid">' +
      '<div class="card"><h4>📚 Đọc hiểu</h4><p>8 bài từ khái niệm đến shell script, kèm 8 bài luyện đọc hiểu code & lệnh do AI sinh ra.</p></div>' +
      '<div class="card"><h4>⌨️ Terminal mô phỏng</h4><p>Gõ lệnh thật (ls, cd, chmod, grep, find, tar, df, du, ps, systemctl, &amp;&amp;, ||, |…) an toàn.</p></div>' +
      '<div class="card"><h4>✅ Tự kiểm tra</h4><p>Quiz cuối mỗi bài và 7 thử thách thực tế được chấm tự động theo trạng thái hệ thống.</p></div>' +
      '<div class="card"><h4>🤖 Gia sư AI (tùy chọn)</h4><p>Gợi ý thay vì đưa đáp án ngay; tự động chuyển đổi mô hình dự phòng khi quá tải.</p></div>' +
      '<div class="card"><h4>🧠 Tư duy & Xử lý sự cố</h4><p>Cách đọc lỗi, cẩm nang 7 sự cố thực tế (đầy đĩa, quyền thư mục, dịch vụ dừng…).</p></div>' +
      '<div class="card"><h4>🛠️ Bạn làm chủ</h4><p>Mã nguồn tĩnh, sao lưu tiến độ dễ dàng, đăng lên GitHub Pages của bạn.</p></div></div>';
    h += progressBackupBox();
    h += '<p style="color:var(--muted);font-size:.9rem;margin-top:16px">Nguồn tham khảo: <a href="https://thayduy.github.io/he-dieu-hanh-linux/" target="_blank" rel="noopener">Giáo trình Hệ điều hành Linux (CentOS)</a> – <a href="https://github.com/thayduy/he-dieu-hanh-linux" target="_blank" rel="noopener">GitHub</a>. Nội dung bài học trên trang này được viết lại bằng lời riêng.</p>';
    view.innerHTML = h;
    bindProgressBackup();
  }

  /* ---------- Trang: Tìm kiếm toàn trang ---------- */
  function pageSearch() {
    view.innerHTML = '<h1>🔍 Tìm kiếm toàn trang</h1><p>Tìm nhanh trong toàn bộ <b>bài học</b>, <b>bảng tra lệnh</b>, <b>thử thách thực hành</b>, <b>phòng đọc code</b> và <b>cẩm nang xử lý sự cố</b>.</p>' +
      '<input class="search" id="gSearchInp" placeholder="Nhập từ khóa (ví dụ: chmod, nginx, đầy đĩa, tar, quyền, ssh, grep…)" value="' + esc(lastSearchQuery) + '" autofocus>' +
      '<div id="gSearchOut" style="margin-top:16px"></div>';
    var inp = $('#gSearchInp'), out = $('#gSearchOut');
    function runSearch() {
      var q = inp.value.trim().toLowerCase();
      lastSearchQuery = inp.value.trim();
      var sbInp = $('#sbSearchInp', sidebar);
      if (sbInp && sbInp.value !== lastSearchQuery) sbInp.value = lastSearchQuery;
      if (!q) {
        out.innerHTML = '<div class="chips">' +
          ['chmod', 'Permission denied', 'nginx', 'tar', 'find', 'grep', 'ssh', 'systemctl', 'df -h'].map(function (kw) {
            return '<button type="button" class="chip kw-chip">' + esc(kw) + '</button>';
          }).join('') + '</div><p style="color:var(--muted)">Gõ từ khóa ở trên hoặc bấm vào một từ khóa gợi ý.</p>';
        $$('.kw-chip', out).forEach(function (b) { b.onclick = function () { inp.value = b.textContent; runSearch(); }; });
        return;
      }
      var sec = '';
      var mLessons = LESSONS.filter(function (l) { return (l.title + ' ' + l.summary + ' ' + stripHtml(l.body)).toLowerCase().indexOf(q) >= 0; });
      if (mLessons.length) {
        sec += '<h3>📚 Bài học (' + mLessons.length + ')</h3><div class="grid">' + mLessons.map(function (l) {
          return '<a class="card" href="#/lesson/' + l.id + '"><h4>' + esc(l.title) + '</h4><p>' + esc(l.summary) + '</p></a>';
        }).join('') + '</div>';
      }
      var mCheat = CHEAT.filter(function (c) { return (c.cmd + ' ' + c.desc + ' ' + c.ex + ' ' + c.g).toLowerCase().indexOf(q) >= 0; });
      if (mCheat.length) {
        sec += '<h3>📖 Lệnh tra cứu (' + mCheat.length + ')</h3><div class="grid">' + mCheat.map(function (c) {
          return '<div class="card cmd-card"><h4><code>' + esc(c.cmd) + '</code> <span class="badge">' + esc(c.g) + '</span></h4><p>' + esc(c.desc) + '</p><pre><code>' + esc(c.ex) + '</code></pre></div>';
        }).join('') + '</div>';
      }
      var mCh = CHALLENGES.filter(function (c) { return (c.title + ' ' + c.goal).toLowerCase().indexOf(q) >= 0; });
      if (mCh.length) {
        sec += '<h3>⌨️ Thử thách thực hành (' + mCh.length + ')</h3><div class="grid">' + mCh.map(function (c) {
          return '<a class="card" href="#/practice/' + c.id + '"><h4>' + esc(c.title) + '</h4><p>' + esc(c.goal) + '</p></a>';
        }).join('') + '</div>';
      }
      var mRead = READING.filter(function (r) { return (r.title + ' ' + r.what + ' ' + r.code).toLowerCase().indexOf(q) >= 0; });
      if (mRead.length) {
        sec += '<h3>👓 Phòng đọc code (' + mRead.length + ')</h3><div class="grid">' + mRead.map(function (r) {
          return '<a class="card" href="#/reading/' + r.id + '"><h4>' + esc(r.title) + '</h4><p>' + esc(r.what) + '</p></a>';
        }).join('') + '</div>';
      }
      var mProb = PLAYBOOK.filter(function (p) { return (p.title + ' ' + p.sign + ' ' + p.note + ' ' + p.steps.map(function (s) { return s.join(' '); }).join(' ')).toLowerCase().indexOf(q) >= 0; });
      if (mProb.length) {
        sec += '<h3>🧰 Cẩm nang sự cố (' + mProb.length + ')</h3><div class="grid">' + mProb.map(function (p) {
          return '<a class="card" href="#/problems"><h4>' + p.icon + ' ' + esc(p.title) + '</h4><p>' + esc(p.sign) + '</p></a>';
        }).join('') + '</div>';
      }
      out.innerHTML = sec || '<p>Không tìm thấy nội dung khớp với "<b>' + esc(lastSearchQuery) + '</b>". Hãy thử từ khóa ngắn hơn hoặc hỏi Gia sư AI ở góc phải dưới.</p>';
      enhance(out);
    }
    inp.oninput = runSearch;
    runSearch();
  }

  /* ---------- Trang: Bài học ---------- */
  var sandboxes = {
    't-quyen': function () {
      var t = Shell.defaultTree();
      t.children.home.children.hocvien.children['script.sh'] = Shell.file('#!/bin/bash\necho hi\n');
      t.children.home.children.hocvien.children['bimat.txt'] = Shell.file('bi mat\n');
      t.children.home.children.hocvien.children['ho-so'] = Shell.dir({ 'luong.txt': Shell.file('1000\n') }, 0);
      return { tree: t, cwd: '/home/hocvien' };
    },
    't-vanhanh': function () {
      var sv = Shell.defaultServices();
      sv.nginx.active = false;
      return { tree: Shell.defaultTree(), cwd: '/home/hocvien', services: sv };
    }
  };
  function defaultSetup() { return { tree: Shell.defaultTree(), cwd: '/home/hocvien' }; }

  function pageLesson(id) {
    var idx = LESSONS.map(function (l) { return l.id; }).indexOf(id), L = LESSONS[idx];
    if (!L) return page404();
    var h = '<h1>' + (idx + 1) + '. ' + esc(L.title) + '</h1><div class="meta"><span class="badge">' + L.level + '</span><span>⏱ ~' + L.minutes + ' phút</span><span>📖 Tham chiếu giáo trình: ' + esc(L.src) + '</span></div>';
    h += L.body;
    if (L.practice) { var ch = chById(L.practice); if (ch) h += '<div class="success" style="background:var(--tip-bg);border-color:var(--tip-line)">🎯 <b>Thử thách liên quan:</b> <a href="#/practice/' + ch.id + '">' + esc(ch.title) + '</a>' + (progress.practice[ch.id] ? ' ✓' : '') + '</div>'; }
    h += '<section class="quiz"><h3 style="border:0">📝 Kiểm tra nhanh</h3>';
    L.quiz.forEach(function (q, qi) {
      h += '<div class="qitem" data-q="' + qi + '"><b>' + (qi + 1) + '. ' + esc(q.q) + '</b>';
      q.o.forEach(function (o, oi) { h += '<label><input type="radio" name="q' + qi + '" value="' + oi + '"> ' + esc(o) + '</label>'; });
      h += '<div class="why" hidden></div></div>';
    });
    h += '<div class="row"><button class="btn" id="gradeBtn" type="button">Chấm điểm</button><span id="score">' + (progress.quiz[L.id] != null ? 'Điểm gần nhất: ' + progress.quiz[L.id] + '/' + L.quiz.length : '') + '</span></div></section>';
    var vids = VIDEOS.filter(function (v) { return v.lessons.indexOf(L.id) >= 0; });
    if (vids.length) h += '<h3>🎬 Video gợi ý cho bài này</h3><div class="grid">' + videoCards(vids) + '</div>';
    h += '<div class="row" style="margin-top:20px"><button class="btn ' + (progress.lessons[L.id] ? 'alt' : '') + '" id="doneBtn" type="button">' + (progress.lessons[L.id] ? '✓ Đã hoàn thành (bấm để bỏ)' : 'Đánh dấu đã học xong') + '</button><button class="btn alt" id="askBtn" type="button">🤖 Hỏi AI về bài này</button></div>';
    h += '<div class="pager">' + (idx > 0 ? '<a class="btn alt" href="#/lesson/' + LESSONS[idx - 1].id + '">← ' + esc(LESSONS[idx - 1].title.split(' (')[0]) + '</a>' : '<span></span>') + (idx < LESSONS.length - 1 ? '<a class="btn" href="#/lesson/' + LESSONS[idx + 1].id + '">' + esc(LESSONS[idx + 1].title.split(' (')[0]) + ' →</a>' : '<a class="btn" href="#/practice">Sang phòng luyện tập →</a>') + '</div>';
    view.innerHTML = h;
    $$('.mini-term').forEach(function (el) { mountTerminal(el, sandboxes[el.getAttribute('data-id')] || defaultSetup); });
    $('#gradeBtn').onclick = function () {
      var ok = 0;
      L.quiz.forEach(function (q, qi) {
        var box = $('[data-q="' + qi + '"]'), sel = $('input[name=q' + qi + ']:checked', box), why = $('.why', box);
        $$('label', box).forEach(function (l) { l.classList.remove('sel'); });
        box.classList.remove('right', 'wrong');
        if (!sel) { why.hidden = false; why.textContent = 'Bạn chưa chọn đáp án.'; return; }
        sel.parentElement.classList.add('sel');
        var right = +sel.value === q.a; if (right) ok++;
        box.classList.add(right ? 'right' : 'wrong');
        why.hidden = false; why.innerHTML = (right ? '✅ Đúng. ' : '❌ Chưa đúng – đáp án: <b>' + esc(q.o[q.a]) + '</b>. ') + esc(q.why);
      });
      progress.quiz[L.id] = ok; save();
      $('#score').textContent = 'Điểm: ' + ok + '/' + L.quiz.length + (ok === L.quiz.length ? ' 🎉 Tuyệt vời!' : ' – xem lại phần giải thích rồi thử lại nhé.');
      if (ok === L.quiz.length && !progress.lessons[L.id]) { progress.lessons[L.id] = true; save(); renderSidebar(location.hash.slice(1) ? '#' + location.hash.slice(1) : '#/'); $('#doneBtn').textContent = '✓ Đã hoàn thành (bấm để bỏ)'; $('#doneBtn').classList.add('alt'); }
    };
    $('#doneBtn').onclick = function () { progress.lessons[L.id] = !progress.lessons[L.id]; save(); route(); };
    $('#askBtn').onclick = function () { openAI('Mình đang học bài "' + L.title + '". Hãy kiểm tra mình bằng 2 câu hỏi ngắn, không đưa đáp án ngay.'); };
  }

  /* ---------- Trang: Luyện tập ---------- */
  function pagePractice(id) {
    if (!id) {
      var h = '<h1>⌨️ Phòng luyện tập</h1><p>Mỗi thử thách có một mục tiêu cụ thể. Bạn tự gõ lệnh trong terminal mô phỏng; hệ thống <b>kiểm tra kết quả thực tế</b> (file có tồn tại không, quyền đúng chưa, dịch vụ đã chạy chưa…) chứ không bắt bạn gõ đúng một đáp án duy nhất – có nhiều cách để giải!</p><div class="grid">';
      CHALLENGES.forEach(function (c) { h += '<a class="card" href="#/practice/' + c.id + '"><h4>' + esc(c.title) + (progress.practice[c.id] ? ' <span class="done">✓</span>' : '') + '</h4><p>' + esc(c.goal.slice(0, 115)) + '…</p><p style="margin-top:8px"><span class="badge">' + c.level + '</span></p></a>'; });
      h += '</div><h3>Terminal tự do</h3><p>Gõ thử thoải mái (thử <code>help</code>, <code>df -h</code>, <code>ps aux</code>, <code>systemctl status nginx</code>, <code>find . -name "*.txt"</code>…):</p><div class="mini-term" data-free="1"></div>';
      view.innerHTML = h; mountTerminal($('.mini-term'), defaultSetup); return;
    }
    var C = chById(id); if (!C) return page404();
    var idx = CHALLENGES.indexOf(C), shown = 0;
    view.innerHTML = '<p><a href="#/practice">← Tất cả thử thách</a></p><h1>' + esc(C.title) + '</h1><div class="meta"><span class="badge">' + C.level + '</span><a href="#/lesson/' + C.lesson + '">📖 Xem lại bài học liên quan</a></div>' +
      '<div class="card"><b>🎯 Mục tiêu</b><p style="color:var(--text);margin-top:6px">' + esc(C.goal) + '</p><ul class="task-list" id="tasks"></ul></div>' +
      '<div class="mini-term"></div><div class="row"><button class="btn" id="checkBtn" type="button">Kiểm tra</button><button class="btn alt" id="hintBtn" type="button">💡 Gợi ý</button><button class="btn alt" id="aiBtn" type="button">🤖 Hỏi AI</button></div><div id="hints"></div><div id="result"></div>';
    var term;
    function evaluate(announce, sh, hist) {
      var allOk = true, ul = $('#tasks');
      ul.innerHTML = C.tasks.map(function (t) { var ok = false; try { ok = !!t.c(sh, hist); } catch (e) { } if (!ok) allOk = false; return '<li class="' + (ok ? 'ok' : '') + '"><span class="st">' + (ok ? '✓' : '') + '</span><span>' + esc(t.t) + '</span></li>'; }).join('');
      var res = $('#result');
      if (allOk && hist.length) {
        if (!progress.practice[C.id]) { progress.practice[C.id] = true; save(); renderSidebar('#/practice'); }
        var nx = CHALLENGES[idx + 1];
        res.innerHTML = '<div class="success">🎉 <b>Hoàn thành!</b> Bạn đã đạt mọi mục tiêu. Hãy tự hỏi: <i>có cách làm nào khác không? Lệnh nào nguy hiểm nhất trong bài này?</i><div class="row">' + (nx ? '<a class="btn small" href="#/practice/' + nx.id + '">Thử thách tiếp theo →</a>' : '<a class="btn small" href="#/practice">Về danh sách</a>') + '</div></div>';
      } else { res.innerHTML = announce ? '<div class="hint-box">Chưa đạt hết mục tiêu. Đọc lại các mục ở trên, và đọc kỹ thông báo lỗi (nếu có) trong terminal nhé.</div>' : ''; }
    }
    term = mountTerminal($('.mini-term'), C.setup, function (sh, hist, isReset) { if (isReset) { $('#result').innerHTML = ''; } evaluate(false, sh, hist); });
    $('#checkBtn').onclick = function () { evaluate(true, term.shell(), term.history()); };
    $('#hintBtn').onclick = function () {
      if (shown < C.hints.length) { shown++; var d = document.createElement('div'); d.className = 'hint-box'; d.innerHTML = '<b>Gợi ý ' + shown + '/' + C.hints.length + (shown === C.hints.length ? ' (đáp án)' : '') + ':</b> ' + esc(C.hints[shown - 1]); $('#hints').appendChild(d); }
    };
    $('#aiBtn').onclick = function () { openAI('Mình đang làm thử thách "' + C.title + '": ' + C.goal + ' Mình bị kẹt – hãy gợi ý hướng suy nghĩ, đừng đưa đáp án ngay.'); };
  }

  /* ---------- Trang: Tra lệnh ---------- */
  function pageCheat() {
    var groups = ['Tất cả'].concat(CHEAT.map(function (c) { return c.g; }).filter(function (g, i, a) { return a.indexOf(g) === i; }));
    view.innerHTML = '<h1>📖 Tra cứu lệnh</h1><p>Gõ tên lệnh hoặc từ khóa tiếng Việt (ví dụ: <i>xóa</i>, <i>quyền</i>, <i>mạng</i>, <i>nén</i>, <i>dung lượng</i>).</p><input class="search" id="q" placeholder="Tìm lệnh…" autofocus><div class="chips" id="chips"></div><div class="grid" id="list"></div>';
    var cur = 'Tất cả';
    function draw() {
      var q = $('#q').value.toLowerCase().trim();
      $('#chips').innerHTML = groups.map(function (g) { return '<button type="button" class="chip ' + (g === cur ? 'on' : '') + '" data-g="' + esc(g) + '">' + esc(g) + '</button>'; }).join('');
      $$('.chip').forEach(function (b) { b.onclick = function () { cur = b.getAttribute('data-g'); draw(); }; });
      var list = CHEAT.filter(function (c) { return (cur === 'Tất cả' || c.g === cur) && (!q || (c.cmd + ' ' + c.desc + ' ' + c.ex).toLowerCase().indexOf(q) >= 0); });
      $('#list').innerHTML = list.length ? list.map(function (c) { return '<div class="card cmd-card"><h4><code>' + esc(c.cmd) + '</code> <span class="badge">' + esc(c.g) + '</span></h4><p>' + esc(c.desc) + '</p><pre><code>' + esc(c.ex) + '</code></pre></div>'; }).join('') : '<p>Không có lệnh phù hợp. Thử <a href="#/search">Tìm kiếm toàn trang</a> hoặc hỏi gia sư AI nhé!</p>';
      enhance($('#list'));
    }
    $('#q').oninput = draw; draw();
  }

  /* ---------- Trang: Tư duy học ---------- */
  function pageMindset() {
    view.innerHTML = '<h1>🧠 Cách học & tư duy</h1>' +
      '<p>Linux không khó vì lệnh nhiều, mà khó vì người học thường <b>đọc nhiều – gõ ít</b>. Hãy dùng quy trình dưới đây.</p>' +
      '<h3>1. Vòng học 4 bước (cho mỗi bài)</h3><div class="grid"><div class="card"><h4>① Đọc</h4><p>Đọc lý thuyết trước, không nhảy ngay vào bài tập.</p></div><div class="card"><h4>② Gõ lại</h4><p>Tự gõ từng ví dụ vào terminal. Đọc 10 lần không bằng gõ 1 lần.</p></div><div class="card"><h4>③ Kiểm tra</h4><p>Làm quiz, rồi thử thách. Chưa đạt thì chưa sang bài mới.</p></div><div class="card"><h4>④ Ghi nhật ký</h4><p>Ghi lệnh – kết quả – lỗi gặp phải – cách sửa.</p></div></div>' +
      '<h3>2. Cách đọc lỗi (3 bước)</h3><ol><li><b>Đọc nguyên văn</b> – lỗi nằm ở chữ cuối: <code>No such file or directory</code>, <code>Permission denied</code>, <code>command not found</code>.</li><li><b>Tự đoán nguyên nhân</b> trước khi hỏi ai: sai tên? sai chỗ đứng (<code>pwd</code>)? thiếu quyền (<code>ls -l</code>)? thiếu <code>sudo</code>?</li><li><b>Thử một thay đổi nhỏ</b> rồi chạy lại. Mỗi lần chỉ đổi một thứ.</li></ol>' +
      '<table><tr><th>Thông báo</th><th>Thường là…</th><th>Kiểm tra bằng</th></tr><tr><td><code>command not found</code></td><td>Gõ sai hoặc chưa cài</td><td><code>type tenlenh</code>, <code>dnf search</code></td></tr><tr><td><code>No such file or directory</code></td><td>Sai đường dẫn / chỗ đứng</td><td><code>pwd</code>, <code>ls</code></td></tr><tr><td><code>Permission denied</code></td><td>Thiếu quyền (file hoặc quyền <code>x</code> trên thư mục)</td><td><code>ls -ld</code>, <code>ls -l</code>, <code>id</code>, <code>sudo</code></td></tr><tr><td><code>Is a directory</code></td><td>Dùng lệnh file cho thư mục</td><td>thêm <code>-r</code> hoặc đổi lệnh</td></tr></table>' +
      '<h3>3. Dùng AI để học, không phải để chép</h3><ul><li><b>Tự đoán trước</b> rồi mới hỏi: "Mình nghĩ lệnh này làm X, đúng không?".</li><li>Hỏi <b>"vì sao"</b> và <b>"nếu đổi thành… thì sao?"</b> thay vì chỉ "cho mình đáp án".</li><li>Nhờ AI ra đề kiểm tra mình, hoặc giải thích lỗi: dán <b>nguyên văn</b> lệnh + thông báo lỗi.</li><li><b>Không chạy lệnh bạn chưa hiểu</b> trên máy thật – dù AI hay ai đó bảo bạn chạy. Thử trong máy ảo/terminal mô phỏng trước.</li></ul>' +
      '<pre><code>Mẫu câu hỏi tốt:\n"Mình chạy: cp a.txt /etc/\nLỗi: cp: cannot create regular file \'/etc/a.txt\': Permission denied\nMình đoán là thiếu quyền nhưng chưa rõ vì sao /etc cần quyền đặc biệt. Gợi ý giúp mình hướng kiểm tra nhé."</code></pre>' +
      '<h3>4. Quy tắc an toàn</h3><div class="warn"><ul style="margin:0"><li>Học trên tài khoản thường + <code>sudo</code>, không dùng root.</li><li>Máy ảo: chụp <b>snapshot</b> trước khi thử thí nghiệm phá hoại.</li><li>Trước <code>rm</code>, <code>chmod -R</code>, <code>chown -R</code>: chạy <code>pwd</code> và <code>ls</code> kiểm tra.</li><li>Không chạy lệnh dạng <code>curl … | sudo bash</code> từ nguồn không rõ.</li></ul></div>' +
      '<h3>5. Mẫu nhật ký lab</h3><pre><code># ~/linux-lab/nhatky.md\n## 2026-11-02 – Bài: phân quyền\n- Lệnh: chmod 600 bimat.txt\n- Kết quả: ls -l hiện -rw-------\n- Lỗi gặp: Permission denied khi đọc bằng user khác → ĐÚNG như mong đợi\n- Học được: 6=rw-, 0=---, nên chỉ chủ sở hữu đọc/ghi</code></pre>' +
      '<h3>6. Lộ trình gợi ý (8–10 tuần, theo giáo trình gốc)</h3><table><tr><th>Giai đoạn</th><th>Nội dung</th><th>"Cổng" để qua</th></tr><tr><td>A. Zero (tuần 1–2)</td><td>Bài 1–3</td><td>Tự mkdir/cp/find trong home; giải thích được "/" và "~"</td></tr><tr><td>B. Admin nền (tuần 3–5)</td><td>Bài 4–7</td><td>Tạo user, phân quyền thư mục nhóm, SSH bằng khóa, cài gói, bật dịch vụ</td></tr><tr><td>C. Tự động hóa (tuần 6–7)</td><td>Bài 8</td><td>1 script chạy bằng cron, ghi log</td></tr><tr><td>D. Dự án cuối khóa</td><td>Tổng hợp</td><td>Máy chủ "portal": IP/hostname, user+nhóm, SSH khóa, nginx, firewall, script giám sát</td></tr></table>';
    enhance(view);
  }

  /* ---------- Trang: Tài nguyên ---------- */
  function pageResources() {
    var h = '<h1>🔗 Tài nguyên (YouTube, GitHub, Google…)</h1><p>Các đường dẫn do mình tuyển chọn. Một số là link tìm kiếm (luôn dùng được). Nếu thấy link nào hỏng hãy sửa trong <code>js/data.js</code>.</p>';
    RES.forEach(function (g) {
      h += '<h3>' + esc(g.g) + '</h3><div class="grid">';
      g.items.forEach(function (i) { h += '<a class="card" href="' + esc(i.u) + '" target="_blank" rel="noopener"><h4>' + esc(i.t) + ' ↗</h4><p>' + esc(i.d) + '</p></a>'; });
      h += '</div>';
    });
    view.innerHTML = h;
  }

  /* ---------- Trang: Làm chủ ---------- */
  function pageOwn() {
    view.innerHTML = '<h1>🛠️ Làm chủ trang web này</h1><p>Toàn bộ trang chỉ là file tĩnh (HTML/CSS/JS) – <b>không có máy chủ, không khóa nhà cung cấp, không phí</b>. Bạn là chủ sở hữu mã nguồn và quyết định mọi thứ.</p>' +
      '<h3>Cấu trúc thư mục</h3><pre><code>linux-hoc-vien/\n├── index.html          khung trang\n├── css/style.css       giao diện\n└── js/\n    ├── lessons.js      ← NỘI DUNG BÀI HỌC (sửa/thêm bài ở đây)\n    ├── data.js         ← bảng tra lệnh, thử thách, tài nguyên\n    ├── reading.js      ← phòng đọc code, cẩm nang sự cố, checklist\n    ├── shell.js        bộ máy terminal mô phỏng\n    ├── ai.js           trợ lý AI (Gemini tự động dự phòng model)\n    └── app.js          điều hướng, tìm kiếm, giao diện</code></pre>' +
      '<h3>Thêm một bài học mới</h3><p>Mở <code>js/lessons.js</code>, thêm một đối tượng vào mảng <code>LESSONS</code>: <code>id</code>, <code>title</code>, <code>body</code> (HTML), <code>quiz</code>. Lưu file, tải lại trang là thấy.</p>' +
      '<h3>Đăng web miễn phí (chọn 1)</h3><ol><li><b>GitHub Pages</b> (dễ nhất): tạo repo trên GitHub → upload các file → Settings → Pages → chọn nhánh <code>main</code>, thư mục <code>/ (root)</code>. Địa chỉ: <code>https://TEN-BAN.github.io/TEN-REPO/</code>.</li><li><b>Firebase Hosting</b> (của Google): cài Node.js → <code>npm i -g firebase-tools</code> → <code>firebase login</code> → <code>firebase init hosting</code> (thư mục public: <code>.</code>) → <code>firebase deploy</code>.</li><li><b>Google Sites:</b> không nhận upload JS tùy ý, nhưng bạn có thể nhúng trang đã đăng ở trên bằng <i>Insert → Embed → By URL</i>.</li></ol>' +
      '<h3>Bật trợ lý AI</h3><ol><li>Vào <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener">Google AI Studio</a> tạo API key (có mức miễn phí).</li><li>Bấm nút <b>🤖 Hỏi AI</b> → ⚙️ → dán key. Key chỉ lưu trong trình duyệt của bạn.</li><li><b>Quan trọng:</b> nếu đăng web công khai, hãy vào Google Cloud Console giới hạn key chỉ cho domain của bạn (HTTP referrer) và đặt hạn mức; <u>không</u> nhúng sẵn key của bạn vào mã nguồn.</li></ol>' +
      '<h3>Giấy phép nội dung</h3><p>Nội dung bài học viết lại từ cấu trúc giáo trình gốc của thầy Duy. Nếu bạn công bố rộng rãi, nên ghi nguồn và (tốt nhất) xin phép tác giả. Bạn có thể thay bằng nội dung của riêng mình bất cứ lúc nào.</p>';
    enhance(view);
  }

  /* ---------- Video ---------- */
  function videoCards(list) {
    return list.map(function (v) {
      return '<a class="card vid" href="https://www.youtube.com/watch?v=' + v.id + '" target="_blank" rel="noopener"><img loading="lazy" alt="" src="https://i.ytimg.com/vi/' + v.id + '/mqdefault.jpg"><h4>' + esc(v.t) + '</h4><p><b>' + esc(v.a) + '</b> · ⏱ ' + v.m + ' phút · ' + v.y + ' · 👁 ' + esc(v.v) + '</p><p style="margin-top:6px">💡 ' + esc(v.why) + '</p></a>';
    }).join('');
  }
  function pageVideos() {
    var h = '<h1>🎬 Video đã kiểm tra</h1><div class="tip"><b>Mình đã kiểm tra gì?</b> Với từng video: còn tồn tại, cho phép nhúng, kênh nào, thời lượng, lượt xem, năm đăng (kiểm ngày 02/11/2026). <b>Mình không xem hết nội dung</b> từng video – hãy xem thử vài phút đầu; video nào khó hiểu thì bỏ, và nhớ lệnh/giao diện có thể khác chút theo thời gian. Danh sách ở <code>js/videos.js</code>, bạn thêm/bớt tùy ý.</div>';
    h += '<p><b>Cách xem hiệu quả:</b> xem 10–15 phút → tạm dừng → <b>tự gõ lại</b> các lệnh trong Phòng luyện tập → xem tiếp. Đừng xem một mạch hàng giờ rồi không gõ gì.</p>';
    var groups = VIDEOS.map(function (v) { return v.g; }).filter(function (g, i, a) { return a.indexOf(g) === i; });
    groups.forEach(function (g) { h += '<h3>' + esc(g) + '</h3><div class="grid">' + videoCards(VIDEOS.filter(function (v) { return v.g === g; })) + '</div>'; });
    view.innerHTML = h;
  }

  /* ---------- Phòng đọc code ---------- */
  function pageReading(id) {
    if (!id) {
      var h = '<h1>👓 Phòng đọc code</h1><p>Mục tiêu: <b>đọc một đoạn script/lệnh (kể cả lệnh do AI sinh ra) và nói được "nó làm gì, có an toàn không"</b> – kỹ năng quan trọng hơn tự viết từ đầu. Với mỗi đoạn: (1) tự đọc và đoán, (2) xem giải thích từng dòng, (3) trả lời câu dự đoán, (4) tự diễn đạt bằng lời của bạn (có thể nhờ AI nhận xét).</p><div class="grid">';
      READING.forEach(function (r) { h += '<a class="card" href="#/reading/' + r.id + '"><h4>' + esc(r.title) + (progress.reading[r.id] ? ' <span class="done">✓</span>' : '') + '</h4><p>' + esc(r.what) + '</p><p style="margin-top:8px"><span class="badge">' + r.level + '</span></p></a>'; });
      view.innerHTML = h + '</div>'; return;
    }
    var R = READING.filter(function (r) { return r.id === id; })[0]; if (!R) return page404();
    var idx = READING.indexOf(R);
    var h2 = '<p><a href="#/reading">← Tất cả đoạn code</a></p><h1>' + esc(R.title) + '</h1><div class="meta"><span class="badge">' + R.level + '</span><a href="#/lesson/' + R.lesson + '">📖 Bài liên quan</a></div>' +
      '<h3>Bước 1 – Tự đọc và đoán</h3><p>Hãy đọc kỹ đoạn dưới đây. <b>Chưa xem giải thích</b>; hãy tự hỏi: "Nó nhận vào gì? Nó làm gì? Nó tạo ra gì?"</p><pre><code>' + esc(R.code) + '</code></pre>' +
      '<div class="row"><button class="btn alt" id="rvBtn" type="button">Bước 2 – Xem giải thích từng dòng</button></div><div id="rvBox" hidden><table><tr><th style="width:42%">Đoạn code</th><th>Ý nghĩa</th></tr>' + R.steps.map(function (s) { return '<tr><td><code>' + esc(s[0]) + '</code></td><td>' + esc(s[1]) + '</td></tr>'; }).join('') + '</table><div class="tip"><b>Tóm tắt:</b> ' + esc(R.what) + '</div></div>' +
      '<h3>Bước 3 – Câu dự đoán</h3><div class="qitem" id="rq"><b>' + esc(R.q.q) + '</b>' + R.q.o.map(function (o, i) { return '<label><input type="radio" name="rq" value="' + i + '"> ' + esc(o) + '</label>'; }).join('') + '<div class="why" hidden></div></div><div class="row"><button class="btn" id="rqBtn" type="button">Kiểm tra</button></div>' +
      '<h3>Bước 4 – Tự diễn đạt</h3><p>Viết 1–2 câu bằng lời của bạn: đoạn này làm gì? (Không cần đúng thuật ngữ, chỉ cần đúng ý.)</p><textarea id="myExp" class="search" rows="3" placeholder="Ví dụ: Script này nhận một tên rồi chào lại, nếu không có tên thì nhắc cách dùng…"></textarea><div class="row"><button class="btn alt" id="aiRv" type="button">🤖 Nhờ AI nhận xét cách hiểu của mình</button></div>' +
      '<div class="pager">' + (idx > 0 ? '<a class="btn alt" href="#/reading/' + READING[idx - 1].id + '">← Đoạn trước</a>' : '<span></span>') + (idx < READING.length - 1 ? '<a class="btn" href="#/reading/' + READING[idx + 1].id + '">Đoạn tiếp →</a>' : '<a class="btn" href="#/problems">Sang Cẩm nang sự cố →</a>') + '</div>';
    view.innerHTML = h2;
    $('#rvBtn').onclick = function () { $('#rvBox').hidden = false; this.hidden = true; };
    $('#rqBtn').onclick = function () {
      var sel = $('input[name=rq]:checked'), box = $('#rq'), why = $('.why', box);
      if (!sel) { why.hidden = false; why.textContent = 'Bạn chưa chọn đáp án.'; return; }
      var right = +sel.value === R.q.a; box.classList.remove('right', 'wrong'); $$('label', box).forEach(function (l) { l.classList.remove('sel'); }); sel.parentElement.classList.add('sel'); box.classList.add(right ? 'right' : 'wrong');
      why.hidden = false; why.innerHTML = (right ? '✅ Đúng. ' : '❌ Chưa đúng – đáp án: <b>' + esc(R.q.o[R.q.a]) + '</b>. ') + esc(R.q.why);
      if (right && !progress.reading[R.id]) { progress.reading[R.id] = true; save(); renderSidebar('#/reading'); }
    };
    $('#aiRv').onclick = function () {
      var mine = $('#myExp').value.trim();
      openAI('Mình đang tập đọc code. Đoạn code:\n' + R.code + '\n\nMình hiểu là: ' + (mine || '(chưa viết)') + '\n\nHãy nhận xét cách hiểu của mình đúng/sai chỗ nào, và hỏi lại 1 câu để mình nghĩ sâu hơn. Đừng chép lại toàn bộ giải thích.');
    };
    enhance(view);
  }

  /* ---------- Cẩm nang sự cố ---------- */
  function pageProblems() {
    var h = '<h1>🧰 Cẩm nang xử lý sự cố cơ bản</h1><p>Mỗi sự cố theo một quy trình: <b>triệu chứng → kiểm tra → hiểu nguyên nhân → sửa → kiểm tra lại</b>. Hãy <b>tự đoán</b> bước tiếp theo trước khi mở từng mục. Nhiều lệnh chẩn đoán (<code>df -h</code>, <code>du -sh</code>, <code>ps aux</code>, <code>systemctl status</code>, <code>journalctl -u</code>) đã có thể gõ thử ngay trong <a href="#/practice">Phòng luyện tập</a>.</p>';
    PLAYBOOK.forEach(function (p) {
      h += '<details class="card" style="margin:10px 0"><summary style="cursor:pointer;font-weight:700">' + p.icon + ' ' + esc(p.title) + '</summary><p style="margin:10px 0"><b>Triệu chứng:</b> ' + esc(p.sign) + '</p><table><tr><th style="width:44%">Lệnh</th><th>Vì sao chạy lệnh này?</th></tr>' + p.steps.map(function (s) { return '<tr><td><code>' + esc(s[0]) + '</code></td><td>' + esc(s[1]) + '</td></tr>'; }).join('') + '</table><div class="warn" style="margin-bottom:0">⚠️ ' + esc(p.note) + '</div></details>';
    });
    h += '<div class="row"><button class="btn alt" id="aiProb" type="button">🤖 Cho mình một tình huống giả định để tập chẩn đoán</button></div>';
    view.innerHTML = h;
    $('#aiProb').onclick = function () { openAI('Hãy đóng vai máy chủ Linux gặp một sự cố cơ bản (không nói trước nguyên nhân). Mô tả triệu chứng, rồi để mình đề xuất lệnh kiểm tra từng bước; bạn trả lời kết quả giả định của lệnh đó.'); };
  }

  /* ---------- Checklist cuối khóa ---------- */
  function pageFinal() {
    function count() { return FINAL.filter(function (x, i) { return progress.final[i]; }).length; }
    var h = '<h1>🎯 Checklist cuối khóa</h1><p>Mục tiêu khóa học: <b>đọc hiểu cơ bản, giải quyết được một số vấn đề cơ bản</b>. Hãy tích vào mục nào <b>bạn tự làm được mà không nhìn tài liệu</b> (trung thực với chính mình!).</p><div class="pbar" style="margin:0 0 6px"><i id="fb" style="width:0"></i></div><p id="fm"></p><ul class="task-list" id="fl">';
    FINAL.forEach(function (x, i) { h += '<li class="' + (progress.final[i] ? 'ok' : '') + '" data-i="' + i + '" style="cursor:pointer"><span class="st">' + (progress.final[i] ? '✓' : '') + '</span><span>' + esc(x[0]) + ' – <a href="' + (x[1] === 'problems' ? '#/problems' : '#/lesson/' + x[1]) + '">ôn lại</a></span></li>'; });
    h += '</ul>' + progressBackupBox();
    view.innerHTML = h;
    bindProgressBackup();
    function upd() {
      var c = count(); $('#fb').style.width = Math.round(100 * c / FINAL.length) + '%';
      $('#fm').innerHTML = c === FINAL.length ? '🎉 <b>Chúc mừng!</b> Bạn đã đạt mục tiêu khóa học. Bước tiếp: làm đồ án "máy chủ portal" ở trang <a href="#/mindset">Cách học</a> hoặc thực hành trên WSL2 / máy ảo Rocky Linux.' : '<b>' + c + '/' + FINAL.length + '</b> mục. Mục chưa tích: quay lại bài tương ứng và làm lại thử thách.';
    }
    $$('#fl li').forEach(function (li) {
      li.onclick = function (e) {
        if (e.target.tagName === 'A') return;
        var i = li.getAttribute('data-i'); progress.final[i] = !progress.final[i]; save();
        li.classList.toggle('ok', !!progress.final[i]); $('.st', li).textContent = progress.final[i] ? '✓' : ''; upd(); renderSidebar('#/final');
      };
    });
    upd();
  }

  /* ---------- Đăng web & API AI ---------- */
  function pagePublish() {
    var h = '<h1>🚀 Đăng web & hiểu về API AI</h1>' +
      '<div class="tip">Trang này chỉ cần <b>file tĩnh</b>. Bạn <b>không bắt buộc</b> dùng AI/API: hết khóa, vẫn học đầy đủ. API chỉ là phần thưởng thêm.</div>' +
      '<h2>Phần A – Đăng lên GitHub Pages (miễn phí, không cần cài gì)</h2>' +
      '<ol>' +
      '<li><b>Tạo tài khoản:</b> vào <a href="https://github.com/signup" target="_blank" rel="noopener">github.com/signup</a>, xác nhận email.</li>' +
      '<li><b>Tạo kho (repository):</b> bấm dấu <b>+</b> góc phải → <b>New repository</b> → đặt tên, ví dụ <code>linux-hoc-vien</code> → chọn <b>Public</b> → <b>Create repository</b>.<br><small>GitHub Pages gói miễn phí yêu cầu repo công khai (Public).</small></li>' +
      '<li><b>Tải file lên:</b> trong repo mới bấm <b>uploading an existing file</b>. Mở thư mục <code>linux-hoc-vien</code> trên máy, <b>kéo thả cả các file và thư mục</b> (<code>index.html</code>, <code>css</code>, <code>js</code>, <code>README.md</code>…) vào ô tải lên. Kéo thư mục hoạt động tốt trên Chrome/Edge.</li>' +
      '<li>Kéo xuống cuối, bấm <b>Commit changes</b>.</li>' +
      '<li><b>Bật Pages:</b> tab <b>Settings</b> → menu trái <b>Pages</b> → mục <i>Build and deployment</i>: Source = <b>Deploy from a branch</b>; Branch = <b>main</b>, thư mục <b>/ (root)</b> → <b>Save</b>.</li>' +
      '<li><b>Chờ 1–3 phút</b>, tải lại trang Settings → Pages sẽ hiện địa chỉ: <code>https://TEN-GITHUB-CUA-BAN.github.io/linux-hoc-vien/</code>. Mở thử!</li>' +
      '<li><b>Cập nhật sau này:</b> sửa file → vào repo → <b>Add file → Upload files</b> (ghi đè cùng tên) → Commit. Vài phút sau web tự cập nhật.</li>' +
      '</ol>' +
      '<details class="card"><summary style="cursor:pointer;font-weight:700">Cách dùng Git dòng lệnh (khi đã quen)</summary><p>Cài <a href="https://git-scm.com/download/win" target="_blank" rel="noopener">Git for Windows</a>, rồi trong thư mục dự án:</p><pre><code>git init\ngit add .\ngit commit -m "Phiên bản đầu tiên"\ngit branch -M main\ngit remote add origin https://github.com/TEN-BAN/linux-hoc-vien.git\ngit push -u origin main</code></pre><p>Lần sau chỉ cần: <code>git add .</code> → <code>git commit -m "…"</code> → <code>git push</code>. Khi push lần đầu GitHub sẽ mở cửa sổ đăng nhập.</p></details>' +
      '<div class="warn"><b>Đừng đưa lên GitHub:</b> API key, mật khẩu, thông tin cá nhân. Nhớ rằng repo Public thì <b>ai cũng xem được</b> mọi file.</div>' +
      '<h2>Phần B – Cách của "Google"</h2><ul>' +
      '<li><b>Firebase Hosting</b> (dịch vụ của Google, có gói miễn phí): cần cài Node.js, rồi <code>npm i -g firebase-tools</code> → <code>firebase login</code> → <code>firebase init hosting</code> (thư mục public: <code>.</code>) → <code>firebase deploy</code>. Dự án đã có sẵn <code>firebase.json</code>. Khó hơn GitHub Pages một chút nhưng cùng hệ Google.</li>' +
      '<li><b>Google Sites:</b> dễ làm trang giới thiệu, nhưng không chạy được JS tùy ý. Bạn có thể <i>nhúng</i> (Insert → Embed → By URL) trang GitHub Pages vào Google Sites.</li>' +
      '<li><b>Không cần đăng web:</b> dùng cá nhân thì mở <code>index.html</code> trực tiếp trên máy là đủ.</li></ul>' +
      '<p>Video hướng dẫn (đã kiểm tra):</p><div class="grid">' + videoCards(VIDEOS.filter(function (v) { return v.lessons.indexOf('publish') >= 0 && /GitHub/.test(v.g); })) + '</div>' +
      '<h2>Phần C – API AI là gì?</h2>' +
      '<p><b>API</b> (giao diện lập trình ứng dụng) là <b>"cửa sổ gọi món"</b>: chương trình của bạn gửi một yêu cầu theo định dạng quy định; dịch vụ ở xa xử lý rồi trả kết quả. Ví dụ: nhà hàng – <i>thực khách</i> là trang web của bạn, <i>người phục vụ</i> là API, <i>nhà bếp</i> là mô hình Gemini.</p>' +
      '<table><tr><th>Thuật ngữ</th><th>Hiểu đơn giản</th></tr><tr><td><b>API key</b></td><td>Chuỗi ký tự bí mật chứng minh "ai đang gọi và tính tiền cho ai". Lộ key = người khác dùng ké, bạn trả tiền.</td></tr><tr><td><b>Token</b></td><td>Đơn vị tính chi phí: một mảnh chữ (khoảng 3–4 ký tự tiếng Anh). Tiếng Việt thường tốn nhiều token hơn cho cùng độ dài. Tính cả token bạn gửi vào (input) và token AI trả ra (output).</td></tr><tr><td><b>Mô hình (model)</b></td><td>"Bộ não" được gọi, ví dụ <code>gemini-3.8-flash</code>. Trang web này tự động chuyển sang mô hình dự phòng nếu mô hình chính bị quá tải.</td></tr><tr><td><b>Hạn mức (rate limit)</b></td><td>Số yêu cầu/phút, token/ngày tối đa được phép.</td></tr></table>' +
      '<p>Trang này gọi API ở file <code>js/ai.js</code>: mỗi lần bạn hỏi, trình duyệt gửi câu hỏi + khóa của bạn tới <code>generativelanguage.googleapis.com</code>.</p>' +
      '<h2>Phần D – Có tốn tiền không, thanh toán thế nào?</h2>' +
      '<div class="warn"><b>Quan trọng:</b> gói <b>Google AI Pro</b> (bạn đang dùng với Antigravity) và <b>thanh toán API</b> là <b>hai hệ thống khác nhau</b>. Hạn mức Antigravity/Gemini app không tự biến thành tiền dùng API. Mình <u>không khẳng định</u> gói Pro có kèm credit API – hãy xem trang chính thức bên dưới.</div>' +
      '<ol><li><b>Gói miễn phí (Free tier):</b> tạo key ở <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener">aistudio.google.com/apikey</a>, thường <b>không cần thẻ</b>, dùng được trong hạn mức thấp – đủ để học. Lưu ý: ở gói miễn phí, nội dung bạn gửi <b>có thể được Google dùng để cải thiện sản phẩm</b>, nên đừng gửi dữ liệu nhạy cảm. Một số quốc gia/mô hình có thể bị giới hạn.</li>' +
      '<li><b>Gói trả phí (Pay-as-you-go):</b> trong AI Studio chọn dự án/key → <b>Set up billing</b> → liên kết tài khoản thanh toán Google Cloud (cần <b>thẻ Visa/Mastercard</b> bật thanh toán quốc tế). Có thể phải nạp trước (prepay) một khoản tối thiểu. Sau đó bị tính tiền <b>theo số token</b> bạn dùng; dữ liệu gói trả phí không dùng để huấn luyện.</li>' +
      '<li><b>Giá:</b> thay đổi theo mô hình và theo thời gian. Luôn xem bảng giá chính thức: <a href="https://ai.google.dev/gemini-api/docs/pricing" target="_blank" rel="noopener">ai.google.dev/gemini-api/docs/pricing</a>. Một câu hỏi học Linux thường chỉ vài trăm đến vài nghìn token – rất nhỏ, nhưng dùng nhiều thì cộng dồn.</li></ol>' +
      '<h3>Checklist an toàn tiền bạc</h3><ul><li>✅ Bắt đầu bằng <b>Free tier</b>, chưa bật billing nếu chưa cần.</li><li>✅ Nếu bật billing: đặt <b>ngân sách & cảnh báo</b> trong Google Cloud Billing (Budgets &amp; alerts).</li><li>✅ <b>Giới hạn key</b> (API restrictions / HTTP referrer) trong Google Cloud Console.</li><li>✅ <b>Không</b> viết key vào file code hoặc đưa lên GitHub. Web này để mỗi người <b>tự dán key của riêng họ</b> (lưu trong trình duyệt của họ) → bạn đăng web công khai cũng không bị tính tiền thay người khác.</li><li>✅ Key bị lộ? Vào AI Studio <b>xóa/đổi key ngay</b>.</li></ul>' +
      '<p>Video (đã kiểm tra) giải thích API và cách lấy key:</p><div class="grid">' + videoCards(VIDEOS.filter(function (v) { return v.lessons.indexOf('publish') >= 0 && /API/.test(v.g); })) + '</div>' +
      '<p style="color:var(--muted);font-size:.9rem">Thông tin về mức giá/điều kiện thanh toán được tổng hợp qua tìm kiếm ngày 02/11/2026 và có thể đã thay đổi – hãy đối chiếu với trang chính thức của Google trước khi nhập thẻ.</p>';
    view.innerHTML = h; enhance(view);
  }

  function page404() { view.innerHTML = '<h1>Không tìm thấy trang</h1><p><a href="#/">Về trang chủ</a></p>'; }

  /* ---------- AI panel ---------- */
  var panel = $('#aiPanel'), aiBuilt = false;
  function aiContext() { var t = (view.querySelector('h1') || {}).textContent || ''; return 'Người học đang xem: ' + t; }
  function addMsg(cls, html) { var m = document.createElement('div'); m.className = 'msg ' + cls; m.innerHTML = html; $('.ai-msgs', panel).appendChild(m); $('.ai-msgs', panel).scrollTop = 1e9; enhance(m); return m; }
  function buildAI() {
    if (aiBuilt) return; aiBuilt = true;
    panel.innerHTML = '<div class="ai-head">🤖 Gia sư Linux <span class="sp"></span><button type="button" id="aiCfg" title="Cài đặt khóa API">⚙️</button><button type="button" id="aiClose" title="Đóng">✕</button></div><div id="aiSet" class="ai-settings" hidden></div><div class="ai-msgs"></div><div class="ai-chips"></div><form class="ai-form"><textarea placeholder="Hỏi về Linux… (Enter để gửi)" rows="1"></textarea><button class="btn small" type="submit">Gửi</button></form>';
    $('#aiClose').onclick = function () { panel.hidden = true; };
    $('#aiCfg').onclick = function () { var s = $('#aiSet'); s.hidden = !s.hidden; drawSettings(); };
    ['Giải thích lệnh ls -la từng phần', 'Ra cho mình 3 câu hỏi kiểm tra', 'Mình bị lỗi Permission denied'].forEach(function (t) {
      var b = document.createElement('button'); b.type = 'button'; b.className = 'chip'; b.textContent = t; b.onclick = function () { send(t); }; $('.ai-chips', panel).appendChild(b);
    });
    var ta = $('textarea', panel);
    ta.addEventListener('keydown', function (e) { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); $('form', panel).requestSubmit(); } });
    $('form', panel).onsubmit = function (e) { e.preventDefault(); var v = ta.value.trim(); if (v) { ta.value = ''; send(v); } };
    addMsg('bot', 'Chào bạn! Mình là gia sư Linux. Mình sẽ <b>gợi ý để bạn tự tư duy</b> thay vì đưa đáp án ngay. Hỏi mình bất cứ điều gì về bài đang học nhé.' + (AI.hasKey() ? '' : '<br><br>⚠️ Bạn chưa cài khóa API: bấm ⚙️ để thiết lập (miễn phí). Không có AI thì bạn vẫn học đầy đủ ở các phần khác.'));
    if (!AI.hasKey()) { $('#aiSet').hidden = false; drawSettings(); }
  }
  function drawSettings() {
    $('#aiSet').innerHTML = '<b>Khóa Gemini API</b> (lưu cục bộ trên trình duyệt này) – <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener">lấy khóa miễn phí</a>' +
      '<input id="kInp" type="password" placeholder="AIza…" value="' + esc(AI.getKey()) + '" autocomplete="off">' +
      '<b>Mô hình ưu tiên</b> <small>(tự động chuyển mô hình dự phòng nếu quá tải)</small>' +
      '<input id="mInp" list="mList" value="' + esc(AI.getModel()) + '">' +
      '<datalist id="mList"><option value="gemini-3.8-flash"><option value="gemini-3.8-flash-lite"><option value="gemini-2.5-flash-lite"><option value="gemini-2.0-flash"><option value="gemini-3.8-pro"></datalist>' +
      '<div class="row" style="margin:0"><button type="button" class="btn small" id="kSave">Lưu</button><button type="button" class="btn small alt" id="kDetect">🔍 Tự dò model</button><button type="button" class="btn small alt" id="kDel">Xóa khóa</button></div>';
    $('#kSave').onclick = function () { AI.setKey($('#kInp').value); AI.setModel($('#mInp').value); $('#aiSet').hidden = true; addMsg('bot', AI.hasKey() ? '✅ Đã lưu cấu hình (mô hình: <code>' + esc(AI.getModel()) + '</code>, có tự động dự phòng). Hỏi mình đi!' : 'Đã xóa khóa.'); };
    $('#kDetect').onclick = function () {
      AI.setKey($('#kInp').value);
      if (!AI.hasKey()) { addMsg('bot', '⚠️ Hãy dán khóa API trước khi dò mô hình.'); return; }
      var btn = $('#kDetect'); btn.textContent = 'Đang dò…';
      AI.listModels().then(function (list) {
        btn.textContent = '🔍 Tự dò model';
        if (list && list.length) {
          $('#mList').innerHTML = list.map(function (m) { return '<option value="' + esc(m) + '">'; }).join('');
          $('#mInp').value = list[0];
          AI.setModel(list[0]);
          addMsg('bot', '✅ Đã tìm thấy ' + list.length + ' mô hình khả dụng cho khóa của bạn. Đã chọn: <code>' + esc(list[0]) + '</code>.');
        }
      });
    };
    $('#kDel').onclick = function () { AI.setKey(''); $('#kInp').value = ''; AI.reset(); };
  }
  function send(text) {
    buildAI(); panel.hidden = false;
    addMsg('user', esc(text).replace(/\n/g, '<br>'));
    if (!AI.hasKey()) { addMsg('bot', 'Bạn cần dán khóa Gemini API ở ⚙️ trước. Trong lúc đó, hãy thử <a href="#/cheatsheet">Tra cứu lệnh</a> hoặc <a href="#/mindset">Cách đọc lỗi</a>.'); $('#aiSet').hidden = false; drawSettings(); return; }
    var wait = addMsg('bot', '<i>Đang suy nghĩ…</i>');
    AI.ask(text, aiContext()).then(function (t) { wait.innerHTML = AI.md(t); enhance(wait); $('.ai-msgs', panel).scrollTop = 1e9; })
      .catch(function (err) { wait.innerHTML = '⚠️ Lỗi: ' + esc(err.message) + '<br><small>Mẹo: bấm ⚙️ → <b>🔍 Tự dò model</b> để chọn mô hình đang rảnh cho khóa của bạn, hoặc thử lại sau ít giây.</small>'; });
  }
  function openAI(prefill) { buildAI(); panel.hidden = false; var ta = $('textarea', panel); if (prefill) { ta.value = prefill; } ta.focus(); }
  $('#aiFab').onclick = function () { buildAI(); panel.hidden = !panel.hidden; if (!panel.hidden) $('textarea', panel).focus(); };

  /* ---------- Router ---------- */
  function route() {
    var hash = location.hash.replace(/^#/, '') || '/', parts = hash.split('/').filter(Boolean);
    var key = '#' + hash;
    renderSidebar(parts[0] === 'lesson' ? '#/lesson/' + parts[1] : (parts[0] === 'practice' ? '#/practice' : (parts[0] === 'reading' ? '#/reading' : key)));
    var p = parts[0];
    if (!p) pageHome();
    else if (p === 'search') pageSearch();
    else if (p === 'lesson') pageLesson(parts[1]);
    else if (p === 'practice') pagePractice(parts[1]);
    else if (p === 'cheatsheet') pageCheat();
    else if (p === 'mindset') pageMindset();
    else if (p === 'resources') pageResources();
    else if (p === 'own') pageOwn();
    else if (p === 'reading') pageReading(parts[1]);
    else if (p === 'problems') pageProblems();
    else if (p === 'final') pageFinal();
    else if (p === 'videos') pageVideos();
    else if (p === 'publish') pagePublish();
    else page404();
    enhance(view);
    document.title = ((view.querySelector('h1') || {}).textContent || 'Linux Khởi Đầu') + ' – Linux Khởi Đầu';
    window.scrollTo(0, 0);
  }
  window.addEventListener('hashchange', route);
  route();
})();
