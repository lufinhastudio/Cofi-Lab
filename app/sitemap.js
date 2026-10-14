import { site } from "@/config/site";

export default function sitemap() {
  return [{ url: site.url, changeFrequency: "weekly", priority: 1 }];
}
