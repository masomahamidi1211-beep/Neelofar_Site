import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import SiteShell from "./components/site-shell";

const vazirmatn = localFont({
  src: [
    { path: "../public/fonts/Vazirmatn-Regular.woff2", weight: "400", style: "normal" },
    { path: "../public/fonts/Vazirmatn-Medium.woff2", weight: "500", style: "normal" },
    { path: "../public/fonts/Vazirmatn-Bold.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-vazirmatn",
  display: "swap",
});

export const metadata: Metadata = {
  title: "نیلوفر",
  description: "وب‌سایت نیلوفر برای گسترش کتاب‌خوانی و رمان‌خوانی در میان نوجوانان و جوانان افغانستان",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl" className={`${vazirmatn.variable} h-full antialiased`}>
      <body className="min-h-full bg-white text-[#111111]">
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
