import Link from "next/link";

export function IssuePoster({
  href,
  image,
  imagePosition,
  imageAlt,
  title,
  credit,
  excerpt,
}: {
  href: string;
  image: string;
  imagePosition?: string | null;
  imageAlt?: string | null;
  title: string;
  credit: string;
  excerpt: string;
}) {
  return (
    <Link
      href={href}
      className="article-box baru-focus group relative block aspect-[3/4] w-full overflow-hidden sm:aspect-[4/5]"
    >
      <img
        src={image}
        alt={imageAlt ?? ""}
        className="absolute inset-0 h-full w-full object-cover transition duration-200 ease-out group-hover:scale-[1.03]"
        style={{ objectPosition: imagePosition ?? "50% 20%" }}
      />
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/95 via-black/80 to-transparent p-5 pt-28 sm:p-6 sm:pt-32">
        <h2 className="article-title text-5xl leading-snug text-white sm:text-6xl">{title}</h2>
        <p className="article-author mt-2 text-sm text-white/70">{credit}</p>
        <p className="article-body justified-fa mt-3 line-clamp-2 text-base leading-7 text-white/90 sm:line-clamp-3">
          {excerpt}{" "}
          <span className="font-semibold whitespace-nowrap text-white">ادامه‌ی مطلب ←</span>
        </p>
      </div>
    </Link>
  );
}
