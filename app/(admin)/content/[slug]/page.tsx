import type { Metadata } from "next";
import { ContentEditor } from "@/components/admin/ContentEditor";

export const metadata: Metadata = {
  title: "Chỉnh sửa nội dung sản phẩm",
};

export default async function AdminContentEditorPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return <ContentEditor slug={slug} />;
}
