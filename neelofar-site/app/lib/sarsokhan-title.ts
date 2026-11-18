/** The «سرسخن» title never changes color: no navy, no hover or visited tint. */
export const isSarsokhanTitle = (title: string) => title.trim() === "سرسخن";

/** For titles on a card or panel: solid black, overriding every other state. */
export const SOLID_BLACK_TITLE = "text-[#111111]!";
