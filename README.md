# Linux Khởi Đầu – web học Linux cho người mới

Trang web tĩnh (HTML/CSS/JS thuần, **không cần build, không cần server**). Bạn sở hữu toàn bộ mã nguồn.

Nguồn tham khảo cấu trúc nội dung: <https://thayduy.github.io/he-dieu-hanh-linux/> (repo: <https://github.com/thayduy/he-dieu-hanh-linux>). Nội dung bài học được viết lại bằng lời riêng.

## Chạy thử trên máy
Mở `index.html` bằng trình duyệt (double-click) là chạy được.
Hoặc chạy server cục bộ (nếu có Python): `python -m http.server 8080` rồi mở <http://localhost:8080>.

## Tính năng
- 8 bài học (khái niệm → terminal → thư mục → tập tin → phân quyền → mạng/SSH → vận hành → shell script)
- Quiz cuối bài, tự chấm
- Terminal giả lập an toàn (pwd, ls, cd, mkdir, touch, cat, echo, cp, mv, rm, chmod, grep, wc, head, tail, sort, pipe, `>` `>>`, glob, Tab, ↑↓)
- 5 thử thách được chấm theo **kết quả thực tế** (không bắt gõ đúng 1 đáp án)
- **Phòng đọc code** (6 mẫu script/one-liner/cron với giải thích từng dòng + câu dự đoán + tự diễn đạt)
- **Cẩm nang xử lý sự cố cơ bản** (7 tình huống thực tế) & **Checklist cuối khóa** (12 mục tiêu đầu ra)
- **20 video YouTube đã kiểm chứng** (tiếng Việt & tiếng Anh, kèm thông tin thời lượng, kênh, lượt xem)
- Tra cứu lệnh (~55 lệnh), trang tư duy học, trang hướng dẫn đăng web & API AI
- Gia sư AI **tùy chọn** (Gemini API, key của bạn, lưu cục bộ trong trình duyệt)
- Sáng/tối, lưu tiến độ trong `localStorage`

## Cấu trúc
```
index.html          khung trang
css/style.css       giao diện
js/lessons.js       NỘI DUNG BÀI HỌC  (sửa/thêm bài ở đây)
js/reading.js       PHÒNG ĐỌC CODE, CẨM NANG SỰ CỐ & CHECKLIST CUỐI KHÓA
js/videos.js        DANH SÁCH VIDEO YOUTUBE ĐÃ KIỂM TRA
js/data.js          bảng lệnh, thử thách, tài nguyên
js/shell.js         bộ máy terminal giả lập
js/ai.js            trợ lý AI
js/app.js           điều hướng + giao diện
tests/              kiểm thử (mở tests/run.html và tests/e2e.html bằng trình duyệt)
```

## Đăng web
**GitHub Pages (khuyên dùng):** tạo repo → upload toàn bộ thư mục này → Settings → Pages → Branch `main` / root → Save.

**Firebase Hosting (Google):**
```
npm i -g firebase-tools
firebase login
firebase init hosting     # public directory: .   | single-page app: No
firebase deploy
```
(đã có sẵn `firebase.json`).

## Bật AI
1. Tạo key tại <https://aistudio.google.com/apikey>.
2. Trên web: nút **🤖 Hỏi AI** → ⚙️ → dán key.
3. Khi đăng công khai: **đừng nhúng key vào mã nguồn**; giới hạn key theo domain (HTTP referrer) trong Google Cloud Console.
