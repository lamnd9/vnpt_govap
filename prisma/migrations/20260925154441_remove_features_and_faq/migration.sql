-- Bỏ khái niệm "Tính năng nổi bật" và "Câu hỏi thường gặp" khỏi Category — không còn admin
-- UI nào chỉnh sửa hay bật/tắt 2 mục này nữa (đã xoá khỏi ContentEditor), nên xoá luôn cột
-- thay vì để dữ liệu chết không ai đọc/ghi.
ALTER TABLE "Category" DROP COLUMN "faq";
ALTER TABLE "Category" DROP COLUMN "features";
ALTER TABLE "Category" DROP COLUMN "showFaq";
ALTER TABLE "Category" DROP COLUMN "showFeatures";
