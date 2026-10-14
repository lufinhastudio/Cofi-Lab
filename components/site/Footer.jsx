import { site } from "@/config/site";

export function Footer() {
  return (
    <footer className="border-t border-black/5">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-8 text-sm text-muted">
        <p>© {new Date().getFullYear()} {site.name}</p>
        <div className="flex gap-4">
          {site.socials.map((social) => (
            <a key={social.href} href={social.href} target="_blank" rel="noopener noreferrer" className="hover:text-ink">
              {social.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
