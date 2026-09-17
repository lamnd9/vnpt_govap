import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { loginInputSchema } from "@/lib/validation";
import { ADMIN_COOKIE_MAX_AGE_SECONDS, ADMIN_COOKIE_NAME, signAdminToken } from "@/lib/auth";

// Hash bcrypt giả (không ứng với mật khẩu thật nào), dùng để so sánh khi email không tồn
// tại — tránh timing attack lộ thông tin email nào có tài khoản (bcrypt.compare luôn tốn
// cùng thời gian dù email tồn tại hay không).
const DUMMY_PASSWORD_HASH = "$2b$12$1bMa5b.Si668EwzUvksZZe.r3GoJLphZ4IfbdukmScqMnhTEaRcD2";

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Dữ liệu gửi lên không hợp lệ." }, { status: 400 });
  }

  const parsed = loginInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Email hoặc mật khẩu không đúng." }, { status: 401 });
  }

  const { email, password } = parsed.data;
  const admin = await prisma.adminUser.findUnique({ where: { email } });

  // Luôn gọi bcrypt.compare (kể cả khi email không tồn tại) để thời gian phản hồi không
  // khác biệt giữa 2 trường hợp — tránh timing attack dò email nào có tài khoản.
  const passwordMatches = await bcrypt.compare(password, admin?.passwordHash ?? DUMMY_PASSWORD_HASH);

  if (!admin || !passwordMatches) {
    return NextResponse.json({ error: "Email hoặc mật khẩu không đúng." }, { status: 401 });
  }

  const token = signAdminToken({ sub: admin.id, email: admin.email });

  const response = NextResponse.json({ email: admin.email });
  response.cookies.set(ADMIN_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: ADMIN_COOKIE_MAX_AGE_SECONDS,
  });
  return response;
}
