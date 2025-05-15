'use client';

import type React from 'react';

import { useFieldContext } from '@/contexts/form-context';
import { Input } from '@/components/ui/input';
import { FieldError } from '@/components/form/fields/error';
import { LabelArea } from '@/components/form/fields/label';
import { FieldWrapper } from '@/components/form/fields/wrapper';
import { AtSign, Check, X } from 'lucide-react';
import { useState, useEffect } from 'react';

interface UsernameInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  id: string;
  description?: string;
  minLength?: number;
  validateUsername?: (username: string) => Promise<boolean>;
}

const UsernameField = ({
  label,
  id,
  description,
  minLength = 3,
  validateUsername,
  ...props
}: UsernameInputProps) => {
  const field = useFieldContext<string>();
  const [isChecking, setIsChecking] = useState(false);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const checkUsername = async () => {
      const username = field.state.value;

      if (!username || username.length < minLength) {
        setIsAvailable(null);
        return;
      }

      setIsChecking(true);

      try {
        if (validateUsername) {
          const available = await validateUsername(username);
          setIsAvailable(available);
        } else {
          // Simulação de verificação
          await new Promise((resolve) => setTimeout(resolve, 500));
          // Simular disponibilidade com base no comprimento do nome de usuário
          setIsAvailable(username.length % 2 === 0);
        }
      } catch (error) {
        console.error('Erro ao verificar nome de usuário:', error);
        setIsAvailable(null);
      } finally {
        setIsChecking(false);
      }
    };

    if (field.state.value) {
      // Debounce para evitar muitas requisições
      clearTimeout(timeoutId);
      timeoutId = setTimeout(checkUsername, 500);
    } else {
      setIsAvailable(null);
    }

    return () => clearTimeout(timeoutId);
  }, [field.state.value, minLength, validateUsername]);

  return (
    <FieldWrapper>
      {label && (
        <LabelArea label={label} htmlFor={id} required={props.required} />
      )}
      <div className="relative">
        <Input
          id={id}
          type="text"
          value={field.state.value || ''}
          onChange={(e) => field.setValue(e.target.value)}
          className="pl-10 pr-10"
          {...props}
        />
        <AtSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />

        {field.state.value && field.state.value.length >= minLength && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            {isChecking ? (
              <div className="h-4 w-4 rounded-full border-2 border-t-transparent border-primary animate-spin" />
            ) : isAvailable === true ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : isAvailable === false ? (
              <X className="h-4 w-4 text-red-500" />
            ) : null}
          </div>
        )}
      </div>

      {field.state.value && isAvailable === false && (
        <p className="text-sm text-red-500 mt-1">
          Este nome de usuário já está em uso.
        </p>
      )}

      {field.state.value && isAvailable === true && (
        <p className="text-sm text-green-500 mt-1">
          Nome de usuário disponível!
        </p>
      )}

      {description && (
        <span className="text-sm text-muted-foreground">{description}</span>
      )}
      <FieldError />
    </FieldWrapper>
  );
};

export default UsernameField;
