import type { ReactNode } from "react";
import Image from "next/image";
import { AdminSidebarNav } from "@/components/admin/AdminSidebarNav";
import { LogoutButton } from "@/components/admin/LogoutButton";

type AdminSidebarShellProps = {
  adminEmail: string;
  categories: { slug: string; name: string }[];
  children: ReactNode;
};

export function AdminSidebarShell({ adminEmail, categories, children }: AdminSidebarShellProps) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <aside className="flex w-64 shrink-0 flex-col border-r border-slate-200 bg-white">
        <div className="flex items-center gap-2 border-b border-slate-200 px-4 py-4">
          <Image src="/images/vnpt-logo.webp" alt="VNPT" width={160} height={80} className="h-7 w-auto" />
          <span className="text-sm font-bold text-slate-900">Admin</span>
        </div>
        <AdminSidebarNav categories={categories} />
      </aside>
      <div className="flex flex-1 flex-col">
        <header className="flex items-center justify-end gap-4 border-b border-slate-200 bg-white px-6 py-3">
          <span className="text-sm text-slate-500">{adminEmail}</span>
          <LogoutButton />
        </header>
        <main className="flex-1 px-6 py-8">{children}</main>
      </div>
    </div>
  );
}
