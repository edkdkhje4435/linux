/* Video đã KIỂM TRA ngày 02/11/2026 qua YouTube oEmbed + trang xem: video còn tồn tại, cho phép nhúng,
 * kênh/lượt xem/năm đăng như ghi dưới đây. Lưu ý: người soạn KHÔNG xem hết nội dung từng video –
 * hãy xem thử vài phút đầu và bỏ video nào không hợp. Bạn có thể thêm/bớt tùy ý. */
window.VIDEOS = [
  // ---- Tiếng Việt ----
  { id: 'ddTQpPxKQSU', g: 'Tiếng Việt – Linux cơ bản', t: 'LPI – Tự học Linux Bài 07: Cách sử dụng Terminal và cú pháp câu lệnh', a: 'TITV', m: 15, y: 2024, v: '31 N', lessons: ['terminal'], why: 'Khớp bài 2: prompt, lệnh – tùy chọn – đối số.' },
  { id: 'w8s6gL2LiMg', g: 'Tiếng Việt – Linux cơ bản', t: 'LPI – Tự học Linux Bài 06: Cấu trúc cây thư mục', a: 'TITV', m: 10, y: 2024, v: '30 N', lessons: ['gioi-thieu', 'thu-muc'], why: 'Hiểu /, /etc, /home, /var… (bài 1 và 3).' },
  { id: 'FCYkyJVmxDg', g: 'Tiếng Việt – Linux cơ bản', t: 'Tự học Linux #1: Các lệnh cơ bản và thủ thuật khi gõ lệnh', a: 'Sharky Lập Trình', m: 19, y: 2022, v: '81 N', lessons: ['terminal', 'thu-muc', 'tap-tin'], why: 'Lệnh cơ bản + mẹo Tab/mũi tên.' },
  { id: 'vQzBCmzuSzs', g: 'Tiếng Việt – Linux cơ bản', t: 'LPI – Tự học Linux Bài 10: Các lệnh quản lý file và thư mục', a: 'TITV', m: 49, y: 2024, v: '33 N', lessons: ['tap-tin'], why: 'Bài giảng dài, đủ cp/mv/rm/find (bài 4).' },
  { id: 't-ZHMrUGMpY', g: 'Tiếng Việt – Linux cơ bản', t: 'LPI – Tự học Linux Bài 08: Lệnh sudo và mật khẩu root', a: 'TITV', m: 10, y: 2024, v: '26 N', lessons: ['phan-quyen'], why: 'Hiểu sudo/root (bài 5).' },
  { id: 'Nv8tEj1DejQ', g: 'Tiếng Việt – Linux cơ bản', t: 'LPI – Tự học Linux Bài 27: Các câu lệnh quản trị người dùng', a: 'TITV', m: 19, y: 2024, v: '5 N', lessons: ['phan-quyen'], why: 'useradd/usermod/userdel (bài 5).' },
  { id: '67rT06t1Q8w', g: 'Tiếng Việt – Linux cơ bản', t: 'Sử dụng dòng lệnh (Command Line) để trở thành Coder thần thánh', a: 'Vũ Nguyễn Coder', m: 37, y: 2021, v: '209 N', lessons: ['terminal'], why: 'Góc nhìn "vì sao dân lập trình cần dòng lệnh".' },
  { id: 'WuvA-Lp_U7g', g: 'Tiếng Việt – Linux cơ bản', t: 'Toàn bộ kiến thức hệ điều hành Linux áp dụng trong công việc', a: 'Trần Quốc Huy – Wecommit', m: 30, y: 2023, v: '64 N', lessons: ['van-hanh'], why: 'Tổng quan thực tế đi làm – xem sau khi học xong.' },
  // ---- English ----
  { id: 'gd7BXuUQ91w', g: 'English – ngắn, dễ nhớ', t: '60 Linux Commands you NEED to know (in 10 minutes)', a: 'NetworkChuck', m: 11, y: 2022, v: '2,6 Tr', lessons: ['tap-tin'], why: 'Ôn nhanh toàn bộ lệnh thường dùng.' },
  { id: 'hREnP0HslK8', g: 'English – ngắn, dễ nhớ', t: 'Linux Terminal Crash Course – For Absolute Beginners', a: 'NeuralNine', m: 52, y: 2025, v: '13 N', lessons: ['thu-muc', 'tap-tin', 'phan-quyen'], why: 'Nhanh, thực hành: điều hướng, quyền, tiến trình.' },
  { id: '6WatcfENsOU', g: 'English – khóa dài', t: 'Linux Crash Course for Beginners with Labs', a: 'freeCodeCamp.org', m: 141, y: 2024, v: '321 N', lessons: ['phan-quyen', 'van-hanh'], why: 'Có lab đi kèm: file, quyền, user.' },
  { id: 'sWbUDq4S6Y8', g: 'English – khóa dài', t: 'Introduction to Linux – Full Course for Beginners', a: 'freeCodeCamp.org', m: 368, y: 2023, v: '3,5 Tr', lessons: ['gioi-thieu'], why: 'Khóa nền tảng đầy đủ nhất (6 tiếng) – xem dần.' },
  { id: 'tK9Oc6AEnR4', g: 'English – Bash script', t: 'Bash Scripting Tutorial for Beginners', a: 'freeCodeCamp.org', m: 48, y: 2023, v: '1,2 Tr', lessons: ['shell-script'], why: 'Biến, if, vòng lặp, hàm – khớp bài 8.' },
  { id: 'PNhq_4d-5ek', g: 'English – Bash script', t: 'Bash Scripting Tutorial for Beginners', a: 'TechWorld with Nana', m: 66, y: 2025, v: '345 N', lessons: ['shell-script'], why: 'Hướng DevOps, ví dụ thực tế.' },
  // ---- Git / GitHub ----
  { id: '1JuYQgpbrW0', g: 'Git & GitHub (để đăng web)', t: 'Từ gà tới pro Git và Github trong 20 phút', a: 'Phạm Huy Hoàng', m: 18, y: 2019, v: '894 N', lessons: ['publish'], why: 'Tiếng Việt, nắm khái niệm commit/push. (Video 2019: giao diện GitHub đã đổi chút.)' },
  { id: 'e5AwNU3Y2es', g: 'Git & GitHub (để đăng web)', t: 'How to Host a Website on GitHub Pages Free', a: 'IdeaSpot', m: 6, y: 2024, v: '524 N', lessons: ['publish'], why: 'Đúng thao tác đăng web tĩnh bằng GitHub Pages.' },
  { id: '5XhxR9Vs6zc', g: 'Git & GitHub (để đăng web)', t: 'How to Use GitHub Pages (Beginner\'s Guide)', a: 'The Common Coder', m: 7, y: 2024, v: '148 N', lessons: ['publish'], why: 'Hướng dẫn GitHub Pages từ đầu.' },
  // ---- API / AI ----
  { id: '7ooASvse2mw', g: 'API & khóa API (AI)', t: 'Giải thích đơn giản nhất API là gì', a: 'Phổ Cập Lập Trình', m: 2, y: 2023, v: '8,7 N', lessons: ['publish'], why: 'Hiểu API trong 2 phút.' },
  { id: 'OGAjIhmXsKQ', g: 'API & khóa API (AI)', t: 'Hướng dẫn chi tiết cách tạo API key của Google AI Studio', a: 'Ứng dụng AI vào giảng dạy', m: 9, y: 2026, v: '1,3 N', lessons: ['publish'], why: 'Thao tác lấy key từng bước (video mới 2026).' },
  { id: 'jEGxfZk1Bik', g: 'API & khóa API (AI)', t: 'Hướng dẫn cách lấy API Key từ AI Studio Google', a: 'Thầy Lam TV', m: 2, y: 2026, v: '1,9 N', lessons: ['publish'], why: 'Bản rút gọn 2 phút.' }
];
