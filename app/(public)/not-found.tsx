import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-24 text-center sm:px-6">
      <p className="text-sm font-semibold text-blue-800">404</p>
      <h1 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">
        Không tìm thấy trang
      </h1>
      <p className="mt-3 text-slate-600">
        Trang bạn tìm không tồn tại hoặc đã được di chuyển.
      </p>
      <Link
        href="/"
        className="mt-6 rounded-full bg-blue-800 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-900"
      >
        Về trang chủ
      </Link>
    </div>
  );
}
