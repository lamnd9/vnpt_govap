"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

type NavItem = {
  href: string;
  label: string;
  icon: ReactNode;
};

const LEADS_ICON = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-5 w-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h8M8 14h5M21 12c0 4.418-4.03 8-9 8-1.06 0-2.077-.16-3.02-.457L3 21l1.5-4.006C3.55 15.62 3 13.87 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
  </svg>
);

const SETTINGS_ICON = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-5 w-5">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
    />
    <circle cx="12" cy="12" r="3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const PRODUCT_ICON = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-5 w-5">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M20 7 12 3 4 7m16 0-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
    />
  </svg>
);

export function AdminSidebarNav({ categories }: { categories: { slug: string; name: string }[] }) {
  const pathname = usePathname();

  const topItems: NavItem[] = [
    { href: "/leads", label: "Danh sách tư vấn", icon: LEADS_ICON },
    { href: "/settings", label: "Cấu hình chung", icon: SETTINGS_ICON },
  ];

  const productItems: NavItem[] = categories.map((category) => ({
    href: `/content/${category.slug}`,
    label: category.name,
    icon: PRODUCT_ICON,
  }));

  function renderItem(item: NavItem) {
    const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
    return (
      <Link
        key={item.href}
        href={item.href}
        className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${
          active ? "bg-blue-50 text-blue-800" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
        }`}
      >
        {item.icon}
        {item.label}
      </Link>
    );
  }

  return (
    <nav className="flex flex-1 flex-col gap-6 overflow-y-auto p-4">
      <div className="space-y-1">{topItems.map(renderItem)}</div>
      <div>
        <p className="px-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
          Sản phẩm &amp; dịch vụ
        </p>
        <div className="mt-2 space-y-1">{productItems.map(renderItem)}</div>
      </div>
    </nav>
  );
}
