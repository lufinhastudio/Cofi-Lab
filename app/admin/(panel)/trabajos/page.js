import { redirect } from "next/navigation";

// La sección se llama ahora "Marcas y trabajos".
export default function AdminProjectsRedirect() {
  redirect("/admin/marcas");
}
