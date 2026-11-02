/* Trợ lý AI (TÙY CHỌN).
 * Gọi trực tiếp Gemini API từ trình duyệt bằng API key của BẠN (lưu trong localStorage của trình duyệt này,
 * không gửi đến máy chủ nào khác ngoài Google). Không có key → trang vẫn học bình thường.
 * Lấy key miễn phí: https://aistudio.google.com/apikey
 */
(function () {
  var KEY = 'lh_gemini_key', MODEL = 'lh_gemini_model', DEFAULT_MODEL = 'gemini-2.5-flash';

  var SYSTEM = [
    'Bạn là "Gia sư Linux" cho người MỚI BẮT ĐẦU, trả lời bằng tiếng Việt, ngắn gọn, thân thiện.',
    'Phương pháp: (1) hỏi lại/gợi ý để người học tự suy nghĩ trước khi đưa đáp án đầy đủ; (2) giải thích LÝ DO của từng lệnh, từng tùy chọn;',
    '(3) khi người học dán lỗi, hướng dẫn cách ĐỌC lỗi và tự khoanh vùng nguyên nhân; (4) luôn cảnh báo lệnh nguy hiểm (rm -rf, chmod 777, dd, mkfs...) và khuyên thử trong máy ảo;',
    '(5) ưu tiên ví dụ cho họ Red Hat (CentOS/Rocky/Alma, dnf) nhưng nêu khác biệt với Ubuntu/Debian (apt) khi cần; (6) code đặt trong khối ```bash.',
    'Nếu câu hỏi không liên quan đến Linux/lập trình/học tập thì nhẹ nhàng đưa về chủ đề học.'
  ].join('\n');

  var history = [];

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

  var AI = {
    md: md,
    hasKey: function () { return !!localStorage.getItem(KEY); },
    getKey: function () { return localStorage.getItem(KEY) || ''; },
    setKey: function (k) { if (k) localStorage.setItem(KEY, k.trim()); else localStorage.removeItem(KEY); },
    getModel: function () { return localStorage.getItem(MODEL) || DEFAULT_MODEL; },
    setModel: function (m) { localStorage.setItem(MODEL, (m || DEFAULT_MODEL).trim()); },
    reset: function () { history = []; },
    ask: function (question, context) {
      var key = AI.getKey();
      if (!key) return Promise.reject(new Error('NO_KEY'));
      var text = context ? '[Ngữ cảnh: ' + context + ']\n' + question : question;
      history.push({ role: 'user', parts: [{ text: text }] });
      if (history.length > 20) history = history.slice(-20);
      var url = 'https://generativelanguage.googleapis.com/v1beta/models/' + encodeURIComponent(AI.getModel()) + ':generateContent';
      return fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-goog-api-key': key },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: SYSTEM }] },
          contents: history,
          generationConfig: { temperature: 0.5, maxOutputTokens: 1200 }
        })
      }).then(function (r) {
        return r.json().then(function (j) {
          if (!r.ok) {
            history.pop();
            var msg = (j && j.error && j.error.message) || ('HTTP ' + r.status);
            throw new Error(msg);
          }
          var t = j.candidates && j.candidates[0] && j.candidates[0].content && j.candidates[0].content.parts
            ? j.candidates[0].content.parts.map(function (p) { return p.text || ''; }).join('') : '';
          if (!t) { history.pop(); throw new Error('AI không trả về nội dung (có thể bị bộ lọc an toàn chặn). Hãy thử diễn đạt lại.'); }
          history.push({ role: 'model', parts: [{ text: t }] });
          return t;
        });
      });
    }
  };
  window.AI = AI;
})();
