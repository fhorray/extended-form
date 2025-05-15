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

// Importando os componentes de sistema
import { Button } from '../ui/button';
import SubmitButtonField from '../form/fields/system/submit-button';
import ResetButtonField from '../form/fields/system/reset-button';
import ActionButtonField from '../form/fields/system/action-button';
import PreviewButtonField from '../form/fields/system/preview-button';
import SaveDraftButtonField from '../form/fields/system/save-draft-button';

type SystemShowcaseFormValues = {
  hiddenField: string;
  formData: {
    name: string;
    email: string;
    message: string;
  };
};

function SystemShowcaseForm() {
  const form = useAppForm({
    defaultValues: {
      hiddenField: 'valor-oculto-123',
      formData: {
        name: 'João Silva',
        email: 'joao@exemplo.com',
        message: 'Esta é uma mensagem de teste para o formulário.',
      },
    } as SystemShowcaseFormValues,
    onSubmit: async ({ value }) => {
      console.log('Form submitted:', value);
      return { status: 'success' as const };
    },
  });

  // Atualizar o título e descrição do showcase
  useEffect(() => {
    const titleElement = document.getElementById('showcase-title');
    const descriptionElement = document.getElementById('showcase-description');

    if (titleElement) titleElement.textContent = 'Sistema / Controle';
    if (descriptionElement)
      descriptionElement.textContent =
        'Componentes para controle e ações do formulário';
  }, []);

  const handleReset = () => {
    form.reset();
    console.log('Formulário resetado');
  };

  const handleAction = () => {
    console.log('Ação executada sem submeter o formulário');
    alert('Ação executada!');
  };

  const handlePreview = () => {
    console.log('Visualizando dados:', form.state.values);
    alert('Visualizando dados: ' + JSON.stringify(form.state.values, null, 2));
  };

  const handleSaveDraft = () => {
    const data = form.state.values;
    console.log('Rascunho salvo:', data);
    localStorage.setItem('formDraft', JSON.stringify(data));
    alert('Rascunho salvo com sucesso!');
  };

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
            <CardTitle>Input Oculto</CardTitle>
            <CardDescription>Campo oculto para dados internos</CardDescription>
          </CardHeader>
          <CardContent>
            <form.AppField
              name="hiddenField"
              children={(field) => <field.HiddenInputField id="hiddenField" />}
            />
            <div className="text-sm text-muted-foreground mt-2">
              Valor atual do campo oculto:{' '}
              <code>{form.getFieldValue('hiddenField')}</code>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Botão de Envio</CardTitle>
            <CardDescription>Botão para submeter o formulário</CardDescription>
          </CardHeader>
          <CardContent>
            <SubmitButtonField
              id="submitButton"
              label="Enviar Formulário"
              description="Clique para enviar os dados"
              isSubmitting={false}
              canSubmit={true}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Botão de Reset</CardTitle>
            <CardDescription>Botão para limpar o formulário</CardDescription>
          </CardHeader>
          <CardContent>
            <ResetButtonField
              id="resetButton"
              label="Limpar Formulário"
              description="Clique para limpar todos os campos"
              onReset={handleReset}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Botão de Ação</CardTitle>
            <CardDescription>
              Botão que não submete o formulário
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ActionButtonField
              id="actionButton"
              label="Executar Ação"
              description="Clique para executar uma ação sem submeter"
              onAction={handleAction}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Botão de Visualização</CardTitle>
            <CardDescription>Botão para visualizar os dados</CardDescription>
          </CardHeader>
          <CardContent>
            <PreviewButtonField
              id="previewButton"
              label="Visualizar Dados"
              description="Clique para ver os dados atuais"
              onPreview={handlePreview}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Botão de Salvar Rascunho</CardTitle>
            <CardDescription>
              Botão para salvar dados temporários
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SaveDraftButtonField
              id="saveDraftButton"
              label="Salvar Rascunho"
              description="Clique para salvar um rascunho"
              onSaveDraft={handleSaveDraft}
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

export default SystemShowcaseForm;
