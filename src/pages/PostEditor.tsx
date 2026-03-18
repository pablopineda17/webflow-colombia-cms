import { useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { ArrowLeft, Save, Globe, Clock, RefreshCw } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { generateSlug, calculateReadTime, CATEGORIES, PATTERNS } from '../lib/utils'
import RichTextEditor from '../components/RichTextEditor'
import ImageUploadField from '../components/ImageUploadField'
import type { PostFormData } from '../types'

const EMPTY_FORM: PostFormData = {
  title: '',
  slug: '',
  seo_title: '',
  seo_description: '',
  excerpt: '',
  body: '',
  date: new Date().toISOString().split('T')[0],
  read_time: '',
  hero_image: null,
  thumbnail: null,
  category: 'Webflow',
  category_slug: 'webflow',
  pattern: 'dots',
  published: false,
}

export default function PostEditor() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const isNew = !id

  const [form, setForm] = useState<PostFormData>(EMPTY_FORM)
  const [loading, setLoading] = useState(!isNew)
  const [saving, setSaving] = useState(false)
  const [publishing, setPublishing] = useState(false)
  const [savedAt, setSavedAt] = useState<Date | null>(null)
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false)

  // Load existing post
  useEffect(() => {
    if (!id) return
    supabase.from('posts').select('*').eq('id', id).single().then(({ data, error }) => {
      if (error || !data) { navigate('/'); return }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id: _id, created_at: _c, updated_at: _u, ...formData } = data
      setForm(formData)
      setSlugManuallyEdited(true)
      setLoading(false)
    })
  }, [id, navigate])

  const set = <K extends keyof PostFormData>(key: K, value: PostFormData[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const handleTitleChange = (title: string) => {
    set('title', title)
    if (!slugManuallyEdited) {
      set('slug', generateSlug(title))
    }
  }

  const handleBodyChange = (html: string) => {
    set('body', html)
    set('read_time', calculateReadTime(html))
  }

  const handleCategoryChange = (label: string) => {
    const cat = CATEGORIES.find((c) => c.label === label)
    if (cat) {
      set('category', cat.label)
      set('category_slug', cat.slug)
    }
  }

  const save = async (publish?: boolean) => {
    if (!form.title.trim()) { alert('Title is required.'); return }
    if (!form.slug.trim()) { alert('Slug is required.'); return }

    const payload: PostFormData = {
      ...form,
      published: publish !== undefined ? publish : form.published,
    }

    if (publish) setPublishing(true)
    else setSaving(true)

    try {
      if (isNew) {
        const { data, error } = await supabase.from('posts').insert(payload).select().single()
        if (error) throw error
        setSavedAt(new Date())
        navigate(`/posts/${data.id}`, { replace: true })
      } else {
        const { error } = await supabase.from('posts').update(payload).eq('id', id)
        if (error) throw error
        setForm(payload)
        setSavedAt(new Date())
      }

      // Trigger rebuild when publishing OR unpublishing (was published, now draft)
      const wasPublished = form.published
      const isPublished = payload.published
      if (isPublished || wasPublished) {
        await fetch('/.netlify/functions/deploy', { method: 'POST' }).catch(() => null)
      }
    } catch (err) {
      console.error(err)
      alert('Error saving post. Please try again.')
    } finally {
      setSaving(false)
      setPublishing(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 px-6 py-3 sticky top-0 z-20">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft size={15} />
            All posts
          </Link>

          <div className="flex items-center gap-2">
            {savedAt && (
              <span className="text-xs text-gray-400 flex items-center gap-1">
                <Clock size={11} />
                Saved {savedAt.toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' })}
              </span>
            )}
            <button
              type="button"
              onClick={() => save()}
              disabled={saving || publishing}
              className="flex items-center gap-1.5 px-3.5 py-2 text-sm border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
            >
              {saving
                ? <RefreshCw size={14} className="animate-spin" />
                : <Save size={14} />
              }
              Save draft
            </button>
            <button
              type="button"
              onClick={() => save(true)}
              disabled={saving || publishing}
              className="flex items-center gap-1.5 px-3.5 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {publishing
                ? <RefreshCw size={14} className="animate-spin" />
                : <Globe size={14} />
              }
              Publish
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex gap-6">
          {/* Main content — left */}
          <div className="flex-1 min-w-0 space-y-5">
            {/* Title */}
            <div>
              <input
                type="text"
                value={form.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Post title…"
                className="w-full text-2xl font-semibold text-gray-900 bg-transparent border-0 outline-none placeholder-gray-300 focus:placeholder-gray-200 transition"
              />
              <div className="flex items-center gap-1.5 mt-2">
                <span className="text-xs text-gray-400">Slug:</span>
                <input
                  type="text"
                  value={form.slug}
                  onChange={(e) => { set('slug', e.target.value); setSlugManuallyEdited(true) }}
                  className="text-xs text-gray-500 bg-transparent border-0 outline-none flex-1 font-mono focus:text-gray-900 transition"
                  placeholder="auto-generated-slug"
                />
              </div>
            </div>

            {/* Excerpt */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Excerpt</label>
              <textarea
                value={form.excerpt ?? ''}
                onChange={(e) => set('excerpt', e.target.value)}
                placeholder="Short summary shown in post cards…"
                rows={3}
                className="w-full text-sm border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition"
              />
            </div>

            {/* Rich text body */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
              <RichTextEditor value={form.body ?? ''} onChange={handleBodyChange} />
            </div>
          </div>

          {/* Sidebar — right */}
          <div className="w-72 flex-shrink-0 space-y-4">
            {/* Status */}
            <div className="bg-white border border-gray-100 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Status</span>
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                  form.published ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'
                }`}>
                  {form.published ? 'Published' : 'Draft'}
                </span>
              </div>
            </div>

            {/* SEO */}
            <div className="bg-white border border-gray-100 rounded-xl p-4 space-y-3">
              <h3 className="text-sm font-semibold text-gray-700">SEO</h3>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Meta Title</label>
                <input
                  type="text"
                  value={form.seo_title ?? ''}
                  onChange={(e) => set('seo_title', e.target.value)}
                  placeholder={form.title || 'SEO title…'}
                  className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
                <p className="text-xs text-gray-400 mt-1">{(form.seo_title ?? '').length}/60</p>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Meta Description</label>
                <textarea
                  value={form.seo_description ?? ''}
                  onChange={(e) => set('seo_description', e.target.value)}
                  placeholder="SEO description…"
                  rows={3}
                  className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition"
                />
                <p className="text-xs text-gray-400 mt-1">{(form.seo_description ?? '').length}/160</p>
              </div>
            </div>

            {/* Meta */}
            <div className="bg-white border border-gray-100 rounded-xl p-4 space-y-3">
              <h3 className="text-sm font-semibold text-gray-700">Details</h3>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Date</label>
                <input
                  type="date"
                  value={form.date ?? ''}
                  onChange={(e) => set('date', e.target.value)}
                  className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Reading Time</label>
                <input
                  type="text"
                  value={form.read_time ?? ''}
                  onChange={(e) => set('read_time', e.target.value)}
                  placeholder="Auto-calculated"
                  className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Category</label>
                <select
                  value={form.category ?? ''}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-white"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.slug} value={c.label}>{c.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Card Pattern</label>
                <select
                  value={form.pattern}
                  onChange={(e) => set('pattern', e.target.value)}
                  className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-white"
                >
                  {PATTERNS.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Images */}
            <div className="bg-white border border-gray-100 rounded-xl p-4 space-y-4">
              <h3 className="text-sm font-semibold text-gray-700">Images</h3>
              <ImageUploadField
                label="Hero Image"
                bucket="hero-images"
                value={form.hero_image}
                onChange={(url) => set('hero_image', url)}
              />
              <ImageUploadField
                label="Thumbnail"
                bucket="thumbnails"
                value={form.thumbnail}
                onChange={(url) => set('thumbnail', url)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
