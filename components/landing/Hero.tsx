import Image from "next/image";

type HeroProps = {
  title: string;
  description: string;
  bannerUrl: string;
  ctaLabel: string;
  ctaHref: string;
};

export function Hero({ title, description, bannerUrl, ctaLabel, ctaHref }: HeroProps) {
  return (
    <section className="relative overflow-hidden bg-slate-900">
      {bannerUrl ? (
        <Image
          src={bannerUrl}
          alt={title}
          fill
          priority
          unoptimized
          className="object-cover opacity-70"
        />
      ) : null}
      <div className="relative mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <h1 className="max-w-2xl text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
          {title}
        </h1>
        <p className="mt-4 max-w-xl text-lg text-slate-200">{description}</p>
        <a
          href={ctaHref}
          className="mt-6 inline-block rounded-full bg-orange-500 px-6 py-3 text-base font-semibold text-white shadow-lg transition hover:bg-orange-600"
        >
          {ctaLabel}
        </a>
      </div>
    </section>
  );
}
