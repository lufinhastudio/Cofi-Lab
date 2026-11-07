"use client";

import { createContext, useCallback, useContext, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AlertTriangle, ArrowDown, ArrowUp, Check, CheckCircle2, Loader2, X, XCircle } from "lucide-react";
import { TONE_SWATCHES } from "@/lib/content/options";
import { cn } from "@/lib/utils";

// Piezas de interfaz del panel: limpias, con la paleta y tipografías del Brand Book.

export function Button({ variant = "primary", size = "md", loading = false, className, children, disabled, ...props }) {
  const variants = {
    primary: "bg-tinta text-crema hover:bg-cacao",
    secondary: "border border-tinta/20 bg-white text-tinta hover:border-tinta",
    ghost: "text-tinta hover:bg-tinta/5",
    danger: "bg-watermelon text-tinta hover:bg-[#e94e4e]",
    "danger-ghost": "text-[#c23434] hover:bg-watermelon/10",
    accent: "bg-periwinkle text-tinta hover:bg-[#9fb8fb]"
  };
  const sizes = { sm: "h-9 px-3.5 text-[13px] gap-1.5", md: "h-11 px-5 text-[14px] gap-2", icon: "h-9 w-9 justify-center" };
  return (
    <button
      type="button"
      disabled={disabled || loading}
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full font-display font-bold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-tinta disabled:cursor-not-allowed disabled:opacity-50",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : null}
      {children}
    </button>
  );
}

export function Card({ className, children, ...props }) {
  return (
    <div className={cn("rounded-2xl border border-line bg-white", className)} {...props}>
      {children}
    </div>
  );
}

export function PageHeader({ eyebrow, title, description, actions, children }) {
  return (
    <header className="mb-6 flex flex-col gap-4 sm:mb-8 lg:flex-row lg:items-end lg:justify-between">
      <div className="min-w-0">
        {eyebrow ? <p className="mono-label text-[#c23434]">{eyebrow}</p> : null}
        <h1 className="mt-2 font-display text-[28px] font-black leading-tight tracking-[-0.01em] sm:text-[34px]">{title}</h1>
        {description ? <p className="mt-2 max-w-2xl text-[15px] text-muted">{description}</p> : null}
        {children}
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
    </header>
  );
}

export function Field({ label, help, error, required, children, htmlFor, className }) {
  return (
    <div className={cn("grid gap-1.5", className)}>
      {label ? (
        <label htmlFor={htmlFor} className="text-[14px] font-semibold text-tinta">
          {label}
          {required ? <span className="text-[#c23434]"> *</span> : null}
        </label>
      ) : null}
      {children}
      {help ? <p className="text-[13px] leading-snug text-muted">{help}</p> : null}
      {error ? <p className="text-[13px] font-medium text-[#c23434]">{error}</p> : null}
    </div>
  );
}

const inputBase =
  "w-full rounded-xl border border-tinta/15 bg-white px-3.5 text-[15px] text-tinta outline-none transition-colors placeholder:text-tinta/35 focus:border-tinta focus:ring-2 focus:ring-periwinkle/60 disabled:bg-arena";

export function TextInput({ className, ...props }) {
  return <input className={cn(inputBase, "h-11", className)} {...props} />;
}

export function TextArea({ className, rows = 4, ...props }) {
  return <textarea rows={rows} className={cn(inputBase, "resize-y py-2.5 leading-relaxed", className)} {...props} />;
}

export function Select({ options, className, ...props }) {
  return (
    <select className={cn(inputBase, "h-11 cursor-pointer pr-8", className)} {...props}>
      {Object.entries(options).map(([value, label]) => (
        <option key={value} value={value}>
          {label}
        </option>
      ))}
    </select>
  );
}

// Selector de color con muestras (solo colores permitidos del manual).
export function ToneSelect({ options, value, onChange, label }) {
  return (
    <div role="radiogroup" aria-label={label} className="flex flex-wrap gap-2">
      {Object.entries(options).map(([tone, name]) => (
        <button
          key={tone}
          type="button"
          role="radio"
          aria-checked={value === tone}
          title={name}
          onClick={() => onChange(tone)}
          className={cn(
            "inline-flex items-center gap-2 rounded-full border px-2.5 py-1.5 text-[13px] transition-colors",
            value === tone ? "border-tinta bg-tinta/5 font-semibold" : "border-tinta/15 hover:border-tinta/40"
          )}
        >
          <span className="h-4 w-4 rounded-full border border-tinta/20" style={{ background: TONE_SWATCHES[tone] }} aria-hidden="true" />
          {name.split(" (")[0]}
        </button>
      ))}
    </div>
  );
}

