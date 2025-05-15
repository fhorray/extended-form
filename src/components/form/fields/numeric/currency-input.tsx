'use client';

import type React from 'react';

import { useFieldContext } from '@/contexts/form-context';
import { Input } from '@/components/ui/input';
import { FieldError } from '@/components/form/fields/error';
import { LabelArea } from '@/components/form/fields/label';
import { FieldWrapper } from '@/components/form/fields/wrapper';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useState, useEffect } from 'react';

interface CurrencyInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  id: string;
  description?: string;
  defaultCurrency?: string;
  currencies?: Array<{ code: string; symbol: string }>;
}

interface CurrencyValue {
  amount: number;
  currency: string;
}

const CurrencyField = ({
  label,
  id,
  description,
  defaultCurrency = 'BRL',
  currencies,
  ...props
}: CurrencyInputProps) => {
  const field = useFieldContext<CurrencyValue>();
  const [amount, setAmount] = useState<number>(
    field.state.value?.amount !== undefined ? field.state.value.amount : 0,
  );
  const [currency, setCurrency] = useState<string>(
    field.state.value?.currency || defaultCurrency,
  );

  // Lista padrão de moedas
  const defaultCurrencies = [
    { code: 'BRL', symbol: 'R$' },
    { code: 'USD', symbol: '$' },
    { code: 'EUR', symbol: '€' },
    { code: 'GBP', symbol: '£' },
    { code: 'JPY', symbol: '¥' },
  ];

  const currencyOptions = currencies || defaultCurrencies;

  useEffect(() => {
    if (field.state.value) {
      setAmount(field.state.value.amount);
      setCurrency(field.state.value.currency);
    } else {
      field.setValue({ amount, currency });
    }
  }, [field.state.value]);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value === '' ? 0 : Number(e.target.value);
    setAmount(value);
    field.setValue({ amount: value, currency });
  };

  const handleCurrencyChange = (value: string) => {
    setCurrency(value);
    field.setValue({ amount, currency: value });
  };

  const getCurrencySymbol = (code: string) => {
    const found = currencyOptions.find((c) => c.code === code);
    return found ? found.symbol : code;
  };

  return (
    <FieldWrapper>
      {label && (
        <LabelArea label={label} htmlFor={id} required={props.required} />
      )}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <span className="text-muted-foreground">
              {getCurrencySymbol(currency)}
            </span>
          </div>
          <Input
            id={id}
            type="number"
            value={amount === 0 && props.placeholder ? '' : amount}
            onChange={handleAmountChange}
            className="pl-8"
            step="0.01"
            min={0}
            {...props}
          />
        </div>
        <Select value={currency} onValueChange={handleCurrencyChange}>
          <SelectTrigger className="w-24">
            <SelectValue placeholder="Moeda" />
          </SelectTrigger>
          <SelectContent>
            {currencyOptions.map((c) => (
              <SelectItem key={c.code} value={c.code}>
                {c.code} ({c.symbol})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {description && (
        <span className="text-sm text-muted-foreground">{description}</span>
      )}
      <FieldError />
    </FieldWrapper>
  );
};

export default CurrencyField;
