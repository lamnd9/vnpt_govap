"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { LEAD_STATUS_OPTIONS } from "@/lib/lead-status";

type CategoryOption = { slug: string; name: string };

type Lead = {
  id: string;
  fullName: string;
  phone: string;
  email: string | null;
  categorySlug: string;
  note: string | null;
  status: string;
  createdAt: string;
};

type LoadState =
  | { status: "loading" }
  | { status: "not-found" }
  | { status: "error"; message: string }
  | { status: "ready"; lead: Lead };

export function LeadDetail({
  leadId,
  categories,
}: {
  leadId: string;
  categories: CategoryOption[];
}) {
  const [state, setState] = useState<LoadState>({ status: "loading" });
  const [formStatus, setFormStatus] = useState("new");
  const [formNote, setFormNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setState({ status: "loading" });
      try {
        const response = await fetch(`/api/admin/leads/${leadId}`);
        if (response.status === 404) {
          if (!cancelled) setState({ status: "not-found" });
          return;
        }
        if (!response.ok) throw new Error("failed");
        const lead: Lead = await response.json();
        if (!cancelled) {
          setState({ status: "ready", lead });
          setFormStatus(lead.status);
          setFormNote(lead.note ?? "");
        }
      } catch {
        if (!cancelled) setState({ status: "error", message: "Không tải được thông tin lead." });
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [leadId]);

  async function handleSave() {
    setSaving(true);
    setSaveMessage(null);
    try {
      const response = await fetch(`/api/admin/leads/${leadId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: formStatus, note: formNote }),
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        setSaveMessage(data.error ?? "Lưu thất bại, vui lòng thử lại.");
        return;
      }
      const updated: Lead = await response.json();
      setState({ status: "ready", lead: updated });
      setSaveMessage("Đã lưu thay đổi.");
    } catch {
      setSaveMessage("Không thể kết nối máy chủ, vui lòng thử lại.");
    } finally {
      setSaving(false);
    }
  }

  if (state.status === "loading") {
    return <p className="text-slate-500">Đang tải...</p>;
  }

  if (state.status === "not-found") {
    return (
      <div className="space-y-4">
        <p className="text-slate-600">Không tìm thấy lead này.</p>
        <Link href="/leads" className="text-blue-800 hover:underline">
          ← Quay lại danh sách
        </Link>
      </div>
    );
  }

  if (state.status === "error") {
    return <p className="text-red-600">{state.message}</p>;
  }

  const { lead } = state;
  const categoryName =
    categories.find((c) => c.slug === lead.categorySlug)?.name ?? lead.categorySlug;

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <Link href="/leads" className="text-sm text-blue-800 hover:underline">
          ← Quay lại danh sách
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-slate-900">Chi tiết lead</h1>
      </div>

      <dl className="grid grid-cols-1 gap-4 rounded-xl border border-slate-200 bg-white p-6 sm:grid-cols-2">
        <div>
          <dt className="text-xs font-medium uppercase text-slate-400">Họ và tên</dt>
          <dd className="mt-1 text-slate-900">{lead.fullName}</dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase text-slate-400">Số điện thoại</dt>
          <dd className="mt-1 text-slate-900">{lead.phone}</dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase text-slate-400">Email</dt>
          <dd className="mt-1 text-slate-900">{lead.email ?? "—"}</dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase text-slate-400">Sản phẩm quan tâm</dt>
          <dd className="mt-1 text-slate-900">{categoryName}</dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase text-slate-400">Thời gian gửi</dt>
          <dd className="mt-1 text-slate-900">
            {new Date(lead.createdAt).toLocaleString("vi-VN")}
          </dd>
        </div>
      </dl>

      <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-6">
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-slate-700">
            Trạng thái xử lý
          </label>
          <select
            id="status"
            value={formStatus}
            onChange={(event) => setFormStatus(event.target.value)}
            className="mt-1 w-full max-w-xs rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
          >
            {LEAD_STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="note" className="block text-sm font-medium text-slate-700">
            Ghi chú xử lý
          </label>
          <textarea
            id="note"
            rows={4}
            value={formNote}
            onChange={(event) => setFormNote(event.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
          />
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="rounded-full bg-blue-800 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-900 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? "Đang lưu..." : "Lưu thay đổi"}
        </button>

        {saveMessage ? <p className="text-sm text-slate-600">{saveMessage}</p> : null}
      </div>
    </div>
  );
}
