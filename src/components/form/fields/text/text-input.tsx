'use client';

import type React from 'react';

import { useFieldContext } from '@/contexts/form-context';
import { Input } from '@/components/ui/input';
import { FieldError } from '@/components/form/fields/error';
import { LabelArea } from '@/components/form/fields/label';
import { FieldWrapper } from '@/components/form/fields/wrapper';

interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  id: string;
  description?: string;
}

const InputField = ({ label, id, description, ...props }: TextInputProps) => {
  const field = useFieldContext<string>();

  return (
    <FieldWrapper>
      {label && (
        <LabelArea label={label} htmlFor={id} required={props.required} />
      )}
      <Input
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

export default InputField;
