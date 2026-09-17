import { NextResponse, after } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { leadInputSchema } from "@/lib/validation";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { notifyZaloNewLead } from "@/lib/notify-zalo";

// Chống spam form đăng ký tư vấn (mục 5 TDD): tối đa 5 lần gửi / phút / IP.
const RATE_LIMIT = 5;
const RATE_LIMIT_WINDOW_MS = 60_000;

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const rate = checkRateLimit(`leads:${ip}`, RATE_LIMIT, RATE_LIMIT_WINDOW_MS);
  if (!rate.allowed) {
    return NextResponse.json(
      { error: "Bạn gửi yêu cầu quá nhanh, vui lòng thử lại sau." },
      {
        status: 429,
        headers: rate.retryAfterSeconds
          ? { "Retry-After": String(rate.retryAfterSeconds) }
          : undefined,
      },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Dữ liệu gửi lên không hợp lệ." }, { status: 400 });
  }

  const parsed = leadInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Dữ liệu không hợp lệ.", fieldErrors: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const { fullName, phone, email, categorySlug, note } = parsed.data;

  const category = await prisma.category.findUnique({
    where: { slug: categorySlug },
    select: { slug: true },
  });
  if (!category) {
    return NextResponse.json({ error: "Sản phẩm quan tâm không hợp lệ." }, { status: 400 });
  }

  const lead = await prisma.lead.create({
    data: { fullName, phone, email, categorySlug, note },
  });

  // Chạy sau khi đã trả response cho client (mục 3.1 SRS: API phải phản hồi dưới 500ms) —
  // không chờ webhook Zalo (có thể chậm/timeout tới 5s) mới trả kết quả submit form.
  after(() => notifyZaloNewLead(lead));

  return NextResponse.json({ id: lead.id }, { status: 201 });
}
