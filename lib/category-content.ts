import type { Category } from "@prisma/client";
import { z } from "zod";
import {
  categoryContentSchema,
  type CategoryContentInput,
  type CategoryDisplayConfig,
  PRICING_LAYOUTS,
} from "@/lib/validation";

// Category.hero/pricing lưu dạng Json (mục 4.1 TDD). Parse + validate lại khi đọc để trang
// public không bao giờ crash nếu dữ liệu JSON không đúng hình dạng mong đợi.
export function parseCategoryContent(category: Category): CategoryContentInput {
  const parsed = categoryContentSchema.safeParse({
    hero: category.hero,
    pricing: category.pricing,
  });

  if (parsed.success) {
    return parsed.data;
  }

  return {
    hero: { title: category.name, description: "", bannerUrl: "" },
    pricing: [],
  };
}

// illustrationUrl/pricingLayout là cột đã typed sẵn trong DB nên không cần fallback như
// parseCategoryContent — chỉ pricingColumns là Json tự do cần validate lại.
export function getCategoryDisplayConfig(category: Category): CategoryDisplayConfig {
  const parsedColumns = category.pricingColumns
    ? z
        .object({ plan: z.string().min(1), middle: z.string().min(1), price: z.string().min(1) })
        .safeParse(category.pricingColumns)
    : null;

  return {
    illustrationUrl: category.illustrationUrl,
    pricingLayout: PRICING_LAYOUTS.includes(category.pricingLayout as never)
      ? (category.pricingLayout as CategoryDisplayConfig["pricingLayout"])
      : "cards",
    pricingColumns: parsedColumns?.success ? parsedColumns.data : null,
    article: category.article,
  };
}

export function getCategoryViewModel(category: Category): CategoryContentInput & CategoryDisplayConfig {
  return { ...parseCategoryContent(category), ...getCategoryDisplayConfig(category) };
}
