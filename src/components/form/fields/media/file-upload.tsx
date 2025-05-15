'use client';

import type React from 'react';

import { useFieldContext } from '@/contexts/form-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FieldError } from '@/components/form/fields/error';
import { LabelArea } from '@/components/form/fields/label';
import { FieldWrapper } from '@/components/form/fields/wrapper';
import { Upload, X } from 'lucide-react';
import { useState, useRef } from 'react';

interface FileUploadProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  id: string;
  description?: string;
}

const FileUploadField = ({
  label,
  id,
  description,
  ...props
}: FileUploadProps) => {
  const field = useFieldContext();
  const [fileName, setFileName] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    field.setValue(file);
    setFileName(file?.name || '');
  };

  const handleClearFile = () => {
    field.setValue(null);
    setFileName('');
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return (
    <FieldWrapper>
      {label && (
        <LabelArea label={label} htmlFor={id} required={props.required} />
      )}

      <div className="flex flex-col gap-2 w-full">
        <div className="flex items-center gap-2">
          <Input
            ref={inputRef}
            id={id}
            type="file"
            onChange={handleFileChange}
            className="hidden"
            {...props}
          />

          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={() => inputRef.current?.click()}
          >
            <Upload className="w-4 h-4 mr-2" />
            {fileName ? 'Alterar arquivo' : 'Selecionar arquivo'}
          </Button>

          {fileName && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={handleClearFile}
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>

        {fileName && (
          <div className="text-sm">
            Arquivo selecionado: <span className="font-medium">{fileName}</span>
          </div>
        )}
      </div>

      {description && (
        <span className="text-sm text-muted-foreground">{description}</span>
      )}
      <FieldError />
    </FieldWrapper>
  );
};

export default FileUploadField;
