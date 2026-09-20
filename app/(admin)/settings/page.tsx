import type { Metadata } from "next";
import { SettingsEditor } from "@/components/admin/SettingsEditor";

export const metadata: Metadata = {
  title: "Cấu hình chung",
};

export default function AdminSettingsPage() {
  return <SettingsEditor />;
}
