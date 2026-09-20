import Link from "next/link";
import { formatPhoneDisplay } from "@/lib/phone";

type SiteFooterProps = {
  phone: string;
  email: string;
};

// Mạng xã hội vẫn cố định (kênh công khai, khác khái niệm với link chat 1:1 ở FloatingContact)
// — chỉ phone/email lấy từ Cấu hình chung để đồng bộ với header/floating-contact.
export function SiteFooter({ phone, email }: SiteFooterProps) {
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
            <li>Hotline: {formatPhoneDisplay(phone)}</li>
            <li>Email: {email}</li>
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
