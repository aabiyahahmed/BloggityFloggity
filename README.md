# BloggityFloggity

Bloggity is a full-stack blogging platform built with Next.js, tRPC, Drizzle ORM, and PostgreSQL. Users can create posts, manage categories, and view published or draft posts through a modern dashboard.

---

## Features

- Create, edit, and delete posts  
- Manage categories for better organization  
- Draft and publish system  
- Dashboard for easy post management  
- Clean, minimal UI built with TailwindCSS and shadcn/ui

---

## Tech Stack

- Frontend: Next.js 15 (App Router)  
- Backend: tRPC + Drizzle ORM  
- Database: PostgreSQL (via Supabase or local instance)  
- UI: TailwindCSS + shadcn/ui  

---

## Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/aabiyahahmed/bloggity.git
cd bloggity
```

### 2. Install Dependencies
```bash
npm install
# or
yarn install
```

### 3. Environment Variables

Create a `.env` file in the root directory:

```bash
DATABASE_URL="postgresql://username:password@host:port/database"
NEXT_PUBLIC_TRPC_URL="http://localhost:3000/api/trpc"
```

If using Supabase:

```bash
DATABASE_URL="postgresql://postgres.<id>:[YOUR-PASSWORD]@aws-1-ap-south-1.pooler.supabase.com:5432/postgres"
```

Make sure your database connection is working before running migrations.

### 4. Run Database Migrations
```bash
npm run db:push
# or using drizzle-kit
npx drizzle-kit push
```

### 5. Start the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## tRPC Router Structure

The project uses a modular router design located in `src/server/trpc`:

```
src/server/trpc/
├── index.ts           # Exports main tRPC router
├── posts.ts           # Handles post creation, editing, deletion, and fetching
└── categories.ts      # Manages category CRUD operations
```

Each router defines procedures (public or protected) and communicates with Drizzle ORM for database queries. This setup ensures backend logic is type-safe, predictable, and auto-inferred on the client.

---

## License

This project is for educational purposes only.  
© 2025 Bloggity by Aabiyah Ahmed



