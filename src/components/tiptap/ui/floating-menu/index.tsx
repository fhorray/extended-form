import { Editor, FloatingMenu } from '@tiptap/react';

export const FloatingMenuComponent = ({ editor }: { editor: Editor }) => {
  return <FloatingMenu editor={editor}>Floating Menu</FloatingMenu>;
};
