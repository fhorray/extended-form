import { Editor } from '@tiptap/react';
import { ToolbarButton } from './toolbar-button';
import {
  AlignCenterIcon,
  AlignJustifyIcon,
  AlignLeftIcon,
  AlignRightIcon,
  BoldIcon,
  CodeIcon,
  Heading1Icon,
  Heading2Icon,
  Heading3Icon,
  Heading4Icon,
  Heading5Icon,
  Heading6Icon,
  ItalicIcon,
  LinkIcon,
  ListIcon,
  ListOrderedIcon,
  QuoteIcon,
  RedoIcon,
  StrikethroughIcon,
  TypeIcon,
  UnderlineIcon,
  UndoIcon,
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { HeadingsGroup } from '../headings';
export const Toolbar = ({ editor }: { editor: Editor }) => {
  return (
    <div className="border rounded-lg p-1 bg-card flex flex-wrap gap-1">
      {/* History Group */}
      <div className="flex items-center gap-1">
        <ToolbarButton icon={UndoIcon} label="Undo" />
        <ToolbarButton icon={RedoIcon} label="Redo" />
      </div>
      <Separator orientation="vertical" className="mx-1 h-8" />

      {/* Text Style Group */}
      <HeadingsGroup editor={editor} levels={[1, 2, 3, 4]} />

      <Separator orientation="vertical" className="mx-1 h-8" />

      {/* Basic Formatting Group */}
      <div className="flex items-center gap-1">
        <ToolbarButton icon={BoldIcon} label="Bold" />
        <ToolbarButton icon={ItalicIcon} label="Italic" />
        <ToolbarButton icon={UnderlineIcon} label="Underline" />
        <ToolbarButton icon={StrikethroughIcon} label="Strikethrough" />
      </div>

      <Separator orientation="vertical" className="mx-1 h-8" />

      {/* Alignment Group */}
      <div className="flex items-center gap-1">
        <ToolbarButton icon={AlignLeftIcon} label="Align Left" />
        <ToolbarButton icon={AlignCenterIcon} label="Align Center" />
        <ToolbarButton icon={AlignRightIcon} label="Align Right" />
        <ToolbarButton icon={AlignJustifyIcon} label="Justify" />
      </div>

      <Separator orientation="vertical" className="mx-1 h-8" />

      {/* Lists and Special Formats Group */}
      <div className="flex items-center gap-1">
        <ToolbarButton icon={ListIcon} label="Bullet List" />
        <ToolbarButton icon={ListOrderedIcon} label="Numbered List" />
        <ToolbarButton icon={QuoteIcon} label="Block Quote" />
        <ToolbarButton icon={CodeIcon} label="Code Block" />
        <ToolbarButton icon={LinkIcon} label="Insert Link" />
      </div>
    </div>
  );
};
