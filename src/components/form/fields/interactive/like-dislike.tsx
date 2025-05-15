'use client';

import { useFieldContext } from '@/contexts/form-context';
import { FieldError } from '@/components/form/fields/error';
import { LabelArea } from '@/components/form/fields/label';
import { FieldWrapper } from '@/components/form/fields/wrapper';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ThumbsUp, ThumbsDown } from 'lucide-react';

interface LikeDislikeProps {
  label?: string;
  id: string;
  description?: string;
  required?: boolean;
}

const LikeDislikeField = ({
  label,
  id,
  description,
  required,
}: LikeDislikeProps) => {
  const field = useFieldContext<'like' | 'dislike' | null>();
  const [value, setValue] = useState<'like' | 'dislike' | null>(
    field.state.value || null,
  );

  useEffect(() => {
    if (field.state.value) {
      setValue(field.state.value);
    }
  }, [field.state.value]);

  const handleSelect = (selected: 'like' | 'dislike') => {
    const newValue = value === selected ? null : selected;
    setValue(newValue);
    field.setValue(newValue);
  };

  return (
    <FieldWrapper>
      {label && <LabelArea label={label} htmlFor={id} required={required} />}

      <div className="flex items-center gap-4">
        <Button
          type="button"
          variant={value === 'like' ? 'default' : 'outline'}
          className={`flex-1 ${value === 'like' ? 'bg-green-600 hover:bg-green-700' : ''}`}
          onClick={() => handleSelect('like')}
        >
          <ThumbsUp className="w-5 h-5 mr-2" />
          Gostei
        </Button>

        <Button
          type="button"
          variant={value === 'dislike' ? 'default' : 'outline'}
          className={`flex-1 ${value === 'dislike' ? 'bg-red-600 hover:bg-red-700' : ''}`}
          onClick={() => handleSelect('dislike')}
        >
          <ThumbsDown className="w-5 h-5 mr-2" />
          Não Gostei
        </Button>
      </div>

      {description && (
        <span className="text-sm text-muted-foreground">{description}</span>
      )}
      <FieldError />
    </FieldWrapper>
  );
};

export default LikeDislikeField;
