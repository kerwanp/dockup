import {
  BookOpenCheck,
  LaptopMinimalCheck,
  LucideIcon,
  SquareTerminal,
} from "lucide-react";
import { MagicCard } from "../magic/magic-card";
import { PropsWithChildren } from "react";

export const FeaturesSection = () => {
  return (
    <section className="grid grid-cols-4 gap-3">
      <FeatureCard
        Icon={LaptopMinimalCheck}
        title="Cross-platform"
        subtitle="Run anywhere"
      >
        Your development environment can run anywhere Docker can run. Making
        Dockerup the perfect choice for any team
      </FeatureCard>
      <FeatureCard
        Icon={SquareTerminal}
        title="Terminal UI"
        subtitle="Stupidly easy"
      >
        Focused on developer experience, manage your running services with a
        beautifully crafted Terminal UI.
      </FeatureCard>
      <FeatureCard Icon={BookOpenCheck} title="Registry" subtitle="Plug'n play">
        Use one of the many services already available to get started in
        seconds.
      </FeatureCard>
      <FeatureCard
        Icon={BookOpenCheck}
        title="Config"
        subtitle="Fully customizable"
      >
        Extend your local environment by creating your own custom services
        without DevOps knowledge.
      </FeatureCard>
    </section>
  );
};

const FeatureCard = ({
  title,
  subtitle,
  children,
  Icon,
}: PropsWithChildren<{
  title: string;
  subtitle: string;
  Icon: LucideIcon;
}>) => {
  return (
    <MagicCard className="p-6 rounded-md">
      <Icon className="mb-4" size={32} />
      <h2 className="text-muted-foreground text-sm font-semibold font-sans">
        {title}
      </h2>
      <div className="text-xl font-semibold mb-2 font-mono">{subtitle}</div>
      <p className="text-sm text-muted-foreground">{children}</p>
    </MagicCard>
  );
};
