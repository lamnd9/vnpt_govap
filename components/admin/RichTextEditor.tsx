"use client";

import { useRef, useState } from "react";
import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import { Table, TableRow, TableHeader, TableCell } from "@tiptap/extension-table";

type RichTextEditorProps = {
  value: string;
  onChange: (html: string) => void;
};

// Dọn rác HTML đặc thù của Word khi dán vào (conditional comment, thẻ <o:p> Word chèn cuối
// mỗi đoạn) — phần lớn junk khác (namespace XML, class Mso*, <style>...) đã tự bị loại vì
// ProseMirror chỉ nhận diện tag/attribute có trong schema của editor.
function cleanPastedWordHtml(html: string): string {
  return html
    .replace(/<!--\[if[\s\S]*?<!\[endif\]-->/gi, "")
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<o:p>[\s\S]*?<\/o:p>/gi, "")
    .replace(/<xml>[\s\S]*?<\/xml>/gi, "");
}

async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  const response = await fetch("/api/admin/uploads", { method: "POST", body: formData });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error ?? "Tải ảnh lên thất bại.");
  }
  return data.url as string;
}

async function insertImageFile(editor: Editor, file: File) {
  try {
    const url = await uploadImage(file);
    editor.chain().focus().setImage({ src: url }).run();
  } catch (error) {
    window.alert(error instanceof Error ? error.message : "Tải ảnh lên thất bại.");
  }
}

function ToolbarButton({
  onClick,
  active,
  disabled,
  children,
  label,
}: {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className={`rounded px-2 py-1 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-40 ${
        active ? "bg-blue-800 text-white" : "text-slate-600 hover:bg-slate-100"
      }`}
    >
      {children}
    </button>
  );
}

function Toolbar({ editor }: { editor: Editor }) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const inTable = editor.isActive("table");

  return (
    <div className="flex flex-wrap items-center gap-1 border-b border-slate-200 bg-slate-50 p-1.5">
      <ToolbarButton
        label="Đậm"
        active={editor.isActive("bold")}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <span className="font-bold">B</span>
      </ToolbarButton>
      <ToolbarButton
        label="Nghiêng"
        active={editor.isActive("italic")}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <span className="italic">I</span>
      </ToolbarButton>
      <ToolbarButton
        label="Gạch chân"
        active={editor.isActive("underline")}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
      >
        <span className="underline">U</span>
      </ToolbarButton>
      <ToolbarButton
        label="Gạch ngang"
        active={editor.isActive("strike")}
        onClick={() => editor.chain().focus().toggleStrike().run()}
      >
        <span className="line-through">S</span>
      </ToolbarButton>
      <div className="mx-1 w-px self-stretch bg-slate-300" />
      <ToolbarButton
        label="Tiêu đề lớn"
        active={editor.isActive("heading", { level: 2 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
      >
        H2
      </ToolbarButton>
      <ToolbarButton
        label="Tiêu đề nhỏ"
        active={editor.isActive("heading", { level: 3 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
      >
        H3
      </ToolbarButton>
      <div className="mx-1 w-px self-stretch bg-slate-300" />
      <ToolbarButton
        label="Danh sách gạch đầu dòng"
        active={editor.isActive("bulletList")}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        • ⁝
      </ToolbarButton>
      <ToolbarButton
        label="Danh sách đánh số"
        active={editor.isActive("orderedList")}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        1. ⁝
      </ToolbarButton>
      <ToolbarButton
        label="Trích dẫn"
        active={editor.isActive("blockquote")}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
      >
        &ldquo; &rdquo;
      </ToolbarButton>
      <div className="mx-1 w-px self-stretch bg-slate-300" />
      <ToolbarButton
        label="Chèn liên kết"
        active={editor.isActive("link")}
        onClick={() => {
          const url = window.prompt("Nhập URL:", editor.getAttributes("link").href ?? "https://");
          if (url === null) return;
          if (url === "") {
            editor.chain().focus().extendMarkRange("link").unsetLink().run();
            return;
          }
          editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
        }}
      >
        🔗
      </ToolbarButton>
      <ToolbarButton label="Chèn ảnh" onClick={() => fileInputRef.current?.click()}>
        🖼️
      </ToolbarButton>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void insertImageFile(editor, file);
          e.target.value = "";
        }}
      />
      <div className="mx-1 w-px self-stretch bg-slate-300" />
      <ToolbarButton
        label="Chèn bảng"
        active={inTable}
        onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
      >
        ⊞
      </ToolbarButton>
      {inTable ? (
        <>
          <ToolbarButton label="Thêm cột" onClick={() => editor.chain().focus().addColumnAfter().run()}>
            +Cột
          </ToolbarButton>
          <ToolbarButton label="Xoá cột" onClick={() => editor.chain().focus().deleteColumn().run()}>
            -Cột
          </ToolbarButton>
          <ToolbarButton label="Thêm hàng" onClick={() => editor.chain().focus().addRowAfter().run()}>
            +Hàng
          </ToolbarButton>
          <ToolbarButton label="Xoá hàng" onClick={() => editor.chain().focus().deleteRow().run()}>
            -Hàng
          </ToolbarButton>
          <ToolbarButton label="Xoá bảng" onClick={() => editor.chain().focus().deleteTable().run()}>
            Xoá bảng
          </ToolbarButton>
        </>
      ) : null}
    </div>
  );
}

export function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const [editorState, setEditorState] = useState(0);
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Table.configure({ resizable: false }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: value,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: "prose prose-sm max-w-none min-h-[180px] px-3 py-2 focus:outline-none",
      },
      transformPastedHTML: cleanPastedWordHtml,
      handlePaste: (_view, event) => {
        const files = Array.from(event.clipboardData?.files ?? []).filter((file) =>
          file.type.startsWith("image/"),
        );
        if (files.length === 0 || !editor) return false;
        event.preventDefault();
        files.forEach((file) => void insertImageFile(editor, file));
        return true;
      },
      handleDrop: (_view, event) => {
        const files = Array.from(event.dataTransfer?.files ?? []).filter((file) =>
          file.type.startsWith("image/"),
        );
        if (files.length === 0 || !editor) return false;
        event.preventDefault();
        files.forEach((file) => void insertImageFile(editor, file));
        return true;
      },
    },
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    // Toolbar cần re-render khi selection đổi (đang ở trong bảng hay không, mark đang active...)
    onSelectionUpdate: () => setEditorState((n) => n + 1),
    onTransaction: () => setEditorState((n) => n + 1),
  });

  if (!editor) {
    return (
      <div className="rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-400">
        Đang tải trình soạn thảo...
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-slate-300">
      <Toolbar key={editorState} editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}
