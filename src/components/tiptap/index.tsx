import { EditorContent, useEditor } from '@tiptap/react';
import content from './content.json';
import { extensions } from './extensions';
import { Toolbar } from './ui/toolbar';

const TipTapEditor = () => {
  const editor = useEditor({
    extensions: [...extensions()],
    content: content,
  });

  if (!editor) return <span>Loading...</span>;

  console.log(content);

  return (
    <div className="p-8 !min-h-[450px]">
      <Toolbar editor={editor} />
      <EditorContent
        editor={editor}
        className="h-full w-full border-gray-300 border p-2"
      />

      {/* <FloatingMenuComponent editor={editor} /> */}
      {/* <BubbleMenu editor={editor}>Bubble Menu</BubbleMenu> */}
    </div>
  );
};

export default TipTapEditor;
