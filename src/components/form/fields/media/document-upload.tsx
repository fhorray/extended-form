'use client';

import type React from 'react';

import { useFieldContext } from '@/contexts/form-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FieldError } from '@/components/form/fields/error';
import { LabelArea } from '@/components/form/fields/label';
import { FieldWrapper } from '@/components/form/fields/wrapper';
import { FileText, X, Eye } from 'lucide-react';
import { useState, useRef } from 'react';

interface DocumentUploadProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  id: string;
  description?: string;
}

const DocumentUploadField = ({
  label,
  id,
  description,
  ...props
}: DocumentUploadProps) => {
  const field = useFieldContext<File | null>();
  const [docFile, setDocFile] = useState<File | null>(null);
  const [docPreview, setDocPreview] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDocChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    const acceptedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
    ];

    if (
      file &&
      (acceptedTypes.includes(file.type) ||
        file.name.endsWith('.pdf') ||
        file.name.endsWith('.doc') ||
        file.name.endsWith('.docx') ||
        file.name.endsWith('.txt'))
    ) {
      field.setValue(file);
      setDocFile(file);

      // Criar URL para preview apenas para PDFs
      if (file.type === 'application/pdf') {
        setDocPreview(URL.createObjectURL(file));
      } else {
        setDocPreview(null);
      }
    } else {
      field.setValue(null);
      setDocFile(null);
      setDocPreview(null);
    }
  };

  const handleClearDoc = () => {
    field.setValue(null);
    setDocFile(null);
    if (docPreview) {
      URL.revokeObjectURL(docPreview);
      setDocPreview(null);
    }
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const getFileIcon = () => {
    if (!docFile) return <FileText className="w-10 h-10" />;

    if (docFile.name.endsWith('.pdf')) {
      return <FileText className="w-10 h-10 text-red-500" />;
    } else if (
      docFile.name.endsWith('.doc') ||
      docFile.name.endsWith('.docx')
    ) {
      return <FileText className="w-10 h-10 text-blue-500" />;
    } else if (docFile.name.endsWith('.txt')) {
      return <FileText className="w-10 h-10 text-gray-500" />;
    }

    return <FileText className="w-10 h-10" />;
  };

  return (
    <FieldWrapper>
      {label && (
        <LabelArea label={label} htmlFor={id} required={props.required} />
      )}

      <div className="flex flex-col gap-3 w-full">
        {docFile ? (
          <div className="relative w-full p-4 border rounded-md">
            <div className="flex items-center gap-3">
              {getFileIcon()}

              <div className="flex-1">
                <div className="text-sm font-medium truncate">
                  {docFile.name}
                </div>
                <div className="text-xs text-muted-foreground">
                  {Math.round((docFile.size / 1024) * 100) / 100} KB •{' '}
                  {docFile.type || 'Documento'}
                </div>
              </div>

              {docPreview && (
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => window.open(docPreview, '_blank')}
                >
                  <Eye className="w-4 h-4" />
                </Button>
              )}

              <Button
                type="button"
                variant="destructive"
                size="icon"
                onClick={handleClearDoc}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ) : (
          <div
            className="flex flex-col items-center justify-center gap-2 p-6 border-2 border-dashed rounded-md cursor-pointer hover:border-primary/50"
            onClick={() => inputRef.current?.click()}
          >
            <FileText className="w-10 h-10 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Clique para fazer upload de um documento
            </p>
            <p className="text-xs text-muted-foreground">PDF, DOC, DOCX, TXT</p>
          </div>
        )}

        <Input
          ref={inputRef}
          id={id}
          type="file"
          accept=".pdf,.doc,.docx,.txt,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
          onChange={handleDocChange}
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

export default DocumentUploadField;
