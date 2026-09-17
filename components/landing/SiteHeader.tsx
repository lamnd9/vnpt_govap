import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/" className="text-lg font-bold tracking-tight text-blue-800">
          VNPT<span className="text-orange-500">.</span>
        </Link>
        <nav className="flex items-center gap-4 text-sm font-medium text-slate-600">
          <Link href="/#san-pham" className="hidden hover:text-blue-800 sm:inline">
            Sản phẩm &amp; dịch vụ
          </Link>
          <Link
            href="/#san-pham"
            className="rounded-full bg-blue-800 px-4 py-2 text-white transition hover:bg-blue-900"
          >
            Đăng ký tư vấn
          </Link>
        </nav>
      </div>
    </header>
  );
}
