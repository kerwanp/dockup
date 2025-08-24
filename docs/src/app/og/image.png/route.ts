import { readFileSync } from "node:fs";
import { generateOGImage } from "../og";

const font = readFileSync("./src/app/og/Comfortaa-Regular.ttf");
const fontBold = readFileSync("./src/app/og/Comfortaa-Bold.ttf");

export function GET() {
  return generateOGImage({
    title: "Dockup",
    description: "The CLI tool for managing local environments.",
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
}