export function Toggle({ checked, onChange, label, description, disabled }) {
  const id = useId();
  return (
    <label htmlFor={id} className={cn("flex cursor-pointer items-start gap-3", disabled && "cursor-not-allowed opacity-60")}>
      <span className="relative mt-0.5 inline-flex shrink-0">
        <input id={id} type="checkbox" className="peer sr-only" checked={Boolean(checked)} disabled={disabled} onChange={(event) => onChange(event.target.checked)} />
        <span className="h-6 w-11 rounded-full bg-tinta/20 transition-colors peer-checked:bg-tinta peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-tinta" />
        <span className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform peer-checked:translate-x-5" />
      </span>
      <span>
        <span className="block text-[14px] font-semibold">{label}</span>
        {description ? <span className="block text-[13px] text-muted">{description}</span> : null}
      </span>
    </label>
  );
}

const statusStyles = {
  published: "bg-[#dff3e4] text-[#1d5f31]",
  draft: "bg-lemon text-tinta",
  hidden: "bg-tinta/10 text-tinta/70",
  unread: "bg-watermelon text-tinta",
  neutral: "bg-arena text-tinta"
};

export function Badge({ tone = "neutral", children, className }) {
  return <span className={cn("inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[12px] font-semibold leading-none", statusStyles[tone], className)}>{children}</span>;
}

export function EmptyState({ icon: Icon, title, text, action }) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-dashed border-tinta/20 bg-white/60 px-6 py-14 text-center">
      {Icon ? <Icon className="h-10 w-10 text-tinta/40" strokeWidth={1.5} aria-hidden="true" /> : null}
      <p className="mt-4 font-display text-[18px] font-bold">{title}</p>
      {text ? <p className="mt-1 max-w-md text-[14px] text-muted">{text}</p> : null}
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}

