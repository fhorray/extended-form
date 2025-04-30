import { Editor } from '@tiptap/react';
import { ToolbarButton } from './toolbar/toolbar-button';
import { textFormatIcons } from '../constants';

interface TextFormatButtonProps {
  editor: Editor;
  action: 'bold' | 'italic' | 'underline' | 'strike' | 'code' | 'code-block';
  className?: string;
}

export const TextFormatButton = ({
  editor,
  action,
  className,
}: TextFormatButtonProps) => {
  const Icon = textFormatIcons[action];
  const label = `Format ${action}`;

  const handleClick = () => {
    const chain = editor.chain().focus();

    if (action === 'code-block') {
      const isActive = editor.isActive('customCodeBlock');
      if (isActive) {
        chain.setNode('paragraph').run();
      } else {
        chain.setNode('customCodeBlock').run();
      }
    } else {
      chain.toggleMark(action).run();
    }
  };

  const isActive =
    action === 'code-block'
      ? editor.isActive('customCodeBlock')
      : editor.isActive(action);

  const isDisabled =
    action === 'code-block'
      ? !editor.can().setNode('customCodeBlock') &&
        !editor.can().setNode('paragraph')
      : !editor.can().toggleMark(action);

  return (
    <ToolbarButton
      icon={Icon}
      label={label}
      onClick={handleClick}
      tooltip={label}
      isActive={isActive}
      disabled={isDisabled}
      className={className}
    />
  );
};
