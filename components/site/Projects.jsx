import { ProjectCard } from "./ProjectCard";

export function Projects({ projects }) {
  return (
    <section id="trabajos" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-20">
      <h2 className="font-display text-3xl font-bold sm:text-4xl">Trabajos</h2>
      {projects.length ? (
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <p className="mt-6 text-muted">Pronto vas a ver nuestros trabajos acá.</p>
      )}
    </section>
  );
}
