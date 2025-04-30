import {
  Content,
  EditorContent,
  EditorContext,
  useEditor,
} from '@tiptap/react';
import * as React from 'react';

// --- Tiptap Core Extensions ---
import { Highlight } from '@tiptap/extension-highlight';
import { Image } from '@tiptap/extension-image';
import { Subscript } from '@tiptap/extension-subscript';
import { Superscript } from '@tiptap/extension-superscript';
import { TaskItem } from '@tiptap/extension-task-item';
import { TaskList } from '@tiptap/extension-task-list';
import { TextAlign } from '@tiptap/extension-text-align';
import { Typography } from '@tiptap/extension-typography';
import { Underline } from '@tiptap/extension-underline';
import { StarterKit } from '@tiptap/starter-kit';

import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import Link from '@tiptap/extension-link';
import { ArrowLeftIcon, HighlighterIcon, LinkIcon } from 'lucide-react';
import Selection from './extensions/selection-extension';
import TrailingNode from './extensions/trailing-node-extension';
import { useWindowSize } from './hooks/use-window-size';
import ImageUploadNode from './nodes/image-upload-node/image-upload-node-extension';
import { handleImageUpload, MAX_FILE_SIZE } from './tiptap-utils';
import HeadingDropdownMenu from './ui/heading-drop-down-menu';
import HighlightPopover, {
  HighlightContent,
  HighlighterButton,
} from './ui/highlight-popover';
import ImageUploadButton from './ui/image-upload-button';
import { LinkButton, LinkContent, LinkPopover } from './ui/link-popover';
import ListDropdownMenu from './ui/list-dropdown-menu';
import MarkButton from './ui/mark-button';
import NodeButton from './ui/node-button';
import TextAlignButton from './ui/text-align-button';
import { Toolbar, ToolbarGroup, ToolbarSeparator } from './ui/toolbar';
import UndoRedoButton from './ui/undo-redo-button';

import './styles/index.css';
import './styles/variables.css';
import './styles/paragraph.css';
import './styles/image-node.css';
import './styles/list.css';

const MainToolbarContent = ({
  onHighlighterClick,
  onLinkClick,
  isMobile,
}: {
  onHighlighterClick: () => void;
  onLinkClick: () => void;
  isMobile: boolean;
}) => {
  return (
    <>
      <ToolbarGroup>
        <UndoRedoButton action="undo" />
        <UndoRedoButton action="redo" />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <HeadingDropdownMenu levels={[1, 2, 3, 4, 5]} />
        <ListDropdownMenu types={['bulletList', 'orderedList', 'taskList']} />
        <NodeButton type="codeBlock" />
        <NodeButton type="blockquote" />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <MarkButton type="bold" />
        <MarkButton type="italic" />
        <MarkButton type="strike" />
        <MarkButton type="code" />
        <MarkButton type="underline" />
        {!isMobile ? (
          <HighlightPopover />
        ) : (
          <HighlighterButton onClick={onHighlighterClick} />
        )}
        {!isMobile ? <LinkPopover /> : <LinkButton onClick={onLinkClick} />}
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <MarkButton type="superscript" />
        <MarkButton type="subscript" />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <TextAlignButton align="left" />
        <TextAlignButton align="center" />
        <TextAlignButton align="right" />
        <TextAlignButton align="justify" />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <ImageUploadButton text="Add" />
      </ToolbarGroup>

      {/* <Spacer /> */}

      {isMobile && <ToolbarSeparator />}

      {/* <ToolbarGroup>
        <ThemeToggle />
      </ToolbarGroup> */}
    </>
  );
};

const MobileToolbarContent = ({
  type,
  onBack,
}: {
  type: 'highlighter' | 'link';
  onBack: () => void;
}) => (
  <>
    <ToolbarGroup>
      <Button data-style="ghost" onClick={onBack}>
        <ArrowLeftIcon />
        {type === 'highlighter' ? <HighlighterIcon /> : <LinkIcon />}
      </Button>
    </ToolbarGroup>

    <ToolbarSeparator />

    {type === 'highlighter' ? <HighlightContent /> : <LinkContent />}
  </>
);

