'use client';

import type React from 'react';

import { useFieldContext } from '@/contexts/form-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FieldError } from '@/components/form/fields/error';
import { LabelArea } from '@/components/form/fields/label';
import { FieldWrapper } from '@/components/form/fields/wrapper';
import {
  Upload,
  X,
  File,
  ImageIcon,
  FileText,
  Music,
  Video,
} from 'lucide-react';
import { useState, useRef } from 'react';

interface MultipleFilesUploadProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    'type' | 'multiple'
  > {
  label?: string;
  id: string;
  description?: string;
  maxFiles?: number;
}

const MultipleFilesUploadField = ({
  label,
  id,
  description,
  maxFiles = 10,
  ...props
}: MultipleFilesUploadProps) => {
  const field = useFieldContext<File[]>();
  const [files, setFiles] = useState<File[]>(field.state.value || []);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;

    const newFiles = Array.from(e.target.files);
    let updatedFiles = [...files, ...newFiles];

    // Limitar o número de arquivos se necessário
    if (maxFiles > 0) {
      updatedFiles = updatedFiles.slice(0, maxFiles);
    }

    setFiles(updatedFiles);
    field.setValue(updatedFiles);
  };

  const removeFile = (index: number) => {
    const updatedFiles = [...files];
    updatedFiles.splice(index, 1);
    setFiles(updatedFiles);
    field.setValue(updatedFiles);
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) {
      return <ImageIcon className="w-5 h-5 text-blue-500" />;
    } else if (file.type.startsWith('video/')) {
      return <Video className="w-5 h-5 text-red-500" />;
    } else if (file.type.startsWith('audio/')) {
      return <Music className="w-5 h-5 text-green-500" />;
    } else if (file.type.includes('pdf') || file.type.includes('document')) {
      return <FileText className="w-5 h-5 text-yellow-500" />;
    }
    return <File className="w-5 h-5 text-gray-500" />;
  };

  return (
    <FieldWrapper>
      {label && (
        <LabelArea label={label} htmlFor={id} required={props.required} />
      )}

      <div className="w-full">
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={() => inputRef.current?.click()}
          disabled={maxFiles > 0 && files.length >= maxFiles}
        >
          <Upload className="w-4 h-4 mr-2" />
          Selecionar arquivos
          {maxFiles > 0 && ` (${files.length}/${maxFiles})`}
        </Button>

        <Input
          ref={inputRef}
          id={id}
          type="file"
          multiple
          onChange={handleFileChange}
          className="hidden"
          {...props}
        />

        {files.length > 0 && (
          <div className="mt-4 space-y-2">
            <p className="text-sm font-medium">
              Arquivos selecionados ({files.length})
            </p>
            <ul className="space-y-2">
              {files.map((file, index) => (
                <li
                  key={index}
                  className="flex items-center justify-between p-2 border rounded-md"
                >
                  <div className="flex items-center gap-2">
                    {getFileIcon(file)}
                    <div className="truncate">
                      <p className="text-sm font-medium truncate">
                        {file.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {Math.round((file.size / 1024) * 100) / 100} KB
                      </p>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeFile(index)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </li>
              ))}
            </ul>
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

export default MultipleFilesUploadField;
