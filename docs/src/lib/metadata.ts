import { createMetadataImage } from "fumadocs-core/server";
import type { Metadata } from "next/types";
import { blog, source } from "./source";

export function createMetadata(override: Metadata): Metadata {
  return {
    ...override,
    openGraph: {
      title: override.title ?? undefined,
      description: override.description ?? undefined,
      url: "https://dockup.dev",
      images: "/og/image.png",
      siteName: "Dockup",
      ...override.openGraph,
    },
    twitter: {
      card: "summary_large_image",
      creator: "@MartinPaucot",
      title: override.title ?? undefined,
      description: override.description ?? undefined,
      images: "/og/image.png",
      ...override.twitter,
    },
    alternates: {
      types: {
        "application/rss+xml": [
          {
            title: "Dockup Blog",
            url: "https://dockup.dev/blog/rss.xml",
          },
        ],
      },
      ...override.alternates,
    },
  };
}

export const metadataImageDocs = createMetadataImage({
  source,
  imageRoute: "og/docs",
});

export const metadataImageBlog = createMetadataImage({
  source: blog,
  imageRoute: "og/blog",
});

export const baseUrl =
  process.env.NODE_ENV === "development" ||
  !process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? new URL("http://localhost:3000")
    : new URL(`https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`);