export function ErrorList({ messages, className }) {
  if (!messages?.length) return null;
  return (
    <div role="alert" className={cn("rounded-xl border border-watermelon/40 bg-watermelon/10 px-4 py-3 text-[14px]", className)}>
      <p className="flex items-center gap-2 font-semibold">
        <AlertTriangle className="h-4 w-4 shrink-0" aria-hidden="true" />
        {messages.length > 1 ? "Revisá estos puntos antes de guardar:" : messages[0]}
      </p>
      {messages.length > 1 ? (
        <ul className="mt-2 list-disc space-y-1 pl-6">
          {messages.map((message, index) => (
            <li key={index}>{message}</li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

// Botones para subir / bajar un elemento en una lista ordenable.
export function MoveButtons({ index, total, onMove, label = "elemento" }) {
  return (
    <span className="inline-flex">
      <button
        type="button"
        onClick={() => onMove(index, index - 1)}
        disabled={index === 0}
        className="grid h-8 w-8 place-items-center rounded-full text-tinta/70 hover:bg-tinta/5 hover:text-tinta disabled:opacity-25"
        aria-label={`Subir ${label}`}
        title="Subir"
      >
        <ArrowUp className="h-4 w-4" aria-hidden="true" />
      </button>
      <button
        type="button"
        onClick={() => onMove(index, index + 1)}
        disabled={index === total - 1}
        className="grid h-8 w-8 place-items-center rounded-full text-tinta/70 hover:bg-tinta/5 hover:text-tinta disabled:opacity-25"
        aria-label={`Bajar ${label}`}
        title="Bajar"
      >
        <ArrowDown className="h-4 w-4" aria-hidden="true" />
      </button>
    </span>
  );
}

export function moveItem(list, from, to) {
  if (to < 0 || to >= list.length || from === to) return list;
  const next = [...list];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

// Arrastrar y soltar (mouse). En celulares se usan los botones de subir/bajar.
export function useDragSort(list, onChange) {
  const dragIndex = useRef(null);
  const [overIndex, setOverIndex] = useState(null);
  const handlers = (index) => ({
    draggable: true,
    onDragStart: (event) => {
      dragIndex.current = index;
      event.dataTransfer.effectAllowed = "move";
      event.dataTransfer.setData("text/plain", String(index));
    },
    onDragOver: (event) => {
      if (dragIndex.current === null) return;
      event.preventDefault();
      setOverIndex(index);
    },
    onDragLeave: () => setOverIndex((current) => (current === index ? null : current)),
    onDrop: (event) => {
      event.preventDefault();
      const from = dragIndex.current;
      dragIndex.current = null;
      setOverIndex(null);
      if (from !== null && from !== index) onChange(moveItem(list, from, index));
    },
    onDragEnd: () => {
      dragIndex.current = null;
      setOverIndex(null);
    }
  });
  return { handlers, overIndex };
}

// --- Modal y confirmaciones ----------------------------------------------------------

export function Modal({ open, onClose, title, children, footer, size = "md" }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (event) => event.key === "Escape" && onClose?.();
    document.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [open, onClose]);
  if (!open || !mounted) return null;
  return createPortal(
    <div className="fixed inset-0 z-[80] flex items-end justify-center bg-tinta/50 p-0 sm:items-center sm:p-6" onMouseDown={(event) => event.target === event.currentTarget && onClose?.()}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={cn(
          "max-h-[92vh] w-full animate-fade-in overflow-y-auto rounded-t-3xl bg-crema p-6 shadow-2xl sm:rounded-3xl sm:p-7",
          { sm: "sm:max-w-md", md: "sm:max-w-lg", lg: "sm:max-w-2xl", xl: "sm:max-w-4xl" }[size]
        )}
      >
        <div className="flex items-start justify-between gap-4">
          <h2 className="font-display text-[20px] font-black leading-tight">{title}</h2>
          {onClose ? (
            <button type="button" onClick={onClose} className="-mr-2 -mt-1 grid h-9 w-9 shrink-0 place-items-center rounded-full hover:bg-tinta/5" aria-label="Cerrar">
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          ) : null}
        </div>
        <div className="mt-4">{children}</div>
        {footer ? <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">{footer}</div> : null}
      </div>
    </div>,
    document.body
  );
}

const ConfirmContext = createContext(null);
const ToastContext = createContext(null);

export function AdminProviders({ children }) {
  const [confirmState, setConfirmState] = useState(null);
  const [toasts, setToasts] = useState([]);

  const confirm = useCallback(
    (options) =>
      new Promise((resolve) => {
        setConfirmState({ ...options, resolve });
      }),
    []
  );

  const toast = useCallback((message, tone = "success") => {
    const id = Math.random().toString(36).slice(2);
    setToasts((current) => [...current, { id, message, tone }]);
    setTimeout(() => setToasts((current) => current.filter((item) => item.id !== id)), tone === "error" ? 7000 : 3500);
  }, []);

  const close = (value) => {
    confirmState?.resolve(value);
    setConfirmState(null);
  };

  return (
    <ConfirmContext.Provider value={confirm}>
      <ToastContext.Provider value={toast}>
        {children}
        <Modal
          open={Boolean(confirmState)}
          onClose={() => close(false)}
          title={confirmState?.title || "¿Confirmás?"}
          size="sm"
          footer={
            <>
              <Button variant="secondary" onClick={() => close(false)}>
                Cancelar
              </Button>
              <Button variant={confirmState?.danger ? "danger" : "primary"} onClick={() => close(true)} autoFocus>
                {confirmState?.confirmLabel || "Confirmar"}
              </Button>
            </>
          }
        >
          <p className="text-[15px] leading-relaxed text-tinta/80">{confirmState?.message}</p>
        </Modal>
        <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-4 z-[90] flex flex-col items-center gap-2 px-4 sm:bottom-6 sm:items-end sm:px-6">
          {toasts.map((item) => (
            <div
              key={item.id}
              className={cn(
                "pointer-events-auto flex max-w-sm animate-fade-in-up items-start gap-2.5 rounded-2xl px-4 py-3 text-[14px] font-medium shadow-lg",
                item.tone === "error" ? "bg-watermelon text-tinta" : "bg-tinta text-crema"
              )}
            >
              {item.tone === "error" ? <XCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" /> : <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-lemon" aria-hidden="true" />}
              {item.message}
            </div>
          ))}
        </div>
      </ToastContext.Provider>
    </ConfirmContext.Provider>
  );
}

export function useConfirm() {
  return useContext(ConfirmContext);
}

export function useToast() {
  return useContext(ToastContext);
}

// Avisa antes de salir de la página si hay cambios sin guardar.
export function useUnsavedWarning(dirty) {
  useEffect(() => {
    if (!dirty) return undefined;
    const onBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [dirty]);
}

// Barra fija inferior con el estado de guardado.
export function SaveBar({ dirty, saving, onSave, onDiscard, savedAt, children, saveLabel = "Guardar cambios" }) {
  return (
    <div className="sticky bottom-0 z-30 -mx-4 mt-8 border-t border-line bg-crema/95 px-4 py-3 backdrop-blur sm:-mx-8 sm:px-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="flex items-center gap-2 text-[13px] text-muted">
          {dirty ? (
            <>
              <span className="h-2 w-2 rounded-full bg-watermelon" aria-hidden="true" />
              Tenés cambios sin guardar
            </>
          ) : savedAt ? (
            <>
              <Check className="h-4 w-4 text-[#1d5f31]" aria-hidden="true" />
              Todo guardado
            </>
          ) : (
            "Sin cambios"
          )}
        </p>
        <div className="flex flex-wrap items-center gap-2">
          {children}
          {onDiscard ? (
            <Button variant="ghost" size="sm" onClick={onDiscard} disabled={!dirty || saving}>
              Descartar
            </Button>
          ) : null}
          <Button onClick={onSave} loading={saving} disabled={!dirty && !saving}>
            {saving ? "Guardando…" : saveLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
