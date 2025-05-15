'use client';

import type React from 'react';

import { useFieldContext } from '@/contexts/form-context';
import { FieldError } from '@/components/form/fields/error';
import { LabelArea } from '@/components/form/fields/label';
import { FieldWrapper } from '@/components/form/fields/wrapper';
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Check, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ValidationRule {
  pattern: RegExp;
  message: string;
}

interface CustomValidatorInputProps {
  label?: string;
  id: string;
  description?: string;
  required?: boolean;
  validationRules: ValidationRule[];
  placeholder?: string;
  type?: string;
}

const CustomValidatorInputField = ({
  label,
  id,
  description,
  required,
  validationRules,
  placeholder,
  type = 'text',
}: CustomValidatorInputProps) => {
  const field = useFieldContext<string>();
  const [value, setValue] = useState<string>(field.state.value || '');
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    if (field.state.value) {
      setValue(field.state.value);
      validateInput(field.state.value);
    }
  }, [field.state.value, validationRules]);

  const validateInput = (inputValue: string) => {
    if (!inputValue) {
      setIsValid(null);
      setErrorMessage('');
      return true;
    }

    for (const rule of validationRules) {
      if (!rule.pattern.test(inputValue)) {
        setIsValid(false);
        setErrorMessage(rule.message);
        return false;
      }
    }

    setIsValid(true);
    setErrorMessage('');
    return true;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setValue(inputValue);

    if (validateInput(inputValue)) {
      field.setValue(inputValue);
    }
  };

  return (
    <FieldWrapper>
      {label && <LabelArea label={label} htmlFor={id} required={required} />}

      <div className="space-y-3">
        <Input
          id={id}
          type={type}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          className={
            isValid === true
              ? 'border-green-500 focus-visible:ring-green-500'
              : isValid === false
                ? 'border-red-500 focus-visible:ring-red-500'
                : ''
          }
        />

        {isValid === true && value.length > 0 && (
          <Alert
            variant="default"
            className="bg-green-50 text-green-800 border-green-200"
          >
            <Check className="h-4 w-4" />
            <AlertDescription>Formato válido</AlertDescription>
          </Alert>
        )}

        {isValid === false && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}
      </div>

      {description && (
        <span className="text-sm text-muted-foreground">{description}</span>
      )}
      <FieldError />
    </FieldWrapper>
  );
};

export default CustomValidatorInputField;
