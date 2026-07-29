import Link from "next/link";

/**
 * Split-block section intro: image and text fill a shared row edge to edge.
 *
 * With `href` (homepage preview context): the image column has a fixed
 * aspect ratio, which locks the block's height independent of text length;
 * the text is clamped to fit that same height and a "ادامه‌ی مطلب" link
 * points at the full section. No overflow, no mismatched column bottoms.
 *
 * Without `href` (the section's own ویژه‌نامه page -- there's nowhere
 * further to link to): the full, unclamped text is shown, and the image
 * column stretches (flex align-items: stretch) to match whatever height
 * the text ends up needing.
 *
 * Stacks to image-on-top on mobile either way, where there's no side-by-side
 * height to lock against.
 */
export function SectionIntro({
  image,
  imagePosition,
  imageAlt,
  text,
  href,
}: {
  image: string;
  imagePosition?: string | null;
  imageAlt?: string | null;
  text: string;
  href?: string;
}) {
  return (
    <div className={`mb-3 flex flex-col border border-[var(--hairline)] bg-white sm:flex-row ${href ? "group" : ""}`}>
      <div
        className={`aspect-square w-full shrink-0 overflow-hidden sm:w-64 ${
          href ? "sm:aspect-[3/4]" : "sm:aspect-auto"
        }`}
      >
        <img
          src={image}
          alt={imageAlt ?? ""}
          className={`h-full w-full object-cover ${href ? "transition duration-200 ease-out group-hover:scale-[1.03]" : ""}`}
          style={{ objectPosition: imagePosition ?? "50% 20%" }}
        />
      </div>
      <div className="flex flex-1 flex-col justify-between p-5">
        <p className={`text-justify text-base leading-8 text-[#4a4a4a] ${href ? "line-clamp-[8]" : ""}`}>{text}</p>
        {href && (
          <Link
            href={href}
            className="mt-3 inline-block text-base font-semibold text-[var(--accent)] transition duration-200 group-hover:opacity-70"
          >
            ادامه‌ی مطلب ←
          </Link>
        )}
      </div>
    </div>
  );
}
