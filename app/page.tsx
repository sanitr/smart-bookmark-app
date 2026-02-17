
"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import type { Session } from "@supabase/supabase-js"

export default function Home() {
  const [session, setSession] = useState<Session | null>(null)
  const [bookmarks, setBookmarks] = useState<any[]>([])
  const [title, setTitle] = useState("")
  const [url, setUrl] = useState("")
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState("")
  const [editingId, setEditingId] = useState<string | null>(null)

  // Load session + bookmarks
  useEffect(() => {
    const loadData = async () => {
      const { data } = await supabase.auth.getSession()

      if (data.session) {
        setSession(data.session)
        fetchBookmarks(data.session.user.id)
      }
    }

    loadData()
  }, [])

  const fetchBookmarks = async (userId: string) => {
    const { data } = await supabase
      .from("bookmarks")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    setBookmarks(data || [])
  }

  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({ provider: "google" })
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.reload()
  }

  // URL validation
  const isValidUrl = (value: string) => {
    try {
      new URL(value)
      return true
    } catch {
      return false
    }
  }

  const addBookmark = async () => {
    if (!title || !url || !session) return

    if (!isValidUrl(url)) {
      alert("Please enter a valid URL including https://")
      return
    }

    setLoading(true)

    const { error } = await supabase.from("bookmarks").insert({
      title,
      url,
      user_id: session.user.id,
    })

    setLoading(false)

    if (error) {
      alert(error.message)
      return
    }

    setSuccess("Bookmark saved ✓")
    setTitle("")
    setUrl("")
    fetchBookmarks(session.user.id)

    setTimeout(() => setSuccess(""), 1500)
  }

  const updateBookmark = async () => {
    if (!editingId || !session) return

    await supabase
      .from("bookmarks")
      .update({ title, url })
      .eq("id", editingId)

    setEditingId(null)
    setTitle("")
    setUrl("")
    fetchBookmarks(session.user.id)
  }

  const deleteBookmark = async (id: string) => {
    if (!session) return
    await supabase.from("bookmarks").delete().eq("id", id)
    fetchBookmarks(session.user.id)
  }

  const filteredBookmarks = bookmarks.filter((b) =>
    b.title.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0b0b0c]">
      <div className="w-[440px] bg-[#121214] border border-white/10 rounded-2xl shadow-xl p-8 text-gray-200">

        {!session ? (
          <div className="text-center">
            <h1 className="text-2xl font-semibold mb-2">Smart Bookmark</h1>
            <p className="text-gray-400 text-sm mb-8">
              Save and organize your links securely.
            </p>

            <button
              onClick={handleLogin}
              className="w-full bg-white text-black py-3 rounded-lg font-medium hover:opacity-90"
            >
              Continue with Google
            </button>
          </div>
        ) : (
          <>
            {/* HEADER */}
            <div className="flex justify-between items-center mb-5">
              <span className="text-xs text-gray-400 truncate">
                {session.user.email}
              </span>
              <button
                onClick={handleLogout}
                className="text-xs text-red-400 hover:text-red-300"
              >
                Logout
              </button>
            </div>

            {/* SUCCESS */}
            {success && (
              <p className="text-green-400 text-sm mb-3 text-center">
                {success}
              </p>
            )}

            {/* INPUTS */}
            <input
              placeholder="Bookmark title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" &&
                (editingId ? updateBookmark() : addBookmark())
              }
              className="bg-[#1a1a1c] border border-white/10 p-2 w-full mb-2 rounded-md text-sm"
            />

            <input
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" &&
                (editingId ? updateBookmark() : addBookmark())
              }
              className="bg-[#1a1a1c] border border-white/10 p-2 w-full mb-3 rounded-md text-sm"
            />

            <button
              onClick={editingId ? updateBookmark : addBookmark}
              disabled={loading}
              className="w-full bg-purple-600 py-2 rounded-md text-sm font-medium hover:bg-purple-500 transition mb-4"
            >
              {loading
                ? "Saving..."
                : editingId
                ? "Update Bookmark"
                : "Add Bookmark"}
            </button>

            {/* SEARCH */}
            <input
              placeholder="Search bookmarks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-[#1a1a1c] border border-white/10 p-2 w-full mb-4 rounded-md text-sm"
            />

            {/* LIST */}
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {filteredBookmarks.length === 0 && (
                <p className="text-gray-500 text-center text-sm">
                  No bookmarks yet
                </p>
              )}

              {filteredBookmarks.map((b) => (
                <div
                  key={b.id}
                  className="flex justify-between items-center bg-[#1a1a1c] border border-white/10 rounded-md px-3 py-2 hover:border-purple-400 transition"
                >
                  <div className="flex items-center gap-2 overflow-hidden">
                    <img
                      src={`https://www.google.com/s2/favicons?domain=${b.url}&sz=32`}
                      className="w-4 h-4 opacity-80"
                    />
                    <a
                      href={b.url}
                      target="_blank"
                      className="text-sm text-gray-200 truncate hover:text-purple-300"
                    >
                      {b.title}
                    </a>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        setEditingId(b.id)
                        setTitle(b.title)
                        setUrl(b.url)
                      }}
                      className="text-xs text-blue-400"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => deleteBookmark(b.id)}
                      className="text-xs text-red-400"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
git init



