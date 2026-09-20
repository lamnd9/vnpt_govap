import type { Metadata } from "next";
import { cache } from "react";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { parseCategoryContent } from "@/lib/category-content";
import { Hero } from "@/components/landing/Hero";
import { FeatureList } from "@/components/landing/FeatureList";
import { PricingTable } from "@/components/landing/PricingTable";
import { FaqAccordion } from "@/components/landing/FaqAccordion";
import { LeadForm } from "@/components/landing/LeadForm";

export const revalidate = 3600;

// Ảnh minh hoạ trang trí riêng cho hero — không thuộc nội dung CMS (Category.hero),
// nên khai báo tĩnh tại đây thay vì thêm field mới vào schema Json chỉ cho mục đích thẩm mỹ.
// width/height là kích thước thật của file ảnh, dùng để Next/Image giữ đúng tỉ lệ.
const HERO_ILLUSTRATIONS: Record<string, { src: string; width: number; height: number }> = {
  "chu-ky-so": {
    src: "/images/categories/chu-ky-so/illustration.webp",
    width: 513,
    height: 456,
  },
  "hoa-don-dien-tu": {
    src: "/images/categories/hoa-don-dien-tu/illustration.webp",
    width: 1873,
    height: 1057,
  },
  "phan-mem-cho-doanh-nghiep": {
    src: "/images/categories/phan-mem-cho-doanh-nghiep/illustration.svg",
    width: 400,
    height: 400,
  },
  "phan-mem-cho-ho-kinh-doanh": {
    src: "/images/categories/phan-mem-cho-ho-kinh-doanh/illustration.svg",
    width: 400,
    height: 400,
  },
  "giai-phap-cho-khoi-chinh-quyen": {
    src: "/images/categories/giai-phap-cho-khoi-chinh-quyen/illustration.svg",
    width: 400,
    height: 400,
  },
  "giai-phap-cho-truong-hoc": {
    src: "/images/categories/giai-phap-cho-truong-hoc/illustration.svg",
    width: 400,
    height: 400,
  },
};

// Các trang này chỉ cần Bảng giá — ẩn Tính năng nổi bật + Câu hỏi thường gặp.
const PRICING_ONLY_SLUGS = new Set([
  "chu-ky-so",
  "hoa-don-dien-tu",
  "phan-mem-cho-doanh-nghiep",
  "phan-mem-cho-ho-kinh-doanh",
  "giai-phap-cho-khoi-chinh-quyen",
  "giai-phap-cho-truong-hoc",
]);

// Các category hiển thị bảng giá dạng bảng (thay vì lưới thẻ mặc định), kèm nhãn cột riêng
// khi khác với mặc định ("Gói dịch vụ" / "Thời hạn đăng ký" / "Tổng gói cước (VND)").
const TABLE_PRICING_SLUGS = new Set([
  "chu-ky-so",
  "hoa-don-dien-tu",
  "phan-mem-cho-doanh-nghiep",
  "phan-mem-cho-ho-kinh-doanh",
  "giai-phap-cho-khoi-chinh-quyen",
  "giai-phap-cho-truong-hoc",
]);
const PRICING_TABLE_COLUMNS: Record<string, { plan: string; middle: string; price: string }> = {
  "hoa-don-dien-tu": {
    plan: "Tên gói cước",
    middle: "Số lượng hóa đơn",
    price: "Đơn giá(VND)",
  },
};

// cache() dedupe lời gọi trong cùng 1 request — generateMetadata và trang đều cần category
// này nên chỉ nên query Prisma 1 lần thay vì 2 (Prisma không tự dedupe như fetch()).
const getCategoryBySlug = cache((slug: string) => prisma.category.findUnique({ where: { slug } }));

export async function generateStaticParams() {
  const categories = await prisma.category.findMany({ select: { slug: true } });
  return categories.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) return {};

  const content = parseCategoryContent(category);
  return {
    title: content.hero.title,
    description: content.hero.description,
    openGraph: {
      title: content.hero.title,
      description: content.hero.description,
      images: content.hero.bannerUrl ? [{ url: content.hero.bannerUrl }] : undefined,
    },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [category, categories] = await Promise.all([
    getCategoryBySlug(slug),
    prisma.category.findMany({
      select: { slug: true, name: true },
      orderBy: { createdAt: "asc" },
    }),
  ]);

  if (!category) {
    notFound();
  }

  const content = parseCategoryContent(category);
  const pricingOnly = PRICING_ONLY_SLUGS.has(category.slug);
  const tablePricing = TABLE_PRICING_SLUGS.has(category.slug);
  const illustration = HERO_ILLUSTRATIONS[category.slug];

  return (
    <>
      <Hero
        title={content.hero.title}
        description={content.hero.description}
        bannerUrl={content.hero.bannerUrl}
        illustrationUrl={illustration?.src}
        illustrationWidth={illustration?.width}
        illustrationHeight={illustration?.height}
      />
      {pricingOnly ? null : <FeatureList features={content.features} />}
      <PricingTable
        pricing={content.pricing}
        layout={tablePricing ? "table" : "cards"}
        title={tablePricing ? content.hero.title.toUpperCase() : undefined}
        columns={PRICING_TABLE_COLUMNS[category.slug]}
      />
      {pricingOnly ? null : <FaqAccordion faq={content.faq} />}
      <LeadForm categories={categories} defaultCategorySlug={category.slug} />
    </>
  );
}
