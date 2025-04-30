import { cn } from '@/lib/utils';
import { BubbleMenu, Editor } from '@tiptap/react';
import { HeadingsGroup } from '../headings';
import { LinkButton } from '../link-button';
import { ListButton } from '../list-button';
import { TextFormatButton } from '../text-format-button';

export const EditorBubbleMenu = ({ editor }: { editor: Editor }) => {
  const isImageSelected = editor.isActive('image');

  if (isImageSelected) return null;

  return (
    <BubbleMenu
      editor={editor}
      tippyOptions={{ duration: 100 }}
      className="overflow-hidden w-fit"
    >
      <div
        className={cn(
          'relative backdrop-blur-lg border border-white/20 rounded-lg',
          'bg-background/80 shadow-xl',
          'p-1.5 flex gap-1',
          'ring-1 ring-black/5 dark:ringTeste-white/5',
        )}
      >
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-primary/2 pointer-events-none" />

        {/* Content */}
        <div className="relative flex items-center gap-2 px-4">
          <HeadingsGroup editor={editor} levels={[1, 2, 3, 4]} />

          <TextFormatButton
            action="bold"
            editor={editor}
            className="h-8 w-8 rounded-md hover:bg-primary/10"
          />
          <TextFormatButton
            action="italic"
            editor={editor}
            className="h-8 w-8 rounded-md hover:bg-primary/10"
          />
          <TextFormatButton
            action="underline"
            editor={editor}
            className="h-8 w-8 rounded-md hover:bg-primary/10"
          />
          <TextFormatButton
            action="strike"
            editor={editor}
            className="h-8 w-8 rounded-md hover:bg-primary/10"
          />

          <TextFormatButton
            action="codeBlock"
            editor={editor}
            className="h-8 w-8 rounded-md hover:bg-primary/10"
          />

          <LinkButton editor={editor} />

          <ListButton editor={editor} />
        </div>
      </div>
    </BubbleMenu>
  );
};
