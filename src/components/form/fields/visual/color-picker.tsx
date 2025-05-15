'use client';

import type React from 'react';

import { useFieldContext } from '@/contexts/form-context';
import { Input } from '@/components/ui/input';
import { FieldError } from '@/components/form/inputs/error';
import { LabelArea } from '@/components/form/inputs/label';
import { FieldWrapper } from '@/components/form/inputs/wrapper';
import { useState, useEffect } from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';

interface ColorPickerProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  id: string;
  description?: string;
}

const ColorPickerField = ({
  label,
  id,
  description,
  ...props
}: ColorPickerProps) => {
  const field = useFieldContext<string>();
  const [color, setColor] = useState(field.state.value || '#6366F1');

  useEffect(() => {
    if (field.state.value) {
      setColor(field.state.value);
    }
  }, [field.state.value]);

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setColor(newColor);
    field.setValue(newColor);
  };

  const presetColors = [
    '#000000',
    '#ffffff',
    '#f44336',
    '#e91e63',
    '#9c27b0',
    '#673ab7',
    '#3f51b5',
    '#2196f3',
    '#03a9f4',
    '#00bcd4',
    '#009688',
    '#4caf50',
    '#8bc34a',
    '#cddc39',
    '#ffeb3b',
    '#ffc107',
    '#ff9800',
    '#ff5722',
  ];

  return (
    <FieldWrapper>
      {label && (
        <LabelArea label={label} htmlFor={id} required={props.required} />
      )}

      <div className="flex items-center gap-2 w-full">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-10 h-10 p-0 border-2"
              style={{ backgroundColor: color }}
            />
          </PopoverTrigger>
          <PopoverContent className="w-64">
            <div className="flex flex-col gap-4">
              <div>
                <Input
                  id={id}
                  type="color"
                  value={color}
                  onChange={handleColorChange}
                  className="w-full h-10"
                  {...props}
                />
              </div>
              <div className="grid grid-cols-6 gap-2">
                {presetColors.map((presetColor) => (
                  <button
                    key={presetColor}
                    type="button"
                    className="w-6 h-6 rounded-md border"
                    style={{ backgroundColor: presetColor }}
                    onClick={() => {
                      setColor(presetColor);
                      field.setValue(presetColor);
                    }}
                  />
                ))}
              </div>
              <Input
                type="text"
                value={color}
                onChange={(e) => {
                  setColor(e.target.value);
                  field.setValue(e.target.value);
                }}
                className="font-mono"
              />
            </div>
          </PopoverContent>
        </Popover>

        <Input
          value={color}
          onChange={(e) => {
            setColor(e.target.value);
            field.setValue(e.target.value);
          }}
          className="font-mono"
        />
      </div>

      {description && (
        <span className="text-sm text-muted-foreground">{description}</span>
      )}
      <FieldError />
    </FieldWrapper>
  );
};

export default ColorPickerField;
