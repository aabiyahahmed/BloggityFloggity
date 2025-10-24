"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { trpc } from "@/utils/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";


const SimpleMDE = dynamic(() => import("react-simplemde-editor"), { ssr: false });
import "easymde/dist/easymde.min.css";

export default function NewPostPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [published, setPublished] = useState(false);

  const { data: categories = [] } = trpc.categories.getAllCategories.useQuery();
  const createPost = trpc.posts.createPost.useMutation();

  const getCategoryIds = () => selectedCategory ? [Number(selectedCategory)] : [];

  const handleSubmit = async () => {
    if (!title || !content) return alert("Enter title and content");

    await createPost.mutateAsync({
      title,
      content,
      categoryIds: getCategoryIds(),
      published,
    });

    setTitle(""); setContent(""); setSelectedCategory(""); setPublished(false);
    alert("Post created!");
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">New Post</h1>

      <div className="mb-4">
        <Label>Title</Label>
        <Input value={title} onChange={e => setTitle(e.target.value)} />
      </div>

      <div className="mb-4">
        <Label>Content</Label>
        <SimpleMDE value={content} onChange={setContent} />
      </div>

      <div className="mb-4">
        <Label>Category</Label>
        <Select value={selectedCategory} onValueChange={v => setSelectedCategory(v)}>
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map(c => <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="mb-4">
        <label>
          <input type="checkbox" checked={published} onChange={e => setPublished(e.target.checked)} />
          {" "}Publish now
        </label>
      </div>

      <Button onClick={handleSubmit}>Create Post</Button>
    </div>
  );
}
