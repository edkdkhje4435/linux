/* Trợ lý AI (TÙY CHỌN).
 * Gọi trực tiếp Gemini API từ trình duyệt bằng API key của BẠN (lưu trong localStorage của trình duyệt này,
 * không gửi đến máy chủ nào khác ngoài Google). Không có key → trang vẫn học bình thường.
 * Lấy key miễn phí: https://aistudio.google.com/apikey
 */
(function () {
  var KEY = 'lh_gemini_key', MODEL = 'lh_gemini_model', DEFAULT_MODEL = 'gemini-3.8-flash';
  var FALLBACK_MODELS = [
    'gemini-3.8-flash',
    'gemini-3.8-flash-lite',
    'gemini-3.8-flash-lite-preview',
    'gemini-2.5-flash-lite',
    'gemini-2.0-flash',
    'gemini-2.0-flash-lite',
    'gemini-3.8-pro',
    'gemini-2.5-pro',
    'gemini-flash-latest'
  ];

  var SYSTEM = [
    'Bạn là "Gia sư Linux" cho người MỚI BẮT ĐẦU, trả lời bằng tiếng Việt, ngắn gọn, thân thiện.',
    'Phương pháp: (1) hỏi lại/gợi ý để người học tự suy nghĩ trước khi đưa đáp án đầy đủ; (2) giải thích LÝ DO của từng lệnh, từng tùy chọn;',
    '(3) khi người học dán lỗi, hướng dẫn cách ĐỌC lỗi và tự khoanh vùng nguyên nhân; (4) luôn cảnh báo lệnh nguy hiểm (rm -rf, chmod 777, dd, mkfs...) và khuyên thử trong máy ảo;',
    '(5) ưu tiên ví dụ cho họ Red Hat (CentOS/Rocky/Alma, dnf) nhưng nêu khác biệt với Ubuntu/Debian (apt) khi cần; (6) code đặt trong khối ```bash.',
    'Nếu câu hỏi không liên quan đến Linux/lập trình/học tập thì nhẹ nhàng đưa về chủ đề học.'
  ].join('\n');

  var history = [];
  var cachedModels = null;

  function esc(s) { return s.replace(/[&<>]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]; }); }
  function md(text) {
    var parts = text.split(/```/), out = '';
    parts.forEach(function (p, i) {
      if (i % 2) { out += '<pre><code>' + esc(p.replace(/^\w*\n/, '')) + '</code></pre>'; }
      else {
        out += esc(p).replace(/`([^`]+)`/g, '<code>$1</code>').replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>').replace(/\n/g, '<br>');
      }
    });
    return out;
  }

  function uniq(arr) {
    var seen = {}, out = [];
    arr.forEach(function (x) {
      var k = String(x || '').replace(/^models\//, '').trim();
      if (k && !seen[k]) { seen[k] = true; out.push(k); }
    });
    return out;
  }

  function callModel(key, mName, contents) {
    var url = 'https://generativelanguage.googleapis.com/v1beta/models/' + encodeURIComponent(mName) + ':generateContent';
    var controller = new AbortController();
    var timeoutId = setTimeout(function () { controller.abort(); }, 22000);

    return fetch(url, {
      method: 'POST',
      signal: controller.signal,
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': key },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: SYSTEM }] },
        contents: contents,
        generationConfig: { temperature: 0.5, maxOutputTokens: 1200 }
      })
    }).then(function (r) {
      clearTimeout(timeoutId);
      return r.json().then(function (j) {
        if (!r.ok) {
          var msg = (j && j.error && j.error.message) || ('HTTP ' + r.status);
          var err = new Error(msg);
          err.status = r.status;
          err.model = mName;
          throw err;
        }
        var t = j.candidates && j.candidates[0] && j.candidates[0].content && j.candidates[0].content.parts
          ? j.candidates[0].content.parts.map(function (p) { return p.text || ''; }).join('') : '';
        if (!t) {
          var emptyErr = new Error('AI không trả về nội dung. Hãy thử diễn đạt lại.');
          emptyErr.noRetry = true;
          throw emptyErr;
        }
        return { text: t, model: mName };
      });
    }).catch(function (err) {
      clearTimeout(timeoutId);
      if (err.name === 'AbortError') {
        var toErr = new Error('Yêu cầu mất quá 22 giây chưa phản hồi (' + mName + ').');
        toErr.retryable = true;
        throw toErr;
      }
      throw err;
    });
  }

  function shouldFallback(err) {
    if (!err || err.noRetry) return false;
    var m = String(err.message || '').toLowerCase();
    if (err.
      status === 401 || err.status === 403 || /api key not valid|invalid api key|permission_denied/.test(m)) {
      return false;
    }
    return err.retryable || err.status === 404 || err.status === 429 || err.status === 503 || err.status === 500 ||
      /not found|no longer available|not supported|high demand|overloaded|resource_exhausted|quota|try again|unavailable/.test(m);
  }

  var AI = {
    md: md,
    hasKey: function () { return !!localStorage.getItem(KEY); },
    getKey: function () { return localStorage.getItem(KEY) || ''; },
    setKey: function (k) { cachedModels = null; if (k) localStorage.setItem(KEY, k.trim()); else localStorage.removeItem(KEY); },
    getModel: function () {
      var saved = localStorage.getItem(MODEL);
      if (!saved || saved === 'gemini-2.5-flash' || saved === 'gemini-1.5-flash') return DEFAULT_MODEL;
      return saved;
    },
    setModel: function (m) { localStorage.setItem(MODEL, (m || DEFAULT_MODEL).replace(/^models\//, '').trim()); },
    reset: function () { history = []; },
    listModels: function () {
      var key = AI.getKey();
      if (!key) return Promise.resolve(FALLBACK_MODELS.slice());
      if (cachedModels && cachedModels.length) return Promise.resolve(cachedModels.slice());
      return fetch('https://generativelanguage.googleapis.com/v1beta/models', {
        headers: { 'x-goog-api-key': key }
      }).then(function (r) { return r.json(); }).then(function (j) {
        if (!j || !Array.isArray(j.models)) return FALLBACK_MODELS.slice();
        var names = j.models.filter(function (m) {
          var n = String(m.name || '');
          var okMethod = Array.isArray(m.supportedGenerationMethods) && m.supportedGenerationMethods.indexOf('generateContent') >= 0;
          var isText = /^models\/gemini/i.test(n) && !/embedding|imagen|veo|tts|audio|vision|aqa|robotics|computer-use|learnlm/i.test(n);
          return okMethod && isText;
        }).map(function (m) { return m.name.replace(/^models\//, ''); });
        // Ưu tiên dòng flash mới trước
        names.sort(function (a, b) {
          var sa = (/3\.8-flash$/.test(a) ? 0 : /flash/.test(a) ? 1 : 2);
          var sb = (/3\.8-flash$/.test(b) ? 0 : /flash/.test(b) ? 1 : 2);
          return sa - sb || b.localeCompare(a);
        });
        cachedModels = uniq(names.concat(FALLBACK_MODELS));
        return cachedModels.slice();
      }).catch(function () {
        return FALLBACK_MODELS.slice();
      });
    },
    ask: function (question, context) {
      var key = AI.getKey();
      if (!key) return Promise.reject(new Error('NO_KEY'));
      var text = context ? '[Ngữ cảnh: ' + context + ']\n' + question : question;
      history.push({ role: 'user', parts: [{ text: text }] });
      if (history.length > 20) history = history.slice(-20);

      var preferred = AI.getModel().replace(/^models\//, '');
      var initialCands = uniq([preferred].concat(cachedModels || FALLBACK_MODELS));

      function tryChain(cands, idx, discovered) {
        if (idx >= cands.length) {
          if (!discovered) {
            return AI.listModels().then(function (more) {
              var extra = more.filter(function (m) { return cands.indexOf(m) < 0; });
              if (extra.length) return tryChain(cands.concat(extra), idx, true);
              throw new Error('Các mô hình Gemini hiện đang quá tải hoặc không khả dụng với khóa này.');
            });
          }
          throw new Error('Không gọi được mô hình nào khả dụng.');
        }
        var mName = cands[idx];
        return callModel(key, mName, history).then(function (res) {
          history.push({ role: 'model', parts: [{ text: res.text }] });
          if (res.model !== preferred) {
            AI.setModel(res.model);
          }
          return res.text;
        }).catch(function (err) {
          if (shouldFallback(err) && (idx + 1 < cands.length || !discovered)) {
            return tryChain(cands, idx + 1, discovered).catch(function () {
              throw err;
            });
          }
          throw err;
        });
      }

      return tryChain(initialCands, 0, !!cachedModels).catch(function (err) {
        history.pop();
        throw err;
      });
    }
  };
  window.AI = AI;
})();
