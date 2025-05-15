import { useEffect, useState } from 'react';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { FieldWrapper } from '../wrapper';
import { LabelArea } from '../label';
import { FieldError } from '../error';
import { useFieldContext } from '../../../../contexts/form-context';

export interface NumericSliderInputProps {
  id: string;
  label?: string;
  description?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  defaultValue?: number;
  onChange?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  showInput?: boolean;
  showMarks?: boolean;
  marks?: { value: number; label: string }[];
}

const NumericSliderInput = ({
  id,
  label,
  description,
  disabled = false,
  required = false,
  className,
  defaultValue = 50,
  min = 0,
  max = 100,
  step = 1,
  showInput = true,
  showMarks = false,
  marks = [],
}: NumericSliderInputProps) => {
  const field = useFieldContext<number>();
  const [localValue, setLocalValue] = useState<number>(defaultValue);

  useEffect(() => {
    if (field.state.value != null) {
      setLocalValue(field.state.value);
    }
  }, [field.state.value]);

  const handleSliderChange = (values: number[]) => {
    const value = values[0];
    setLocalValue(value);
    field.setValue(value);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value)) {
      const clampedValue = Math.min(Math.max(value, min), max);
      setLocalValue(clampedValue);
      field.setValue(clampedValue);
    }
  };

  const defaultMarks = [
    { value: min, label: min.toString() },
    { value: (min + max) / 2, label: ((min + max) / 2).toString() },
    { value: max, label: max.toString() },
  ];

  const sliderMarks = showMarks
    ? marks.length > 0
      ? marks
      : defaultMarks
    : [];

  return (
    <FieldWrapper>
      {label && <LabelArea label={label} htmlFor={id} required={required} />}

      <div className={cn('w-full space-y-4', className)}>
        <div className="flex items-center gap-4">
          <Slider
            id={id}
            disabled={disabled}
            min={min}
            max={max}
            step={step}
            value={[localValue]}
            onValueChange={handleSliderChange}
            className="flex-1"
          />
          {showInput && (
            <Input
              id={`${id}-input`}
              type="number"
              min={min}
              max={max}
              step={step}
              value={localValue}
              onChange={handleInputChange}
              disabled={disabled}
              className="w-20"
            />
          )}
        </div>

        {showMarks && (
          <div className="relative h-6">
            {sliderMarks.map((mark) => (
              <div
                key={mark.value}
                className="absolute text-xs text-muted-foreground"
                style={{
                  left: `${((mark.value - min) / (max - min)) * 100}%`,
                  transform: 'translateX(-50%)',
                }}
              >
                {mark.label}
              </div>
            ))}
          </div>
        )}
      </div>

      {description && <span className="text-sm opacity-45">{description}</span>}
      <FieldError />
    </FieldWrapper>
  );
};

export default NumericSliderInput;
