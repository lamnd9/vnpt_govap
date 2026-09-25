import type { Metadata } from "next";
import { cache } from "react";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCategoryViewModel } from "@/lib/category-content";
import { Hero } from "@/components/landing/Hero";
import { PricingTable } from "@/components/landing/PricingTable";
import { LeadForm } from "@/components/landing/LeadForm";

export const revalidate = 3600;

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

  const content = getCategoryViewModel(category);
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

  const content = getCategoryViewModel(category);
  const tablePricing = content.pricingLayout === "table";

  return (
    <>
      <Hero
        title={content.hero.title}
        description={content.hero.description}
        bannerUrl={content.hero.bannerUrl}
        illustrationUrl={content.illustrationUrl ?? undefined}
      />
      <PricingTable
        pricing={content.pricing}
        layout={content.pricingLayout}
        title={tablePricing ? content.hero.title.toUpperCase() : undefined}
        columns={content.pricingColumns ?? undefined}
      />
      <LeadForm categories={categories} defaultCategorySlug={category.slug} />
    </>
  );
}
