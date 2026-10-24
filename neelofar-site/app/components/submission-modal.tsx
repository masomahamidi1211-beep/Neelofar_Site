"use client";

import { useState } from "react";
import { X, Copy, Check, Mail } from "lucide-react";

interface SubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SubmissionModal({ isOpen, onClose }: SubmissionModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const email = "worldliteratureprogram@gmail.com";
  const subject = "ارسال اثر برای نیلوفر";
  
  const gmailWebUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=${encodeURIComponent(subject)}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm dir-rtl font-serif">
      <div className="relative w-full max-w-lg rounded-lg bg-white p-8 shadow-2xl text-center text-[#111]">
        {/* دکمه بستن */}
        <button
          onClick={onClose}
          aria-label="بستن"
          className="absolute top-4 left-4 text-gray-500 hover:text-black transition-colors"
        >
          <X size={22} />
        </button>

        {/* عنوان مدال */}
        <h2 className="text-2xl font-bold mb-6 text-[#8c2222]">
          شرایط ارسال اثر برای نیلوفر
        </h2>

        {/* لیست شرایط */}
        <ul className="text-right text-base leading-relaxed space-y-3 mb-6 text-gray-800 list-disc list-inside">
          <li>متن خود را در قالب فایل ورد ارسال کنید.</li>
          <li>نام و شماره تماس خود را در آغاز متن بنویسید.</li>
        </ul>

        {/* متن تشکر */}
        <p className="mb-6 text-base font-semibold text-gray-700">
          از همکاری‌تان با نیلوفر متشکریم.
        </p>

        {/* دکمه‌های عملیاتی */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href={gmailWebUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-black hover:bg-[#8c2222] text-white px-6 py-3 rounded text-base font-medium transition-colors"
          >
            <Mail size={18} />
            ارسال ایمیل
          </a>

          <button
            onClick={handleCopy}
            type="button"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-gray-300 hover:bg-gray-100 text-gray-800 px-5 py-3 rounded text-base font-medium transition-colors cursor-pointer"
          >
            {copied ? (
              <>
                <Check size={18} className="text-green-600" />
                کپی شد!
              </>
            ) : (
              <>
                <Copy size={18} />
                کپی ایمیل
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}