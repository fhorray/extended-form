import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useFieldContext } from '../../../../contexts/form-context';
import { FieldError } from '../error';
import { LabelArea } from '../label';
import { FieldWrapper } from '../wrapper';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  id: string;
  description?: string;
}

const NumberField = ({
  label,
  id,
  description,
  min = 0,
  max = 100,
  step = 1,
  ...props
}: InputProps) => {
  const field = useFieldContext<number>();

  const [value, setValue] = useState(0);
  const [isFocused, setIsFocused] = useState(false);

  console.log(field.state.value);

  const percentage =
    ((value - Number(min)) / (Number(max) - Number(min))) * 100;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number.parseFloat(e.target.value);
    if (
      !Number.isNaN(newValue) &&
      newValue >= Number(min) &&
      newValue <= Number(max)
    ) {
      setValue(newValue);
      field.setValue(newValue); // <-- usar o novo valor
    }
  };

  const incrementValue = () => {
    const newValue = Math.min(value + Number(step), Number(max));
    setValue(newValue);
  };

  const decrementValue = () => {
    const newValue = Math.max(value - Number(step), Number(min));
    setValue(newValue);
  };

  return (
    <FieldWrapper>
      {label && (
        <LabelArea label={label} htmlFor={id} required={props.required} />
      )}

      <div className="w-full">
        <div className="w-full relative">
          <div
            className={cn(
              'w-full flex items-center rounded-lg border',
              'border-zinc-200 dark:border-zinc-800',
              'bg-white dark:bg-black/5',
              isFocused && 'ring-2 ring-zinc-300 dark:ring-zinc-700',
            )}
          >
            <Button
              type="button"
              onClick={decrementValue}
              className="rounded-r-none"
              aria-label="Decrement button"
            >
              -
            </Button>

            <Input
              id={id}
              type={'number'}
              value={value}
              onChange={handleChange}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              min={min}
              max={max}
              step={step}
              style={{
                appearance: 'textfield',
                MozAppearance: 'textfield',
                WebkitAppearance: 'none',
              }}
              className={cn(
                'w-full rounded-none px-2 focus-visible:outline-none',
                props.className,
              )}
              {...props}
            />

            <Button
              type="button"
              onClick={incrementValue}
              className="rounded-l-none"
              aria-label="Increment button"
            >
              +
            </Button>
          </div>

          <div className="mt-2 h-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
            <div
              className="h-full bg-zinc-300 dark:bg-zinc-600 transition-all duration-200"
              style={{ width: `${percentage}%` }}
            />
          </div>

          <div className="mt-1 flex justify-between text-xs text-zinc-400 dark:text-zinc-500">
            <span>{min}</span>
            <span>{max}</span>
          </div>
        </div>
      </div>

      {description && <span className="text-sm opacity-45">{description}</span>}
      <FieldError />
    </FieldWrapper>
  );
};

export default NumberField;
