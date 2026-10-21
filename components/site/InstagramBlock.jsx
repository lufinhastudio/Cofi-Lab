import Image from "next/image";
import { ArrowUpRight, Instagram } from "lucide-react";

// Bloque al cierre de cada caso: foto + bloque periwinkle con el link al perfil.
export function InstagramBlock({ url, label, image }) {
  if (!url) return null;
  const handle = url.replace(/^https?:\/\/(www\.)?instagram\.com\//, "@").replace(/\/$/, "");
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className="group grid grid-cols-1 overflow-hidden sm:grid-cols-2">
      <span className="relative block aspect-[4/3] min-w-0 overflow-hidden bg-arena">
        {image ? <Image src={image} alt="" fill sizes="(min-width: 640px) 50vw, 100vw" className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]" /> : null}
      </span>
      <span className="flex min-w-0 flex-col justify-between bg-periwinkle p-7 sm:p-10">
        <Instagram className="h-7 w-7" strokeWidth={2} aria-hidden="true" />
        <span className="mt-10 block">
          <span className="mono-label block">{label || "Visitar perfil"}</span>
          <span className="title-pop mt-2 flex min-w-0 items-center gap-3 text-[26px] [overflow-wrap:anywhere] sm:text-[40px]">
            {handle}
            <ArrowUpRight className="h-8 w-8 shrink-0 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" strokeWidth={2.5} />
          </span>
        </span>
      </span>
    </a>
  );
}
