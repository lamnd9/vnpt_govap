import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { categoryUpdateSchema } from "@/lib/validation";
import { getCategoryViewModel } from "@/lib/category-content";
import { isArticleEmpty, sanitizeArticleHtml } from "@/lib/sanitize-html";

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
  const content = getCategoryViewModel(category);

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

  const parsed = categoryUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Dữ liệu không hợp lệ.", fieldErrors: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  // Danh tính admin do proxy.ts xác thực JWT gắn vào, không lấy trực tiếp từ input client.
  const adminEmail = request.headers.get("x-admin-email") ?? undefined;

  // Sanitize HTML từ rich text editor trước khi lưu (render thẳng bằng dangerouslySetInnerHTML
  // ở trang public) — "<p></p>" (editor trống) hoặc chỉ có tag không chữ đều coi là null.
  const article =
    parsed.data.article !== null && !isArticleEmpty(parsed.data.article)
      ? sanitizeArticleHtml(parsed.data.article)
      : null;

  try {
    const category = await prisma.category.update({
      where: { slug },
      data: {
        ...parsed.data,
        article,
        // Cột Json nullable: Prisma cần sentinel Prisma.JsonNull thay vì JS null để thực sự
        // ghi giá trị null (JS null bị hiểu là "field không xuất hiện trong payload").
        pricingColumns: parsed.data.pricingColumns ?? Prisma.JsonNull,
        updatedBy: adminEmail,
      },
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
