const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];

export function toPersianDigits(value: string): string {
  return value.replace(/\d/g, (digit) => persianDigits[Number(digit)] ?? digit);
}

export function formatJalaliDate(value: string): string {
  return toPersianDigits(value);
}
