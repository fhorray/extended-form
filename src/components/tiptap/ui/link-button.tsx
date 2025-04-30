import { useState, useEffect, KeyboardEvent } from 'react';
import { Editor } from '@tiptap/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  CheckIcon,
  LinkIcon,
  ExternalLinkIcon,
  Trash2Icon,
  AlertCircleIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface LinkButtonProps {
  editor: Editor;
}

export const LinkButton = ({ editor }: LinkButtonProps) => {
  const [link, setLink] = useState('');
  const [open, setOpen] = useState(false);
  const [isValidUrl, setIsValidUrl] = useState(true);
  const isActive = editor.isActive('link');

  useEffect(() => {
    if (open) {
      const previousUrl = editor.getAttributes('link').href || '';
      setLink(previousUrl);
      setIsValidUrl(true);
    }
  }, [open, editor]);

  const validateUrl = (url: string): boolean => {
    if (!url) return false;
    const urlWithProtocol = url.match(/^https?:\/\//) ? url : `https://${url}`;
    try {
      new URL(urlWithProtocol);
      return true;
    } catch {
      return false;
    }
  };

  const handleUrlChange = (value: string) => {
    setLink(value);
    setIsValidUrl(value ? validateUrl(value) : true);
  };

  const handleSubmit = () => {
    if (!link) return;

    const urlWithProtocol = link.match(/^https?:\/\//)
      ? link
      : `https://${link}`;

    if (!validateUrl(urlWithProtocol)) {
      setIsValidUrl(false);
      return;
    }

    editor
      .chain()
      .focus()
      .extendMarkRange('link')
      .setLink({ href: urlWithProtocol })
      .run();

    toast.success('Link added', {
      description: `Added link to ${urlWithProtocol}`,
      duration: 2000,
    });

    setOpen(false);
  };

  const handleRemoveLink = () => {
    editor.chain().focus().extendMarkRange('link').unsetLink().run();

    toast.success('Link removed', {
      description: 'The link has been removed',
      duration: 2000,
    });

    setOpen(false);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            'h-8 w-8 rounded-md transition-all duration-200',
            'hover:bg-primary/10',
            isActive && 'bg-primary/10 text-primary',
          )}
        >
          <LinkIcon className="w-4 h-4" />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className={cn(
          'w-fit p-0 backdrop-blur-lg opacity-95',
          'border border-white/20',
          'bg-white/95 shadow-lg',
        )}
        sideOffset={9}
      >
        <div className="relative p-2 space-y-2">
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-primary/2 pointer-events-none rounded-lg" />

          <div className="flex items-center gap-2 relative">
            {/* INPUT */}
            <div className="relative">
              <Input
                type="url"
                value={link}
                placeholder="https://example.com"
                onChange={(e) => handleUrlChange(e.target.value)}
                onKeyDown={handleKeyDown}
                className={cn(
                  'pr-9 h-8 bg-transparent !focus:border-none',
                  'border-1 focus-visible:ring-0',
                  !isValidUrl &&
                    'border-destructive focus-visible:ring-destructive/20',
                  'transition-all duration-200',
                )}
                autoFocus
              />
              {link && isValidUrl && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-7 h-7 rounded-sm absolute right-0.5 top-0.5 hover:text-primary transition-colors duration-200"
                  onClick={() =>
                    window.open(
                      link.match(/^https?:\/\//) ? link : `https://${link}`,
                      '_blank',
                    )
                  }
                >
                  <ExternalLinkIcon className="w-4 h-4" />
                </Button>
              )}
            </div>

            {/* BUTTONS */}
            <div className="flex items-center gap-2">
              {/* REMOVE */}
              {isActive && (
                <Button
                  variant="outline"
                  size="icon"
                  className={cn(
                    'h-7 w-7 rounded-sm',
                    'hover:bg-destructive/10 hover:text-destructive hover:border-red-200',
                    'transition-colors duration-200',
                  )}
                  onClick={handleRemoveLink}
                >
                  <Trash2Icon className="w-3.5 h-3.5" />
                </Button>
              )}

              {/* APPLY */}
              <Button
                size="icon"
                onClick={handleSubmit}
                disabled={!link.trim() || !isValidUrl}
                className="w-7 h-7 rounded-sm"
              >
                <CheckIcon />
              </Button>
            </div>
          </div>

          {!isValidUrl && link && (
            <div className="flex items-center gap-1.5 text-xs text-destructive">
              <AlertCircleIcon className="w-3.5 h-3.5" />
              <span>Please enter a valid URL</span>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};
