'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useAppForm } from '@/contexts/form-context';
import { useEffect } from 'react';

// Importando os componentes visuais
import { Button } from '../ui/button';

type AppearanceFormValues = {
  color: string;
  gradient: string;
  icon: string;
  emoji: string;
  avatar: File | null;
  theme: 'light' | 'dark' | string;
};

function VisualShowcaseForm() {
  const form = useAppForm({
    defaultValues: {
      color: '#6366F1',
      gradient: 'linear-gradient(to right, #6366F1, #EC4899)',
      icon: 'home',
      emoji: '😊',
      avatar: null,
      theme: 'light',
    } as AppearanceFormValues,
    onSubmit: async ({ value }) => {
      console.log('Form submitted:', value);
      return { status: 'success' as const };
    },
  });

  // Atualizar o título e descrição do showcase
  // useEffect(() => {
  //   const titleElement = document.getElementById('showcase-title');
  //   const descriptionElement = document.getElementById('showcase-description');

  //   if (titleElement) titleElement.textContent = 'Visual / Cor / Estética';
  //   if (descriptionElement)
  //     descriptionElement.textContent =
  //       'Componentes para seleção de cores, ícones e elementos visuais';
  // }, []);

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
            <CardTitle>Seletor de Cor</CardTitle>
            <CardDescription>Selecione uma cor</CardDescription>
          </CardHeader>
          <CardContent>
            <form.AppField
              name="color"
              children={(field) => (
                <field.ColorPickerField
                  id="color"
                  label="Cor"
                  description="Escolha uma cor"
                />
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Seletor de Gradiente</CardTitle>
            <CardDescription>Crie um gradiente personalizado</CardDescription>
          </CardHeader>
          <CardContent>
            <form.AppField
              name="gradient"
              children={(field) => (
                <field.GradientPickerField
                  id="gradient"
                  label="Gradiente"
                  description="Crie um gradiente personalizado"
                />
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Seletor de Ícone</CardTitle>
            <CardDescription>Escolha um ícone</CardDescription>
          </CardHeader>
          <CardContent>
            <form.AppField
              name="icon"
              children={(field) => (
                <field.IconPickerField
                  id="icon"
                  label="Ícone"
                  description="Selecione um ícone"
                />
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Seletor de Emoji</CardTitle>
            <CardDescription>Escolha um emoji</CardDescription>
          </CardHeader>
          <CardContent>
            <form.AppField
              name="emoji"
              children={(field) => (
                <field.EmojiPickerField
                  id="emoji"
                  label="Emoji"
                  description="Selecione um emoji"
                />
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upload de Avatar</CardTitle>
            <CardDescription>
              Faça upload de uma imagem de perfil
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form.AppField
              name="avatar"
              children={(field) => (
                <field.AvatarUploaderField
                  id="avatar"
                  label="Avatar"
                  description="Faça upload de uma imagem de perfil"
                />
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Seletor de Tema</CardTitle>
            <CardDescription>
              Escolha entre temas claro, escuro ou personalizado
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form.AppField
              name="theme"
              children={(field) => (
                <field.ThemeSelectorField
                  id="theme"
                  label="Tema"
                  description="Selecione um tema para a interface"
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

export default VisualShowcaseForm;
