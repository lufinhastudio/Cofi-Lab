"use client";

import { useRef, useState } from "react";
import { GripVertical, ImagePlus, Loader2, RefreshCw, Trash2, Upload, ZoomIn } from "lucide-react";
import { uploadImages } from "@/lib/client/uploadImages";
import { cn } from "@/lib/utils";
import { Button, Modal, MoveButtons, moveItem, TextInput, useDragSort, useToast } from "./ui";

const ACCEPT = "image/jpeg,image/png,image/webp";

// Miniatura optimizada por Cloudinary para el panel (no se baja la foto completa).
// Usa los mismos anchos y el mismo formato de URL que la web (next.config.mjs +
// lib/imageLoader.js): así reutiliza las variantes ya generadas y no crea
// transformaciones nuevas en Cloudinary.
const SHARED_WIDTHS = [256, 384, 640, 960, 1280, 1600, 1920];
export function thumb(url, width = 480) {
  if (!url) return "";
  const marker = "/image/upload/";
  if (url.includes("res.cloudinary.com") && url.includes(marker)) {
    const [base, rest] = url.split(marker);
    const snapped = SHARED_WIDTHS.find((size) => size >= width) || SHARED_WIDTHS.at(-1);
    return `${base}${marker}f_auto,q_auto,c_limit,w_${snapped}/${rest}`;
  }
  return url;
}

function useDropZone(onFiles, disabled) {
  const [over, setOver] = useState(false);
  return {
    over,
    props: {
      onDragOver: (event) => {
        if (disabled || !event.dataTransfer?.types?.includes("Files")) return;
        event.preventDefault();
        setOver(true);
      },
      onDragLeave: () => setOver(false),
      onDrop: (event) => {
        if (disabled || !event.dataTransfer?.files?.length) return;
        event.preventDefault();
        setOver(false);
        onFiles(event.dataTransfer.files);
      }
    }
  };
}

// Una sola imagen: vista previa, subir, reemplazar y quitar.
export function ImageField({ value, onChange, scope = "projects", aspect = "aspect-[4/3]", label = "imagen", className }) {
  const input = useRef(null);
  const toast = useToast();
  const [uploading, setUploading] = useState(false);
  const [localPreview, setLocalPreview] = useState("");
  const [zoom, setZoom] = useState(false);

  async function handleFiles(files) {
    const file = files?.[0];
    if (!file) return;
    setUploading(true);
    setLocalPreview(URL.createObjectURL(file));
    try {
      const [result] = await uploadImages([file], scope);
      onChange(result.url);
      toast("Imagen subida. Recordá guardar los cambios.");
    } catch (error) {
      toast(error.message, "error");
    } finally {
      setUploading(false);
      setLocalPreview("");
      if (input.current) input.current.value = "";
    }
  }

  const drop = useDropZone(handleFiles, uploading);
  const shown = localPreview || value;

  return (
    <div className={cn("grid gap-2", className)}>
      <div
        {...drop.props}
        className={cn(
          "relative overflow-hidden rounded-xl border bg-arena",
          aspect,
          drop.over ? "border-2 border-dashed border-tinta" : "border-tinta/10"
        )}
      >
        {shown ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={localPreview || thumb(value, 900)} alt="" className={cn("h-full w-full object-cover", uploading && "opacity-50")} />
        ) : (
          <button
            type="button"
            onClick={() => input.current?.click()}
            className="flex h-full w-full flex-col items-center justify-center gap-2 p-4 text-center text-[13px] text-muted hover:text-tinta"
          >
            <ImagePlus className="h-7 w-7" strokeWidth={1.5} aria-hidden="true" />
            <span>
              <strong className="font-semibold text-tinta">Subir {label}</strong>
              <br />o arrastrala acá
            </span>
          </button>
        )}
        {uploading ? (
          <span className="absolute inset-0 grid place-items-center">
            <span className="flex items-center gap-2 rounded-full bg-tinta px-3 py-1.5 text-[12px] font-semibold text-crema">
              <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" /> Subiendo…
            </span>
          </span>
        ) : null}
        {value && !uploading ? (
          <button
            type="button"
            onClick={() => setZoom(true)}
            className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full bg-white/90 text-tinta shadow hover:bg-white"
            aria-label="Ver imagen en grande"
          >
            <ZoomIn className="h-4 w-4" aria-hidden="true" />
          </button>
        ) : null}
      </div>
      <input ref={input} type="file" accept={ACCEPT} className="sr-only" tabIndex={-1} onChange={(event) => handleFiles(event.target.files)} />
      <div className="flex flex-wrap gap-2">
        <Button variant="secondary" size="sm" onClick={() => input.current?.click()} disabled={uploading}>
          {value ? <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" /> : <Upload className="h-3.5 w-3.5" aria-hidden="true" />}
          {value ? "Reemplazar" : "Subir"}
        </Button>
        {value ? (
          <Button variant="danger-ghost" size="sm" onClick={() => onChange("")} disabled={uploading}>
            <Trash2 className="h-3.5 w-3.5" aria-hidden="true" /> Quitar
          </Button>
        ) : null}
      </div>
      <Modal open={zoom} onClose={() => setZoom(false)} title="Vista previa" size="xl">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={thumb(value, 1600)} alt="" className="max-h-[70vh] w-full rounded-xl object-contain" />
      </Modal>
    </div>
  );
}

