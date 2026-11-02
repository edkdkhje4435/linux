/* Dữ liệu: bảng tra lệnh, thử thách thực hành, tài nguyên. Bạn có toàn quyền chỉnh sửa. */

window.CHEATSHEET = [
  // Điều hướng
  { g: 'Điều hướng', cmd: 'pwd', desc: 'Hiển thị thư mục hiện tại.', ex: 'pwd' },
  { g: 'Điều hướng', cmd: 'ls', desc: 'Liệt kê file/thư mục. -l chi tiết, -a hiện file ẩn, -d xem chính thư mục.', ex: 'ls -la' },
  { g: 'Điều hướng', cmd: 'cd', desc: 'Đổi thư mục. cd .. lên cấp trên, cd ~ về home, cd - về chỗ trước.', ex: 'cd /etc' },
  { g: 'Điều hướng', cmd: 'tree', desc: 'Hiển thị cây thư mục (trên máy thật có thể cần cài thêm).', ex: 'tree -L 2' },
  // File
  { g: 'Tập tin', cmd: 'mkdir', desc: 'Tạo thư mục. -p tạo cả chuỗi thư mục lồng nhau.', ex: 'mkdir -p du-an/src' },
  { g: 'Tập tin', cmd: 'touch', desc: 'Tạo file rỗng hoặc cập nhật thời gian sửa.', ex: 'touch a.txt' },
  { g: 'Tập tin', cmd: 'cp', desc: 'Sao chép. -r cho thư mục.', ex: 'cp -r thumuc1 thumuc2' },
  { g: 'Tập tin', cmd: 'mv', desc: 'Di chuyển hoặc đổi tên.', ex: 'mv cu.txt moi.txt' },
  { g: 'Tập tin', cmd: 'rm', desc: 'Xóa (KHÔNG có thùng rác). -r xóa thư mục. Cẩn thận!', ex: 'rm -r thumuc-rac' },
  { g: 'Tập tin', cmd: 'rmdir', desc: 'Xóa thư mục rỗng.', ex: 'rmdir rong' },
  { g: 'Tập tin', cmd: 'find', desc: 'Tìm file/thư mục theo tên (-name) hoặc loại (-type f/d).', ex: 'find . -name "*.txt"' },
  { g: 'Tập tin', cmd: 'ln', desc: 'Tạo liên kết. -s là liên kết mềm (symlink).', ex: 'ln -s /etc/hosts hosts-link' },
  // Nội dung
  { g: 'Nội dung', cmd: 'cat', desc: 'In toàn bộ nội dung file.', ex: 'cat ghichu.txt' },
  { g: 'Nội dung', cmd: 'less', desc: 'Xem file dài; cuộn mũi tên, / để tìm, q để thoát.', ex: 'less /var/log/messages' },
  { g: 'Nội dung', cmd: 'head', desc: 'Xem N dòng đầu.', ex: 'head -n 5 log.txt' },
  { g: 'Nội dung', cmd: 'tail', desc: 'Xem N dòng cuối. -f theo dõi trực tiếp.', ex: 'tail -f /var/log/messages' },
  { g: 'Nội dung', cmd: 'wc', desc: 'Đếm dòng/từ/ký tự. -l chỉ đếm dòng.', ex: 'wc -l log.txt' },
  { g: 'Nội dung', cmd: 'grep', desc: 'Lọc dòng theo mẫu. -i bỏ qua hoa/thường, -n hiện số dòng, -v đảo ngược.', ex: 'grep -in "error" log.txt' },
  { g: 'Nội dung', cmd: 'sort', desc: 'Sắp xếp các dòng. -r đảo ngược.', ex: 'sort ten.txt' },
  { g: 'Nội dung', cmd: 'echo', desc: 'In chuỗi. Kết hợp > (ghi đè) hoặc >> (ghi nối) để ghi file.', ex: 'echo "xin chao" > a.txt' },
  { g: 'Nội dung', cmd: 'nano', desc: 'Trình soạn thảo dễ dùng. Ctrl+O lưu, Ctrl+X thoát.', ex: 'nano ghichu.txt' },
  { g: 'Nội dung', cmd: 'vim', desc: 'Trình soạn thảo mạnh. i để gõ, Esc rồi :wq để lưu thoát, :q! để thoát bỏ.', ex: 'vim file.txt' },
  // Quyền & user
  { g: 'Quyền & người dùng', cmd: 'whoami', desc: 'Tên người dùng hiện tại.', ex: 'whoami' },
  { g: 'Quyền & người dùng', cmd: 'id', desc: 'UID, GID và các nhóm của bạn.', ex: 'id' },
  { g: 'Quyền & người dùng', cmd: 'chmod', desc: 'Đổi quyền truy cập file/thư mục. Ký hiệu (u+x) hoặc số (755, 600).', ex: 'chmod 755 script.sh' },
  { g: 'Quyền & người dùng', cmd: 'chown', desc: 'Đổi chủ sở hữu:nhóm.', ex: 'sudo chown an:lophoc file.txt' },
  { g: 'Quyền & người dùng', cmd: 'sudo', desc: 'Chạy lệnh với quyền quản trị viên (root).', ex: 'sudo systemctl restart nginx' },
  { g: 'Quyền & người dùng', cmd: 'useradd', desc: 'Tạo user. -m tạo home, -s chọn shell.', ex: 'sudo useradd -m -s /bin/bash an' },
  { g: 'Quyền & người dùng', cmd: 'passwd', desc: 'Đặt/đổi mật khẩu.', ex: 'sudo passwd an' },
  { g: 'Quyền & người dùng', cmd: 'usermod', desc: 'Sửa user. -aG thêm nhóm phụ (nhớ có -a).', ex: 'sudo usermod -aG wheel an' },
  { g: 'Quyền & người dùng', cmd: 'userdel', desc: 'Xóa user. -r xóa luôn home.', ex: 'sudo userdel -r an' },
  // Mạng
  { g: 'Mạng', cmd: 'ip', desc: 'Xem/cấu hình mạng. ip a = địa chỉ IP, ip route = cổng mặc định (gateway).', ex: 'ip a' },
  { g: 'Mạng', cmd: 'ping', desc: 'Kiểm tra kết nối tới máy khác. -c N gửi N gói.', ex: 'ping -c 4 8.8.8.8' },
  { g: 'Mạng', cmd: 'ss', desc: 'Xem cổng đang lắng nghe/kết nối.', ex: 'ss -tuln' },
  { g: 'Mạng', cmd: 'ssh', desc: 'Đăng nhập máy từ xa an toàn.', ex: 'ssh an@192.168.1.50' },
  { g: 'Mạng', cmd: 'scp', desc: 'Chép file qua SSH.', ex: 'scp a.txt an@host:~/' },
  { g: 'Mạng', cmd: 'curl', desc: 'Tải/gọi URL từ terminal.', ex: 'curl -I https://example.com' },
  { g: 'Mạng', cmd: 'hostnamectl', desc: 'Xem/đặt hostname.', ex: 'hostnamectl' },
  // Vận hành
  { g: 'Vận hành', cmd: 'dnf', desc: 'Quản lý gói (CentOS 8+/Rocky/Alma). CentOS 7 dùng yum.', ex: 'sudo dnf install nginx' },
  { g: 'Vận hành', cmd: 'apt', desc: 'Quản lý gói (Ubuntu/Debian).', ex: 'sudo apt install nginx' },
  { g: 'Vận hành', cmd: 'systemctl', desc: 'Điều khiển dịch vụ: status, is-active, start, stop, restart, enable.', ex: 'sudo systemctl start nginx' },
  { g: 'Vận hành', cmd: 'journalctl', desc: 'Đọc log systemd. -u dịch vụ, -n số dòng, -f theo dõi.', ex: 'journalctl -u nginx -n 20' },
  { g: 'Vận hành', cmd: 'ps', desc: 'Liệt kê tiến trình đang chạy.', ex: 'ps aux | grep nginx' },
  { g: 'Vận hành', cmd: 'pgrep', desc: 'Tìm/đếm tiến trình theo tên. -c đếm số lượng, -l hiện tên.', ex: 'pgrep -c nginx' },
  { g: 'Vận hành', cmd: 'top', desc: 'Theo dõi tiến trình trực tiếp. q để thoát.', ex: 'top' },
  { g: 'Vận hành', cmd: 'kill', desc: 'Gửi tín hiệu dừng tiến trình. -9 cưỡng chế.', ex: 'kill 1234' },
  { g: 'Vận hành', cmd: 'df', desc: 'Dung lượng các phân vùng đĩa. -h dễ đọc (GB/MB), -i xem inode.', ex: 'df -h' },
  { g: 'Vận hành', cmd: 'du', desc: 'Dung lượng thư mục/file. -sh tổng hợp gọn, -ah liệt kê cả file.', ex: 'du -sh /var/log' },
  { g: 'Vận hành', cmd: 'lsblk', desc: 'Liệt kê ổ đĩa và phân vùng.', ex: 'lsblk' },
  { g: 'Vận hành', cmd: 'free', desc: 'Xem dung lượng RAM và Swap.', ex: 'free -h' },
  { g: 'Vận hành', cmd: 'crontab', desc: 'Lập lịch chạy lệnh định kỳ. -e sửa, -l xem.', ex: 'crontab -e' },
  { g: 'Vận hành', cmd: 'tar', desc: 'Đóng gói & nén. -czf tạo .tar.gz, -tzf xem danh sách, -xzf giải nén.', ex: 'tar -czf backup.tar.gz thumuc/' },
  // Trợ giúp
  { g: 'Trợ giúp', cmd: 'man', desc: 'Sổ tay chi tiết của lệnh. q để thoát.', ex: 'man ls' },
  { g: 'Trợ giúp', cmd: 'clear', desc: 'Xóa màn hình (hoặc Ctrl+L).', ex: 'clear' },
  { g: 'Trợ giúp', cmd: 'history', desc: 'Xem lịch sử lệnh đã gõ.', ex: 'history' },
  { g: 'Trợ giúp', cmd: 'date', desc: 'Hiển thị ngày giờ hệ thống.', ex: 'date +%Y%m%d' },
  { g: 'Trợ giúp', cmd: 'uname', desc: 'Thông tin kernel/hệ điều hành. -a đầy đủ.', ex: 'uname -a' }
];

