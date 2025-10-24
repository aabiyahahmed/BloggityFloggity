import { z } from "zod";
import { router, publicProcedure } from "@/server/trpc";
import { db } from "@/server/db";
import { categories } from "@/db/schema";
import { eq } from "drizzle-orm";
import { slugify } from "@/lib/slugify";

export const categoriesRouter = router({
  // Get all categories
  getAllCategories: publicProcedure.query(async () => {
    const result = await db.query.categories.findMany({
      orderBy: (categories, { asc }) => [asc(categories.name)],
    });
    return result;
  }),

  // Create a new category
  createCategory: publicProcedure
    .input(
      z.object({
        name: z.string().min(2, "Category name must be at least 2 characters"),
        description: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const slug = slugify(input.name);

      // Prevent duplicate slugs
      const existing = await db.query.categories.findFirst({
        where: eq(categories.slug, slug),
      });

      if (existing) {
        throw new Error("A category with this name already exists.");
      }

      const result = await db
        .insert(categories)
        .values({ ...input, slug })
        .returning();

      return result[0];
    }),

    deleteCategory: publicProcedure
  .input(z.object({ id: z.number() }))
  .mutation(async ({ input }) => {
    await db.delete(categories).where(eq(categories.id, input.id));
    return { success: true };
  }),
});
