/* Kỹ năng thực chiến: đọc hiểu code, xử lý sự cố, checklist cuối khóa.
 * Mục tiêu: sau khóa học bạn ĐỌC được script ngắn, hiểu ý chính và tự xử lý các sự cố cơ bản. */

window.READING = [
  {
    id: 'chao', title: 'Script 1 – Chào theo tên', level: 'Dễ', lesson: 'shell-script',
    what: 'Script nhận một tên qua tham số và chào lại. Thiếu tham số thì hướng dẫn cách dùng.',
    code: '#!/bin/bash\nten="$1"\nif [ -z "$ten" ]; then\n  echo "Cách dùng: ./chao.sh TEN"\n  exit 1\nfi\necho "Xin chào, $ten!"',
    steps: [
      ['#!/bin/bash', 'Dòng "shebang": nói hệ thống dùng bash để chạy file này.'],
      ['ten="$1"', 'Lấy tham số thứ nhất người dùng gõ sau tên script, gán vào biến ten. (Không có dấu cách quanh dấu =)'],
      ['if [ -z "$ten" ]; then', '-z nghĩa là "chuỗi rỗng". Nếu biến ten rỗng (người dùng không gõ tên) thì vào nhánh dưới.'],
      ['echo "Cách dùng…"; exit 1', 'In hướng dẫn rồi thoát với mã 1 (mã khác 0 = có lỗi).'],
      ['fi', 'Kết thúc khối if (fi là if viết ngược).'],
      ['echo "Xin chào, $ten!"', 'Đến đây là đã có tên → in lời chào.']
    ],
    q: { q: 'Chạy ./chao.sh (không gõ tên) thì kết quả là gì?', o: ['In "Xin chào, !"', 'In "Cách dùng: ./chao.sh TEN" rồi dừng', 'Báo lỗi cú pháp', 'Không in gì'], a: 1, why: 'ten rỗng → điều kiện -z đúng → in hướng dẫn và exit 1.' }
  },
  {
    id: 'dem-file', title: 'Script 2 – Đếm file .txt', level: 'Dễ', lesson: 'shell-script',
    what: 'Duyệt qua các file .txt trong thư mục hiện tại và đếm xem có bao nhiêu file.',
    code: '#!/bin/bash\ndem=0\nfor f in *.txt; do\n  dem=$((dem + 1))\ndone\necho "Có $dem file .txt"',
    steps: [
      ['dem=0', 'Tạo biến đếm, bắt đầu từ 0.'],
      ['for f in *.txt; do', '*.txt được shell mở ra thành danh sách các file .txt. Vòng lặp lần lượt gán từng file vào biến f.'],
      ['dem=$((dem + 1))', '$(( … )) là phép tính số học: tăng biến đếm thêm 1 mỗi vòng.'],
      ['done', 'Hết vòng lặp.'],
      ['echo "Có $dem file .txt"', 'In kết quả.']
    ],
    q: { q: 'Thư mục có a.txt, b.txt, c.log. Script in ra gì?', o: ['Có 3 file .txt', 'Có 2 file .txt', 'Có 0 file .txt', 'Có 1 file .txt'], a: 1, why: 'Chỉ a.txt và b.txt khớp *.txt; c.log không khớp.' }
  },
  {
    id: 'sao-luu', title: 'Script 3 – Sao lưu có ghi log', level: 'Trung bình', lesson: 'shell-script',
    what: 'Sao chép thư mục linux-lab sang thư mục backup (tên kèm ngày) và ghi một dòng vào file log.',
    code: '#!/bin/bash\nnguon="$HOME/linux-lab"\ndich="$HOME/backup"\nmkdir -p "$dich"\ncp -r "$nguon" "$dich/lab-$(date +%Y%m%d)"\necho "$(date) da sao luu" >> "$dich/backup.log"',
    steps: [
      ['nguon="$HOME/linux-lab"', '$HOME là thư mục home của bạn. Biến nguon là nơi cần sao lưu.'],
      ['dich="$HOME/backup"', 'Biến dich là nơi chứa bản sao.'],
      ['mkdir -p "$dich"', 'Tạo thư mục đích nếu chưa có (-p: không báo lỗi nếu đã tồn tại).'],
      ['cp -r "$nguon" "$dich/lab-$(date +%Y%m%d)"', 'Sao chép cả thư mục (-r). $(date +%Y%m%d) chèn ngày hôm nay, ví dụ 20261102, vào tên thư mục bản sao.'],
      ['echo "$(date) da sao luu" >> "$dich/backup.log"', '>> là GHI NỐI: mỗi lần chạy thêm một dòng mới vào cuối backup.log, không xóa dòng cũ.']
    ],
    q: { q: 'Nếu thay ">>" bằng ">" ở dòng cuối thì điều gì thay đổi?', o: ['Không khác gì', 'Mỗi lần chạy sẽ xóa log cũ, chỉ còn 1 dòng mới nhất', 'Script báo lỗi', 'Log được lưu vào thư mục khác'], a: 1, why: '">" ghi đè toàn bộ file. Nên dùng ">>" cho log.' }
  },
  {
    id: 'dich-vu', title: 'Script 4 – Kiểm tra dịch vụ', level: 'Trung bình', lesson: 'van-hanh',
    what: 'Kiểm tra dịch vụ sshd có đang chạy không và gợi ý cách khởi động nếu đã dừng.',
    code: '#!/bin/bash\ndichvu="sshd"\nif systemctl is-active --quiet "$dichvu"; then\n  echo "$dichvu đang chạy"\nelse\n  echo "$dichvu đã dừng - thử: sudo systemctl start $dichvu"\nfi',
    steps: [
      ['dichvu="sshd"', 'Tên dịch vụ cần kiểm tra (đổi thành nginx, httpd… tùy ý).'],
      ['if systemctl is-active --quiet "$dichvu"; then', 'systemctl is-active hỏi "dịch vụ đang chạy không?". --quiet nghĩa là KHÔNG in gì ra màn hình, chỉ trả về mã thoát (0 = đang chạy). if dựa vào mã thoát đó.'],
      ['echo "… đang chạy"', 'Nhánh khi lệnh trên thành công.'],
      ['else … echo "… đã dừng - thử: …"', 'Nhánh còn lại: dịch vụ không chạy → in gợi ý lệnh khởi động.']
    ],
    q: { q: 'Vì sao lệnh systemctl is-active --quiet không in gì mà if vẫn biết kết quả?', o: ['Vì if tự đọc log', 'Vì if dựa vào mã thoát (0 = thành công) của lệnh', 'Vì --quiet làm lệnh luôn đúng', 'Vì systemctl ghi vào file'], a: 1, why: 'Trong shell, if kiểm tra mã thoát: 0 là đúng/thành công, khác 0 là sai/lỗi.' }
  },
  {
    id: 'one-liner', title: 'Một dòng lệnh – Đếm tiến trình nginx', level: 'Trung bình', lesson: 'tap-tin',
    what: 'Chuỗi lệnh nối bằng pipe để đếm số tiến trình nginx đang chạy.',
    code: 'ps aux | grep nginx | grep -v grep | wc -l',
    steps: [
      ['ps aux', 'Liệt kê TẤT CẢ tiến trình đang chạy.'],
      ['| grep nginx', 'Chỉ giữ các dòng có chữ nginx.'],
      ['| grep -v grep', '-v = đảo ngược: bỏ dòng chứa "grep" (vì chính lệnh grep nginx cũng xuất hiện trong danh sách tiến trình).'],
      ['| wc -l', 'Đếm số dòng còn lại = số tiến trình nginx.']
    ],
    q: { q: 'Kết quả cuối cùng của dòng lệnh là gì?', o: ['Tên các tiến trình nginx', 'Một con số: số tiến trình nginx', 'Dung lượng RAM của nginx', 'Lỗi nếu nginx chưa cài'], a: 1, why: 'wc -l ở cuối chỉ in một số: số dòng.' }
  },
  {
    id: 'cron', title: 'Dòng cron – Lập lịch sao lưu', level: 'Trung bình', lesson: 'van-hanh',
    what: 'Một dòng trong crontab: chạy script định kỳ và ghi mọi thông báo vào file log.',
    code: '*/10 * * * * /home/an/backup.sh >> /home/an/backup.log 2>&1',
    steps: [
      ['*/10', 'Phút: mỗi 10 phút.'],
      ['* * * *', 'Giờ, ngày, tháng, thứ: dấu * nghĩa là "mọi giá trị".'],
      ['/home/an/backup.sh', 'Script cần chạy – dùng đường dẫn TUYỆT ĐỐI vì cron có môi trường rất tối giản.'],
      ['>> /home/an/backup.log', 'Nối kết quả in ra bình thường (stdout) vào file log.'],
      ['2>&1', 'Gộp luôn thông báo LỖI (kênh số 2) vào cùng chỗ với kênh số 1 để log có cả lỗi.']
    ],
    q: { q: 'Dòng này chạy script vào lúc nào?', o: ['10 giờ sáng hằng ngày', 'Mỗi 10 phút', 'Mỗi 10 giờ', 'Ngày 10 mỗi tháng'], a: 1, why: '*/10 ở trường PHÚT = cứ mỗi 10 phút.' }
  }
];

