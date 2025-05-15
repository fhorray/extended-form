'use client';

import type React from 'react';

import { useFieldContext } from '@/contexts/form-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FieldError } from '@/components/form/fields/error';
import { LabelArea } from '@/components/form/fields/label';
import { FieldWrapper } from '@/components/form/fields/wrapper';
import { Music, X, Play, Pause } from 'lucide-react';
import { useState, useRef } from 'react';

interface AudioUploadProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  id: string;
  description?: string;
}

const AudioUploadField = ({
  label,
  id,
  description,
  ...props
}: AudioUploadProps) => {
  const field = useFieldContext<File | null>();
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioPreview, setAudioPreview] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const handleAudioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;

    if (file && file.type.startsWith('audio/')) {
      field.setValue(file);
      setAudioFile(file);
      setAudioPreview(URL.createObjectURL(file));
    } else {
      field.setValue(null);
      setAudioFile(null);
      setAudioPreview(null);
    }
  };

  const handleClearAudio = () => {
    field.setValue(null);
    setAudioFile(null);
    if (audioPreview) {
      URL.revokeObjectURL(audioPreview);
      setAudioPreview(null);
    }
    if (inputRef.current) {
      inputRef.current.value = '';
    }
    setIsPlaying(false);
  };

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <FieldWrapper>
      {label && (
        <LabelArea label={label} htmlFor={id} required={props.required} />
      )}

      <div className="flex flex-col gap-3 w-full">
        {audioPreview ? (
          <div className="relative w-full p-4 border rounded-md">
            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={togglePlay}
              >
                {isPlaying ? (
                  <Pause className="w-4 h-4" />
                ) : (
                  <Play className="w-4 h-4" />
                )}
              </Button>

              <div className="flex-1">
                <div className="text-sm font-medium truncate">
                  {audioFile?.name}
                </div>
                <audio
                  ref={audioRef}
                  src={audioPreview}
                  onEnded={() => setIsPlaying(false)}
                  className="w-full"
                  controls
                />
              </div>

              <Button
                type="button"
                variant="destructive"
                size="icon"
                onClick={handleClearAudio}
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
            <Music className="w-10 h-10 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Clique para fazer upload de um áudio
            </p>
          </div>
        )}

        <Input
          ref={inputRef}
          id={id}
          type="file"
          accept="audio/*"
          onChange={handleAudioChange}
          className="hidden"
          {...props}
        />

        {audioFile && !audioPreview && (
          <div className="text-sm">
            <span className="font-medium">{audioFile.name}</span> (
            {Math.round((audioFile.size / 1024 / 1024) * 100) / 100} MB)
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

export default AudioUploadField;
