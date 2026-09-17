import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { parseCategoryContent } from "@/lib/category-content";
import { Hero } from "@/components/landing/Hero";
import { CategoryCard } from "@/components/landing/CategoryCard";

// ISR: nội dung lấy từ DB tại build/revalidate, không query mỗi lần truy cập (mục 2.2 TDD).
// Admin lưu nội dung sẽ trigger revalidatePath ngay lập tức (mục 7.2 TDD); đây là fallback định kỳ.
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Trang chủ",
  description:
    "VNPT cung cấp giải pháp số: chữ ký số, hóa đơn điện tử, phần mềm doanh nghiệp, hộ kinh doanh, chính quyền và trường học.",
};

export default async function HomePage() {
  const categories = await prisma.category.findMany({ orderBy: { createdAt: "asc" } });

  return (
    <>
      <Hero
        title="Chuyển đổi số cùng VNPT"
        description="Giải pháp số toàn diện cho cá nhân, hộ kinh doanh, doanh nghiệp, cơ quan nhà nước và trường học."
        bannerUrl="/images/hero-home.svg"
        ctaLabel="Xem sản phẩm"
        ctaHref="#san-pham"
      />

      <section id="san-pham" className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">Sản phẩm &amp; dịch vụ</h2>
        <p className="mt-2 text-slate-600">
          6 nhóm giải pháp số của VNPT dành cho từng nhu cầu cụ thể.
        </p>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => {
            const content = parseCategoryContent(category);
            return (
              <CategoryCard
                key={category.slug}
                slug={category.slug}
                name={category.name}
                description={content.hero.description}
                bannerUrl={content.hero.bannerUrl}
              />
            );
          })}
        </div>
      </section>
    </>
  );
}
