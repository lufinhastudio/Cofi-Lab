import Link from "next/link";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="container-site flex min-h-[55vh] flex-col items-center justify-center py-24 text-center">
        <p className="label">Error 404</p>
        <h1 className="mt-4 font-display text-3xl font-light">Esta página no existe</h1>
        <p className="mt-3 text-muted">Puede que el link haya cambiado con la nueva web.</p>
        <Link href="/" className="btn-outline mt-10">
          Volver al inicio
        </Link>
      </main>
      <Footer />
    </>
  );
}
