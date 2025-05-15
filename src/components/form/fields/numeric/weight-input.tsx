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

interface WeightInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  id: string;
  description?: string;
  defaultUnit?: 'kg' | 'g' | 'lb' | 'oz';
}

interface WeightValue {
  value: number;
  unit: 'kg' | 'g' | 'lb' | 'oz';
}

const WeighthField = ({
  label,
  id,
  description,
  defaultUnit = 'kg',
  ...props
}: WeightInputProps) => {
  const field = useFieldContext<WeightValue>();
  const [weight, setWeight] = useState<number>(
    field.state.value?.value !== undefined ? field.state.value.value : 0,
  );
  const [unit, setUnit] = useState<'kg' | 'g' | 'lb' | 'oz'>(
    field.state.value?.unit || defaultUnit,
  );

  useEffect(() => {
    if (field.state.value) {
      setWeight(field.state.value.value);
      setUnit(field.state.value.unit);
    } else {
      field.setValue({ value: weight, unit });
    }
  }, [field.state.value]);

  const handleWeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value === '' ? 0 : Number(e.target.value);
    setWeight(value);
    field.setValue({ value, unit });
  };

  const handleUnitChange = (value: 'kg' | 'g' | 'lb' | 'oz') => {
    setUnit(value);
    field.setValue({ value: weight, unit: value });
  };

  return (
    <FieldWrapper>
      {label && (
        <LabelArea label={label} htmlFor={id} required={props.required} />
      )}
      <div className="flex gap-2">
        <Input
          id={id}
          type="number"
          value={weight === 0 && props.placeholder ? '' : weight}
          onChange={handleWeightChange}
          className="flex-1"
          step={unit === 'kg' || unit === 'lb' ? '0.1' : '1'}
          min={0}
          {...props}
        />
        <Select value={unit} onValueChange={handleUnitChange}>
          <SelectTrigger className="w-24">
            <SelectValue placeholder="Unidade" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="kg">kg</SelectItem>
            <SelectItem value="g">g</SelectItem>
            <SelectItem value="lb">lb</SelectItem>
            <SelectItem value="oz">oz</SelectItem>
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

export default WeighthField;
