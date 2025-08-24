import { Separator } from "@/components/separator";
import { MoveLeft } from "lucide-react";
import Link from "next/link";
import * as services from "dockup/services";
import { notFound } from "next/navigation";
import { createGenerator } from "fumadocs-typescript";
import { AutoTypeTable } from "fumadocs-typescript/ui";
import { CodeBlock, Pre } from "fumadocs-ui/components/codeblock";
import { highlight } from "fumadocs-core/highlight";
import { Badge } from "@/components/badge";
import { Callout } from "fumadocs-ui/components/callout";
import { getRegistryService } from "@/lib/registry";
import { createMetadata } from "@/lib/metadata";
import { Metadata } from "next";

const generator = createGenerator();

export async function generateMetadata({
  params,
}: {
  params: Promise<{ serviceId: string }>;
}): Promise<Metadata> {
  const { serviceId } = await params;
  const service = getRegistryService(serviceId);

  return createMetadata({
    title: service?.name,
    description: `Setup ${service?.name} locally in seconds using Dockup`,
    openGraph: {
      type: "website",
    },
  });
}

export default async function Page({
  params,
}: {
  params: Promise<{ serviceId: string }>;
}) {
  const { serviceId } = await params;

  const service = getRegistryService(serviceId);

  if (!service) notFound();

  const metadata = service.metadata?.();

  const configCode = await highlight(
    [
      "import { defineConfig } from 'dockup/config';",
      `import { ${serviceId} } from 'dockup/services';`,
      "",
      "export default defineConfig({",
      "  services: [",
      `    ${serviceId}()`,
      "  ],",
      "});",
    ].join("\n"),
    {
      lang: "ts",
      components: {
        pre: (props) => <Pre {...props} />,
      },
    },
  );

  const metaCode = await highlight(`dockup metadata`, {
    lang: "bash",
    components: {
      pre: (props) => <Pre {...props} />,
    },
  });

  return (
    <main className="container mx-auto py-12">
      <Link
        href="/registry"
        className="inline-flex mb-8 gap-3 items-center text-muted-foreground hover:text-foreground"
      >
        <MoveLeft size={20} />
        Back to registry
      </Link>
      <div>
        <h1 className="text-5xl font-bold mb-3">{service.name}</h1>
        <p className="text-muted-foreground mb-6">{service.description}</p>
        <div className="flex gap-2">
          {service.tags!.map((tag) => (
            <Badge key={tag}>{tag}</Badge>
          ))}
        </div>
      </div>
      <Separator className="my-8" />
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Usage</h2>
        <CodeBlock title="dockup.config.ts">{configCode}</CodeBlock>
      </section>
      {metadata && (
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-2">Metadata</h2>
          <p className="text-muted-foreground mb-4">
            This service automatically exposes metadata.
          </p>
          <CodeBlock>{metaCode}</CodeBlock>
          <div className="space-y-2 mt-6">
            {metadata.map((meta) => (
              <div key={meta.label}>
                <div>
                  <span className="font-bold">{meta.label}: </span>
                  <span className="underline">{meta.value}</span>
                </div>
                <p className="text-muted-foreground text-sm">
                  {meta.description}
                </p>
              </div>
            ))}
          </div>
          <Callout type="warn">
            The above are the metadata generated when using this service with
            the default options.
          </Callout>
        </section>
      )}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Options</h2>
        <AutoTypeTable
          generator={generator}
          path={`../packages/dockup/src/services/${serviceId}.ts`}
          name="Options"
        />
      </section>
    </main>
  );
}

export function generateStaticParams() {
  return Object.keys(services).map((service) => ({
    serviceId: service,
  }));
}
