'use client';

import { useFieldContext } from '@/contexts/form-context';
import { FieldError } from '@/components/form/fields/error';
import { LabelArea } from '@/components/form/fields/label';
import { FieldWrapper } from '@/components/form/fields/wrapper';
import { useState, useEffect } from 'react';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';

interface NumericSliderInputProps {
  label?: string;
  id: string;
  description?: string;
  required?: boolean;
  min?: number;
  max?: number;
  step?: number;
  minLabel?: string;
  maxLabel?: string;
  showValue?: boolean;
  marks?: Array<{ value: number; label: string }>;
}

const NumericSliderField = ({
  label,
  id,
  description,
  required,
  min = 0,
  max = 100,
  step = 1,
  minLabel,
  maxLabel,
  showValue = true,
  marks,
}: NumericSliderInputProps) => {
  const field = useFieldContext<number>();
  const [value, setValue] = useState<number>(
    field.state.value !== undefined ? field.state.value : min,
  );

  useEffect(() => {
    if (field.state.value !== undefined) {
      setValue(field.state.value);
    }
  }, [field.state.value]);

  const handleChange = (newValue: number[]) => {
    setValue(newValue[0]);
    field.setValue(newValue[0]);
  };

  return (
    <FieldWrapper>
      {label && <LabelArea label={label} htmlFor={id} required={required} />}

      <div className="space-y-6">
        <div className="pt-4">
          <Slider
            id={id}
            value={[value]}
            min={min}
            max={max}
            step={step}
            onValueChange={handleChange}
          />
        </div>

        <div className="flex justify-between items-center">
          <Label className="text-sm text-muted-foreground">
            {minLabel || min}
          </Label>
          {showValue && (
            <span className="px-2 py-1 rounded-md bg-muted text-sm font-medium">
              {value}
            </span>
          )}
          <Label className="text-sm text-muted-foreground">
            {maxLabel || max}
          </Label>
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

export default NumericSliderField;