window.PLAYBOOK = [
  {
    id: 'khong-thay-file', icon: '🔎', title: 'Không tìm thấy file / "No such file or directory"',
    sign: 'Lệnh báo No such file or directory, hoặc bạn không nhớ file nằm ở đâu.',
    steps: [
      ['pwd', 'Mình đang đứng ở đâu? Sai chỗ đứng là nguyên nhân số 1.'],
      ['ls -la', 'Có file ở đây không? Nhớ file ẩn và đúng chữ hoa/thường.'],
      ['find ~ -name "baocao*"', 'Tìm trong thư mục home theo tên (dấu * là ký tự đại diện).'],
      ['find / -name "sshd_config" 2>/dev/null', 'Tìm toàn hệ thống; 2>/dev/null ẩn bớt lỗi Permission denied gây rối mắt.']
    ],
    note: 'Gõ nhầm chữ hoa/thường (File.txt ≠ file.txt) là lỗi rất hay gặp. Dùng phím Tab để hệ thống tự điền tên chuẩn.'
  },
  {
    id: 'permission', icon: '🔐', title: 'Lỗi "Permission denied"',
    sign: 'Không đọc/ghi/chạy được file, hoặc không vào được thư mục.',
    steps: [
      ['ls -l ten_file', 'Xem quyền (rwx) và chủ sở hữu của file.'],
      ['id', 'Mình là ai, thuộc nhóm nào? So với chủ sở hữu/nhóm của file.'],
      ['ls -ld thu_muc_cha', 'Thư mục cha có quyền x (đi vào) cho mình không?'],
      ['chmod u+x script.sh', 'Nếu là script không chạy được: thêm quyền thực thi cho chủ sở hữu.'],
      ['sudo lenh', 'Nếu là việc quản trị hệ thống (sửa /etc, cài gói) thì mới dùng sudo.']
    ],
    note: 'KHÔNG chữa bằng chmod 777. Xác định ai cần quyền gì rồi cấp đúng, tối thiểu.'
  },
  {
    id: 'o-dia-day', icon: '💽', title: 'Ổ đĩa đầy / hết dung lượng',
    sign: 'Báo "No space left on device", hệ thống chậm hoặc dịch vụ không ghi được dữ liệu.',
    steps: [
      ['df -h', 'Phân vùng nào đang đầy (cột Use%)?'],
      ['du -sh /var/* 2>/dev/null | sort -h', 'Thư mục con nào nặng nhất? (sort -h sắp xếp theo kích thước dễ đọc).'],
      ['du -ah /var/log | sort -rh | head -n 10', 'Top 10 file/thư mục lớn nhất trong /var/log (log thường là thủ phạm).'],
      ['df -i', 'Nếu df -h còn trống mà vẫn lỗi: có thể hết inode (quá nhiều file nhỏ).']
    ],
    note: 'Trước khi xóa, đọc kỹ đó là file gì. Với log: nén hoặc xoay vòng (logrotate) an toàn hơn xóa thẳng.'
  },
  {
    id: 'dich-vu-loi', icon: '⚙️', title: 'Dịch vụ không chạy (ví dụ nginx/sshd)',
    sign: 'Web không vào được, SSH không kết nối, systemctl báo failed.',
    steps: [
      ['systemctl status nginx', 'Triệu chứng: active (running) hay failed? Có dòng lỗi gần nhất.'],
      ['journalctl -u nginx -n 50', 'Nguyên nhân: đọc 50 dòng log gần nhất của dịch vụ.'],
      ['sudo nginx -t', 'Kiểm tra cú pháp file cấu hình (nhiều dịch vụ có lệnh kiểm tra tương tự).'],
      ['sudo systemctl restart nginx', 'Sau khi sửa cấu hình: khởi động lại.'],
      ['ss -tuln', 'Cổng dịch vụ đã lắng nghe chưa? Cổng bị chương trình khác chiếm cũng gây lỗi.']
    ],
    note: 'Quy trình: triệu chứng → nguyên nhân (log) → sửa → khởi động lại → kiểm tra lại. Ghi vào nhật ký lab.'
  },
  {
    id: 'mang', icon: '🌐', title: 'Không vào được mạng / SSH không kết nối',
    sign: 'Không ping được, không duyệt web, ssh bị timeout.',
    steps: [
      ['ip a', 'Card mạng có địa chỉ IP chưa?'],
      ['ping -c 3 <gateway>', 'Thông tới cổng ra mạng (gateway)? Xem gateway bằng "ip route".'],
      ['ping -c 3 8.8.8.8', 'Ra Internet bằng IP được không?'],
      ['ping -c 3 google.com', 'Được IP mà không được tên miền → lỗi DNS.'],
      ['sudo firewall-cmd --list-all', 'Dịch vụ (ssh/http) đã được tường lửa cho phép chưa?']
    ],
    note: 'Khoanh vùng theo tầng: IP → gateway → Internet → DNS → tường lửa/dịch vụ. Đừng đoán, hãy kiểm từng tầng.'
  },
  {
    id: 'treo', icon: '🐢', title: 'Máy chậm / chương trình bị treo',
    sign: 'Giật lag, một chương trình không phản hồi.',
    steps: [
      ['top', 'Ai đang ăn CPU/RAM nhất? (thoát bằng q).'],
      ['ps aux --sort=-%mem | head -n 5', 'Top 5 tiến trình dùng nhiều RAM.'],
      ['free -h', 'RAM và swap còn bao nhiêu?'],
      ['kill 1234', 'Yêu cầu tiến trình (PID 1234) dừng lịch sự.'],
      ['kill -9 1234', 'Chỉ khi kill thường không được: cưỡng chế dừng.']
    ],
    note: 'Kiểm tra kỹ PID trước khi kill. Tắt nhầm tiến trình hệ thống có thể làm treo cả máy.'
  },
  {
    id: 'lenh-cu', icon: '🕘', title: 'Quên mình đã gõ lệnh gì / muốn hiểu một lệnh lạ',
    sign: 'Cần lặp lại lệnh cũ, hoặc gặp lệnh trên mạng mà chưa hiểu.',
    steps: [
      ['history | grep ssh', 'Tìm lại các lệnh cũ có chữ ssh. Gõ !123 để chạy lại lệnh số 123.'],
      ['man ten_lenh', 'Sổ tay đầy đủ (thoát bằng q).'],
      ['ten_lenh --help', 'Tóm tắt nhanh các tùy chọn.'],
      ['type ten_lenh', 'Lệnh này là chương trình, alias hay lệnh dựng sẵn?']
    ],
    note: 'Với lệnh dài, dán vào explainshell.com để nó giải thích từng phần. KHÔNG chạy lệnh bạn chưa hiểu trên máy thật.'
  }
];

