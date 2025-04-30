import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Editor } from '@tiptap/react';
import { ChevronDown, ChevronUp, Heading } from 'lucide-react';
import { headingIcons } from '../constants';
import { Level } from '../types';
import { useState } from 'react';

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
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={'ghost'}
          size={'sm'}
          className={cn(
            'p-0 rounded-md h-8 hover:bg-gray-300/30 hover:text-accent-foreground dark:hover:bg-accent/50',
            'transition-all duration-200 ',
          )}
        >
          <Selected />
          {open ? <ChevronUp /> : <ChevronDown />}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="flex flex-col gap-2 w-fit ml-20 p-2 backdrop-blur-xl bg-white/50 border-black/10">
        {levels.map((item) => {
          const Icon = headingIcons[item];
          return (
            <Button
              size={'sm'}
              key={item}
              variant={'ghost'}
              className={cn(
                'flex items-center gap-2 hover:bg-muted p-1 rounded',
                item === level ? 'bg-black/15' : '',
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
