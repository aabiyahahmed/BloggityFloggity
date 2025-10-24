import { router, publicProcedure } from "@/server/trpc";
import { db } from "@/server/db";
import { z } from "zod";
import { posts, categories, postCategories } from "@/db/schema";
import { eq } from "drizzle-orm";
import { slugify } from "@/lib/slugify";

export const postsRouter = router({
  getAllPosts: publicProcedure.query(async () => {
    const result = await db
      .select({
        id: posts.id,
        title: posts.title,
        content: posts.content,
        categoryId: categories.id,
        categoryName: categories.name,
        slug: posts.slug,
        published: posts.published,
      })
      .from(posts)
      .leftJoin(postCategories, eq(posts.id, postCategories.postId))
      .leftJoin(categories, eq(postCategories.categoryId, categories.id));

    // Combine categories for the same post into an array
    const postsMap = new Map<
      number,
      { id: number; title: string; content: string; slug: string; published: boolean, categories: { id: number; name: string }[] }
    >();

    for (const row of result) {
      if (!postsMap.has(row.id)) {
        postsMap.set(row.id, {
          id: row.id,
          title: row.title,
          content: row.content,
          slug: row.slug,
          published: row.published,
          categories: [],
        });
      }

      if (row.categoryId && row.categoryName) {
        postsMap.get(row.id)?.categories.push({
          id: row.categoryId,
          name: row.categoryName,
        });
      }
    }

    return Array.from(postsMap.values());
  }),

   getPostBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      const result = await db
        .select({
          id: posts.id,
          title: posts.title,
          content: posts.content,
          createdAt: posts.createdAt,
          slug: posts.slug,
          published: posts.published,
          category: categories,
        })
        .from(posts)
        .leftJoin(postCategories, eq(posts.id, postCategories.postId))
        .leftJoin(categories, eq(postCategories.categoryId, categories.id))
        .where(eq(posts.slug, input.slug));

      if (!result.length) throw new Error("Post not found");

      // Flatten categories
      const { id, title, content, createdAt, slug, published } = result[0];
      const categoriesList = result
        .filter((r) => r.category)
        .map((r) => ({
          id: r.category.id,
          name: r.category.name,
          slug: r.category.slug,
        }));

      return { id, title, content, createdAt, slug, published, categories: categoriesList };
    }),

     createPost: publicProcedure
    .input(
      z.object({
        title: z.string().min(1),
        content: z.string().min(1),
        published: z.boolean().default(false),
        categoryIds: z.array(z.number()).optional(), // array of category IDs
      })
    )
    .mutation(async ({ input }) => {
      console.log(" Incoming post input:", input);
      console.log(" Category IDs received:", input.categoryIds);
      // Generate slug from title
      const slug = slugify(input.title);
       console.log("slug generated");

      // Optional: Check for duplicate slug
      //const existing = await db.query.posts.findFirst({ where: { slug } });
      //if (existing) throw new Error("A post with this title already exists.");
      console.log("duplicate slug checked");

      console.log("Inserting post...");
      // Insert the post
      const [newPost] = await db
        .insert(posts)
        .values({
          title: input.title,
          content: input.content,
          slug,
          published: input.published,
        })
        .returning();

        console.log("Post inserted:", newPost);

      // Link categories if provided
      const categoryIds = input.categoryIds || [];
      console.log("input.categoryIds before mapping:", input.categoryIds);
      console.log("categoryIds before mapping:", categoryIds);

      if (input.categoryIds && input.categoryIds.length > 0) {
        const categoriesToInsert = input.categoryIds.map((catId) => ({
          postId: newPost.id,
          categoryId: catId,
        }));
        await db.insert(postCategories).values(categoriesToInsert);
      }

      // Return the created post
      return newPost;
    }),

    deletePost: publicProcedure
  .input(z.object({ id: z.number() }))
  .mutation(async ({ input }) => {
    await db.delete(posts).where(eq(posts.id, input.id));
    return { success: true };
  }),

  getPostById: publicProcedure
  .input(z.object({ id: z.number() }))
  .query(async ({ input, ctx }) => {
    return ctx.db.query.posts.findFirst({
      where: eq(posts.id, input.id),
      with: { categories: true },
    });
  }),

  updatePost: publicProcedure
  .input(
    z.object({
      id: z.number(),
      title: z.string(),
      content: z.string().optional(),
      published: z.boolean(),
    })
  )
  .mutation(async ({ input, ctx }) => {
    await ctx.db
      .update(posts)
      .set({
        title: input.title,
        content: input.content,
        published: input.published,
      })
      .where(eq(posts.id, input.id));
    return { success: true };
  }),

});