window.FINAL_CHECK = [
  ['Giải thích được Linux/kernel/distro và vì sao Linux phân biệt chữ hoa/thường', 'gioi-thieu'],
  ['Đọc được prompt và phân biệt lệnh – tùy chọn – đối số', 'terminal'],
  ['Dùng pwd/ls/cd và phân biệt đường dẫn tuyệt đối vs tương đối', 'thu-muc'],
  ['Tạo, sao chép, đổi tên, xóa file/thư mục an toàn', 'tap-tin'],
  ['Dùng pipe và chuyển hướng: lọc log bằng grep, lưu kết quả ra file', 'tap-tin'],
  ['Đọc ls -l và giải thích 644/755/600 bằng lời', 'phan-quyen'],
  ['Biết khi nào dùng sudo; tạo user, thêm nhóm đúng cách', 'phan-quyen'],
  ['Kiểm tra mạng theo tầng (IP → gateway → Internet → DNS)', 'mang-ssh'],
  ['Đăng nhập SSH và hiểu khóa công khai/riêng tư', 'mang-ssh'],
  ['Cài gói, bật/tắt dịch vụ, đọc log bằng journalctl', 'van-hanh'],
  ['Đọc hiểu một script bash ngắn (biến, if, for) và nói được ý chính', 'shell-script'],
  ['Tự xử lý ≥ 3 sự cố trong Cẩm nang mà không cần xem đáp án', 'problems']
];
