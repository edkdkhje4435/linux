# Linux Khởi Đầu – web học Linux cho người mới

Trang web tĩnh (HTML/CSS/JS thuần, **không cần build, không cần server**). Bạn sở hữu toàn bộ mã nguồn.

Nguồn tham khảo cấu trúc nội dung: <https://thayduy.github.io/he-dieu-hanh-linux/> (repo: <https://github.com/thayduy/he-dieu-hanh-linux>). Nội dung bài học được viết lại bằng lời riêng.

## Chạy thử trên máy
Mở `index.html` bằng trình duyệt (double-click) là chạy được.
Hoặc chạy server cục bộ (nếu có Python): `python -m http.server 8080` rồi mở <http://localhost:8080>.

## Tính năng
- **8 bài học** (khái niệm → terminal → thư mục → tập tin → phân quyền → mạng/SSH → vận hành → shell script) kèm terminal thực hành ngay trong bài
- **Quiz cuối bài**, tự chấm & giải thích từng câu
- **Terminal mô phỏng trên trình duyệt** an toàn:
  - Hỗ trợ lệnh tập tin/thư mục (`pwd`, `ls`, `cd`, `mkdir`, `rmdir`, `touch`, `cat`, `echo`, `cp`, `mv`, `rm`, `chmod`, `head`, `tail`, `wc`, `grep`, `sort`)
  - Kiểm tra quyền `r`, `w`, `x` thực tế trên cả **file** và **thư mục** (ví dụ thiếu quyền `x` trên thư mục sẽ báo `Permission denied` khi `cd`)
  - Hỗ trợ ghép chuỗi lệnh `&&`, `||`, `;`, đường ống `|`, chuyển hướng `>`, `>>`, ký tự đại diện `*`, `?`, phím `Tab` tự điền và `↑`/`↓` lịch sử lệnh
  - Hỗ trợ nhóm lệnh tìm kiếm, nén và chẩn đoán vận hành cơ bản (`find`, `tar -czf/-tzf/-xzf`, `df -h`, `du -sh`, `free -h`, `ps aux`, `pgrep`, `systemctl`, `journalctl`, `sudo`, `ip a`, `ping`)
- **7 thử thách thực hành** được chấm theo **trạng thái thực tế** (điều hướng, tạo/sao chép, dọn dẹp, phân quyền file & thư mục, lọc log, tìm & nén sao lưu `find` + `tar`, chẩn đoán & cứu dịch vụ `nginx`)
- **Phòng đọc code (8 bài)**: đọc hiểu script, one-liner, cron và các chuỗi lệnh do AI sinh ra (`set -e`, `&&`, `||`, `[ -f "$f" ] || continue`, `pgrep`, `find` + `tar`)
- **Cẩm nang xử lý sự cố cơ bản** (7 tình huống thực tế) & **Checklist cuối khóa** (12 mục tiêu đầu ra)
- **Tìm kiếm toàn trang (Global Search)** xuyên suốt bài học, bảng tra lệnh, thử thách, phòng đọc code và cẩm nang sự cố
- **Sao lưu / Khôi phục tiến độ học tập** bằng mã JSON để mang sang máy hoặc trình duyệt khác
- **20 video YouTube đã kiểm chứng** (tiếng Việt & tiếng Anh, kèm thông tin thời lượng, kênh, lượt xem)
- **Tra cứu lệnh (~58 lệnh)**, trang tư duy học, trang hướng dẫn đăng web & API AI
- **Gia sư AI tùy chọn** (Gemini API, lưu khóa cục bộ trên trình duyệt, tự động dò và chuyển sang mô hình dự phòng khi quá tải)

## Cấu trúc
```
index.html          khung trang
css/style.css       giao diện
js/lessons.js       NỘI DUNG BÀI HỌC  (sửa/thêm bài ở đây)
js/reading.js       PHÒNG ĐỌC CODE, CẨM NANG SỰ CỐ & CHECKLIST CUỐI KHÓA
js/videos.js        DANH SÁCH VIDEO YOUTUBE ĐÃ KIỂM TRA
js/data.js          bảng lệnh, thử thách, tài nguyên
js/shell.js         bộ máy terminal mô phỏng
js/ai.js            trợ lý AI (tự động dự phòng model)
js/app.js           điều hướng + tìm kiếm toàn trang + giao diện
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
2. Trên web: nút **🤖 Hỏi AI** → ⚙️ → dán key (hoặc bấm **🔍 Tự dò model**).
3. Khi đăng công khai: **đừng nhúng key vào mã nguồn**; giới hạn key theo domain (HTTP referrer) trong Google Cloud Console.
