"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";

type ProductMenuProps = {
  categories: { slug: string; name: string }[];
};

export function ProductMenu({ categories }: ProductMenuProps) {
  const detailsRef = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const details = detailsRef.current;
      if (details?.open && !details.contains(event.target as Node)) {
        details.open = false;
      }
    }

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <details ref={detailsRef} className="group relative">
      <summary className="flex cursor-pointer list-none items-center gap-1 rounded px-2 py-1 hover:text-blue-800 [&::-webkit-details-marker]:hidden">
        Sản phẩm &amp; dịch vụ
        <svg
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
          className="h-4 w-4 transition group-open:rotate-180"
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </summary>
      <div className="absolute left-0 top-full z-50 mt-2 w-64 rounded-lg border border-slate-200 bg-white p-2 shadow-lg">
        {categories.map((category) => (
          <Link
            key={category.slug}
            href={`/san-pham/${category.slug}`}
            className="block rounded-md px-3 py-2 text-slate-700 hover:bg-slate-50 hover:text-blue-800"
            onClick={() => {
              if (detailsRef.current) detailsRef.current.open = false;
            }}
          >
            {category.name}
          </Link>
        ))}
      </div>
    </details>
  );
}
