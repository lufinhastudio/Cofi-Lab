import Image from "next/image";
import { PlayIcon } from "./icons";

export function VideoCard({ title, url, image }) {
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className="group block text-center">
      <span className="relative block aspect-[3/4] overflow-hidden bg-sand">
        {image ? (
          <Image src={image} alt={title} fill sizes="(min-width: 768px) 30vw, 90vw" className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]" />
        ) : null}
        <span className="absolute inset-0 bg-black/0 transition-colors duration-500 group-hover:bg-black/15" aria-hidden="true" />
        <span className="absolute left-1/2 top-1/2 grid h-14 w-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white/85 text-heading opacity-90 shadow-sm backdrop-blur transition-all duration-500 group-hover:scale-110 group-hover:opacity-100" aria-hidden="true">
          <PlayIcon className="ml-0.5 h-5 w-5" />
        </span>
      </span>
      <span className="mt-6 block font-display text-[17px] font-normal text-heading">{title}</span>
      <span className="label mt-2 block transition-colors group-hover:text-heading">Ver video</span>
    </a>
  );
}
