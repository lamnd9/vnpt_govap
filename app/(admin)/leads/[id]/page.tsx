import type { Metadata } from "next";
import { requireAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AdminShell } from "@/components/admin/AdminShell";
import { LeadDetail } from "@/components/admin/LeadDetail";

export const metadata: Metadata = {
  title: "Chi tiết lead",
};

export default async function AdminLeadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const admin = await requireAdminSession();
  const { id } = await params;
  const categories = await prisma.category.findMany({
    select: { slug: true, name: true },
    orderBy: { createdAt: "asc" },
  });

  return (
    <AdminShell adminEmail={admin.email} firstCategorySlug={categories[0]?.slug ?? ""}>
      <LeadDetail leadId={id} categories={categories} />
    </AdminShell>
  );
}
