"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Briefcase, ExternalLink, Eye, EyeOff, GripVertical, Images, Pencil, Plus, Search, Star, Trash2 } from "lucide-react";
import { api } from "@/lib/client/api";
import { PROJECT_STATUS, STATUS_TONE } from "@/lib/content/options";
import { slugify } from "@/lib/content/sanitize";
import { cn } from "@/lib/utils";
import { thumb } from "./ImageFields";
import { Badge, Button, Card, EmptyState, ErrorList, Field, Modal, MoveButtons, moveItem, PageHeader, TextInput, useConfirm, useDragSort, useToast } from "./ui";

export function BrandsList({ initialProjects, openCreate = false }) {
  const router = useRouter();
  const toast = useToast();
  const confirm = useConfirm();
  const [projects, setProjects] = useState(initialProjects);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [busy, setBusy] = useState(null);
  const [creating, setCreating] = useState(openCreate);
  const [draft, setDraft] = useState({ clientName: "", industry: "" });
  const [createErrors, setCreateErrors] = useState([]);
  const [saving, setSaving] = useState(false);

  const filtered = useMemo(() => {
    const text = query.trim().toLowerCase();
    return projects.filter(
      (project) =>
        (filter === "all" || project.status === filter) &&
        (!text || project.clientName.toLowerCase().includes(text) || project.industry.toLowerCase().includes(text) || project.slug.includes(text))
    );
  }, [projects, query, filter]);
  const canReorder = filter === "all" && !query.trim();

  const counts = useMemo(() => {
    const result = { all: projects.length, published: 0, draft: 0, hidden: 0 };
    for (const project of projects) result[project.status] += 1;
    return result;
  }, [projects]);

  async function reorder(next) {
    const previous = projects;
    setProjects(next);
    try {
      await api("/api/admin/projects/reorder", { method: "POST", body: { ids: next.map((project) => project.id) } });
      toast("Orden guardado. Así se ven en la web.");
    } catch (error) {
      setProjects(previous);
      toast(error.message, "error");
    }
  }
  const sort = useDragSort(projects, reorder);

  async function patch(project, body, message) {
    setBusy(project.id);
    try {
      const result = await api(`/api/admin/projects/${project.id}`, { method: "PATCH", body });
      setProjects((current) => current.map((item) => (item.id === project.id ? { ...item, ...result.project } : item)));
      toast(message);
    } catch (error) {
      toast(error.message, "error");
    } finally {
      setBusy(null);
    }
  }

  async function remove(project) {
    const ok = await confirm({
      title: `¿Eliminar «${project.clientName}»?`,
      message: `Se borra la marca con sus ${project.sectionCount} secciones y deja de verse en la web. Las fotos siguen guardadas en Cloudinary. Si solo querés sacarla de la web por un tiempo, usá «Ocultar». Esta acción no se puede deshacer.`,
      confirmLabel: "Eliminar definitivamente",
      danger: true
    });
    if (!ok) return;
    setBusy(project.id);
    try {
      await api(`/api/admin/projects/${project.id}`, { method: "DELETE" });
      setProjects((current) => current.filter((item) => item.id !== project.id));
      toast(`«${project.clientName}» se eliminó.`);
    } catch (error) {
      toast(error.message, "error");
    } finally {
      setBusy(null);
    }
  }

  async function create(event) {
    event.preventDefault();
    setSaving(true);
    setCreateErrors([]);
    try {
      const result = await api("/api/admin/projects", { method: "POST", body: draft });
      toast("Marca creada como borrador. Completá su contenido.");
      router.push(`/admin/marcas/${result.project.id}`);
    } catch (error) {
      setCreateErrors(error.messages || [error.message]);
      setSaving(false);
    }
  }

  const tabs = [
    ["all", "Todas"],
    ["published", "Publicadas"],
    ["draft", "Borradores"],
    ["hidden", "Ocultas"]
  ];

  return (
    <>
      <PageHeader
        eyebrow="Marcas y trabajos"
        title="Marcas"
        description="Cada marca tiene su tarjeta en Clientes y en el inicio, y su propia página con campañas, fotos y reels. El orden de esta lista es el orden de la web."
        actions={
          <Button onClick={() => setCreating(true)}>
            <Plus className="h-4 w-4" aria-hidden="true" /> Nueva marca
          </Button>
        }
      />

      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap gap-1.5" role="tablist" aria-label="Filtrar por estado">
          {tabs.map(([key, label]) => (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={filter === key}
              onClick={() => setFilter(key)}
              className={cn(
                "rounded-full px-3.5 py-2 text-[13px] font-bold transition-colors",
                filter === key ? "bg-tinta text-crema" : "bg-white text-tinta hover:bg-tinta/5"
              )}
            >
              {label} <span className="opacity-60">{counts[key]}</span>
            </button>
          ))}
        </div>
        <label className="relative block md:w-72">
          <span className="sr-only">Buscar marcas</span>
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden="true" />
          <TextInput value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar por nombre o rubro" className="pl-10" />
        </label>
      </div>

      {!projects.length ? (
        <EmptyState
          icon={Briefcase}
          title="Todavía no hay marcas"
          text="Creá la primera: le ponés nombre, subís la portada y armás su página con plantillas."
          action={
            <Button onClick={() => setCreating(true)}>
              <Plus className="h-4 w-4" aria-hidden="true" /> Nueva marca
            </Button>
          }
        />
      ) : !filtered.length ? (
        <EmptyState icon={Search} title="No encontramos marcas con ese filtro" text="Probá con otra búsqueda o mirá todas." />
      ) : (
        <>
          {!canReorder ? <p className="mb-3 text-[13px] text-muted">Para cambiar el orden, volvé a «Todas» y borrá la búsqueda.</p> : null}
          <ul className="grid grid-cols-1 gap-2.5">
            {filtered.map((project) => {
              const index = projects.indexOf(project);
              return (
                <li key={project.id} {...(canReorder ? sort.handlers(index) : {})}>
                  <Card
                    className={cn(
                      "flex flex-col gap-3 p-3 transition-shadow sm:flex-row sm:items-center sm:gap-4",
                      sort.overIndex === index && "ring-2 ring-periwinkle",
                      busy === project.id && "opacity-60"
                    )}
                  >
                    <div className="flex min-w-0 flex-1 items-center gap-3">
                      {canReorder ? (
                        <span className="hidden cursor-grab text-tinta/30 sm:block" title="Arrastrá para ordenar" aria-hidden="true">
                          <GripVertical className="h-5 w-5" />
                        </span>
                      ) : null}
                      <span className="w-6 text-center font-mono text-[12px] text-muted">{String(index + 1).padStart(2, "0")}</span>
                      <Link href={`/admin/marcas/${project.id}`} className="relative block h-16 w-14 shrink-0 overflow-hidden rounded-lg bg-arena">
                        {project.coverUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={thumb(project.coverUrl, 160)} alt="" className="h-full w-full object-cover" />
                        ) : (
                          <Images className="absolute inset-0 m-auto h-5 w-5 text-tinta/30" aria-hidden="true" />
                        )}
                      </Link>
                      <div className="min-w-0">
                        <Link href={`/admin/marcas/${project.id}`} className="block truncate font-display text-[17px] font-bold hover:underline">
                          {project.clientName}
                        </Link>
                        <p className="truncate text-[13px] text-muted">
                          {project.industry || "Sin rubro"} · {project.sectionCount} {project.sectionCount === 1 ? "sección" : "secciones"} · {project.imageCount} fotos
                        </p>
                        <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                          <Badge tone={STATUS_TONE[project.status]}>{PROJECT_STATUS[project.status]}</Badge>
                          {project.featured ? (
                            <Badge tone="neutral">
                              <Star className="h-3 w-3 fill-current" aria-hidden="true" /> En el inicio
                            </Badge>
                          ) : null}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-1 sm:justify-end">
                      {canReorder ? <MoveButtons index={index} total={projects.length} onMove={(from, to) => reorder(moveItem(projects, from, to))} label={project.clientName} /> : null}
                      <button
                        type="button"
                        onClick={() => patch(project, { featured: !project.featured }, project.featured ? "Ya no se destaca en el inicio." : "Destacada en el inicio.")}
                        disabled={busy === project.id}
                        className={cn("grid h-9 w-9 place-items-center rounded-full hover:bg-tinta/5", project.featured ? "text-[#c98a00]" : "text-tinta/40")}
                        title={project.featured ? "Quitar de destacadas del inicio" : "Destacar en el inicio"}
                        aria-label={project.featured ? `Quitar ${project.clientName} de destacadas` : `Destacar ${project.clientName} en el inicio`}
                        aria-pressed={project.featured}
                      >
                        <Star className={cn("h-4 w-4", project.featured && "fill-current")} aria-hidden="true" />
                      </button>
                      {project.status === "published" ? (
                        <Button variant="secondary" size="sm" disabled={busy === project.id} onClick={() => patch(project, { status: "hidden" }, `«${project.clientName}» ya no se ve en la web.`)}>
                          <EyeOff className="h-3.5 w-3.5" aria-hidden="true" /> Ocultar
                        </Button>
                      ) : (
                        <Button variant="accent" size="sm" disabled={busy === project.id} onClick={() => patch(project, { status: "published" }, `«${project.clientName}» está publicada.`)}>
                          <Eye className="h-3.5 w-3.5" aria-hidden="true" /> Publicar
                        </Button>
                      )}
                      <Link href={`/admin/marcas/${project.id}`} className="inline-flex h-9 items-center gap-1.5 rounded-full bg-tinta px-3.5 text-[13px] font-bold text-crema hover:bg-cacao">
                        <Pencil className="h-3.5 w-3.5" aria-hidden="true" /> Editar
                      </Link>
                      {project.status === "published" ? (
                        <a
                          href={`/clientes/${project.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="grid h-9 w-9 place-items-center rounded-full text-tinta/70 hover:bg-tinta/5"
                          title="Ver en la web"
                          aria-label={`Ver ${project.clientName} en la web`}
                        >
                          <ExternalLink className="h-4 w-4" aria-hidden="true" />
                        </a>
                      ) : null}
                      <button
                        type="button"
                        onClick={() => remove(project)}
                        disabled={busy === project.id}
                        className="grid h-9 w-9 place-items-center rounded-full text-[#c23434] hover:bg-watermelon/10"
                        title="Eliminar"
                        aria-label={`Eliminar ${project.clientName}`}
                      >
                        <Trash2 className="h-4 w-4" aria-hidden="true" />
                      </button>
                    </div>
                  </Card>
                </li>
              );
            })}
          </ul>
        </>
      )}

      <Modal open={creating} onClose={() => !saving && setCreating(false)} title="Nueva marca">
        <form onSubmit={create} className="grid grid-cols-1 gap-4">
          <Field label="Nombre de la marca" required htmlFor="new-brand-name" help={draft.clientName ? `Su página va a ser /clientes/${slugify(draft.clientName) || "…"}` : undefined}>
            <TextInput
              id="new-brand-name"
              autoFocus
              maxLength={80}
              value={draft.clientName}
              onChange={(event) => setDraft((current) => ({ ...current, clientName: event.target.value }))}
              placeholder="Ej: Café Lumière"
            />
          </Field>
          <Field label="Rubro" htmlFor="new-brand-industry" help="Opcional. Ej: Cafetería de especialidad.">
            <TextInput id="new-brand-industry" maxLength={80} value={draft.industry} onChange={(event) => setDraft((current) => ({ ...current, industry: event.target.value }))} />
          </Field>
          <ErrorList messages={createErrors} />
          <p className="text-[13px] text-muted">Se crea como borrador: no aparece en la web hasta que la publiques.</p>
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button variant="secondary" onClick={() => setCreating(false)} disabled={saving}>
              Cancelar
            </Button>
            <Button type="submit" loading={saving} disabled={!draft.clientName.trim()}>
              Crear y continuar
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
