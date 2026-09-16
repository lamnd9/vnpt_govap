Tài liệu Thiết kế Kỹ thuật / Kiến trúc Hệ thống (Technical Design Document)
Dự án: Website Giới thiệu Sản phẩm VNPT
Phiên bản: 1.0.0
Tài liệu liên quan: SRS_-_Website_Gioi_Thieu_San_Pham_VNPT.md

## 1. Giới thiệu

### 1.1 Mục đích
Tài liệu này mô tả thiết kế kỹ thuật cho hệ thống Website Giới thiệu Sản phẩm VNPT, cụ thể hóa các yêu cầu chức năng/phi chức năng trong SRS thành kiến trúc hệ thống, tech stack, database schema, API design và luồng xử lý dữ liệu, làm cơ sở để triển khai code (kể cả khi giao cho công cụ như Claude Code thực hiện).

### 1.2 Phạm vi
Tài liệu bao gồm: kiến trúc tổng quan, tech stack, database schema, thiết kế API, cơ chế xác thực, cấu trúc thư mục project, các luồng xử lý chính, chiến lược triển khai, và ánh xạ các yêu cầu phi chức năng trong SRS sang giải pháp kỹ thuật cụ thể. Không bao gồm thiết kế UI chi tiết (pixel-level) — phần này tham khảo mục 4 của SRS.

## 2. Kiến trúc tổng quan

### 2.1 Sơ đồ thành phần
```
┌─────────────────────┐        ┌──────────────────────┐
│   Trình duyệt        │        │   Trang Admin (SPA)   │
│  (Khách truy cập)     │        │  (nhân viên VNPT)     │
└──────────┬───────────┘        └───────────┬──────────┘
           │  HTTPS                          │  HTTPS + JWT
           ▼                                 ▼
┌─────────────────────────────────────────────────────────┐
│                Next.js App (Vercel)                       │
│  - Trang giới thiệu: SSG/ISR (render từ DB tại build/revalidate) │
│  - Admin UI: Client-side rendered, gọi API Routes          │
│  - API Routes (Node.js runtime): /api/leads, /api/categories,│
│    /api/auth, /api/revalidate                              │
└──────────┬───────────────────────┬────────────────────────┘
           │                       │
           ▼                       ▼
┌─────────────────────┐   ┌──────────────────────┐
│  PostgreSQL (Supabase │   │  GTM / Facebook Pixel │
│  hoặc Neon)           │   │  (client-side script) │
│  - categories (JSONB) │   └──────────────────────┘
│  - leads               │
│  - admin_users         │
└─────────────────────┘
```

### 2.2 Các thành phần chính
- ● **Frontend giới thiệu sản phẩm:** Next.js, render SSG kết hợp ISR — nội dung lấy từ bảng `categories` tại thời điểm build/revalidate, không gọi API mỗi lần người dùng truy cập nhằm tối ưu tốc độ tải trang (đáp ứng mục 3.1 SRS).
- ● **Admin UI:** giao diện quản trị (đăng nhập, danh sách lead, content editor) render phía client, gọi trực tiếp API Routes có xác thực JWT.
- ● **API Backend:** triển khai bằng Next.js API Routes (Node.js runtime), xử lý nghiệp vụ lead, xác thực admin, CRUD nội dung category, và trigger revalidate trang tĩnh sau khi admin lưu nội dung.
- ● **Cơ sở dữ liệu:** PostgreSQL (Supabase hoặc Neon) — lưu lead, nội dung category (JSONB), tài khoản admin.
- ● **Tracking:** Google Tag Manager và Facebook Pixel nhúng phía client, bắn sự kiện `PageView` và `Lead` (khi submit form thành công).

## 3. Tech stack

| Thành phần | Công nghệ | Ghi chú |
|---|---|---|
| Frontend & API | Next.js (App Router) | SSG/ISR cho trang public, CSR cho admin |
| Ngôn ngữ | TypeScript | Áp dụng cho cả frontend và API routes |
| Styling | Tailwind CSS | Theo quyết định ban đầu của dự án |
| ORM | Prisma | Kết nối PostgreSQL, dùng driver adapter cho serverless |
| Database | PostgreSQL (Supabase/Neon) | JSONB cho nội dung category |
| Xác thực Admin | JWT (hoặc Supabase Auth) | Xem mục 5 |
| Hosting | Vercel | Frontend + API Routes cùng 1 project |
| Tracking | Google Tag Manager, Facebook Pixel | Nhúng qua `next/script` |
| Email/Webhook thông báo lead | Resend/SendGrid hoặc Slack Webhook | {cần xác nhận: kênh thông báo lead cụ thể} |

