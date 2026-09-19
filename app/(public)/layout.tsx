import type { ReactNode } from "react";
import { prisma } from "@/lib/prisma";
import { SiteHeader } from "@/components/landing/SiteHeader";
import { SiteFooter } from "@/components/landing/SiteFooter";
import { FloatingContact } from "@/components/landing/FloatingContact";
import {
  GoogleTagManagerNoscript,
  GoogleTagManagerScript,
} from "@/components/landing/GoogleTagManager";
import { FacebookPixelScript } from "@/components/landing/FacebookPixel";

export default async function PublicLayout({ children }: { children: ReactNode }) {
  const categories = await prisma.category.findMany({
    select: { slug: true, name: true },
    orderBy: { createdAt: "asc" },
  });

  return (
    <>
      <GoogleTagManagerScript />
      <FacebookPixelScript />
      <GoogleTagManagerNoscript />
      <SiteHeader categories={categories} />
      <main className="flex-1">{children}</main>
      <SiteFooter />
      <FloatingContact />
    </>
  );
}