export function TipTap({
  content,
  onChange,
}: {
  content?: Content;
  onChange?: (content: string) => void;
}) {
  const isMobile = useIsMobile();
  const windowSize = useWindowSize();
  const [mobileView, setMobileView] = React.useState<
    'main' | 'highlighter' | 'link'
  >('main');
  const [rect, setRect] = React.useState<
    Pick<DOMRect, 'x' | 'y' | 'width' | 'height'>
  >({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });
  const toolbarRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const updateRect = () => {
      setRect(document.body.getBoundingClientRect());
    };

    updateRect();

    const resizeObserver = new ResizeObserver(updateRect);
    resizeObserver.observe(document.body);

    window.addEventListener('scroll', updateRect);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('scroll', updateRect);
    };
  }, []);

  const editor = useEditor({
    immediatelyRender: false,
    editorProps: {
      attributes: {
        autocomplete: 'off',
        autocorrect: 'off',
        autocapitalize: 'off',
        'aria-label': 'Main content area, start typing to enter text.',
        class:
          'prose prose-sm sm:prose-base lg:prose-lg xl:prose-2xl m-5 focus:outline-none',
      },
    },
    extensions: [
      // StarterKit,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Underline,
      TaskList,
      TaskItem.configure({ nested: true }),
      Highlight.configure({ multicolor: true }),
      Image,
      Typography,
      Superscript,
      Subscript,

      Selection,
      ImageUploadNode.configure({
        accept: 'image/*',
        maxSize: MAX_FILE_SIZE,
        limit: 3,
        upload: handleImageUpload,
        onError: (error) => console.error('Upload failed:', error),
      }),
      TrailingNode,
      Link.configure({ openOnClick: false }),
    ],
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
    onCreate: ({ editor }) => {
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

  console.log(editor?.getHTML());

  React.useEffect(() => {
    const checkCursorVisibility = () => {
      if (!editor || !toolbarRef.current) return;

      const { state, view } = editor;
      if (!view.hasFocus()) return;

      const { from } = state.selection;
      const cursorCoords = view.coordsAtPos(from);

      if (windowSize.height < rect.height) {
        if (cursorCoords && toolbarRef.current) {
          const toolbarHeight =
            toolbarRef.current.getBoundingClientRect().height;
          const isEnoughSpace =
            windowSize.height - cursorCoords.top - toolbarHeight > 0;

          // If not enough space, scroll until the cursor is the middle of the screen
          if (!isEnoughSpace) {
            const scrollY =
              cursorCoords.top - windowSize.height / 2 + toolbarHeight;
            window.scrollTo({
              top: scrollY,
              behavior: 'smooth',
            });
          }
        }
      }
    };

    checkCursorVisibility();
  }, [editor, rect.height, windowSize.height]);

  React.useEffect(() => {
    if (!isMobile && mobileView !== 'main') {
      setMobileView('main');
    }
  }, [isMobile, mobileView]);

  return (
    <EditorContext.Provider value={{ editor }}>
      <Toolbar
        className=""
        ref={toolbarRef}
        style={
          isMobile
            ? {
                bottom: `calc(100% - ${windowSize.height - rect.y}px)`,
              }
            : {}
        }
      >
        {mobileView === 'main' ? (
          <MainToolbarContent
            onHighlighterClick={() => setMobileView('highlighter')}
            onLinkClick={() => setMobileView('link')}
            isMobile={isMobile}
          />
        ) : (
          <MobileToolbarContent
            type={mobileView === 'highlighter' ? 'highlighter' : 'link'}
            onBack={() => setMobileView('main')}
          />
        )}
      </Toolbar>

      <div className="w-full">
        <EditorContent
          editor={editor}
          role="presentation"
          className="w-full border border-white/10 rounded-md"
        />
      </div>
    </EditorContext.Provider>
  );
}