(function () {
  var S = window.Shell;
  var d = S.dir, f = S.file;

  function emptyHome(extra) {
    var home = extra || {};
    return d({
      home: d({ hocvien: d(home) }),
      etc: d({ hostname: f('linux-lab\n'), nginx: d({ 'nginx.conf': f('worker_processes auto;\n') }) }),
      var: d({ log: dirLog() }),
      tmp: d({})
    });
  }
  function dirLog() {
    return d({ messages: f('Nov 02 10:00:01 linux-lab systemd[1]: Started OpenSSH server daemon.\n') });
  }

  window.CHALLENGES = [
    {
      id: 'dieu-huong', title: '1. Điều hướng', level: 'Dễ', lesson: 'thu-muc',
      goal: 'Đọc nội dung file baocao.txt nằm trong thư mục Documents (bằng lệnh cat), rồi để lại terminal đang đứng ở chính thư mục Documents.',
      setup: function () { return { tree: S.defaultTree(), cwd: '/home/hocvien' }; },
      tasks: [
        { t: 'Đã dùng lệnh cat để đọc baocao.txt', c: function (sh, h) { return h.some(function (x) { return /\bcat\s+.*baocao\.txt/.test(x); }); } },
        { t: 'Đang đứng ở /home/hocvien/Documents', c: function (sh) { return sh.cwd === '/home/hocvien/Documents'; } }
      ],
      hints: ['Hãy bắt đầu bằng pwd và ls để biết mình đang ở đâu, có gì xung quanh.', 'Dùng cd Documents để vào thư mục. Sau đó cat baocao.txt.', 'Đáp án: cd Documents  rồi  cat baocao.txt']
    },
    {
      id: 'tao-file', title: '2. Tạo – sao chép – đổi tên', level: 'Dễ', lesson: 'tap-tin',
      goal: 'Tạo thư mục linux-lab trong home và đứng trong đó. Tạo file nhatky.txt có chứa chữ "hello", sao chép nó thành backup.txt, rồi đổi tên nhatky.txt thành nhatky-cu.txt.',
      setup: function () { return { tree: emptyHome({}), cwd: '/home/hocvien' }; },
      tasks: [
        { t: 'Thư mục /home/hocvien/linux-lab tồn tại và bạn đang đứng trong đó', c: function (sh) { var n = sh.node('/home/hocvien/linux-lab'); return !!n && n.type === 'dir' && sh.cwd === '/home/hocvien/linux-lab'; } },
        { t: 'backup.txt tồn tại và chứa "hello"', c: function (sh) { var x = sh.readFile('/home/hocvien/linux-lab/backup.txt'); return x != null && /hello/.test(x); } },
        { t: 'nhatky-cu.txt tồn tại và chứa "hello"', c: function (sh) { var x = sh.readFile('/home/hocvien/linux-lab/nhatky-cu.txt'); return x != null && /hello/.test(x); } },
        { t: 'nhatky.txt (tên cũ) không còn', c: function (sh) { return !sh.exists('/home/hocvien/linux-lab/nhatky.txt') && sh.exists('/home/hocvien/linux-lab/nhatky-cu.txt'); } }
      ],
      hints: ['Thứ tự gợi ý: mkdir → cd → echo ... > → cp → mv.', 'Ghi nội dung: echo hello > nhatky.txt', 'Đáp án: mkdir linux-lab && cd linux-lab && echo hello > nhatky.txt && cp nhatky.txt backup.txt && mv nhatky.txt nhatky-cu.txt']
    },
    {
      id: 'don-dep', title: '3. Dọn dẹp an toàn', level: 'Trung bình', lesson: 'tap-tin',
      goal: 'Trong home có thư mục rac (bên trong còn nhiều file) và file quan-trong.txt. Hãy xóa SẠCH thư mục rac nhưng phải giữ nguyên quan-trong.txt. (Gợi ý tư duy: dùng ls xem trước khi xóa!)',
      setup: function () {
        return { tree: emptyHome({ rac: d({ 'a.tmp': f('x'), 'b.tmp': f('y'), sub: d({ 'c.tmp': f('z') }) }), 'quan-trong.txt': f('Dữ liệu cực kỳ quan trọng\n') }), cwd: '/home/hocvien' };
      },
      tasks: [
        { t: 'Thư mục rac đã bị xóa hoàn toàn', c: function (sh) { return !sh.exists('/home/hocvien/rac'); } },
        { t: 'quan-trong.txt vẫn còn nguyên nội dung', c: function (sh) { return sh.readFile('/home/hocvien/quan-trong.txt') === 'Dữ liệu cực kỳ quan trọng\n'; } }
      ],
      hints: ['Thử rmdir rac trước và đọc lỗi – vì sao không được?', 'Thư mục có nội dung cần rm với tùy chọn đệ quy (-r).', 'Đáp án: ls rac  rồi  rm -r rac']
    },
    {
      id: 'phan-quyen', title: '4. Phân quyền file & thư mục', level: 'Trung bình', lesson: 'phan-quyen',
      goal: 'Cho script.sh quyền chạy với chủ sở hữu (vẫn giữ quyền đọc/ghi). Làm cho bimat.txt chỉ chủ sở hữu mới đọc/ghi được (600). Mở quyền đi vào (x) cho thư mục ho-so (hiện đang bị khóa quyền 000) để đọc được file bên trong.',
      setup: function () {
        return { tree: emptyHome({ 'script.sh': f('#!/bin/bash\necho hi\n', 0o644), 'bimat.txt': f('mat khau: 123\n', 0o644), 'ho-so': d({ 'ketqua.txt': f('Mo khoa thanh cong!\n') }, 0o000) }), cwd: '/home/hocvien' };
      },
      tasks: [
        { t: 'script.sh: chủ sở hữu có quyền r, w, x', c: function (sh) { var n = sh.node('/home/hocvien/script.sh'); return !!n && ((n.mode >> 6) & 7) === 7; } },
        { t: 'bimat.txt có quyền 600 (rw-------)', c: function (sh) { var n = sh.node('/home/hocvien/bimat.txt'); return !!n && n.mode === 0o600; } },
        { t: 'Thư mục ho-so đã được cấp quyền rwx cho chủ sở hữu (700 hoặc 755)', c: function (sh) { var n = sh.node('/home/hocvien/ho-so'); return !!n && ((n.mode >> 6) & 7) === 7; } }
      ],
      hints: ['Thử cd ho-so trước khi chmod để thấy lỗi Permission denied khi thư mục thiếu quyền x!', 'Dùng chmod u+x script.sh, chmod 600 bimat.txt và chmod 700 ho-so.', 'Đáp án: chmod u+x script.sh && chmod 600 bimat.txt && chmod 700 ho-so']
    },
    {
      id: 'loc-log', title: '5. Săn lỗi trong log', level: 'Khó', lesson: 'tap-tin',
      goal: 'File log.txt có nhiều dòng. (1) Ghi riêng các dòng chứa ERROR vào file loi.txt. (2) Ghi số lượng dòng ERROR vào file dem.txt (chỉ cần con số).',
      setup: function () {
        var log = '10:00 INFO khoi dong\n10:01 ERROR mat ket noi db\n10:02 INFO nguoi dung dang nhap\n10:03 WARN dia day 85%\n10:04 ERROR timeout api\n10:05 INFO dong bo xong\n10:06 ERROR het bo nho\n';
        return { tree: emptyHome({ 'log.txt': f(log) }), cwd: '/home/hocvien' };
      },
      tasks: [
        { t: 'loi.txt chứa đúng 3 dòng ERROR và không có dòng khác', c: function (sh) {
          var x = sh.readFile('/home/hocvien/loi.txt'); if (x == null) return false;
          var l = x.split('\n').filter(Boolean); return l.length === 3 && l.every(function (s) { return /ERROR/.test(s); });
        } },
        { t: 'dem.txt chứa số 3', c: function (sh) { var x = sh.readFile('/home/hocvien/dem.txt'); return x != null && x.trim() === '3'; } }
      ],
      hints: ['Dùng grep để lọc dòng, và > để lưu ra file.', 'Để đếm: ghép grep với wc -l bằng pipe, rồi chuyển hướng kết quả.', 'Đáp án: grep ERROR log.txt > loi.txt   và   grep ERROR log.txt | wc -l > dem.txt']
    },
    {
      id: 'tim-nen', title: '6. Tìm kiếm & đóng gói sao lưu', level: 'Thực tế', lesson: 'van-hanh',
      goal: 'Trong thư mục du-an có nhiều file nằm ở các thư mục con. Hãy: (1) dùng lệnh find tìm mọi file có đuôi "*.conf" trong du-an và lưu danh sách đường dẫn vào file ds-conf.txt; (2) dùng lệnh tar nén toàn bộ thư mục du-an thành file backup.tar.gz.',
      setup: function () {
        return {
          tree: emptyHome({
            'du-an': d({
              'README.md': f('# Du an\n'),
              config: d({ 'app.conf': f('port=8080\n'), 'db.conf': f('host=localhost\n') }),
              src: d({ 'main.sh': f('echo ok\n') })
            })
          }),
          cwd: '/home/hocvien'
        };
      },
      tasks: [
        { t: 'ds-conf.txt chứa đường dẫn của cả app.conf và db.conf', c: function (sh) {
          var x = sh.readFile('/home/hocvien/ds-conf.txt');
          return x != null && /app\.conf/.test(x) && /db\.conf/.test(x) && !/main\.sh/.test(x);
        } },
        { t: 'backup.tar.gz là gói tar hợp lệ chứa thư mục du-an', c: function (sh) {
          var raw = sh.readFile('/home/hocvien/backup.tar.gz'); if (!raw) return false;
          try { var j = JSON.parse(raw); return j._tar === 1 && j.entries.some(function (e) { return /app\.conf/.test(e.path); }); } catch (e) { return false; }
        } }
      ],
      hints: ['Tìm file .conf: find du-an -name "*.conf" > ds-conf.txt', 'Đóng gói nén: tar -czf backup.tar.gz du-an (có thể kiểm tra lại bằng tar -tzf backup.tar.gz).', 'Đáp án: find du-an -name "*.conf" > ds-conf.txt && tar -czf backup.tar.gz du-an']
    },
    {
      id: 'cuu-dich-vu', title: '7. Chẩn đoán & cứu dịch vụ web', level: 'Thực tế', lesson: 'van-hanh',
      goal: 'Máy chủ báo web nginx không truy cập được. Hãy: (1) kiểm tra trạng thái hoặc đọc log của dịch vụ nginx (systemctl status nginx hoặc journalctl -u nginx); (2) khởi động lại dịch vụ nginx bằng quyền quản trị (sudo systemctl start nginx); (3) ghi kết quả của lệnh systemctl is-active nginx vào file trang-thai.txt.',
      setup: function () {
        var sv = S.defaultServices();
        sv.nginx.active = false;
        sv.nginx.logs.push('Nov 02 11:55:00 linux-lab systemd[1]: nginx.service: Service stopped unexpectedly.');
        return { tree: emptyHome({}), cwd: '/home/hocvien', services: sv };
      },
      tasks: [
        { t: 'Đã kiểm tra triệu chứng/log (systemctl status nginx hoặc journalctl -u nginx)', c: function (sh, h) {
          return h.some(function (x) { return /(systemctl\s+status|journalctl.*-u)\s+nginx/.test(x); });
        } },
        { t: 'Dịch vụ nginx đã được bật lại (active)', c: function (sh) { return sh.services.nginx && sh.services.nginx.active === true; } },
        { t: 'File trang-thai.txt có nội dung "active"', c: function (sh) {
          var x = sh.readFile('/home/hocvien/trang-thai.txt'); return x != null && x.trim() === 'active';
        } }
      ],
      hints: ['Bước 1: gõ systemctl status nginx để xem triệu chứng.', 'Bước 2: bật dịch vụ cần quyền quản trị → sudo systemctl start nginx.', 'Bước 3: systemctl is-active nginx > trang-thai.txt']
    }
  ];
})();

