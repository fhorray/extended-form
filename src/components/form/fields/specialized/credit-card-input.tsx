'use client';

import type React from 'react';

import { useFieldContext } from '@/contexts/form-context';
import { FieldError } from '@/components/form/fields/error';
import { LabelArea } from '@/components/form/fields/label';
import { FieldWrapper } from '@/components/form/fields/wrapper';
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { CreditCard, Calendar, ShieldCheck } from 'lucide-react';

interface CreditCardValue {
  number: string;
  expiry: string;
  cvc: string;
}

interface CreditCardInputProps {
  label?: string;
  id: string;
  description?: string;
  required?: boolean;
}

const CreditCardInputField = ({
  label,
  id,
  description,
  required,
}: CreditCardInputProps) => {
  const field = useFieldContext<CreditCardValue>();
  const [cardData, setCardData] = useState<CreditCardValue>(
    field.state.value || { number: '', expiry: '', cvc: '' },
  );
  const [cardType, setCardType] = useState<string>('');

  useEffect(() => {
    if (field.state.value) {
      setCardData(field.state.value);
      detectCardType(field.state.value.number);
    }
  }, [field.state.value]);

  const detectCardType = (number: string) => {
    // Remover espaços e caracteres não numéricos
    const cleanNumber = number.replace(/\D/g, '');

    // Detectar tipo de cartão com base nos primeiros dígitos
    if (/^4/.test(cleanNumber)) {
      setCardType('Visa');
    } else if (/^5[1-5]/.test(cleanNumber)) {
      setCardType('Mastercard');
    } else if (/^3[47]/.test(cleanNumber)) {
      setCardType('American Express');
    } else if (/^6(?:011|5)/.test(cleanNumber)) {
      setCardType('Discover');
    } else {
      setCardType('');
    }
  };

  const formatCardNumber = (value: string) => {
    // Remover caracteres não numéricos
    const cleanValue = value.replace(/\D/g, '');

    // Limitar a 16 dígitos
    const truncated = cleanValue.slice(0, 16);

    // Adicionar espaços a cada 4 dígitos
    const formatted = truncated.replace(/(\d{4})(?=\d)/g, '$1 ');

    return formatted;
  };

  const formatExpiry = (value: string) => {
    // Remover caracteres não numéricos
    const cleanValue = value.replace(/\D/g, '');

    // Limitar a 4 dígitos
    const truncated = cleanValue.slice(0, 4);

    // Adicionar barra após os primeiros 2 dígitos
    if (truncated.length > 2) {
      return `${truncated.slice(0, 2)}/${truncated.slice(2)}`;
    }

    return truncated;
  };

  const formatCVC = (value: string) => {
    // Remover caracteres não numéricos
    const cleanValue = value.replace(/\D/g, '');

    // Limitar a 4 dígitos (para AMEX) ou 3 dígitos (para outros)
    const maxLength = cardType === 'American Express' ? 4 : 3;

    return cleanValue.slice(0, maxLength);
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    const updatedData = { ...cardData, number: formatted };
    setCardData(updatedData);
    field.setValue(updatedData);
    detectCardType(formatted);
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatExpiry(e.target.value);
    const updatedData = { ...cardData, expiry: formatted };
    setCardData(updatedData);
    field.setValue(updatedData);
  };

  const handleCVCChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCVC(e.target.value);
    const updatedData = { ...cardData, cvc: formatted };
    setCardData(updatedData);
    field.setValue(updatedData);
  };

  return (
    <FieldWrapper>
      {label && <LabelArea label={label} htmlFor={id} required={required} />}

      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor={`${id}-number`} className="text-sm font-medium">
                Número do Cartão
              </label>
              {cardType && (
                <span className="text-sm font-medium">{cardType}</span>
              )}
            </div>
            <div className="relative">
              <Input
                id={`${id}-number`}
                value={cardData.number}
                onChange={handleNumberChange}
                placeholder="1234 5678 9012 3456"
                className="pl-10"
              />
              <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor={`${id}-expiry`} className="text-sm font-medium">
                Validade
              </label>
              <div className="relative">
                <Input
                  id={`${id}-expiry`}
                  value={cardData.expiry}
                  onChange={handleExpiryChange}
                  placeholder="MM/AA"
                  className="pl-10"
                />
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor={`${id}-cvc`} className="text-sm font-medium">
                CVC/CVV
              </label>
              <div className="relative">
                <Input
                  id={`${id}-cvc`}
                  value={cardData.cvc}
                  onChange={handleCVCChange}
                  placeholder={cardType === 'American Express' ? '1234' : '123'}
                  className="pl-10"
                />
                <ShieldCheck className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {description && (
        <span className="text-sm text-muted-foreground">{description}</span>
      )}
      <FieldError />
    </FieldWrapper>
  );
};

export default CreditCardInputField;
