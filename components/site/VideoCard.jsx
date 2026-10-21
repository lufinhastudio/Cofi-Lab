import Image from "next/image";
import { Play } from "lucide-react";

const tags = ["bg-periwinkle", "bg-lemon", "bg-cantaloupe"];

export function VideoCard({ title, url, image, index = 0 }) {
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className="group block">
      <span className="relative block aspect-[3/4] overflow-hidden bg-crema/10">
        {image ? (
          <Image src={image} alt={title} fill sizes="(min-width: 768px) 30vw, 72vw" className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]" />
        ) : null}
        <span className={`stage-tag absolute left-0 top-0 ${tags[index % tags.length]}`}>EXP_{String(index + 1).padStart(3, "0")}</span>
        <span
          className="absolute left-1/2 top-1/2 grid h-16 w-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-watermelon text-tinta transition-transform duration-500 group-hover:scale-110"
          aria-hidden="true"
        >
          <Play className="ml-0.5 h-6 w-6" strokeWidth={2} fill="currentColor" />
        </span>
      </span>
      <span className="mt-4 flex items-center justify-between gap-3">
        <span className="font-display text-[20px] font-bold">{title}</span>
        <span className="mono-label opacity-70 transition-opacity group-hover:opacity-100">Ver video ↗</span>
      </span>
    </a>
  );
}
