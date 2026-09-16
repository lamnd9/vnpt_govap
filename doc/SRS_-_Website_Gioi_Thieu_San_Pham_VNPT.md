Tài liệu Yêu cầu Phần mềm (SRS)
Dự án: Website Giới thiệu Sản phẩm VNPT
Phiên bản: 1.0.0

## 1. Giới thiệu

### 1.1 Mục đích
Website Giới thiệu Sản phẩm VNPT là một trang web đơn giản, tối giản hơn so với trang tham khảo vnptgiadinh.vn, dùng để giới thiệu các sản phẩm/dịch vụ số của VNPT, hỗ trợ làm SEO và chạy quảng cáo trên các nền tảng mạng xã hội. Hệ thống được xây dựng theo hướng landing page tĩnh (Static Site Generation) kết hợp form thu thập lead, cho phép khách hàng tiềm năng tìm hiểu sản phẩm và để lại thông tin liên hệ. Tài liệu này mô tả các yêu cầu chức năng, yêu cầu phi chức năng, và yêu cầu giao diện người dùng nhằm đảm bảo hệ thống được triển khai đúng mục tiêu đề ra.

### 1.2 Phạm vi hệ thống
**Chức năng chính trong phạm vi hệ thống:**
- ● **Trang giới thiệu sản phẩm/dịch vụ:** hiển thị 6 nhóm sản phẩm/dịch vụ theo dạng landing page (hero, bảng giá, tính năng, FAQ)
  - ○ Chữ ký số
  - ○ Hóa đơn điện tử
  - ○ Phần mềm cho doanh nghiệp
  - ○ Phần mềm cho hộ kinh doanh
  - ○ Giải pháp cho khối chính quyền
  - ○ Giải pháp cho trường học
- ● **Thu thập lead:** form đăng ký tư vấn/liên hệ gắn trên từng trang sản phẩm, gửi dữ liệu qua API xử lý và lưu trữ
- ● **Quản trị lead (Admin):** đăng nhập quản trị, xem danh sách, tìm kiếm/lọc và cập nhật trạng thái lead thu thập được
- ● **SEO & Tracking:** tối ưu SEO on-page (meta tag, sitemap, schema) và tích hợp Google Tag Manager, Facebook Pixel để đo lường quảng cáo

**Chức năng ngoài phạm vi:**
- ● Hệ thống không xử lý thanh toán trực tuyến hoặc giao dịch mua hàng
- ● Hệ thống không thay thế quy trình tư vấn/bán hàng trực tiếp của nhân viên kinh doanh — chỉ hỗ trợ thu thập lead ban đầu
- ● Hệ thống không tích hợp CRM nội bộ VNPT ở giai đoạn 1 (để ngỏ khả năng mở rộng sau)

## 2. Các yêu cầu chức năng

### 2.1 Quản lý nội dung trang giới thiệu sản phẩm
- **Mô tả:** Hiển thị thông tin giới thiệu cho từng nhóm sản phẩm/dịch vụ trong số 6 category, theo cấu trúc landing page thống nhất, dữ liệu được quản lý dạng cấu hình (data-driven) để dễ cập nhật.
- **Yêu cầu chi tiết:**
  - ○ **Trang chủ:** liệt kê tổng quan 6 category dưới dạng danh sách/card, dẫn link tới từng trang chi tiết
  - ○ **Trang chi tiết category:** hiển thị hero banner, mô tả tính năng, bảng giá (nếu có), câu hỏi thường gặp (FAQ), và form đăng ký tư vấn
  - ○ **Cấu hình nội dung:** nội dung từng trang (text, ảnh, giá, FAQ) được lưu trong cơ sở dữ liệu/CMS nhẹ, chỉnh sửa được qua khu vực quản trị (xem mục 2.3)
  - ○ **Tối ưu tải trang:** trang giới thiệu được render tĩnh/ISR (Incremental Static Regeneration) từ dữ liệu quản trị để tối ưu tốc độ và SEO, tự động cập nhật lại trang sau khi admin lưu thay đổi nội dung

### 2.2 Thu thập lead (Lead Capture)
- **Mô tả:** Cho phép khách hàng tiềm năng gửi thông tin liên hệ/yêu cầu tư vấn ngay trên trang sản phẩm, dữ liệu được xử lý qua API backend.
- **Yêu cầu chi tiết:**
  - ○ **Form đăng ký tư vấn:** thu thập họ tên, số điện thoại, email, sản phẩm quan tâm, ghi chú
  - ○ **Validate dữ liệu:** kiểm tra định dạng số điện thoại/email phía client và server trước khi lưu
  - ○ **Xử lý submit:** API Node.js nhận dữ liệu, lưu vào cơ sở dữ liệu và gửi thông báo (email/webhook) tới nhân viên kinh doanh phụ trách
  - ○ **Phản hồi người dùng:** hiển thị thông báo xác nhận thành công hoặc lỗi ngay trên form, không chuyển trang

