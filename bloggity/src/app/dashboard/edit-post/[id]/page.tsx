"use client";

import { useParams, useRouter } from "next/navigation";
import { trpc } from "@/utils/trpc";
import { useState, useEffect } from "react";

export default function EditPostPage() {
  const { id } = useParams(); // get the post ID from URL
  const router = useRouter();

  const { data: post, isLoading } = trpc.posts.getPostById.useQuery({ id: Number(id) });
  const updatePost = trpc.posts.updatePost.useMutation({
    onSuccess: () => {
      alert("Post updated!");
      router.push("/dashboard");
    },
  });

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [published, setPublished] = useState(false);

  useEffect(() => {
    if (post) {
      setTitle(post.title);
      setContent(post.content || "");
      setPublished(post.published);
    }
  }, [post]);

  if (isLoading) return <p>Loading...</p>;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updatePost.mutate({ id: Number(id), title, content, published });
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Edit Post</h1>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
        <div>
          <label className="block font-semibold mb-1">Title</label>
          <input
            className="border px-3 py-2 w-full"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Content</label>
          <textarea
            className="border px-3 py-2 w-full"
            rows={6}
            value={content}
            onChange={e => setContent(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={published}
            onChange={e => setPublished(e.target.checked)}
          />
          <span>Published</span>
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}
