import type { MetadataRoute } from "next";

import { publicStaticRoutes, siteConfig } from "@/config/site";
import { listCareers, listLegends, listRoadmaps } from "@/server/services/content-service";

/**
 * Sitemap com rotas estáticas + conteúdo publicado. Sem `lastModified` fictício:
 * só será incluído quando vier do banco com data real.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteConfig.url;
  const staticEntries: MetadataRoute.Sitemap = publicStaticRoutes.map((path) => ({
    url: `${base}${path === "/" ? "" : path}`,
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : 0.7,
  }));

  try {
    const [careers, roadmaps, legends] = await Promise.all([
      listCareers(),
      listRoadmaps(),
      listLegends(),
    ]);
    const dynamicEntries: MetadataRoute.Sitemap = [
      ...careers.map((c) => ({
        url: `${base}/carreiras/${c.slug}`,
        changeFrequency: "monthly" as const,
        priority: 0.8,
      })),
      ...roadmaps.map((r) => ({
        url: `${base}/roadmaps/${r.slug}`,
        changeFrequency: "monthly" as const,
        priority: 0.8,
      })),
      ...legends.map((l) => ({
        url: `${base}/lendas-da-ti/${l.slug}`,
        changeFrequency: "yearly" as const,
        priority: 0.5,
      })),
    ];
    return [...staticEntries, ...dynamicEntries];
  } catch (error) {
    console.error(
      "[sitemap] falha ao carregar conteúdo dinâmico; usando apenas rotas estáticas",
      error,
    );
    return staticEntries;
  }
}
