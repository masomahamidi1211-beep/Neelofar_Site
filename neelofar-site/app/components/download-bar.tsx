export function DownloadBar({ href, label = "دانلود PDF" }: { href: string; label?: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="baru-focus block w-full bg-[var(--cream)] px-5 py-3 text-center text-sm font-semibold text-[var(--title)] transition duration-200 hover:bg-[var(--tan)]"
    >
      {label}
    </a>
  );
}
