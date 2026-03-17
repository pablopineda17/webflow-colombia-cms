import { Node, mergeAttributes } from '@tiptap/core'
import { ReactNodeViewRenderer, NodeViewWrapper } from '@tiptap/react'
import type { NodeViewProps } from '@tiptap/react'

const EmbedNodeView = ({ node, deleteNode }: NodeViewProps) => (
  <NodeViewWrapper>
    <div
      contentEditable={false}
      className="border-2 border-dashed border-indigo-300 rounded-lg p-3 my-3 bg-indigo-50 select-none"
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-indigo-700">⊞ Embed</span>
        <button
          type="button"
          onClick={deleteNode}
          className="text-xs text-red-400 hover:text-red-600 transition-colors"
        >
          Remove
        </button>
      </div>
      <p className="mt-1 text-xs text-gray-500 font-mono truncate">
        {(node.attrs as { html: string }).html?.substring(0, 120)}
      </p>
    </div>
  </NodeViewWrapper>
)

export const EmbedNode = Node.create({
  name: 'embedBlock',
  group: 'block',
  atom: true,
  draggable: true,

  addAttributes() {
    return {
      html: { default: '' },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-embed-block]',
        getAttrs: (node) => ({
          html: decodeURIComponent(
            (node as HTMLElement).getAttribute('data-embed-block') || ''
          ),
        }),
      },
    ]
  },

  renderHTML({ node }) {
    return [
      'div',
      mergeAttributes({
        'data-embed-block': encodeURIComponent((node.attrs as { html: string }).html),
        class: 'cms-embed-block',
      }),
    ]
  },

  addNodeView() {
    return ReactNodeViewRenderer(EmbedNodeView)
  },
})