## 4. Thiết kế cơ sở dữ liệu

### 4.1 Schema (Prisma)
```prisma
model Category {
  id          String   @id @default(cuid())
  slug        String   @unique   // vd: "chu-ky-so"
  name        String
  hero        Json     // { title, description, bannerUrl }
  features    Json     // [{ title, description }]
  pricing     Json     // [{ planName, price, description }]
  faq         Json     // [{ question, answer }]
  updatedBy   String?  // email admin sửa gần nhất
  updatedAt   DateTime @updatedAt
  createdAt   DateTime @default(now())
}

model Lead {
  id           String   @id @default(cuid())
  fullName     String
  phone        String
  email        String?
  categorySlug String
  note         String?
  status       String   @default("new") // new | contacting | won | lost
  createdAt    DateTime @default(now())
}

model AdminUser {
  id           String   @id @default(cuid())
  email        String   @unique
  passwordHash String   // bcrypt, cost factor 10-12
  createdAt    DateTime @default(now())
}
```

### 4.2 Lưu ý thiết kế
- ● Dùng `slug` làm khóa nghiệp vụ cho `Category` (6 bản ghi cố định, seed sẵn khi khởi tạo hệ thống) để URL thân thiện SEO (vd: `/san-pham/chu-ky-so`).
- ● Các trường `hero/features/pricing/faq` lưu JSONB để linh hoạt chỉnh sửa qua Content Editor (mục 4.7 SRS) mà không cần migrate schema khi thêm/bớt field.
- ● Cân nhắc thêm bảng `LeadStatusHistory` nếu sau này cần audit log chi tiết việc đổi trạng thái lead (hiện tại SRS chỉ yêu cầu 1 trường `status` + `note`).

## 5. Xác thực & phân quyền

- ● **Cơ chế:** đăng nhập admin bằng email/password, xác thực qua Supabase Auth (khuyến nghị) hoặc tự triển khai JWT + bcrypt nếu không dùng Supabase.
- ● **Phiên đăng nhập:** JWT lưu trong HTTP-only cookie, thời hạn 8 giờ, refresh khi còn hoạt động.
- ● **Phân quyền:** giai đoạn 1 chỉ có 1 vai trò "Admin" (toàn quyền quản lý lead + nội dung); để ngỏ khả năng thêm vai trò "Sales" (chỉ xem/xử lý lead, không sửa nội dung) ở giai đoạn sau.
- ● **Bảo vệ API:** middleware kiểm tra JWT hợp lệ cho toàn bộ route dưới `/api/admin/*`; API `/api/leads` (POST) cho phép public gọi (form đăng ký) nhưng có rate-limit chống spam.

## 6. Thiết kế API

| Method | Endpoint | Mô tả | Xác thực |
|---|---|---|---|
| POST | `/api/leads` | Nhận dữ liệu form đăng ký tư vấn | Không (public, có rate-limit) |
| GET | `/api/admin/leads` | Lấy danh sách lead, hỗ trợ query `search`, `status`, `category`, `page` | JWT Admin |
| GET | `/api/admin/leads/:id` | Xem chi tiết 1 lead | JWT Admin |
| PATCH | `/api/admin/leads/:id` | Cập nhật trạng thái/ghi chú lead | JWT Admin |
| GET | `/api/categories/:slug` | Lấy nội dung 1 category (dùng khi build/revalidate) | Không |
| GET | `/api/admin/categories/:slug` | Lấy nội dung category để hiển thị form edit | JWT Admin |
| PUT | `/api/admin/categories/:slug` | Cập nhật nội dung category + trigger revalidate | JWT Admin |
| POST | `/api/auth/login` | Đăng nhập admin | Không |
| POST | `/api/auth/logout` | Đăng xuất admin | JWT Admin |

## 7. Luồng xử lý chính

### 7.1 Luồng gửi lead
1. Khách truy cập điền form trên trang category → client validate → gọi `POST /api/leads`.
2. API validate lại phía server → lưu vào bảng `Lead` → gửi thông báo (email/webhook) tới nhân viên phụ trách.
3. API trả kết quả → frontend hiển thị thông báo thành công/lỗi ngay trên form.
4. Client bắn sự kiện `Lead` tới Facebook Pixel và GTM sau khi submit thành công.

### 7.2 Luồng chỉnh sửa nội dung (Content Editor)
1. Admin chọn category cần sửa → gọi `GET /api/admin/categories/:slug` lấy nội dung hiện tại.
2. Admin chỉnh sửa trên form (mục 4.7 SRS) → xem trước (preview render tạm phía client, không cần lưu DB).
3. Admin bấm "Lưu và xuất bản" → gọi `PUT /api/admin/categories/:slug`.
4. API cập nhật bản ghi trong DB, ghi nhận `updatedBy`/`updatedAt`, sau đó gọi `revalidatePath` (Next.js ISR) cho trang category tương ứng để nội dung công khai được cập nhật ngay.

