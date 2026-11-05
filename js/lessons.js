/* Nội dung bài học. Cấu trúc tham khảo từ giáo trình "Hệ điều hành Linux (CentOS)"
 * https://thayduy.github.io/he-dieu-hanh-linux/ — nội dung dưới đây được viết lại bằng lời riêng.
 * Bạn là chủ sở hữu: cứ sửa/thêm bài ngay trong file này. */
window.LESSONS = [
  {
    id: 'gioi-thieu', title: 'Linux là gì? Vì sao nên học?', minutes: 15, level: 'Nhập môn', src: 'Chương 1',
    summary: 'Hiểu Linux, kernel, distro, mã nguồn mở, cây thư mục / và cách chuẩn bị máy thực hành an toàn.',
    body: `
<h3>1. Linux thực chất là gì? (Phân biệt Kernel và Distro)</h3>
<p>Nhiều người gọi chung hệ điều hành là "Linux", nhưng chính xác thì:</p>
<ul>
<li><b>Linux Kernel (Nhân hệ điều hành):</b> giống như <b>động cơ ô tô</b>. Nó là phần lõi nằm sâu bên dưới, làm nhiệm vụ nói chuyện trực tiếp với phần cứng: chia sẻ CPU, cấp phát RAM, đọc/ghi ổ đĩa, điều khiển card mạng. Bạn không thể lái một cái động cơ rời.</li>
<li><b>Bản phân phối (Distribution / Distro):</b> giống như <b>chiếc ô tô hoàn chỉnh</b>. Khi người ta lắp <i>Linux Kernel</i> vào cùng với vỏ xe, vô-lăng, bảng điều khiển (gồm trình dòng lệnh <code>bash</code>, các công cụ hệ thống GNU, trình cài đặt phần mềm, giao diện...), ta được một <b>Distro</b> hoàn chỉnh để cài lên máy tính: <b>Ubuntu, Debian, Fedora, CentOS, Rocky Linux, AlmaLinux</b>.</li>
</ul>
<div class="tip"><b>Tư duy chọn Distro:</b> Đừng mất thời gian hỏi "Linux nào tốt nhất?". Các câu lệnh cốt lõi (<code>ls</code>, <code>cd</code>, <code>cp</code>, <code>chmod</code>, <code>grep</code>...) giống nhau đến 95% trên mọi bản Linux! Chúng chỉ khác nhau chủ yếu ở <b>công cụ cài đặt phần mềm</b>:
<br>• Nhánh <b>Red Hat (CentOS / Rocky Linux / AlmaLinux / RHEL)</b>: rất phổ biến ở máy chủ doanh nghiệp, dùng lệnh <code>dnf</code> (hoặc <code>yum</code>) để cài gói đuôi <code>.rpm</code>.
<br>• Nhánh <b>Debian (Ubuntu / Debian / Linux Mint)</b>: rất phổ biến trên máy cá nhân và đám mây, dùng lệnh <code>apt</code> để cài gói đuôi <code>.deb</code>.</div>

<h3>2. Mã nguồn mở (Open Source) nghĩa là gì?</h3>
<ul>
<li>Bạn được quyền <b>xem toàn bộ mã nguồn</b> tạo nên hệ điều hành, <b>chạy</b> cho mọi mục đích (cá nhân hay thương mại), <b>tự sửa đổi</b> và <b>phân phối lại</b> (theo giấy phép như GPL, MIT, Apache).</li>
<li>"Miễn phí" chỉ là hệ quả thường gặp; <b>quyền tự do kiểm soát phần mềm và không bị khóa chặt vào một hãng</b> mới là điểm cốt lõi khiến hầu hết máy chủ Internet, đám mây (AWS, Google Cloud), container Docker và điện thoại Android đều chạy trên nhân Linux.</li>
</ul>

<h3>3. Linux khác Windows ở điểm nào quan trọng nhất?</h3>
<table>
<tr><th>Khía cạnh</th><th>Windows</th><th>Linux</th><th>Ví dụ thực tế bạn sẽ gặp</th></tr>
<tr><td><b>Cấu trúc ổ đĩa</b></td><td>Chia thành <code>C:\</code>, <code>D:\</code></td><td>Một cây thư mục duy nhất bắt đầu từ gốc <code>/</code></td><td>Đường dẫn trên Linux dùng dấu gạch chéo xuôi: <code>/home/hocvien/ghichu.txt</code></td></tr>
<tr><td><b>Chữ HOA / thường</b></td><td>Không phân biệt</td><td><b>Phân biệt tuyệt đối</b></td><td><code>BaoCao.txt</code> và <code>baocao.txt</code> là <b>2 file hoàn toàn khác nhau</b> có thể nằm cạnh nhau!</td></tr>
<tr><td><b>Quyền quản trị</b></td><td>Administrator</td><td><code>root</code> (siêu quản trị) / <code>sudo</code></td><td>Bình thường bạn dùng tài khoản thường; khi cần cài phần mềm mới thêm chữ <code>sudo</code> ở đầu lệnh.</td></tr>
<tr><td><b>Cài phần mềm</b></td><td>Tải file <code>.exe</code> trên mạng về bấm Next</td><td>Tải tự động từ kho chính thức (repo) bằng 1 dòng lệnh</td><td>Gõ <code>sudo dnf install nginx</code> (Rocky) hoặc <code>sudo apt install nginx</code> (Ubuntu).</td></tr>
<tr><td><b>Cấu hình hệ thống</b></td><td>Registry, hộp thoại tích chọn</td><td>Tất cả đều là <b>file văn bản</b> nằm trong <code>/etc</code></td><td>Muốn đổi cấu hình web hay SSH, bạn chỉ cần mở file văn bản trong <code>/etc</code> ra sửa.</td></tr>
</table>

<h3>4. Cây thư mục Linux – 7 địa danh bạn cần nhớ mặt</h3>
<p>Trên Linux, mọi thứ đều bắt đầu từ thư mục gốc <code>/</code> (đọc là <i>root slash</i>). Hãy hình dung <code>/</code> như gốc của một cái cây lớn:</p>
<pre><code>/                 ← Thư mục gốc (tất cả ổ đĩa, thư mục đều nằm dưới gốc này)
├── home/         ← Khu nhà ở của người dùng thường (ví dụ: /home/hocvien, viết tắt là ~)
├── etc/          ← Phòng điều khiển: chứa toàn bộ file cấu hình hệ thống (hostname, mạng, ssh, nginx...)
├── var/          ← Nơi dữ liệu thay đổi liên tục: đặc biệt là nhật ký hệ thống nằm ở /var/log
├── usr/          ← Chứa các phần mềm và thư viện đã cài đặt (/usr/bin)
├── bin/, sbin/   ← Chứa các câu lệnh thiết yếu nhất (ls, cp, cat, mkdir...)
├── tmp/          ← Thư mục nháp (chứa file tạm, thường tự xóa khi khởi động lại máy)
└── root/         ← Nhà riêng của siêu quản trị viên root (khác với gốc / nhé!)</code></pre>

<h3>5. Chuẩn bị môi trường thực hành an toàn</h3>
<ol>
<li><b>Ngay trên trang web này (Bắt đầu ngay không cần cài đặt):</b> Cuộn xuống cuối bài hoặc vào <a href="#/practice">Phòng luyện tập</a> để gõ lệnh trên Terminal mô phỏng – an toàn tuyệt đối 100%, không thể làm hỏng máy tính của bạn.</li>
<li><b>WSL2 trên Windows 10/11 (Nhẹ, thật):</b> Mở PowerShell bằng quyền Admin, gõ <code>wsl --install</code> rồi khởi động lại máy là có ngay một hệ thống Linux thật chạy song song trong Windows.</li>
<li><b>Máy ảo VirtualBox / VMware (Chuẩn nhất để luyện quản trị hệ thống):</b> Cài Rocky Linux hoặc Ubuntu lên máy ảo. <b>Mẹo sống còn:</b> Trước khi thử bất kỳ lệnh xóa hay sửa cấu hình hệ thống nào, hãy bấm chụp <b>Snapshot</b> (ảnh chụp trạng thái máy ảo) – nếu làm hỏng máy, chỉ mất 5 giây bấm Restore là máy sống lại nguyên vẹn!</li>
</ol>
<div class="warn"><b>Quy tắc vàng cho người mới:</b> Luôn đăng nhập bằng tài khoản người dùng thường và dùng <code>sudo</code> khi cần quyền quản trị; không đăng nhập trực tiếp bằng tài khoản <code>root</code> để làm việc hằng ngày.</div>

<h3>6. Thử chạm tay vào Terminal ngay tại đây!</h3>
<p>Đừng chỉ đọc lý thuyết! Hãy bấm chuột vào khung đen bên dưới, gõ thử từng dòng lệnh sau và nhấn <kbd>Enter</kbd> để tận mắt nhìn thấy cây thư mục Linux:</p>
<ul>
<li>Gõ <code>ls /</code> rồi nhấn Enter → Xem các thư mục nằm ngay dưới gốc <code>/</code> (bạn sẽ thấy <code>etc  home  tmp  var</code>).</li>
<li>Gõ <code>cat /etc/hostname</code> rồi nhấn Enter → Đọc file cấu hình tên máy nằm trong <code>/etc</code>.</li>
<li>Gõ <code>ls /var/log</code> rồi nhấn Enter → Xem nơi chứa các file nhật ký (log) của hệ thống.</li>
</ul>
<div class="mini-term" data-id="t-gioithieu"></div>

<div class="tip"><b>🧭 Bước tiếp theo sau Bài 1:</b>
<br>1. Gõ thử 3 lệnh ở khung Terminal ngay trên để quen cảm giác nhấn Enter.
<br>2. Làm <b>8 câu trắc nghiệm</b> ngay bên dưới và bấm <b>Chấm điểm</b> (đạt 8/8 bài học sẽ tự động đánh dấu hoàn thành ✓).
<br>3. Chuyển sang <b>Bài 2: Terminal & cấu trúc một dòng lệnh</b> để hiểu cách viết lệnh, tùy chọn và các phím tắt tăng tốc.</div>`,
    quiz: [
      { q: 'Thành phần nào chính xác là "Linux" theo nghĩa hẹp kỹ thuật?', o: ['Toàn bộ hệ điều hành gồm giao diện và phần mềm văn phòng', 'Kernel (nhân hệ điều hành) quản lý phần cứng', 'Trình duyệt web mã nguồn mở', 'Một ngôn ngữ lập trình'], a: 1, why: 'Linux chính xác là Kernel (nhân); khi ghép Kernel với bộ công cụ GNU, shell, trình quản lý gói... ta mới có một bản phân phối (Distro) như Ubuntu hay Rocky Linux.' },
      { q: 'Trên Linux, hai tên file "BaoCao.txt" và "baocao.txt" trong cùng một thư mục được hiểu là:', o: ['Cùng một file (ghi đè lên nhau)', 'Hai file hoàn toàn khác nhau', 'Tên không hợp lệ trên Linux', 'Chỉ khác nhau khi chạy trên máy chủ'], a: 1, why: 'Khác với Windows, hệ thống tập tin của Linux phân biệt chữ HOA và chữ thường tuyệt đối.' },
      { q: 'Linux quản lý đường dẫn ổ đĩa và thư mục như thế nào?', o: ['Chia thành các ổ C:, D:, E: giống Windows', 'Một cây thư mục duy nhất bắt đầu từ gốc /', 'Mỗi phần mềm nằm trên một cây riêng biệt', 'Chỉ có thư mục Desktop và My Documents'], a: 1, why: 'Mọi thư mục, tập tin và thiết bị lưu trữ trên Linux đều được gắn (mount) vào một cây thư mục duy nhất bắt đầu từ gốc "/".' },
      { q: 'Trong cây thư mục Linux, các file cấu hình của hệ thống và dịch vụ (như cấu hình mạng, SSH, Nginx) nằm ở đâu?', o: ['/home', '/tmp', '/etc', '/var/log'], a: 2, why: 'Thư mục /etc là nơi chứa toàn bộ các file văn bản cấu hình của hệ thống và các dịch vụ.' },
      { q: 'Khi một dịch vụ bị lỗi, quản trị viên thường vào thư mục nào để đọc các file nhật ký (log) của hệ thống?', o: ['/var/log', '/usr/bin', '/home/log', '/root'], a: 0, why: 'Thư mục /var/log là nơi lưu trữ các tập tin nhật ký hoạt động và báo lỗi của hệ thống.' },
      { q: 'Sự khác biệt phổ biến nhất khi sử dụng dòng lệnh giữa nhánh Red Hat (CentOS/Rocky/Alma) và nhánh Debian (Ubuntu) là gì?', o: ['Lệnh ls và cd viết hoàn toàn khác nhau', 'Trình quản lý gói cài đặt phần mềm (dnf/yum so với apt)', 'Ubuntu không có thư mục /etc', 'Rocky Linux không phân biệt chữ hoa/thường'], a: 1, why: 'Các lệnh cơ bản gần như giống hệt nhau; điểm khác biệt chính là trình quản lý gói: họ Red Hat dùng dnf/yum (.rpm), còn họ Debian/Ubuntu dùng apt (.deb).' },
      { q: 'Ký hiệu "~" (dấu ngã) trên Linux là viết tắt của thư mục nào?', o: ['Thư mục gốc /', 'Thư mục cá nhân của người dùng hiện tại (ví dụ /home/hocvien)', 'Thư mục chứa file tạm /tmp', 'Thư mục cấu hình /etc'], a: 1, why: 'Dấu "~" luôn đại diện cho thư mục nhà (Home directory) của tài khoản bạn đang đăng nhập.' },
      { q: 'Cách an toàn nhất khi bạn muốn thử nghiệm một câu lệnh nguy hiểm hoặc chỉnh sửa sâu hệ thống trong lúc học là gì?', o: ['Chạy thẳng trên máy tính chính bằng tài khoản root', 'Thử trên Terminal mô phỏng hoặc chụp Snapshot trên máy ảo trước khi chạy', 'Tắt phần mềm diệt virus rồi chạy', 'Thêm chữ force vào mọi câu lệnh'], a: 1, why: 'Terminal mô phỏng không ảnh hưởng máy thật, còn Snapshot trên máy ảo giúp bạn khôi phục lại trạng thái máy chỉ trong vài giây nếu lỡ làm hỏng.' }
    ]
  },

  {
    id: 'terminal', title: 'Terminal & cấu trúc một dòng lệnh', minutes: 20, level: 'Nhập môn', src: 'Chương 2 (2.0)',
    summary: 'Đọc dấu nhắc prompt, hiểu rõ tùy chọn (-l, -a) thay đổi kết quả thế nào, ví dụ thực tế phím Tab, ↑/↓, Ctrl+C.',
    body: `
<h3>1. Phân biệt Terminal, Shell và Lệnh</h3>
<ul>
<li><b>Terminal (Thiết bị đầu cuối):</b> là <b>cửa sổ ứng dụng</b> màu đen bạn mở lên để gõ chữ và nhìn kết quả. Bản thân Terminal không hiểu lệnh – nó chỉ nhận phím bạn gõ và hiển thị chữ lên màn hình.</li>
<li><b>Shell (Vỏ bọc – phổ biến nhất là <code>bash</code>):</b> là <b>bộ thông dịch chạy bên trong Terminal</b>. Khi bạn nhấn Enter, Shell đọc dòng chữ bạn vừa gõ, kiểm tra cú pháp, gọi chương trình tương ứng chạy rồi trả kết quả ra màn hình.</li>
<li><b>Lệnh (Command):</b> là yêu cầu cụ thể bạn ra cho máy, ví dụ <code>pwd</code> (cho biết đang đứng ở đâu) hay <code>ls</code> (liệt kê danh sách file).</li>
</ul>

<h3>2. Đọc hiểu dấu nhắc (Prompt) trên màn hình</h3>
<p>Trước khi bạn gõ bất cứ chữ gì, Terminal luôn hiện sẵn một dòng gọi là <b>dấu nhắc (Prompt)</b>. Dòng này cực kỳ hữu ích vì nó báo cho bạn biết 4 thông tin:</p>
<pre><code>hocvien@linux-lab:~$
│        │         │ └─ Dấu $ = tài khoản thường (nếu hiện dấu # nghĩa là bạn đang là siêu quản trị root!)
│        │         └─── Đang đứng ở thư mục nào (~ nghĩa là đang ở nhà /home/hocvien)
│        └───────────── Tên máy tính / máy chủ (hostname: linux-lab)
└────────────────────── Tên tài khoản đang đăng nhập (hocvien)</code></pre>
<p>Ví dụ: Khi bạn di chuyển vào thư mục <code>Documents</code>, dấu nhắc sẽ tự động đổi thành <code>hocvien@linux-lab:~/Documents$</code> để bạn luôn biết mình đang đứng ở đâu.</p>

<h3>3. Giải phẫu một dòng lệnh: Lệnh – Tùy chọn – Đối số</h3>
<p>Hầu hết câu lệnh Linux đều tuân theo công thức 3 phần cách nhau bởi <b>dấu cách (khoảng trắng)</b>:</p>
<pre><code>ls     -l     Documents
│      │      └─ 3. ĐỐI SỐ (Argument): Tác động lên cái gì / ở đâu? (ở đây là thư mục Documents)
│      └──────── 2. TÙY CHỌN (Option / Flag): Chạy theo chế độ nào? (bắt đầu bằng dấu gạch ngang -)
└─────────────── 1. TÊN LỆNH (Command): Muốn làm hành động gì? (ls = list = liệt kê)</code></pre>

<h4>❓ Giải thích kỹ: "Tùy chọn (Option / Flag) thay đổi cách chạy" nghĩa là thế nào?</h4>
<p>Hãy tưởng tượng <b>Tên lệnh (<code>ls</code>)</b> là chiếc quạt máy, còn <b>Tùy chọn (<code>-l</code>, <code>-a</code>)</b> là các nút bấm chế độ trên quạt (số 1, số 2, quay trái/phải). Cùng là hành động "liệt kê file" (<code>ls</code>), nhưng khi bạn gắn thêm tùy chọn, <b>kết quả hiển thị ra màn hình sẽ thay đổi hẳn</b>.</p>
<p>Hãy xem <b>so sánh thực tế ngay trên màn hình Terminal</b> dưới đây:</p>

<pre><code># TRƯỜNG HỢP 1: Gõ lệnh trần KHÔNG có tùy chọn (chỉ hiện tên file ngang hàng, giấu file ẩn)
hocvien@linux-lab:~$ ls
Documents  Downloads  ghichu.txt

# TRƯỜNG HỢP 2: Thêm tùy chọn -l (viết tắt của "long" = dạng danh sách chi tiết)
# → Thay đổi cách hiển thị: mỗi file 1 dòng, hiện rõ Quyền hạn, Chủ sở hữu, Dung lượng (byte), Ngày sửa!
hocvien@linux-lab:~$ ls -l
total 12
drwxr-xr-x 1 hocvien hocvien  4096 Nov  2 12:00 Documents
drwxr-xr-x 1 hocvien hocvien  4096 Nov  2 12:00 Downloads
-rw-r--r-- 1 hocvien hocvien    45 Nov  2 12:00 ghichu.txt

# TRƯỜNG HỢP 3: Thêm tùy chọn -a (viết tắt của "all" = tất cả)
# → Thay đổi phạm vi: hiện thêm cả các file ẩn bắt đầu bằng dấu chấm (như .cauhinh) mà ls thường giấu đi!
hocvien@linux-lab:~$ ls -a
.  ..  .cauhinh  Documents  Downloads  ghichu.txt

# TRƯỜNG HỢP 4: Gộp cả 2 tùy chọn ngắn thành -la (tương đương viết rời: ls -l -a)
# → Vừa hiện tất cả file ẩn (-a), vừa in dạng bảng chi tiết từng dòng (-l)!
hocvien@linux-lab:~$ ls -la
total 24
drwxr-xr-x 1 hocvien hocvien  4096 Nov  2 12:00 .
drwxr-xr-x 1 hocvien hocvien  4096 Nov  2 12:00 ..
-rw-r--r-- 1 hocvien hocvien     5 Nov  2 12:00 .cauhinh
drwxr-xr-x 1 hocvien hocvien  4096 Nov  2 12:00 Documents
drwxr-xr-x 1 hocvien hocvien  4096 Nov  2 12:00 Downloads
-rw-r--r-- 1 hocvien hocvien    45 Nov  2 12:00 ghichu.txt

# TRƯỜNG HỢP 5: Thêm ĐỐI SỐ "Documents" vào cuối (ls -l Documents)
# → Thay vì xem thư mục đang đứng, ta bảo lệnh ls hãy soi vào bên trong thư mục Documents!
hocvien@linux-lab:~$ ls -l Documents
total 4
-rw-r--r-- 1 hocvien hocvien    15 Nov  2 12:00 baocao.txt</code></pre>

<div class="tip"><b>Mẹo nhớ tùy chọn cực dễ (không cần học vẹt):</b> Các tùy chọn trong Linux không phải chữ cái ngẫu nhiên, mà là <b>chữ cái đầu tiếng Anh</b> của từ mô tả chức năng đó:
<br>• <code>-l</code> = <b>l</b>ong (dạng dài, chi tiết) &nbsp;|&nbsp; <code>-a</code> = <b>a</b>ll (tất cả, gồm cả file ẩn)
<br>• <code>-h</code> = <b>h</b>uman-readable (đổi số byte khó đọc như <code>4096</code> thành <code>4K</code>, <code>20G</code> cho người dễ đọc)
<br>• <code>-r</code> = <b>r</b>ecursive (đệ quy – làm cho cả thư mục và toàn bộ bên trong nó) hoặc <b>r</b>everse (đảo ngược)
<br>• <code>-n</code> = <b>n</b>umber (số dòng, ví dụ <code>head -n 5</code> là lấy 5 dòng đầu)
<br>• <b>Một dấu gạch ngang (<code>-l</code>, <code>-a</code>)</b> là tùy chọn viết tắt 1 chữ cái (gộp chung được thành <code>-la</code>). <b>Hai dấu gạch ngang (<code>--help</code>, <code>--all</code>)</b> là tùy chọn viết nguyên từ tiếng Anh (không gộp chung được).</div>

<h3>4. Ba phím cứu hộ – Ví dụ thực tế cách dùng trong Terminal</h3>
<p>Người dùng Linux chuyên nghiệp gõ rất nhanh và ít sai chính tả không phải vì họ gõ 10 ngón siêu đẳng, mà vì họ dùng phím <kbd>Tab</kbd> và <kbd>↑</kbd> liên tục. Hãy xem kịch bản thực tế dưới đây:</p>

<h4>① Phím <kbd>Tab</kbd>: Tự động điền nốt tên lệnh hoặc tên file/thư mục</h4>
<p>Khi bạn mới gõ được vài chữ cái đầu của tên file hoặc thư mục rồi bấm phím <kbd>Tab</kbd> trên bàn phím, Shell sẽ tìm xem có file nào khớp không và <b>tự động viết nốt phần còn lại cho bạn</b>.</p>
<pre><code># KỊCH BẢN A: Có duy nhất 1 tên khớp → Bấm Tab 1 lần là tự điền xong!
# Bạn muốn đọc file "ghichu.txt". Thay vì gõ đủ 10 chữ dễ sai chính tả, bạn chỉ gõ "cat ghi" rồi bấm [Tab]:
hocvien@linux-lab:~$ cat ghi[Bấm phím Tab]
# → Màn hình tự động biến thành:
hocvien@linux-lab:~$ cat ghichu.txt 

# KỊCH BẢN B: Có nhiều tên cùng bắt đầu giống nhau → Bấm Tab để xem gợi ý!
# Trong thư mục có cả "Documents" và "Downloads" (cùng bắt đầu bằng chữ "Do").
# Nếu bạn chỉ gõ "cd Do" rồi bấm [Tab], máy sẽ điền tới phần chung "Do" và in ra các lựa chọn:
hocvien@linux-lab:~$ cd Do[Bấm phím Tab]
Documents/  Downloads/
# → Lúc này bạn thấy gợi ý, chỉ cần gõ thêm chữ "c" (thành "cd Doc") rồi bấm [Tab] lần nữa:
hocvien@linux-lab:~$ cd Doc[Bấm phím Tab]
# → Máy tự điền nốt thành:
hocvien@linux-lab:~$ cd Documents/</code></pre>

<h4>② Phím mũi tên <kbd>↑</kbd> / <kbd>↓</kbd>: Gọi lại câu lệnh cũ để chạy lại hoặc sửa lỗi</h4>
<pre><code># KỊCH BẢN: Bạn định gõ "cat ghichu.txt" nhưng gõ thiếu mất chữ "t" ở cuối:
hocvien@linux-lab:~$ cat ghichu.tx
cat: ghichu.tx: No such file or directory

# Thay vì phải gõ lại cả dòng từ đầu, bạn chỉ cần bấm phím mũi tên lên [↑] 1 lần:
hocvien@linux-lab:~$ [Bấm phím ↑] → dòng "cat ghichu.tx" lập tức hiện lại!
# Bạn chỉ việc gõ thêm chữ "t" vào cuối rồi nhấn Enter.</code></pre>

<h4>③ Tổ hợp phím <kbd>Ctrl</kbd> + <kbd>C</kbd>: Hủy dòng đang gõ dở hoặc dừng lệnh đang chạy</h4>
<pre><code># KỊCH BẢN: Bạn đang gõ dở một dòng lệnh dài ngoằng bị nhầm, không muốn xóa từng chữ bằng Backspace:
hocvien@linux-lab:~$ cp -r thu_muc_nham /duong/dan/sai[Bấm Ctrl + C]
hocvien@linux-lab:~$ cp -r thu_muc_nham /duong/dan/sai^C
hocvien@linux-lab:~$    ← Trả về dòng nhắc mới tinh ngay lập tức, lệnh trên KHÔNG bị chạy!</code></pre>
<p>Ngoài ra: Bấm <kbd>Ctrl</kbd>+<kbd>L</kbd> (hoặc gõ lệnh <code>clear</code>) để xóa sạch màn hình cho đỡ rối; gõ <code>history</code> để xem lại danh sách các lệnh bạn đã từng gõ.</p>

<h3>5. Kỹ năng tự tra cứu ngay trong Terminal (<code>man</code>, <code>--help</code>, <code>type</code>)</h3>
<p>Không ai nhớ hết mọi tùy chọn của hàng trăm câu lệnh. Khi quên một lệnh dùng thế nào, hãy hỏi chính hệ thống:</p>
<pre><code># 1. Xem sổ tay hướng dẫn của lệnh ls (trên máy thật nhấn phím q để thoát sổ tay):
hocvien@linux-lab:~$ man ls
LS(1)
MÔ TẢ
    Liệt kê tập tin/thư mục (-l chi tiết, -a cả file ẩn)
VÍ DỤ
    ls -la

# 2. Hoặc dùng tùy chọn dài --help gắn vào sau bất kỳ lệnh nào:
hocvien@linux-lab:~$ cp --help

# 3. Kiểm tra xem một lệnh là lệnh nội bộ của Shell (builtin) hay là chương trình cài trong /usr/bin:
hocvien@linux-lab:~$ type cd
cd is a shell builtin
hocvien@linux-lab:~$ type ls
ls is /usr/bin/ls</code></pre>

<div class="tip"><b>Cách đọc 3 thông báo lỗi kinh điển bằng tiếng Anh:</b>
<br>• <code>command not found</code>: Gõ sai tên lệnh (ví dụ gõ <code>sl</code> thay vì <code>ls</code>) hoặc phần mềm đó chưa được cài.
<br>• <code>No such file or directory</code>: Tên lệnh thì đúng, nhưng <b>tên file hoặc đường dẫn bạn truyền vào không tồn tại</b> (kiểm tra lại chính tả, chữ hoa/thường).
<br>• <code>Permission denied</code>: File có tồn tại, nhưng tài khoản của bạn <b>không đủ quyền</b> để đọc/sửa/đi vào đó.</div>

<h3>6. Thực hành ngay tại chỗ (Hãy thử đủ 5 bước dưới đây!)</h3>
<p>Bấm vào khung Terminal bên dưới và thực hành lần lượt:</p>
<ol>
<li>Gõ <code>ls</code> rồi Enter, sau đó gõ <code>ls -l</code> rồi Enter, rồi <code>ls -la</code> để tự mắt thấy sự khác biệt khi thêm tùy chọn <code>-l</code> và <code>-a</code>.</li>
<li>Thử phím <b>Tab</b>: chỉ gõ <code>cat gh</code> rồi bấm phím <kbd>Tab</kbd> trên bàn phím của bạn — xem nó có tự điền thành <code>cat ghichu.txt</code> không!</li>
<li>Thử phím <b>Tab gợi ý</b>: gõ <code>cd Do</code> rồi bấm phím <kbd>Tab</kbd> — xem máy in ra 2 gợi ý <code>Documents/  Downloads/</code>.</li>
<li>Thử phím <kbd>↑</kbd>: bấm phím mũi tên lên <kbd>↑</kbd> trên bàn phím để gọi lại các lệnh vừa gõ.</li>
<li>Thử tự tra cứu: gõ <code>man cp</code>, <code>ls --help</code> và <code>type cd</code>.</li>
</ol>
<div class="mini-term" data-id="t-terminal"></div>

<div class="tip"><b>🧭 Bước tiếp theo sau Bài 2:</b>
<br>1. Hoàn thành 5 thao tác thử nghiệm trong khung Terminal ở trên (đặc biệt là phím <kbd>Tab</kbd> và <kbd>↑</kbd>).
<br>2. Làm <b>8 câu trắc nghiệm</b> bên dưới và bấm <b>Chấm điểm</b>.
<br>3. Nếu muốn tra nhanh bất kỳ lệnh nào vừa học, bạn có thể mở thử <a href="#/cheatsheet">📖 Tra cứu lệnh</a> ở thanh bên trái, sau đó học tiếp <b>Bài 3: Cây thư mục & di chuyển</b> (bài 3 sẽ bắt đầu có <b>Thử thách chấm điểm tự động</b> đầu tiên!).</div>`,
    quiz: [
      { q: 'Trong câu lệnh "ls -la /etc", thành phần nào là TÙY CHỌN (Option / Flag) và thành phần nào là ĐỐI SỐ (Argument)?', o: ['"ls" là tùy chọn, "-la" là đối số', '"-la" là tùy chọn (thay đổi chế độ hiển thị), còn "/etc" là đối số (thư mục cần liệt kê)', '"/etc" là tùy chọn, "-la" là tên lệnh', 'Cả "-la" và "/etc" đều là tên lệnh'], a: 1, why: 'Tùy chọn bắt đầu bằng dấu gạch ngang (-la) để đổi chế độ chạy của lệnh ls; còn /etc là đối số chỉ định đối tượng mà lệnh ls cần liệt kê.' },
      { q: 'Khi bạn gõ "ls -l" thay vì chỉ gõ "ls", tùy chọn "-l" (long) thay đổi kết quả như thế nào?', o: ['Xóa toàn bộ các file trong thư mục', 'Chỉ hiện các file ẩn bắt đầu bằng dấu chấm', 'Hiển thị dạng danh sách chi tiết từng dòng (gồm quyền hạn, chủ sở hữu, dung lượng, ngày giờ)', 'Sắp xếp các file theo thứ tự ngẫu nhiên'], a: 2, why: '-l là viết tắt của "long format" (định dạng dài/chi tiết), giúp hiển thị đầy đủ quyền hạn (rwx), chủ sở hữu, kích thước và thời gian sửa đổi của từng mục.' },
      { q: 'Trong thư mục hiện tại có file tên là "ghichu.txt". Khi bạn mới gõ "cat ghi" rồi nhấn phím Tab trên bàn phím, điều gì sẽ xảy ra?', o: ['Terminal xóa hết dòng đang gõ', 'Shell tự động điền nốt phần còn lại thành "cat ghichu.txt"', 'Máy báo lỗi command not found', 'File ghichu.txt bị đổi tên thành ghi'], a: 1, why: 'Phím Tab dùng để tự động hoàn thành (auto-complete) tên lệnh hoặc tên file/thư mục khi phần đầu bạn gõ đã khớp duy nhất.' },
      { q: 'Trong thư mục có 2 thư mục cùng bắt đầu bằng chữ "Do" là "Documents" và "Downloads". Khi bạn gõ "cd Do" rồi nhấn phím Tab, Terminal sẽ làm gì?', o: ['Tự chọn đại một thư mục để đi vào', 'Báo lỗi Permission denied', 'Hiển thị danh sách cả 2 gợi ý "Documents/  Downloads/" để bạn gõ thêm chữ phân biệt', 'Tạo thêm thư mục mới tên là Do'], a: 2, why: 'Khi có nhiều file/thư mục cùng khớp với phần đầu, nhấn Tab sẽ liệt kê các ứng viên để bạn biết và gõ thêm ký tự tiếp theo (ví dụ "cd Doc" + Tab).' },
      { q: 'Bạn vừa gõ một câu lệnh dài nhưng bị thiếu 1 chữ cái ở cuối nên báo lỗi. Cách nhanh nhất để gọi lại nguyên câu lệnh vừa gõ ra sửa là bấm phím nào?', o: ['Phím mũi tên lên (↑)', 'Phím Tab', 'Tổ hợp phím Ctrl + C', 'Phím Esc'], a: 0, why: 'Phím mũi tên lên (↑) và xuống (↓) giúp duyệt lại lịch sử các câu lệnh vừa gõ để sửa nhanh mà không cần gõ lại từ đầu.' },
      { q: 'Dấu "$" ở cuối dấu nhắc "hocvien@linux-lab:~$" cho bạn biết điều gì?', o: ['Bạn đang đăng nhập bằng tài khoản siêu quản trị root', 'Bạn đang làm việc với tư cách người dùng thường (không phải root)', 'Máy chủ đang bị lỗi kết nối mạng', 'Thư mục hiện tại đang bị khóa'], a: 1, why: 'Dấu "$" biểu thị người dùng thường; còn dấu "#" mới biểu thị tài khoản siêu quản trị root.' },
      { q: 'Khi đang gõ dở một câu lệnh bị nhầm hoặc một chương trình đang chạy mãi trên Terminal mà bạn muốn dừng/hủy ngay lập tức, bạn bấm phím gì?', o: ['Ctrl + V', 'Ctrl + C', 'Ctrl + Z rồi tắt máy', 'Alt + F4'], a: 1, why: 'Ctrl + C gửi tín hiệu ngắt (SIGINT) để dừng lệnh đang chạy hoặc hủy bỏ dòng lệnh đang gõ dở (hiện ^C và xuống dòng mới).' },
      { q: 'Khi chạy một lệnh và nhận được thông báo lỗi "No such file or directory", nguyên nhân thường gặp nhất là gì?', o: ['Bạn chưa có quyền quản trị sudo', 'Bạn gõ sai tên file/thư mục (hoặc nhầm chữ HOA/thường, sai đường dẫn)', 'Máy tính bị hết dung lượng RAM', 'Lệnh đó không tồn tại trong Linux'], a: 1, why: '"No such file or directory" nghĩa là không tìm thấy tập tin hay thư mục đó – thường do gõ sai chính tả, nhầm chữ hoa/thường hoặc đứng sai thư mục.' }
    ]
  },

  {
    id: 'thu-muc', title: 'Cây thư mục & di chuyển (pwd, ls, cd)', minutes: 20, level: 'Cơ bản', src: 'Chương 2',
    summary: 'Đường dẫn tuyệt đối/tương đối, các lệnh định vị pwd, ls, cd và thực hành điều hướng.',
    practice: 'dieu-huong',
    body: `
<h3>1. Ba lệnh định vị "sống còn" khi vào Terminal</h3>
<p>Khi làm việc trên giao diện đồ họa (Windows Explorer), mắt bạn luôn nhìn thấy mình đang mở thư mục nào và bên trong có những icon gì. Còn trong màn hình chữ của Terminal, bạn dùng 3 lệnh sau để thay thế đôi mắt và đôi chân:</p>
<pre><code># 1. pwd (print working directory) = "Tôi đang đứng ở đâu?"
hocvien@linux-lab:~$ pwd
/home/hocvien

# 2. ls (list) = "Xung quanh chỗ tôi đứng có những gì?"
hocvien@linux-lab:~$ ls
Documents  Downloads  ghichu.txt

# 3. cd (change directory) = "Bước chân đi vào thư mục khác"
hocvien@linux-lab:~$ cd Documents
hocvien@linux-lab:~/Documents$ pwd
/home/hocvien/Documents</code></pre>

<h3>2. Các tùy chọn quan trọng của lệnh <code>ls</code> (và kết quả thay đổi ra sao)</h3>
<table>
<tr><th>Câu lệnh</th><th>Ý nghĩa tùy chọn</th><th>Kết quả trên màn hình thay đổi thế nào?</th></tr>
<tr><td><code>ls</code></td><td>Không có tùy chọn</td><td>Chỉ in tên các file/thư mục thường trên cùng 1 dòng.</td></tr>
<tr><td><code>ls -l</code></td><td><code>-l</code> (<b>l</b>ong format)</td><td>In dạng bảng chi tiết từng dòng: quyền hạn, chủ sở hữu, kích thước (byte), ngày giờ, tên.</td></tr>
<tr><td><code>ls -lh</code></td><td><code>-l</code> + <code>-h</code> (<b>h</b>uman-readable)</td><td>Giống <code>ls -l</code> nhưng đổi cột kích thước từ byte (<code>4096</code>) sang đơn vị dễ đọc (<code>4K</code>, <code>15B</code>).</td></tr>
<tr><td><code>ls -a</code></td><td><code>-a</code> (<b>a</b>ll)</td><td>Hiện thêm cả các <b>file ẩn</b> (tên bắt đầu bằng dấu <code>.</code> như <code>.cauhinh</code>, <code>.bashrc</code>).</td></tr>
<tr><td><code>ls -ld Documents</code></td><td><code>-d</code> (<b>d</b>irectory itself)</td><td>Xem quyền hạn của <b>chính vỏ thư mục</b> <code>Documents</code> thay vì liệt kê các file nằm bên trong nó.</td></tr>
</table>

<h3>3. Đường dẫn Tuyệt đối (Absolute) và Tương đối (Relative)</h3>
<p>Để chỉ cho Linux biết một file hay thư mục nằm ở đâu, có 2 cách viết đường dẫn:</p>
<table>
<tr><th>Loại đường dẫn</th><th>Dấu hiệu nhận biết</th><th>Ví dụ thực tế</th><th>Khi nào nên dùng?</th></tr>
<tr><td><b>Tuyệt đối (Absolute)</b></td><td>Luôn bắt đầu bằng dấu <code>/</code> (tính từ gốc cây thư mục)</td><td><code>cd /etc/nginx</code><br><code>cat /home/hocvien/Documents/baocao.txt</code></td><td>Dùng khi muốn nhảy tới một vị trí ở xa mà <b>không phụ thuộc vào việc bạn đang đứng ở đâu</b> (đặc biệt trong script và cron).</td></tr>
<tr><td><b>Tương đối (Relative)</b></td><td><b>Không</b> bắt đầu bằng dấu <code>/</code> (tính từ chỗ bạn đang đứng hiện tại)</td><td>Đang ở <code>/home/hocvien</code>:<br><code>cd Documents</code><br><code>cat Documents/baocao.txt</code></td><td>Dùng khi thao tác nhanh với các thư mục/file nằm ngay cạnh hoặc bên trong chỗ bạn đang đứng.</td></tr>
</table>

<h4>4 ký hiệu đường dẫn đặc biệt cần thuộc lòng:</h4>
<ul>
<li><code>.</code> (một dấu chấm) = <b>thư mục hiện tại</b> (chỗ bạn đang đứng). Ví dụ: <code>./script.sh</code> nghĩa là "chạy file <code>script.sh</code> nằm ngay tại thư mục đang đứng".</li>
<li><code>..</code> (hai dấu chấm) = <b>thư mục cha</b> (lùi lên 1 cấp).</li>
<li><code>~</code> (dấu ngã) = <b>thư mục nhà (Home)</b> của bạn (<code>/home/hocvien</code>).</li>
<li><code>-</code> (dấu gạch ngang khi đi với <code>cd</code>) = <b>thư mục vừa đứng trước đó</b> (giống nút Back trên trình duyệt).</li>
</ul>

<pre><code># Ví dụ thực tế di chuyển qua lại trong Terminal:
hocvien@linux-lab:~$ cd /var/log          # Nhảy thẳng tới /var/log (đường dẫn tuyệt đối)
hocvien@linux-lab:/var/log$ cd ..         # Lùi lên 1 cấp → về /var
hocvien@linux-lab:/var$ cd -              # Quay lại nơi vừa đứng trước đó → về lại /var/log
hocvien@linux-lab:/var/log$ cd ~          # Về thẳng nhà /home/hocvien (hoặc chỉ cần gõ: cd)
hocvien@linux-lab:~$</code></pre>

<div class="tip"><b>Tư duy "Bản đồ":</b> Trước khi gõ bất kỳ lệnh nào tác động lên file, hãy tạo phản xạ tự hỏi 2 câu: <b>(1) Mình đang đứng ở đâu? (<code>pwd</code>)</b> và <b>(2) File mình cần nằm ở đâu so với chỗ mình đứng?</b> 90% lỗi <code>No such file or directory</code> của người mới là do đứng ở thư mục A nhưng lại gõ đường dẫn tương đối của thư mục B!</div>

<h3>4. Thực hành ngay tại chỗ</h3>
<p>Gõ lần lượt vào Terminal bên dưới (nhớ dùng phím <kbd>Tab</kbd> khi gõ chữ <code>Doc</code> hoặc <code>bao</code> nhé):</p>
<ol>
<li><code>pwd</code> → xem vị trí hiện tại.</li>
<li><code>ls -la</code> → xem toàn bộ file (cả file ẩn <code>.cauhinh</code>).</li>
<li><code>cd Documents</code> → đi vào thư mục <code>Documents</code> (chú ý dấu nhắc đổi thành <code>~/Documents$</code>).</li>
<li><code>cat baocao.txt</code> → đọc nội dung file báo cáo.</li>
<li><code>cd ..</code> → lùi ra lại thư mục nhà <code>/home/hocvien</code>.</li>
</ol>
<div class="mini-term" data-id="t-thumuc"></div>

<div class="tip"><b>🧭 Bước tiếp theo sau Bài 3:</b>
<br>1. Làm <b>8 câu trắc nghiệm</b> ngay bên dưới để nắm chắc đường dẫn tuyệt đối/tương đối.
<br>2. <b>Bắt buộc thực hành chấm điểm:</b> Bấm vào <a href="#/practice/dieu-huong">🎯 Thử thách 1: Điều hướng & khám phá</a> để hệ thống tự động kiểm tra kỹ năng di chuyển và đọc file của bạn!</div>`,
    quiz: [
      { q: 'Câu lệnh nào cho biết đường dẫn đầy đủ của thư mục mà bạn đang đứng hiện tại?', o: ['ls -l', 'cd', 'pwd', 'whoami'], a: 2, why: 'pwd (print working directory) in ra đường dẫn tuyệt đối của thư mục hiện tại.' },
      { q: 'Bạn đang đứng ở "/home/hocvien/Documents". Gõ lệnh nào dưới đây sẽ đưa bạn lùi lên 1 cấp về "/home/hocvien"?', o: ['cd .', 'cd ..', 'cd /', 'cd Documents'], a: 1, why: 'Ký hiệu ".." luôn đại diện cho thư mục cha (cấp ngay phía trên thư mục hiện tại).' },
      { q: 'Đường dẫn nào dưới đây là ĐƯỜNG DẪN TUYỆT ĐỐI (Absolute path)?', o: ['Documents/baocao.txt', '../hocvien/ghichu.txt', '/etc/nginx/nginx.conf', './script.sh'], a: 2, why: 'Đường dẫn tuyệt đối luôn bắt đầu bằng dấu gạch chéo "/" (gốc của cây thư mục).' },
      { q: 'Trên Linux, một tập tin hoặc thư mục được coi là "ẩn" (hidden) khi tên của nó có đặc điểm gì?', o: ['Có đuôi là .hidden', 'Bắt đầu bằng một dấu chấm "." (ví dụ: .bashrc, .cauhinh)', 'Viết toàn bộ bằng chữ in hoa', 'Nằm trong thư mục /tmp'], a: 1, why: 'Mọi file/thư mục có tên bắt đầu bằng dấu "." đều được ẩn đi khi chạy ls thông thường; cần dùng "ls -a" để nhìn thấy.' },
      { q: 'Bạn đang ở "/home/hocvien", sau đó gõ "cd /var/log". Muốn quay ngược lại ngay thư mục vừa đứng trước đó (/home/hocvien), bạn có thể gõ lệnh nào?', o: ['cd .', 'cd -', 'cd /', 'pwd -'], a: 1, why: 'Lệnh "cd -" đưa bạn quay trở lại đúng thư mục làm việc ngay trước đó (tương tự nút Back). Ngoài ra "cd ~" hoặc "cd" cũng đưa bạn về thư mục home.' },
      { q: 'Sự khác nhau giữa lệnh "ls -l Documents" và "ls -ld Documents" là gì?', o: ['Không có gì khác nhau', '"ls -l Documents" liệt kê các file bên trong Documents, còn "ls -ld Documents" chỉ hiện thông tin quyền hạn của chính vỏ thư mục Documents', '"ls -ld" dùng để xóa thư mục Documents', '"ls -l" chỉ hiện file ẩn'], a: 1, why: 'Tùy chọn -d (directory) bảo lệnh ls hiển thị thông tin của bản thân thư mục đó chứ không liệt kê nội dung bên trong.' },
      { q: 'Khi bạn chỉ gõ đúng chữ "cd" (không kèm đối số nào) rồi nhấn Enter, chuyện gì sẽ xảy ra?', o: ['Terminal báo lỗi thiếu đối số', 'Bạn được đưa thẳng về thư mục nhà (Home directory, tức ~)', 'Bạn bị đẩy ra thư mục gốc /', 'Không có gì thay đổi'], a: 1, why: 'Gõ "cd" không đối số hoàn toàn tương đương với "cd ~", luôn đưa bạn về thư mục cá nhân (/home/ten_ban).' },
      { q: 'Khi gõ "ls -lh", chữ "-h" (human-readable) có tác dụng gì?', o: ['Ẩn các file dung lượng lớn', 'Hiển thị dung lượng file kèm đơn vị dễ đọc như B, K (KB), M (MB), G (GB) thay vì dãy số byte dài', 'Mở trang trợ giúp của lệnh ls', 'Chỉ liệt kê các file nằm trong /home'], a: 1, why: 'Tùy chọn -h giúp định dạng kích thước tập tin sang đơn vị thân thiện với con người (4K, 12M, 2G...).' }
    ]
  },

  {
    id: 'tap-tin', title: 'Làm việc với tập tin & thư mục', minutes: 25, level: 'Cơ bản', src: 'Chương 2',
    summary: 'Tạo, sao chép, đổi tên, xóa; đọc nội dung; chuyển hướng (>, >>) và ghép ống dẫn (pipe |).',
    practice: 'tao-file',
    body: `
<h3>1. Tạo thư mục và tập tin: <code>mkdir</code>, <code>touch</code>, <code>echo &gt;</code></h3>
<pre><code># 1. mkdir (make directory) = Tạo thư mục mới
hocvien@linux-lab:~$ mkdir linux-lab

# Tùy chọn -p (parents): Tạo cả chuỗi thư mục cha-con lồng nhau chỉ bằng 1 lệnh
# (Nếu không có -p, khi thư mục "du-an" chưa tồn tại thì lệnh tạo "du-an/2026/baocao" sẽ báo lỗi ngay!)
hocvien@linux-lab:~$ mkdir -p du-an/2026/baocao

# 2. touch = Tạo nhanh một tập tin rỗng (0 byte)
hocvien@linux-lab:~$ touch nhatky.txt

# 3. Dùng echo kết hợp dấu chuyển hướng > (ghi mới/ghi đè) và >> (ghi nối thêm vào cuối)
hocvien@linux-lab:~$ echo "Dong 1: Bat dau hoc" > nhatky.txt
hocvien@linux-lab:~$ echo "Dong 2: Da hieu lenh" >> nhatky.txt
hocvien@linux-lab:~$ cat nhatky.txt
Dong 1: Bat dau hoc
Dong 2: Da hieu lenh</code></pre>
<div class="warn"><b>Cảnh báo cực kỳ quan trọng giữa <code>&gt;</code> và <code>&gt;&gt;</code>:</b>
<br>• Một dấu <code>&gt;</code> sẽ <b>XÓA SẠCH nội dung cũ</b> của file rồi mới ghi dòng mới vào (ghi đè).
<br>• Hai dấu <code>&gt;&gt;</code> sẽ <b>GIỮ NGUYÊN nội dung cũ</b> và nối thêm dòng mới xuống dưới cùng. Nhầm <code>&gt;&gt;</code> thành <code>&gt;</code> là nguyên nhân hàng đầu làm mất dữ liệu cấu hình và log!</div>

<h3>2. Xem nội dung tập tin: <code>cat</code>, <code>head</code>, <code>tail</code>, <code>wc</code></h3>
<p>Tùy vào độ dài của file, ta chọn công cụ đọc phù hợp:</p>
<table>
<tr><th>Câu lệnh & Tùy chọn</th><th>Từ gốc tiếng Anh</th><th>Tác dụng thực tế & Ví dụ</th></tr>
<tr><td><code>cat nhatky.txt</code></td><td>con<b>cat</b>enate</td><td>In toàn bộ nội dung file ra màn hình (chỉ dùng cho file ngắn vài chục dòng).</td></tr>
<tr><td><code>head -n 5 log.txt</code></td><td><b>head</b> + <b>n</b>umber</td><td>Chỉ lấy <b>5 dòng đầu tiên</b> của file (mặc định không có <code>-n</code> sẽ lấy 10 dòng đầu).</td></tr>
<tr><td><code>tail -n 5 log.txt</code></td><td><b>tail</b> + <b>n</b>umber</td><td>Chỉ lấy <b>5 dòng cuối cùng</b> của file – <b>cực kỳ hay dùng để đọc các dòng lỗi mới nhất vừa sinh ra ở cuối file log!</b></td></tr>
<tr><td><code>wc -l log.txt</code></td><td><b>w</b>ord <b>c</b>ount + <b>l</b>ines</td><td>Đếm tổng <b>số dòng</b> (<code>-l</code>) của file. (Nếu dùng <code>-w</code> là đếm số từ, <code>-c</code> là đếm số byte).</td></tr>
</table>

<h3>3. Sao chép (<code>cp</code>) – Đổi tên / Di chuyển (<code>mv</code>) – Xóa (<code>rm</code>)</h3>
<pre><code># 1. cp (copy): cp [nguồn] [đích]
hocvien@linux-lab:~$ cp nhatky.txt backup.txt          # Sao chép file nhatky.txt thành bản sao backup.txt
hocvien@linux-lab:~$ cp -r du-an du-an-sao-luu         # Sao chép cả THƯ MỤC: bắt buộc phải có tùy chọn -r (recursive = đệ quy)!

# 2. mv (move): Vừa dùng để ĐỔI TÊN, vừa dùng để DI CHUYỂN (tùy vào đích đến là tên mới hay thư mục!)
hocvien@linux-lab:~$ mv backup.txt nhatky-cu.txt       # Đích chưa phải thư mục → ĐỔI TÊN backup.txt thành nhatky-cu.txt
hocvien@linux-lab:~$ mv nhatky-cu.txt Documents/       # Đích là thư mục có sẵn → DI CHUYỂN file đó vào trong Documents/

# 3. rm (remove) và rmdir (remove empty directory): XÓA
hocvien@linux-lab:~$ rmdir thumuc-rong                 # rmdir chỉ xóa được thư mục RỖNG (có file bên trong sẽ báo lỗi)
hocvien@linux-lab:~$ rm nhatky.txt                     # Xóa 1 file
hocvien@linux-lab:~$ rm -r du-an-sao-luu               # Xóa cả thư mục và toàn bộ bên trong (cần -r = recursive)</code></pre>
<div class="warn"><b>Linux ở dòng lệnh KHÔNG có Thùng rác (Recycle Bin)!</b> Lệnh <code>rm</code> đã chạy là dữ liệu mất vĩnh viễn.
<br><b>Thói quen an toàn:</b> Trước khi gõ <code>rm -r ten_thu_muc</code>, hãy gõ <code>ls ten_thu_muc</code> trước để nhìn tận mắt mình sắp xóa cái gì. Tuyệt đối không chạy <code>rm -rf /</code> hay <code>rm -rf ~</code>!</div>

<h3>4. Ký tự đại diện (Wildcard / Glob: <code>*</code> và <code>?</code>)</h3>
<p>Khi muốn thao tác với hàng loạt file có tên gần giống nhau cùng lúc:</p>
<ul>
<li><code>*</code> (dấu sao): đại diện cho <b>bất kỳ chuỗi ký tự nào</b> (kể cả rỗng). Ví dụ: <code>ls *.txt</code> sẽ khớp với mọi file có đuôi <code>.txt</code> (<code>ghichu.txt</code>, <code>baocao.txt</code>...).</li>
<li><code>?</code> (dấu hỏi): đại diện cho <b>đúng 1 ký tự đơn lẻ</b>. Ví dụ: <code>ls bai?.txt</code> sẽ khớp với <code>bai1.txt</code>, <code>bai2.txt</code> nhưng không khớp với <code>bai10.txt</code>.</li>
</ul>

<h3>5. Đường ống (Pipe <code>|</code>) và Lọc văn bản (<code>grep</code>) – Sức mạnh ghép lệnh</h3>
<p>Ký hiệu <code>|</code> (gạch đứng, nằm trên phím Enter) gọi là <b>Pipe (Ống dẫn)</b>. Nó lấy <b>toàn bộ kết quả đầu ra của lệnh bên trái</b> bơm thẳng làm <b>đầu vào cho lệnh bên phải</b>, giống như dây chuyền lắp ráp:</p>
<pre><code># Ví dụ thực tế: Giả sử file log.txt có hàng trăm dòng, ta chỉ muốn tìm các dòng có chữ "ERROR":
hocvien@linux-lab:~$ grep ERROR log.txt
2026-11-02 10:01 ERROR Disk full
2026-11-02 10:05 ERROR Permission denied

# Tùy chọn hữu ích của grep:
#   -i (ignore-case): tìm không phân biệt chữ HOA/thường (khớp cả error, Error, ERROR)
#   -n (line number): in kèm số thứ tự dòng tìm thấy
#   -c (count): chỉ in ra số lượng dòng khớp
#   -v (invert): lọc ngược lại – chỉ lấy các dòng KHÔNG chứa từ khóa đó!

# Ghép dây chuyền bằng ống dẫn (|) và lưu kết quả ra file (>):
# Bước 1: Lọc các dòng chứa ERROR trong log.txt → Bước 2: Đếm xem có bao nhiêu dòng bằng wc -l
hocvien@linux-lab:~$ grep ERROR log.txt | wc -l
2

# Lưu toàn bộ các dòng lỗi tìm được sang một file riêng tên là loi.txt:
hocvien@linux-lab:~$ grep ERROR log.txt > loi.txt</code></pre>

<h3>6. Thực hành ngay tại chỗ</h3>
<p>Gõ thử chuỗi thao tác sau vào Terminal bên dưới:</p>
<ol>
<li><code>mkdir linux-lab && cd linux-lab</code> (tạo thư mục rồi bước vào luôn).</li>
<li><code>echo "ERROR: mat ket noi" > test.log</code> rồi <code>echo "INFO: binh thuong" >> test.log</code>.</li>
<li><code>cat test.log</code> → xem cả 2 dòng vừa tạo.</li>
<li><code>grep ERROR test.log | wc -l</code> → lọc dòng lỗi và đếm số dòng.</li>
</ol>
<div class="mini-term" data-id="t-taptin"></div>

<div class="tip"><b>🧭 Bước tiếp theo sau Bài 4:</b>
<br>1. Làm <b>8 câu trắc nghiệm</b> ngay bên dưới.
<br>2. <b>Thực hành chấm điểm (3 thử thách gắn liền với Bài 4):</b>
<br>&nbsp;&nbsp;• <a href="#/practice/tao-file">🎯 Thử thách 2: Tạo – sao chép – đổi tên</a>
<br>&nbsp;&nbsp;• <a href="#/practice/don-dep">🎯 Thử thách 3: Dọn dẹp thư mục</a> (phân biệt <code>rmdir</code> và <code>rm -r</code>)
<br>&nbsp;&nbsp;• <a href="#/practice/loc-log">🎯 Thử thách 5: Săn lỗi trong log</a> (luyện <code>grep</code>, <code>|</code>, <code>wc -l</code>, <code>&gt;</code>)</div>`,
    quiz: [
      { q: 'Để ĐỔI TÊN tập tin "nhap.txt" thành "chinh-thuc.txt" trong cùng thư mục, bạn dùng lệnh nào?', o: ['rename nhap.txt chinh-thuc.txt', 'cp nhap.txt chinh-thuc.txt', 'mv nhap.txt chinh-thuc.txt', 'touch nhap.txt chinh-thuc.txt'], a: 2, why: 'Trên Linux, lệnh mv (move) vừa dùng để di chuyển file sang thư mục khác, vừa dùng để đổi tên file khi đứng cùng thư mục.' },
      { q: 'Sự khác biệt sống còn giữa hai toán tử chuyển hướng ">" và ">>" là gì?', o: ['Không có sự khác biệt nào', '">" xóa sạch nội dung cũ để ghi đè, còn ">>" giữ nguyên nội dung cũ và nối thêm vào cuối file', '">" nối thêm vào cuối file, còn ">>" ghi đè', '">>" chỉ dùng được cho thư mục'], a: 1, why: 'Một mũi tên (>) sẽ ghi đè toàn bộ tập tin; hai mũi tên (>>) sẽ ghi nối tiếp vào dòng cuối cùng.' },
      { q: 'Khi bạn muốn sao chép cả một thư mục "du-an" sang "du-an-backup", vì sao gõ "cp du-an du-an-backup" lại báo lỗi?', o: ['Vì lệnh cp không bao giờ sao chép được thư mục', 'Vì thiếu tùy chọn đệ quy "-r" (cp -r du-an du-an-backup) để sao chép cả thư mục và nội dung bên trong', 'Vì tên thư mục không được có dấu gạch ngang', 'Vì phải dùng lệnh mv thay cho cp'], a: 1, why: 'Mặc định cp chỉ chép file lẻ; muốn chép cả thư mục cùng các file/thư mục con bên trong, bắt buộc phải thêm tùy chọn -r (recursive).' },
      { q: 'Sự khác nhau giữa lệnh "rmdir rac" và "rm -r rac" là gì?', o: ['"rmdir" chỉ xóa được khi thư mục "rac" hoàn toàn RỖNG, còn "rm -r" xóa được cả thư mục đang chứa file bên trong', '"rmdir" xóa nhanh hơn "rm -r"', '"rm -r" chỉ xóa được file văn bản', 'Hai lệnh hoạt động giống hệt nhau'], a: 0, why: 'rmdir (remove empty directory) rất an toàn vì sẽ từ chối xóa nếu bên trong còn bất kỳ file nào; còn rm -r xóa đệ quy toàn bộ thư mục và mọi thứ bên trong.' },
      { q: 'Khi muốn tạo liền một mạch chuỗi thư mục lồng nhau "mkdir -p a/b/c", tùy chọn "-p" (parents) có tác dụng gì?', o: ['Đặt mật khẩu cho thư mục', 'Tự động tạo luôn các thư mục cha (a, b) nếu chúng chưa tồn tại và không báo lỗi nếu thư mục đã có sẵn', 'In tên thư mục ra máy in', 'Xóa thư mục sau khi tạo'], a: 1, why: 'Tùy chọn -p giúp tạo toàn bộ các thư mục cấp cha trên đường dẫn nếu chưa có và không báo lỗi "File exists" nếu thư mục đã tồn tại.' },
      { q: 'Bạn muốn xem nhanh 20 dòng nhật ký MỚI NHẤT nằm ở cuối cùng của file "/var/log/messages". Lệnh nào phù hợp nhất?', o: ['head -n 20 /var/log/messages', 'tail -n 20 /var/log/messages', 'wc -l /var/log/messages', 'ls -l /var/log/messages'], a: 1, why: 'Lệnh tail lấy phần đuôi (cuối) của file; tùy chọn -n 20 chỉ định lấy đúng 20 dòng cuối cùng.' },
      { q: 'Chuỗi lệnh "grep -i error log.txt | wc -l" thực hiện công việc gì?', o: ['Xóa tất cả các dòng có chữ error trong log.txt', 'Tìm các dòng có chữ "error" (không phân biệt hoa/thường nhờ -i) rồi đếm xem có tổng cộng bao nhiêu dòng như vậy', 'Đổi chữ error thành chữ wc trong file log.txt', 'Lưu số dòng của log.txt vào file tên là error'], a: 1, why: 'grep -i error lọc ra các dòng chứa error/ERROR/Error, sau đó dấu ống dẫn (|) chuyển kết quả đó sang lệnh wc -l để đếm số dòng.' },
      { q: 'Ký tự đại diện trong câu lệnh "rm *.tmp" sẽ xóa những tập tin nào trong thư mục hiện tại?', o: ['Chỉ xóa đúng 1 file tên là "*.tmp"', 'Xóa tất cả các file không ẩn có phần đuôi kết thúc bằng ".tmp" (ví dụ a.tmp, nhap123.tmp)', 'Xóa toàn bộ mọi file trong thư mục hiện tại', 'Chỉ xóa các file có đúng 1 ký tự trước .tmp'], a: 1, why: 'Dấu * khớp với chuỗi ký tự bất kỳ, nên *.tmp khớp với mọi tập tin kết thúc bằng đuôi .tmp.' }
    ]
  },

  {
    id: 'phan-quyen', title: 'Người dùng, nhóm & phân quyền', minutes: 30, level: 'Cơ bản', src: 'Chương 3',
    summary: 'Đọc ls -l từng ký tự, hiểu khác biệt rwx giữa File và Thư mục, chmod chữ & số, chown, sudo.',
    practice: 'phan-quyen',
    body: `
<h3>1. Ba câu hỏi Linux tự hỏi mỗi khi bạn chạm vào một File hay Thư mục</h3>
<p>Linux là hệ điều hành đa người dùng (nhiều người có thể cùng đăng nhập vào 1 máy chủ). Vì vậy, mỗi file/thư mục đều gắn liền với 3 nhóm đối tượng:</p>
<ol>
<li><b>User (<code>u</code> – Chủ sở hữu):</b> Người tạo ra hoặc đứng tên sở hữu file đó.</li>
<li><b>Group (<code>g</code> – Nhóm):</b> Các đồng nghiệp cùng thuộc một nhóm chung (ví dụ nhóm <code>lophoc</code>, nhóm <code>dev</code>).</li>
<li><b>Others (<code>o</code> – Người khác):</b> Tất cả những tài khoản còn lại trên máy.</li>
</ol>
<pre><code># Kiểm tra xem mình là ai và đang thuộc những nhóm nào:
hocvien@linux-lab:~$ whoami
hocvien
hocvien@linux-lab:~$ id
uid=1000(hocvien) gid=1000(hocvien) groups=1000(hocvien),10(wheel)</code></pre>

<h3>2. Giải phẫu dòng kết quả <code>ls -l</code> từng ký tự một</h3>
<p>Khi gõ <code>ls -l</code>, cột đầu tiên gồm 10 ký tự chính là "bảng quyền hạn" của file/thư mục đó:</p>
<pre><code>-rwxr-xr--  1  hocvien  lophoc  120  Nov 2 12:00  baitap.sh
│└┬┘└┬┘└┬┘     └──┬──┘  └──┬─┘
│ │  │  │         │        └──── Nhóm sở hữu (Group: lophoc)
│ │  │  │         └───────────── Chủ sở hữu (User: hocvien)
│ │  │  └─ 3 ký tự cuối (Others - người khác): r-- (chỉ được đọc, không sửa, không chạy)
│ │  └──── 3 ký tự giữa (Group - cùng nhóm):   r-x (được đọc và chạy, dấu - ở giữa là không được sửa)
│ └─────── 3 ký tự đầu (User - chủ sở hữu):    rwx (toàn quyền: đọc + ghi + chạy)
└───────── Ký tự thứ 1 (Loại): "-" là tập tin thường, "d" là thư mục (directory), "l" là liên kết (link)</code></pre>

<h4>⚠️ Điểm cực kỳ quan trọng: Ý nghĩa của <code>r</code>, <code>w</code>, <code>x</code> trên FILE khác với trên THƯ MỤC!</h4>
<p>Rất nhiều người mới thắc mắc: <i>"Tại sao thư mục lại cần quyền thực thi <code>x</code>?"</i> Hãy nhìn bảng so sánh dưới đây:</p>
<table>
<tr><th>Quyền</th><th>Giá trị số</th><th>Đối với TẬP TIN (File)</th><th>Đối với THƯ MỤC (Directory)</th></tr>
<tr><td><b><code>r</code> (read)</b></td><td><b>4</b></td><td>Đọc được nội dung bên trong file (<code>cat</code>, <code>less</code>).</td><td>Xem được danh sách tên file bên trong thư mục (<code>ls</code>).</td></tr>
<tr><td><b><code>w</code> (write)</b></td><td><b>2</b></td><td>Sửa đổi nội dung bên trong file (<code>echo &gt;</code>, <code>nano</code>).</td><td>Tạo file mới, xóa file hoặc đổi tên file nằm bên trong thư mục đó (<code>touch</code>, <code>rm</code>, <code>mv</code>).</td></tr>
<tr><td><b><code>x</code> (execute)</b></td><td><b>1</b></td><td>Chạy file đó như một chương trình / script (<code>./script.sh</code>).</td><td><b>Quyền bước chân đi vào thư mục (<code>cd</code>) và đi xuyên qua nó!</b> (Nếu thư mục mất quyền <code>x</code>, bạn không thể <code>cd</code> vào được dù có quyền <code>r</code>!).</td></tr>
<tr><td><b><code>-</code></b></td><td><b>0</b></td><td>Không có quyền tương ứng.</td><td>Không có quyền tương ứng.</td></tr>
</table>

<h3>3. Lệnh <code>chmod</code> (change mode) – 2 cách đổi quyền hạn</h3>

<h4>Cách 1: Dùng ký hiệu chữ (Dễ nhớ khi chỉ muốn bật/tắt 1 quyền cụ thể)</h4>
<p>Công thức: <code>chmod [Đối tượng: u/g/o/a][Toán tử: + hoặc - hoặc =][Quyền: r/w/x] tên_file</code></p>
<pre><code>chmod u+x script.sh     # Thêm (+) quyền chạy (x) cho chủ sở hữu (u) → biến file văn bản thành script chạy được!
chmod go-w baocao.txt   # Bỏ (-) quyền ghi (w) của cả nhóm (g) và người khác (o)
chmod a+r thongbao.txt  # Cho phép tất cả mọi người (a = all = ugo) đều được đọc (r)</code></pre>

<h4>Cách 2: Dùng 3 chữ số (Cộng điểm: <code>r=4</code>, <code>w=2</code>, <code>x=1</code>, <code>-=0</code> cho từng cụm User – Group – Others)</h4>
<pre><code># Ví dụ cách tính nhẩm cực nhanh:
# • rwx = 4 + 2 + 1 = 7 (toàn quyền)
# • rw- = 4 + 2 + 0 = 6 (đọc + ghi, không chạy)
# • r-x = 4 + 0 + 1 = 5 (đọc + chạy/đi vào, không sửa)
# • r-- = 4 + 0 + 0 = 4 (chỉ đọc)
# • --- = 0 + 0 + 0 = 0 (cấm hoàn toàn)</code></pre>
<table>
<tr><th>Lệnh mẫu</th><th>Tương ứng chữ</th><th>Giải thích từng số</th><th>Khi nào sử dụng trong thực tế?</th></tr>
<tr><td><code>chmod 644 file.txt</code></td><td><code>-rw-r--r--</code></td><td>u=6 (rw-), g=4 (r--), o=4 (r--)</td><td>File văn bản, trang web tĩnh thông thường (chủ sửa được, người khác chỉ đọc).</td></tr>
<tr><td><code>chmod 755 script.sh</code></td><td><code>-rwxr-xr-x</code></td><td>u=7 (rwx), g=5 (r-x), o=5 (r-x)</td><td>File chương trình/script hoặc thư mục công khai (cần có <code>x</code> để chạy/đi vào).</td></tr>
<tr><td><code>chmod 600 bimat.txt</code></td><td><code>-rw-------</code></td><td>u=6 (rw-), g=0 (---), o=0 (---)</td><td>File mật khẩu, khóa riêng tư SSH (<code>id_ed25519</code>) – chỉ mình chủ sở hữu đọc/ghi.</td></tr>
<tr><td><code>chmod 700 ho-so</code></td><td><code>drwx------</code></td><td>u=7 (rwx), g=0 (---), o=0 (---)</td><td>Thư mục riêng tư – chỉ chủ sở hữu mới được <code>cd</code> vào và xem bên trong.</td></tr>
</table>
<div class="warn"><b>Tuyệt đối tránh thói quen xấu <code>chmod 777</code>:</b> Khi gặp lỗi <code>Permission denied</code>, đừng bao giờ "chữa cháy" bằng <code>chmod 777</code> (cho phép cả thế giới sửa/xóa file của bạn). Hãy kiểm tra bằng <code>ls -l</code> xem thiếu quyền gì rồi cấp đúng quyền đó (ví dụ <code>644</code>, <code>755</code> hoặc <code>700</code>).</div>

<h3>4. Quyền quản trị <code>sudo</code> và quản lý tài khoản</h3>
<pre><code>sudo lenh                           # Thực thi 1 lệnh với quyền tối cao root (sẽ hỏi mật khẩu của BẠN)
sudo useradd -m -s /bin/bash an     # Tạo user 'an' kèm thư mục nhà /home/an (-m) và dùng shell bash (-s)
sudo passwd an                      # Đặt hoặc đổi mật khẩu cho user 'an'
sudo usermod -aG wheel an           # Thêm (-a = append) user 'an' vào nhóm quản trị phụ (-G wheel trên CentOS/Rocky)
sudo chown an:lophoc baocao.txt     # Đổi chủ sở hữu thành 'an' và nhóm sở hữu thành 'lophoc'</code></pre>
<div class="warn">Khi thêm người dùng vào nhóm phụ bằng <code>usermod</code>, <b>luôn phải có chữ <code>-a</code> đi kèm <code>-G</code> (<code>usermod -aG</code>)</b>. Nếu chỉ viết <code>usermod -G wheel an</code> (thiếu <code>-a</code>), người đó sẽ bị xóa khỏi tất cả các nhóm phụ cũ!</div>

<h3>5. Thực hành ngay tại chỗ (Trải nghiệm lỗi Permission denied và cách mở khóa)</h3>
<p>Trong Terminal bên dưới, mình đã tạo sẵn thư mục <code>ho-so</code> bị khóa sạch quyền (<code>d---------</code>, tức <code>000</code>). Hãy gõ thử:</p>
<ol>
<li><code>ls -l</code> → nhìn dòng <code>ho-so</code> có quyền <code>d---------</code> và <code>script.sh</code>.</li>
<li><code>cd ho-so</code> → xem hệ thống báo lỗi <code>Permission denied</code> vì thư mục thiếu quyền <code>x</code>!</li>
<li><code>chmod 700 ho-so && cd ho-so && ls</code> → cấp lại quyền <code>rwx------</code> cho chủ sở hữu, bước vào trong và xem file <code>luong.txt</code>!</li>
</ol>
<div class="mini-term" data-id="t-quyen"></div>

<div class="tip"><b>🧭 Bước tiếp theo sau Bài 5:</b>
<br>1. Làm <b>8 câu trắc nghiệm</b> ngay bên dưới.
<br>2. <b>Thực hành chấm điểm:</b> Vào <a href="#/practice/phan-quyen">🎯 Thử thách 4: Phân quyền đúng chỗ</a> để tự tay cấp quyền cho <code>script.sh</code>, khóa riêng tư <code>bimat.txt</code> và mở khóa thư mục <code>ho-so</code>.</div>`,
    quiz: [
      { q: 'Khi chạy "ls -l", bạn thấy chuỗi quyền "-rwxr-xr--". Ba ký tự ở giữa ("r-x") quy định quyền hạn cho đối tượng nào?', o: ['Chủ sở hữu tập tin (User)', 'Những người cùng nhóm sở hữu (Group)', 'Tất cả những người dùng khác (Others)', 'Chỉ riêng tài khoản root'], a: 1, why: 'Sau ký tự đầu tiên chỉ loại file (-/d), 9 ký tự tiếp theo chia làm 3 cụm: 3 ký tự đầu cho User (rwx), 3 ký tự giữa cho Group (r-x), và 3 ký tự cuối cho Others (r--).' },
      { q: 'Lệnh "chmod 644 baocao.txt" sẽ thiết lập quyền hạn nào dưới đây?', o: ['rwxr-xr-x', 'rw-r--r--', 'rwx------', 'rw-rw-r--'], a: 1, why: '6 = 4(r) + 2(w) = rw-; 4 = 4(r) = r--. Do đó 644 tương ứng với rw-r--r--.' },
      { q: 'Bạn mới viết xong file "backup.sh". Muốn cấp thêm quyền thực thi (chạy) cho chủ sở hữu tập tin này, bạn gõ lệnh nào?', o: ['chmod u+x backup.sh', 'chmod u-x backup.sh', 'chown +x backup.sh', 'chmod 600 backup.sh'], a: 0, why: 'u là user (chủ sở hữu), + là thêm quyền, x là execute (thực thi). Ngoài ra chmod +x hoặc chmod 755 cũng giúp file chạy được.' },
      { q: 'Đối với một THƯ MỤC (Directory), quyền "x" (execute) có ý nghĩa thực tế là gì?', o: ['Cho phép xóa thư mục đó', 'Cho phép bước chân đi vào thư mục đó bằng lệnh cd và truy cập các mục bên trong', 'Biến thư mục thành một chương trình chạy được', 'Không có tác dụng gì đối với thư mục'], a: 1, why: 'Trên thư mục, quyền x là quyền "đi qua / bước vào" (traverse). Nếu thư mục không có quyền x, lệnh cd vào thư mục đó sẽ bị báo lỗi Permission denied.' },
      { q: 'Một tập tin chứa khóa bí mật SSH (như id_ed25519 hoặc bimat.txt) cần được bảo vệ để CHỈ chủ sở hữu mới đọc/ghi được, còn nhóm và người khác bị cấm hoàn toàn. Bạn dùng lệnh nào?', o: ['chmod 777 bimat.txt', 'chmod 755 bimat.txt', 'chmod 600 bimat.txt', 'chmod 644 bimat.txt'], a: 2, why: '600 tương ứng với -rw-------: chủ sở hữu có quyền đọc+ghi (6), còn group (0) và others (0) hoàn toàn không có quyền gì.' },
      { q: 'Vì sao khi thêm người dùng "an" vào nhóm phụ "wheel", ta phải gõ "sudo usermod -aG wheel an" (có chữ -a) thay vì chỉ gõ "-G"?', o: ['Vì không có -a thì lệnh không chạy được', 'Vì -a (append) giúp nối thêm vào nhóm mới mà KHÔNG làm mất các nhóm phụ cũ của người dùng đó', 'Vì -a dùng để đặt mật khẩu tự động', 'Vì -a có nghĩa là admin'], a: 1, why: 'Nếu dùng -G mà thiếu -a (append), danh sách nhóm phụ của user sẽ bị ghi đè hoàn toàn bằng nhóm mới, làm mất mọi nhóm phụ trước đó.' },
      { q: 'Trong chuỗi quyền "drwx------", chữ cái "d" đứng đầu tiên cho biết điều gì?', o: ['Đây là một tập tin đã bị xóa (deleted)', 'Đây là một thư mục (directory), chỉ chủ sở hữu mới có quyền truy cập (700)', 'Đây là một ổ đĩa cứng', 'Tập tin này đang được tải xuống (download)'], a: 1, why: 'Ký tự đầu tiên trong ls -l cho biết loại đối tượng: "d" là directory (thư mục), "-" là file thường.' },
      { q: 'Lệnh nào dùng để đổi chủ sở hữu của tập tin "web.conf" sang cho người dùng "an" và nhóm "dev"?', o: ['sudo chmod an:dev web.conf', 'sudo chown an:dev web.conf', 'sudo usermod an:dev web.conf', 'sudo passwd an:dev web.conf'], a: 1, why: 'chown (change owner) dùng để đổi người sở hữu và nhóm sở hữu theo cú pháp user:group.' }
    ]
  },

  {
    id: 'mang-ssh', title: 'Mạng cơ bản & SSH', minutes: 25, level: 'Trung bình', src: 'Chương 4',
    summary: 'Đọc kết quả ip a, ip route, khoanh vùng lỗi mạng với ping, đăng nhập từ xa bằng SSH và cặp khóa.',
    body: `
<h3>1. Quy trình kiểm tra mạng 4 bước (Từ trong ra ngoài)</h3>
<p>Khi một máy chủ Linux báo "không vào được mạng", đừng đoán mò! Hãy kiểm tra tuần tự từng tầng từ trong máy ra ngoài Internet bằng 4 lệnh sau:</p>

<pre><code># BƯỚC 1: Xem máy đã có địa chỉ IP chưa? (lệnh: ip a   – viết tắt của ip address)
hocvien@linux-lab:~$ ip a
1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 state UNKNOWN
    inet 127.0.0.1/8 scope host lo
2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 state UP
    inet 192.168.1.50/24 brd 192.168.1.255 scope global eth0</code></pre>
<ul>
<li><code>lo</code> (Loopback <code>127.0.0.1</code>): đường mạng tự nói chuyện với chính mình trong máy.</li>
<li><code>eth0</code> (hoặc <code>ens33</code>, <code>enp0s3</code>): card mạng thật. Nhìn chữ <code>state UP</code> (đã bật) và dòng <code>inet 192.168.1.50/24</code> (địa chỉ IP của máy là <code>192.168.1.50</code>).</li>
</ul>

<pre><code># BƯỚC 2: Xem đường ra cổng mạng (Gateway) là IP nào? (lệnh: ip route)
hocvien@linux-lab:~$ ip route
default via 192.168.1.1 dev eth0 proto static metric 100
# → Cổng ra mạng (default gateway / router) có IP là 192.168.1.1

# BƯỚC 3: Thử ping ra ngoài Internet bằng ĐỊA CHỈ IP (8.8.8.8 là máy chủ Google)
# Tùy chọn -c 4 (count = 4): chỉ gửi đúng 4 gói tin rồi tự dừng (trên Linux nếu không có -c, lệnh ping sẽ chạy mãi tới khi bấm Ctrl+C!)
hocvien@linux-lab:~$ ping -c 4 8.8.8.8
PING 8.8.8.8 (8.8.8.8) 56(84) bytes of data.
64 bytes from 8.8.8.8: icmp_seq=1 ttl=115 time=12.4 ms
--- 8.8.8.8 ping statistics ---
4 packets transmitted, 4 received, 0% packet loss   ← 0% loss nghĩa là đường truyền Internet THÔNG!

# BƯỚC 4: Thử ping bằng TÊN MIỀN chữ (google.com) để kiểm tra DNS (dịch tên miền thành IP)
hocvien@linux-lab:~$ ping -c 4 google.com</code></pre>

<div class="tip"><b>Tư duy khoanh vùng lỗi mạng trong 30 giây:</b>
<br>• Nếu <code>ping 8.8.8.8</code> <b>thành công</b> nhưng <code>ping google.com</code> <b>báo lỗi không tìm thấy</b> → Đường mạng vẫn thông, chỉ bị lỗi cấu hình <b>DNS</b> (máy không dịch được tên miền ra số IP, kiểm tra <code>/etc/resolv.conf</code>).
<br>• Nếu <code>ping 8.8.8.8</code> cũng lỗi → Thử <code>ping 192.168.1.1</code> (Gateway). Nếu không tới được cả Gateway → Lỗi cáp mạng, card mạng chưa <code>UP</code> hoặc sai IP nội bộ.</div>

<h3>2. Xem cổng dịch vụ đang lắng nghe: <code>ss -tuln</code></h3>
<p>Khi cài web (cổng 80/443) hay SSH (cổng 22), làm sao biết dịch vụ đã thực sự mở cổng chờ kết nối?</p>
<pre><code>sudo ss -tuln
# Giải thích từng chữ cái trong tùy chọn -tuln:
#   -t (tcp): hiện kết nối TCP
#   -u (udp): hiện kết nối UDP
#   -l (listening): chỉ hiện các cổng đang mở lắng nghe
#   -n (numeric): hiện số hiệu cổng (22, 80, 443) thay vì đổi thành chữ</code></pre>

<h3>3. Cấu hình mạng & tên máy trên họ Red Hat (CentOS / Rocky / Alma)</h3>
<pre><code>hostnamectl                                # Xem tên máy (hostname) và phiên bản hệ điều hành
sudo hostnamectl set-hostname may-chu-01   # Đổi tên máy thành may-chu-01
nmcli device status                        # Xem trạng thái các card mạng bằng NetworkManager
nmcli connection show                      # Xem danh sách cấu hình kết nối mạng</code></pre>

<h3>4. SSH – Điều khiển máy chủ từ xa & Đăng nhập bằng cặp khóa (SSH Key)</h3>
<p>Trong công việc thực tế, máy chủ Linux đặt ở trung tâm dữ liệu không có màn hình. Bạn ngồi ở laptop cá nhân và dùng lệnh <code>ssh</code> để mở Terminal của máy chủ từ xa:</p>
<pre><code># 1. Đăng nhập từ xa bằng mật khẩu (cú pháp: ssh ten_user@dia_chi_ip)
ssh hocvien@192.168.1.50

# 2. Tạo cặp khóa SSH (an toàn hơn mật khẩu rất nhiều, chống dò mật khẩu):
# Tùy chọn -t ed25519: chọn thuật toán mã hóa hiện đại, ngắn gọn và bảo mật cao
ssh-keygen -t ed25519
# → Sinh ra 2 file trong thư mục ẩn ~/.ssh/:
#   • ~/.ssh/id_ed25519      (KHÓA RIÊNG TƯ / Private Key – giữ bí mật tuyệt đối, quyền 600!)
#   • ~/.ssh/id_ed25519.pub  (KHÓA CÔNG KHAI / Public Key – giống ổ khóa để đem gắn lên máy chủ)

# 3. Gửi khóa công khai (.pub) lên máy chủ từ xa:
ssh-copy-id hocvien@192.168.1.50

# 4. Sao chép file qua lại giữa máy bạn và máy chủ từ xa qua đường SSH (lệnh scp):
scp baocao.txt hocvien@192.168.1.50:/home/hocvien/</code></pre>
<div class="warn"><b>Cẩn thận khi sửa cấu hình SSH (<code>/etc/ssh/sshd_config</code>):</b> Trước khi tắt đăng nhập bằng mật khẩu (<code>PasswordAuthentication no</code>) và khởi động lại <code>sshd</code>, hãy <b>giữ nguyên cửa sổ SSH hiện tại đừng đóng</b>, đồng thời mở một cửa sổ Terminal thứ hai đăng nhập thử. Nếu cấu hình sai, bạn vẫn còn cửa sổ đầu tiên để sửa lại, tránh tự khóa mình ở ngoài máy chủ!</div>

<h3>5. Thực hành ngay tại chỗ (Mô phỏng kiểm tra mạng)</h3>
<p>Gõ thử lần lượt vào khung Terminal bên dưới:</p>
<ol>
<li><code>ip a</code> → tìm xem địa chỉ IP của card mạng <code>eth0</code> trong máy mô phỏng này là bao nhiêu.</li>
<li><code>ip route</code> → tìm xem địa chỉ Gateway (<code>default via ...</code>) là số nào.</li>
<li><code>ping -c 2 8.8.8.8</code> và <code>ping -c 2 google.com</code> → đọc thông số <code>0% packet loss</code>.</li>
</ol>
<div class="mini-term" data-id="t-mang"></div>

<div class="tip"><b>🧭 Bước tiếp theo sau Bài 6:</b>
<br>1. Làm <b>8 câu trắc nghiệm</b> ngay bên dưới.
<br>2. Mở mục <a href="#/problems">🧰 Cẩm nang xử lý sự cố</a> (xem tình huống <i>"Không SSH vào được máy chủ"</i> để thấy cách áp dụng thực tế).</div>`,
    quiz: [
      { q: 'Khi kiểm tra mạng, bạn gõ "ping -c 4 8.8.8.8" thì thành công (0% packet loss), nhưng gõ "ping -c 4 google.com" lại báo lỗi không phân giải được tên miền. Nguyên nhân nằm ở đâu?', o: ['Đứt dây mạng hoặc hỏng card mạng', 'Lỗi cấu hình DNS (máy không dịch được tên miền chữ sang địa chỉ IP)', 'Máy chủ bị đầy ổ cứng', 'Bị sai quyền hạn trên thư mục /home'], a: 1, why: 'Ping tới được 8.8.8.8 chứng tỏ kết nối mạng ra Internet đã thông suốt; việc không ping được tên miền google.com chỉ ra lỗi ở khâu phân giải tên miền (DNS).' },
      { q: 'Tại sao trên Linux khi dùng lệnh ping kiểm tra nhanh, người ta thường thêm tùy chọn "-c 4" (ví dụ: ping -c 4 8.8.8.8)?', o: ['Để tăng tốc độ mạng lên 4 lần', 'Để chỉ gửi đúng 4 gói tin rồi tự dừng lại (vì mặc định ping trên Linux sẽ chạy liên tục cho đến khi bấm Ctrl+C)', 'Để ping cùng lúc 4 máy chủ khác nhau', 'Để dùng giao thức IPv4'], a: 1, why: 'Khác với Windows (mặc định ping 4 lần rồi dừng), lệnh ping trên Linux chạy liên tục vô hạn nếu không có tùy chọn -c (count).' },
      { q: 'Khi tạo cặp khóa SSH bằng lệnh "ssh-keygen -t ed25519", tập tin nào là KHÓA RIÊNG TƯ (Private Key) mà bạn tuyệt đối KHÔNG được gửi cho ai?', o: ['id_ed25519.pub', 'id_ed25519 (file không có đuôi .pub)', 'authorized_keys', 'known_hosts'], a: 1, why: 'File id_ed25519 (không có đuôi .pub) là khóa riêng tư, phải giữ bí mật tuyệt đối với quyền 600; còn id_ed25519.pub là khóa công khai dùng để chép lên máy chủ.' },
      { q: 'Câu lệnh hiện đại và chuẩn xác nhất để xem địa chỉ IP của các card mạng trên Linux hiện nay là gì?', o: ['ipconfig /all', 'ip a (hoặc ip addr)', 'ping localhost', 'ssh -ip'], a: 1, why: '"ip a" (thuộc bộ iproute2) là lệnh chuẩn trên mọi bản Linux hiện đại; còn "ipconfig" là lệnh của Windows.' },
      { q: 'Khi gõ lệnh "ip route", dòng kết quả "default via 192.168.1.1 dev eth0" cho bạn biết thông tin gì?', o: ['Địa chỉ IP của chính máy bạn là 192.168.1.1', 'Cổng ra mạng mặc định (Default Gateway / Router) là 192.168.1.1 đi qua card mạng eth0', 'Có 100 máy tính đang kết nối vào eth0', 'Card mạng eth0 đang bị tắt'], a: 1, why: '"default via 192.168.1.1" chỉ ra địa chỉ của Default Gateway (cổng router để đi ra ngoài mạng nội bộ).' },
      { q: 'Để kiểm tra xem trên máy chủ đang có những cổng mạng (port) TCP/UDP nào đang mở ở trạng thái lắng nghe (Listening), bạn dùng lệnh nào?', o: ['sudo ss -tuln', 'ip route show', 'ping -l', 'ssh-copy-id'], a: 0, why: 'Lệnh "ss -tuln" hiển thị các socket TCP (-t), UDP (-u) đang lắng nghe (-l) với số hiệu cổng dạng số (-n).' },
      { q: 'Lệnh nào dùng để sao chép tập tin "baocao.txt" từ máy hiện tại lên thư mục nhà của người dùng "an" trên máy chủ 192.168.1.50 qua giao thức SSH?', o: ['cp baocao.txt an@192.168.1.50', 'scp baocao.txt an@192.168.1.50:~/', 'ssh baocao.txt an@192.168.1.50', 'mv baocao.txt 192.168.1.50'], a: 1, why: 'scp (secure copy) dùng để chép file qua kết nối mã hóa SSH theo cú pháp: scp <file_nguồn> <user>@<host>:<đường_dẫn_đích>.' },
      { q: 'Vì sao khi chỉnh sửa file cấu hình "/etc/ssh/sshd_config" trên máy chủ từ xa, bạn luôn nên giữ nguyên phiên SSH đang mở và thử kết nối ở một cửa sổ mới trước?', o: ['Để tiết kiệm bộ nhớ RAM cho máy chủ', 'Đề phòng cấu hình mới bị sai làm không đăng nhập mới được thì vẫn còn phiên đang mở để sửa lại, tránh tự khóa mình ngoài máy chủ', 'Vì Linux bắt buộc phải mở 2 cửa sổ mới lưu được file', 'Để tăng tốc độ truyền file'], a: 1, why: 'Khi khởi động lại dịch vụ sshd, phiên SSH đang kết nối sẵn thường không bị ngắt; giữ lại phiên đó làm "đường lui" giúp bạn sửa lại nếu cấu hình mới có lỗi.' }
    ]
  },

  {
    id: 'van-hanh', title: 'Vận hành: gói, dịch vụ, tiến trình, lịch, log', minutes: 30, level: 'Trung bình', src: 'Chương 7',
    summary: 'dnf/apt, systemctl, ps/pgrep/top/kill, df/du/free, cron, journalctl – bộ kỹ năng quản trị cốt lõi.',
    practice: 'cuu-dich-vu',
    body: `
<h3>1. Quản lý phần mềm bằng Trình quản lý gói (<code>dnf</code> và <code>apt</code>)</h3>
<p>Trên Linux, bạn hầu như không lên web tải file cài đặt trôi nổi, mà cài trực tiếp từ kho phần mềm chính thức (Repository) của bản phân phối:</p>
<table>
<tr><th>Thao tác</th><th>Nhánh Red Hat (CentOS 8+, Rocky, AlmaLinux)</th><th>Nhánh Debian (Ubuntu, Debian)</th></tr>
<tr><td><b>Tìm kiếm gói</b></td><td><code>dnf search nginx</code></td><td><code>apt search nginx</code></td></tr>
<tr><td><b>Cài đặt gói</b></td><td><code>sudo dnf install nginx</code></td><td><code>sudo apt install nginx</code></td></tr>
<tr><td><b>Cập nhật hệ thống</b></td><td><code>sudo dnf upgrade</code></td><td><code>sudo apt update &amp;&amp; sudo apt upgrade</code></td></tr>
<tr><td><b>Gỡ bỏ gói</b></td><td><code>sudo dnf remove nginx</code></td><td><code>sudo apt remove nginx</code></td></tr>
</table>
<p><small>(Lưu ý: Thêm tùy chọn <code>-y</code> như <code>sudo dnf install -y nginx</code> nghĩa là tự động trả lời "Yes" khi hệ thống hỏi xác nhận cài đặt).</small></p>

<h3>2. Quản lý dịch vụ nền với <code>systemctl</code> (systemd)</h3>
<p>Các chương trình chạy ngầm liên tục trên máy chủ (như web <code>nginx</code>, <code>sshd</code>, cơ sở dữ liệu...) được gọi là <b>Dịch vụ (Service / Daemon)</b>. Bạn điều khiển chúng bằng lệnh <code>systemctl</code>:</p>
<pre><code># 1. Xem trạng thái dịch vụ (không cần sudo):
hocvien@linux-lab:~$ systemctl status nginx
● nginx.service - The nginx HTTP and reverse proxy server
     Loaded: loaded (/usr/lib/systemd/system/nginx.service; enabled)
     Active: active (running)                ← Đang chạy tốt! (Nếu thấy inactive/dead hoặc failed là đang dừng/lỗi)
   Main PID: 1120 (nginx)

# 2. Bật / Tắt / Khởi động lại dịch vụ (thay đổi trạng thái hệ thống nên CẦN sudo!):
sudo systemctl start nginx                   # Bật dịch vụ chạy NGAY BÂY GIỜ
sudo systemctl stop nginx                    # Dừng dịch vụ NGAY BÂY GIỜ
sudo systemctl restart nginx                 # Khởi động lại (dùng sau khi bạn vừa sửa file cấu hình)

# 3. Cho phép tự khởi động cùng máy chủ:
sudo systemctl enable nginx                  # Bật chế độ tự chạy mỗi khi máy chủ khởi động lại (boot)
sudo systemctl enable --now nginx            # Tùy chọn --now: Vừa đăng ký tự chạy khi boot, vừa start ngay lập tức!
systemctl is-active nginx                    # Trả về gọn 1 chữ: "active" hoặc "inactive" (rất tiện dùng trong script)</code></pre>
<div class="tip"><b>Phân biệt rõ <code>start</code> và <code>enable</code>:</b>
<br>• <code>start</code> = nổ máy chạy <b>ngay lúc này</b> (nhưng nếu tắt nguồn bật lại máy chủ mà chưa <code>enable</code> thì dịch vụ sẽ nằm im).
<br>• <code>enable</code> = hẹn tự nổ máy <b>mỗi khi bật nguồn</b> (nhưng nếu không có <code>--now</code> hay <code>start</code> thì lúc này nó vẫn chưa chạy). Muốn cả hai: dùng <code>sudo systemctl enable --now ten_dich_vu</code>!</div>

<h3>3. Kiểm tra Tiến trình (<code>ps</code>, <code>pgrep</code>, <code>kill</code>) & Tài nguyên (<code>df</code>, <code>du</code>, <code>free</code>)</h3>
<p>Khi máy chủ bị chậm hoặc báo đầy ổ đĩa, đây là bộ lệnh chẩn đoán tức thì:</p>
<table>
<tr><th>Câu lệnh & Tùy chọn</th><th>Ý nghĩa các chữ cái tùy chọn</th><th>Màn hình trả về gì & Cách đọc</th></tr>
<tr><td><code>df -h</code></td><td><b>d</b>isk <b>f</b>ree + <b>h</b>uman-readable</td><td>Xem <b>các phân vùng ổ đĩa</b> còn trống bao nhiêu GB, phần trăm đã dùng (<code>Use%</code>). Nếu <code>Use%</code> = <code>100%</code> là đầy ổ đĩa!</td></tr>
<tr><td><code>du -sh *</code></td><td><b>d</b>isk <b>u</b>sage + <b>s</b>ummary (tổng hợp) + <b>h</b>uman</td><td>Đo xem <b>từng thư mục/file trong chỗ đang đứng</b> chiếm bao nhiêu dung lượng (để tìm thủ phạm gây đầy đĩa).</td></tr>
<tr><td><code>free -h</code></td><td>RAM <b>free</b> + <b>h</b>uman-readable</td><td>Xem bộ nhớ RAM. <b>Lưu ý:</b> Hãy nhìn cột <b><code>available</code></b> (RAM thực sự sẵn sàng cấp cho ứng dụng mới), đừng hoảng khi thấy cột <code>free</code> nhỏ vì Linux tận dụng RAM rảnh làm bộ đệm <code>buff/cache</code>!</td></tr>
<tr><td><code>ps aux</code></td><td><b>p</b>rocess <b>s</b>tatus (all users)</td><td>Liệt kê toàn bộ các tiến trình đang chạy kèm số định danh <b>PID</b>, %CPU, %MEM.</td></tr>
<tr><td><code>pgrep -l nginx</code></td><td><b>p</b>rocess <b>grep</b> + <b>l</b>ist name</td><td>Tìm thẳng PID của tiến trình theo tên (gọn và chính xác hơn <code>ps aux | grep</code> vì không bị lẫn chính dòng lệnh <code>grep</code>).</td></tr>
<tr><td><code>kill 1234</code><br><code>kill -9 1234</code></td><td>Gửi tín hiệu dừng cho tiến trình có <b>PID = 1234</b></td><td><code>kill 1234</code> (tín hiệu 15) nhắc chương trình tự lưu dữ liệu rồi đóng lịch sự; chỉ khi bị treo cứng không tắt mới dùng <code>kill -9 1234</code> (cưỡng chế tắt ngay).</td></tr>
</table>

<h3>4. Lập lịch tự động với <code>cron</code> (<code>crontab -e</code>)</h3>
<pre><code># Mỗi dòng trong crontab gồm 5 dấu sao chỉ thời gian + câu lệnh cần chạy:
# ┌───────────── phút (0 - 59)
# │ ┌─────────── giờ (0 - 23)
# │ │ ┌───────── ngày trong tháng (1 - 31)
# │ │ │ ┌─────── tháng (1 - 12)
# │ │ │ │ ┌───── thứ trong tuần (0 - 6, Chủ nhật = 0)
# * * * * *  /duong/dan/tuyet/doi/script.sh

*/5 * * * *  /home/hocvien/check.sh >> /home/hocvien/check.log 2>&1   # Chạy lặp lại mỗi 5 phút một lần
0   2 * * *  /home/hocvien/backup.sh                                  # Chạy đúng 02:00 sáng mỗi ngày</code></pre>

<h3>5. Đọc nhật ký dịch vụ bằng <code>journalctl</code> – Kỹ năng "Thám tử"</h3>
<pre><code>journalctl -u nginx -n 50     # Xem 50 dòng log mới nhất (-n 50) của riêng dịch vụ (-u = unit) nginx
journalctl -u nginx -f        # Theo dõi log nhảy trực tiếp theo thời gian thực (-f = follow, bấm Ctrl+C để thoát)
journalctl -p err -b          # Chỉ lọc các dòng mức độ LỖI (-p err) tính từ lần khởi động máy gần nhất (-b = boot)</code></pre>

<h3>6. Thực hành chẩn đoán ngay tại chỗ!</h3>
<p>Trong Terminal bên dưới, dịch vụ web <code>nginx</code> đang bị dừng đột ngột! Hãy thực hành quy trình 4 bước của người quản trị hệ thống:</p>
<ol>
<li>Gõ <code>systemctl status nginx</code> → bạn sẽ thấy dòng <code>Active: inactive (dead)</code>.</li>
<li>Gõ <code>journalctl -u nginx</code> → đọc dòng log cuối xem chuyện gì đã xảy ra.</li>
<li>Gõ thử <code>systemctl start nginx</code> (không có <code>sudo</code>) → thấy báo lỗi thiếu quyền quản trị; sau đó gõ đúng: <code>sudo systemctl start nginx</code>.</li>
<li>Gõ lại <code>systemctl status nginx</code> và <code>pgrep -l nginx</code> → thấy dịch vụ đã <code>active (running)</code>!</li>
<li>Gõ thêm <code>df -h</code>, <code>du -sh *</code>, <code>free -h</code> để làm quen cách đọc thông số đĩa và RAM.</li>
</ol>
<div class="mini-term" data-id="t-vanhanh"></div>

<div class="tip"><b>🧭 Bước tiếp theo sau Bài 7:</b>
<br>1. Làm <b>8 câu trắc nghiệm</b> ngay bên dưới.
<br>2. <b>Thực hành chấm điểm:</b> Vào <a href="#/practice/cuu-dich-vu">🎯 Thử thách 7: Chẩn đoán & cứu dịch vụ web</a> để tự tay cứu dịch vụ <code>nginx</code> và được chấm tự động!
<br>3. Đọc thêm bài <a href="#/reading/dich-vu">👓 Phòng đọc code: Kiểm tra dịch vụ & tự khởi động lại</a> và <a href="#/reading/cron">👓 Đọc hiểu dòng lịch cron</a>.</div>`,
    quiz: [
      { q: 'Sự khác biệt giữa hai lệnh "sudo systemctl start nginx" và "sudo systemctl enable nginx" là gì?', o: ['Hai lệnh hoàn toàn giống nhau', '"start" bật dịch vụ chạy ngay lúc này, còn "enable" đăng ký để dịch vụ tự động chạy mỗi khi máy chủ khởi động (boot)', '"enable" dùng để cài đặt nginx, còn "start" dùng để gỡ bỏ', '"start" không cần quyền sudo'], a: 1, why: 'start tác động lên trạng thái chạy hiện tại; enable cấu hình tự khởi động cùng hệ thống khi bật máy. Dùng "enable --now" để làm cả hai cùng lúc.' },
      { q: 'Khi kiểm tra bộ nhớ RAM bằng lệnh "free -h", bạn nên nhìn vào cột nào để biết dung lượng RAM thực tế sẵn sàng cấp cho các ứng dụng mới?', o: ['Cột free', 'Cột available', 'Cột shared', 'Cột Swap'], a: 1, why: 'Linux thường mượn RAM nhàn rỗi để làm bộ nhớ đệm (buff/cache) giúp tăng tốc đọc đĩa và sẽ trả lại ngay khi ứng dụng cần; do đó cột "available" mới phản ánh đúng lượng RAM thực sự khả dụng.' },
      { q: 'Máy chủ báo lỗi hết dung lượng ổ đĩa ("No space left on device"). Cặp lệnh nào giúp bạn (1) kiểm tra phân vùng nào bị đầy 100% và (2) đo xem thư mục con nào đang chiếm nhiều dung lượng nhất?', o: ['free -h và ps aux', 'df -h (xem phân vùng ổ đĩa) và du -sh * (đo dung lượng từng thư mục/file)', 'ip a và ip route', 'ls -a và pwd'], a: 1, why: 'df -h hiển thị tổng dung lượng và % đã dùng của các phân vùng đĩa; còn du -sh * tính tổng dung lượng của từng mục trong thư mục hiện tại để tìm ra nơi chiếm chỗ.' },
      { q: 'Trong bảng lập lịch crontab, dòng cấu hình "*/5 * * * * /home/an/check.sh" có nghĩa là chạy script đó khi nào?', o: ['Chạy vào lúc 5 giờ sáng mỗi ngày', 'Chạy lặp lại cứ mỗi 5 phút một lần', 'Chạy vào ngày mùng 5 hàng tháng', 'Chỉ chạy 5 lần rồi dừng hẳn'], a: 1, why: 'Trường đầu tiên trong 5 trường thời gian của cron là Phút; ký hiệu "*/5" ở trường phút có nghĩa là "mỗi 5 phút một lần".' },
      { q: 'Để xem 50 dòng nhật ký (log) mới nhất của riêng dịch vụ "sshd", bạn dùng câu lệnh nào?', o: ['journalctl -u sshd -n 50', 'systemctl log sshd 50', 'cat /etc/sshd -n 50', 'ps aux | sshd 50'], a: 0, why: 'Trong journalctl, tùy chọn -u <tên_dịch_vụ> lọc theo dịch vụ (unit), và -n 50 lấy 50 dòng cuối cùng.' },
      { q: 'Lệnh cài đặt gói phần mềm "nginx" trên Rocky Linux / AlmaLinux / CentOS 8+ là gì?', o: ['sudo apt install nginx', 'sudo dnf install nginx', 'sudo pacman -S nginx', 'sudo chmod install nginx'], a: 1, why: 'Các bản phân phối thuộc nhánh Red Hat (CentOS 8+, Rocky, AlmaLinux, Fedora, RHEL) sử dụng trình quản lý gói dnf (hoặc yum).' },
      { q: 'Vì sao khi muốn dừng một tiến trình đang chạy (ví dụ PID 1234), ta nên dùng "kill 1234" trước, và chỉ dùng "kill -9 1234" khi tiến trình bị treo cứng?', o: ['Vì kill 1234 chạy nhanh hơn', 'Vì "kill 1234" (SIGTERM) cho phép chương trình kịp lưu dữ liệu dở dang và đóng kết nối an toàn trước khi tắt, còn "kill -9" (SIGKILL) cưỡng chế ngắt đột ngột dễ gây hỏng dữ liệu đang ghi', 'Vì kill -9 sẽ xóa luôn file cài đặt của chương trình', 'Vì kill 1234 không cần biết số PID'], a: 1, why: 'Tín hiệu mặc định của kill (15 - SIGTERM) là yêu cầu dừng lịch sự để ứng dụng dọn dẹp và lưu trạng thái; chỉ khi ứng dụng treo không phản hồi mới dùng -9 (SIGKILL).' },
      { q: 'Ưu điểm của việc dùng lệnh "pgrep -c nginx" so với "ps aux | grep nginx | wc -l" khi muốn đếm số tiến trình nginx đang chạy là gì?', o: ['pgrep tự động khởi động lại nginx', 'pgrep chỉ tìm đúng tên tiến trình nên không bị đếm nhầm chính dòng lệnh "grep nginx" như khi dùng ps aux | grep', 'pgrep xóa luôn các tiến trình bị trùng', 'Không có sự khác biệt nào'], a: 1, why: 'Khi chạy "ps aux | grep nginx", đôi khi bản thân tiến trình "grep nginx" cũng xuất hiện trong danh sách của ps làm kết quả đếm bị cộng dư 1; còn pgrep tránh được bẫy này.' }
    ]
  },

  {
    id: 'shell-script', title: 'Shell script đầu tiên', minutes: 30, level: 'Trung bình', src: 'Chương 5',
    summary: 'Biến, tham số, điều kiện if, vòng lặp for an toàn, ghép lệnh && / ||, tìm & nén file với find và tar.',
    practice: 'tim-nen',
    body: `
<h3>1. Shell Script thực chất là gì?</h3>
<p>Thay vì mỗi ngày phải gõ tay lặp đi lặp lại 10 câu lệnh để tạo thư mục, tìm file, nén sao lưu và ghi log, bạn viết 10 câu lệnh đó vào một tập tin văn bản có đuôi <code>.sh</code> – tập tin đó gọi là <b>Shell Script (Kịch bản dòng lệnh)</b>.</p>
<pre><code>#!/bin/bash
# Dòng đầu tiên "#!/bin/bash" gọi là Shebang – báo cho Linux biết phải dùng trình bash để đọc file này.
# Các dòng bắt đầu bằng dấu # ở dưới chỉ là lời chú thích cho người đọc, máy sẽ bỏ qua.

echo "Xin chào, $(whoami)!"
echo "Thư mục hiện tại là: $(pwd)"
echo "Hôm nay là ngày: $(date +%d/%m/%Y)"</code></pre>
<p><b>Giải thích ký hiệu <code>$(lệnh)</code>:</b> Khi viết <code>$(whoami)</code> bên trong dấu ngoặc kép, Bash sẽ <b>chạy lệnh <code>whoami</code> trước</b>, lấy kết quả (<code>hocvien</code>) rồi thế vào chỗ đó để in ra <code>Xin chào, hocvien!</code>.</p>
<pre><code># Để chạy một file script, luôn nhớ 2 bước:
chmod +x hello.sh     # Bước 1: Cấp quyền thực thi (x) cho file (chỉ cần làm 1 lần đầu)
./hello.sh            # Bước 2: Gõ "./" (nghĩa là chạy file nằm ngay ở thư mục hiện tại)</code></pre>

<h3>2. Biến (Variables) và Tham số dòng lệnh (<code>$1</code>, <code>$#</code>)</h3>
<pre><code>#!/bin/bash
# QUY TẮC SỐ 1 CỦA BASH: Khi gán biến, TUYỆT ĐỐI KHÔNG ĐƯỢC CÓ DẤU CÁCH quanh dấu "=" !
ten="An"                     # ĐÚNG (Nếu viết ten = "An" có dấu cách, Bash sẽ tưởng "ten" là tên câu lệnh và báo lỗi!)
echo "Xin chào bạn $ten"     # Khi lấy giá trị của biến ra dùng thì thêm dấu $ ở trước tên biến

# Nhận dữ liệu từ bên ngoài truyền vào khi gọi script (ví dụ gọi: ./chao.sh Minh 20):
#   $0 = tên file script (./chao.sh)
#   $1 = tham số thứ nhất (Minh)
#   $2 = tham số thứ hai (20)
#   $# = tổng số lượng tham số được truyền vào (2)</code></pre>

<h3>3. Câu lệnh điều kiện <code>if ... then ... else ... fi</code></h3>
<pre><code>#!/bin/bash
# QUY TẮC SỐ 2: Bên trong ngoặc vuông [ ... ] BẮT BUỘC PHẢI CÓ DẤU CÁCH ở sát mép trong!
if [ -f "$1" ]; then
    echo "Đối tượng $1 là một TẬP TIN (file) đang tồn tại"
elif [ -d "$1" ]; then
    echo "Đối tượng $1 là một THƯ MỤC (directory) đang tồn tại"
else
    echo "Không tìm thấy $1"
fi</code></pre>
<table>
<tr><th>Phép kiểm tra trong <code>[ ... ]</code></th><th>Ý nghĩa dễ nhớ</th><th>Ví dụ</th></tr>
<tr><td><code>[ -f "$duong_dan" ]</code></td><td>Kiểm tra có phải là <b>F</b>ile thường và tồn tại không</td><td><code>[ -f "baocao.txt" ]</code></td></tr>
<tr><td><code>[ -d "$duong_dan" ]</code></td><td>Kiểm tra có phải là <b>D</b>irectory (thư mục) không</td><td><code>[ -d "/var/log" ]</code></td></tr>
<tr><td><code>[ -z "$chuoi" ]</code></td><td>Kiểm tra chuỗi có <b>rỗng</b> (<b>z</b>ero length) không</td><td><code>[ -z "$1" ]</code> (người dùng quên truyền tham số)</td></tr>
<tr><td><code>[ "$a" -eq "$b" ]</code></td><td>So sánh 2 số bằng nhau (<b>eq</b>ual). Lớn hơn: <code>-gt</code>, nhỏ hơn: <code>-lt</code></td><td><code>[ "$dem" -gt 0 ]</code></td></tr>
</table>

<h3>4. Ghép chuỗi lệnh với <code>&amp;&amp;</code> và <code>||</code> (Cách AI và lập trình viên hay viết)</h3>
<p>Mỗi câu lệnh trong Linux khi chạy xong đều ngầm trả về một <b>mã thoát (Exit code)</b>: <b><code>0</code> là Thành công</b>, còn <b>khác 0 (1, 2, 127...) là Thất bại / Có lỗi</b>. Nhờ đó ta có 2 toán tử ghép lệnh cực kỳ lợi hại:</p>
<ul>
<li><b><code>Lệnh_A &amp;&amp; Lệnh_B</code>:</b> Chỉ chạy <code>Lệnh_B</code> <b>NẾU <code>Lệnh_A</code> đã chạy THÀNH CÔNG</b> (nếu <code>Lệnh_A</code> lỗi thì dừng ngay, không chạy <code>Lệnh_B</code>!).</li>
<li><b><code>Lệnh_A || Lệnh_B</code>:</b> Chỉ chạy <code>Lệnh_B</code> <b>NẾU <code>Lệnh_A</code> bị THẤT BẠI</b> (dùng để xử lý lỗi hoặc chạy phương án dự phòng).</li>
</ul>

<pre><code># Ví dụ 1: Tạo thư mục backup thành công rồi mới nén file vào đó; nếu nén lỗi thì in cảnh báo:
mkdir -p backup && tar -czf backup/doc.tar.gz Documents || echo "Lỗi khi nén!"

# Ví dụ 2: Vòng lặp for đếm file .txt an toàn (kết hợp || continue):
for f in *.txt; do
    [ -f "$f" ] || continue    # Nếu không phải file thật (khi thư mục không có file .txt nào) thì bỏ qua!
    echo "Đang xử lý file: $f"
done</code></pre>

<h3>5. Tìm kiếm (<code>find</code>) và Đóng gói nén sao lưu (<code>tar</code>)</h3>
<p>Trong các script tự động hóa và sao lưu thực tế, bộ đôi <code>find</code> và <code>tar</code> luôn đi cùng nhau:</p>
<pre><code># 1. Lệnh find: Tìm file/thư mục xuyên suốt mọi thư mục con
# Cú pháp: find [thư_mục_bắt_đầu] -name "[mẫu_tên]"
find . -name "*.txt"              # Tìm mọi file đuôi .txt tính từ thư mục hiện tại (.) trở xuống
find /etc -name "*.conf"          # Tìm mọi file cấu hình .conf nằm trong /etc

# 2. Lệnh tar: Đóng gói và nén toàn bộ thư mục thành 1 file .tar.gz duy nhất
# Giải thích 4 chữ cái tùy chọn:
#   -c (create): tạo gói mới        | -z (gzip): nén dung lượng nhỏ lại bằng chuẩn gzip
#   -t (list): xem danh sách bên trong | -f (file): chỉ định tên file .tar.gz ngay phía sau
#   -x (extract): bung / giải nén
tar -czf backup.tar.gz Documents  # Nén toàn bộ thư mục Documents thành file backup.tar.gz
tar -tzf backup.tar.gz            # Xem danh sách các file nằm bên trong gói mà không cần giải nén
tar -xzf backup.tar.gz            # Giải nén gói backup.tar.gz ra lại</code></pre>

<h3>6. Thực hành ngay tại chỗ: Ghép lệnh, Tìm kiếm & Nén sao lưu</h3>
<p>Gõ thử lần lượt vào khung Terminal bên dưới:</p>
<ol>
<li><code>find . -name "*.txt"</code> → tìm toàn bộ các file <code>.txt</code> đang có trong thư mục nhà và các thư mục con.</li>
<li><code>mkdir -p backup && tar -czf backup/doc.tar.gz Documents</code> → tạo thư mục <code>backup</code> và nén <code>Documents</code> vào <code>backup/doc.tar.gz</code>.</li>
<li><code>tar -tzf backup/doc.tar.gz</code> → kiểm tra xem bên trong file nén vừa tạo có <code>Documents/baocao.txt</code> chưa!</li>
</ol>
<div class="mini-term" data-id="t-script"></div>

<div class="tip"><b>🧭 Bước tiếp theo sau Bài 8 (Hoàn thiện toàn khóa!):</b>
<br>1. Làm <b>8 câu trắc nghiệm</b> ngay bên dưới.
<br>2. <b>Thực hành chấm điểm:</b> Vào <a href="#/practice/tim-nen">🎯 Thử thách 6: Tìm kiếm & đóng gói sao lưu</a> (dùng <code>find</code> và <code>tar -czf</code>).
<br>3. <b>Luyện đọc hiểu code thực tế:</b> Vào <a href="#/reading">👓 Phòng đọc code</a> để luyện đọc toàn bộ 8 kịch bản bash thực tế (kể cả code do AI viết) và tích vào <a href="#/final">🎯 Checklist cuối khóa</a>!</div>`,
    quiz: [
      { q: 'Dòng "#!/bin/bash" đặt ở dòng đầu tiên của một file script được gọi là gì và có tác dụng gì?', o: ['Chỉ là dòng ghi chú trang trí, không có tác dụng gì', 'Gọi là Shebang – chỉ định cho hệ điều hành dùng trình thông dịch /bin/bash để thực thi script đó', 'Dùng để xóa màn hình trước khi chạy script', 'Dùng để cấp quyền root tự động cho script'], a: 1, why: 'Ký hiệu #! ở dòng đầu tiên gọi là Shebang, báo cho hệ điều hành biết trình thông dịch nào (/bin/bash, /usr/bin/python3...) sẽ được gọi để chạy file.' },
      { q: 'Trong Bash script, cách gán giá trị cho biến nào dưới đây là ĐÚNG cú pháp?', o: ['ten = "An" (có dấu cách quanh dấu =)', 'ten="An" (viết liền, KHÔNG có dấu cách quanh dấu =)', '$ten="An"', 'set ten = "An"'], a: 1, why: 'Trong Bash, phép gán biến bắt buộc không được có khoảng trắng xung quanh dấu "=". Nếu viết "ten = An", Bash sẽ hiểu "ten" là tên một câu lệnh cần chạy và báo lỗi command not found.' },
      { q: 'Khi người dùng chạy lệnh "./deploy.sh production 8080", bên trong file deploy.sh thì biến "$1" và "$#" mang giá trị gì?', o: ['$1 là "./deploy.sh", $# là 1', '$1 là "production" (tham số thứ nhất), $# là 2 (tổng số tham số truyền vào)', '$1 là "8080", $# là 8080', '$1 là toàn bộ dòng lệnh, $# là 0'], a: 1, why: '$0 là tên script (./deploy.sh), $1 là tham số thứ nhất (production), $2 là tham số thứ hai (8080), và $# là tổng số lượng tham số (2).' },
      { q: 'Sau khi tạo mới một file script tên là "backup.sh", bạn phải chạy lệnh gì trước thì mới thực thi được bằng "./backup.sh"?', o: ['chmod +x backup.sh (hoặc chmod u+x / chmod 755) để cấp quyền thực thi', 'mv backup.sh backup.exe', 'cat backup.sh', 'Không cần làm gì, file mới tạo luôn tự chạy được'], a: 0, why: 'Mặc định tập tin văn bản mới tạo chỉ có quyền đọc/ghi (644, rw-r--r--), chưa có quyền thực thi (x); cần chạy chmod +x trước.' },
      { q: 'Trong câu lệnh ghép "mkdir backup && tar -czf backup/data.tar.gz data", toán tử "&&" hoạt động như thế nào?', o: ['Chạy cả hai lệnh cùng một lúc bất kể đúng sai', 'Chỉ chạy lệnh tar ở vế sau NẾU lệnh mkdir ở vế trước đã chạy THÀNH CÔNG (mã thoát bằng 0)', 'Chỉ chạy lệnh tar nếu lệnh mkdir bị lỗi', 'Gửi văn bản của lệnh mkdir sang lệnh tar'], a: 1, why: 'Toán tử && (AND logic) đảm bảo lệnh phía sau chỉ được thực thi khi lệnh phía trước hoàn thành mà không gặp lỗi.' },
      { q: 'Trong vòng lặp "for f in *.txt; do [ -f "$f" ] || continue; ... done", dòng "[ -f \"$f\" ] || continue" giúp phòng tránh lỗi gì?', o: ['Tránh việc ổ cứng bị đầy', 'Tránh lỗi khi thư mục không có file .txt nào (lúc đó *.txt giữ nguyên thành chuỗi "*.txt" không phải file thật, nên cần kiểm tra -f và bỏ qua bằng continue)', 'Tránh xóa nhầm thư mục gốc /', 'Giúp vòng lặp chạy nhanh gấp đôi'], a: 1, why: 'Trong Bash mặc định, nếu không có file nào khớp với *.txt, biến f sẽ nhận chuỗi nguyên văn "*.txt". Kiểm tra [ -f "$f" ] || continue đảm bảo chỉ xử lý khi đó là file tồn tại thật.' },
      { q: 'Trong lệnh đóng gói nén "tar -czf sao-luu.tar.gz du-an", ba tùy chọn "-c", "-z", "-f" lần lượt có nghĩa là gì?', o: ['copy, zip, force', 'create (tạo gói mới), gzip (nén bằng thuật toán gzip), file (chỉ định tên file nén đầu ra)', 'check, zero, find', 'clear, zone, format'], a: 1, why: '-c = create (tạo gói), -z = nén gzip (.gz), -f = tên tập tin gói đích. Còn khi muốn xem danh sách bên trong dùng -tzf, giải nén dùng -xzf.' },
      { q: 'Lệnh nào tìm tất cả các tập tin có đuôi ".conf" nằm trong thư mục "du-an" và các thư mục con của nó?', o: ['grep "*.conf" du-an', 'find du-an -name "*.conf"', 'ls -a du-an/*.conf', 'tar -tzf du-an "*.conf"'], a: 1, why: 'Lệnh find tìm kiếm đệ quy qua toàn bộ cây thư mục con của "du-an" và lọc những mục có tên khớp với mẫu -name "*.conf".' }
    ]
  }
];
