import { readFileSync } from "node:fs";
import { type ImageResponse } from "next/og";
import { metadataImageBlog, metadataImageDocs } from "@/lib/metadata";
import { generateOGImage } from "../../og";

const font = readFileSync("./src/app/og/Comfortaa-Regular.ttf");
const fontBold = readFileSync("./src/app/og/Comfortaa-Bold.ttf");

export const GET = metadataImageBlog.createAPI((page): ImageResponse => {
  return generateOGImage({
    title: page.data.title,
    description: page.data.description,
    subtitle: "Blog",
    fonts: [
      {
        name: "Mono",
        data: font,
        weight: 400,
      },
      {
        name: "Mono",
        data: fontBold,
        weight: 600,
      },
    ],
  });
});

export function generateStaticParams(): {
  slug: string[];
}[] {
  return metadataImageDocs.generateParams();
}
