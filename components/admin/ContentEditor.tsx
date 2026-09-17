"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { CategoryContentInput } from "@/lib/validation";
import { Hero } from "@/components/landing/Hero";
import { FeatureList } from "@/components/landing/FeatureList";
import { PricingTable } from "@/components/landing/PricingTable";
import { FaqAccordion } from "@/components/landing/FaqAccordion";

type CategoryOption = { slug: string; name: string };

type CategoryRecord = CategoryContentInput & {
  id: string;
  slug: string;
  name: string;
  updatedBy: string | null;
  updatedAt: string;
};

type LoadState =
  | { status: "loading" }
  | { status: "not-found" }
  | { status: "error"; message: string }
  | { status: "ready"; category: CategoryRecord };

export function ContentEditor({
  slug,
  categories,
}: {
  slug: string;
  categories: CategoryOption[];
}) {
  const router = useRouter();
  const [state, setState] = useState<LoadState>({ status: "loading" });
  const [content, setContent] = useState<CategoryContentInput | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setState({ status: "loading" });
      setShowPreview(false);
      setSaveMessage(null);
      try {
        const response = await fetch(`/api/admin/categories/${slug}`);
        if (response.status === 404) {
          if (!cancelled) setState({ status: "not-found" });
          return;
        }
        if (!response.ok) throw new Error("failed");
        const category: CategoryRecord = await response.json();
        if (!cancelled) {
          setState({ status: "ready", category });
          setContent({
            hero: category.hero,
            features: category.features,
            pricing: category.pricing,
            faq: category.faq,
          });
        }
      } catch {
        if (!cancelled) {
          setState({ status: "error", message: "Không tải được nội dung category." });
        }
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  function resetToOriginal() {
    if (state.status !== "ready") return;
    setContent({
      hero: state.category.hero,
      features: state.category.features,
      pricing: state.category.pricing,
      faq: state.category.faq,
    });
    setSaveMessage(null);
  }

  async function handleSave() {
    if (!content) return;
    setSaving(true);
    setSaveMessage(null);
    try {
      const response = await fetch(`/api/admin/categories/${slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content),
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        setSaveMessage(data.error ?? "Lưu thất bại, vui lòng thử lại.");
        return;
      }
      const updated: CategoryRecord = await response.json();
      setState({ status: "ready", category: updated });
      setSaveMessage("Đã lưu và xuất bản.");
    } catch {
      setSaveMessage("Không thể kết nối máy chủ, vui lòng thử lại.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Chỉnh sửa nội dung sản phẩm</h1>
        <div className="mt-3 flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c.slug}
              type="button"
              onClick={() => router.push(`/content/${c.slug}`)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                c.slug === slug
                  ? "bg-blue-800 text-white"
                  : "border border-slate-300 bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {state.status === "loading" ? <p className="text-slate-500">Đang tải...</p> : null}
      {state.status === "not-found" ? (
        <p className="text-slate-600">Không tìm thấy category này.</p>
      ) : null}
      {state.status === "error" ? <p className="text-red-600">{state.message}</p> : null}

      {state.status === "ready" && content ? (
        <>
          <p className="text-sm text-slate-500">
            Cập nhật lần cuối bởi {state.category.updatedBy ?? "—"} lúc{" "}
            {new Date(state.category.updatedAt).toLocaleString("vi-VN")}
          </p>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-6">
              <section className="space-y-3 rounded-xl border border-slate-200 bg-white p-5">
                <h2 className="font-semibold text-slate-900">Hero</h2>
                <div>
                  <label className="block text-sm text-slate-600">Tiêu đề</label>
                  <input
                    type="text"
                    value={content.hero.title}
                    onChange={(e) =>
                      setContent({ ...content, hero: { ...content.hero, title: e.target.value } })
                    }
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-600">Mô tả</label>
                  <textarea
                    rows={3}
                    value={content.hero.description}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        hero: { ...content.hero, description: e.target.value },
                      })
                    }
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-600">Ảnh banner (đường dẫn)</label>
                  <input
                    type="text"
                    value={content.hero.bannerUrl}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        hero: { ...content.hero, bannerUrl: e.target.value },
                      })
                    }
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  />
                </div>
              </section>

              <section className="space-y-3 rounded-xl border border-slate-200 bg-white p-5">
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold text-slate-900">Tính năng nổi bật</h2>
                  <button
                    type="button"
                    onClick={() =>
                      setContent({
                        ...content,
                        features: [...content.features, { title: "", description: "" }],
                      })
                    }
                    className="text-sm text-blue-800 hover:underline"
                  >
                    + Thêm tính năng
                  </button>
                </div>
                {content.features.map((feature, index) => (
                  <div key={index} className="space-y-2 rounded-lg border border-slate-100 p-3">
                    <input
                      type="text"
                      placeholder="Tiêu đề"
                      value={feature.title}
                      onChange={(e) => {
                        const next = [...content.features];
                        next[index] = { ...next[index], title: e.target.value };
                        setContent({ ...content, features: next });
                      }}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                    />
                    <textarea
                      placeholder="Mô tả"
                      rows={2}
                      value={feature.description}
                      onChange={(e) => {
                        const next = [...content.features];
                        next[index] = { ...next[index], description: e.target.value };
                        setContent({ ...content, features: next });
                      }}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setContent({
                          ...content,
                          features: content.features.filter((_, i) => i !== index),
                        })
                      }
                      className="text-xs text-red-600 hover:underline"
                    >
                      Xóa
                    </button>
                  </div>
                ))}
              </section>

              <section className="space-y-3 rounded-xl border border-slate-200 bg-white p-5">
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold text-slate-900">Bảng giá</h2>
                  <button
                    type="button"
                    onClick={() =>
                      setContent({
                        ...content,
                        pricing: [...content.pricing, { planName: "", price: "", description: "" }],
                      })
                    }
                    className="text-sm text-blue-800 hover:underline"
                  >
                    + Thêm gói
                  </button>
                </div>
                {content.pricing.map((plan, index) => (
                  <div key={index} className="space-y-2 rounded-lg border border-slate-100 p-3">
                    <input
                      type="text"
                      placeholder="Tên gói"
                      value={plan.planName}
                      onChange={(e) => {
                        const next = [...content.pricing];
                        next[index] = { ...next[index], planName: e.target.value };
                        setContent({ ...content, pricing: next });
                      }}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                    />
                    <input
                      type="text"
                      placeholder="Giá"
                      value={plan.price}
                      onChange={(e) => {
                        const next = [...content.pricing];
                        next[index] = { ...next[index], price: e.target.value };
                        setContent({ ...content, pricing: next });
                      }}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                    />
                    <textarea
                      placeholder="Mô tả gói"
                      rows={2}
                      value={plan.description}
                      onChange={(e) => {
                        const next = [...content.pricing];
                        next[index] = { ...next[index], description: e.target.value };
                        setContent({ ...content, pricing: next });
                      }}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setContent({
                          ...content,
                          pricing: content.pricing.filter((_, i) => i !== index),
                        })
                      }
                      className="text-xs text-red-600 hover:underline"
                    >
                      Xóa
                    </button>
                  </div>
                ))}
              </section>

              <section className="space-y-3 rounded-xl border border-slate-200 bg-white p-5">
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold text-slate-900">FAQ</h2>
                  <button
                    type="button"
                    onClick={() =>
                      setContent({ ...content, faq: [...content.faq, { question: "", answer: "" }] })
                    }
                    className="text-sm text-blue-800 hover:underline"
                  >
                    + Thêm câu hỏi
                  </button>
                </div>
                {content.faq.map((item, index) => (
                  <div key={index} className="space-y-2 rounded-lg border border-slate-100 p-3">
                    <input
                      type="text"
                      placeholder="Câu hỏi"
                      value={item.question}
                      onChange={(e) => {
                        const next = [...content.faq];
                        next[index] = { ...next[index], question: e.target.value };
                        setContent({ ...content, faq: next });
                      }}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                    />
                    <textarea
                      placeholder="Câu trả lời"
                      rows={2}
                      value={item.answer}
                      onChange={(e) => {
                        const next = [...content.faq];
                        next[index] = { ...next[index], answer: e.target.value };
                        setContent({ ...content, faq: next });
                      }}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setContent({ ...content, faq: content.faq.filter((_, i) => i !== index) })
                      }
                      className="text-xs text-red-600 hover:underline"
                    >
                      Xóa
                    </button>
                  </div>
                ))}
              </section>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving}
                  className="rounded-full bg-blue-800 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-900 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? "Đang lưu..." : "Lưu và xuất bản"}
                </button>
                <button
                  type="button"
                  onClick={resetToOriginal}
                  className="rounded-full border border-slate-300 px-6 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Hủy thay đổi
                </button>
                <button
                  type="button"
                  onClick={() => setShowPreview((v) => !v)}
                  className="rounded-full border border-slate-300 px-6 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  {showPreview ? "Ẩn xem trước" : "Xem trước"}
                </button>
                {saveMessage ? <span className="text-sm text-slate-600">{saveMessage}</span> : null}
              </div>
            </div>

            {showPreview ? (
              <div className="rounded-xl border-2 border-dashed border-blue-300 bg-white lg:sticky lg:top-4 lg:self-start">
                <p className="border-b border-blue-100 bg-blue-50 px-4 py-2 text-xs font-semibold uppercase text-blue-700">
                  Xem trước (chưa lưu)
                </p>
                <div className="max-h-[80vh] overflow-y-auto">
                  <Hero
                    title={content.hero.title}
                    description={content.hero.description}
                    bannerUrl={content.hero.bannerUrl}
                    ctaLabel="Đăng ký tư vấn"
                    ctaHref="#"
                  />
                  <FeatureList features={content.features} />
                  <PricingTable pricing={content.pricing} />
                  <FaqAccordion faq={content.faq} />
                </div>
              </div>
            ) : null}
          </div>
        </>
      ) : null}
    </div>
  );
}
