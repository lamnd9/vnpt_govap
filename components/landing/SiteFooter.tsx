import Link from "next/link";

// Nội dung liên hệ/mạng xã hội cố định (thông tin doanh nghiệp, không phải nội dung
// category quản lý qua CMS) — theo mục 4.1 SRS.
export function SiteFooter() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-3">
        <div>
          <p className="text-lg font-bold text-blue-800">VNPT</p>
          <p className="mt-2 text-sm text-slate-600">
            Giải pháp số hóa cho cá nhân, hộ kinh doanh, doanh nghiệp và cơ quan nhà nước.
          </p>
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-900">Liên hệ</p>
          <ul className="mt-2 space-y-1 text-sm text-slate-600">
            <li>Hotline: 1800 1166</li>
            <li>Email: cskh@vnpt.com.vn</li>
            <li>Địa chỉ: 57 Huỳnh Thúc Kháng, Hà Nội</li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-900">Mạng xã hội</p>
          <ul className="mt-2 space-y-1 text-sm text-slate-600">
            <li>
              <a
                href="https://facebook.com/vnpt"
                target="_blank"
                rel="noreferrer"
                className="hover:text-blue-800"
              >
                Facebook
              </a>
            </li>
            <li>
              <a
                href="https://zalo.me/vnpt"
                target="_blank"
                rel="noreferrer"
                className="hover:text-blue-800"
              >
                Zalo OA
              </a>
            </li>
          </ul>
          <Link
            href="/chinh-sach-bao-mat"
            className="mt-3 inline-block text-sm text-slate-500 underline hover:text-blue-800"
          >
            Chính sách bảo mật
          </Link>
        </div>
      </div>
      <div className="border-t border-slate-200 py-4 text-center text-xs text-slate-400">
        © {new Date().getFullYear()} VNPT. Bản quyền thuộc Tập đoàn Bưu chính Viễn thông Việt Nam.
      </div>
    </footer>
  );
}
