import type { Category } from "@prisma/client";
import { categoryContentSchema, type CategoryContentInput } from "@/lib/validation";

// Category.hero/features/pricing/faq lưu dạng Json (mục 4.1 TDD). Parse + validate lại
// khi đọc để trang public không bao giờ crash nếu dữ liệu JSON không đúng hình dạng mong đợi.
export function parseCategoryContent(category: Category): CategoryContentInput {
  const parsed = categoryContentSchema.safeParse({
    hero: category.hero,
    features: category.features,
    pricing: category.pricing,
    faq: category.faq,
  });

  if (parsed.success) {
    return parsed.data;
  }

  return {
    hero: { title: category.name, description: "", bannerUrl: "" },
    features: [],
    pricing: [],
    faq: [],
  };
}