window.RESOURCES = [
  { g: 'Nguồn dữ liệu gốc', items: [
    { t: 'Giáo trình "Hệ điều hành Linux (CentOS)"', u: 'https://thayduy.github.io/he-dieu-hanh-linux/', d: 'Nguồn chính: lộ trình, 7 chương, mỗi chương 20+ bài tập. Trang này lấy cấu trúc từ đây.' },
    { t: 'Kho mã GitHub của giáo trình', u: 'https://github.com/thayduy/he-dieu-hanh-linux', d: 'Toàn bộ file Markdown của giáo trình.' }
  ] },
  { g: 'Linux thật, miễn phí, ngay trên trình duyệt', items: [
    { t: 'Google Cloud Shell', u: 'https://shell.cloud.google.com/', d: 'Terminal Linux thật của Google (cần tài khoản Google). Phù hợp khi muốn gõ dnf/apt/ssh thật mà chưa cài máy ảo.' },
    { t: 'WSL – Linux trên Windows', u: 'https://learn.microsoft.com/vi-vn/windows/wsl/install', d: 'Hướng dẫn cài chính thức của Microsoft.' }
  ] },
  { g: 'Học & luyện tập', items: [
    { t: 'Linux Journey', u: 'https://linuxjourney.com/', d: 'Học Linux theo từng bước, bằng tiếng Anh, rất trực quan.' },
    { t: 'OverTheWire – Bandit', u: 'https://overthewire.org/wargames/bandit/', d: 'Trò chơi giải đố qua SSH – luyện lệnh cơ bản cực vui.' },
    { t: 'explainshell', u: 'https://explainshell.com/', d: 'Dán một câu lệnh, trang sẽ giải thích từng phần.' },
    { t: 'tldr pages', u: 'https://tldr.sh/', d: 'Ví dụ ngắn gọn cho từng lệnh, dễ hơn man.' },
    { t: 'Rocky Linux Documentation', u: 'https://docs.rockylinux.org/', d: 'Tài liệu cho họ Red Hat/CentOS thay thế.' }
  ] },
  { g: 'GitHub', items: [
    { t: 'The Art of Command Line', u: 'https://github.com/jlevy/the-art-of-command-line', d: 'Tổng hợp mẹo dòng lệnh nổi tiếng.' },
    { t: 'tldr-pages/tldr', u: 'https://github.com/tldr-pages/tldr', d: 'Kho cộng đồng của tldr.' },
    { t: 'Chủ đề "linux" trên GitHub', u: 'https://github.com/topics/linux', d: 'Khám phá dự án mã nguồn mở về Linux.' }
  ] },
  { g: 'Tìm nhanh trên YouTube / Google', items: [
    { t: 'YouTube: Linux cho người mới bắt đầu', u: 'https://www.youtube.com/results?search_query=linux+cho+ng%C6%B0%E1%BB%9Di+m%E1%BB%9Bi+b%E1%BA%AFt+%C4%91%E1%BA%A7u', d: 'Tìm video tiếng Việt.' },
    { t: 'YouTube: Linux command line tutorial for beginners', u: 'https://www.youtube.com/results?search_query=linux+command+line+tutorial+for+beginners', d: 'Video tiếng Anh.' },
    { t: 'YouTube: Rocky Linux / CentOS cài đặt', u: 'https://www.youtube.com/results?search_query=c%C3%A0i+%C4%91%E1%BA%B7t+rocky+linux+virtualbox', d: 'Hướng dẫn cài máy ảo.' },
    { t: 'Google: lỗi "Permission denied" Linux', u: 'https://www.google.com/search?q=linux+permission+denied+l%C3%A0+g%C3%AC', d: 'Ví dụ cách tra lỗi: dán nguyên văn thông báo lỗi vào Google.' }
  ] }
];
