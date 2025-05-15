'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useAppForm } from '@/contexts/form-context';

// Importando os componentes interativos
import { Button } from '../ui/button';

type AdvancedFormValues = {
  rating: number;
  likeDislike: 'like' | 'dislike' | ''; // Inclui '' para estado inicial vazio, se necessário
  progress: number;
  slider: number;
  captcha: string;
  password: string;
  autoSuggest: string;
  wizard: {
    step1: string;
    step2: string;
    step3: string;
  };
  country: string;
  state: string;
};

function InteractiveShowcaseForm() {
  const form = useAppForm({
    defaultValues: {
      rating: 4,
      likeDislike: 'like',
      progress: 65,
      slider: 50,
      captcha: '',
      password: '',
      autoSuggest: '',
      wizard: { step1: '', step2: '', step3: '' },
      country: 'Brasil',
      state: '',
    } as AdvancedFormValues,
    onSubmit: async ({ value }) => {
      console.log('Form submitted:', value);
      return { status: 'success' as const };
    },
  });

  // Atualizar o título e descrição do showcase
  // useEffect(() => {
  //   const titleElement = document.getElementById('showcase-title');
  //   const descriptionElement = document.getElementById('showcase-description');

  //   if (titleElement) titleElement.textContent = 'Interativos / UX Avançado';
  //   if (descriptionElement)
  //     descriptionElement.textContent =
  //       'Componentes interativos com experiência de usuário avançada';
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
            <CardTitle>Input de Avaliação</CardTitle>
            <CardDescription>
              Avaliação com estrelas ou corações
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form.AppField
              name="rating"
              children={(field) => (
                <field.RatingInputField
                  id="rating"
                  label="Avaliação"
                  description="Avalie de 1 a 5 estrelas"
                  maxRating={5}
                  icon="star"
                />
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Botões de Curtir/Não Curtir</CardTitle>
            <CardDescription>Botões para feedback simples</CardDescription>
          </CardHeader>
          <CardContent>
            <form.AppField
              name="likeDislike"
              children={(field) => (
                <field.LikeDislikeField
                  id="likeDislike"
                  label="Feedback"
                  description="Você gostou deste conteúdo?"
                />
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Barra de Progresso</CardTitle>
            <CardDescription>Input visual de progresso</CardDescription>
          </CardHeader>
          <CardContent>
            <form.AppField
              name="progress"
              children={(field) => (
                <field.ProgressBarField
                  id="progress"
                  label="Progresso"
                  description="Defina o nível de progresso"
                />
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Input Slider</CardTitle>
            <CardDescription>Valores discretos ou contínuos</CardDescription>
          </CardHeader>
          <CardContent>
            <form.AppField
              name="slider"
              children={(field) => (
                <field.SliderInputField
                  id="slider"
                  label="Slider"
                  description="Ajuste o valor deslizando"
                  min={0}
                  max={100}
                  step={1}
                />
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Captcha</CardTitle>
            <CardDescription>Verificação de segurança</CardDescription>
          </CardHeader>
          <CardContent>
            <form.AppField
              name="captcha"
              children={(field) => (
                <field.CaptchaField
                  id="captcha"
                  label="Captcha"
                  description="Confirme que você não é um robô"
                />
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Medidor de Força de Senha</CardTitle>
            <CardDescription>Avalia a segurança da senha</CardDescription>
          </CardHeader>
          <CardContent>
            <form.AppField
              name="password"
              children={(field) => (
                <field.PasswordStrengthField
                  id="password"
                  label="Senha"
                  description="Digite uma senha forte"
                />
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Input com Autosugestão</CardTitle>
            <CardDescription>Sugestões automáticas ao digitar</CardDescription>
          </CardHeader>
          <CardContent>
            <form.AppField
              name="autoSuggest"
              children={(field) => (
                <field.AutoSuggestField
                  id="autoSuggest"
                  label="Busca"
                  description="Digite para ver sugestões"
                  suggestions={[
                    'Apple',
                    'Banana',
                    'Orange',
                    'Strawberry',
                    'Grape',
                    'Pineapple',
                    'Mango',
                  ]}
                />
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Formulário em Etapas</CardTitle>
            <CardDescription>Wizard / Multi-Step Form</CardDescription>
          </CardHeader>
          <CardContent>
            <form.AppField
              name="wizard"
              children={(field) => (
                <field.WizardFormField
                  id="wizard"
                  label="Formulário em Etapas"
                  description="Complete o formulário passo a passo"
                  steps={[
                    { id: 'step1', label: 'Informações Pessoais' },
                    { id: 'step2', label: 'Endereço' },
                    { id: 'step3', label: 'Confirmação' },
                  ]}
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

export default InteractiveShowcaseForm;
