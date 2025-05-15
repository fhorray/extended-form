'use client';

import type React from 'react';

import { useFieldContext } from '@/contexts/form-context';
import { Textarea } from '@/components/ui/textarea';
import { FieldError } from '@/components/form/fields/error';
import { LabelArea } from '@/components/form/fields/label';
import { FieldWrapper } from '@/components/form/fields/wrapper';

interface TextAreaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  id: string;
  description?: string;
}

const TextAreaField = ({ label, id, description, ...props }: TextAreaProps) => {
  const field = useFieldContext<string>();

  return (
    <FieldWrapper>
      {label && (
        <LabelArea label={label} htmlFor={id} required={props.required} />
      )}
      <Textarea
        id={id}
        value={field.state.value || ''}
        onChange={(e) => field.setValue(e.target.value)}
        {...props}
      />
      {description && (
        <span className="text-sm text-muted-foreground">{description}</span>
      )}
      <FieldError />
    </FieldWrapper>
  );
};

export default TextAreaField;
