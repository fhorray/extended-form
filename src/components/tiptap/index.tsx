import { cn } from '@/lib/utils';
import { Content, EditorContent, useEditor } from '@tiptap/react';
import contentData from './content.json';
import { extensions } from './ui/extensions';
import { EditorBubbleMenu } from './ui/bubble-menu';
import { Toolbar } from './ui/toolbar';
import React from 'react';
import { convertFileToBase64 } from './utils';

const TipTapEditor = ({
  className,
  content,
  onChange,
}: {
  className?: string;
  content?: string;
  onChange?: (content: string) => void;
}) => {
  /**
   * Handles image upload with progress tracking and abort capability
   */
  const uploadImageFunction = async (
    _file: File,
    onProgress?: (event: { progress: number }) => void,
    abortSignal?: AbortSignal,
  ): Promise<string> => {
    // Simula o progresso do upload

    for (let progress = 0; progress <= 100; progress += 40) {
      if (abortSignal?.aborted) {
        throw new Error('Upload cancelled');
      }
      await new Promise((resolve) => setTimeout(resolve, 500));
      onProgress?.({ progress });
    }

    // Converte o arquivo para base64 após a simulação
    return convertFileToBase64(_file, abortSignal);
  };

  const editor = useEditor({
    extensions: [...extensions({ uploadImageFunction })],
    editorProps: {
      attributes: {
        autocomplete: 'off',
        autocorrect: 'off',
        autocapitalize: 'off',
        class: cn(
          'h-full w-full focus:outline-none min-h-[200px] p-2',
          className,
        ),
      },
    },
    onCreate: ({ editor }) => {
      editor.commands.setContent(contentData);
      onChange?.(editor.getHTML());
    },
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
    content: content,
  });

  // useEffect to update content
  React.useEffect(() => {
    if (content !== null) {
      editor?.commands.setContent(content as Content);
    }
  }, [content]);

  if (!editor) return <span>Loading...</span>;

  return (
    <div className="space-y-4">
      <Toolbar editor={editor} />
      <EditorContent editor={editor} className="h-full w-full" />
      <EditorBubbleMenu editor={editor} />

      {/* <FloatingMenuComponent editor={editor} /> */}
      {/* <BubbleMenu editor={editor}>Bubble Menu</BubbleMenu> */}
    </div>
  );
};

export default TipTapEditor;
