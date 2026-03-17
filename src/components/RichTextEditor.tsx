import { useEffect, useRef, useState } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import {
  Bold, Italic, Underline as UnderlineIcon, Heading1, Heading2, Heading3,
  Quote, List, ListOrdered, ImageIcon, Code2, Undo, Redo,
} from 'lucide-react'
import { supabase } from '../lib/supabase'
import { EmbedNode } from './extensions/EmbedNode'
import EmbedDialog from './EmbedDialog'

interface RichTextEditorProps {
  value: string
  onChange: (html: string) => void
}

export default function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const [embedOpen, setEmbedOpen] = useState(false)
  const [imageUploading, setImageUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const isExternalUpdate = useRef(false)

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Image.configure({ HTMLAttributes: { class: 'max-w-full rounded-lg' } }),
      Link.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder: 'Write your blog post here…' }),
      EmbedNode,
    ],
    content: value,
    onUpdate: ({ editor }) => {
      if (!isExternalUpdate.current) {
        onChange(editor.getHTML())
      }
    },
  })

  // Sync external value changes (e.g., when loading a saved post)
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      isExternalUpdate.current = true
      editor.commands.setContent(value, false)
      isExternalUpdate.current = false
    }
  }, [value, editor])

  const handleImageUpload = async (file: File) => {
    setImageUploading(true)
    try {
      const ext = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
      const { error } = await supabase.storage.from('body-images').upload(fileName, file)
      if (error) throw error
      const { data } = supabase.storage.from('body-images').getPublicUrl(fileName)
      editor?.chain().focus().setImage({ src: data.publicUrl }).run()
    } catch {
      alert('Error uploading image. Please try again.')
    } finally {
      setImageUploading(false)
    }
  }

  const handleEmbedInsert = (html: string) => {
    editor?.chain().focus().insertContent({ type: 'embedBlock', attrs: { html } }).run()
  }

  if (!editor) return null

  const ToolbarButton = ({
    onClick, active = false, disabled = false, title, children,
  }: {
    onClick: () => void
    active?: boolean
    disabled?: boolean
    title: string
    children: React.ReactNode
  }) => (
    <button
      type="button"
      onMouseDown={(e) => { e.preventDefault(); onClick() }}
      title={title}
      disabled={disabled}
      className={`p-1.5 rounded transition-colors ${
        active
          ? 'bg-gray-200 text-gray-900'
          : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
      } disabled:opacity-40`}
    >
      {children}
    </button>
  )

  const Divider = () => <div className="w-px h-5 bg-gray-200 mx-0.5" />

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 px-2 py-1.5 border-b border-gray-100 bg-gray-50 sticky top-0 z-10">
        <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} title="Bold">
          <Bold size={15} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} title="Italic">
          <Italic size={15} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive('underline')} title="Underline">
          <UnderlineIcon size={15} />
        </ToolbarButton>

        <Divider />

        <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} active={editor.isActive('heading', { level: 1 })} title="Heading 1">
          <Heading1 size={15} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive('heading', { level: 2 })} title="Heading 2">
          <Heading2 size={15} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive('heading', { level: 3 })} title="Heading 3">
          <Heading3 size={15} />
        </ToolbarButton>

        <Divider />

        <ToolbarButton onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive('blockquote')} title="Blockquote">
          <Quote size={15} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')} title="Bullet list">
          <List size={15} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')} title="Ordered list">
          <ListOrdered size={15} />
        </ToolbarButton>

        <Divider />

        <ToolbarButton
          onClick={() => fileInputRef.current?.click()}
          disabled={imageUploading}
          title="Insert image"
        >
          {imageUploading
            ? <div className="w-3.5 h-3.5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
            : <ImageIcon size={15} />
          }
        </ToolbarButton>
        <ToolbarButton onClick={() => setEmbedOpen(true)} title="Insert embed">
          <Code2 size={15} />
        </ToolbarButton>

        <Divider />

        <ToolbarButton onClick={() => editor.chain().focus().undo().run()} title="Undo">
          <Undo size={15} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().redo().run()} title="Redo">
          <Redo size={15} />
        </ToolbarButton>
      </div>

      {/* Editor area */}
      <EditorContent
        editor={editor}
        className="prose prose-gray max-w-none p-5 text-sm"
      />

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) handleImageUpload(file)
          e.target.value = ''
        }}
      />

      <EmbedDialog
        open={embedOpen}
        onClose={() => setEmbedOpen(false)}
        onInsert={handleEmbedInsert}
      />
    </div>
  )
}
