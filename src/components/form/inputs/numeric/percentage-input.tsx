import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useFieldContext } from '../../../../contexts/form-context';
import { FieldError } from '../error';
import { LabelArea } from '../label';
import { FieldWrapper } from '../wrapper';

interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  id: string;
  description?: string;
}

const PercentageField = ({ label, id, description, ...props }: InputProps) => {
  const field = useFieldContext<string>();

  return (
    <FieldWrapper>
      {label && (
        <LabelArea label={label} htmlFor={id} required={props.required} />
      )}

      <div className="relative w-full">
        <Input
          id={id}
          type={'text'}
          defaultValue={field.state.value}
          onChange={(e) => field.setValue(e.target.value)}
          className={cn('w-full', props.className)}
          {...props}
        />
        <span className="absolute top-1 right-3 max-w-4 max-h-4 object-cover text-white font-semibold opacity-45">
          %
        </span>
      </div>

      {description && <span className="text-sm opacity-45">{description}</span>}
      <FieldError />
    </FieldWrapper>
  );
};

export default PercentageField;
