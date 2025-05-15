'use client';

import { useFieldContext } from '@/contexts/form-context';
import { Button } from '@/components/ui/button';
import { FieldError } from '@/components/form/fields/error';
import { LabelArea } from '@/components/form/fields/label';
import { FieldWrapper } from '@/components/form/fields/wrapper';
import { Camera, X, RefreshCw } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

interface WebcamCaptureProps {
  label?: string;
  id: string;
  description?: string;
  required?: boolean;
}

const WebcamCaptureField = ({
  label,
  id,
  description,
  required,
}: WebcamCaptureProps) => {
  const field = useFieldContext<string | null>();
  const [image, setImage] = useState<string | null>(field.state.value || null);
  const [isCapturing, setIsCapturing] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (field.state.value) {
      setImage(field.state.value);
    }
  }, [field.state.value]);

  const startCamera = async () => {
    setIsCapturing(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' },
        audio: false,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error('Erro ao acessar a webcam:', err);
      setIsCapturing(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      const tracks = stream.getTracks();

      tracks.forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }

    setIsCapturing(false);
  };

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        const imageData = canvas.toDataURL('image/png');
        setImage(imageData);
        field.setValue(imageData);

        stopCamera();
      }
    }
  };

  const clearImage = () => {
    setImage(null);
    field.setValue(null);
  };

  return (
    <FieldWrapper>
      {label && <LabelArea label={label} htmlFor={id} required={required} />}

      <div className="w-full">
        {isCapturing ? (
          <div className="relative">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full rounded-md border aspect-video object-cover"
            />

            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
              <Button
                type="button"
                onClick={captureImage}
                className="bg-primary/90 hover:bg-primary"
              >
                <Camera className="w-4 h-4 mr-2" />
                Capturar
              </Button>

              <Button
                type="button"
                variant="secondary"
                onClick={stopCamera}
                className="bg-secondary/90 hover:bg-secondary"
              >
                <X className="w-4 h-4 mr-2" />
                Cancelar
              </Button>
            </div>

            <canvas ref={canvasRef} className="hidden" />
          </div>
        ) : image ? (
          <div className="relative">
            <div className="relative aspect-video w-full overflow-hidden rounded-md border">
              <img
                src={image || '/placeholder.svg'}
                alt="Foto capturada"
                className="object-cover"
              />
            </div>

            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
              <Button
                type="button"
                onClick={startCamera}
                className="bg-primary/90 hover:bg-primary"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Nova foto
              </Button>

              <Button
                type="button"
                variant="destructive"
                onClick={clearImage}
                className="bg-destructive/90 hover:bg-destructive"
              >
                <X className="w-4 h-4 mr-2" />
                Remover
              </Button>
            </div>
          </div>
        ) : (
          <div
            className="flex flex-col items-center justify-center gap-2 p-6 border-2 border-dashed rounded-md cursor-pointer hover:border-primary/50"
            onClick={startCamera}
          >
            <Camera className="w-10 h-10 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Clique para ativar a câmera
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

export default WebcamCaptureField;
