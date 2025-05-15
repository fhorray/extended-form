'use client';

import type React from 'react';

import { useFieldContext } from '@/contexts/form-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FieldError } from '@/components/form/fields/error';
import { LabelArea } from '@/components/form/fields/label';
import { FieldWrapper } from '@/components/form/fields/wrapper';
import { Video, X } from 'lucide-react';
import { useState, useRef } from 'react';

interface VideoUploadProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  id: string;
  description?: string;
}

const VideoUploadField = ({
  label,
  id,
  description,
  ...props
}: VideoUploadProps) => {
  const field = useFieldContext<File | null>();
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;

    if (file && file.type.startsWith('video/')) {
      field.setValue(file);
      setVideoFile(file);
      setVideoPreview(URL.createObjectURL(file));
    } else {
      field.setValue(null);
      setVideoFile(null);
      setVideoPreview(null);
    }
  };

  const handleClearVideo = () => {
    field.setValue(null);
    setVideoFile(null);
    if (videoPreview) {
      URL.revokeObjectURL(videoPreview);
      setVideoPreview(null);
    }
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
        {videoPreview ? (
          <div className="relative w-full">
            <video
              src={videoPreview}
              controls
              className="w-full rounded-md border aspect-video object-cover"
            />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2"
              onClick={handleClearVideo}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        ) : (
          <div
            className="flex flex-col items-center justify-center gap-2 p-6 border-2 border-dashed rounded-md cursor-pointer hover:border-primary/50"
            onClick={() => inputRef.current?.click()}
          >
            <Video className="w-10 h-10 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Clique para fazer upload de um vídeo
            </p>
          </div>
        )}

        <Input
          ref={inputRef}
          id={id}
          type="file"
          accept="video/*"
          onChange={handleVideoChange}
          className="hidden"
          {...props}
        />

        {videoFile && (
          <div className="text-sm">
            <span className="font-medium">{videoFile.name}</span> (
            {Math.round((videoFile.size / 1024 / 1024) * 100) / 100} MB)
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

export default VideoUploadField;
