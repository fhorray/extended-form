'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useAppForm } from '@/contexts/form-context';

// Importando os componentes de campos complexos
import { Button } from '../ui/button';

type ComplexFormValues = {
  person: {
    name: string;
    age: number;
    email: string;
  };
  hobbies: string[];
  employees: {
    id: number;
    name: string;
    department: string;
    salary: number;
  }[];
  metadata: {
    key: string;
    value: string;
  }[];
  configJson: string; // JSON stringified object
  sections: {
    id: string;
    type: 'contact' | 'address' | string;
    fields:
      | { email: string; phone: string }
      | { street: string; number: string; city: string }
      | Record<string, any>; // fallback
  }[];
};

function ComplexFieldsShowcaseForm() {
  const form = useAppForm({
    defaultValues: {
      person: {
        name: 'João Silva',
        age: 30,
        email: 'joao@exemplo.com',
        phone: 'option-1',
      },
      hobbies: ['Leitura', 'Ciclismo', 'Fotografia'],
      employees: [
        { id: 1, name: 'Ana Santos', department: 'Marketing', salary: 5000 },
        { id: 2, name: 'Carlos Oliveira', department: 'TI', salary: 6000 },
        { id: 3, name: 'Mariana Costa', department: 'RH', salary: 4500 },
      ],
      metadata: [
        { key: 'author', value: 'João Silva' },
        { key: 'created_at', value: '2023-05-15' },
      ],
      configJson: JSON.stringify(
        { theme: 'dark', notifications: true, language: 'pt-BR' },
        null,
        2,
      ),
      sections: [
        {
          id: '1',
          type: 'contact',
          fields: { email: 'contato@exemplo.com', phone: '(11) 98765-4321' },
        },
        {
          id: '2',
          type: 'address',
          fields: { street: 'Av. Paulista', number: '1000', city: 'São Paulo' },
        },
      ],
    } as ComplexFormValues,
    onSubmit: async ({ value }) => {
      console.log('Form submitted:', value);
      return { status: 'success' as const };
    },
  });

  // Atualizar o título e descrição do showcase
  // useEffect(() => {
  //   const titleElement = document.getElementById('showcase-title');
  //   const descriptionElement = document.getElementById('showcase-description');

  //   if (titleElement) titleElement.textContent = 'Campos Compostos e Complexos';
  //   if (descriptionElement)
  //     descriptionElement.textContent =
  //       'Componentes para manipulação de dados estruturados complexos';
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
      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Campo de Objeto</CardTitle>
            <CardDescription>Subformulário para objetos</CardDescription>
          </CardHeader>
          <CardContent>
            <form.AppField
              name="person"
              children={(field) => (
                <field.ObjectFieldComponent
                  id="person"
                  label="Pessoa"
                  description="Dados da pessoa"
                  fields={[
                    { name: 'name', label: 'Nome', type: 'text' },
                    { name: 'age', label: 'Idade', type: 'number' },
                    { name: 'email', label: 'Email', type: 'email' },
                    {
                      name: 'phone',
                      label: 'Phone',
                      type: 'select',
                      options: [
                        {
                          label: 'Option 1',
                          value: 'option-1',
                        },
                        {
                          label: 'Option 2',
                          value: 'option-2',
                        },
                      ],
                      required: true,
                    },
                  ]}
                />
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Campo de Array</CardTitle>
            <CardDescription>Repetidor de campos</CardDescription>
          </CardHeader>
          <CardContent>
            <form.AppField
              name="hobbies"
              children={(field) => (
                <field.ArrayFieldComponent
                  id="hobbies"
                  label="Hobbies"
                  description="Lista de hobbies"
                  itemLabel="Hobby"
                />
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Campo de Tabela</CardTitle>
            <CardDescription>Edição inline de tabelas</CardDescription>
          </CardHeader>
          <CardContent>
            <form.AppField
              name="employees"
              children={(field) => (
                <field.TableFieldComponent
                  id="employees"
                  label="Funcionários"
                  description="Lista de funcionários"
                  columns={[
                    { key: 'name', header: 'Nome', type: 'text' },
                    {
                      key: 'department',
                      header: 'Departamento',
                      type: 'text',
                    },
                    { key: 'salary', header: 'Salário', type: 'currency' },
                  ]}
                />
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Editor de Pares Chave-Valor</CardTitle>
            <CardDescription>Campo de dicionário</CardDescription>
          </CardHeader>
          <CardContent>
            <form.AppField
              name="metadata"
              children={(field) => (
                <field.KeyValuePairEditorComponent
                  id="metadata"
                  label="Metadados"
                  description="Pares de chave-valor para metadados"
                />
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Input JSON</CardTitle>
            <CardDescription>Editor de JSON com formatação</CardDescription>
          </CardHeader>
          <CardContent>
            <form.AppField
              name="configJson"
              children={(field) => (
                <field.JsonInputComponent
                  id="configJson"
                  label="Configuração JSON"
                  description="Edite a configuração em formato JSON"
                />
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Seções Dinâmicas de Formulário</CardTitle>
            <CardDescription>
              Adicionar/remover grupos de campos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form.AppField
              name="sections"
              children={(field) => (
                <field.DynamicFormSectionsComponent
                  id="sections"
                  label="Seções do Formulário"
                  description="Adicione ou remova seções do formulário"
                  sectionTypes={[
                    {
                      type: 'contact',
                      label: 'Contato',
                      fields: [
                        { name: 'email', label: 'Email', type: 'email' },
                        { name: 'phone', label: 'Telefone', type: 'text' },
                      ],
                    },
                    {
                      type: 'address',
                      label: 'Endereço',
                      fields: [
                        { name: 'street', label: 'Rua', type: 'text' },
                        { name: 'number', label: 'Número', type: 'text' },
                        { name: 'city', label: 'Cidade', type: 'text' },
                      ],
                    },
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

export default ComplexFieldsShowcaseForm;
