import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_COOKIE_NAME, verifyAdminToken } from "@/lib/auth";
import { LoginForm } from "@/components/admin/LoginForm";

export const metadata: Metadata = {
  title: "Đăng nhập quản trị",
};

export default async function AdminLoginPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;

  if (token && verifyAdminToken(token)) {
    redirect("/leads");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <LoginForm />
    </div>
  );
}
