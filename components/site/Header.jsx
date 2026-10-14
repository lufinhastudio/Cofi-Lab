import { site } from "@/config/site";

export function Header() {
  return (
    <header className="sticky top-0 z-20 border-b border-black/5 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <a href="#inicio" className="font-display text-lg font-bold tracking-tight">
          {site.name}
        </a>
        <nav className="hidden gap-6 text-sm sm:flex">
          {site.nav.map((item) => (
            <a key={item.href} href={item.href} className="hover:text-accent">
              {item.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
