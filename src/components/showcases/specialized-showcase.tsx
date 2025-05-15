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

// Importando os componentes especializados
import { Button } from '../ui/button';

function SpecializedShowcaseForm() {
  const form = useAppForm({
    defaultValues: {
      otp: '',
      creditCard: { number: '', expiry: '', cvc: '' },
      iban: '',
      ssn: '',
      licensePlate: '',
      barcode: '',
      customField: '',
    },
    onSubmit: async ({ value }) => {
      console.log('Form submitted:', value);
      return { status: 'success' as const };
    },
  });

  // Atualizar o título e descrição do showcase
  useEffect(() => {
    const titleElement = document.getElementById('showcase-title');
    const descriptionElement = document.getElementById('showcase-description');

    if (titleElement)
      titleElement.textContent = 'Especializados / Casos Específicos';
    if (descriptionElement)
      descriptionElement.textContent =
        'Componentes para casos de uso específicos e especializados';
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
            <CardTitle>Input OTP</CardTitle>
            <CardDescription>
              One-Time Password, campo separado por dígitos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form.AppField
              name="otp"
              children={(field) => (
                <field.OtpInputField
                  id="otp"
                  label="Código OTP"
                  description="Digite o código de verificação"
                  length={6}
                />
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Input de Cartão de Crédito</CardTitle>
            <CardDescription>Número, validade e CVC</CardDescription>
          </CardHeader>
          <CardContent>
            <form.AppField
              name="creditCard"
              children={(field) => (
                <field.CreditCardInputField
                  id="creditCard"
                  label="Cartão de Crédito"
                  description="Insira os dados do cartão"
                />
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Input SSN</CardTitle>
            <CardDescription>Social Security Number</CardDescription>
          </CardHeader>
          <CardContent>
            <form.AppField
              name="ssn"
              children={(field) => (
                <field.SsnInputField
                  id="ssn"
                  label="CPF/SSN"
                  description="Insira o número de identificação"
                />
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Input com Validador Personalizado</CardTitle>
            <CardDescription>Campo com validação externa</CardDescription>
          </CardHeader>
          <CardContent>
            <form.AppField
              name="customField"
              children={(field) => (
                <field.CustomValidatorInputField
                  id="customField"
                  label="Campo Personalizado"
                  description="Campo com validação personalizada"
                  validationRules={[
                    {
                      pattern: /^[A-Z]{3}-\d{4}$/,
                      message: 'Formato deve ser XXX-0000',
                    },
                  ]}
                  placeholder="ABC-1234"
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
export default SpecializedShowcaseForm;

// export default withForm(SpecializedShowcaseForm);
