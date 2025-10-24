export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <header className="bg-gradient-to-br from-gray-900 to-gray-800 text-white py-24 text-center">
        <h1 className="text-5xl font-bold mb-6 tracking-tight">Welcome to Bloggity</h1>
        <p className="text-lg max-w-2xl mx-auto text-gray-300">
          A place to share your ideas, discover inspiring posts, and grow your writing journey.
        </p>
        <div className="mt-10 flex justify-center gap-4">
          <a
            href="/posts"
            className="px-6 py-3 bg-white text-gray-900 rounded-lg font-medium hover:bg-gray-200 transition"
          >
            Explore Posts
          </a>
          <a
            href="/dashboard"
            className="px-6 py-3 border border-gray-400 rounded-lg font-medium text-white hover:bg-gray-700 transition"
          >
            Go to Dashboard
          </a>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-24 bg-gray-50 text-center">
        <h2 className="text-3xl font-bold mb-12 text-gray-800">What You Can Do</h2>
        <div className="max-w-6xl mx-auto grid gap-8 px-6 md:grid-cols-3">
          <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition">
            <h3 className="text-xl font-semibold mb-2 text-gray-800">Create Posts</h3>
            <p className="text-gray-600">
              Write and publish effortlessly using a clean and powerful editor.
            </p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition">
            <h3 className="text-xl font-semibold mb-2 text-gray-800">Organize Categories</h3>
            <p className="text-gray-600">
              Group your posts by category to keep your content structured and easy to explore.
            </p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition">
            <h3 className="text-xl font-semibold mb-2 text-gray-800">Draft & Publish</h3>
            <p className="text-gray-600">
              Save drafts, publish when ready, and manage everything from your dashboard.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8 text-center">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} <span className="text-white">Bloggity</span>. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
