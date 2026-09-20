import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { LeadDetail } from "@/components/admin/LeadDetail";

export const metadata: Metadata = {
  title: "Chi tiết lead",
};

export default async function AdminLeadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const categories = await prisma.category.findMany({
    select: { slug: true, name: true },
    orderBy: { createdAt: "asc" },
  });

  return <LeadDetail leadId={id} categories={categories} />;
}