### 2.3 Quản trị lead (Admin)
- **Mô tả:** Cung cấp khu vực quản trị để nhân viên kinh doanh/quản lý xem và xử lý danh sách lead đã thu thập được.
- **Yêu cầu chi tiết:**
  - ○ **Đăng nhập quản trị:** xác thực tài khoản admin bằng email/mật khẩu
  - ○ **Danh sách lead:** hiển thị bảng lead theo thời gian gửi, có tìm kiếm theo tên/số điện thoại và lọc theo sản phẩm quan tâm, trạng thái
  - ○ **Cập nhật trạng thái lead:** đánh dấu trạng thái xử lý (Mới, Đang liên hệ, Đã chốt, Không tiềm năng)
  - ○ **Xem chi tiết lead:** xem đầy đủ thông tin một lead và ghi chú xử lý
  - ○ **Chỉnh sửa nội dung giới thiệu sản phẩm:** chỉnh sửa được nội dung của từng trang category (hero, tính năng, bảng giá, FAQ) mà không cần sửa code, thay đổi có hiệu lực ngay sau khi lưu (xem mục 4.7)

### 2.4 SEO & Tracking
- **Mô tả:** Đảm bảo các trang giới thiệu được tối ưu cho công cụ tìm kiếm và tích hợp công cụ đo lường quảng cáo mạng xã hội.
- **Yêu cầu chi tiết:**
  - ○ **Meta tag & sitemap:** mỗi trang category có title, description, Open Graph tag riêng; sitemap.xml và robots.txt tự sinh
  - ○ **Google Tag Manager:** nhúng GTM container để quản lý các thẻ tracking tập trung
  - ○ **Facebook Pixel:** theo dõi sự kiện xem trang và submit form phục vụ chạy quảng cáo Facebook Ads

## 3. Các yêu cầu phi chức năng

### 3.1 Hiệu suất
- ● Yêu cầu API: thời gian phản hồi dưới 500ms cho các request submit form và truy vấn danh sách lead
- ● Thời gian tải trang: dưới 2 giây (First Contentful Paint) cho các trang giới thiệu nhờ SSG
- ● Truy vấn cơ sở dữ liệu: dưới 200ms cho các truy vấn danh sách/lọc lead

### 3.2 Bảo mật
- ● Xác thực và phân quyền: JWT cho phiên đăng nhập admin, chỉ tài khoản admin mới truy cập được khu vực quản trị
- ● Mã hóa: HTTPS/TLS bắt buộc cho toàn bộ traffic, kể cả API xử lý form
- ● Quản lý mật khẩu: mật khẩu admin được hash bằng bcrypt, không lưu plaintext
- ● CORS Policy: API chỉ chấp nhận request từ domain chính thức của website

### 3.3 Độ sẵn sàng
- ● Uptime: cam kết 99.5% nhờ hosting trên Vercel (phần frontend) và dịch vụ backend có khả năng tự phục hồi
- ● Backup & Recovery: dữ liệu lead được sao lưu định kỳ hàng ngày, có khả năng khôi phục trong vòng 24 giờ

### 3.4 Khả năng mở rộng
- ● Horizontal Scaling: API backend triển khai dạng stateless, có thể nhân bản instance khi lượng truy cập tăng
- ● Vertical Scaling: cơ sở dữ liệu có thể nâng cấp tài nguyên khi số lượng lead tăng theo thời gian

{cần xác nhận: các ngưỡng hiệu suất/bảo mật/uptime ở trên là đề xuất theo mặt bằng chung dự án landing page + lead capture, anh xác nhận hoặc chỉnh lại số liệu cụ thể theo yêu cầu thực tế của VNPT}

## 4. Giao diện người dùng

### 4.1 Trang chủ (Homepage)
- **Mô tả:** Trang vào đầu tiên của website, giới thiệu tổng quan thương hiệu và dẫn hướng người dùng tới 6 nhóm sản phẩm/dịch vụ.
- **Yêu cầu chi tiết:**
  - ○ **Hero section:** banner chính giới thiệu thông điệp thương hiệu, nút CTA dẫn tới danh sách sản phẩm
  - ○ **Danh sách 6 category:** hiển thị dạng lưới card, mỗi card gồm icon/ảnh, tên category, mô tả ngắn, link "Xem chi tiết"
  - ○ **Footer:** thông tin liên hệ, mạng xã hội, chính sách bảo mật

