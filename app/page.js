import { getPublicContent } from "@/lib/server/content";
import { Header } from "@/components/site/Header";
import { Hero } from "@/components/site/Hero";
import { Projects } from "@/components/site/Projects";
import { Cofiteca } from "@/components/site/Cofiteca";
import { Testimonials } from "@/components/site/Testimonials";
import { About } from "@/components/site/About";
import { Contact } from "@/components/site/Contact";
import { Footer } from "@/components/site/Footer";

// La landing se regenera cada 60 s. Cuando el admin guarde cambios, se
// llamará a revalidatePath("/") para que se vean al instante.
export const revalidate = 60;

export default async function HomePage() {
  const { projects, products, testimonials } = await getPublicContent();

  return (
    <>
      <Header />
      <main>
        <Hero />
        <Projects projects={projects} />
        <Cofiteca products={products} />
        {testimonials.length ? <Testimonials testimonials={testimonials} /> : null}
        <About />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
