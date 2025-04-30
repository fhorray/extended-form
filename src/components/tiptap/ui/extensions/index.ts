
import { MAX_FILE_SIZE } from "../../utils"

import CharacterCount from "@tiptap/extension-character-count"
import Code from '@tiptap/extension-code'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import Document from '@tiptap/extension-document'
import Gapcursor from "@tiptap/extension-gapcursor"
import Heading from '@tiptap/extension-heading'
import Highlight from "@tiptap/extension-highlight"
import Image from '@tiptap/extension-image'
import Paragraph from '@tiptap/extension-paragraph'
import Placeholder from '@tiptap/extension-placeholder'
import Subscript from '@tiptap/extension-subscript'
import Superscript from '@tiptap/extension-superscript'
import TaskItem from '@tiptap/extension-task-item'
import TaskList from '@tiptap/extension-task-list'
import Text from '@tiptap/extension-text'
import TextAlign from '@tiptap/extension-text-align'
import Typography from '@tiptap/extension-typography'
import Underline from '@tiptap/extension-underline'
import StarterKit from '@tiptap/starter-kit'
import ImageUploadNode, { UploadFunction } from "../../nodes/image-upload-node/image-upload-node-extension"
import Link from "./link-extension"
import Selection from './selection-extension'
import ImageResize from 'tiptap-extension-resize-image';






// LOWLIGHT
import css from 'highlight.js/lib/languages/css'
import js from 'highlight.js/lib/languages/javascript'
import ts from 'highlight.js/lib/languages/typescript'
import html from 'highlight.js/lib/languages/xml'
import "highlight.js/styles/tokyo-night-dark.min.css"
import { all, createLowlight } from 'lowlight'
import TrailingNode from "./trailing-node-extension"

const lowlight = createLowlight(all);
lowlight.register('html', html);
lowlight.register('css', css);
lowlight.register('js', js);
lowlight.register('ts', ts);

interface ExtensionProps {
  limit?: number, placeholder?: string, uploadImageFunction?: UploadFunction
}

export const extensions = ({ limit, placeholder, uploadImageFunction }: ExtensionProps = { limit: 2000, placeholder: "Write something cool ...", }) => {
  return [
    StarterKit.configure({
      heading: {
        HTMLAttributes: {
          class: 'font-bold text-gray-800', // aplica a todos os níveis de heading
        },
      },
      codeBlock: false
    }),
    Gapcursor,
    Selection,
    TrailingNode,
    Underline,
    Code,
    Document,
    Paragraph,
    Text,
    Image,
    Subscript,
    Superscript,
    TaskItem,
    TaskList,
    Typography,
    ImageResize,
    Highlight.configure({ multicolor: true }),
    Placeholder.configure({
      placeholder,
    }),
    Link.configure({
      openOnClick: false,
    }),
    Heading.configure({
      levels: [1, 2, 3, 4, 5, 6],
    }),
    CharacterCount.configure({
      limit: limit
    }),
    TextAlign.configure({
      types: ['heading', 'paragraph'],
    }),
    CodeBlockLowlight.configure({
      lowlight,
      defaultLanguage: "js",
    }),
    ImageUploadNode.configure({
      accept: 'image/*',
      maxSize: MAX_FILE_SIZE,
      limit: 3,
      upload: uploadImageFunction as UploadFunction,
      onError: (error) => console.error('Upload failed:', error),
    }),
  ]
}