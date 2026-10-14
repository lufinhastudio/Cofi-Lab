import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/server/auth";
import { LoginForm } from "./LoginForm";

export const dynamic = "force-dynamic";

export default async function AdminLoginPage() {
  const session = await getAdminSession();
  if (session) redirect("/admin");

  // Diseño pendiente: esqueleto mínimo hasta que armemos el admin.
  return (
    <main className="grid min-h-screen place-items-center p-6">
      <section className="w-full max-w-sm">
        <h1 className="text-xl font-semibold">COFI LAB · Admin</h1>
        <LoginForm />
      </section>
    </main>
  );
}
