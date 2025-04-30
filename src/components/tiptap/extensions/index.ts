
import CharacterCount from "@tiptap/extension-character-count"
import Document from '@tiptap/extension-document'
import Heading from '@tiptap/extension-heading'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'
import StarterKit from '@tiptap/starter-kit'
import Gapcursor from "@tiptap/extension-gapcursor"
import Placeholder from '@tiptap/extension-placeholder'
import TextAlign from '@tiptap/extension-text-align'
import Underline from '@tiptap/extension-underline'
import Code from '@tiptap/extension-code'
import { CustomCodeBlock } from "../nodes/custom-code-block"
import { ReactNodeViewRenderer } from "@tiptap/react"
import { CustomCodeBlockComponent } from "../nodes/custom-code-block-component"

interface ExtensionProps {
  limit?: number, placeholder?: string
}

export const extensions = ({ limit, placeholder }: ExtensionProps = { limit: 2000, placeholder: "Write something cool ..." }) => {
  return [
    StarterKit.configure({
      heading: {
        HTMLAttributes: {
          class: 'font-bold text-gray-800', // aplica a todos os níveis de heading
        },
      },
    }),
    Gapcursor,
    Placeholder.configure({
      placeholder,
    }),
    Underline,
    Code,
    Document,
    Paragraph,
    Text,
    Heading.configure({
      levels: [1, 2, 3, 4, 5, 6],
    }),
    CharacterCount.configure({
      limit: limit
    }),
    TextAlign.configure({
      types: ['heading', 'paragraph'],
    }),
    CustomCodeBlock.extend({
      addNodeView() {
        return ReactNodeViewRenderer(CustomCodeBlockComponent)
      },
    }),
  ]
}