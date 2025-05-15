import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useFieldContext } from '../../../../contexts/form-context';
import { FieldError } from '../error';
import { LabelArea } from '../label';
import { FieldWrapper } from '../wrapper';

export type UnitType =
  | '%'
  | 'kg'
  | 'g'
  | 'cm'
  | 'mm'
  | 'm'
  | 'km'
  | 'mg'
  | 'ml'
  | 'l'
  | 'un';
export enum UnitEnum {
  Percentage = '%',
  Kilogram = 'kg',
  Gram = 'g',
  Centimeter = 'cm',
  Millimeter = 'mm',
  Meter = 'm',
  Kilometer = 'km',
  Milligram = 'mg',
  Milliliter = 'ml',
  Liter = 'l',
  Unit = 'un',
}

interface UnitFieldProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  id: string;
  description?: string;
  unit: UnitType;
}

const UnitField = ({
  label,
  id,
  description,
  unit,
  ...props
}: UnitFieldProps) => {
  const field = useFieldContext<string>();

  return (
    <FieldWrapper>
      {label && (
        <LabelArea label={label} htmlFor={id} required={props.required} />
      )}

      <div className="relative w-full">
        <Input
          id={id}
          type="text"
          defaultValue={field.state.value}
          onChange={(e) => field.setValue(e.target.value)}
          className={cn('w-full pr-10', props.className)}
          {...props}
        />
        <span className="absolute top-1 right-3 text-white font-semibold opacity-45">
          {unit}
        </span>
      </div>

      {description && <span className="text-sm opacity-45">{description}</span>}
      <FieldError />
    </FieldWrapper>
  );
};

export default UnitField;
