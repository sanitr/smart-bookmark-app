## Smart Bookmark App

A secure bookmark manager built with Next.js and Supabase.

---

### 🌍 Live Demo

https://sanitr-bookmarks.vercel.app

---

### 🚀 Features

- Google OAuth login (no passwords)
- Private bookmarks per user
- Add & delete bookmarks
- Real-time updates
- Responsive modern UI
- Secure database access with Row Level Security

---

### 🛠 Tech Stack

- Next.js (App Router)
- Supabase (Auth, Database, Realtime)
- Tailwind CSS
- Vercel Deployment

---

### ⚙️ Local Setup

1. Clone the repo
 git clone https://github.com/sanitr/smart-bookmark-app

2. Install dependencies
    Create `.env.local`

  NEXT_PUBLIC_SUPABASE_URL=your_url
  NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
  
4. Run locally

 
---

### 🔐 Security

- Row Level Security ensures users can only access their own bookmarks.
- OAuth authentication handled securely via Supabase.

---

### ⚠️ Challenges Faced & Solutions

**OAuth redirect errors**  
→ Fixed by configuring Supabase and Google OAuth redirect URLs.

**Bookmarks not saving due to RLS**  
→ Added policies allowing authenticated users to insert/select their own data.

**Bookmarks not showing after insert**  
→ Ensured session loads before fetching and refreshed state after insert.

**Production login redirecting to localhost**  
→ Updated Supabase Site URL & Redirect URLs to production domain.

---

### 👩‍💻 Author

Swastika Sengupta









