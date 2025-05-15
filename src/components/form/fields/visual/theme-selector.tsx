'use client';

import type React from 'react';

import { useFieldContext } from '@/contexts/form-context';
import { FieldError } from '@/components/form/fields/error';
import { LabelArea } from '@/components/form/fields/label';
import { FieldWrapper } from '@/components/form/fields/wrapper';
import { useState, useEffect } from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Sun, Moon, Palette } from 'lucide-react';

interface ThemeSelectorProps {
  label?: string;
  id: string;
  description?: string;
  required?: boolean;
  themes?: Array<{ value: string; label: string; icon?: React.ReactNode }>;
}

const ThemeSelectorField = ({
  label,
  id,
  description,
  required,
  themes,
}: ThemeSelectorProps) => {
  const field = useFieldContext<string>();
  const [selectedTheme, setSelectedTheme] = useState<string>(
    field.state.value || 'light',
  );

  // useEffect(() => {
  //   if (field.state.value) {
  //     setSelectedTheme(field.state.value);
  //   }
  // }, [field.state.value]);

  const defaultThemes = [
    { value: 'light', label: 'Claro', icon: <Sun className="w-4 h-4" /> },
    { value: 'dark', label: 'Escuro', icon: <Moon className="w-4 h-4" /> },
    {
      value: 'system',
      label: 'Sistema',
      icon: <Palette className="w-4 h-4" />,
    },
  ];

  const themeOptions = themes || defaultThemes;

  const handleThemeChange = (value: string) => {
    setSelectedTheme(value);
    field.setValue(value);
  };

  return (
    <FieldWrapper>
      {label && <LabelArea label={label} htmlFor={id} required={required} />}

      <RadioGroup
        value={selectedTheme}
        onValueChange={handleThemeChange}
        className="flex flex-col space-y-1"
      >
        {themeOptions.map((theme) => (
          <div key={theme.value} className="flex items-center space-x-2">
            <RadioGroupItem value={theme.value} id={`${id}-${theme.value}`} />
            <Label
              htmlFor={`${id}-${theme.value}`}
              className="flex items-center gap-2 cursor-pointer"
            >
              {theme.icon}
              {theme.label}
            </Label>
          </div>
        ))}
      </RadioGroup>

      {description && (
        <span className="text-sm text-muted-foreground">{description}</span>
      )}
      <FieldError />
    </FieldWrapper>
  );
};

export default ThemeSelectorField;
