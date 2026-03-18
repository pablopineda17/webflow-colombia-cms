import { useEffect, useRef, useState } from 'react'
import { useEditor, EditorContent, FloatingMenu, BubbleMenu } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import {
  Bold, Italic, Underline as UnderlineIcon, Heading1, Heading2, Heading3,
  Quote, List, ListOrdered, ImageIcon, Code2, Undo, Redo, Plus,
  Heading4, Heading5, Heading6, Code, AlignLeft,
} from 'lucide-react'
import { supabase } from '../lib/supabase'
import { EmbedNode } from './extensions/EmbedNode'
import EmbedDialog from './EmbedDialog'

interface RichTextEditorProps {
  value: string
  onChange: (html: string) => void
}

const BLOCK_MENU_ITEMS = [
  {
    group: 'Text',
    items: [
      { label: 'Heading 1',     icon: Heading1,    action: (e: ReturnType<typeof useEditor>) => e?.chain().focus().toggleHeading({ level: 1 }).run() },
      { label: 'Heading 2',     icon: Heading2,    action: (e: ReturnType<typeof useEditor>) => e?.chain().focus().toggleHeading({ level: 2 }).run() },
      { label: 'Heading 3',     icon: Heading3,    action: (e: ReturnType<typeof useEditor>) => e?.chain().focus().toggleHeading({ level: 3 }).run() },
      { label: 'Heading 4',     icon: Heading4,    action: (e: ReturnType<typeof useEditor>) => e?.chain().focus().toggleHeading({ level: 4 }).run() },
      { label: 'Heading 5',     icon: Heading5,    action: (e: ReturnType<typeof useEditor>) => e?.chain().focus().toggleHeading({ level: 5 }).run() },
      { label: 'Heading 6',     icon: Heading6,    action: (e: ReturnType<typeof useEditor>) => e?.chain().focus().toggleHeading({ level: 6 }).run() },
      { label: 'Paragraph',     icon: AlignLeft,   action: (e: ReturnType<typeof useEditor>) => e?.chain().focus().setParagraph().run() },
      { label: 'Blockquote',    icon: Quote,       action: (e: ReturnType<typeof useEditor>) => e?.chain().focus().toggleBlockquote().run() },
      { label: 'Numbered list', icon: ListOrdered, action: (e: ReturnType<typeof useEditor>) => e?.chain().focus().toggleOrderedList().run() },
      { label: 'Bulleted list', icon: List,        action: (e: ReturnType<typeof useEditor>) => e?.chain().focus().toggleBulletList().run() },
      { label: 'Code block',    icon: Code,        action: (e: ReturnType<typeof useEditor>) => e?.chain().focus().toggleCodeBlock().run() },
    ],
  },
  {
    group: 'Media',
    items: [
      { label: 'Image',       icon: ImageIcon, action: (_e: ReturnType<typeof useEditor>, triggerImage?: () => void) => triggerImage?.() },
      { label: 'HTML embed',  icon: Code2,     action: (_e: ReturnType<typeof useEditor>, _t?: () => void, openEmbed?: () => void) => openEmbed?.() },
    ],
  },
]

