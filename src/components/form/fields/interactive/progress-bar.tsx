'use client';

import type React from 'react';

import { useFieldContext } from '@/contexts/form-context';
import { FieldError } from '@/components/form/fields/error';
import { LabelArea } from '@/components/form/fields/label';
import { FieldWrapper } from '@/components/form/fields/wrapper';
import { useState, useEffect } from 'react';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';

interface ProgressBarProps {
  label?: string;
  id: string;
  description?: string;
  required?: boolean;
  min?: number;
  max?: number;
  step?: number;
}

const ProgressBarField = ({
  label,
  id,
  description,
  required,
  min = 0,
  max = 100,
  step = 1,
}: ProgressBarProps) => {
  const field = useFieldContext<number>();
  const [value, setValue] = useState<number>(field.state.value || min);

  useEffect(() => {
    if (field.state.value !== undefined) {
      setValue(field.state.value);
    }
  }, [field.state.value]);

  const handleSliderChange = (newValue: number[]) => {
    const updatedValue = newValue[0];
    setValue(updatedValue);
    field.setValue(updatedValue);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = Number.parseInt(e.target.value);
    if (!isNaN(inputValue) && inputValue >= min && inputValue <= max) {
      setValue(inputValue);
      field.setValue(inputValue);
    }
  };

  return (
    <FieldWrapper>
      {label && <LabelArea label={label} htmlFor={id} required={required} />}

      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <Progress value={(value / max) * 100} className="flex-1 h-4" />
          <Input
            type="number"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={handleInputChange}
            className="w-20"
          />
        </div>

        <Slider
          id={id}
          value={[value]}
          min={min}
          max={max}
          step={step}
          onValueChange={handleSliderChange}
        />
      </div>

      {description && (
        <span className="text-sm text-muted-foreground">{description}</span>
      )}
      <FieldError />
    </FieldWrapper>
  );
};

export default ProgressBarField;
