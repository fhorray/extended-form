'use client';

import { useFieldContext } from '@/contexts/form-context';
import { FieldError } from '@/components/form/fields/error';
import { LabelArea } from '@/components/form/fields/label';
import { FieldWrapper } from '@/components/form/fields/wrapper';
import { useState, useEffect } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectFieldProps {
  label?: string;
  id: string;
  description?: string;
  required?: boolean;
  placeholder?: string;
  options: SelectOption[];
  disabled?: boolean;
}

const SelectField = ({
  label,
  id,
  description,
  required,
  placeholder = 'Selecione uma opção',
  options,
  disabled,
}: SelectFieldProps) => {
  const field = useFieldContext<string>();
  const [value, setValue] = useState<string>(field.state.value || '');

  useEffect(() => {
    if (field.state.value) {
      setValue(field.state.value);
    }
  }, [field.state.value]);

  const handleValueChange = (newValue: string) => {
    setValue(newValue);
    field.setValue(newValue);
  };

  return (
    <FieldWrapper>
      {label && <LabelArea label={label} htmlFor={id} required={required} />}

      <Select
        value={value}
        onValueChange={handleValueChange}
        disabled={disabled}
      >
        <SelectTrigger id={id}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {description && (
        <span className="text-sm text-muted-foreground">{description}</span>
      )}
      <FieldError />
    </FieldWrapper>
  );
};

export default SelectField;
