'use client';

import { useFieldContext } from '@/contexts/form-context';
import { FieldError } from '@/components/form/fields/error';
import { LabelArea } from '@/components/form/fields/label';
import { FieldWrapper } from '@/components/form/fields/wrapper';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle, Check, RefreshCw } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface JsonInputProps {
  label?: string;
  id: string;
  description?: string;
  required?: boolean;
  height?: string;
}

const JsonInputComponent = ({
  label,
  id,
  description,
  required,
  height = '300px',
}: JsonInputProps) => {
  const field = useFieldContext<string>();
  const [jsonValue, setJsonValue] = useState<string>(field.state.value || '');
  const [isValid, setIsValid] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    if (field.state.value) {
      setJsonValue(field.state.value);
      validateJson(field.state.value);
    }
  }, [field.state.value]);

  const validateJson = (value: string): boolean => {
    if (!value.trim()) {
      setIsValid(true);
      setErrorMessage('');
      return true;
    }

    try {
      JSON.parse(value);
      setIsValid(true);
      setErrorMessage('');
      return true;
    } catch (error) {
      setIsValid(false);
      setErrorMessage((error as Error).message);
      return false;
    }
  };

  const handleChange = (value: string) => {
    setJsonValue(value);
    validateJson(value);

    // Só atualiza o valor do campo se o JSON for válido
    if (validateJson(value)) {
      field.setValue(value);
    }
  };

  const formatJson = () => {
    try {
      const parsed = JSON.parse(jsonValue);
      const formatted = JSON.stringify(parsed, null, 2);
      setJsonValue(formatted);
      field.setValue(formatted);
      setIsValid(true);
      setErrorMessage('');
    } catch (error) {
      // Não faz nada se o JSON for inválido
    }
  };

  return (
    <FieldWrapper>
      {label && <LabelArea label={label} htmlFor={id} required={required} />}

      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="relative">
            <Textarea
              id={id}
              value={jsonValue}
              onChange={(e) => handleChange(e.target.value)}
              className={`font-mono text-sm ${isValid ? '' : 'border-destructive'}`}
              style={{ height, resize: 'vertical' }}
              placeholder="{}"
            />
            <div className="absolute top-2 right-2 flex gap-1">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={formatJson}
                disabled={!isValid}
                className="h-6 w-6 rounded-full bg-background/80 backdrop-blur-sm"
                title="Formatar JSON"
              >
                <RefreshCw className="h-3 w-3" />
              </Button>
            </div>
          </div>

          {!isValid && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Erro de sintaxe JSON: {errorMessage}
              </AlertDescription>
            </Alert>
          )}

          {isValid && jsonValue.trim() && (
            <Alert
              variant="default"
              className="bg-green-50 text-green-800 border-green-200"
            >
              <Check className="h-4 w-4" />
              <AlertDescription>JSON válido</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {description && (
        <span className="text-sm text-muted-foreground">{description}</span>
      )}
      <FieldError />
    </FieldWrapper>
  );
};

export default JsonInputComponent;
