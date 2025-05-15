'use client';

import type React from 'react';

import { useFieldContext } from '@/contexts/form-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FieldError } from '@/components/form/fields/error';
import { LabelArea } from '@/components/form/fields/label';
import { FieldWrapper } from '@/components/form/fields/wrapper';
import { X, Camera, Pencil } from 'lucide-react';
import { useState, useRef } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface AvatarUploaderProps {
  label?: string;
  id: string;
  description?: string;
  required?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const AvatarUploaderField = ({
  label,
  id,
  description,
  required,
  size = 'md',
}: AvatarUploaderProps) => {
  const field = useFieldContext<File | string | null>();
  const [preview, setPreview] = useState<string | null>(
    typeof field.state.value === 'string' ? field.state.value : null,
  );
  const [initials, setInitials] = useState('JD');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;

    if (file && file.type.startsWith('image/')) {
      field.setValue(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClearImage = () => {
    field.setValue(null);
    setPreview(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const handleInitialsChange = (value: string) => {
    // Limitar a 2 caracteres e converter para maiúsculas
    const newInitials = value.slice(0, 2).toUpperCase();
    setInitials(newInitials);
  };

  const avatarSize = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
  }[size];

  const buttonSize = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
  }[size];

  return (
    <FieldWrapper>
      {label && <LabelArea label={label} htmlFor={id} required={required} />}

      <div className="flex flex-col items-center gap-3">
        <div className="relative">
          <Avatar className={`${avatarSize} border-2 border-muted`}>
            <AvatarImage src={preview || ''} alt="Avatar" />
            <AvatarFallback className="text-xl font-bold">
              {initials}
            </AvatarFallback>
          </Avatar>

          <div className="absolute -bottom-2 -right-2 flex gap-1">
            <Button
              type="button"
              variant="secondary"
              size="icon"
              className={`${buttonSize} rounded-full shadow-md`}
              onClick={() => inputRef.current?.click()}
            >
              <Camera className="w-4 h-4" />
            </Button>

            {preview && (
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className={`${buttonSize} rounded-full shadow-md`}
                onClick={handleClearImage}
              >
                <X className="w-4 h-4" />
              </Button>
            )}

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className={`${buttonSize} rounded-full shadow-md bg-white`}
                >
                  <Pencil className="w-4 h-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64 p-4">
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Iniciais do Avatar</h4>
                  <p className="text-xs text-muted-foreground">
                    Defina as iniciais que serão exibidas quando não houver
                    imagem.
                  </p>
                  <Input
                    value={initials}
                    onChange={(e) => handleInitialsChange(e.target.value)}
                    maxLength={2}
                    className="text-center font-bold"
                  />
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <Input
          ref={inputRef}
          id={id}
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="hidden"
        />
      </div>

      {description && (
        <span className="text-sm text-muted-foreground text-center">
          {description}
        </span>
      )}
      <FieldError />
    </FieldWrapper>
  );
};

export default AvatarUploaderField;
