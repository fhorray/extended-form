'use client';

import { useFieldContext } from '@/contexts/form-context';
import { Button } from '@/components/ui/button';
import { FieldError } from '@/components/form/fields/error';
import { LabelArea } from '@/components/form/fields/label';
import { FieldWrapper } from '@/components/form/fields/wrapper';
import { Mic, Square, Play, Pause, X } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { Progress } from '@/components/ui/progress';

interface VoiceRecorderProps {
  label?: string;
  id: string;
  description?: string;
  maxDuration?: number; // em segundos
  required?: boolean;
}

const VoiceRecorderField = ({
  label,
  id,
  description,
  maxDuration = 60,
  required,
}: VoiceRecorderProps) => {
  const field = useFieldContext<string | null>();
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(
    field.state.value || null,
  );
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [recordingTime, setRecordingTime] = useState(0);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (field.state.value) {
      setAudioURL(field.state.value);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }

      if (audioURL && audioURL !== field.state.value) {
        URL.revokeObjectURL(audioURL);
      }
    };
  }, [field.state.value]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: 'audio/wav',
        });
        const url = URL.createObjectURL(audioBlob);

        if (audioURL) {
          URL.revokeObjectURL(audioURL);
        }

        setAudioURL(url);
        field.setValue(url);

        // Parar todos os tracks do stream
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setIsPaused(false);
      setRecordingTime(0);

      // Iniciar o timer para controlar o tempo de gravação
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => {
          const newTime = prev + 1;
          if (newTime >= maxDuration) {
            stopRecording();
            return maxDuration;
          }
          return newTime;
        });
      }, 1000);
    } catch (err) {
      console.error('Erro ao acessar o microfone:', err);
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      if (isPaused) {
        mediaRecorderRef.current.resume();

        // Reiniciar o timer
        timerRef.current = setInterval(() => {
          setRecordingTime((prev) => {
            const newTime = prev + 1;
            if (newTime >= maxDuration) {
              stopRecording();
              return maxDuration;
            }
            return newTime;
          });
        }, 1000);
      } else {
        mediaRecorderRef.current.pause();

        // Pausar o timer
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
      }

      setIsPaused(!isPaused);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);

      // Parar o timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  const playAudio = () => {
    if (audioRef.current) {
      audioRef.current.play();
    }
  };

  const pauseAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
  };

  const clearAudio = () => {
    if (audioURL) {
      URL.revokeObjectURL(audioURL);
    }

    setAudioURL(null);
    field.setValue(null);

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  return (
    <FieldWrapper>
      {label && <LabelArea label={label} htmlFor={id} required={required} />}

      <div className="w-full">
        {isRecording ? (
          <div className="p-4 border rounded-md">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div
                  className={`w-3 h-3 rounded-full ${isPaused ? 'bg-yellow-500' : 'bg-red-500 animate-pulse'}`}
                />
                <span className="text-sm font-medium">
                  {isPaused ? 'Gravação pausada' : 'Gravando...'}
                </span>
              </div>
              <span className="text-sm font-mono">
                {formatTime(recordingTime)}
              </span>
            </div>

            <Progress
              value={(recordingTime / maxDuration) * 100}
              className="h-2 mb-4"
            />

            <div className="flex justify-center gap-2">
              <Button
                type="button"
                variant={isPaused ? 'default' : 'outline'}
                size="sm"
                onClick={pauseRecording}
              >
                {isPaused ? (
                  <Play className="w-4 h-4 mr-1" />
                ) : (
                  <Pause className="w-4 h-4 mr-1" />
                )}
                {isPaused ? 'Continuar' : 'Pausar'}
              </Button>

              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={stopRecording}
              >
                <Square className="w-4 h-4 mr-1" />
                Parar
              </Button>
            </div>
          </div>
        ) : audioURL ? (
          <div className="p-4 border rounded-md">
            <audio
              ref={audioRef}
              src={audioURL}
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              className="hidden"
            />

            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Gravação</span>
              <span className="text-sm font-mono">
                {formatTime(currentTime)} / {formatTime(duration || 0)}
              </span>
            </div>

            <Progress
              value={duration ? (currentTime / duration) * 100 : 0}
              className="h-2 mb-4"
            />

            <div className="flex justify-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={audioRef.current?.paused ? playAudio : pauseAudio}
              >
                {audioRef.current?.paused ? (
                  <>
                    <Play className="w-4 h-4 mr-1" /> Reproduzir
                  </>
                ) : (
                  <>
                    <Pause className="w-4 h-4 mr-1" /> Pausar
                  </>
                )}
              </Button>

              <Button
                type="button"
                variant="default"
                size="sm"
                onClick={startRecording}
              >
                <Mic className="w-4 h-4 mr-1" />
                Nova gravação
              </Button>

              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={clearAudio}
              >
                <X className="w-4 h-4 mr-1" />
                Remover
              </Button>
            </div>
          </div>
        ) : (
          <div
            className="flex flex-col items-center justify-center gap-2 p-6 border-2 border-dashed rounded-md cursor-pointer hover:border-primary/50"
            onClick={startRecording}
          >
            <Mic className="w-10 h-10 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Clique para iniciar a gravação
            </p>
            <p className="text-xs text-muted-foreground">
              Máximo de {formatTime(maxDuration)}
            </p>
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

export default VoiceRecorderField;
