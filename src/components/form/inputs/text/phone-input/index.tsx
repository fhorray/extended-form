import { useEffect, useState } from 'react';
import PhoneInput, {
  Country,
  getCountries,
} from 'react-phone-number-input/input';
import 'react-phone-number-input/style.css';
import { Phone } from 'lucide-react';
import { CountrySelect } from './country-select';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { useFieldContext } from '@/contexts/form-context';

interface FieldWrapperProps {
  children: React.ReactNode;
}

export const FieldWrapper = ({ children }: FieldWrapperProps) => {
  return <div className="flex flex-col gap-1.5 w-full">{children}</div>;
};

interface LabelAreaProps {
  label: string;
  htmlFor: string;
  required?: boolean;
}

export const LabelArea = ({ label, htmlFor, required }: LabelAreaProps) => {
  return (
    <label
      htmlFor={htmlFor}
      className="text-sm font-medium text-zinc-900 dark:text-zinc-100"
    >
      {label}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
  );
};

interface FieldErrorProps {
  error?: string;
}

export const FieldError = ({ error }: FieldErrorProps) => {
  if (!error) return null;
  return <p className="text-sm text-red-500">{error}</p>;
};

interface PhoneFieldProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  id: string;
  description?: string;
  country?: Country;
  error?: string;
}

const PhoneField = ({
  label,
  id,
  description,
  country = 'US',
  error,
  ...props
}: PhoneFieldProps) => {
  const field = useFieldContext<string>();
  const [selectedCountry, setSelectedCountry] = useState<Country>(country);

  return (
    <FieldWrapper>
      {label && (
        <LabelArea label={label} htmlFor={id} required={props.required} />
      )}

      <div className="relative w-full flex items-stretch">
        <CountrySelect
          value={selectedCountry}
          onChange={(countryCode) => setSelectedCountry(countryCode)}
          className="rounded-r-none"
        />

        <div className="relative flex-1">
          <PhoneInput
            inputComponent={Input}
            international
            country={selectedCountry}
            className={cn('w-full rounded-l-none', props.className)}
            {...props}
            value={field.state.value}
            onChange={(e) => field.setValue(e as string)}
          />
        </div>
      </div>

      {description && (
        <span className="text-sm text-zinc-500 dark:text-zinc-400">
          {description}
        </span>
      )}

      <FieldError error={error} />
    </FieldWrapper>
  );
};

export default PhoneField;
