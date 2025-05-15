'use client';

import type React from 'react';

import { useFieldContext } from '@/contexts/form-context';
import { FieldError } from '@/components/form/fields/error';
import { LabelArea } from '@/components/form/fields/label';
import { FieldWrapper } from '@/components/form/fields/wrapper';
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { User, Check, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface SsnInputProps {
  label?: string;
  id: string;
  description?: string;
  required?: boolean;
  type?: 'cpf' | 'ssn';
}

const SsnInputField = ({
  label,
  id,
  description,
  required,
  type = 'cpf',
}: SsnInputProps) => {
  const field = useFieldContext<string>();
  const [value, setValue] = useState<string>(field.state.value || '');
  const [isValid, setIsValid] = useState<boolean | null>(null);

  useEffect(() => {
    if (field.state.value) {
      setValue(field.state.value);
      validateDocument(field.state.value);
    }
  }, [field.state.value, type]);

  const formatDocument = (value: string) => {
    // Remover caracteres não numéricos
    const cleanValue = value.replace(/\D/g, '');

    if (type === 'cpf') {
      // Formato CPF: 000.000.000-00
      return cleanValue
        .replace(/(\d{3})(?=\d)/g, '$1.')
        .replace(/(\d{3})(?=\d)/g, '$1.')
        .replace(/(\d{3})(?=\d)/g, '$1-');
    } else {
      // Formato SSN: 000-00-0000
      return cleanValue
        .replace(/(\d{3})(?=\d)/g, '$1-')
        .replace(/(\d{2})(?=\d)/g, '$1-');
    }
  };

  const validateDocument = (value: string) => {
    // Remover caracteres não numéricos
    const cleanValue = value.replace(/\D/g, '');

    if (cleanValue.length === 0) {
      setIsValid(null);
      return;
    }

    if (type === 'cpf') {
      // Validação básica de CPF (apenas comprimento)
      setIsValid(cleanValue.length === 11);
    } else {
      // Validação básica de SSN (apenas comprimento)
      setIsValid(cleanValue.length === 9);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const formatted = formatDocument(inputValue);
    setValue(formatted);
    field.setValue(formatted);
    validateDocument(formatted);
  };

  const getPlaceholder = () => {
    return type === 'cpf' ? '000.000.000-00' : '000-00-0000';
  };

  const getMaxLength = () => {
    return type === 'cpf' ? 14 : 11;
  };

  return (
    <FieldWrapper>
      {label && <LabelArea label={label} htmlFor={id} required={required} />}

      <div className="space-y-3">
        <div className="relative">
          <Input
            id={id}
            value={value}
            onChange={handleChange}
            placeholder={getPlaceholder()}
            maxLength={getMaxLength()}
            className="pl-10"
          />
          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        </div>

        {isValid === true && value.length > 0 && (
          <Alert
            variant="default"
            className="bg-green-50 text-green-800 border-green-200"
          >
            <Check className="h-4 w-4" />
            <AlertDescription>
              {type === 'cpf' ? 'CPF válido' : 'SSN válido'}
            </AlertDescription>
          </Alert>
        )}

        {isValid === false && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {type === 'cpf' ? 'CPF inválido' : 'SSN inválido'}. Verifique o
              formato.
            </AlertDescription>
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

export default SsnInputField;
