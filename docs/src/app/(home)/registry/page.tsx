import { ServiceCard } from "@/components/service-card";
import * as services from "dockup/services";

export default function Page() {
  return (
    <main className="container mx-auto py-12">
      <div className="mb-8">
        <h1 className="text-5xl font-bold">Dockup registry</h1>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {Object.entries(services).map(([id, service]) => {
          const instance = service();
          return (
            <ServiceCard
              key={id}
              id={id}
              name={instance.name!}
              description={instance.description!}
              tags={instance.tags!}
            />
          );
        })}
      </div>
    </main>
  );
}
