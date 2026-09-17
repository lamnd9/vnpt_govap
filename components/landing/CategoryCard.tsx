import Image from "next/image";
import Link from "next/link";

type CategoryCardProps = {
  slug: string;
  name: string;
  description: string;
  bannerUrl: string;
};

export function CategoryCard({ slug, name, description, bannerUrl }: CategoryCardProps) {
  return (
    <Link
      href={`/san-pham/${slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
    >
      <div className="relative h-40 w-full bg-slate-100">
        {bannerUrl ? (
          <Image src={bannerUrl} alt={name} fill unoptimized className="object-cover" />
        ) : null}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-5">
        <h3 className="text-lg font-semibold text-slate-900">{name}</h3>
        <p className="line-clamp-3 flex-1 text-sm text-slate-600">{description}</p>
        <span className="mt-2 text-sm font-medium text-blue-800 group-hover:underline">
          Xem chi tiết →
        </span>
      </div>
    </Link>
  );
}
