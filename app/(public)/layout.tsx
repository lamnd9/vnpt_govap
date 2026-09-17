import type { ReactNode } from "react";
import { SiteHeader } from "@/components/landing/SiteHeader";
import { SiteFooter } from "@/components/landing/SiteFooter";
import {
  GoogleTagManagerNoscript,
  GoogleTagManagerScript,
} from "@/components/landing/GoogleTagManager";
import { FacebookPixelScript } from "@/components/landing/FacebookPixel";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <GoogleTagManagerScript />
      <FacebookPixelScript />
      <GoogleTagManagerNoscript />
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </>
  );
}
