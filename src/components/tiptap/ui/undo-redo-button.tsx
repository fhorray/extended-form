import { Editor } from '@tiptap/react';
import { Redo2Icon, Undo2Icon } from 'lucide-react';
import { ToolbarButton } from './toolbar/toolbar-button';

interface UndoRedoToolbarButtonProps {
  editor: Editor;
  action: 'undo' | 'redo';
  className?: string;
}

export const UndoRedoToolbarButton = ({
  editor,
  action,
  className,
}: UndoRedoToolbarButtonProps) => {
  const Icon = action === 'redo' ? Redo2Icon : Undo2Icon;
  const label = action === 'redo' ? 'Redo' : 'Undo';

  const handleClick = () => {
    action === 'redo'
      ? editor.chain().focus().redo().run()
      : editor.chain().focus().undo().run();
  };

  return (
    <ToolbarButton
      icon={Icon}
      label={label}
      onClick={handleClick}
      tooltip={label}
      disabled={action === 'redo' ? !editor.can().redo() : !editor.can().undo()}
      className={className}
    />
  );
};
