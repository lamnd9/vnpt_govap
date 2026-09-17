import type { ReactNode } from "react";
import Link from "next/link";
import { LogoutButton } from "@/components/admin/LogoutButton";

type AdminShellProps = {
  adminEmail: string;
  /** Category đầu tiên dùng làm điểm vào mặc định cho nav "Nội dung sản phẩm". */
  firstCategorySlug: string;
  children: ReactNode;
};

export function AdminShell({ adminEmail, firstCategorySlug, children }: AdminShellProps) {
  return (
    <div className="min-h-screen bg-slate-100">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-6">
            <span className="text-lg font-bold text-blue-800">VNPT Admin</span>
            <nav className="flex items-center gap-4 text-sm font-medium text-slate-600">
              <Link href="/leads" className="hover:text-blue-800">
                Lead
              </Link>
              <Link href={`/content/${firstCategorySlug}`} className="hover:text-blue-800">
                Nội dung sản phẩm
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4 text-sm text-slate-500">
            <span>{adminEmail}</span>
            <LogoutButton />
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">{children}</main>
    </div>
  );
}
