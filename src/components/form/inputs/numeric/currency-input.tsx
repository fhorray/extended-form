import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useFieldContext } from '../../context';
import { FieldError } from '../error';
import { LabelArea } from '../label';
import { FieldWrapper } from '../wrapper';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useEffect, useRef, useState } from 'react';

interface CurrencyInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  id: string;
  description?: string;
  currency?: string;
  showCurrencySelector?: boolean;
  currencies?: { code: string; symbol: string }[];
  onCurrencyChange?: (currency: string) => void;
}

const defaultCurrencies = [
  { code: 'USD', symbol: '$' }, // Dólar Americano
  { code: 'EUR', symbol: '€' }, // Euro
  { code: 'GBP', symbol: '£' }, // Libra Esterlina
  { code: 'JPY', symbol: '¥' }, // Iene Japonês
  { code: 'CNY', symbol: '¥' }, // Yuan Chinês
  { code: 'INR', symbol: '₹' }, // Rúpia Indiana
  { code: 'BRL', symbol: 'R$' }, // Real Brasileiro
  { code: 'CAD', symbol: 'C$' }, // Dólar Canadense
  { code: 'AUD', symbol: 'A$' }, // Dólar Australiano
  { code: 'CHF', symbol: 'CHF' }, // Franco Suíço
  { code: 'KRW', symbol: '₩' }, // Won Sul-Coreano
  { code: 'MXN', symbol: '$' }, // Peso Mexicano
  { code: 'ZAR', symbol: 'R' }, // Rand Sul-Africano
  { code: 'TRY', symbol: '₺' }, // Lira Turca
  { code: 'RUB', symbol: '₽' }, // Rublo Russo
  { code: 'SEK', symbol: 'kr' }, // Coroa Sueca
  { code: 'NOK', symbol: 'kr' }, // Coroa Norueguesa
  { code: 'SGD', symbol: 'S$' }, // Dólar de Singapura
  { code: 'HKD', symbol: 'HK$' }, // Dólar de Hong Kong
];
export const CurrencyInput = ({
  id,
  label,
  description,
  currency = 'USD',
  showCurrencySelector = false,
  currencies = defaultCurrencies,
  onCurrencyChange,
  ...props
}: CurrencyInputProps) => {
  const field = useFieldContext<string>();
  const [selectedCurrency, setSelectedCurrency] = useState(currency);
  const [displayValue, setDisplayValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const getCurrencySymbol = (code: string) => {
    const found = currencies.find((c) => c.code === code);
    return found ? found.symbol : code;
  };

  const formatCurrency = (value: string) => {
    const num = Number(value);
    return isNaN(num)
      ? value
      : new Intl.NumberFormat('en-US', {
          style: 'decimal',
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(num);
  };

  const parseCurrency = (value: string) => {
    return value.replace(/[^\d.-]/g, '');
  };

  useEffect(() => {
    setDisplayValue(formatCurrency(field.state.value ?? ''));
  }, [field.state.value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = parseCurrency(e.target.value);
    setDisplayValue(e.target.value);
    field.setValue(raw);
  };

  const handleBlur = () => {
    setDisplayValue(formatCurrency(field.state.value ?? ''));
  };

  const handleCurrencyChange = (value: string) => {
    setSelectedCurrency(value);
    onCurrencyChange?.(value);
  };

  return (
    <FieldWrapper>
      {label && (
        <LabelArea label={label} htmlFor={id} required={props.required} />
      )}

      <div
        className={cn('w-full flex gap-2', {
          'items-start': showCurrencySelector,
        })}
      >
        {showCurrencySelector && (
          <Select value={selectedCurrency} onValueChange={handleCurrencyChange}>
            <SelectTrigger className="w-[100px] shrink-0">
              <SelectValue placeholder={selectedCurrency} />
            </SelectTrigger>
            <SelectContent>
              {currencies.map((curr) => (
                <SelectItem key={curr.code} value={curr.code}>
                  {curr.symbol} {curr.code}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        <div className="relative flex-1">
          {!showCurrencySelector && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              {getCurrencySymbol(selectedCurrency)}
            </span>
          )}
          <Input
            id={id}
            ref={inputRef}
            type="text"
            value={displayValue}
            onChange={handleChange}
            onBlur={handleBlur}
            onFocus={() => {
              // Coloca o cursor no início
              requestAnimationFrame(() => {
                inputRef.current?.setSelectionRange(0, 0);
              });
            }}
            className={cn(
              !showCurrencySelector && 'w-full pl-8',
              props.className,
            )}
            {...props}
          />
        </div>
      </div>

      {description && <span className="text-sm opacity-45">{description}</span>}
      <FieldError />
    </FieldWrapper>
  );
};

export default CurrencyInput;