export default function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const [embedOpen, setEmbedOpen] = useState(false)
  const [imageUploading, setImageUploading] = useState(false)
  const [blockMenuOpen, setBlockMenuOpen] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const isExternalUpdate = useRef(false)

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Image.configure({ HTMLAttributes: { class: 'max-w-full rounded-lg' } }),
      Link.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder: 'Write your blog post here… or press + to insert a block' }),
      EmbedNode,
    ],
    content: value,
    onUpdate: ({ editor }) => {
      if (!isExternalUpdate.current) {
        onChange(editor.getHTML())
      }
    },
  })

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

  const triggerImage = () => fileInputRef.current?.click()
  const openEmbed = () => { setEmbedOpen(true); setBlockMenuOpen(false) }

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
    <div className="border border-gray-200 rounded-xl overflow-visible focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition">
      {/* Top toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 px-2 py-1.5 border-b border-gray-100 bg-gray-50 sticky top-0 z-10 rounded-t-xl">
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
          onClick={triggerImage}
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

      {/* Bubble menu — appears on text selection */}
      <BubbleMenu
        editor={editor}
        tippyOptions={{ duration: 100 }}
        className="flex items-center gap-0.5 bg-gray-900 border border-gray-700 rounded-lg px-1.5 py-1 shadow-xl"
      >
        {[
          { title: 'Bold',       icon: <Bold size={13} />,          active: editor.isActive('bold'),      action: () => editor.chain().focus().toggleBold().run() },
          { title: 'Italic',     icon: <Italic size={13} />,        active: editor.isActive('italic'),    action: () => editor.chain().focus().toggleItalic().run() },
          { title: 'Underline',  icon: <UnderlineIcon size={13} />, active: editor.isActive('underline'), action: () => editor.chain().focus().toggleUnderline().run() },
          { title: 'Code',       icon: <Code size={13} />,          active: editor.isActive('code'),      action: () => editor.chain().focus().toggleCode().run() },
        ].map(({ title, icon, active, action }) => (
          <button
            key={title}
            type="button"
            onMouseDown={(e) => { e.preventDefault(); action() }}
            title={title}
            className={`p-1.5 rounded transition-colors ${active ? 'bg-white text-gray-900' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}
          >
            {icon}
          </button>
        ))}

        <div className="w-px h-4 bg-gray-600 mx-0.5" />

        {([1, 2, 3, 4, 5, 6] as const).map(level => (
          <button
            key={level}
            type="button"
            onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleHeading({ level }).run() }}
            title={`Heading ${level}`}
            className={`px-1.5 py-1 rounded text-xs font-bold transition-colors ${editor.isActive('heading', { level }) ? 'bg-white text-gray-900' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}
          >
            H{level}
          </button>
        ))}

        <div className="w-px h-4 bg-gray-600 mx-0.5" />

        <button
          type="button"
          onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleBlockquote().run() }}
          title="Blockquote"
          className={`p-1.5 rounded transition-colors ${editor.isActive('blockquote') ? 'bg-white text-gray-900' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}
        >
          <Quote size={13} />
        </button>
      </BubbleMenu>

      {/* Floating + block menu */}
      <FloatingMenu
        editor={editor}
        tippyOptions={{ duration: 100, placement: 'left-start', offset: [0, 8] }}
        className="flex items-center"
      >
        <div className="relative">
          <button
            type="button"
            onMouseDown={(e) => { e.preventDefault(); setBlockMenuOpen(v => !v) }}
            className="w-6 h-6 flex items-center justify-center rounded-md border border-gray-300 bg-white text-gray-400 hover:text-gray-700 hover:border-gray-400 transition-colors shadow-sm"
          >
            <Plus size={13} />
          </button>

          {blockMenuOpen && (
            <>
              {/* Backdrop to close */}
              <div
                className="fixed inset-0 z-40"
                onMouseDown={() => setBlockMenuOpen(false)}
              />
              <div className="absolute left-8 top-0 z-50 w-52 bg-white border border-gray-200 rounded-xl shadow-lg py-1.5 overflow-hidden">
                {BLOCK_MENU_ITEMS.map(group => (
                  <div key={group.group}>
                    <p className="px-3 pt-2 pb-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      {group.group}
                    </p>
                    {group.items.map(item => {
                      const Icon = item.icon
                      return (
                        <button
                          key={item.label}
                          type="button"
                          onMouseDown={(e) => {
                            e.preventDefault()
                            item.action(editor, triggerImage, openEmbed)
                            setBlockMenuOpen(false)
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <Icon size={15} className="text-gray-400 flex-shrink-0" />
                          {item.label}
                        </button>
                      )
                    })}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </FloatingMenu>

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
