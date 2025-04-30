import * as React from 'react';
import { type Editor } from '@tiptap/react';
import { Button } from '@/components/ui/button';
import { ImagePlusIcon } from 'lucide-react';

export interface ImageUploadButtonProps {
  editor: Editor;
  text?: string;
  extensionName?: string;
  disabled?: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  children?: React.ReactNode;
}

export function isImageActive(editor: Editor, extensionName: string): boolean {
  if (!editor) return false;
  return editor.isActive(extensionName);
}

export function insertImage(editor: Editor, extensionName: string): boolean {
  if (!editor) return false;

  return editor
    .chain()
    .focus()
    .insertContent({
      type: extensionName,
    })
    .run();
}

export const ImageUploadButton: React.FC<ImageUploadButtonProps> = ({
  editor,
  extensionName = 'imageUpload',
  text,
  disabled = false,
  onClick,
  children,
}) => {
  const isActive = isImageActive(editor as Editor, extensionName);

  const handleInsertImage = React.useCallback(() => {
    if (disabled) return false;
    return insertImage(editor as Editor, extensionName);
  }, [editor, extensionName, disabled]);

  const handleClick = React.useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(e);

      if (!e.defaultPrevented && !disabled) {
        handleInsertImage();
      }
    },
    [onClick, disabled, handleInsertImage],
  );

  if (!editor || !editor.isEditable) {
    return null;
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      data-style="ghost"
      data-active-state={isActive ? 'on' : 'off'}
      role="button"
      tabIndex={-1}
      aria-label="Add image"
      aria-pressed={isActive}
      onClick={handleClick}
    >
      {children || (
        <>
          <ImagePlusIcon />
          {text && <span>{text}</span>}
        </>
      )}
    </Button>
  );
};

export default ImageUploadButton;
