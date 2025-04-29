import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import content from './content.json';
import { extensions } from './extensions';
import { Toolbar } from './ui/toolbar';

const TipTapEditor = () => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          HTMLAttributes: {
            class: 'font-bold text-gray-800', // aplica a todos os níveis de heading
          },
        },
      }),
      ...extensions,
    ],
    content,
  });

  if (!editor) return <span>Loading...</span>;

  return (
    <div className="p-8 h-[450px]">
      <Toolbar editor={editor} />
      <EditorContent
        editor={editor}
        className="h-full w-full border-gray-300 border"
      />

      {/* <FloatingMenuComponent editor={editor} /> */}
      {/* <BubbleMenu editor={editor}>Bubble Menu</BubbleMenu> */}
    </div>
  );
};

export default TipTapEditor;
