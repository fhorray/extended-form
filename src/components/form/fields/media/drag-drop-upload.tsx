'use client';

import type React from 'react';

import { useFieldContext } from '@/contexts/form-context';
import { Button } from '@/components/ui/button';
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

interface DragDropUploadProps {
  label?: string;
  id: string;
  description?: string;
  accept?: string;
  multiple?: boolean;
  maxFiles?: number;
  required?: boolean;
}

const DragDropUploadField = ({
  label,
  id,
  description,
  accept = '*/*',
  multiple = true,
  maxFiles = 5,
  required,
}: DragDropUploadProps) => {
  const field = useFieldContext<File[]>();
  const [files, setFiles] = useState<File[]>(field.state.value || []);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (newFiles: FileList | null) => {
    if (!newFiles) return;

    const fileArray = Array.from(newFiles);
    let updatedFiles = multiple ? [...files, ...fileArray] : fileArray;

    // Limitar o número de arquivos se necessário
    if (multiple && maxFiles > 0) {
      updatedFiles = updatedFiles.slice(0, maxFiles);
    }

    setFiles(updatedFiles);
    field.setValue(updatedFiles);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const droppedFiles = e.dataTransfer.files;
    handleFileChange(droppedFiles);
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
      {label && <LabelArea label={label} htmlFor={id} required={required} />}

      <div className="w-full">
        <div
          className={`flex flex-col items-center justify-center p-6 border-2 ${
            isDragging ? 'border-primary bg-primary/5' : 'border-dashed'
          } rounded-md transition-colors cursor-pointer hover:border-primary/50`}
          onClick={() => fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <Upload className="w-10 h-10 text-muted-foreground mb-2" />
          <p className="text-sm text-center text-muted-foreground">
            Arraste e solte arquivos aqui ou clique para selecionar
          </p>
          {multiple && maxFiles > 0 && (
            <p className="text-xs text-center text-muted-foreground mt-1">
              Máximo de {maxFiles} arquivos
            </p>
          )}
          <input
            ref={fileInputRef}
            id={id}
            type="file"
            accept={accept}
            multiple={multiple}
            onChange={(e) => handleFileChange(e.target.files)}
            className="hidden"
          />
        </div>

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
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(index);
                    }}
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

export default DragDropUploadField;
