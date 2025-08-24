import Link from "next/link";
import { Button } from "../button";
import { ReleaseButton } from "../magic/release-button";
import { ArrowRight } from "lucide-react";
import { AuroraText } from "../magic/aurora-text";
import { highlight } from "fumadocs-core/highlight";
import { CodeBlock, Pre } from "fumadocs-ui/components/codeblock";
import { ScriptCopyBtn } from "../magic/script-copy-button";

export const HeroSection = async () => {
  const rendered = await highlight(
    `import { defineConfig } from 'dockup/config';
import { rabbitmq, redis, postgresql } from 'dockup/services';

export default defineConfig({
  services: [
    rabbitmq({ management: true }),
    postgresql(),
    redis(),
  ],
});`,
    {
      lang: "ts",
      components: {
        pre: (props) => <Pre {...props} />,
      },
      // other Shiki options
    },
  );

  return (
    <section className="flex flex-row gap-6 min-h-[60svh] items-center justify-between">
      <div>
        <Link href="/blog/introducing-dockup-beta">
          <ReleaseButton className="mb-6">
            Introducing Dockup beta
          </ReleaseButton>
        </Link>
        <div className="mb-8">
          <h1 className="text-8xl mb-4 font-bold">Dockup</h1>
          <AuroraText className="text-4xl mb-4 font-mono">
            Your development environment
          </AuroraText>
          <p className="text-gray-400 max-w-[600px]">
            Dockup is a CLI tool for creating and managing development
            environment. Redis, Postgresql, RabbitMQ, MySQL, MariaDB, run any
            services locally.
          </p>
        </div>
        <div className="flex gap-3">
          <Button size="lg" asChild>
            <Link href="/docs">
              Get started <ArrowRight />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/registry">Registry</Link>
          </Button>
        </div>
      </div>
      <div>
        <div>
          <ScriptCopyBtn
            showMultiplePackageOptions={false}
            commandMap={{
              npm: "npx dockup",
            }}
          />
          <CodeBlock title="dockup.config.ts">{rendered}</CodeBlock>
        </div>
      </div>
    </section>
  );
};
