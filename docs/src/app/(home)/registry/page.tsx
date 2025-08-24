import { ServiceCard } from "@/components/service-card";
import { createMetadata } from "@/lib/metadata";
import { getRegistryServices } from "@/lib/registry";

export const metadata = createMetadata({
  title: "Registry",
});

export default function Page() {
  const services = getRegistryServices();

  return (
    <main className="container mx-auto py-12">
      <div className="mb-8">
        <h1 className="text-5xl font-bold">Dockup registry</h1>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {Object.entries(services).map(([id, service]) => {
          return (
            <ServiceCard
              key={id}
              id={id}
              name={service.name!}
              description={service.description!}
              tags={service.tags!}
            />
          );
        })}
      </div>
    </main>
  );
}
