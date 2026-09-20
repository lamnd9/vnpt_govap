import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { LeadsTable } from "@/components/admin/LeadsTable";

export const metadata: Metadata = {
  title: "Danh sách lead",
};

export default async function AdminLeadsPage() {
  const categories = await prisma.category.findMany({
    select: { slug: true, name: true },
    orderBy: { createdAt: "asc" },
  });

  return <LeadsTable categories={categories} />;
}
