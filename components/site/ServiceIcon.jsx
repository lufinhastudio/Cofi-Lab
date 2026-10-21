import { BarChart3, Camera, FlaskConical, Megaphone, MessagesSquare, Video } from "lucide-react";

// Iconografía del manual: lineal, terminaciones redondeadas, 2 px en 24 px.
// Solo para servicios, navegación y datos. Nunca decorativa.
const icons = {
  strategy: BarChart3,
  social: MessagesSquare,
  video: Video,
  camera: Camera,
  paid: Megaphone,
  lab: FlaskConical
};

export function ServiceIcon({ name, className }) {
  const Icon = icons[name] || FlaskConical;
  return <Icon className={className} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" />;
}
