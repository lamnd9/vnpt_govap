import Image from "next/image";
import Link from "next/link";

type SiteHeaderProps = {
  categories: { slug: string; name: string }[];
};

export function SiteHeader({ categories }: SiteHeaderProps) {
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
          <details className="group relative">
            <summary className="flex cursor-pointer list-none items-center gap-1 rounded px-2 py-1 hover:text-blue-800 [&::-webkit-details-marker]:hidden">
              Sản phẩm &amp; dịch vụ
              <svg
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
                className="h-4 w-4 transition group-open:rotate-180"
              >
                <path
                  fillRule="evenodd"
                  d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                  clipRule="evenodd"
                />
              </svg>
            </summary>
            <div className="absolute left-0 top-full z-50 mt-2 w-64 rounded-lg border border-slate-200 bg-white p-2 shadow-lg">
              {categories.map((category) => (
                <Link
                  key={category.slug}
                  href={`/san-pham/${category.slug}`}
                  className="block rounded-md px-3 py-2 text-slate-700 hover:bg-slate-50 hover:text-blue-800"
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </details>
          <a
            href="mailto:toannm.hcm@vnpt.vn"
            className="hidden items-center gap-1.5 font-bold text-blue-800 hover:text-blue-900 md:flex"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-4 w-4">
              <path d="M2 6a2 2 0 012-2h16a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V6zm2 0l8 6 8-6H4zm16 2.24-8 6-8-6V18h16V8.24z" />
            </svg>
            toannm.hcm@vnpt.vn
          </a>
          <a
            href="tel:0941048085"
            className="flex items-center gap-1.5 font-bold text-blue-800 hover:text-blue-900"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-4 w-4">
              <path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.02-.24c1.12.37 2.33.57 3.57.57a1 1 0 011 1V20a1 1 0 01-1 1C10.61 21 3 13.39 3 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.24.2 2.45.57 3.57a1 1 0 01-.25 1.02l-2.2 2.2z" />
            </svg>
            0941.048.085
          </a>
        </nav>
      </div>
    </header>
  );
}
