import { getMultimediaItems } from "../lib/content-server";
import { HairlineGrid, gridSpanFor } from "../components/hairline-grid";
import { formatJalaliDate } from "../lib/date";

export default function MultimediaPage() {
  const items = getMultimediaItems();

  return (
    <div className="mx-auto max-w-[1600px] px-4 py-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold">چندرسانه</h1>
      <p className="mt-2 text-[#4a4a4a]">ویدیوها و محتوای چندرسانه‌ای نیلوفر.</p>

      <div className="mt-5">
        {items.length > 0 ? (
          <HairlineGrid className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item, i) => {
              const span = gridSpanFor(i, items.length, 3);
              return (
                <a
                  key={item.url}
                  href={item.url}
                  target="_blank"
                  rel="noreferrer"
                  style={{ gridColumn: `span ${span} / span ${span}` }}
                  className="group flex h-full flex-col bg-white transition duration-200 hover:bg-[var(--panel)]"
                >
                  <div className="hairline-cell flex flex-1 flex-col">
                    <p className="text-xs text-[#6b6b6b]">{formatJalaliDate(item.date)}</p>
                    <h3 className="mt-1 text-lg font-bold transition duration-200 group-hover:text-[var(--accent)]">
                      {item.title}
                    </h3>
                    <p className="mt-3 text-[15px] leading-8 text-[#333333]">{item.description}</p>
                  </div>
                </a>
              );
            })}
          </HairlineGrid>
        ) : (
          <div className="border border-dashed border-[var(--hairline)] py-16 text-center text-[#6b6b6b]">
            <p className="text-lg font-semibold text-[#111111]">به‌زودی</p>
            <p className="mt-2 text-sm">محتوای چندرسانه‌ای نیلوفر به‌زودی اینجا منتشر می‌شود.</p>
          </div>
        )}
      </div>
    </div>
  );
}
