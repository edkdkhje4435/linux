/* Nội dung bài học. Cấu trúc tham khảo từ giáo trình "Hệ điều hành Linux (CentOS)"
 * https://thayduy.github.io/he-dieu-hanh-linux/ — nội dung dưới đây được viết lại bằng lời riêng.
 * Bạn là chủ sở hữu: cứ sửa/thêm bài ngay trong file này. */
window.LESSONS = [
  {
    id: 'gioi-thieu', title: 'Linux là gì? Vì sao nên học?', minutes: 15, level: 'Nhập môn', src: 'Chương 1',
    summary: 'Hiểu Linux, kernel, distro, mã nguồn mở và cách chuẩn bị máy thực hành an toàn.',
    body: `
<h3>1. Linux thực chất là gì?</h3>
<p><b>Linux</b> chính xác là một <b>kernel</b> (nhân hệ điều hành) – phần lõi nói chuyện trực tiếp với phần cứng: quản lý CPU, RAM, ổ đĩa, mạng. Khi ghép kernel với các công cụ (GNU, shell, trình quản lý gói...) ta có một <b>bản phân phối (distro)</b> như Ubuntu, Debian, Fedora, <b>Rocky Linux / AlmaLinux / CentOS</b>.</p>
<div class="tip"><b>Tư duy:</b> đừng hỏi "Linux nào tốt nhất?". Hãy hỏi "Mình cần làm gì?". Học trên CentOS/Rocky giúp bạn quen với thế giới máy chủ doanh nghiệp (họ Red Hat), còn Ubuntu/Debian rất phổ biến trên máy cá nhân và cloud. Lệnh cốt lõi gần như giống nhau – khác nhau chủ yếu ở <b>trình quản lý gói</b> (<code>dnf</code> vs <code>apt</code>).</div>

<h3>2. Mã nguồn mở nghĩa là gì?</h3>
<ul>
<li>Bạn được <b>xem</b> mã nguồn, <b>chạy</b> cho mọi mục đích, <b>sửa</b> và <b>phân phối lại</b> (theo điều khoản giấy phép như GPL, MIT, Apache).</li>
<li>Miễn phí không phải điểm cốt lõi, <b>quyền tự do</b> mới là điểm cốt lõi.</li>
</ul>

<h3>3. Linux khác Windows ở đâu?</h3>
<table>
<tr><th>Khía cạnh</th><th>Windows</th><th>Linux</th></tr>
<tr><td>Ổ đĩa</td><td>C:, D:</td><td>Một cây duy nhất bắt đầu từ <code>/</code></td></tr>
<tr><td>Phân biệt hoa/thường</td><td>Không</td><td><b>Có</b> (<code>File.txt</code> ≠ <code>file.txt</code>)</td></tr>
<tr><td>Quyền quản trị</td><td>Administrator</td><td><code>root</code> / <code>sudo</code></td></tr>
<tr><td>Cài phần mềm</td><td>File .exe</td><td>Gói từ kho (repo): <code>dnf install</code>, <code>apt install</code></td></tr>
<tr><td>Cấu hình</td><td>Registry, giao diện</td><td>File văn bản trong <code>/etc</code></td></tr>
</table>

<h3>4. Chuẩn bị môi trường thực hành (chọn 1)</h3>
<ol>
<li><b>Máy ảo (khuyên dùng):</b> cài VirtualBox, tải ISO Rocky Linux / AlmaLinux / Ubuntu, tạo VM. Nhớ <b>chụp snapshot</b> trước khi thử thứ nguy hiểm.</li>
<li><b>WSL2 trên Windows:</b> chạy <code>wsl --install</code> trong PowerShell (quyền admin) – nhanh, nhẹ, đủ để học lệnh.</li>
<li><b>Ngay trên trang này:</b> dùng <a href="#/practice">Phòng luyện tập</a> – terminal giả lập, không thể làm hỏng máy bạn.</li>
</ol>

<h3>5. Cây thư mục quan trọng cần nhận mặt</h3>
<pre><code>/            gốc của tất cả
├── home/    thư mục cá nhân của người dùng (~ = /home/ten_ban)
├── etc/     file cấu hình hệ thống
├── var/     dữ liệu thay đổi: log, cache (/var/log)
├── usr/     chương trình & thư viện
├── bin sbin lệnh cơ bản
├── tmp/     file tạm
└── root/    thư mục riêng của người dùng root</code></pre>
<div class="warn"><b>Quy tắc vàng cho người mới:</b> luôn dùng tài khoản thường + <code>sudo</code> khi cần; không đăng nhập root để học; thử nghiệm phá hoại chỉ làm trong máy ảo có snapshot.</div>`,
    quiz: [
      { q: 'Thành phần nào chính xác là "Linux"?', o: ['Toàn bộ hệ điều hành gồm giao diện và phần mềm', 'Kernel (nhân hệ điều hành)', 'Trình duyệt web', 'Ngôn ngữ lập trình'], a: 1, why: 'Linux là kernel; distro = kernel + công cụ + trình quản lý gói...' },
      { q: 'Trên Linux, "File.txt" và "file.txt" là...', o: ['Cùng một file', 'Hai file khác nhau', 'Lỗi hệ thống', 'Chỉ khác nhau trên máy chủ'], a: 1, why: 'Linux phân biệt chữ hoa/thường.' },
      { q: 'Linux có ổ đĩa C: D: như Windows không?', o: ['Có', 'Không, chỉ có một cây thư mục bắt đầu từ /', 'Chỉ có C:', 'Tùy distro'], a: 1, why: 'Mọi thứ nằm dưới "/"; ổ đĩa được mount vào một thư mục.' },
      { q: 'Cách an toàn nhất để thử lệnh nguy hiểm khi mới học?', o: ['Chạy thẳng trên máy chính bằng root', 'Máy ảo có snapshot / terminal giả lập', 'Chạy trên máy công ty', 'Không cần cẩn thận'], a: 1, why: 'Máy ảo + snapshot cho phép quay lại trạng thái cũ.' }
    ]
  },

  {
    id: 'terminal', title: 'Terminal & cấu trúc một dòng lệnh', minutes: 15, level: 'Nhập môn', src: 'Chương 2 (2.0)',
    summary: 'Mở terminal, đọc prompt, hiểu lệnh – tùy chọn – đối số, tự học bằng man và --help.',
    body: `
<h3>1. Terminal, shell, lệnh</h3>
<ul>
<li><b>Terminal:</b> cửa sổ để gõ chữ. <b>Shell</b> (thường là <code>bash</code>): chương trình đọc và thực thi lệnh bạn gõ. <b>Lệnh:</b> một yêu cầu, ví dụ <code>ls</code>.</li>
<li>Mở terminal: <kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>T</kbd> (nhiều distro) hoặc tìm "Terminal".</li>
</ul>

<h3>2. Đọc dấu nhắc (prompt)</h3>
<pre><code>hocvien@linux-lab:~$
│        │         │ └─ $ = người dùng thường (# = root)
│        │         └─── ~ = bạn đang ở thư mục home
│        └───────────── tên máy (hostname)
└────────────────────── tên người dùng</code></pre>

<h3>3. Giải phẫu một dòng lệnh</h3>
<pre><code>ls   -l   /home
│    │    └─ đối số (đối tượng cần tác động)
│    └────── tùy chọn (option / flag) – thay đổi cách chạy
└─────────── tên lệnh</code></pre>
<p>Tùy chọn ngắn dùng một gạch (<code>-l</code>) và gộp được (<code>-la</code> = <code>-l -a</code>); tùy chọn dài dùng hai gạch (<code>--help</code>).</p>

<h3>4. Tự học – kỹ năng quan trọng nhất</h3>
<pre><code>man ls          # sổ tay đầy đủ (thoát bằng phím q)
ls --help       # tóm tắt nhanh
type cd         # lệnh này là gì?</code></pre>
<div class="tip"><b>Tư duy:</b> người giỏi Linux không thuộc lòng mọi lệnh – họ biết <b>cách tra</b> và <b>đọc thông báo lỗi</b>. Thấy lỗi? Đọc từng chữ: <code>No such file or directory</code> = sai tên/đường dẫn. <code>Permission denied</code> = thiếu quyền. <code>command not found</code> = gõ sai hoặc chưa cài.</div>

<h3>5. Ba phím cứu hộ</h3>
<table>
<tr><th>Phím</th><th>Tác dụng</th></tr>
<tr><td><kbd>Tab</kbd></td><td>Tự điền tên lệnh/file (nhấn 2 lần để xem gợi ý)</td></tr>
<tr><td><kbd>↑</kbd> / <kbd>↓</kbd></td><td>Gọi lại lệnh cũ</td></tr>
<tr><td><kbd>Ctrl</kbd>+<kbd>C</kbd></td><td>Dừng lệnh đang chạy / hủy dòng đang gõ</td></tr>
</table>
<p>Thêm: <kbd>Ctrl</kbd>+<kbd>L</kbd> hoặc <code>clear</code> xóa màn hình; <code>history</code> xem lịch sử lệnh.</p>

<h3>Thử ngay</h3>
<p>Gõ vào terminal bên dưới: <code>whoami</code>, <code>pwd</code>, <code>ls -l</code>, <code>help</code>.</p>
<div class="mini-term" data-id="t-terminal"></div>`,
    quiz: [
      { q: 'Trong "ls -l /home", "-l" là gì?', o: ['Tên lệnh', 'Tùy chọn (option)', 'Đối số', 'Tên file'], a: 1, why: 'Tùy chọn thay đổi cách lệnh hoạt động; "/home" mới là đối số.' },
      { q: 'Dấu "$" cuối prompt cho biết điều gì?', o: ['Bạn là root', 'Bạn là người dùng thường', 'Máy hết bộ nhớ', 'Lệnh bị lỗi'], a: 1, why: '"#" mới là root.' },
      { q: 'Thấy "Permission denied", nghĩa là gì?', o: ['Sai tên file', 'Thiếu quyền truy cập', 'Chưa cài lệnh', 'Mất mạng'], a: 1, why: 'Hệ thống hiểu lệnh nhưng bạn không đủ quyền.' },
      { q: 'Muốn xem hướng dẫn đầy đủ của lệnh "cp" thì gõ?', o: ['help cp all', 'man cp', 'cp --manual-all', 'show cp'], a: 1, why: 'man = manual. Thoát bằng q.' }
    ]
  },

  {
    id: 'thu-muc', title: 'Cây thư mục & di chuyển (pwd, ls, cd)', minutes: 20, level: 'Cơ bản', src: 'Chương 2',
    summary: 'Đường dẫn tuyệt đối/tương đối, các lệnh định vị và xem nội dung thư mục.',
    practice: 'dieu-huong',
    body: `
<h3>1. Ba lệnh sống còn</h3>
<pre><code>pwd              # bạn đang đứng ở đâu?
ls               # có gì ở đây?
cd Documents     # đi vào thư mục Documents</code></pre>
<p>Biến thể thường dùng của <code>ls</code>:</p>
<pre><code>ls -l     # dạng chi tiết (quyền, chủ sở hữu, kích thước, ngày)
ls -a     # hiện cả file ẩn (bắt đầu bằng dấu chấm)
ls -la    # cả hai</code></pre>

<h3>2. Đường dẫn: tuyệt đối vs tương đối</h3>
<table>
<tr><th>Loại</th><th>Dấu hiệu</th><th>Ví dụ</th></tr>
<tr><td>Tuyệt đối</td><td>Bắt đầu bằng <code>/</code></td><td><code>/home/hocvien/Documents</code></td></tr>
<tr><td>Tương đối</td><td>Tính từ vị trí hiện tại</td><td><code>Documents/baocao.txt</code></td></tr>
</table>
<p>Ký hiệu đặc biệt:</p>
<ul>
<li><code>.</code> = thư mục hiện tại, <code>..</code> = thư mục cha</li>
<li><code>~</code> = thư mục home của bạn, <code>-</code> = quay lại thư mục trước đó (<code>cd -</code>)</li>
</ul>
<pre><code>cd ..        # lên một cấp
cd ~         # về nhà (hoặc chỉ gõ: cd)
cd /etc      # nhảy thẳng tới /etc (tuyệt đối)
cd -         # về nơi vừa đứng</code></pre>

<div class="tip"><b>Tư duy "bản đồ":</b> trước khi gõ lệnh làm thay đổi dữ liệu, luôn tự hỏi hai câu: <b>"Mình đang đứng ở đâu?"</b> (<code>pwd</code>) và <b>"Đối tượng nằm ở đâu so với chỗ mình đứng?"</b>. 90% lỗi người mới là sai chỗ đứng.</div>

<h3>3. File ẩn</h3>
<p>Tên bắt đầu bằng <code>.</code> (ví dụ <code>.bashrc</code>, <code>.ssh</code>) là file ẩn – thường là cấu hình cá nhân. Dùng <code>ls -a</code> để thấy.</p>

<h3>Thực hành</h3>
<p>Trong terminal dưới đây, hãy: xem bạn đang ở đâu → liệt kê → vào <code>Documents</code> → đọc file → quay về home.</p>
<div class="mini-term" data-id="t-thumuc"></div>
<p>Sau đó sang <a href="#/practice/dieu-huong">thử thách "Điều hướng"</a> để được chấm tự động.</p>`,
    quiz: [
      { q: 'Lệnh nào cho biết thư mục hiện tại?', o: ['ls', 'cd', 'pwd', 'whoami'], a: 2, why: 'pwd = print working directory.' },
      { q: 'Từ /home/hocvien/Documents, lệnh nào về /home/hocvien?', o: ['cd .', 'cd ..', 'cd /', 'cd Documents'], a: 1, why: '".." là thư mục cha.' },
      { q: '"/etc/hostname" là đường dẫn...', o: ['Tương đối', 'Tuyệt đối', 'Không hợp lệ', 'Của Windows'], a: 1, why: 'Bắt đầu bằng "/" là tuyệt đối.' },
      { q: 'Muốn thấy cả file ẩn, dùng?', o: ['ls -l', 'ls -a', 'ls -h', 'ls --hidden'], a: 1, why: '-a = all.' }
    ]
  },

  {
    id: 'tap-tin', title: 'Làm việc với tập tin & thư mục', minutes: 25, level: 'Cơ bản', src: 'Chương 2',
    summary: 'Tạo, sao chép, đổi tên, xóa; xem nội dung; chuyển hướng và ống dẫn (pipe).',
    practice: 'tao-file',
    body: `
<h3>1. Tạo</h3>
<pre><code>mkdir linux-lab          # tạo thư mục
mkdir -p a/b/c           # tạo cả chuỗi thư mục lồng nhau
touch nhatky.txt         # tạo file rỗng
echo "xin chao" > a.txt  # tạo/ghi đè file với nội dung
echo "dong 2" >> a.txt   # GHI NỐI thêm vào cuối</code></pre>
<div class="warn"><code>&gt;</code> <b>ghi đè</b> toàn bộ file, <code>&gt;&gt;</code> chỉ <b>nối thêm</b>. Nhầm hai dấu này là cách phổ biến nhất để mất dữ liệu.</div>

<h3>2. Xem nội dung</h3>
<pre><code>cat a.txt         # in toàn bộ (file ngắn)
head -n 5 log.txt # 5 dòng đầu
tail -n 5 log.txt # 5 dòng cuối (đọc log mới nhất)
less log.txt      # xem file dài, cuộn bằng mũi tên, thoát bằng q
wc -l log.txt     # đếm số dòng</code></pre>

<h3>3. Sao chép – di chuyển – đổi tên – xóa</h3>
<pre><code>cp a.txt b.txt          # sao chép file
cp -r thumuc1 thumuc2   # sao chép thư mục (cần -r)
mv b.txt c.txt          # ĐỔI TÊN (cùng thư mục)
mv c.txt Documents/     # DI CHUYỂN vào thư mục khác
rm c.txt                # xóa file
rm -r thumuc            # xóa thư mục và mọi thứ bên trong
rmdir thumuc-rong       # chỉ xóa được thư mục rỗng</code></pre>
<div class="warn"><b>Linux không có thùng rác ở terminal.</b> <code>rm</code> là xóa thật. Thói quen tốt: gõ <code>ls</code> trước với cùng đường dẫn để xem mình sắp xóa gì; không bao giờ chạy <code>rm -rf</code> khi chưa chắc đường dẫn.</div>

<h3>4. Ký tự đại diện (glob)</h3>
<pre><code>ls *.txt        # mọi file đuôi .txt
rm log?.txt     # log1.txt, log2.txt... (? = đúng 1 ký tự)</code></pre>

<h3>5. Pipe – sức mạnh ghép lệnh</h3>
<p>Ký hiệu <code>|</code> đưa kết quả lệnh trước vào lệnh sau – như dây chuyền sản xuất:</p>
<pre><code>cat log.txt | grep ERROR | wc -l      # đếm bao nhiêu dòng chứa ERROR
grep ERROR log.txt > loi.txt           # lưu các dòng lỗi ra file riêng
ls | sort -r                            # liệt kê và sắp xếp ngược</code></pre>
<div class="tip"><b>Tư duy Unix:</b> mỗi lệnh làm <i>một việc nhỏ thật tốt</i>; bạn ghép chúng lại để giải quyết bài toán lớn. Khi gặp đề bài, hãy chia thành các bước: lấy dữ liệu → lọc → đếm/sắp xếp → lưu.</div>

<h3>Thực hành</h3>
<div class="mini-term" data-id="t-taptin"></div>
<p>Rồi sang <a href="#/practice/tao-file">thử thách "Tạo – sao chép – đổi tên"</a>.</p>`,
    quiz: [
      { q: 'Lệnh nào ĐỔI TÊN file a.txt thành b.txt?', o: ['rename a.txt b.txt', 'cp a.txt b.txt', 'mv a.txt b.txt', 'touch a.txt b.txt'], a: 2, why: 'mv vừa di chuyển vừa đổi tên.' },
      { q: 'Khác biệt giữa ">" và ">>"?', o: ['Không khác', '">" ghi đè, ">>" nối thêm', '">" nối thêm, ">>" ghi đè', '">>" chỉ dùng cho thư mục'], a: 1, why: 'Nhớ: một mũi tên = thay thế, hai mũi tên = thêm vào.' },
      { q: 'Để xóa thư mục có file bên trong cần?', o: ['rm', 'rmdir', 'rm -r', 'del'], a: 2, why: 'rmdir chỉ xóa thư mục rỗng; rm -r xóa đệ quy.' },
      { q: 'Lệnh nào đếm số dòng chứa "ERROR" trong log.txt?', o: ['cat log.txt | grep ERROR | wc -l', 'wc ERROR log.txt', 'ls ERROR | log.txt', 'grep -l log.txt'], a: 0, why: 'Ghép ba bước: đọc → lọc → đếm.' }
    ]
  },

  {
    id: 'phan-quyen', title: 'Người dùng, nhóm & phân quyền', minutes: 30, level: 'Cơ bản', src: 'Chương 3',
    summary: 'Đọc ls -l, hiểu rwx, chmod ký hiệu & số, chown, sudo, useradd.',
    practice: 'phan-quyen',
    body: `
<h3>1. Ba câu hỏi hệ thống tự hỏi khi bạn mở một file</h3>
<ol><li>Bạn là <b>ai</b>? (user)</li><li>Bạn thuộc <b>nhóm</b> nào? (group)</li><li>File này cho <b>phép</b> nhóm đối tượng đó làm gì?</li></ol>
<pre><code>whoami     # tên bạn
id         # uid, gid, các nhóm bạn thuộc về</code></pre>

<h3>2. Đọc ls -l từng ký tự</h3>
<pre><code>-rwxr-xr--  1  hocvien  lophoc  120  Nov 2 12:00  baitap.sh
│└┬┘└┬┘└┬┘
│ │  │  └─ others (người khác):  r--  chỉ đọc
│ │  └──── group (nhóm):         r-x  đọc + chạy
│ └─────── user (chủ sở hữu):    rwx  đọc + ghi + chạy
└───────── loại: - file, d thư mục, l liên kết</code></pre>
<table>
<tr><th>Ký hiệu</th><th>Với file</th><th>Với thư mục</th><th>Giá trị</th></tr>
<tr><td>r</td><td>đọc nội dung</td><td>liệt kê tên bên trong</td><td>4</td></tr>
<tr><td>w</td><td>sửa nội dung</td><td>tạo/xóa/đổi tên file bên trong</td><td>2</td></tr>
<tr><td>x</td><td>chạy như chương trình</td><td>đi vào (cd) thư mục</td><td>1</td></tr>
</table>

<h3>3. chmod – đổi quyền</h3>
<p><b>Cách chữ</b> (dễ đọc):</p>
<pre><code>chmod u+x script.sh     # cho chủ sở hữu quyền chạy
chmod go-w file.txt     # bỏ quyền ghi của group và others
chmod a+r file.txt      # cho tất cả quyền đọc</code></pre>
<p><b>Cách số</b> (cộng giá trị r=4, w=2, x=1 cho từng nhóm u-g-o):</p>
<table>
<tr><th>Số</th><th>Ý nghĩa</th><th>Dùng khi</th></tr>
<tr><td><code>755</code></td><td>rwxr-xr-x</td><td>script/chương trình, thư mục</td></tr>
<tr><td><code>644</code></td><td>rw-r--r--</td><td>file văn bản thông thường</td></tr>
<tr><td><code>600</code></td><td>rw-------</td><td>file riêng tư (khóa SSH)</td></tr>
<tr><td><code>700</code></td><td>rwx------</td><td>thư mục riêng tư</td></tr>
</table>
<div class="tip"><b>Tư duy:</b> đừng học thuộc "755" như thần chú. Hãy tự giải thích: 7 = 4+2+1 = rwx; 5 = 4+1 = r-x. Giải thích được bằng lời thì mới nhớ lâu.</div>
<div class="warn">Đừng bao giờ "chữa" lỗi Permission denied bằng <code>chmod 777</code> – ai cũng ghi được, rất nguy hiểm. Hãy tìm hiểu ai cần quyền gì rồi cấp đúng.</div>

<h3>4. sudo và quản lý người dùng</h3>
<pre><code>sudo lenh              # chạy 1 lệnh với quyền root (hỏi mật khẩu của BẠN)
sudo useradd -m -s /bin/bash an     # tạo user 'an' có thư mục home
sudo passwd an                       # đặt mật khẩu
sudo usermod -aG wheel an            # thêm vào nhóm admin (CentOS/Rocky: wheel; Ubuntu: sudo)
sudo chown an:lophoc file.txt        # đổi chủ sở hữu : nhóm
sudo userdel -r an                   # xóa user và thư mục home</code></pre>
<p>Thông tin tài khoản nằm trong các file: <code>/etc/passwd</code> (danh bạ), <code>/etc/shadow</code> (mật khẩu băm – chỉ root đọc), <code>/etc/group</code> (nhóm).</p>
<div class="warn"><code>usermod -G</code> (không có <code>-a</code>) <b>ghi đè</b> danh sách nhóm phụ. Luôn dùng <code>-aG</code> khi muốn thêm.</div>

<h3>Thực hành</h3>
<div class="mini-term" data-id="t-quyen"></div>
<p>Rồi sang <a href="#/practice/phan-quyen">thử thách "Phân quyền"</a>.</p>`,
    quiz: [
      { q: 'chmod 644 file.txt tương ứng quyền nào?', o: ['rwxr-xr-x', 'rw-r--r--', 'rwx------', 'r--r--r--'], a: 1, why: '6=rw-, 4=r--, 4=r--.' },
      { q: 'Muốn script.sh chạy được bởi chủ sở hữu, dùng?', o: ['chmod u+x script.sh', 'chmod u-x script.sh', 'chown +x script.sh', 'sudo script.sh'], a: 0, why: 'u+x = thêm quyền thực thi cho user.' },
      { q: 'Quyền "x" trên THƯ MỤC cho phép?', o: ['Xóa thư mục', 'Đi vào thư mục bằng cd', 'Chạy thư mục như chương trình', 'Không có tác dụng'], a: 1, why: 'x trên thư mục = được "đi qua/vào".' },
      { q: 'Cách thêm user vào nhóm phụ mà KHÔNG xóa nhóm cũ?', o: ['usermod -G wheel an', 'usermod -aG wheel an', 'groupadd an wheel', 'chown wheel an'], a: 1, why: '-a (append) đi kèm -G.' },
      { q: 'Đọc ra "drwx------" cho biết?', o: ['File chạy được', 'Thư mục chỉ chủ sở hữu truy cập', 'Liên kết', 'File ẩn'], a: 1, why: 'Chữ d đầu tiên = directory; 700.' }
    ]
  },

  {
    id: 'mang-ssh', title: 'Mạng cơ bản & SSH', minutes: 25, level: 'Trung bình', src: 'Chương 4',
    summary: 'Xem IP, kiểm tra kết nối, hostname, đăng nhập từ xa bằng SSH và khóa.',
    body: `
<h3>1. Kiểm tra mạng – quy trình từ trong ra ngoài</h3>
<pre><code>ip a                      # xem địa chỉ IP của các card mạng
ip route                  # xem gateway (cổng ra mạng)
ping -c 4 8.8.8.8         # thông tới Internet (bằng IP)?
ping -c 4 google.com      # phân giải tên miền (DNS) ổn không?
hostnamectl               # xem/đổi hostname
ss -tuln                  # cổng nào đang lắng nghe?</code></pre>
<div class="tip"><b>Tư duy khoanh vùng lỗi:</b> ping được IP nhưng không ping được tên miền → lỗi <b>DNS</b>. Không ping được gateway → lỗi <b>mạng nội bộ</b>. Chia bài toán thành tầng, kiểm tra từng tầng, đừng đoán bừa.</div>

<h3>2. Cấu hình mạng trên họ Red Hat (CentOS/Rocky/Alma)</h3>
<pre><code>nmcli device status               # trạng thái card mạng
nmcli connection show             # các kết nối
sudo nmcli con mod eth0 ipv4.addresses 192.168.1.50/24 ipv4.gateway 192.168.1.1 ipv4.dns 8.8.8.8 ipv4.method manual
sudo nmcli con up eth0
sudo hostnamectl set-hostname may-chu-01</code></pre>
<p>(Tên kết nối <code>eth0</code> chỉ là ví dụ – hãy xem tên thật bằng <code>nmcli connection show</code>.)</p>

<h3>3. SSH – điều khiển máy khác qua mạng</h3>
<pre><code>ssh an@192.168.1.50                    # đăng nhập bằng mật khẩu
ssh-keygen -t ed25519                  # tạo cặp khóa (công khai + riêng tư)
ssh-copy-id an@192.168.1.50            # gửi khóa công khai lên máy chủ
ssh an@192.168.1.50                    # lần sau vào không cần mật khẩu
scp baocao.txt an@192.168.1.50:~/      # chép file qua SSH</code></pre>
<ul>
<li><b>Khóa riêng tư</b> (<code>id_ed25519</code>) tuyệt đối không chia sẻ; file phải có quyền <code>600</code>.</li>
<li><b>Khóa công khai</b> (<code>.pub</code>) thì gửi đi đâu cũng được.</li>
</ul>
<div class="warn">Trước khi tắt đăng nhập bằng mật khẩu (<code>PasswordAuthentication no</code> trong <code>/etc/ssh/sshd_config</code>), hãy <b>mở sẵn một phiên SSH khác</b> làm đường lui để tránh tự khóa mình ngoài máy chủ.</div>

<h3>4. Tường lửa firewalld (nhận biết)</h3>
<pre><code>sudo firewall-cmd --list-all
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --reload</code></pre>`,
    quiz: [
      { q: 'ping được 8.8.8.8 nhưng không ping được google.com. Nghi ngờ lỗi gì?', o: ['Hỏng card mạng', 'DNS', 'Hết RAM', 'Sai quyền file'], a: 1, why: 'Đến được IP nghĩa là mạng thông; việc đổi tên → IP (DNS) đang hỏng.' },
      { q: 'File nào là khóa RIÊNG TƯ khi tạo bằng ssh-keygen -t ed25519?', o: ['id_ed25519.pub', 'id_ed25519', 'known_hosts', 'authorized_keys'], a: 1, why: 'Bản không có đuôi .pub là khóa riêng tư.' },
      { q: 'Lệnh nào xem địa chỉ IP trên Linux hiện đại?', o: ['ipconfig', 'ip a', 'ifconfig /all', 'netstat -ip'], a: 1, why: 'ipconfig là của Windows.' },
      { q: 'Vì sao nên mở sẵn 1 phiên SSH dự phòng khi sửa sshd_config?', o: ['Để chạy nhanh hơn', 'Phòng khi cấu hình sai tự khóa mình', 'Bắt buộc theo luật', 'Không có lý do'], a: 1, why: 'Phiên đang mở không bị ngắt, giúp bạn sửa lại.' }
    ]
  },

  {
    id: 'van-hanh', title: 'Vận hành: gói, dịch vụ, tiến trình, lịch, log', minutes: 30, level: 'Trung bình', src: 'Chương 7',
    summary: 'dnf/apt, systemctl, ps/top/kill, cron, journalctl – bộ kỹ năng quản trị cốt lõi.',
    body: `
<h3>1. Cài phần mềm bằng trình quản lý gói</h3>
<table>
<tr><th>Việc</th><th>CentOS 8+/Rocky/Alma (dnf)</th><th>Ubuntu/Debian (apt)</th></tr>
<tr><td>Tìm</td><td><code>dnf search nginx</code></td><td><code>apt search nginx</code></td></tr>
<tr><td>Cài</td><td><code>sudo dnf install nginx</code></td><td><code>sudo apt install nginx</code></td></tr>
<tr><td>Cập nhật</td><td><code>sudo dnf upgrade</code></td><td><code>sudo apt update &amp;&amp; sudo apt upgrade</code></td></tr>
<tr><td>Gỡ</td><td><code>sudo dnf remove nginx</code></td><td><code>sudo apt remove nginx</code></td></tr>
</table>
<p>CentOS 7 dùng <code>yum</code> (cú pháp gần giống). Gói <code>.rpm</code> thuộc họ Red Hat, <code>.deb</code> thuộc họ Debian.</p>

<h3>2. Dịch vụ với systemd</h3>
<pre><code>systemctl status sshd          # đang chạy không? lỗi gì?
sudo systemctl start nginx     # bật ngay
sudo systemctl stop nginx      # tắt ngay
sudo systemctl restart nginx   # khởi động lại
sudo systemctl enable --now nginx   # tự chạy khi khởi động + bật luôn
systemctl is-enabled nginx</code></pre>
<div class="tip"><code>start</code> = chạy <b>bây giờ</b>; <code>enable</code> = chạy <b>mỗi lần bật máy</b>. Hai việc độc lập nhau!</div>

<h3>3. Tiến trình (process)</h3>
<pre><code>ps aux | grep nginx    # tìm tiến trình theo tên
top                    # theo dõi trực tiếp (thoát bằng q)
kill 1234              # yêu cầu tiến trình PID 1234 dừng lịch sự
kill -9 1234           # cưỡng chế dừng (dùng khi kill thường không được)</code></pre>

<h3>4. Lập lịch với cron</h3>
<pre><code>crontab -e             # sửa lịch của bạn
# phút giờ ngày tháng thứ  lệnh
*/5 * * * * /home/an/healthcheck.sh >> /home/an/health.log 2>&1
0 2 * * *   /home/an/backup.sh        # 2 giờ sáng mỗi ngày</code></pre>
<p>Cron chạy với môi trường (PATH) rất tối giản, nên hãy dùng <b>đường dẫn tuyệt đối</b> trong lệnh và script.</p>

<h3>5. Đọc log – kỹ năng "thám tử"</h3>
<pre><code>journalctl -u sshd -n 50          # 50 dòng log mới nhất của dịch vụ sshd
journalctl -u nginx -f            # theo dõi log trực tiếp (Ctrl+C để thoát)
journalctl -p err -b              # chỉ lỗi từ lần khởi động này
tail -f /var/log/messages         # log truyền thống (RHEL: /var/log/messages)</code></pre>
<div class="tip"><b>Quy trình xử lý sự cố:</b> (1) <code>systemctl status</code> xem triệu chứng → (2) <code>journalctl -u</code> đọc nguyên nhân → (3) sửa cấu hình → (4) restart → (5) kiểm tra lại. Ghi lại vào nhật ký lab mỗi lần!</div>`,
    quiz: [
      { q: 'Muốn dịch vụ tự chạy mỗi lần khởi động máy?', o: ['systemctl start', 'systemctl enable', 'systemctl status', 'systemctl mask'], a: 1, why: 'enable = tự khởi động cùng hệ thống.' },
      { q: 'Dòng cron "*/5 * * * *" nghĩa là?', o: ['Mỗi 5 giờ', 'Mỗi 5 phút', 'Ngày mùng 5', 'Thứ 5 hằng tuần'], a: 1, why: 'Trường đầu tiên là phút; */5 = mỗi 5 phút.' },
      { q: 'Xem 50 dòng log mới nhất của sshd?', o: ['journalctl -u sshd -n 50', 'systemctl log sshd 50', 'cat sshd', 'ps sshd -n 50'], a: 0, why: 'journalctl -u <dịch vụ> -n <số dòng>.' },
      { q: 'Lệnh cài gói trên Rocky/AlmaLinux?', o: ['apt install', 'dnf install', 'pacman -S', 'brew install'], a: 1, why: 'dnf (hoặc yum) là của họ Red Hat.' }
    ]
  },

  {
    id: 'shell-script', title: 'Shell script đầu tiên', minutes: 30, level: 'Trung bình', src: 'Chương 5',
    summary: 'Biến, tham số, if, for, hàm, và script sao lưu có ghi log.',
    body: `
<h3>1. Script = danh sách lệnh lưu vào file</h3>
<pre><code>#!/bin/bash
# hello.sh - script đầu tiên
echo "Xin chào, $(whoami)!"
echo "Hôm nay là: $(date +%d/%m/%Y)"</code></pre>
<pre><code>chmod +x hello.sh     # cho phép chạy
./hello.sh            # chạy (./ = "file ở thư mục hiện tại")</code></pre>
<p>Dòng đầu <code>#!/bin/bash</code> (shebang) nói hệ thống dùng bash để chạy file.</p>

<h3>2. Biến và tham số</h3>
<pre><code>ten="An"                 # KHÔNG có dấu cách quanh dấu =
echo "Chào $ten"
echo "Tham số 1: $1, tất cả: $@, số lượng: $#"
read -p "Nhập tuổi: " tuoi</code></pre>

<h3>3. Điều kiện if</h3>
<pre><code>if [ -f "$1" ]; then
    echo "$1 là file tồn tại"
elif [ -d "$1" ]; then
    echo "$1 là thư mục"
else
    echo "Không thấy $1"
fi</code></pre>
<p>Một số phép thử: <code>-f</code> file, <code>-d</code> thư mục, <code>-z</code> chuỗi rỗng, <code>-eq -ne -lt -gt</code> so sánh số, <code>==</code> so sánh chuỗi. <b>Cần có dấu cách</b> trong <code>[ ... ]</code>.</p>

<h3>4. Vòng lặp và hàm</h3>
<pre><code>for f in *.txt; do
    echo "Tìm thấy: $f"
done

kiemtra() {
    systemctl is-active --quiet "$1" && echo "$1: OK" || echo "$1: DỪNG"
}
kiemtra sshd</code></pre>

<h3>5. Ví dụ thực tế: sao lưu có log</h3>
<pre><code>#!/bin/bash
set -u                                   # lỗi nếu dùng biến chưa gán
nguon="$HOME/linux-lab"
dich="$HOME/backup"
mkdir -p "$dich"
ten="backup-$(date +%Y%m%d-%H%M).tar.gz"
if tar -czf "$dich/$ten" "$nguon"; then
    echo "$(date) OK  $ten" >> "$dich/backup.log"
else
    echo "$(date) LOI khi sao luu" >> "$dich/backup.log"
    exit 1
fi</code></pre>
<div class="tip"><b>Tư duy lập trình:</b> viết script <b>nhỏ → chạy thử → mở rộng</b>. Gỡ lỗi bằng <code>bash -x script.sh</code> (in từng lệnh khi chạy). Luôn đặt biến trong dấu ngoặc kép <code>"$bien"</code> để tránh lỗi với tên có dấu cách.</div>

<h3>Bài tự luyện</h3>
<ol>
<li>Viết <code>chao.sh</code> nhận tên qua tham số và chào lại; nếu không có tham số thì báo cách dùng.</li>
<li>Viết script đếm số file <code>.txt</code> trong thư mục hiện tại.</li>
<li>Cho script ở bài 2 chạy bằng cron mỗi 5 phút và ghi vào log.</li>
</ol>`,
    quiz: [
      { q: 'Dòng "#!/bin/bash" đầu script gọi là gì?', o: ['Comment thường', 'Shebang – chỉ trình thông dịch', 'Biến môi trường', 'Hàm'], a: 1, why: 'Nó nói hệ thống dùng /bin/bash để chạy.' },
      { q: 'Cách gán biến đúng trong bash?', o: ['ten = "An"', 'ten="An"', 'set ten An', '$ten="An"'], a: 1, why: 'Không được có dấu cách quanh "=".' },
      { q: '"$1" trong script là gì?', o: ['Tên script', 'Tham số dòng lệnh đầu tiên', 'Số lượng tham số', 'Kết quả lệnh trước'], a: 1, why: '$# mới là số lượng, $0 là tên script.' },
      { q: 'Muốn chạy ./hello.sh cần làm gì trước?', o: ['chmod +x hello.sh', 'Đổi đuôi thành .exe', 'Cài compiler', 'Không cần gì'], a: 0, why: 'Cần quyền thực thi (x).' }
    ]
  }
];