// Varias imágenes: subir de a muchas, ordenar (arrastrar o flechas), descripción y quitar.
// value: [{ url, alt }]
export function GalleryField({ value = [], onChange, scope = "projects", max = 60, square = false }) {
  const input = useRef(null);
  const toast = useToast();
  const [pending, setPending] = useState([]);
  const [editing, setEditing] = useState(null);
  const sort = useDragSort(value, onChange);
  const uploading = pending.length > 0;
  const remaining = Math.max(0, max - value.length);

  async function handleFiles(fileList) {
    const files = Array.from(fileList || []);
    if (!files.length) return;
    if (files.length > remaining) {
      toast(remaining ? `Podés agregar ${remaining} ${remaining === 1 ? "foto más" : "fotos más"} en este diseño.` : "Este diseño ya tiene el máximo de fotos.", "error");
      if (!remaining) return;
    }
    const batch = files.slice(0, remaining);
    const previews = batch.map((file) => URL.createObjectURL(file));
    setPending(previews);
    let collected = [...value];
    try {
      await uploadImages(batch, scope, {
        onUploaded: (result, index) => {
          collected = [...collected, { url: result.url, alt: "" }];
          onChange(collected);
          setPending((current) => current.filter((item) => item !== previews[index]));
        }
      });
      toast(batch.length === 1 ? "Foto subida. Recordá guardar." : `${batch.length} fotos subidas. Recordá guardar.`);
    } catch (error) {
      toast(error.message, "error");
    } finally {
      previews.forEach((url) => URL.revokeObjectURL(url));
      setPending([]);
      if (input.current) input.current.value = "";
    }
  }

  const drop = useDropZone(handleFiles, uploading || !remaining);
  const update = (index, patch) => onChange(value.map((item, itemIndex) => (itemIndex === index ? { ...item, ...patch } : item)));

  return (
    <div {...drop.props} className={cn("rounded-2xl border border-dashed p-3 transition-colors", drop.over ? "border-tinta bg-periwinkle/20" : "border-tinta/15")}>
      {value.length || pending.length ? (
        <ul className={cn("grid gap-3", square ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4" : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5")}>
          {value.map((item, index) => (
            <li
              key={`${item.url}-${index}`}
              {...sort.handlers(index)}
              className={cn(
                "group relative overflow-hidden rounded-xl border bg-white",
                sort.overIndex === index ? "border-tinta ring-2 ring-periwinkle" : "border-tinta/10"
              )}
            >
              <div className="relative aspect-square bg-arena">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={thumb(item.url, 360)} alt={item.alt || ""} className="h-full w-full object-cover" loading="lazy" />
                <span className="absolute left-1.5 top-1.5 rounded-full bg-tinta/80 px-2 py-0.5 font-mono text-[11px] text-crema">{String(index + 1).padStart(2, "0")}</span>
                <span className="absolute right-1.5 top-1.5 hidden cursor-grab rounded-full bg-white/90 p-1 text-tinta sm:block" title="Arrastrá para ordenar" aria-hidden="true">
                  <GripVertical className="h-4 w-4" />
                </span>
              </div>
              <div className="flex items-center justify-between gap-1 px-1 py-1">
                <MoveButtons index={index} total={value.length} onMove={(from, to) => onChange(moveItem(value, from, to))} label="foto" />
                <span className="flex">
                  <button
                    type="button"
                    onClick={() => setEditing(index)}
                    className={cn("rounded-full px-2 py-1 text-[12px] font-semibold hover:bg-tinta/5", item.alt ? "text-tinta" : "text-muted")}
                    title="Descripción para accesibilidad"
                  >
                    Alt
                  </button>
                  <button
                    type="button"
                    onClick={() => onChange(value.filter((_, itemIndex) => itemIndex !== index))}
                    className="grid h-8 w-8 place-items-center rounded-full text-[#c23434] hover:bg-watermelon/10"
                    aria-label={`Quitar foto ${index + 1}`}
                    title="Quitar de la galería"
                  >
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                  </button>
                </span>
              </div>
            </li>
          ))}
          {pending.map((preview) => (
            <li key={preview} className="relative overflow-hidden rounded-xl border border-tinta/10 bg-white">
              <div className="relative aspect-square">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={preview} alt="" className="h-full w-full object-cover opacity-40" />
                <span className="absolute inset-0 grid place-items-center">
                  <Loader2 className="h-6 w-6 animate-spin" aria-label="Subiendo" />
                </span>
              </div>
              <p className="px-2 py-2.5 text-center text-[12px] text-muted">Subiendo…</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="px-2 py-6 text-center text-[13px] text-muted">Todavía no hay fotos. Subilas o arrastralas acá.</p>
      )}

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 px-1">
        <p className="text-[12px] text-muted">
          {value.length} / {max} {max === 1 ? "foto" : "fotos"} · JPG, PNG o WebP hasta 15 MB · se optimizan solas
        </p>
        <Button variant="secondary" size="sm" onClick={() => input.current?.click()} disabled={uploading || !remaining}>
          {uploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" /> : <ImagePlus className="h-3.5 w-3.5" aria-hidden="true" />}
          {max === 1 && value.length ? "Reemplazar" : "Agregar fotos"}
        </Button>
      </div>
      <input
        ref={input}
        type="file"
        accept={ACCEPT}
        multiple={max > 1}
        className="sr-only"
        tabIndex={-1}
        onChange={(event) => {
          if (max === 1 && value.length) handleReplace(event.target.files);
          else handleFiles(event.target.files);
        }}
      />

      <Modal
        open={editing !== null}
        onClose={() => setEditing(null)}
        title="Descripción de la foto"
        size="sm"
        footer={<Button onClick={() => setEditing(null)}>Listo</Button>}
      >
        {editing !== null && value[editing] ? (
          <div className="grid gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={thumb(value[editing].url, 600)} alt="" className="max-h-56 w-full rounded-xl object-contain" />
            <TextInput
              value={value[editing].alt || ""}
              maxLength={140}
              placeholder="Ej: Hamburguesa con papas sobre mesa de madera"
              onChange={(event) => update(editing, { alt: event.target.value })}
              aria-label="Descripción"
            />
            <p className="text-[13px] text-muted">La leen los lectores de pantalla y Google. Si la dejás vacía se usa el nombre de la marca.</p>
          </div>
        ) : null}
      </Modal>
    </div>
  );

  async function handleReplace(fileList) {
    const file = fileList?.[0];
    if (!file) return;
    setPending([URL.createObjectURL(file)]);
    try {
      const [result] = await uploadImages([file], scope);
      onChange([{ url: result.url, alt: value[0]?.alt || "" }]);
      toast("Foto reemplazada. Recordá guardar.");
    } catch (error) {
      toast(error.message, "error");
    } finally {
      setPending([]);
      if (input.current) input.current.value = "";
    }
  }
}
