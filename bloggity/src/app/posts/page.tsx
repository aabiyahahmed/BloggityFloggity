"use client";

import { useState } from "react";
import { trpc } from "@/utils/trpc";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";

export default function AllPostsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Fetch categories + posts
  const { data: categories, isLoading: loadingCategories, error: categoryError } =
    trpc.categories.getAllCategories.useQuery();
  const { data: posts, isLoading: loadingPosts, error: postsError } =
    trpc.posts.getAllPosts.useQuery();

  if (loadingPosts || loadingCategories)
    return <p className="text-center mt-10">Loading posts...</p>;

  if (postsError || categoryError)
    return (
      <p className="text-center mt-10 text-red-500">
        Error: {postsError?.message || categoryError?.message}
      </p>
    );

  // Filter posts by selected category
  const filteredPosts = selectedCategory
    ? posts?.filter((post) =>
        post.categories.some((cat) => cat.name === selectedCategory)
      )
    : posts;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">All Posts</h1>

      {/* Category Filter Dropdown */}
      {categories && categories.length > 0 && (
        <div className="mb-6">
          <Select
            onValueChange={(value) =>
              setSelectedCategory(value === "all" ? null : value)
            }
          >
            <SelectTrigger className="w-64">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.name}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredPosts && filteredPosts.length > 0 ? (
          filteredPosts.map((post) => (
            <Card
              key={post.id}
              className="p-6 hover:shadow-lg transition-shadow duration-200"
            >
              <Link href={`/posts/${post.slug}`}>
                <h2 className="text-xl font-semibold mb-2 hover:underline">
                  {post.title}
                </h2>
              </Link>
              <p className="text-gray-600 mb-3">
                {post.content.length > 100
                  ? post.content.slice(0, 100) + "..."
                  : post.content}
              </p>

              {/* Categories for each post */}
              <div className="flex flex-wrap gap-2">
                {post.categories.map((cat) => (
                  <Badge key={cat.id} variant="secondary">
                    {cat.name}
                  </Badge>
                ))}
              </div>
            </Card>
          ))
        ) : (
          <p>No posts found for this category.</p>
        )}
      </div>
    </div>
  );
}
