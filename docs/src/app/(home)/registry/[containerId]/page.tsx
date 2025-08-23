import { Separator } from "@/components/separator";
import { MoveLeft } from "lucide-react";
import Link from "next/link";
import { ServiceDefinition } from "dockup";
import * as containers from "dockup/services";
import { notFound } from "next/navigation";
import { createGenerator } from "fumadocs-typescript";
import { AutoTypeTable } from "fumadocs-typescript/ui";
import { CodeBlock, Pre } from "fumadocs-ui/components/codeblock";
import { highlight } from "fumadocs-core/highlight";
import { Badge } from "@/components/badge";

const generator = createGenerator();

export default async function Page({
  params,
}: {
  params: Promise<{ containerId: string }>;
}) {
  const { containerId } = await params;

  const service = containers[
    containerId as keyof typeof containers
  ] as () => ServiceDefinition;

  if (!service) notFound();

  const instance = service();

  const configCode = await highlight(
    [
      "import { defineConfig } from 'dockup/config';",
      `import { ${containerId} } from 'dockup/services';`,
      "",
      "export default defineConfig({",
      "  services: [",
      `    ${containerId}()`,
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

  return (
    <main className="container mx-auto py-12">
      <Link
        href="/registry"
        className="inline-flex mb-8 gap-3 items-center text-muted-foreground hover:text-white"
      >
        <MoveLeft size={20} />
        Back to registry
      </Link>
      <div>
        <h1 className="text-5xl font-bold mb-3">{instance.name}</h1>
        <p className="text-muted-foreground mb-6">{instance.description}</p>
        <div className="flex gap-2">
          {instance.tags!.map((tag) => (
            <Badge key={tag}>{tag}</Badge>
          ))}
        </div>
      </div>
      <Separator className="my-8" />
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Usage</h2>
        <CodeBlock title="dockup.config.ts">{configCode}</CodeBlock>
      </section>
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Options</h2>
        <AutoTypeTable
          generator={generator}
          path={`../packages/dockup/src/services/${containerId}.ts`}
          name="Options"
        />
      </section>
    </main>
  );
}
