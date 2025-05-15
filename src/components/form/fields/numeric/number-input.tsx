'use client';

import type React from 'react';

import { useFieldContext } from '@/contexts/form-context';
import { Input } from '@/components/ui/input';
import { FieldError } from '@/components/form/fields/error';
import { LabelArea } from '@/components/form/fields/label';
import { FieldWrapper } from '@/components/form/fields/wrapper';
import { Button } from '@/components/ui/button';
import { Plus, Minus } from 'lucide-react';

interface NumberInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  id: string;
  description?: string;
  showControls?: boolean;
}

const NumericField = ({
  label,
  id,
  description,
  showControls = true,
  ...props
}: NumberInputProps) => {
  const field = useFieldContext<number>();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value === '' ? undefined : Number(e.target.value);
    field.setValue(value as number);
  };

  const increment = () => {
    const currentValue = field.state.value || 0;
    const step = props.step ? Number(props.step) : 1;
    const max = props.max ? Number(props.max) : Number.POSITIVE_INFINITY;

    const newValue = Math.min(currentValue + step, max);
    field.setValue(newValue);
  };

  const decrement = () => {
    const currentValue = field.state.value || 0;
    const step = props.step ? Number(props.step) : 1;
    const min = props.min ? Number(props.min) : Number.NEGATIVE_INFINITY;

    const newValue = Math.max(currentValue - step, min);
    field.setValue(newValue);
  };

  return (
    <FieldWrapper>
      {label && (
        <LabelArea label={label} htmlFor={id} required={props.required} />
      )}
      <div className="flex">
        {showControls && (
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="rounded-r-none"
            onClick={decrement}
            disabled={
              props.disabled ||
              (props.min !== undefined &&
                (field.state.value || 0) <= Number(props.min))
            }
          >
            <Minus className="h-4 w-4" />
          </Button>
        )}
        <Input
          id={id}
          type="number"
          value={field.state.value === undefined ? '' : field.state.value}
          onChange={handleChange}
          className={showControls ? 'rounded-none text-center' : ''}
          {...props}
        />
        {showControls && (
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="rounded-l-none"
            onClick={increment}
            disabled={
              props.disabled ||
              (props.max !== undefined &&
                (field.state.value || 0) >= Number(props.max))
            }
          >
            <Plus className="h-4 w-4" />
          </Button>
        )}
      </div>
      {description && (
        <span className="text-sm text-muted-foreground">{description}</span>
      )}
      <FieldError />
    </FieldWrapper>
  );
};

export default NumericField;
