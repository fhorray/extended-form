'use client';

import { useAppForm, withForm } from '@/contexts/form-context';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useEffect } from 'react';

// Importando os componentes de upload
import FileUploadField from '@/components/form/fields/media/file-upload';
import ImageUploadField from '@/components/form/fields/media/image-upload';
import VideoUploadField from '@/components/form/fields/media/video-upload';
import AudioUploadField from '@/components/form/fields/media/audio-upload';
import DocumentUploadField from '@/components/form/fields/media/document-upload';
import DragDropUploadField from '@/components/form/fields/media/drag-drop-upload';
import MultipleFilesUploadField from '@/components/form/fields/media/multiple-files-upload';
import FileReorderField from '@/components/form/fields/media/file-reorder';
import WebcamCaptureField from '@/components/form/fields/media/webcam-capture';
import VoiceRecorderField from '@/components/form/fields/media/voice-recorder';
import { Button } from '@/components/ui/button';

type MediaFormValues = {
  singleFile: File | null;
  image: File | null;
  video: File | null;
  audio: File | null;
  document: File | null;
  dragDropFiles: File[];
  multipleFiles: File[];
  reorderFiles: {
    id: string;
    name: string;
    url: string;
  }[];
  webcamImage: File | null;
  voiceRecording: File | null;
};

function UploadsShowcaseForm() {
  const form = useAppForm({
    defaultValues: {
      singleFile: null,
      image: null,
      video: null,
      audio: null,
      document: null,
      dragDropFiles: [],
      multipleFiles: [],
      reorderFiles: [
        {
          id: '1',
          name: 'arquivo1.pdf',
          url: '/placeholder.svg?height=100&width=100',
        },
        {
          id: '2',
          name: 'arquivo2.jpg',
          url: '/placeholder.svg?height=100&width=100',
        },
        {
          id: '3',
          name: 'arquivo3.png',
          url: '/placeholder.svg?height=100&width=100',
        },
      ],
      webcamImage: null,
      voiceRecording: null,
    } as MediaFormValues,
    onSubmit: async (values) => {
      console.log('Form submitted:', values);
      return { status: 'success' as const };
    },
  });

  // Atualizar o título e descrição do showcase
  useEffect(() => {
    const titleElement = document.getElementById('showcase-title');
    const descriptionElement = document.getElementById('showcase-description');

    if (titleElement) titleElement.textContent = 'Uploads e Mídia';
    if (descriptionElement)
      descriptionElement.textContent =
        'Componentes para upload e manipulação de arquivos';
  }, []);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className="space-y-8"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Upload de Arquivo</CardTitle>
            <CardDescription>Upload de arquivo genérico</CardDescription>
          </CardHeader>
          <CardContent>
            <form.AppField
              name="singleFile"
              children={(field) => (
                <field.FileUploadField
                  id="singleFile"
                  label="Arquivo"
                  accept="*/*"
                  description="Selecione qualquer tipo de arquivo"
                />
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upload de Imagem</CardTitle>
            <CardDescription>Upload específico para imagens</CardDescription>
          </CardHeader>
          <CardContent>
            <form.AppField
              name="image"
              children={(field) => (
                <field.ImageUploadField
                  id="image"
                  label="Imagem"
                  description="Selecione uma imagem (JPG, PNG, GIF)"
                />
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upload de Vídeo</CardTitle>
            <CardDescription>Upload específico para vídeos</CardDescription>
          </CardHeader>
          <CardContent>
            <form.AppField
              name="video"
              children={(field) => (
                <field.VideoUploadField
                  id="video"
                  label="Vídeo"
                  description="Selecione um arquivo de vídeo"
                />
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upload de Áudio</CardTitle>
            <CardDescription>Upload específico para áudios</CardDescription>
          </CardHeader>
          <CardContent>
            <form.AppField
              name="audio"
              children={(field) => (
                <field.AudioUploadField
                  id="audio"
                  label="Áudio"
                  description="Selecione um arquivo de áudio"
                />
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upload de Documento</CardTitle>
            <CardDescription>Upload específico para documentos</CardDescription>
          </CardHeader>
          <CardContent>
            <form.AppField
              name="document"
              children={(field) => (
                <field.DocumentUploadField
                  id="document"
                  label="Documento"
                  description="Selecione um documento (PDF, DOC, etc)"
                />
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Drag & Drop Upload</CardTitle>
            <CardDescription>
              Arraste e solte arquivos para upload
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form.AppField
              name="dragDropFiles"
              children={(field) => (
                <field.DragDropUploadField
                  id="dragDropFiles"
                  label="Arquivos"
                  description="Arraste e solte arquivos aqui"
                />
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upload Múltiplo</CardTitle>
            <CardDescription>Upload de múltiplos arquivos</CardDescription>
          </CardHeader>
          <CardContent>
            <form.AppField
              name="multipleFiles"
              children={(field) => (
                <field.MultipleFilesUploadField
                  id="multipleFiles"
                  label="Múltiplos Arquivos"
                  description="Selecione vários arquivos"
                />
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Reordenação de Arquivos</CardTitle>
            <CardDescription>Arraste para reordenar arquivos</CardDescription>
          </CardHeader>
          <CardContent>
            <form.AppField
              name="reorderFiles"
              children={(field) => (
                <field.FileReorderField
                  id="reorderFiles"
                  label="Reordenar Arquivos"
                  description="Arraste para reordenar"
                />
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Captura de Webcam</CardTitle>
            <CardDescription>Tire uma foto usando a webcam</CardDescription>
          </CardHeader>
          <CardContent>
            <form.AppField
              name="webcamImage"
              children={(field) => (
                <field.WebcamCaptureField
                  id="webcamImage"
                  label="Captura de Webcam"
                  description="Tire uma foto com sua webcam"
                />
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Gravador de Voz</CardTitle>
            <CardDescription>Grave áudio pelo navegador</CardDescription>
          </CardHeader>
          <CardContent>
            <form.AppField
              name="voiceRecording"
              children={(field) => (
                <field.VoiceRecorderField
                  id="voiceRecording"
                  label="Gravação de Voz"
                  description="Grave um áudio pelo navegador"
                />
              )}
            />
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end">
        <Button type="submit" className="w-full md:w-auto">
          Enviar Formulário
        </Button>
      </div>
    </form>
  );
}

export default UploadsShowcaseForm;

// export default withForm(UploadsShowcaseForm);
