/* Kỹ năng thực chiến: đọc hiểu code, xử lý sự cố, checklist cuối khóa.
 * Mục tiêu: sau khóa học bạn ĐỌC được script ngắn (hoặc đoạn lệnh AI viết), hiểu ý chính và tự xử lý các sự cố cơ bản. */

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
    id: 'dem-file', title: 'Script 2 – Đếm file .txt an toàn', level: 'Dễ', lesson: 'shell-script',
    what: 'Duyệt qua các file .txt trong thư mục hiện tại và đếm chính xác kể cả khi thư mục trống.',
    code: '#!/bin/bash\ndem=0\nfor f in *.txt; do\n  [ -f "$f" ] || continue\n  dem=$((dem + 1))\ndone\necho "Có $dem file .txt"',
    steps: [
      ['dem=0', 'Tạo biến đếm, bắt đầu từ 0.'],
      ['for f in *.txt; do', '*.txt được shell mở ra thành danh sách các file .txt. Lưu ý: nếu KHÔNG có file .txt nào, bash giữ nguyên chuỗi "*.txt" làm 1 phần tử!'],
      ['[ -f "$f" ] || continue', 'Kiểm tra "$f" có phải file thật (-f) không. Ký hiệu || nghĩa là "nếu vế trái SAI thì làm vế phải": bỏ qua vòng này (continue) nếu không có file .txt nào thật.'],
      ['dem=$((dem + 1))', '$(( … )) là phép tính số học: tăng biến đếm thêm 1 mỗi khi gặp file thật.'],
      ['done', 'Hết vòng lặp.'],
      ['echo "Có $dem file .txt"', 'In kết quả chính xác (kể cả trường hợp 0 file).']
    ],
    q: { q: 'Nếu bỏ dòng "[ -f \"$f\" ] || continue" mà chạy trong thư mục KHÔNG có file .txt nào thì chuyện gì xảy ra?', o: ['In "Có 0 file .txt"', 'Đếm nhầm thành "Có 1 file .txt" vì chuỗi "*.txt" giữ nguyên', 'Máy bị treo', 'Xóa hết file'], a: 1, why: 'Khi không khớp file nào, *.txt giữ nguyên thành chuỗi "*.txt", vòng lặp vẫn chạy 1 lần nếu không kiểm tra [ -f "$f" ].' }
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
    id: 'one-liner', title: 'Một dòng lệnh – Đếm tiến trình (Pipe vs pgrep)', level: 'Trung bình', lesson: 'tap-tin',
    what: 'So sánh cách ghép ống cổ điển (ps | grep | wc) với lệnh chuyên dụng pgrep -c.',
    code: '# Cách 1 (luyện ghép ống pipe):\nps aux | grep nginx | grep -v grep | wc -l\n\n# Cách 2 (ngắn gọn, chuẩn thực tế):\npgrep -c nginx',
    steps: [
      ['ps aux', 'Liệt kê TẤT CẢ tiến trình đang chạy.'],
      ['| grep nginx', 'Chỉ giữ các dòng có chữ nginx.'],
      ['| grep -v grep', '-v = đảo ngược: bỏ dòng chứa "grep" (vì chính lệnh grep nginx cũng xuất hiện trong danh sách tiến trình).'],
      ['| wc -l', 'Đếm số dòng còn lại = số tiến trình khớp.'],
      ['pgrep -c nginx', 'Lệnh chuyên dụng tìm thẳng tiến trình theo tên và đếm (-c) mà không sợ đếm nhầm chính lệnh grep.']
    ],
    q: { q: 'Vì sao ở Cách 1 lại cần thêm "| grep -v grep"?', o: ['Để chạy nhanh hơn', 'Để loại bỏ chính tiến trình "grep nginx" khỏi kết quả đếm', 'Để sắp xếp thứ tự', 'Để xóa tiến trình nginx'], a: 1, why: 'Khi chạy ps aux | grep nginx, bản thân lệnh grep nginx cũng có chữ "nginx" nên cần grep -v grep để loại ra (hoặc dùng pgrep -c nginx).' }
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
  },
  {
    id: 'ai-chain', title: 'Script 7 – Cú pháp AI hay viết (set -e, &&, ||)', level: 'Thực tế', lesson: 'shell-script',
    what: 'Khi nhờ AI viết lệnh tự động hóa, bạn sẽ luôn gặp set -e, && và ||. Đọc hiểu đoạn này giúp bạn kiểm soát những gì AI sắp chạy.',
    code: '#!/bin/bash\nset -e\nmkdir -p ~/du-an/logs && cd ~/du-an\ncp ~/ghichu.txt ./ban-sao.txt && chmod 600 ./ban-sao.txt\n[ -f ./ban-sao.txt ] && echo "Thành công!" || echo "Thất bại!"',
    steps: [
      ['set -e', 'Bật chế độ an toàn: nếu bất kỳ lệnh nào bên dưới bị lỗi, dừng ngay toàn bộ script (không chạy tiếp các lệnh sau tránh làm hỏng thêm).'],
      ['mkdir -p ~/du-an/logs && cd ~/du-an', 'Toán tử && nghĩa là "chỉ chạy lệnh sau NẾU lệnh trước thành công". Tạo xong thư mục mới đi vào đó.'],
      ['cp ~/ghichu.txt ./ban-sao.txt && chmod 600 ./ban-sao.txt', 'Sao chép thành công thì khóa quyền file bản sao thành 600 (chỉ chủ sở hữu đọc/ghi).'],
      ['[ -f ./ban-sao.txt ] && echo "Thành công!" || echo "Thất bại!"', 'Kiểu viết tắt của if/else: kiểm tra file tồn tại → đúng thì in Thành công, sai thì in Thất bại.']
    ],
    q: { q: 'Trong chuỗi "lệnh_A && lệnh_B", khi nào lệnh_B được chạy?', o: ['Luôn luôn chạy', 'Chỉ chạy khi lệnh_A thành công (không lỗi)', 'Chỉ chạy khi lệnh_A bị lỗi', 'Chạy song song cùng lúc'], a: 1, why: '&& yêu cầu lệnh_A thành công (mã thoát = 0) thì mới chạy lệnh_B.' }
  },
  {
    id: 'find-tar', title: 'Script 8 – Tìm kiếm & đóng gói nén (find + tar)', level: 'Thực tế', lesson: 'van-hanh',
    what: 'Tìm tất cả các file cấu hình .conf trong dự án và đóng gói nén thư mục thành một file .tar.gz duy nhất.',
    code: '#!/bin/bash\nmkdir -p ~/backup\nfind ~/du-an -name "*.conf" > ~/backup/ds-conf.txt\ntar -czf ~/backup/du-an.tar.gz ~/du-an\nls -lh ~/backup/du-an.tar.gz',
    steps: [
      ['mkdir -p ~/backup', 'Đảm bảo thư mục chứa bản sao lưu đã tồn tại.'],
      ['find ~/du-an -name "*.conf" > ~/backup/ds-conf.txt', 'Tìm đệ quy mọi file có đuôi .conf trong ~/du-an và ghi danh sách đường dẫn vào file ds-conf.txt.'],
      ['tar -czf ~/backup/du-an.tar.gz ~/du-an', 'Đóng gói và nén thư mục ~/du-an: -c (create tạo mới), -z (nén gzip), -f (tên file đầu ra đứng ngay sau).'],
      ['ls -lh ~/backup/du-an.tar.gz', 'Kiểm tra lại file nén vừa tạo với kích thước dễ đọc (-h: KB, MB).']
    ],
    q: { q: 'Trong lệnh "tar -czf backup.tar.gz thu-muc/", chữ "-c", "-z", "-f" lần lượt có nghĩa là gì?', o: ['Copy – Zip – Folder', 'Create (tạo gói) – gzip (nén) – File (chỉ định tên file)', 'Check – Zero – Force', 'Cut – Zoom – Find'], a: 1, why: '-c tạo archive mới, -z nén bằng gzip (.tar.gz), -f chỉ định tên file archive.' }
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
      ['ls -ld thu_muc_cha', 'Thư mục cha có quyền x (đi vào) cho mình không? Thiếu quyền x trên thư mục thì không cd vào được!'],
      ['chmod u+x script.sh', 'Nếu là script không chạy được: thêm quyền thực thi cho chủ sở hữu.'],
      ['sudo lenh', 'Nếu là việc quản trị hệ thống (sửa /etc, cài gói, bật dịch vụ) thì mới dùng sudo.']
    ],
    note: 'KHÔNG chữa bằng chmod 777. Xác định ai cần quyền gì rồi cấp đúng, tối thiểu.'
  },
  {
    id: 'o-dia-day', icon: '💽', title: 'Ổ đĩa đầy / hết dung lượng',
    sign: 'Báo "No space left on device", hệ thống chậm hoặc dịch vụ không ghi được dữ liệu.',
    steps: [
      ['df -h', 'Phân vùng nào đang đầy (cột Use%)?'],
      ['du -sh /var/*', 'Thư mục con nào trong /var nặng nhất?'],
      ['du -ah /var/log | sort -r | head -n 10', 'Kiểm tra các file/thư mục lớn trong /var/log (log thường là thủ phạm).'],
      ['df -i', 'Nếu df -h còn trống mà vẫn lỗi: có thể hết inode (quá nhiều file nhỏ).']
    ],
    note: 'Trước khi xóa, đọc kỹ đó là file gì. Với log: nén (tar -czf) hoặc xoay vòng (logrotate) an toàn hơn xóa thẳng.'
  },
  {
    id: 'dich-vu-loi', icon: '⚙️', title: 'Dịch vụ không chạy (ví dụ nginx/sshd)',
    sign: 'Web không vào được, SSH không kết nối, systemctl báo inactive/failed.',
    steps: [
      ['systemctl status nginx', 'Triệu chứng: active (running) hay inactive/failed? Có dòng lỗi gần nhất.'],
      ['journalctl -u nginx -n 20', 'Nguyên nhân: đọc các dòng log gần nhất của dịch vụ.'],
      ['sudo systemctl restart nginx', 'Khởi động lại dịch vụ (cần sudo).'],
      ['systemctl is-active nginx', 'Xác nhận dịch vụ đã về trạng thái active.']
    ],
    note: 'Quy trình chuẩn: triệu chứng (status) → nguyên nhân (journalctl) → sửa/khởi động lại (sudo systemctl start/restart) → kiểm tra lại.'
  },
  {
    id: 'mang', icon: '🌐', title: 'Không vào được mạng / SSH không kết nối',
    sign: 'Không ping được, không duyệt web, ssh bị timeout.',
    steps: [
      ['ip a', 'Card mạng có địa chỉ IP chưa?'],
      ['ip route', 'Xem cổng ra mạng (default gateway) là IP nào.'],
      ['ping -c 3 8.8.8.8', 'Ra Internet bằng IP được không?'],
      ['ping -c 3 google.com', 'Được IP mà không được tên miền → lỗi DNS.'],
      ['systemctl status sshd', 'Nếu không SSH vào được: dịch vụ sshd trên máy đích có đang chạy không?']
    ],
    note: 'Khoanh vùng theo tầng: IP → gateway → Internet → DNS → dịch vụ. Đừng đoán, hãy kiểm từng tầng.'
  },
  {
    id: 'treo', icon: '🐢', title: 'Máy chậm / chương trình bị treo',
    sign: 'Giật lag, một chương trình không phản hồi.',
    steps: [
      ['ps aux', 'Xem danh sách tiến trình kèm PID, %CPU, %MEM.'],
      ['pgrep -l nginx', 'Tìm nhanh PID của tiến trình theo tên.'],
      ['free -h', 'RAM và swap còn trống bao nhiêu?'],
      ['kill 1234', 'Yêu cầu tiến trình (PID 1234) dừng lịch sự (trên máy thật).'],
      ['kill -9 1234', 'Chỉ khi kill thường không được: cưỡng chế dừng.']
    ],
    note: 'Kiểm tra kỹ PID trước khi kill. Tắt nhầm tiến trình hệ thống có thể làm treo cả máy.'
  },
  {
    id: 'lenh-cu', icon: '🕘', title: 'Quên mình đã gõ lệnh gì / muốn hiểu một lệnh lạ',
    sign: 'Cần lặp lại lệnh cũ, hoặc gặp lệnh trên mạng mà chưa hiểu.',
    steps: [
      ['history', 'Xem danh sách các lệnh đã gõ trong phiên.'],
      ['man ten_lenh', 'Sổ tay mô tả và ví dụ của lệnh.'],
      ['ten_lenh --help', 'Tóm tắt nhanh các tùy chọn (trên máy thật).']
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
  ['Đọc ls -l, hiểu quyền rwx trên cả file lẫn thư mục, giải thích 644/755/600', 'phan-quyen'],
  ['Biết khi nào dùng sudo; tạo user, thêm nhóm đúng cách', 'phan-quyen'],
  ['Kiểm tra mạng theo tầng (ip a → ip route → ping IP → ping tên miền)', 'mang-ssh'],
  ['Tìm kiếm file bằng find và đóng gói nén bằng tar -czf', 'van-hanh'],
  ['Chẩn đoán và bật lại dịch vụ bằng systemctl status, journalctl, sudo systemctl start', 'van-hanh'],
  ['Đọc hiểu một script bash ngắn (biến, if, for, &&, ||, set -e) và nói được ý chính', 'shell-script'],
  ['Tự xử lý ≥ 3 sự cố trong Cẩm nang mà không cần xem đáp án', 'problems']
];
