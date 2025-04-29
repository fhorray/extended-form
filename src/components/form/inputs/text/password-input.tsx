import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { CheckIcon, EyeIcon, EyeOffIcon, XIcon } from 'lucide-react';
import { useState } from 'react';
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
  showRequirements?: boolean;
}

const passwordRequirements = [
  { label: '8+ characters', test: (v: string) => (v ?? '').length >= 8 },
  { label: 'Number', test: (v: string) => /\d/.test(v) },
  { label: 'Lowercase', test: (v: string) => /[a-z]/.test(v) },
  { label: 'Uppercase', test: (v: string) => /[A-Z]/.test(v) },
  {
    label: 'Special (!@#$)',
    test: (v: string) => /[!@#$%^&*(),.?":{}|<>]/.test(v),
  },
] as const;

const PasswordField = ({
  label,
  icon,
  id,
  description,
  showRequirements,
  ...props
}: InputProps) => {
  const field = useFieldContext<string>();
  const Icon = icon;

  const [showPassword, setShowPassword] = useState(false);

  const getStrength = (value: string): number => {
    if (!value) return 0;
    return (
      passwordRequirements.filter((req) => req.test(value ?? '')).length * 20
    );
  };

  const strength = getStrength(field.state.value ?? '');
  const strengthLabel =
    strength <= 40 ? 'Weak' : strength <= 80 ? 'Medium' : 'Strong';

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
          type={showPassword ? 'text' : 'password'}
          defaultValue={field.state.value}
          onChange={(e) => field.setValue(e.target.value)}
          className={cn('w-full', icon && 'pl-7 pb-1.5', props.className)}
          {...props}
        />

        {/* SHOW PASSWORD */}
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          aria-label={showPassword ? 'Hide password' : 'Show password'}
          className="hover:cursor-pointer absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-900  dark:text-zinc-500 dark:hover:text-zinc-100 transition-colors"
        >
          {showPassword ? (
            <EyeOffIcon className="w-4 h-4" />
          ) : (
            <EyeIcon className="w-4 h-4" />
          )}
        </button>
      </div>
      {description && <span className="text-sm opacity-45">{description}</span>}

      {/* SHOW REQUIREMENTS */}
      {showRequirements && (
        <>
          {field.state.value && (
            <div className="space-y-1">
              <div className="h-1 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full">
                <div
                  className="h-full bg-zinc-900 dark:bg-zinc-100 transition-all duration-300"
                  style={{ width: `${strength}%` }}
                />
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Strength: <span className="font-medium">{strengthLabel}</span>
              </p>
            </div>
          )}

          <div className="space-y-1.5 text-sm text-zinc-500 dark:text-zinc-400">
            {passwordRequirements.map(({ label, test }) => (
              <div key={label} className="flex items-center gap-2">
                {test(field.state.value) ? (
                  <CheckIcon className="w-3.5 h-3.5 text-zinc-900 dark:text-zinc-100" />
                ) : (
                  <XIcon className="w-3.5 h-3.5" />
                )}
                <span>{label}</span>
              </div>
            ))}
          </div>
        </>
      )}

      <FieldError />
    </FieldWrapper>
  );
};

export default PasswordField;
