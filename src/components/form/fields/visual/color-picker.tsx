'use client';

import type React from 'react';
import { Copy, Check, Pipette } from 'lucide-react';

import { FieldError } from '@/components/form/inputs/error';
import { LabelArea } from '@/components/form/inputs/label';
import { FieldWrapper } from '@/components/form/inputs/wrapper';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useFieldContext } from '@/contexts/form-context';
import {
  HexColorPicker,
  HslColor,
  HslColorPicker,
  RgbaColor,
  RgbaColorPicker,
} from 'react-colorful';
import { useState } from 'react';

interface ColorPickerProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  id: string;
  description?: string;
  mode?: 'hex' | 'hsl' | 'rgb';
}

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

const getColorString = (value: string | HslColor | RgbaColor) => {
  if (typeof value === 'string') return value;
  if ('h' in value && 's' in value && 'l' in value) {
    const { h, s, l } = value as HslColor;
    return `hsl(${Math.round(h)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
  }
  if ('r' in value && 'g' in value && 'b' in value) {
    const { r, g, b, a = 1 } = value as RgbaColor;
    return `rgba(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)}, ${a.toFixed(2)})`;
  }
  return '';
};

const ColorPickerField = ({
  label,
  id,
  description,
  mode = 'hex',
  ...props
}: ColorPickerProps) => {
  const field = useFieldContext<string | HslColor | RgbaColor>();
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(getColorString(field.state.value));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <FieldWrapper>
      {label && (
        <LabelArea label={label} htmlFor={id} required={props.required} />
      )}

      <div className="flex items-center gap-3 w-full">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="relative w-12 h-12 p-0 rounded-md transition-all duration-200 hover:scale-105 active:scale-95"
              style={{
                backgroundColor: field.state.value as string,
                border: '2px solid #e5e7eb',
              }}
            >
              <div className="absolute inset-0 opacity-20 bg-[linear-gradient(45deg,#ccc_25%,transparent_25%,transparent_75%,#ccc_75%,#ccc),linear-gradient(45deg,#ccc_25%,transparent_25%,transparent_75%,#ccc_75%,#ccc)] bg-[length:10px_10px] bg-[position:0_0,5px_5px]"></div>
              <Pipette className="absolute bottom-1 right-1" size={12} />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-64 p-3 animate-in fade-in zoom-in-95"
            asChild
          >
            <div>
              <div className="mb-4">
                {mode === 'hex' && (
                  <HexColorPicker
                    className="min-w-full"
                    color={field.state.value as string}
                    onChange={field.setValue}
                  />
                )}
                {mode === 'hsl' && (
                  <HslColorPicker
                    className="!w-full"
                    color={field.state.value as HslColor}
                    onChange={field.setValue}
                  />
                )}
                {mode === 'rgb' && (
                  <RgbaColorPicker
                    className="w-full"
                    color={field.state.value as RgbaColor}
                    onChange={field.setValue}
                  />
                )}
              </div>

              <div className="mt-3">
                <p className="text-xs font-medium text-gray-500 mb-2">
                  Preset Colors
                </p>
                <div className="grid grid-cols-6 gap-2">
                  {presetColors.map((color) => (
                    <Button
                      key={color}
                      onClick={() => field.setValue(color)}
                      className="w-6 h-6 rounded-md transition-transform duration-150 hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        <div className="flex-1 relative">
          <Input
            id={id}
            value={getColorString(field.state.value)}
            onChange={(e) => field.setValue(e.target.value)}
            className="h-10 pr-10"
            placeholder={
              mode === 'hex'
                ? '#RRGGBB'
                : mode === 'hsl'
                  ? 'hsl(h, s%, l%)'
                  : 'rgba(r, g, b, a)'
            }
            {...props}
          />
          <button
            type="button"
            onClick={handleCopy}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-md hover:bg-gray-100 active:bg-gray-200"
          >
            {copied ? (
              <Check size={16} className="text-green-500" />
            ) : (
              <Copy size={16} className="text-gray-500" />
            )}
          </button>
        </div>
      </div>

      {description && (
        <span className="text-sm text-muted-foreground mt-1">
          {description}
        </span>
      )}
      <FieldError />
    </FieldWrapper>
  );
};

export default ColorPickerField;
