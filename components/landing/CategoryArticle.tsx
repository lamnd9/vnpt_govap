// HTML đã được sanitize (DOMPurify) trước khi lưu ở app/api/admin/categories/[slug]/route.ts —
// an toàn để render thẳng bằng dangerouslySetInnerHTML.
export function CategoryArticle({ html }: { html: string }) {
  return (
    <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <div className="prose prose-slate max-w-none" dangerouslySetInnerHTML={{ __html: html }} />
    </section>
  );
}
