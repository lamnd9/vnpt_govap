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
const HERO_ILLUSTRATIONS: Record<string, string> = {
  "chu-ky-so": "/images/categories/chu-ky-so/illustration.webp",
};

// Riêng trang chữ ký số chỉ cần Bảng giá — ẩn Tính năng nổi bật + Câu hỏi thường gặp.
const PRICING_ONLY_SLUGS = new Set(["chu-ky-so"]);

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

  return (
    <>
      <Hero
        title={content.hero.title}
        description={content.hero.description}
        bannerUrl={content.hero.bannerUrl}
        illustrationUrl={HERO_ILLUSTRATIONS[category.slug]}
      />
      {pricingOnly ? null : <FeatureList features={content.features} />}
      <PricingTable
        pricing={content.pricing}
        layout={pricingOnly ? "table" : "cards"}
        title={pricingOnly ? content.hero.title.toUpperCase() : undefined}
      />
      {pricingOnly ? null : <FaqAccordion faq={content.faq} />}
      <LeadForm categories={categories} defaultCategorySlug={category.slug} />
    </>
  );
}
