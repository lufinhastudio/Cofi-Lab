export function Testimonials({ testimonials }) {
  return (
    <section id="testimonios" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-20">
      <h2 className="font-display text-3xl font-bold sm:text-4xl">Lo que dicen</h2>
      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        {testimonials.map((item) => (
          <figure key={item.id} className="rounded-3xl border border-black/5 p-6">
            <blockquote className="text-lg">“{item.quote}”</blockquote>
            <figcaption className="mt-4 text-sm text-muted">
              {item.authorName}
              {item.company ? ` · ${item.company}` : ""}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
