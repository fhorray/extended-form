'use client';

import { useFieldContext } from '@/contexts/form-context';
import { Input } from '@/components/ui/input';
import { FieldError } from '@/components/form/fields/error';
import { LabelArea } from '@/components/form/fields/label';
import { FieldWrapper } from '@/components/form/fields/wrapper';
import { useState } from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Copy, Check, Smile } from 'lucide-react';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';

interface EmojiPickerProps {
  label?: string;
  id: string;
  description?: string;
  required?: boolean;
}

const EmojiPickerField = ({
  label,
  id,
  description,
  required,
}: EmojiPickerProps) => {
  const field = useFieldContext<string>();
  const [copied, setCopied] = useState(false);

  const handleEmojiSelect = (emoji: any) => {
    field.setValue(emoji.native);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(field.state.value || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <FieldWrapper>
      {label && <LabelArea label={label} htmlFor={id} required={required} />}

      <div className="flex items-center gap-3 w-full">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="relative w-12 h-12 p-0 rounded-md transition-all duration-200 hover:scale-105 active:scale-95 text-xl"
            >
              {field.state.value || '😊'}
              <Smile
                className="absolute bottom-1 right-1 text-gray-400"
                size={12}
              />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-auto p-0 animate-in fade-in zoom-in-95"
            side="right"
            align="start"
          >
            <Picker
              data={data}
              onEmojiSelect={handleEmojiSelect}
              theme="light"
              previewPosition="none"
              skinTonePosition="none"
            />
          </PopoverContent>
        </Popover>

        <div className="flex-1 relative">
          <Input
            id={id}
            value={field.state.value || ''}
            onChange={(e) => field.setValue(e.target.value)}
            className="pr-10 text-lg h-12"
            placeholder="Choose an emoji..."
            readOnly
          />
          <button
            type="button"
            onClick={handleCopy}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-md hover:bg-gray-100 active:bg-gray-200 transition-colors"
          >
            {copied ? (
              <Check size={16} className="text-green-500" />
            ) : (
              <Copy size={16} className="text-gray-500" />
            )}
          </button>
        </div>
      </div>

      {description && (
        <span className="text-sm text-muted-foreground mt-1">
          {description}
        </span>
      )}
      <FieldError />
    </FieldWrapper>
  );
};

export default EmojiPickerField;
