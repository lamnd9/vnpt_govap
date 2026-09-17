"use client";

import { useState, type FormEvent } from "react";
import { trackLeadSubmit } from "@/lib/tracking";

type CategoryOption = { slug: string; name: string };

type SubmitState =
  | { status: "idle" }
  | { status: "submitting" }
  | { status: "success" }
  | { status: "error"; message: string; fieldErrors?: Record<string, string[]> };

type LeadFormProps = {
  categories: CategoryOption[];
  defaultCategorySlug: string;
};

export function LeadForm({ categories, defaultCategorySlug }: LeadFormProps) {
  const [state, setState] = useState<SubmitState>({ status: "idle" });

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState({ status: "submitting" });

    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = {
      fullName: String(formData.get("fullName") ?? "").trim(),
      phone: String(formData.get("phone") ?? "").trim(),
      email: String(formData.get("email") ?? "").trim(),
      categorySlug: String(formData.get("categorySlug") ?? ""),
      note: String(formData.get("note") ?? "").trim(),
    };

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setState({
          status: "error",
          message: data.error ?? "Có lỗi xảy ra, vui lòng thử lại.",
          fieldErrors: data.fieldErrors,
        });
        return;
      }

      setState({ status: "success" });
      trackLeadSubmit(payload.categorySlug);
      form.reset();
    } catch {
      setState({ status: "error", message: "Không thể kết nối máy chủ, vui lòng thử lại." });
    }
  }

  const fieldErrors = state.status === "error" ? state.fieldErrors : undefined;
  const isSubmitting = state.status === "submitting";

  return (
    <section id="dang-ky-tu-van" className="bg-blue-900 py-16">
      <div className="mx-auto max-w-2xl px-4 sm:px-6">
        <h2 className="text-2xl font-bold text-white sm:text-3xl">Đăng ký tư vấn</h2>
        <p className="mt-2 text-blue-100">
          Để lại thông tin, chuyên viên VNPT sẽ liên hệ tư vấn trong thời gian sớm nhất.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-4 rounded-2xl bg-white p-6 shadow-lg sm:p-8"
        >
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-slate-700">
              Họ và tên <span className="text-red-500">*</span>
            </label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              required
              maxLength={100}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
            {fieldErrors?.fullName ? (
              <p className="mt-1 text-sm text-red-600">{fieldErrors.fullName[0]}</p>
            ) : null}
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-slate-700">
              Số điện thoại <span className="text-red-500">*</span>
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              required
              pattern="0\d{9}"
              placeholder="0912345678"
              title="Số điện thoại gồm 10 số, bắt đầu bằng 0"
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
            {fieldErrors?.phone ? (
              <p className="mt-1 text-sm text-red-600">{fieldErrors.phone[0]}</p>
            ) : null}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
            {fieldErrors?.email ? (
              <p className="mt-1 text-sm text-red-600">{fieldErrors.email[0]}</p>
            ) : null}
          </div>

          <div>
            <label htmlFor="categorySlug" className="block text-sm font-medium text-slate-700">
              Sản phẩm quan tâm
            </label>
            <select
              id="categorySlug"
              name="categorySlug"
              defaultValue={defaultCategorySlug}
              className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
            >
              {categories.map((category) => (
                <option key={category.slug} value={category.slug}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="note" className="block text-sm font-medium text-slate-700">
              Ghi chú
            </label>
            <textarea
              id="note"
              name="note"
              rows={3}
              maxLength={2000}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-full bg-orange-500 px-6 py-3 text-base font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Đang gửi..." : "Gửi yêu cầu tư vấn"}
          </button>

          {state.status === "success" ? (
            <p role="status" className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
              Cảm ơn bạn đã đăng ký! VNPT sẽ liên hệ tư vấn sớm nhất.
            </p>
          ) : null}

          {state.status === "error" ? (
            <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
              {state.message}
            </p>
          ) : null}
        </form>
      </div>
    </section>
  );
}