### 4.2 Trang chi tiết sản phẩm/dịch vụ (Category Landing Page)
- **Mô tả:** Mẫu trang dùng chung cho cả 6 category (Chữ ký số, Hóa đơn điện tử, Phần mềm cho doanh nghiệp, Phần mềm cho hộ kinh doanh, Giải pháp cho khối chính quyền, Giải pháp cho trường học), tham khảo cấu trúc từ vnptgiadinh.vn nhưng tối giản hơn.
- **Yêu cầu chi tiết:**
  - ○ **Hero:** tên sản phẩm, mô tả ngắn, ảnh minh họa, nút CTA "Đăng ký tư vấn"
  - ○ **Bảng tính năng:** liệt kê các tính năng nổi bật của sản phẩm/dịch vụ
  - ○ **Bảng giá (nếu có):** các gói dịch vụ kèm mức giá tham khảo
  - ○ **FAQ:** danh sách câu hỏi thường gặp dạng accordion
  - ○ **Form đăng ký tư vấn:** đặt cuối trang, xem chi tiết tại mục 4.3

### 4.3 Form đăng ký tư vấn (Lead Capture Form)
- **Mô tả:** Thành phần dùng chung, nhúng trên mọi trang category, cho phép khách hàng để lại thông tin liên hệ.
- **Yêu cầu chi tiết:**
  - ○ **Các trường nhập liệu:**
    - ■ Họ và tên (bắt buộc, text)
    - ■ Số điện thoại (bắt buộc, định dạng 10 số, vd: 0912345678)
    - ■ Email (không bắt buộc, định dạng email hợp lệ)
    - ■ Sản phẩm quan tâm (dropdown, mặc định theo trang hiện tại, có thể đổi)
    - ■ Ghi chú (không bắt buộc, textarea)
  - ○ **Nút hành động chính:**
    - ■ Nút "Gửi yêu cầu tư vấn"
  - ○ **Trạng thái phản hồi:** thông báo thành công/lỗi hiển thị ngay dưới form sau khi submit

### 4.4 Đăng nhập quản trị (Admin Login)
- **Mô tả:** Màn hình đăng nhập dành riêng cho nhân viên/quản lý truy cập khu vực quản trị lead.
- **Yêu cầu chi tiết:**
  - ○ **Form đăng nhập:**
    - ■ Email
    - ■ Mật khẩu
  - ○ **Nút hành động chính:**
    - ■ Nút "Đăng nhập"
  - ○ Thông báo lỗi khi sai thông tin đăng nhập

### 4.5 Danh sách lead (Admin Dashboard)
- **Mô tả:** Màn hình chính của khu vực quản trị, cho phép admin xem, tìm kiếm và lọc danh sách lead đã thu thập.
- **Yêu cầu chi tiết:**
  - ○ **Bảng danh sách lead:** cột Họ tên, Số điện thoại, Sản phẩm quan tâm, Thời gian gửi, Trạng thái
  - ○ **Bộ lọc/tìm kiếm:**
    - ■ Tìm kiếm theo tên/số điện thoại
    - ■ Lọc theo sản phẩm quan tâm
    - ■ Lọc theo trạng thái xử lý
  - ○ **Phân trang:** hiển thị danh sách theo trang, mặc định 20 lead/trang

### 4.6 Chi tiết lead (Lead Detail)
- **Mô tả:** Màn hình xem đầy đủ thông tin một lead và cập nhật trạng thái xử lý.
- **Yêu cầu chi tiết:**
  - ○ **Thông tin lead:** hiển thị đầy đủ các trường đã thu thập từ form đăng ký
  - ○ **Cập nhật trạng thái:**
    - ■ Dropdown chọn trạng thái (Mới, Đang liên hệ, Đã chốt, Không tiềm năng)
    - ■ Ô ghi chú xử lý
  - ○ **Nút hành động chính:**
    - ■ Nút "Lưu thay đổi"

### 4.7 Chỉnh sửa nội dung sản phẩm (Content Editor)
- **Mô tả:** Màn hình cho phép admin chỉnh sửa nội dung hiển thị trên các trang category (mục 4.2) mà không cần can thiệp code, áp dụng cho từng category trong số 6 category.
- **Yêu cầu chi tiết:**
  - ○ **Chọn category cần sửa:** dropdown/danh sách 6 category để chọn trang cần chỉnh sửa
  - ○ **Các trường chỉnh sửa:**
    - ■ Tiêu đề & mô tả Hero (text, ảnh banner)
    - ■ Danh sách tính năng nổi bật (thêm/sửa/xóa từng dòng tính năng)
    - ■ Bảng giá (tên gói, mức giá, mô tả gói — thêm/sửa/xóa từng gói)
    - ■ Danh sách FAQ (câu hỏi, câu trả lời — thêm/sửa/xóa từng cặp)
  - ○ **Xem trước (Preview):** xem trước trang category với nội dung vừa chỉnh sửa trước khi lưu chính thức
  - ○ **Nút hành động chính:**
    - ■ Nút "Lưu và xuất bản"
    - ■ Nút "Hủy thay đổi"
  - ○ **Lịch sử chỉnh sửa:** ghi nhận người sửa và thời gian sửa gần nhất cho mỗi trang category
