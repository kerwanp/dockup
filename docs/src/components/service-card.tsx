import Link from "next/link";
import { Badge } from "./badge";

export const ServiceCard = ({
  id,
  name,
  description,
  tags,
}: {
  id: string;
  name: string;
  description: string;
  tags: string[];
}) => {
  return (
    <Link
      href={`/registry/${id}`}
      className="border rounded-lg p-6 flex flex-col gap-3 hover:border-primary transition-all"
    >
      <div className="flex-1 mb-2">
        <h2 className="text-xl font-semibold mb-2">{name}</h2>
        <p className="text-muted-foreground text-sm">{description}</p>
      </div>

      <div className="bg-muted text-muted-foreground rounded-md px-3 py-2 text-sm mb-2">
        <code>dockup add {id}</code>
      </div>

      <div className="flex gap-1.5">
        {tags.map((tag) => (
          <Badge key={tag}>{tag}</Badge>
        ))}
      </div>
    </Link>
  );
};
