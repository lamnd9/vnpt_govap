import Image from "next/image";

type HeroProps = {
  title: string;
  description: string;
  bannerUrl: string;
  ctaLabel?: string;
  ctaHref?: string;
  illustrationUrl?: string;
};

export function Hero({
  title,
  description,
  bannerUrl,
  ctaLabel,
  ctaHref,
  illustrationUrl,
}: HeroProps) {
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
      <div className="relative mx-auto flex max-w-6xl flex-col gap-6 px-4 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-8">
        <div>
          <h1 className="max-w-2xl text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            {title}
          </h1>
          <p className="mt-4 max-w-xl text-lg text-slate-200">{description}</p>
          {ctaLabel && ctaHref ? (
            <a
              href={ctaHref}
              className="mt-6 inline-block rounded-full bg-orange-500 px-6 py-3 text-base font-semibold text-white shadow-lg transition hover:bg-orange-600"
            >
              {ctaLabel}
            </a>
          ) : null}
        </div>
        {illustrationUrl ? (
          <Image
            src={illustrationUrl}
            alt=""
            width={513}
            height={456}
            unoptimized
            className="hidden h-auto w-56 shrink-0 sm:block lg:w-72"
          />
        ) : null}
      </div>
    </section>
  );
}
