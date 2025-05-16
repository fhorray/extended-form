'use client';

import { FieldError } from '@/components/form/fields/error';
import { LabelArea } from '@/components/form/fields/label';
import { FieldWrapper } from '@/components/form/fields/wrapper';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useFieldContext, useFormContext } from '@/contexts/form-context';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

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
  const [values, setValues] = useState<Record<string, any>>({});

  // Initialize with default values on component mount
  useEffect(() => {
    // Create default values object
    const defaultValues: Record<string, any> = {};
    fields.forEach((f) => {
      defaultValues[f.name] = f.type === 'checkbox' ? false : '';
    });

    // If field already has values, use those, otherwise use defaults
    const initialValues = field.state.value
      ? { ...defaultValues, ...field.state.value }
      : defaultValues;

    // Set local state and update form context
    setValues(initialValues);

    // Only set the field value if it's empty or different
    if (
      !field.state.value ||
      JSON.stringify(field.state.value) !== JSON.stringify(initialValues)
    ) {
      field.setValue(initialValues);
    }
  }, [fields]);

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
            <Label
              htmlFor={`${id}-${name}`}
              className="text-sm font-medium flex items-center"
            >
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
              className="transition-all focus-visible:ring-primary/20"
            />
          </div>
        );

      case 'textarea':
        return (
          <div className="space-y-2" key={name}>
            <Label
              htmlFor={`${id}-${name}`}
              className="text-sm font-medium flex items-center"
            >
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
              className="min-h-[100px] transition-all focus-visible:ring-primary/20"
            />
          </div>
        );

      case 'checkbox':
        return (
          <div className="flex items-start space-x-2 py-2" key={name}>
            <Checkbox
              id={`${id}-${name}`}
              checked={values[name] || false}
              onCheckedChange={(checked) => updateField(name, checked)}
              className="mt-1 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
            />
            <div className="grid gap-1.5 leading-none">
              <Label
                htmlFor={`${id}-${name}`}
                className="text-sm font-medium flex items-center"
              >
                {label}
                {fieldRequired && (
                  <span className="text-destructive ml-1">*</span>
                )}
              </Label>
            </div>
          </div>
        );

      case 'select':
        return (
          <div className="space-y-2" key={name}>
            <Label
              htmlFor={`${id}-${name}`}
              className="text-sm font-medium flex items-center"
            >
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
              <SelectTrigger
                id={`${id}-${name}`}
                className="w-full transition-all focus-visible:ring-primary/20"
              >
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
      {/* {label && <LabelArea label={label} htmlFor={id} required={required} />} */}

      <div className={cn('space-y-4', !label && 'pt-6')}>
        {fields.map((fieldConfig) => renderField(fieldConfig))}
      </div>

      {description && (
        <span className="text-sm text-muted-foreground mt-2 block">
          {description}
        </span>
      )}
      <FieldError />
    </FieldWrapper>
  );
};

export default ObjectFieldComponent;
