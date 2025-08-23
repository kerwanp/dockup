import { LogoSvg } from "@/components/svgs/logo";
import { GithubInfo } from "fumadocs-ui/components/github-info";
import type { BaseLayoutProps, LinkItemType } from "fumadocs-ui/layouts/shared";
import { AlbumIcon, Package } from "lucide-react";

export const linkItems: LinkItemType[] = [
  {
    text: "Registry",
    url: "/registry",
    icon: <Package />,
    active: "nested-url",
  },
  {
    icon: <AlbumIcon />,
    text: "Blog",
    url: "/blog",
    active: "nested-url",
  },
  {
    type: "custom",
    children: <GithubInfo owner="kerwanp" repo="sidekit" />,
  },
];

export const baseOptions: BaseLayoutProps = {
  nav: {
    title: (
      <>
        <div className="font-bold font-mono text-2xl">DOCKUP</div>
      </>
    ),
    url: "/",
  },
  // see https://fumadocs.dev/docs/ui/navigation/links
  links: [],
};
