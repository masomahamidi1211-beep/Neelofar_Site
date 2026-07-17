import Link from "next/link";

export function IssuePoster({
  href,
  image,
  imagePosition,
  imageAlt,
  label,
  title,
  seasonYear,
  contributors,
}: {
  href: string;
  image: string;
  imagePosition?: string | null;
  imageAlt?: string | null;
  label: string;
  title: string;
  seasonYear: string;
  contributors: string[];
}) {
  return (
    <Link
      href={href}
      className="article-box baru-focus group relative block aspect-[3/4] w-full overflow-hidden sm:aspect-[4/5]"
    >
      <img
        src={image}
        alt={imageAlt ?? ""}
        className="absolute inset-0 h-full w-full object-cover"
        style={{ objectPosition: imagePosition ?? "50% 20%" }}
      />
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/60 to-transparent p-5 pt-20 sm:p-6 sm:pt-24">
        <p className="text-xs font-semibold tracking-[0.15em] text-white/80">{label}</p>
        <h2 className="mt-2 text-2xl leading-snug font-bold text-white sm:text-3xl">{title}</h2>
        <p className="mt-1 text-sm text-white/70">{seasonYear}</p>
        <div className="mt-4 bg-[#eef2f7]/95 p-4">
          <p className="justified-fa text-xs leading-7 text-[var(--ink)]">{contributors.join("، ")}</p>
        </div>
      </div>
    </Link>
  );
}
