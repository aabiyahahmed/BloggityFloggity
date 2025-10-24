import { db } from "@/server/db";
import { posts } from "@/db/schema";

// Simple function to generate slugs from titles
function slugify(title: string) {
  return title.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]+/g, "");
}

async function seed() {
  await db.insert(posts).values([
    {
      title: "Understanding React Server Components",
      content: "Full blog post content goes here...",
      slug: slugify("Understanding React Server Components"),
      published: true, // optional, defaults to false
    },
    {
      title: "10 Life Lessons from Solo Travel",
      content: "Full travel blog post content...",
      slug: slugify("10 Life Lessons from Solo Travel"),
      published: true,
    },
    {
      title: "Building a Markdown Blog in Next.js",
      content: "Markdown-based blog content...",
      slug: slugify("Building a Markdown Blog in Next.js"),
      published: true,
    },
  ]);

  console.log("✅ Seed data inserted successfully!");
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
