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
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  description?: string;
}

export const validateEmail = (email: string) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

const EmailField = ({ label, icon, id, description, ...props }: InputProps) => {
  const field = useFieldContext<string>();

  const Icon = icon;

  return (
    <FieldWrapper>
      {label && (
        <LabelArea label={label} htmlFor={id} required={props.required} />
      )}

      <div className="relative w-full">
        {
          <span className="absolute top-2.5 left-2 max-w-4 max-h-4 object-cover">
            {Icon && <Icon className="w-4 h-4 opacity-45" />}
          </span>
        }

        <Input
          id={id}
          type={'email'}
          defaultValue={field.state.value}
          onChange={(e) => field.setValue(e.target.value)}
          className={cn(icon && 'pl-7 pb-1.5', props.className)}
          {...props}
        />
      </div>
      {description && <span className="text-sm opacity-45">{description}</span>}
      <FieldError />
    </FieldWrapper>
  );
};

export default EmailField;
