'use client';

import React from 'react';
import { useFieldContext } from '@/contexts/form-context';
import { FieldError } from '@/components/form/fields/error';
import { LabelArea } from '@/components/form/fields/label';
import { FieldWrapper } from '@/components/form/fields/wrapper';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from '@/components/ui/input-otp';
import { useEffect, useState } from 'react';

interface OtpInputProps {
  label?: string;
  id: string;
  description?: string;
  length?: number;
  required?: boolean;
}

const OtpInputField = ({
  label,
  id,
  description,
  length = 6,
  required,
}: OtpInputProps) => {
  const field = useFieldContext<string>();
  const [value, setValue] = useState<string>('');

  // Sync initial value from field context
  useEffect(() => {
    if (field.state.value) {
      setValue(field.state.value.slice(0, length));
    }
  }, [field.state.value, length]);

  const handleChange = (newValue: string) => {
    // Update local state
    setValue(newValue);
    // Update form field value
    field.setValue(newValue);
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain').slice(0, length);
    if (pastedData) {
      setValue(pastedData);
      field.setValue(pastedData);
    }
  };

  return (
    <FieldWrapper>
      {label && <LabelArea label={label} htmlFor={id} required={required} />}

      <InputOTP
        maxLength={length}
        value={value}
        onChange={handleChange}
        onPaste={handlePaste}
      >
        <InputOTPGroup>
          {Array.from({ length }).map((_, index) => (
            <React.Fragment key={index}>
              <InputOTPSlot index={index} />
              {index < length - 1 && index % 3 === 2 && <InputOTPSeparator />}
            </React.Fragment>
          ))}
        </InputOTPGroup>
      </InputOTP>

      {description && (
        <span className="text-sm text-muted-foreground">{description}</span>
      )}
      <FieldError />
    </FieldWrapper>
  );
};

export default OtpInputField;
