'use client';

import type React from 'react';

import { useFieldContext } from '@/contexts/form-context';
import { Input } from '@/components/ui/input';
import { FieldError } from '@/components/form/fields/error';
import { LabelArea } from '@/components/form/fields/label';
import { FieldWrapper } from '@/components/form/fields/wrapper';
import { Phone } from 'lucide-react';
import { useState, useEffect } from 'react';

interface PhoneInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  id: string;
  description?: string;
  format?: 'br' | 'us' | 'international';
}

const PhoneField = ({
  label,
  id,
  description,
  format = 'br',
  ...props
}: PhoneInputProps) => {
  const field = useFieldContext<string>();
  const [formattedValue, setFormattedValue] = useState<string>(
    field.state.value || '',
  );

  useEffect(() => {
    if (field.state.value) {
      setFormattedValue(formatPhoneNumber(field.state.value, format));
    }
  }, [field.state.value, format]);

  const formatPhoneNumber = (value: string, format: string): string => {
    // Remover caracteres não numéricos
    const digits = value.replace(/\D/g, '');

    switch (format) {
      case 'br':
        // Formato brasileiro: (00) 00000-0000 ou (00) 0000-0000
        if (digits.length <= 10) {
          return digits
            .replace(/(\d{2})(\d)/, '($1) $2')
            .replace(/(\d{4})(\d)/, '$1-$2');
        } else {
          return digits
            .replace(/(\d{2})(\d)/, '($1) $2')
            .replace(/(\d{5})(\d)/, '$1-$2');
        }
      case 'us':
        // Formato EUA: (000) 000-0000
        return digits
          .replace(/(\d{3})(\d)/, '($1) $2')
          .replace(/(\d{3})(\d)/, '$1-$2');
      case 'international':
        // Formato internacional: +00 00 0000 0000
        return (
          '+' +
          digits
            .replace(/(\d{2})(\d)/, '$1 $2')
            .replace(/(\d{2})(\d)/, '$1 $2')
            .replace(/(\d{4})(\d)/, '$1 $2')
        );
      default:
        return digits;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const digits = inputValue.replace(/\D/g, '');
    const formatted = formatPhoneNumber(digits, format);

    setFormattedValue(formatted);
    field.setValue(formatted);
  };

  return (
    <FieldWrapper>
      {label && (
        <LabelArea label={label} htmlFor={id} required={props.required} />
      )}
      <div className="relative">
        <Input
          id={id}
          type="tel"
          value={formattedValue}
          onChange={handleChange}
          className="pl-10"
          {...props}
        />
        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      </div>
      {description && (
        <span className="text-sm text-muted-foreground">{description}</span>
      )}
      <FieldError />
    </FieldWrapper>
  );
};

export default PhoneField;
