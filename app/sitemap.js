import { site } from "@/config/site";
import { getPublicProjects } from "@/lib/server/content";

export const revalidate = 3600;

export default async function sitemap() {
  const projects = await getPublicProjects();
  const pages = ["", "/nosotras", "/clientes", "/contacto"].map((path) => ({
    url: `${site.url}${path}`,
    changeFrequency: "monthly",
    priority: path ? 0.8 : 1
  }));
  return [
    ...pages,
    ...projects.map((project) => ({ url: `${site.url}/clientes/${project.slug}`, changeFrequency: "monthly", priority: 0.7 }))
  ];
}
