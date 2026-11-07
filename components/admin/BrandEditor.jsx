"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, ChevronDown, Copy, ExternalLink, Eye, EyeOff, GripVertical, Plus, Trash2 } from "lucide-react";
import { api } from "@/lib/client/api";
import { PROJECT_STATUS, SECTION_TEMPLATES, STATUS_TONE, templateById, templateFor } from "@/lib/content/options";
import { isValidSlug, slugify } from "@/lib/content/sanitize";
import { cn } from "@/lib/utils";
import { GalleryField, ImageField } from "./ImageFields";
import { TagsInput } from "./SchemaForm";
import { Badge, Button, Card, ErrorList, Field, Modal, MoveButtons, moveItem, SaveBar, TextArea, TextInput, Toggle, useConfirm, useDragSort, useToast, useUnsavedWarning } from "./ui";

const newId = () => (crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`);

function toEditable(project) {
  return {
    clientName: project.clientName,
    slug: project.slug,
    industry: project.industry,
    summary: project.summary,
    services: project.services,
    coverUrl: project.coverUrl,
    videosHeading: project.videosHeading,
    instagramUrl: project.instagramUrl,
    instagramLabel: project.instagramLabel,
    instagramImageUrl: project.instagramImageUrl,
    featured: project.featured,
    status: project.status,
    sections: project.sections.map((section) => ({
      id: section.id,
      template: templateFor(section.kind, section.layout).id,
      title: section.title,
      description: section.description,
      linkUrl: section.linkUrl,
      media: section.media.map((item) => ({ url: item.url, alt: item.alt || "" })),
      visible: section.visible
    }))
  };
}

// Mini esquema visual de cada plantilla (para elegir sin saber de diseño).
export function TemplatePreview({ id, className }) {
  const box = "rounded-[3px] bg-tinta/25";
  const shapes = {
    grid: (
      <div className="grid h-full grid-cols-3 gap-1">
        <div className="grid gap-1">
          <span className={cn(box, "h-7")} />
          <span className={cn(box, "h-4")} />
        </div>
        <div className="grid gap-1">
          <span className={cn(box, "h-4")} />
          <span className={cn(box, "h-7")} />
        </div>
        <div className="grid gap-1">
          <span className={cn(box, "h-6")} />
          <span className={cn(box, "h-5")} />
        </div>
      </div>
    ),
    square: (
      <div className="flex h-full items-center justify-center gap-1">
        {Array.from({ length: 4 }, (_, index) => (
          <span key={index} className={cn(box, "aspect-square h-full max-h-9")} />
        ))}
      </div>
    ),
    row: (
      <div className="grid h-full grid-cols-5 items-center gap-1">
        {Array.from({ length: 5 }, (_, index) => (
          <span key={index} className={cn(box, "h-8")} />
        ))}
      </div>
    ),
    single: <span className={cn(box, "block h-full")} />,
    feature: (
      <div className="grid h-full grid-cols-[1.4fr_1fr] items-center gap-2">
        <span className={cn(box, "h-full")} />
        <div className="grid gap-1">
          <span className="h-1.5 rounded bg-tinta/40" />
          <span className="h-1.5 rounded bg-tinta/25" />
          <span className="h-1.5 w-2/3 rounded bg-tinta/25" />
        </div>
      </div>
    ),
    video: (
      <div className="grid h-full grid-cols-3 gap-1.5">
        {Array.from({ length: 3 }, (_, index) => (
          <span key={index} className="relative rounded-[3px] bg-cacao">
            <span className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-watermelon" />
          </span>
        ))}
      </div>
    ),
    text: (
      <div className="grid h-full grid-cols-[1fr_2fr] gap-2 pt-1">
        <span className="h-2.5 rounded bg-tinta/50" />
        <div className="grid content-start gap-1">
          <span className="h-1.5 rounded bg-tinta/25" />
          <span className="h-1.5 rounded bg-tinta/25" />
          <span className="h-1.5 w-1/2 rounded bg-tinta/25" />
        </div>
      </div>
    )
  };
  return <div className={cn("h-14 w-full overflow-hidden rounded-lg bg-arena p-2", className)}>{shapes[id]}</div>;
}

function SectionCard({ section, index, total, expanded, onToggle, onChange, onMove, onDuplicate, onRemove, dragOver }) {
  const template = templateById(section.template);
  const imageCount = section.media.length;
  const summary =
    section.title ||
    (template.kind === "text" ? section.description.slice(0, 60) : "") ||
    (template.images.max ? `${imageCount} ${imageCount === 1 ? "foto" : "fotos"}` : "Sin título");

  return (
    <Card className={cn("overflow-hidden", dragOver && "ring-2 ring-periwinkle", !section.visible && "bg-white/60")}>
        <div className="flex items-center gap-2 p-2 pr-1.5 sm:gap-3 sm:p-3">
          <span className="hidden cursor-grab text-tinta/30 sm:block" title="Arrastrá para ordenar" aria-hidden="true">
            <GripVertical className="h-5 w-5" />
          </span>
          <button type="button" onClick={onToggle} className="flex min-w-0 flex-1 items-center gap-3 text-left" aria-expanded={expanded}>
            <TemplatePreview id={template.id} className="hidden h-11 w-16 shrink-0 p-1.5 sm:block" />
            <span className="min-w-0">
              <span className="mono-label block text-muted">
                {String(index + 1).padStart(2, "0")} · {template.label}
              </span>
              <span className={cn("mt-1 block truncate font-display text-[15px] font-bold", !section.visible && "text-tinta/50")}>{summary}</span>
            </span>
            {!section.visible ? <Badge tone="hidden">Oculta</Badge> : null}
            <ChevronDown className={cn("ml-auto h-4 w-4 shrink-0 transition-transform", expanded && "rotate-180")} aria-hidden="true" />
          </button>
          <div className="flex shrink-0 items-center">
            <button
              type="button"
              onClick={() => onChange({ visible: !section.visible })}
              className="grid h-8 w-8 place-items-center rounded-full text-tinta/70 hover:bg-tinta/5"
              title={section.visible ? "Ocultar sección" : "Mostrar sección"}
              aria-label={section.visible ? "Ocultar sección" : "Mostrar sección"}
              aria-pressed={!section.visible}
            >
              {section.visible ? <Eye className="h-4 w-4" aria-hidden="true" /> : <EyeOff className="h-4 w-4" aria-hidden="true" />}
            </button>
            <MoveButtons index={index} total={total} onMove={onMove} label="sección" />
            <button type="button" onClick={onDuplicate} className="hidden h-8 w-8 place-items-center rounded-full text-tinta/70 hover:bg-tinta/5 sm:grid" title="Duplicar" aria-label="Duplicar sección">
              <Copy className="h-4 w-4" aria-hidden="true" />
            </button>
            <button type="button" onClick={onRemove} className="grid h-8 w-8 place-items-center rounded-full text-[#c23434] hover:bg-watermelon/10" title="Eliminar" aria-label="Eliminar sección">
              <Trash2 className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>

        {expanded ? (
          <div className="grid grid-cols-1 gap-5 border-t border-line p-4 sm:p-5">
            <p className="rounded-xl bg-arena px-4 py-3 text-[13px] text-tinta/80">
              <strong>{template.label}:</strong> {template.description}
            </p>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Field label={template.kind === "video" ? "Título del reel" : "Título"} help={template.kind === "gallery" ? "Opcional. Ej: el nombre de la campaña." : undefined}>
                <TextInput value={section.title} maxLength={120} onChange={(event) => onChange({ title: event.target.value })} />
              </Field>
              {template.link ? (
                <Field label="Link del reel o video" required help="Instagram, TikTok, YouTube…">
                  <TextInput type="url" placeholder="https://www.instagram.com/reel/…" value={section.linkUrl} maxLength={600} onChange={(event) => onChange({ linkUrl: event.target.value })} />
                </Field>
              ) : null}
              {template.text ? (
                <Field
                  label={template.kind === "text" ? "Texto" : "Descripción"}
                  className="sm:col-span-2"
                  help="Podés usar **negrita** y *cursiva*. Dejá una línea en blanco para separar párrafos."
                >
                  <TextArea rows={template.kind === "text" ? 6 : 3} maxLength={3000} value={section.description} onChange={(event) => onChange({ description: event.target.value })} />
                </Field>
              ) : null}
            </div>
            {template.images.max > 0 ? (
              <Field label={template.images.max === 1 ? (template.kind === "video" ? "Portada del reel" : "Foto") : "Fotos"} required={template.images.min > 0}>
                <GalleryField value={section.media} onChange={(media) => onChange({ media })} scope="projects" max={template.images.max} square={template.id === "square"} />
              </Field>
            ) : null}
            <Toggle checked={section.visible} onChange={(visible) => onChange({ visible })} label="Mostrar esta sección en la web" />
          </div>
        ) : null}
    </Card>
  );
}

export function BrandEditor({ initialProject }) {
  const router = useRouter();
  const toast = useToast();
  const confirm = useConfirm();
  const [project, setProject] = useState(initialProject);
  const [saved, setSaved] = useState(() => toEditable(initialProject));
  const [value, setValue] = useState(() => toEditable(initialProject));
  const [expanded, setExpanded] = useState([]);
  const [picker, setPicker] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState([]);
  const [slugLocked, setSlugLocked] = useState(true);
  const dirty = JSON.stringify(value) !== JSON.stringify(saved);
  useUnsavedWarning(dirty);

  const set = (patch) => setValue((current) => ({ ...current, ...patch }));
  const setSections = (sections) => set({ sections });
  const updateSection = (id, patch) => setValue((current) => ({ ...current, sections: current.sections.map((section) => (section.id === id ? { ...section, ...patch } : section)) }));
  const sort = useDragSort(value.sections, setSections);
  const hasVideos = value.sections.some((section) => section.template === "video");

  function addSection(templateId) {
    const id = newId();
    setSections([...value.sections, { id, template: templateId, title: "", description: "", linkUrl: "", media: [], visible: true }]);
    setExpanded((current) => [...current, id]);
    setPicker(false);
    setTimeout(() => document.getElementById(`section-${id}`)?.scrollIntoView({ behavior: "smooth", block: "center" }), 60);
  }

  async function save(overrides = {}) {
    const body = { ...value, ...overrides, updatedAt: project.updatedAt };
    setSaving(true);
    setErrors([]);
    try {
      const result = await api(`/api/admin/projects/${project.id}`, { method: "PUT", body });
      const editable = toEditable(result.project);
      setProject(result.project);
      setSaved(editable);
      setValue(editable);
      toast(
        result.project.status === "published"
          ? "Guardado. Los cambios ya se ven en la web."
          : result.project.status === "draft"
            ? "Borrador guardado. Todavía no se ve en la web."
            : "Guardado. La marca está oculta en la web."
      );
    } catch (error) {
      setErrors(error.messages || [error.message]);
      toast(error.messages?.length > 1 ? "Hay datos para revisar antes de guardar." : error.message, "error");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setSaving(false);
    }
  }

  async function removeBrand() {
    const ok = await confirm({
      title: `¿Eliminar «${project.clientName}»?`,
      message: "Se borra la marca con todas sus secciones y deja de verse en la web. Las fotos siguen guardadas en Cloudinary. Si solo querés sacarla de la web, cambiá el estado a «Oculta». No se puede deshacer.",
      confirmLabel: "Eliminar definitivamente",
      danger: true
    });
    if (!ok) return;
    try {
      await api(`/api/admin/projects/${project.id}`, { method: "DELETE" });
      toast(`«${project.clientName}» se eliminó.`);
      setSaved(value);
      router.push("/admin/marcas");
      router.refresh();
    } catch (error) {
      toast(error.message, "error");
    }
  }

  const slugPreview = slugify(value.slug || value.clientName);
  const paragraphs = value.summary.split(/\n{2,}/).filter((item) => item.trim()).length;

  return (
    <>
      <div className="mb-6">
        <Link href="/admin/marcas" className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-muted hover:text-tinta">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Marcas
        </Link>
        <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            <p className="mono-label text-[#c23434]">Editar marca</p>
            <h1 className="mt-2 truncate font-display text-[28px] font-black leading-tight sm:text-[34px]">{value.clientName || "Sin nombre"}</h1>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <Badge tone={STATUS_TONE[project.status]}>{PROJECT_STATUS[project.status]}</Badge>
              <span className="text-[13px] text-muted">/clientes/{project.slug}</span>
            </div>
          </div>
          {project.status === "published" ? (
            <a
              href={`/clientes/${project.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-9 items-center gap-1.5 self-start rounded-full border border-tinta/20 bg-white px-3.5 text-[13px] font-bold hover:border-tinta sm:self-auto"
            >
              Ver en la web <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
            </a>
          ) : null}
        </div>
      </div>

      <ErrorList messages={errors} className="mb-5" />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-start">
        <div className="grid min-w-0 grid-cols-1 gap-5">
          <Card className="p-5 sm:p-6">
            <h2 className="mb-5 font-display text-[18px] font-black">Datos de la marca</h2>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Field label="Nombre" required htmlFor="brand-name">
                <TextInput
                  id="brand-name"
                  maxLength={80}
                  value={value.clientName}
                  onChange={(event) => set({ clientName: event.target.value, ...(slugLocked && project.status !== "published" ? { slug: slugify(event.target.value) } : {}) })}
                />
              </Field>
              <Field label="Rubro" htmlFor="brand-industry" help="Ej: Hamburguesería. Aparece en la tarjeta y en la página.">
                <TextInput id="brand-industry" maxLength={80} value={value.industry} onChange={(event) => set({ industry: event.target.value })} />
              </Field>
              <Field
                label="Dirección de la página"
                htmlFor="brand-slug"
                className="sm:col-span-2"
                error={value.slug && !isValidSlug(slugPreview) ? "Solo letras minúsculas, números y guiones." : undefined}
                help={
                  slugPreview !== project.slug && project.status === "published"
                    ? `Al guardar, /clientes/${project.slug} va a redirigir a /clientes/${slugPreview}.`
                    : "Se usa en el link de la marca. Conviene no cambiarla una vez publicada."
                }
              >
                <div className="flex items-center gap-2">
                  <span className="hidden text-[14px] text-muted sm:inline">/clientes/</span>
                  <TextInput
                    id="brand-slug"
                    maxLength={60}
                    value={value.slug}
                    onChange={(event) => {
                      setSlugLocked(false);
                      set({ slug: event.target.value.toLowerCase().replace(/\s+/g, "-") });
                    }}
                    onBlur={() => set({ slug: slugify(value.slug || value.clientName) })}
                  />
                </div>
              </Field>
              <Field
                label="Descripción"
                htmlFor="brand-summary"
                className="sm:col-span-2"
                help={`El primer párrafo se muestra arriba, junto al nombre; los siguientes, en el bloque «El trabajo». Podés usar **negrita**. ${paragraphs ? `(${paragraphs} ${paragraphs === 1 ? "párrafo" : "párrafos"})` : ""}`}
              >
                <TextArea id="brand-summary" rows={6} maxLength={4000} value={value.summary} onChange={(event) => set({ summary: event.target.value })} />
              </Field>
              <Field label="Servicios que hicimos" className="sm:col-span-2" help="Ej: Gestión de redes, Fotografía, Reels. Escribí y apretá Enter.">
                <TagsInput value={value.services} onChange={(services) => set({ services })} max={60} maxItems={12} />
              </Field>
            </div>
          </Card>

          <Card className="p-5 sm:p-6">
            <h2 className="font-display text-[18px] font-black">Portada</h2>
            <p className="mt-1 text-[14px] text-muted">Se usa en la tarjeta de Clientes, en el inicio y arriba de la página de la marca. Mejor vertical (4:5). Obligatoria para publicar.</p>
            <div className="mt-4 max-w-[280px]">
              <ImageField value={value.coverUrl} onChange={(coverUrl) => set({ coverUrl })} scope="projects" aspect="aspect-[4/5]" label="portada" />
            </div>
          </Card>

          <Card className="p-5 sm:p-6">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2 className="font-display text-[18px] font-black">Secciones de la página</h2>
                <p className="mt-1 max-w-xl text-[14px] text-muted">Campañas, galerías, reels y textos. Elegí un diseño y completá el contenido: se adapta solo a computadora y celular.</p>
              </div>
              <Button onClick={() => setPicker(true)}>
                <Plus className="h-4 w-4" aria-hidden="true" /> Agregar sección
              </Button>
            </div>

            {hasVideos ? (
              <Field label="Título del bloque de reels" htmlFor="videos-heading" help="Los reels se agrupan en un bloque oscuro arriba de las galerías." className="mt-5 max-w-md">
                <TextInput id="videos-heading" maxLength={80} placeholder="Reels destacados" value={value.videosHeading} onChange={(event) => set({ videosHeading: event.target.value })} />
              </Field>
            ) : null}

            {value.sections.length ? (
              <>
                <div className="mt-5 flex flex-wrap justify-end gap-2 text-[13px]">
                  <button type="button" className="font-semibold text-muted hover:text-tinta" onClick={() => setExpanded(value.sections.map((section) => section.id))}>
                    Abrir todas
                  </button>
                  <span className="text-tinta/20">·</span>
                  <button type="button" className="font-semibold text-muted hover:text-tinta" onClick={() => setExpanded([])}>
                    Cerrar todas
                  </button>
                </div>
                <ul className="mt-2 grid grid-cols-1 gap-2.5">
                  {value.sections.map((section, index) => (
                    <li key={section.id} id={`section-${section.id}`} {...(expanded.includes(section.id) ? {} : sort.handlers(index))}>
                      <SectionCard
                        section={section}
                        index={index}
                        total={value.sections.length}
                        expanded={expanded.includes(section.id)}
                        onToggle={() => setExpanded((current) => (current.includes(section.id) ? current.filter((id) => id !== section.id) : [...current, section.id]))}
                        onChange={(patch) => updateSection(section.id, patch)}
                        onMove={(from, to) => setSections(moveItem(value.sections, from, to))}
                        onDuplicate={() => {
                          const copy = { ...structuredClone(section), id: newId(), title: section.title ? `${section.title} (copia)` : "" };
                          setSections([...value.sections.slice(0, index + 1), copy, ...value.sections.slice(index + 1)]);
                          setExpanded((current) => [...current, copy.id]);
                        }}
                        onRemove={async () => {
                          const ok = await confirm({
                            title: "¿Eliminar esta sección?",
                            message: "Se quita de la página de la marca al guardar. Las fotos siguen guardadas en Cloudinary. Si solo querés esconderla, usá el ojito.",
                            confirmLabel: "Eliminar sección",
                            danger: true
                          });
                          if (ok) setSections(value.sections.filter((item) => item.id !== section.id));
                        }}
                        dragOver={sort.overIndex === index}
                      />
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <div className="mt-5 rounded-2xl border border-dashed border-tinta/20 px-6 py-10 text-center">
                <p className="font-display text-[16px] font-bold">Todavía no hay secciones</p>
                <p className="mt-1 text-[14px] text-muted">Agregá una galería, un reel o un texto de campaña.</p>
                <Button className="mt-5" variant="secondary" onClick={() => setPicker(true)}>
                  <Plus className="h-4 w-4" aria-hidden="true" /> Agregar la primera sección
                </Button>
              </div>
            )}
          </Card>

          <Card className="p-5 sm:p-6">
            <h2 className="font-display text-[18px] font-black">Instagram de la marca</h2>
            <p className="mt-1 text-[14px] text-muted">Agrega el botón «Su Instagram» y un bloque al final de la página.</p>
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <Field label="Link del perfil" htmlFor="ig-url">
                <TextInput id="ig-url" type="url" placeholder="https://www.instagram.com/marca/" maxLength={600} value={value.instagramUrl} onChange={(event) => set({ instagramUrl: event.target.value })} />
              </Field>
              <Field label="Texto del bloque" htmlFor="ig-label" help="Ej: Seguí a Angus en Instagram">
                <TextInput id="ig-label" maxLength={60} value={value.instagramLabel} onChange={(event) => set({ instagramLabel: event.target.value })} />
              </Field>
              <Field label="Foto del bloque" className="sm:col-span-2">
                <div className="max-w-xs">
                  <ImageField value={value.instagramImageUrl} onChange={(instagramImageUrl) => set({ instagramImageUrl })} scope="projects" aspect="aspect-[4/3]" label="foto" />
                </div>
              </Field>
            </div>
          </Card>
        </div>

        <aside className="grid grid-cols-1 gap-5 lg:sticky lg:top-6">
          <Card className="p-5">
            <h2 className="font-display text-[16px] font-black">Publicación</h2>
            <div role="radiogroup" aria-label="Estado" className="mt-4 grid gap-2">
              {[
                ["published", "Publicada", "Se ve en Clientes, en el inicio y en su página."],
                ["draft", "Borrador", "Solo la ven ustedes en el panel."],
                ["hidden", "Oculta", "Sale de la web sin borrarse. Se puede volver a publicar."]
              ].map(([status, label, text]) => (
                <label
                  key={status}
                  className={cn(
                    "flex cursor-pointer gap-3 rounded-xl border p-3 transition-colors",
                    value.status === status ? "border-tinta bg-tinta/[0.03]" : "border-tinta/10 hover:border-tinta/30"
                  )}
                >
                  <input type="radio" name="status" value={status} checked={value.status === status} onChange={() => set({ status })} className="mt-1 accent-tinta" />
                  <span>
                    <span className="block text-[14px] font-bold">{label}</span>
                    <span className="block text-[12px] leading-snug text-muted">{text}</span>
                  </span>
                </label>
              ))}
            </div>
            <div className="mt-5 border-t border-line pt-4">
              <Toggle checked={value.featured} onChange={(featured) => set({ featured })} label="Destacada en el inicio" description="Aparece en «Clientes» de la página principal." />
            </div>
          </Card>
          <Card className="p-5">
            <h2 className="font-display text-[16px] font-black">Resumen</h2>
            <dl className="mt-3 grid grid-cols-2 gap-3 text-[13px]">
              <div>
                <dt className="text-muted">Secciones</dt>
                <dd className="font-display text-[22px] font-black">{value.sections.length}</dd>
              </div>
              <div>
                <dt className="text-muted">Fotos</dt>
                <dd className="font-display text-[22px] font-black">{value.sections.reduce((total, section) => total + section.media.length, 0)}</dd>
              </div>
            </dl>
            <Button variant="danger-ghost" size="sm" className="mt-4 -ml-2" onClick={removeBrand}>
              <Trash2 className="h-3.5 w-3.5" aria-hidden="true" /> Eliminar marca
            </Button>
          </Card>
        </aside>
      </div>

      <SaveBar
        dirty={dirty}
        saving={saving}
        onSave={() => save()}
        onDiscard={() => setValue(saved)}
        savedAt={project.updatedAt}
        saveLabel={value.status === "published" ? "Guardar y publicar" : "Guardar"}
      >
        {value.status !== "published" ? (
          <Button variant="accent" size="sm" onClick={() => save({ status: "published" })} disabled={saving}>
            <Eye className="h-3.5 w-3.5" aria-hidden="true" /> Guardar y publicar
          </Button>
        ) : null}
      </SaveBar>

      <Modal open={picker} onClose={() => setPicker(false)} title="Elegí el diseño de la sección" size="xl">
        <p className="-mt-1 mb-4 text-[14px] text-muted">Todos respetan la identidad de CoFi y se adaptan solos al celular.</p>
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {SECTION_TEMPLATES.map((template) => (
            <li key={template.id}>
              <button
                type="button"
                onClick={() => addSection(template.id)}
                className="flex h-full w-full flex-col gap-3 rounded-2xl border border-tinta/10 bg-white p-3 text-left transition-colors hover:border-tinta focus-visible:border-tinta"
              >
                <TemplatePreview id={template.id} className="h-20" />
                <span>
                  <span className="block font-display text-[15px] font-bold">{template.label}</span>
                  <span className="mt-1 block text-[13px] leading-snug text-muted">{template.description}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </Modal>
    </>
  );
}
