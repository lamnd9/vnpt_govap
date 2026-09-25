-- Thêm địa chỉ vào Cấu hình chung — trước đây hardcode trong SiteFooter.tsx.
-- DEFAULT tạm cho row "main" đã tồn tại; seed.ts sẽ ghi lại giá trị thật ngay sau migration.
ALTER TABLE "SiteSettings" ADD COLUMN "address" TEXT NOT NULL DEFAULT '57 Huỳnh Thúc Kháng, Hà Nội';
