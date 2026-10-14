import Link from "next/link";
import { about } from "@/config/content";
import { Paragraphs } from "@/lib/emphasis";
import { legacyImage } from "@/lib/legacy";
import { SplitSlider } from "@/components/site/SplitSlider";

export const metadata = {
  title: "Sobre nosotras",
  description: "CoFi surge del encuentro entre estrategia y creatividad. Conocé a Sofi, Cami, Coca y Firu."
};

export default function AboutPage() {
  return (
    <>
      <section className="container-site pb-16 pt-10 lg:pb-20 lg:pt-16">
        <div className="mx-auto max-w-[52rem]">
          <h1 className="animate-fade-in-up text-center font-display text-[26px] font-normal sm:text-[30px]">{about.title}</h1>
          <div className="mt-10 animate-fade-in-up space-y-4 text-[15px] leading-[1.9] [animation-delay:120ms] sm:text-base">
            <Paragraphs text={about.intro} />
          </div>
        </div>
      </section>

      <SplitSlider
        eyebrow="Quiénes somos"
        autoplay={9000}
        slides={about.team.map((member) => ({
          id: member.name,
          title: member.name,
          body: member.bio,
          image: legacyImage(member.image),
          imageAlt: member.name
        }))}
      />

      <section className="container-site py-20 text-center lg:py-24">
        <Link href="/contacto" className="btn-stone">
          Contactanos
        </Link>
      </section>
    </>
  );
}
