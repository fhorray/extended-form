'use client';

import { useFieldContext } from '@/contexts/form-context';
import { FieldError } from '@/components/form/fields/error';
import { LabelArea } from '@/components/form/fields/label';
import { FieldWrapper } from '@/components/form/fields/wrapper';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Check, RefreshCw, Copy, CheckCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

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
  const [copied, setCopied] = useState(false);

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

  const copyToClipboard = () => {
    if (jsonValue) {
      navigator.clipboard.writeText(jsonValue);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <FieldWrapper>
      {label && <LabelArea label={label} htmlFor={id} required={required} />}

      <Card className="shadow-sm border-border/50">
        <CardHeader className="p-3 pb-0 flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            JSON Editor
          </CardTitle>
          <div className="flex items-center gap-2">
            {isValid && jsonValue.trim() && (
              <Badge
                variant="outline"
                className="bg-green-50 text-green-700 border-green-200"
              >
                <Check className="h-3 w-3 mr-1" />
                Válido
              </Badge>
            )}
            <div className="flex">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={formatJson}
                disabled={!isValid}
                className="h-7 w-7 rounded-md hover:bg-muted transition-colors"
                title="Formatar JSON"
              >
                <RefreshCw className="h-3.5 w-3.5" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={copyToClipboard}
                disabled={!jsonValue.trim()}
                className="h-7 w-7 rounded-md hover:bg-muted transition-colors"
                title="Copiar JSON"
              >
                {copied ? (
                  <CheckCircle className="h-3.5 w-3.5 text-green-600" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-3">
          <div className="relative">
            <Textarea
              id={id}
              value={jsonValue}
              onChange={(e) => handleChange(e.target.value)}
              className={cn(
                'font-mono text-sm resize-vertical p-3 bg-muted/30 border-muted',
                isValid
                  ? ''
                  : 'border-destructive focus-visible:ring-destructive/30',
              )}
              style={{ height, minHeight: '120px' }}
              placeholder="{}"
            />
          </div>

          {!isValid && (
            <Alert variant="destructive" className="mt-3 py-2 text-sm">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="ml-2">
                Erro de sintaxe JSON: {errorMessage}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {description && (
        <span className="text-sm text-muted-foreground mt-2 block">
          {description}
        </span>
      )}
      <FieldError />
    </FieldWrapper>
  );
};

export default JsonInputComponent;
