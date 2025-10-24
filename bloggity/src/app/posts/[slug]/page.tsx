"use client";

import { trpc } from "@/utils/trpc";
import { useParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";

export default function SinglePostPage() {
  const { slug } = useParams() as { slug: string };
  const { data: post, isLoading, error } = trpc.posts.getPostBySlug.useQuery({ slug });

  if (isLoading) return <p className="text-center mt-10">Loading post...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error.message}</p>;
  if (!post) return <p className="text-center mt-10">Post not found.</p>;

  return (
    <article className="max-w-3xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-2">
      <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
       <Badge variant={post.published ? "default" : "destructive"}>
          {post.published ? "Published" : "Draft"}
        </Badge>
      </div>
      <p className="text-gray-500 text-sm mb-6">
        Published on {new Date(post.createdAt).toLocaleDateString()}
      </p>

      <div className="flex flex-wrap gap-2 mb-6">
        {post.categories.map((cat) => (
          <Badge key={cat.id} variant="secondary">
            {cat.name}
          </Badge>
        ))}
      </div>

      <div className="prose max-w-none">
        {post.content}
      </div>
    </article>
  );
}
