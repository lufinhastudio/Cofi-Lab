export function InstagramIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className} aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.75" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function ArrowIcon({ direction = "right", className }) {
  return (
    <svg viewBox="0 0 48 12" fill="none" className={className} aria-hidden="true" style={direction === "left" ? { transform: "scaleX(-1)" } : undefined}>
      <path d="M0 6h47M42 1l5 5-5 5" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}

export function PlayIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path d="M8 5.5v13l10.5-6.5z" fill="currentColor" />
    </svg>
  );
}

export function CloseIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" className={className} aria-hidden="true">
      <path d="M5 5l14 14M19 5L5 19" />
    </svg>
  );
}
