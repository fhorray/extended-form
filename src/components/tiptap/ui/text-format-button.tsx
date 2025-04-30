import { Editor } from '@tiptap/react';
import { ToolbarButton } from './toolbar/toolbar-button';
import { textFormatIcons } from '../constants';

interface TextFormatButtonProps {
  editor: Editor;
  action:
    | 'bold'
    | 'italic'
    | 'underline'
    | 'strike'
    | 'code'
    | 'codeBlock'
    | 'quote';
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

    if (action === 'codeBlock') {
      chain.toggleCodeBlock().run();
    } else if (action === 'quote') {
      chain.toggleBlockquote().run();
    } else {
      chain.toggleMark(action).run();
    }
  };

  const isActive =
    action === 'codeBlock'
      ? editor.isActive('codeBlock')
      : action === 'quote'
        ? editor.isActive('blockquote')
        : editor.isActive(action);

  const isDisabled =
    action === 'codeBlock'
      ? !editor.can().toggleCodeBlock()
      : action === 'quote'
        ? !editor.can().toggleBlockquote()
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
