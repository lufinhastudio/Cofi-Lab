"use client";

import Image from "next/image";
import { useState } from "react";

// Cada trabajo: cliente, imagen principal, tipo de trabajo y descripción.
// Si tiene secciones (campañas), muestra "Ver más" sin salir de la landing.
export function ProjectCard({ project }) {
  const [open, setOpen] = useState(false);
  const hasMore = project.sections.length > 0;

  return (
    <article className="overflow-hidden rounded-3xl border border-black/5 bg-paper">
      <div className="relative aspect-[4/3] bg-black/5">
        {project.coverUrl ? (
          <Image src={project.coverUrl} alt={project.clientName} fill sizes="(min-width: 640px) 50vw, 100vw" className="object-cover" />
        ) : null}
      </div>
      <div className="p-6">
        {project.workType ? <p className="text-xs uppercase tracking-widest text-muted">{project.workType}</p> : null}
        <h3 className="mt-2 text-xl font-bold">{project.clientName}</h3>
        {project.summary ? <p className="mt-2 text-muted">{project.summary}</p> : null}

        {hasMore ? (
          <>
            <button
              type="button"
              onClick={() => setOpen((value) => !value)}
              aria-expanded={open}
              className="mt-4 text-sm font-semibold underline underline-offset-4"
            >
              {open ? "Ver menos" : "Ver más"}
            </button>
            {open ? (
              <ul className="mt-4 grid gap-4">
                {project.sections.map((section) => (
                  <li key={section.id} className="rounded-2xl bg-white p-4">
                    <p className="font-semibold">{section.title}</p>
                    {section.concept ? <p className="text-sm text-muted">{section.concept}</p> : null}
                    {section.description ? <p className="mt-2 text-sm">{section.description}</p> : null}
                  </li>
                ))}
              </ul>
            ) : null}
          </>
        ) : null}
      </div>
    </article>
  );
}
