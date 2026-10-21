import Link from "next/link";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Shape } from "@/components/site/Brand";

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="relative overflow-hidden bg-lemon">
        <Shape type="sello" color="watermelon" spin className="absolute -right-16 -top-16 h-64 w-64" />
        <div className="container-site relative flex min-h-[60vh] flex-col items-start justify-center py-24">
          <p className="mono-label">EXP_404 → sin resultado</p>
          <h1 className="title-pop mt-4 text-[56px] sm:text-[88px]">Esta página no existe.</h1>
          <p className="mt-4 text-[17px]">Puede que el link haya cambiado con la nueva web.</p>
          <Link href="/" className="btn-cacao mt-10">
            Volver al inicio
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
