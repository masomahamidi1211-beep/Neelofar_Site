import { Send } from "lucide-react";
import { FacebookIcon, LinkedinIcon } from "./brand-icons";

/**
 * Share-intent links only, matching the footer's actual platforms
 * (فیسبوک، اینستاگرام، تلگرام، لینکدین) minus Instagram -- Instagram has no
 * public web share-intent URL, so a "share" icon for it would be a dead
 * link rather than an omission.
 */
export function ShareIcons({ url, title }: { url: string; title: string }) {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const links = [
    {
      label: "اشتراک‌گذاری در تلگرام",
      href: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
      Icon: Send,
    },
    {
      label: "اشتراک‌گذاری در فیسبوک",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      Icon: FacebookIcon,
    },
    {
      label: "اشتراک‌گذاری در لینکدین",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      Icon: LinkedinIcon,
    },
  ];

  return (
    <div className="flex items-center gap-4 text-[#6b6b6b]">
      <span className="text-sm">اشتراک‌گذاری:</span>
      {links.map(({ label, href, Icon }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          className="baru-focus transition duration-150 hover:text-[var(--accent)]"
        >
          <Icon size={18} strokeWidth={1.5} />
        </a>
      ))}
    </div>
  );
}
