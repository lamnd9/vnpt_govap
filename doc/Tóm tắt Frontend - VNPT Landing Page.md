# Tóm tắt Frontend — VNPT Landing Page

2026-09-20 · Tổng hợp bởi @Someone

Tài liệu tổng hợp toàn bộ các thay đổi frontend đã thực hiện trên dự án `vnpt_govap` (Next.js App Router + Prisma + PostgreSQL).

## 1. Header (`components/landing/SiteHeader.tsx`)

- Logo VNPT thật (`vnpt-logo.webp`), thay cho chữ text ban đầu.
- Dropdown **"Sản phẩm & dịch vụ"** (`components/landing/ProductMenu.tsx`) — liệt kê 6 category lấy trực tiếp từ DB, tự đóng khi click ra ngoài hoặc khi chọn 1 mục (client component dùng `useEffect` + click-outside).
- Email `toannm.hcm@vnpt.vn` (ẩn trên mobile) + số điện thoại `0941.048.085` — thay thế cho nút "Đăng ký tư vấn" cũ.

## 2. Khối liên hệ nhanh nổi (`components/landing/FloatingContact.tsx`)

Fixed ở góc dưới-phải màn hình, hiển thị trên **mọi trang public** (gắn tại `app/(public)/layout.tsx`):

| Nút | Hành vi |
| --- | --- |
| Đăng ký Online | Cuộn tới `#dang-ky-tu-van` (form đăng ký) ngay trên trang đang xem |
| Chat Messenger | Mở `facebook.com/messages/t/duylam87` — chat trực tiếp với tài khoản cá nhân |
| Chat Zalo | Mở `zalo.me/0941048085` — chat cá nhân qua số điện thoại, dùng logo Zalo thật |
| Gọi điện | `tel:0941048085` |

## 3. Trang chủ (`app/(public)/page.tsx`)

- Hero "Chuyển đổi số cùng VNPT" kèm nút "Xem sản phẩm".
- Lưới 6 category dạng thẻ (card).
- Form "Đăng ký tư vấn" (`id="dang-ky-tu-van"`) — mới thêm để nút nổi "Đăng ký Online" hoạt động được cả khi đang ở trang chủ.

## 4. Trang category — `/san-pham/[slug]`

Áp dụng đồng nhất cho **cả 6 category**: Chữ ký số, Hóa đơn điện tử, Phần mềm cho doanh nghiệp, Phần mềm cho hộ kinh doanh, Giải pháp cho khối chính quyền, Giải pháp cho trường học.

Cấu trúc trang sau khi chỉnh sửa:

1. **Hero** — giảm chiều cao 50% so với bản gốc, bỏ nút CTA, có illustration minh hoạ riêng bên phải (ẩn trên mobile).
2. ~~Tính năng nổi bật~~ — đã ẩn ở cả 6 trang.
3. **Bảng giá dạng bảng** (header nền xanh, giá màu đỏ đậm) thay cho dạng thẻ lưới; tiêu đề bảng = tên sản phẩm viết hoa.
4. ~~Câu hỏi thường gặp~~ — đã ẩn ở cả 6 trang.
5. Form "Đăng ký tư vấn".

### Illustration & màu banner từng trang

| Category | Illustration | Banner màu |
| --- | --- | --- |
| Chữ ký số | Ảnh thật (tải về) | Xanh dương |
| Hóa đơn điện tử | Ảnh thật (tải về) | Đổi từ xanh lá → indigo/xanh dương cho khớp ảnh |
| Phần mềm cho doanh nghiệp | SVG tự vẽ (màn hình + biểu đồ) | Indigo (giữ nguyên) |
| Phần mềm cho hộ kinh doanh | SVG tự vẽ (cửa hàng + túi) | Cam (giữ nguyên) |
| Giải pháp cho khối chính quyền | SVG tự vẽ (trụ sở + khiên) | Xám xanh (giữ nguyên) |
| Giải pháp cho trường học | SVG tự vẽ (mũ tốt nghiệp + sách) | Tím-hồng (giữ nguyên) |

### Dữ liệu giá

- **Chữ ký số** & **Hóa đơn điện tử**: dùng giá thật do chú cung cấp.
- **4 category còn lại**: đang là **dummy data** tự đặt — cần vào Admin sửa lại giá thật trước khi lên production.

## 5. Footer (`components/landing/SiteFooter.tsx`)

Giữ nguyên như ban đầu, **chưa đồng bộ** với thông tin liên hệ cá nhân mới:

- Hotline: `1800 1166`
- Email: `cskh@vnpt.com.vn`
- Facebook: `facebook.com/vnpt`
- Zalo: `zalo.me/vnpt`

## 6. Favicon

`favicon.ico` / `icon.png` / `apple-icon.png` — chỉ dùng icon xoáy chữ V (không kèm chữ "VNPT"), khác với logo đầy đủ hiển thị ở header.

## 7. Hạ tầng / vận hành

- Database đã được migrate + seed.
- `.env` đã có `JWT_SECRET` hợp lệ → đăng nhập Admin hoạt động bình thường.
- Tài khoản Admin: `admin@vnpt.vn` / `Admin@123`.

## Việc còn để ngỏ

- [ ] Đồng bộ Footer với thông tin liên hệ cá nhân mới (hiện đang dùng `1800 1166` / `facebook.com/vnpt` / `zalo.me/vnpt` cũ).
- [ ] Cập nhật giá thật cho 4/6 category đang dùng dummy data.
- [ ] Đồng bộ preview bảng giá trong trang Admin (Content Editor) — hiện vẫn hiển thị dạng thẻ cũ, chưa khớp layout bảng thật ngoài trang public.
