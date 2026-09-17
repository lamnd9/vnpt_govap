import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const ADMIN_COOKIE_NAME = "vnpt_admin_token";
// Phiên đăng nhập 8 giờ theo mục 5 TDD.
export const ADMIN_COOKIE_MAX_AGE_SECONDS = 8 * 60 * 60;

export type AdminJwtPayload = {
  sub: string;
  email: string;
};

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET chưa được cấu hình.");
  }
  return secret;
}

export function signAdminToken(payload: AdminJwtPayload): string {
  return jwt.sign(payload, getJwtSecret(), {
    expiresIn: ADMIN_COOKIE_MAX_AGE_SECONDS,
  });
}

export function verifyAdminToken(token: string): AdminJwtPayload | null {
  try {
    const decoded = jwt.verify(token, getJwtSecret());
    if (typeof decoded === "string" || !decoded.sub || !decoded.email) {
      return null;
    }
    return { sub: String(decoded.sub), email: String(decoded.email) };
  } catch {
    return null;
  }
}

// Dùng trong Server Component của các trang /leads, /leads/:id, /content/:slug —
// điều hướng về /login nếu chưa đăng nhập hoặc phiên đã hết hạn.
export async function requireAdminSession(): Promise<AdminJwtPayload> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  const payload = token ? verifyAdminToken(token) : null;

  if (!payload) {
    redirect("/login");
  }

  return payload;
}
