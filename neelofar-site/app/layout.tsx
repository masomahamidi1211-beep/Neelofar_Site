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

// Deploy-time domain, not known at build time here -- set NEXT_PUBLIC_SITE_URL
// in the hosting platform's environment variables once the real domain is
// live. The fallback just has to be a valid, non-localhost URL so Next stops
// falling back to http://localhost:3000 for OG/Twitter image URLs; it's never
// meant to be seen in a real deployment.
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://neelofar-placeholder.example";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "نیلوفر",
  description: "وب‌سایت نیلوفر برای گسترش کتاب‌خوانی و رمان‌خوانی در میان نوجوانان و جوانان افغانستان",
  icons: {
    icon: [
      { url: "/icon-192.png", type: "image/png", sizes: "192x192" },
      { url: "/icon-512.png", type: "image/png", sizes: "512x512" },
    ],
    apple: "/apple-icon.png",
  },
  openGraph: {
    title: "نیلوفر",
    description: "وب‌سایت نیلوفر برای گسترش کتاب‌خوانی و رمان‌خوانی در میان نوجوانان و جوانان افغانستان",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "نیلوفر",
    description: "وب‌سایت نیلوفر برای گسترش کتاب‌خوانی و رمان‌خوانی در میان نوجوانان و جوانان افغانستان",
    images: ["/og-image.png"],
  },
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
