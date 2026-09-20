import Image from "next/image";
import Link from "next/link";
import { ProductMenu } from "@/components/landing/ProductMenu";
import { formatPhoneDisplay, phoneToTelHref } from "@/lib/phone";

type SiteHeaderProps = {
  categories: { slug: string; name: string }[];
  email: string;
  phone: string;
};

export function SiteHeader({ categories, email, phone }: SiteHeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/" className="flex items-center">
          <Image
            src="/images/vnpt-logo.webp"
            alt="VNPT"
            width={160}
            height={80}
            priority
            className="h-8 w-auto sm:h-10"
          />
        </Link>
        <nav className="flex items-center gap-2 text-sm font-medium text-slate-600 sm:gap-4">
          <ProductMenu categories={categories} />
          <a
            href={`mailto:${email}`}
            className="hidden items-center gap-1.5 font-bold text-blue-800 hover:text-blue-900 md:flex"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-4 w-4">
              <path d="M2 6a2 2 0 012-2h16a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V6zm2 0l8 6 8-6H4zm16 2.24-8 6-8-6V18h16V8.24z" />
            </svg>
            {email}
          </a>
          <a
            href={phoneToTelHref(phone)}
            className="flex items-center gap-1.5 font-bold text-blue-800 hover:text-blue-900"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-4 w-4">
              <path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.02-.24c1.12.37 2.33.57 3.57.57a1 1 0 011 1V20a1 1 0 01-1 1C10.61 21 3 13.39 3 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.24.2 2.45.57 3.57a1 1 0 01-.25 1.02l-2.2 2.2z" />
            </svg>
            {formatPhoneDisplay(phone)}
          </a>
        </nav>
      </div>
    </header>
  );
}
