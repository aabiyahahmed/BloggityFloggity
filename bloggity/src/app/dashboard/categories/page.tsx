"use client";

import { useState } from "react";
import { trpc } from "@/utils/trpc";
import { ConfirmDeleteDialog } from "@/components/ConfirmDeleteDialog";

export default function CategoriesPage() {
  const [name, setName] = useState("");
  const { data: categories = [], refetch } = trpc.categories.getAllCategories.useQuery();
  const createCategory = trpc.categories.createCategory.useMutation({
    onSuccess: () => refetch(),
  });
  const deleteCategory = trpc.categories.deleteCategory.useMutation({
    onSuccess: () => refetch(),
  });

  const handleCreate = async () => {
    if (!name.trim()) return alert("Enter category name");
    await createCategory.mutateAsync({ name: name.trim() });
    setName("");
  };

  return (
    <div className="max-w-4xl mx-auto">
      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Categories</h1>

        <div className="flex items-center gap-3">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="New category"
            className="rounded-md border px-3 py-2 text-sm w-56 focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
          <button
            onClick={handleCreate}
            className="rounded-md bg-blue-600 px-3 py-2 text-sm text-white hover:bg-blue-700"
          >
            Create
          </button>
        </div>
      </header>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden border">
        <table className="w-full table-fixed">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-700">Name</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-700 w-36">Actions</th>
            </tr>
          </thead>

          <tbody>
            {categories.length === 0 ? (
              <tr>
                <td colSpan={2} className="px-4 py-6 text-center text-sm text-gray-500">
                  No categories yet.
                </td>
              </tr>
            ) : (
              categories.map((cat) => (
                <tr key={cat.id} className="border-t last:border-b">
                  <td className="px-4 py-3 align-top text-sm text-gray-900">{cat.name}</td>
                  <td className="px-4 py-3 align-top">
                    <div className="flex items-center gap-2">
                      <ConfirmDeleteDialog
                        itemName={cat.name}
                        onConfirm={() => deleteCategory.mutate({ id: cat.id })}
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
