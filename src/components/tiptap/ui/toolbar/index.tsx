import { Separator } from '@/components/ui/separator';
import { Editor } from '@tiptap/react';
import {
  AlignCenterIcon,
  AlignJustifyIcon,
  AlignLeftIcon,
  AlignRightIcon,
  BoldIcon,
  CodeIcon,
  ItalicIcon,
  LinkIcon,
  ListIcon,
  ListOrderedIcon,
  QuoteIcon,
  StrikethroughIcon,
  UnderlineIcon,
} from 'lucide-react';
import { HeadingsGroup } from '../headings';
import { UndoRedoToolbarButton } from '../undo-redo-button';
import { ToolbarButton } from './toolbar-button';
import { TextAlignButton } from '../text-align-button';
import { TextFormatButton } from '../text-format-button';
export const Toolbar = ({ editor }: { editor: Editor }) => {
  return (
    <div className="border rounded-lg p-1 bg-card flex flex-wrap gap-1">
      {/* History Group */}
      <div className="flex items-center gap-1">
        <UndoRedoToolbarButton editor={editor} action="undo" />
        <UndoRedoToolbarButton editor={editor} action="redo" />
      </div>
      <Separator orientation="vertical" className="mx-1 h-8" />

      {/* Text Style Group */}
      <HeadingsGroup editor={editor} levels={[1, 2, 3, 4]} />

      <Separator orientation="vertical" className="mx-1 h-8" />

      {/* Basic Formatting Group */}
      <div className="flex items-center gap-1">
        <TextFormatButton action="bold" editor={editor} />
        <TextFormatButton action="italic" editor={editor} />
        <TextFormatButton action="underline" editor={editor} />
        <TextFormatButton action="strike" editor={editor} />
        <TextFormatButton action="code-block" editor={editor} />
      </div>

      <Separator orientation="vertical" className="mx-1 h-8" />

      {/* Alignment Group */}
      <div className="flex items-center gap-1">
        <TextAlignButton action="left" editor={editor} />
        <TextAlignButton action="center" editor={editor} />
        <TextAlignButton action="right" editor={editor} />
        <TextAlignButton action="justify" editor={editor} />
      </div>

      <Separator orientation="vertical" className="mx-1 h-8" />

      {/* Lists and Special Formats Group */}
      <div className="flex items-center gap-1">
        <ToolbarButton icon={ListIcon} label="Bullet List" />
        <ToolbarButton icon={ListOrderedIcon} label="Numbered List" />
        <ToolbarButton icon={QuoteIcon} label="Block Quote" />
        <ToolbarButton icon={LinkIcon} label="Insert Link" />
      </div>
    </div>
  );
};
