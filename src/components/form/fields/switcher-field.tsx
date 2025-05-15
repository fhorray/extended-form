'use client';

import { useFieldContext } from '@/contexts/form-context';
import { FieldError } from '@/components/form/fields/error';
import { FieldWrapper } from '@/components/form/fields/wrapper';
import { useState, useEffect } from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface SwitcherFieldProps {
  label?: string;
  id: string;
  description?: string;
  required?: boolean;
  disabled?: boolean;
}

const SwitcherField = ({
  label,
  id,
  description,
  required,
  disabled,
}: SwitcherFieldProps) => {
  const field = useFieldContext<boolean>();
  const [checked, setChecked] = useState<boolean>(field.state.value || false);

  useEffect(() => {
    if (field.state.value !== undefined) {
      setChecked(field.state.value);
    }
  }, [field.state.value]);

  const handleCheckedChange = (checked: boolean) => {
    setChecked(checked);
    field.setValue(checked);
  };

  return (
    <FieldWrapper>
      <div className="flex items-center space-x-2">
        <Switch
          id={id}
          checked={checked}
          onCheckedChange={handleCheckedChange}
          disabled={disabled}
        />
        {label && (
          <Label htmlFor={id} className="cursor-pointer">
            {label}
            {required && <span className="text-destructive ml-1">*</span>}
          </Label>
        )}
      </div>
      {description && (
        <span className="text-sm text-muted-foreground">{description}</span>
      )}
      <FieldError />
    </FieldWrapper>
  );
};

export default SwitcherField;
