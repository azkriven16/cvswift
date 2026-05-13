import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/r/"],
        disallow: ["/app/", "/api/", "/auth/", "/logout/"],
      },
    ],
    sitemap: "https://cv-swift.vercel.app/sitemap.xml",
  };
}
