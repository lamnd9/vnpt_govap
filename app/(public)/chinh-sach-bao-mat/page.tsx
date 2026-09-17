import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chính sách bảo mật",
  description: "Chính sách bảo mật thông tin khách hàng của VNPT.",
};

export default function PrivacyPolicyPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-bold text-slate-900">Chính sách bảo mật</h1>
      <div className="mt-6 space-y-4 text-sm leading-relaxed text-slate-600">
        <p>
          VNPT cam kết bảo mật thông tin cá nhân khách hàng cung cấp qua các biểu mẫu đăng ký
          tư vấn trên website này. Thông tin chỉ được sử dụng để liên hệ tư vấn sản phẩm, dịch
          vụ và không chia sẻ cho bên thứ ba ngoài mục đích nêu trên.
        </p>
        <p>
          Nếu có thắc mắc về chính sách bảo mật, vui lòng liên hệ hotline 1800 1166 hoặc email
          cskh@vnpt.com.vn.
        </p>
      </div>
    </article>
  );
}
