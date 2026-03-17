import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Edit2, Trash2, LogOut, Globe, FileText } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { formatDate } from '../lib/utils'
import type { Post } from '../types'

export default function Dashboard() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)

  const fetchPosts = async () => {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false })
    if (!error && data) setPosts(data)
    setLoading(false)
  }

  useEffect(() => { fetchPosts() }, [])

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return
    setDeleting(id)
    await supabase.from('posts').delete().eq('id', id)
    setPosts((prev) => prev.filter((p) => p.id !== id))
    setDeleting(null)
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">W</span>
            </div>
            <span className="font-semibold text-gray-900">Webflow Colombia CMS</span>
          </div>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors"
          >
            <LogOut size={15} />
            Sign out
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Blog Posts</h1>
            <p className="text-sm text-gray-500 mt-0.5">{posts.length} post{posts.length !== 1 ? 's' : ''}</p>
          </div>
          <Link
            to="/posts/new"
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            <Plus size={16} />
            New Post
          </Link>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20">
            <FileText size={40} className="text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">No posts yet.</p>
            <Link
              to="/posts/new"
              className="inline-flex items-center gap-1.5 mt-4 text-sm text-blue-600 hover:text-blue-800"
            >
              <Plus size={14} />
              Create your first post
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {posts.map((post) => (
              <div
                key={post.id}
                className="bg-white border border-gray-100 rounded-xl px-5 py-4 flex items-center gap-4 hover:border-gray-200 transition-colors"
              >
                {post.thumbnail && (
                  <img
                    src={post.thumbnail}
                    alt=""
                    className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <h2 className="font-medium text-gray-900 truncate">{post.title}</h2>
                    <span
                      className={`flex-shrink-0 text-xs px-2 py-0.5 rounded-full font-medium ${
                        post.published
                          ? 'bg-green-50 text-green-700'
                          : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {post.published ? 'Published' : 'Draft'}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-400">
                    {post.date && <span>{formatDate(post.date)}</span>}
                    {post.category && <span>{post.category}</span>}
                    {post.read_time && <span>{post.read_time}</span>}
                  </div>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <Link
                    to={`/posts/${post.id}`}
                    className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <Edit2 size={15} />
                  </Link>
                  <button
                    onClick={() => handleDelete(post.id, post.title)}
                    disabled={deleting === post.id}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-40"
                    title="Delete"
                  >
                    {deleting === post.id
                      ? <div className="w-3.5 h-3.5 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                      : <Trash2 size={15} />
                    }
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {posts.some(p => p.published) && (
          <div className="mt-6 pt-6 border-t border-gray-100">
            <a
              href="https://webflowcolombia.com/blog"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-600 transition-colors"
            >
              <Globe size={13} />
              View live blog
            </a>
          </div>
        )}
      </main>
    </div>
  )
}
