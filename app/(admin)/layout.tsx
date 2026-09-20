import type { ReactNode } from "react";
import { requireAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AdminSidebarShell } from "@/components/admin/AdminSidebarShell";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const admin = await requireAdminSession();
  const categories = await prisma.category.findMany({
    select: { slug: true, name: true },
    orderBy: { createdAt: "asc" },
  });

  return (
    <AdminSidebarShell adminEmail={admin.email} categories={categories}>
      {children}
    </AdminSidebarShell>
  );
}
