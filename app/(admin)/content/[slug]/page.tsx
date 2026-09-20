import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { ContentEditor } from "@/components/admin/ContentEditor";

export const metadata: Metadata = {
  title: "Chỉnh sửa nội dung sản phẩm",
};

export default async function AdminContentEditorPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const categories = await prisma.category.findMany({
    select: { slug: true, name: true },
    orderBy: { createdAt: "asc" },
  });

  return <ContentEditor slug={slug} categories={categories} />;
}
