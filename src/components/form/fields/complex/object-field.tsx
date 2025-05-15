'use client';

import { useFieldContext } from '@/contexts/form-context';
import { FieldError } from '@/components/form/fields/error';
import { LabelArea } from '@/components/form/fields/label';
import { FieldWrapper } from '@/components/form/fields/wrapper';
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface ObjectFieldProps {
  label?: string;
  id: string;
  description?: string;
  required?: boolean;
  fields: Array<{
    name: string;
    label: string;
    type: 'text' | 'number' | 'email' | 'textarea' | 'checkbox' | 'select';
    options?: Array<{ value: string; label: string }>;
    placeholder?: string;
    required?: boolean;
  }>;
}

const ObjectFieldComponent = ({
  label,
  id,
  description,
  required,
  fields,
}: ObjectFieldProps) => {
  const field = useFieldContext<Record<string, any>>();
  const [values, setValues] = useState<Record<string, any>>(
    field.state.value || {},
  );

  useEffect(() => {
    if (field.state.value) {
      setValues(field.state.value);
    } else {
      // Inicializar com valores padrão
      const defaultValues: Record<string, any> = {};
      fields.forEach((f) => {
        defaultValues[f.name] = f.type === 'checkbox' ? false : '';
      });
      setValues(defaultValues);
      field.setValue(defaultValues);
    }
  }, [field.state.value, fields]);

  const updateField = (name: string, value: any) => {
    const updatedValues = { ...values, [name]: value };
    setValues(updatedValues);
    field.setValue(updatedValues);
  };

  const renderField = (fieldConfig: ObjectFieldProps['fields'][0]) => {
    const {
      name,
      label,
      type,
      options,
      placeholder,
      required: fieldRequired,
    } = fieldConfig;

    switch (type) {
      case 'text':
      case 'email':
      case 'number':
        return (
          <div className="space-y-2" key={name}>
            <Label htmlFor={`${id}-${name}`}>
              {label}
              {fieldRequired && (
                <span className="text-destructive ml-1">*</span>
              )}
            </Label>
            <Input
              id={`${id}-${name}`}
              type={type}
              value={values[name] || ''}
              onChange={(e) => updateField(name, e.target.value)}
              placeholder={placeholder}
              required={fieldRequired}
            />
          </div>
        );

      case 'textarea':
        return (
          <div className="space-y-2" key={name}>
            <Label htmlFor={`${id}-${name}`}>
              {label}
              {fieldRequired && (
                <span className="text-destructive ml-1">*</span>
              )}
            </Label>
            <Textarea
              id={`${id}-${name}`}
              value={values[name] || ''}
              onChange={(e) => updateField(name, e.target.value)}
              placeholder={placeholder}
              required={fieldRequired}
            />
          </div>
        );

      case 'checkbox':
        return (
          <div className="flex items-center space-x-2" key={name}>
            <Checkbox
              id={`${id}-${name}`}
              checked={values[name] || false}
              onCheckedChange={(checked) => updateField(name, checked)}
            />
            <Label htmlFor={`${id}-${name}`}>
              {label}
              {fieldRequired && (
                <span className="text-destructive ml-1">*</span>
              )}
            </Label>
          </div>
        );

      case 'select':
        return (
          <div className="space-y-2" key={name}>
            <Label htmlFor={`${id}-${name}`}>
              {label}
              {fieldRequired && (
                <span className="text-destructive ml-1">*</span>
              )}
            </Label>
            <Select
              value={values[name] || ''}
              onValueChange={(value) => updateField(name, value)}
              required={fieldRequired}
            >
              <SelectTrigger id={`${id}-${name}`}>
                <SelectValue
                  placeholder={
                    placeholder || `Selecione ${label.toLowerCase()}`
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {options?.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <FieldWrapper>
      {label && <LabelArea label={label} htmlFor={id} required={required} />}

      <Card>
        <CardContent className="pt-6 space-y-4">
          {fields.map((fieldConfig) => renderField(fieldConfig))}
        </CardContent>
      </Card>

      {description && (
        <span className="text-sm text-muted-foreground">{description}</span>
      )}
      <FieldError />
    </FieldWrapper>
  );
};

export default ObjectFieldComponent;
