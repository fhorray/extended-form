'use client';

import type React from 'react';

import { useFieldContext } from '@/contexts/form-context';
import { FieldError } from '@/components/form/fields/error';
import { LabelArea } from '@/components/form/fields/label';
import { FieldWrapper } from '@/components/form/fields/wrapper';
import { useState, useEffect } from 'react';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';

interface SliderInputProps {
  label?: string;
  id: string;
  description?: string;
  required?: boolean;
  min?: number;
  max?: number;
  step?: number;
  showInput?: boolean;
  marks?: Array<{ value: number; label: string }>;
}

const SliderInputField = ({
  label,
  id,
  description,
  required,
  min = 0,
  max = 100,
  step = 1,
  showInput = true,
  marks,
}: SliderInputProps) => {
  const field = useFieldContext<number>();
  const [value, setValue] = useState<number>(
    field.state.value !== undefined ? field.state.value : min,
  );

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
    const inputValue = Number.parseFloat(e.target.value);
    if (!isNaN(inputValue) && inputValue >= min && inputValue <= max) {
      setValue(inputValue);
      field.setValue(inputValue);
    }
  };

  return (
    <FieldWrapper>
      {label && <LabelArea label={label} htmlFor={id} required={required} />}

      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <Slider
              id={id}
              value={[value]}
              min={min}
              max={max}
              step={step}
              onValueChange={handleSliderChange}
            />
          </div>

          {showInput && (
            <Input
              type="number"
              min={min}
              max={max}
              step={step}
              value={value}
              onChange={handleInputChange}
              className="w-20"
            />
          )}
        </div>

        {marks && (
          <div className="flex justify-between px-2">
            {marks.map((mark) => (
              <div key={mark.value} className="text-center">
                <div
                  className={`h-1 w-1 rounded-full mx-auto mb-1 ${
                    value >= mark.value ? 'bg-primary' : 'bg-muted-foreground'
                  }`}
                />
                <span className="text-xs">{mark.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {description && (
        <span className="text-sm text-muted-foreground">{description}</span>
      )}
      <FieldError />
    </FieldWrapper>
  );
};

export default SliderInputField;
