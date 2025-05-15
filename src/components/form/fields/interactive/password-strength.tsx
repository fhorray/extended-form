'use client';

import type React from 'react';

import { useFieldContext } from '@/contexts/form-context';
import { FieldError } from '@/components/form/fields/error';
import { LabelArea } from '@/components/form/fields/label';
import { FieldWrapper } from '@/components/form/fields/wrapper';
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Eye, EyeOff, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PasswordStrengthProps {
  label?: string;
  id: string;
  description?: string;
  required?: boolean;
  showCriteria?: boolean;
}

const PasswordStrengthField = ({
  label,
  id,
  description,
  required,
  showCriteria = true,
}: PasswordStrengthProps) => {
  const field = useFieldContext<string>();
  const [password, setPassword] = useState<string>(field.state.value || '');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [strength, setStrength] = useState<number>(0);

  useEffect(() => {
    if (field.state.value) {
      setPassword(field.state.value);
      calculateStrength(field.state.value);
    }
  }, [field.state.value]);

  const calculateStrength = (value: string) => {
    let score = 0;

    // Critérios de força da senha
    if (value.length > 0) score += 1; // Senha não está vazia
    if (value.length >= 8) score += 1; // Comprimento mínimo
    if (/[A-Z]/.test(value)) score += 1; // Contém maiúsculas
    if (/[a-z]/.test(value)) score += 1; // Contém minúsculas
    if (/[0-9]/.test(value)) score += 1; // Contém números
    if (/[^A-Za-z0-9]/.test(value)) score += 1; // Contém caracteres especiais

    // Normalizar para 0-100
    const normalizedScore = Math.min(Math.floor((score / 6) * 100), 100);
    setStrength(normalizedScore);

    return score;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    field.setValue(value);
    calculateStrength(value);
  };

  const getStrengthColor = () => {
    if (strength < 30) return 'bg-red-500';
    if (strength < 60) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getStrengthText = () => {
    if (strength < 30) return 'Fraca';
    if (strength < 60) return 'Média';
    if (strength < 80) return 'Forte';
    return 'Muito forte';
  };

  // Verificar critérios específicos
  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[^A-Za-z0-9]/.test(password);

  return (
    <FieldWrapper>
      {label && <LabelArea label={label} htmlFor={id} required={required} />}

      <div className="space-y-3">
        <div className="relative">
          <Input
            id={id}
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={handleChange}
            className="pr-10"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0 h-full px-3"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </Button>
        </div>

        {password.length > 0 && (
          <>
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">{getStrengthText()}</span>
                <span className="text-sm">{strength}%</span>
              </div>
              <Progress value={strength} className={getStrengthColor()} />
            </div>

            {showCriteria && (
              <div className="space-y-1 text-sm">
                <p className="font-medium">Sua senha deve conter:</p>
                <ul className="space-y-1">
                  <li className="flex items-center">
                    {hasMinLength ? (
                      <Check className="h-4 w-4 text-green-500 mr-2" />
                    ) : (
                      <X className="h-4 w-4 text-red-500 mr-2" />
                    )}
                    Pelo menos 8 caracteres
                  </li>
                  <li className="flex items-center">
                    {hasUppercase ? (
                      <Check className="h-4 w-4 text-green-500 mr-2" />
                    ) : (
                      <X className="h-4 w-4 text-red-500 mr-2" />
                    )}
                    Pelo menos uma letra maiúscula
                  </li>
                  <li className="flex items-center">
                    {hasLowercase ? (
                      <Check className="h-4 w-4 text-green-500 mr-2" />
                    ) : (
                      <X className="h-4 w-4 text-red-500 mr-2" />
                    )}
                    Pelo menos uma letra minúscula
                  </li>
                  <li className="flex items-center">
                    {hasNumber ? (
                      <Check className="h-4 w-4 text-green-500 mr-2" />
                    ) : (
                      <X className="h-4 w-4 text-red-500 mr-2" />
                    )}
                    Pelo menos um número
                  </li>
                  <li className="flex items-center">
                    {hasSpecialChar ? (
                      <Check className="h-4 w-4 text-green-500 mr-2" />
                    ) : (
                      <X className="h-4 w-4 text-red-500 mr-2" />
                    )}
                    Pelo menos um caractere especial
                  </li>
                </ul>
              </div>
            )}
          </>
        )}
      </div>

      {description && (
        <span className="text-sm text-muted-foreground">{description}</span>
      )}
      <FieldError />
    </FieldWrapper>
  );
};

export default PasswordStrengthField;
