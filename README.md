# Website Giới thiệu Sản phẩm VNPT

Landing page giới thiệu 6 nhóm sản phẩm/dịch vụ số của VNPT (Chữ ký số, Hóa đơn điện tử, Phần mềm cho doanh nghiệp, Phần mềm cho hộ kinh doanh, Giải pháp cho khối chính quyền, Giải pháp cho trường học), kèm form thu thập lead và khu vực quản trị.

Tài liệu tham khảo: [`doc/SRS_-_Website_Gioi_Thieu_San_Pham_VNPT.md`](doc/SRS_-_Website_Gioi_Thieu_San_Pham_VNPT.md), [`doc/TDD_-_Website_Gioi_Thieu_San_Pham_VNPT.md`](doc/TDD_-_Website_Gioi_Thieu_San_Pham_VNPT.md).

## Tech stack

Next.js (App Router) + TypeScript + Tailwind CSS, Prisma ORM + PostgreSQL, JWT + bcrypt tự triển khai cho xác thực admin. Chi tiết xem mục 3 của TDD.

## Quy trình dev local

1. Cài dependencies:
   ```bash
   npm install
   ```
2. Copy file env mẫu và điền giá trị (mặc định đã khớp với `docker-compose.yml`):
   ```bash
   cp .env.example .env.local
   ```
3. Chạy PostgreSQL local bằng Docker:
   ```bash
   docker compose up -d
   ```
4. Chạy migration Prisma:
   ```bash
   npx prisma migrate dev
   ```
5. Seed dữ liệu mẫu (6 category + 1 tài khoản admin):
   ```bash
   npx prisma db seed
   ```
6. Chạy dev server:
   ```bash
   npm run dev
   ```
   Mở [http://localhost:3000](http://localhost:3000).

## Kiểm thử

Test tích hợp (Vitest) chạy `next build` + `next start` trên cổng riêng (3100) rồi gọi thật vào các API. Yêu cầu Postgres đã chạy và đã migrate/seed (bước 3-5 ở trên):

```bash
npm test
```

Bao gồm: submit lead + gọi webhook Zalo, validate input, rate-limit, xác thực JWT (`/api/auth/login`, `/api/auth/logout`, toàn bộ `/api/admin/*`), Content Editor (GET/PUT category + revalidate), và kiểm tra ngưỡng hiệu suất ở mục 3.1 SRS / mục 10 TDD (API dưới 500ms, truy vấn DB danh sách/lọc lead dưới 200ms, trang public dưới 2s). Test tự dọn dữ liệu tạo ra (xoá lead test, khôi phục nội dung category gốc) sau khi chạy.

## Biến môi trường

Xem `.env.example` và mục 11 của TDD. Khi lên production, đổi `DATABASE_URL`/`DIRECT_URL` sang connection string Supabase/Neon — schema Prisma dùng chung, không cần sửa code.

## Cấu trúc thư mục

Theo mục 8 của TDD: `app/(public)` (trang giới thiệu, SSG/ISR), `app/(admin)` (khu vực quản trị, CSR), `app/api` (API Routes), `lib/` (prisma client, auth, validation), `components/` (landing, admin), `prisma/` (schema + seed). `tests/` chứa test tích hợp (Vitest).
