import Image from "next/image";
import { ArrowIcon, InstagramIcon } from "./icons";

// Foto a la izquierda superpuesta a un panel arena con el link al perfil.
export function InstagramBlock({ url, label, image }) {
  if (!url) return null;
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className="group relative block md:py-16">
      <span className="absolute inset-y-0 left-[22%] right-0 hidden bg-sand md:block" aria-hidden="true" />
      <span className="relative grid items-center gap-8 bg-sand md:grid-cols-2 md:bg-transparent">
        <span className="relative block aspect-[4/3] overflow-hidden md:aspect-[5/4]">
          {image ? (
            <Image src={image} alt="" fill sizes="(min-width: 768px) 45vw, 100vw" className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]" />
          ) : null}
        </span>
        <span className="flex flex-col items-start px-8 pb-10 md:px-6 md:pb-0">
          <InstagramIcon className="h-5 w-5 text-stone" />
          <span className="mt-4 font-display text-2xl font-light uppercase tracking-[0.12em] text-heading">Instagram</span>
          <span className="mt-2 flex items-center gap-4 text-[14px] text-muted transition-colors group-hover:text-heading">
            {label || "Visitar perfil"}
            <ArrowIcon className="h-3 w-10 transition-transform duration-300 group-hover:translate-x-1" />
          </span>
        </span>
      </span>
    </a>
  );
}
