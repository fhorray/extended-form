'use client';

import type React from 'react';

import { useFieldContext } from '@/contexts/form-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FieldError } from '@/components/form/fields/error';
import { LabelArea } from '@/components/form/fields/label';
import { FieldWrapper } from '@/components/form/fields/wrapper';
import { ImagePlus, X } from 'lucide-react';
import { useState, useRef } from 'react';

interface ImageUploadProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  id: string;
  description?: string;
}

const ImageUploadField = ({
  label,
  id,
  description,
  ...props
}: ImageUploadProps) => {
  const field = useFieldContext<File | null>();
  const [preview, setPreview] = useState<string | null>(null);
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
    } else {
      field.setValue(null);
      setPreview(null);
    }
  };

  const handleClearImage = () => {
    field.setValue(null);
    setPreview(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return (
    <FieldWrapper>
      {label && (
        <LabelArea label={label} htmlFor={id} required={props.required} />
      )}

      <div className="flex flex-col gap-3 w-full">
        {preview ? (
          <div className="relative w-full">
            <div className="relative aspect-video w-full overflow-hidden rounded-md border">
              <img
                src={preview || '/placeholder.svg'}
                alt="Preview"
                className="object-cover"
              />
            </div>
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2"
              onClick={handleClearImage}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        ) : (
          <div
            className="flex flex-col items-center justify-center gap-2 p-6 border-2 border-dashed rounded-md cursor-pointer hover:border-primary/50"
            onClick={() => inputRef.current?.click()}
          >
            <ImagePlus className="w-10 h-10 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Clique para fazer upload de uma imagem
            </p>
          </div>
        )}

        <Input
          ref={inputRef}
          id={id}
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="hidden"
          {...props}
        />
      </div>

      {description && (
        <span className="text-sm text-muted-foreground">{description}</span>
      )}
      <FieldError />
    </FieldWrapper>
  );
};

export default ImageUploadField;
