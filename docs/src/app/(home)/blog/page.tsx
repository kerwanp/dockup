import Link from "next/link";
import { blog } from "@/lib/source";
import { createMetadata } from "@/lib/metadata";
import { MagicCard } from "@/components/magic/magic-card";

export const metadata = createMetadata({
  title: "Blog",
});

export default function Page() {
  const posts = [...blog.getPages()].sort(
    (a, b) =>
      new Date(b.data.date ?? b.file.name).getTime() -
      new Date(a.data.date ?? a.file.name).getTime(),
  );

  return (
    <div className="mx-auto w-full max-w-fd-container sm:px-4 md:py-12">
      <div className="mb-8">
        <h1 className="text-5xl font-bold">Dockup Blog</h1>
      </div>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4">
        {posts.map((post) => {
          const date =
            typeof post.data.date === "string"
              ? new Date(post.data.date)
              : post.data.date;
          const format = new Intl.DateTimeFormat().format;

          return (
            <Link key={post.url} href={post.url}>
              <MagicCard className="p-6 rounded-md hover:scale-105 transition-transform">
                <h2 className="font-semibold text-lg mb-2">
                  {post.data.title}
                </h2>
                <p className="text-sm text-fd-muted-foreground mb-3">
                  {post.data.description}
                </p>
                <div className="text-sm text-fd-muted-foreground">
                  {format(date)}
                </div>
              </MagicCard>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
