import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

// Lưu ảnh trực tiếp vào public/uploads/articles — đơn giản, không cần dịch vụ lưu trữ
// ngoài, nhưng KHÔNG bền vững trên nền tảng serverless (ổ đĩa tạm thời, mất ảnh sau mỗi lần
// deploy). Phù hợp khi chạy trên server/VPS riêng như dự án đang dùng.
const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads", "articles");
const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Thiếu file ảnh." }, { status: 400 });
  }

  const ext = ALLOWED_TYPES[file.type];
  if (!ext) {
    return NextResponse.json(
      { error: "Chỉ hỗ trợ ảnh JPEG, PNG, WebP, GIF." },
      { status: 400 },
    );
  }

  if (file.size > MAX_SIZE_BYTES) {
    return NextResponse.json({ error: "Ảnh không được vượt quá 5MB." }, { status: 400 });
  }

  // Tên file luôn tự sinh (không dùng tên client gửi lên) — tránh path traversal / ghi đè.
  const filename = `${randomUUID()}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  await mkdir(UPLOAD_DIR, { recursive: true });
  await writeFile(path.join(UPLOAD_DIR, filename), buffer);

  return NextResponse.json({ url: `/uploads/articles/${filename}` });
}
