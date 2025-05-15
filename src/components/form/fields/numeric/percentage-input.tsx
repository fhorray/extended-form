'use client';

import type React from 'react';

import { useFieldContext } from '@/contexts/form-context';
import { Input } from '@/components/ui/input';
import { FieldError } from '@/components/form/fields/error';
import { LabelArea } from '@/components/form/fields/label';
import { FieldWrapper } from '@/components/form/fields/wrapper';
import { Percent } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { useState, useEffect } from 'react';

interface PercentageInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  id: string;
  description?: string;
  showSlider?: boolean;
  min?: number;
  max?: number;
  step?: number;
}

const PercentageField = ({
  label,
  id,
  description,
  showSlider = true,
  min = 0,
  max = 100,
  step = 1,
  ...props
}: PercentageInputProps) => {
  const field = useFieldContext<number>();
  const [value, setValue] = useState<number>(
    field.state.value !== undefined ? field.state.value : min,
  );

  useEffect(() => {
    if (field.state.value !== undefined) {
      setValue(field.state.value);
    }
  }, [field.state.value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value === '' ? min : Number(e.target.value);
    const clampedValue = Math.min(Math.max(inputValue, min), max);
    setValue(clampedValue);
    field.setValue(clampedValue);
  };

  const handleSliderChange = (newValue: number[]) => {
    setValue(newValue[0]);
    field.setValue(newValue[0]);
  };

  return (
    <FieldWrapper>
      {label && (
        <LabelArea label={label} htmlFor={id} required={props.required} />
      )}
      <div className="space-y-4">
        <div className="relative">
          <Input
            id={id}
            type="number"
            value={value}
            onChange={handleInputChange}
            className="pr-10"
            min={min}
            max={max}
            step={step}
            {...props}
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <Percent className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>

        {showSlider && (
          <Slider
            value={[value]}
            min={min}
            max={max}
            step={step}
            onValueChange={handleSliderChange}
          />
        )}
      </div>
      {description && (
        <span className="text-sm text-muted-foreground">{description}</span>
      )}
      <FieldError />
    </FieldWrapper>
  );
};

export default PercentageField;
