import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { siteSettingsSchema } from "@/lib/validation";
import { getSiteSettings, SITE_SETTINGS_ID } from "@/lib/site-settings";

export async function GET() {
  const settings = await getSiteSettings();
  return NextResponse.json(settings);
}

export async function PUT(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Dữ liệu gửi lên không hợp lệ." }, { status: 400 });
  }

  const parsed = siteSettingsSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Dữ liệu không hợp lệ.", fieldErrors: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  // Danh tính admin do proxy.ts xác thực JWT gắn vào, không lấy trực tiếp từ input client.
  const adminEmail = request.headers.get("x-admin-email") ?? undefined;

  const settings = await prisma.siteSettings.upsert({
    where: { id: SITE_SETTINGS_ID },
    update: { ...parsed.data, updatedBy: adminEmail },
    create: { id: SITE_SETTINGS_ID, ...parsed.data, updatedBy: adminEmail },
  });

  // Email/SĐT/link liên hệ hiện diện ở header, footer, floating-contact của mọi trang public.
  revalidatePath("/", "layout");

  return NextResponse.json(settings);
}
