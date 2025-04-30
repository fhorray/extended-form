import { Editor } from '@tiptap/react';
import { ToolbarButton } from './toolbar/toolbar-button';
import { textAlignIcons } from '../constants';

interface TextAlignButtonProps {
  editor: Editor;
  action: 'left' | 'center' | 'right' | 'justify' | 'unset';
  className?: string;
}

export const TextAlignButton = ({
  editor,
  action,
  className,
}: TextAlignButtonProps) => {
  const Icon = textAlignIcons[action];
  const label = `Align ${action}`;

  const handleClick = () => {
    action !== 'unset'
      ? editor.chain().focus().setTextAlign(action).run()
      : editor.chain().focus().unsetTextAlign().run();
  };

  return (
    <ToolbarButton
      icon={Icon}
      label={label}
      onClick={handleClick}
      tooltip={label}
      isActive={editor.isActive({ textAlign: action })}
      disabled={action !== 'unset' && !editor.can().setTextAlign(action)}
      className={className}
    />
  );
};
