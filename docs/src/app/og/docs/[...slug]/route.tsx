import { readFileSync } from "node:fs";
import { type ImageResponse } from "next/og";
import { metadataImageDocs } from "@/lib/metadata";
import { generateOGImage } from "../../og";

const font = readFileSync("./src/app/og/Comfortaa-Regular.ttf");
const fontBold = readFileSync("./src/app/og/Comfortaa-Bold.ttf");

export const GET = metadataImageDocs.createAPI((page): ImageResponse => {
  return generateOGImage({
    title: page.data.title,
    subtitle: "Docs",
    description: page.data.description,
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
