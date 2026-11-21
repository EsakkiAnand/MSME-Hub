import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/login", "/signup"],
        disallow: ["/api/", "/dashboard/", "/admin/dashboard"],
      },
    ],
    sitemap: "https://msme.francisxavier.ac.in/sitemap.xml",
  };
}
