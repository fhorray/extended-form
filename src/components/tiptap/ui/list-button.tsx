import { Editor } from '@tiptap/react';
import { ListOrderedIcon, ListIcon, CheckSquareIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover';

interface ListButtonProps {
  editor: Editor;
}

export const ListButton = ({ editor }: ListButtonProps) => {
  const isBulletListActive = editor.isActive('bulletList');
  const isOrderedListActive = editor.isActive('orderedList');
  const isTaskListActive = editor.isActive('taskList');

  const toggleBulletList = () => {
    editor.chain().focus().toggleBulletList().run();
  };

  const toggleOrderedList = () => {
    editor.chain().focus().toggleOrderedList().run();
  };

  const toggleTaskList = () => {
    editor.chain().focus().toggleTaskList().run();
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            'h-8 w-8 rounded-md  transition-all duration-200',
            'hover:bg-primary/10',
            (isBulletListActive || isOrderedListActive || isTaskListActive) &&
              'bg-primary/10 text-primary',
          )}
        >
          <ListIcon className="w-4 h-4" />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className={cn(
          'w-fit p-2 backdrop-blur-lg opacity-95',
          'border border-white/20',
          'bg-white/95 shadow-lg rounded-md space-y-1',
        )}
        sideOffset={9}
      >
        <Button
          variant={'ghost'}
          size="sm"
          className={cn(
            'w-full justify-start',
            isBulletListActive ? 'bg-black/20' : '',
          )}
          onClick={toggleBulletList}
        >
          <ListIcon className="w-4 h-4 mr-2" />
          Bullet List
        </Button>

        <Button
          variant={isOrderedListActive ? 'default' : 'ghost'}
          size="sm"
          className="w-full justify-start"
          onClick={toggleOrderedList}
        >
          <ListOrderedIcon className="w-4 h-4 mr-2" />
          Ordered List
        </Button>

        <Button
          variant={isTaskListActive ? 'default' : 'ghost'}
          size="sm"
          className="w-full justify-start"
          onClick={toggleTaskList}
        >
          <CheckSquareIcon className="w-4 h-4 mr-2" />
          Task List
        </Button>
      </PopoverContent>
    </Popover>
  );
};
