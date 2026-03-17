import { useState } from 'react'
import { X } from 'lucide-react'

interface EmbedDialogProps {
  open: boolean
  onClose: () => void
  onInsert: (html: string) => void
}

export default function EmbedDialog({ open, onClose, onInsert }: EmbedDialogProps) {
  const [html, setHtml] = useState('')

  if (!open) return null

  const handleInsert = () => {
    if (html.trim()) {
      onInsert(html.trim())
      setHtml('')
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-lg shadow-2xl">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h3 className="text-base font-semibold text-gray-900">Insert Embed</h3>
          <button
            type="button"
            onClick={() => { setHtml(''); onClose() }}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={18} />
          </button>
        </div>
        <div className="p-5">
          <p className="text-sm text-gray-500 mb-3">
            Paste your embed code — YouTube, Twitter, Instagram, or any &lt;iframe&gt;.
          </p>
          <textarea
            value={html}
            onChange={(e) => setHtml(e.target.value)}
            placeholder='<iframe src="https://..." ...></iframe>'
            className="w-full h-32 font-mono text-xs border border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none outline-none"
            autoFocus
          />
        </div>
        <div className="flex gap-3 justify-end px-5 pb-5">
          <button
            type="button"
            onClick={() => { setHtml(''); onClose() }}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleInsert}
            disabled={!html.trim()}
            className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-40 transition-colors"
          >
            Insert
          </button>
        </div>
      </div>
    </div>
  )
}
