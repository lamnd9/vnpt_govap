"use client";

import { useEffect, useState } from "react";

type SiteSettingsData = {
  email: string;
  phone: string;
  address: string;
  messengerUrl: string;
  zaloUrl: string;
};

type LoadState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ready"; updatedAt: string; updatedBy: string | null };

export function SettingsEditor() {
  const [state, setState] = useState<LoadState>({ status: "loading" });
  const [form, setForm] = useState<SiteSettingsData | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]> | undefined>();

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setState({ status: "loading" });
      try {
        const response = await fetch("/api/admin/settings");
        if (!response.ok) throw new Error("failed");
        const data = await response.json();
        if (!cancelled) {
          setState({ status: "ready", updatedAt: data.updatedAt, updatedBy: data.updatedBy });
          setForm({
            email: data.email,
            phone: data.phone,
            address: data.address,
            messengerUrl: data.messengerUrl,
            zaloUrl: data.zaloUrl,
          });
        }
      } catch {
        if (!cancelled) {
          setState({ status: "error", message: "Không tải được cấu hình." });
        }
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleSave() {
    if (!form) return;
    setSaving(true);
    setSaveMessage(null);
    setFieldErrors(undefined);
    try {
      const response = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        setSaveMessage(data.error ?? "Lưu thất bại, vui lòng thử lại.");
        setFieldErrors(data.fieldErrors);
        return;
      }
      setState({ status: "ready", updatedAt: data.updatedAt, updatedBy: data.updatedBy });
      setSaveMessage("Đã lưu.");
    } catch {
      setSaveMessage("Không thể kết nối máy chủ, vui lòng thử lại.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Cấu hình chung</h1>
        <p className="mt-1 text-sm text-slate-500">
          Thông tin liên hệ hiển thị ở header, footer và khối liên hệ nhanh trên trang public.
        </p>
      </div>

      {state.status === "loading" ? <p className="text-slate-500">Đang tải...</p> : null}
      {state.status === "error" ? <p className="text-red-600">{state.message}</p> : null}

      {state.status === "ready" && form ? (
        <>
          <p className="text-sm text-slate-500">
            Cập nhật lần cuối bởi {state.updatedBy ?? "—"} lúc{" "}
            {new Date(state.updatedAt).toLocaleString("vi-VN")}
          </p>

          <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-5">
            <div>
              <label className="block text-sm text-slate-600">Email liên hệ</label>
              <input
                type="text"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />
              {fieldErrors?.email ? (
                <p className="mt-1 text-sm text-red-600">{fieldErrors.email[0]}</p>
              ) : null}
            </div>

            <div>
              <label className="block text-sm text-slate-600">Số điện thoại</label>
              <input
                type="text"
                placeholder="0912345678"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />
              {fieldErrors?.phone ? (
                <p className="mt-1 text-sm text-red-600">{fieldErrors.phone[0]}</p>
              ) : null}
            </div>

            <div>
              <label className="block text-sm text-slate-600">Địa chỉ</label>
              <input
                type="text"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />
              {fieldErrors?.address ? (
                <p className="mt-1 text-sm text-red-600">{fieldErrors.address[0]}</p>
              ) : null}
            </div>

            <div>
              <label className="block text-sm text-slate-600">Link Messenger</label>
              <input
                type="text"
                placeholder="https://www.facebook.com/messages/t/..."
                value={form.messengerUrl}
                onChange={(e) => setForm({ ...form, messengerUrl: e.target.value })}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />
              {fieldErrors?.messengerUrl ? (
                <p className="mt-1 text-sm text-red-600">{fieldErrors.messengerUrl[0]}</p>
              ) : null}
            </div>

            <div>
              <label className="block text-sm text-slate-600">Link Zalo</label>
              <input
                type="text"
                placeholder="https://zalo.me/..."
                value={form.zaloUrl}
                onChange={(e) => setForm({ ...form, zaloUrl: e.target.value })}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />
              {fieldErrors?.zaloUrl ? (
                <p className="mt-1 text-sm text-red-600">{fieldErrors.zaloUrl[0]}</p>
              ) : null}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="rounded-full bg-blue-800 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-900 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? "Đang lưu..." : "Lưu"}
            </button>
            {saveMessage ? <span className="text-sm text-slate-600">{saveMessage}</span> : null}
          </div>
        </>
      ) : null}
    </div>
  );
}
