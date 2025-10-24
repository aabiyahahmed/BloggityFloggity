import Link from "next/link";
import { ReactNode } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-100 p-4 space-y-4">
        <h2 className="text-xl font-bold">Dashboard</h2>
        <nav className="flex flex-col space-y-2">
          <Link href="/dashboard">Posts</Link>
          <Link href="/dashboard/new-post">New Post</Link>
          <Link href="/dashboard/categories">Categories</Link>
          <Link href="/posts">All Posts</Link>
          <Link href="/">Home</Link>
        </nav>
      </aside>

      {/* Content */}
      <div className="flex-1 p-6 bg-white">{children}</div>
    </div>
  );
}
