import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Editor } from '@tiptap/react';
import { headingIcons } from '../constants';
import { Level } from '../types';
import { Heading, XIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

const headingLabels = {
  1: 'Heading 1',
  2: 'Heading 2',
  3: 'Heading 3',
  4: 'Heading 4',
  5: 'Heading 5',
  6: 'Heading 6',
};

export const HeadingsGroup = ({
  levels,
  editor,
}: {
  levels: Level[];
  editor: Editor;
}) => {
  const level = editor.getAttributes('heading').level as Level;
  const Selected = headingIcons[level] ?? Heading;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant={'ghost'} size={'icon'}>
          <Selected />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="flex flex-col gap-2 w-fit ml-20 p-2">
        {levels.map((item) => {
          const Icon = headingIcons[item];
          return (
            <Button
              size={'sm'}
              key={item}
              variant={'ghost'}
              className={cn(
                'flex items-center gap-2 hover:bg-muted p-1 rounded',
                item === level ? 'bg-red-600' : '',
              )}
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: item }).run()
              }
            >
              <Icon className="w-4 h-4" />
              <span>{headingLabels[item]}</span>
            </Button>
          );
        })}
      </PopoverContent>
    </Popover>
  );
};
