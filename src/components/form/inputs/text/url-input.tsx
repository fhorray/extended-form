'use client';

import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useFieldContext } from '../../context';
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

export const validateUrl = (value: string) => {
  try {
    const url = new URL(value);
    return /^https?:\/\//.test(url.href);
  } catch {
    return false;
  }
};

const UrlField = ({ label, icon, id, description, ...props }: InputProps) => {
  const field = useFieldContext<string>();
  const Icon = icon;

  return (
    <FieldWrapper>
      {label && (
        <LabelArea label={label} htmlFor={id} required={props.required} />
      )}

      <div className="relative w-full">
        {Icon && (
          <span className="absolute top-2.5 left-2 max-w-4 max-h-4 object-cover">
            <Icon className="w-4 h-4 opacity-45" />
          </span>
        )}

        <Input
          id={id}
          type="url"
          defaultValue={field.state.value}
          onChange={(e) => field.setValue(e.target.value)}
          className={cn('w-full', icon && 'pl-7 pb-1.5', props.className)}
          {...props}
        />
      </div>

      {description && <span className="text-sm opacity-45">{description}</span>}

      <FieldError />
    </FieldWrapper>
  );
};

export default UrlField;
