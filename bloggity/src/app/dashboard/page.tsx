"use client";

import { useState } from "react";
import { trpc } from "@/utils/trpc";
import Link from "next/link";
import { ConfirmDeleteDialog } from "@/components/ConfirmDeleteDialog";

export default function DashboardHome() {
  const [tab, setTab] = useState<"published" | "draft">("published");
  const { data: posts = [], refetch } = trpc.posts.getAllPosts.useQuery();
  const deletePost = trpc.posts.deletePost.useMutation({
    onSuccess: () => refetch(),
  });

  const filteredPosts = posts.filter((p) =>
    tab === "published" ? p.published : !p.published
  );

  return (
    <div className="max-w-6xl mx-auto">
      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Posts</h1>

        <div className="flex items-center gap-3">
          <div className="inline-flex rounded-lg bg-gray-100 p-1">
            <button
              onClick={() => setTab("published")}
              className={`px-3 py-1 rounded-md text-sm ${
                tab === "published"
                  ? "bg-white shadow-sm font-medium"
                  : "text-gray-600"
              }`}
            >
              Published
            </button>
            <button
              onClick={() => setTab("draft")}
              className={`px-3 py-1 rounded-md text-sm ${
                tab === "draft"
                  ? "bg-white shadow-sm font-medium"
                  : "text-gray-600"
              }`}
            >
              Drafts
            </button>
          </div>

          <Link
            href="/dashboard/new-post"
            className="ml-2 inline-flex items-center gap-2 rounded-md bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-700"
          >
            New Post
          </Link>
        </div>
      </header>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden border">
        <table className="w-full min-w-[640px] table-fixed">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-700">Title</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-700">Categories</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-700 w-40">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredPosts.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-4 py-6 text-center text-sm text-gray-500">
                  No posts found.
                </td>
              </tr>
            ) : (
              filteredPosts.map((post) => (
                <tr key={post.id} className="border-t last:border-b">
                  <td className="px-4 py-3 align-top">
                    <div className="text-sm font-medium text-gray-900">{post.title}</div>
                    <div className="mt-1 text-xs text-gray-500">
                      {post.published ? "Published" : "Draft"}
                    </div>
                  </td>

                  <td className="px-4 py-3 align-top text-sm text-gray-700">
                    {post.categories.length > 0 ? (
                      <div className="inline-block max-w-xs truncate">
                        {post.categories.map((c) => c.name).join(", ")}
                      </div>
                    ) : (
                      <span className="text-gray-400">No categories</span>
                    )}
                  </td>

                  <td className="px-4 py-3 align-top">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/dashboard/edit-post/${post.id}`}
                        className="text-sm text-blue-600 hover:underline"
                      >
                        Edit
                      </Link>

                      <ConfirmDeleteDialog
                        itemName={post.title}
                        onConfirm={() => deletePost.mutate({ id: post.id })}
                      />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
