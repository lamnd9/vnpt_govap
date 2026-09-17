import type { Metadata } from "next";
import { requireAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AdminShell } from "@/components/admin/AdminShell";
import { ContentEditor } from "@/components/admin/ContentEditor";

export const metadata: Metadata = {
  title: "Chỉnh sửa nội dung sản phẩm",
};

export default async function AdminContentEditorPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const admin = await requireAdminSession();
  const { slug } = await params;
  const categories = await prisma.category.findMany({
    select: { slug: true, name: true },
    orderBy: { createdAt: "asc" },
  });

  return (
    <AdminShell adminEmail={admin.email} firstCategorySlug={categories[0]?.slug ?? ""}>
      <ContentEditor slug={slug} categories={categories} />
    </AdminShell>
  );
}
