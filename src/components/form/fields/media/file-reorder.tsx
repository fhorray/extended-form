'use client';

import type React from 'react';

import { FieldError } from '@/components/form/fields/error';
import { LabelArea } from '@/components/form/fields/label';
import { FieldWrapper } from '@/components/form/fields/wrapper';
import { Button } from '@/components/ui/button';
import { useFieldContext } from '@/contexts/form-context';
import { File, FileText, GripVertical, Music, Video, X } from 'lucide-react';
import { useEffect, useState } from 'react';

interface FileItem {
  id: string;
  name: string;
  url: string;
  type?: string;
  size?: number;
}

interface FileReorderProps {
  label?: string;
  id: string;
  description?: string;
  required?: boolean;
}

const FileReorderField = ({
  label,
  id,
  description,
  required,
}: FileReorderProps) => {
  const field = useFieldContext<FileItem[]>();
  const [files, setFiles] = useState<FileItem[]>(field.state.value || []);
  const [draggedItem, setDraggedItem] = useState<FileItem | null>(null);

  useEffect(() => {
    if (field.state.value) {
      setFiles(field.state.value);
    }
  }, [field.state.value]);

  const handleDragStart = (
    e: React.DragEvent<HTMLLIElement>,
    item: FileItem,
  ) => {
    setDraggedItem(item);
    e.dataTransfer.effectAllowed = 'move';
    // Necessário para o Firefox
    e.dataTransfer.setData('text/plain', item.id);
  };

  const handleDragOver = (e: React.DragEvent<HTMLLIElement>, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (
    e: React.DragEvent<HTMLLIElement>,
    targetIndex: number,
  ) => {
    e.preventDefault();

    if (!draggedItem) return;

    const sourceIndex = files.findIndex((file) => file.id === draggedItem.id);
    if (sourceIndex === targetIndex) return;

    const updatedFiles = [...files];
    updatedFiles.splice(sourceIndex, 1);
    updatedFiles.splice(targetIndex, 0, draggedItem);

    setFiles(updatedFiles);
    field.setValue(updatedFiles);
    setDraggedItem(null);
  };

  const removeFile = (index: number) => {
    const updatedFiles = [...files];
    updatedFiles.splice(index, 1);
    setFiles(updatedFiles);
    field.setValue(updatedFiles);
  };

  const getFileIcon = (file: FileItem) => {
    const fileType =
      file.type || (file.name ? file.name.split('.').pop()?.toLowerCase() : '');

    if (
      fileType === 'jpg' ||
      fileType === 'jpeg' ||
      fileType === 'png' ||
      fileType === 'gif' ||
      fileType?.includes('image')
    ) {
      return <img className="w-5 h-5 text-blue-500" />;
    } else if (
      fileType === 'mp4' ||
      fileType === 'avi' ||
      fileType === 'mov' ||
      fileType?.includes('video')
    ) {
      return <Video className="w-5 h-5 text-red-500" />;
    } else if (
      fileType === 'mp3' ||
      fileType === 'wav' ||
      fileType?.includes('audio')
    ) {
      return <Music className="w-5 h-5 text-green-500" />;
    } else if (
      fileType === 'pdf' ||
      fileType === 'doc' ||
      fileType === 'docx' ||
      fileType?.includes('pdf') ||
      fileType?.includes('document')
    ) {
      return <FileText className="w-5 h-5 text-yellow-500" />;
    }
    return <File className="w-5 h-5 text-gray-500" />;
  };

  const isImageFile = (file: FileItem) => {
    const fileType =
      file.type || (file.name ? file.name.split('.').pop()?.toLowerCase() : '');
    return (
      fileType === 'jpg' ||
      fileType === 'jpeg' ||
      fileType === 'png' ||
      fileType === 'gif' ||
      fileType?.includes('image')
    );
  };

  return (
    <FieldWrapper>
      {label && <LabelArea label={label} htmlFor={id} required={required} />}

      <div className="w-full">
        {files.length > 0 ? (
          <ul className="space-y-2">
            {files.map((file, index) => (
              <li
                key={file.id}
                draggable
                onDragStart={(e) => handleDragStart(e, file)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDrop={(e) => handleDrop(e, index)}
                className={`flex items-center gap-2 p-2 border rounded-md ${
                  draggedItem?.id === file.id ? 'opacity-50 bg-muted' : ''
                }`}
              >
                <div className="cursor-move p-1">
                  <GripVertical className="w-4 h-4 text-muted-foreground" />
                </div>

                {isImageFile(file) ? (
                  <div className="relative w-10 h-10 rounded-md overflow-hidden">
                    <img
                      src={file.url || '/placeholder.svg'}
                      alt={file.name}
                      className="object-cover"
                    />
                  </div>
                ) : (
                  getFileIcon(file)
                )}

                <div className="flex-1 truncate">
                  <p className="text-sm font-medium truncate">{file.name}</p>
                  {file.size && (
                    <p className="text-xs text-muted-foreground">
                      {Math.round((file.size / 1024) * 100) / 100} KB
                    </p>
                  )}
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
        ) : (
          <div className="p-4 border rounded-md text-center text-muted-foreground">
            Nenhum arquivo para ordenar
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

export default FileReorderField;
