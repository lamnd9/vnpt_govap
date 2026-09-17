import type { Metadata } from "next";
import { requireAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AdminShell } from "@/components/admin/AdminShell";
import { LeadsTable } from "@/components/admin/LeadsTable";

export const metadata: Metadata = {
  title: "Danh sách lead",
};

export default async function AdminLeadsPage() {
  const admin = await requireAdminSession();
  const categories = await prisma.category.findMany({
    select: { slug: true, name: true },
    orderBy: { createdAt: "asc" },
  });

  return (
    <AdminShell adminEmail={admin.email} firstCategorySlug={categories[0]?.slug ?? ""}>
      <LeadsTable categories={categories} />
    </AdminShell>
  );
}
