"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Send } from "lucide-react";
import { FacebookIcon, InstagramIcon, LinkedinIcon } from "@/app/components/brand-icons"; 
import SubmissionModal from "@/app/components/submission-modal";

const quickLinks = [
  { href: "/notes", label: "یادداشت‌ها" },
  { href: "/special", label: "ویژه‌نامه‌ها" },
  { href: "/magazine", label: "مجله نیلوفر" },
  { href: "/podcast", label: "پادکست" },
  { href: "/conversations", label: "گفتگوها" },
  { href: "/about", label: "درباره ما" },
];

export default function Footer() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <footer className="border-t border-[#333] bg-[#0a0a0a] text-white dir-rtl font-serif">
        <div className="mx-auto w-full px-4 py-8 sm:px-6 lg:max-w-[1200px]">
          {/* Main flex container aligned in one horizontal line */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            
            {/* 1. Logo & Title */}
            <Link href="/" className="footer-link flex shrink-0 items-center gap-3">
              <Image
                src="/logo.png"
                alt="نیلوفر"
                width={70}
                height={70}
                className="h-12 w-12 [filter:brightness(0)_invert(1)] sm:h-14 sm:w-14"
              />
              <span className="text-3xl font-bold text-white sm:text-4xl">نیلوفر</span>
            </Link>

            {/* 2. Navigation Links & Submission Modal Button */}
            <nav
              aria-label="لینک‌های سریع"
              className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm sm:text-base font-medium whitespace-nowrap"
            >
              {quickLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="footer-link text-white transition duration-150 hover:opacity-70"
                >
                  {link.label}
                </Link>
              ))}

              <button
                onClick={() => setIsModalOpen(true)}
                className="footer-link text-white transition duration-150 hover:opacity-70 font-medium cursor-pointer"
              >
                ارسال اثر
              </button>
            </nav>

            {/* 3. Social Media Icons Only */}
            <div className="flex items-center gap-4 shrink-0">
              <a
                href="https://www.facebook.com/share/1DC6n4DkeW/?mibextid=wwXIfr"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="فیسبوک"
                className="footer-link text-white transition duration-150 hover:opacity-70"
              >
                <FacebookIcon />
              </a>

              <a
                href="https://www.instagram.com/worldliteratureprogram?stkn=YWVjd3dzYzl1ZHRz"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="اینستاگرام"
                className="footer-link text-white transition duration-150 hover:opacity-70"
              >
                <InstagramIcon />
              </a>

              <a
                href="https://t.me/worldliteratureprogram"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="تلگرام"
                className="footer-link text-white transition duration-150 hover:opacity-70"
              >
                <Send size={18} strokeWidth={1.5} />
              </a>

              <a
                href="https://www.linkedin.com/company/the-world-literature-program/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="لینکدین"
                className="footer-link text-white transition duration-150 hover:opacity-70"
              >
                <LinkedinIcon />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Copyright Bar */}
        <div className="border-t border-[#222]">
          <p className="mx-auto w-full px-4 py-3 text-center text-xs sm:text-sm text-gray-400">
            © ۱۴۰۵ نیلوفر — برنامهٔ ادبیات جهان
          </p>
        </div>
      </footer>

      <SubmissionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}