### 7.3 Luồng đăng nhập admin
1. Admin nhập email/password tại màn hình đăng nhập (mục 4.4 SRS) → gọi `POST /api/auth/login`.
2. API xác thực (Supabase Auth hoặc so khớp bcrypt hash) → trả JWT set trong HTTP-only cookie.
3. Các request sau tới `/api/admin/*` được middleware xác thực qua cookie này.

## 8. Cấu trúc thư mục dự án (đề xuất)
```
project-root/
├── app/
│   ├── (public)/
│   │   ├── page.tsx                # Trang chủ
│   │   └── san-pham/[slug]/page.tsx # Trang category (SSG/ISR)
│   ├── (admin)/
│   │   ├── login/page.tsx
│   │   ├── leads/page.tsx
│   │   ├── leads/[id]/page.tsx
│   │   └── content/[slug]/page.tsx  # Content Editor
│   └── api/
│       ├── leads/route.ts
│       ├── auth/login/route.ts
│       ├── admin/leads/route.ts
│       ├── admin/leads/[id]/route.ts
│       └── admin/categories/[slug]/route.ts
├── lib/
│   ├── prisma.ts
│   ├── auth.ts
│   └── validation.ts
├── components/
│   ├── landing/                    # Hero, Pricing, FAQ, LeadForm...
│   └── admin/                      # Table, ContentForm...
├── prisma/
│   └── schema.prisma
└── .env
```

## 9. Triển khai (Deployment)

- ● **Hosting:** Vercel, kết nối trực tiếp với Git repository, tự động deploy khi merge vào nhánh `main`.
- ● **Database:** Supabase hoặc Neon (Postgres serverless), dùng connection pooling (pgbouncer/Neon pooled connection) để tránh nghẽn khi API Routes chạy dạng serverless function.
- ● **Environment Variables:** `DATABASE_URL`, `JWT_SECRET` (hoặc `SUPABASE_URL`/`SUPABASE_ANON_KEY`), `GTM_ID`, `FB_PIXEL_ID`, biến cấu hình email/webhook thông báo lead.
- ● **CI/CD:** kiểm tra type-check (`tsc`) và lint trước khi deploy; chạy Prisma migration tự động khi deploy (hoặc thủ công qua `prisma migrate deploy`).

## 10. Ánh xạ Yêu cầu phi chức năng (SRS mục 3) sang giải pháp kỹ thuật

| Yêu cầu SRS | Giải pháp kỹ thuật |
|---|---|
| API phản hồi dưới 500ms | API Routes gọn nhẹ, Prisma query có index trên `Lead.status`, `Lead.categorySlug`, `Lead.createdAt` |
| Tải trang dưới 2 giây | SSG/ISR cho trang public, ảnh tối ưu qua `next/image` |
| Truy vấn DB dưới 200ms | Index cho các cột filter/sort thường dùng ở màn hình danh sách lead |
| JWT + phân quyền | Middleware xác thực cho toàn bộ `/api/admin/*` |
| HTTPS/TLS | Mặc định trên Vercel |
| Mật khẩu hash bcrypt | Áp dụng nếu không dùng Supabase Auth (Supabase tự quản lý hash) |
| CORS Policy | API chỉ chấp nhận request same-origin (không cần mở CORS vì frontend + API chung domain) |
| Uptime 99.5% | Vercel + Supabase/Neon đều có SLA uptime tương ứng ở gói trả phí |
| Backup & Recovery | Bật point-in-time recovery của Supabase/Neon, backup hàng ngày |

## 11. Phụ lục — Biến môi trường

| Biến | Mô tả |
|---|---|
| `DATABASE_URL` | Connection string PostgreSQL (pooled) |
| `DIRECT_URL` | Connection string trực tiếp (dùng cho Prisma migrate) |
| `JWT_SECRET` | Khóa ký JWT (nếu không dùng Supabase Auth) |
| `NEXT_PUBLIC_GTM_ID` | ID Google Tag Manager |
| `NEXT_PUBLIC_FB_PIXEL_ID` | ID Facebook Pixel |
| `LEAD_NOTIFY_WEBHOOK_URL` | Webhook/email service nhận thông báo lead mới |

{cần xác nhận: kênh thông báo lead cụ thể (email hay Slack/Zalo webhook) và có dùng Supabase Auth hay tự viết JWT — hai điểm này ảnh hưởng trực tiếp đến phần code xác thực và thông báo}
