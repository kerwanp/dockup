import { createMDX } from "fumadocs-mdx/next";
import { NextConfig } from "next";

const withMDX = createMDX();

const config = {
  reactStrictMode: true,
  serverExternalPackages: ["dockerode", "typescript", "twoslash"],
} satisfies NextConfig;

export default withMDX(config);
