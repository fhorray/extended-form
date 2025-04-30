import { Node, mergeAttributes } from '@tiptap/core'

export const CustomCodeBlock = Node.create({
  name: 'customCodeBlock',
  group: 'block',
  code: true,
  content: 'text*',
  marks: '',
  atom: true,
  addAttributes() {
    return {
      language: {
        default: 'bash',
        parseHTML: element => element.getAttribute('data-language'),
        renderHTML: attributes => {
          return {
            'data-language': attributes.language,
          }
        },
      },
    }
  },
  parseHTML() {
    return [{ tag: 'pre[data-type="custom-code-block"]' }]
  },
  renderHTML({ HTMLAttributes }) {
    return ['pre', mergeAttributes(HTMLAttributes, { 'data-type': 'custom-code-block' }), ['code', 0]]
  },
})