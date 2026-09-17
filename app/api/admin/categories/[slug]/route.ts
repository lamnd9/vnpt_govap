import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { categoryContentSchema } from "@/lib/validation";
import { parseCategoryContent } from "@/lib/category-content";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const category = await prisma.category.findUnique({ where: { slug } });

  if (!category) {
    return NextResponse.json({ error: "Không tìm thấy category." }, { status: 404 });
  }

  // Validate lại hình dạng JSON giống hệt route public — tránh Content Editor crash nếu
  // dữ liệu trong DB từng bị chỉnh tay/không đúng chuẩn.
  const content = parseCategoryContent(category);

  return NextResponse.json({
    id: category.id,
    slug: category.slug,
    name: category.name,
    updatedBy: category.updatedBy,
    updatedAt: category.updatedAt,
    ...content,
  });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Dữ liệu gửi lên không hợp lệ." }, { status: 400 });
  }

  const parsed = categoryContentSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Dữ liệu không hợp lệ.", fieldErrors: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  // Danh tính admin do proxy.ts xác thực JWT gắn vào, không lấy trực tiếp từ input client.
  const adminEmail = request.headers.get("x-admin-email") ?? undefined;

  try {
    const category = await prisma.category.update({
      where: { slug },
      data: { ...parsed.data, updatedBy: adminEmail },
    });

    // Trigger ISR revalidate để trang public cập nhật ngay sau khi lưu (mục 7.2 TDD).
    revalidatePath(`/san-pham/${slug}`);
    revalidatePath("/");

    return NextResponse.json(category);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      return NextResponse.json({ error: "Không tìm thấy category." }, { status: 404 });
    }
    throw error;
  }
}
