'use client';

import { useFieldContext } from '@/contexts/form-context';
import { FieldError } from '@/components/form/fields/error';
import { LabelArea } from '@/components/form/fields/label';
import { FieldWrapper } from '@/components/form/fields/wrapper';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, X } from 'lucide-react';

interface KeyValuePair {
  key: string;
  value: string;
}

interface KeyValuePairEditorProps {
  label?: string;
  id: string;
  description?: string;
  required?: boolean;
  maxPairs?: number;
}

const KeyValuePairEditorComponent = ({
  label,
  id,
  description,
  required,
  maxPairs = 10,
}: KeyValuePairEditorProps) => {
  const field = useFieldContext<KeyValuePair[]>();
  const [pairs, setPairs] = useState<KeyValuePair[]>(field.state.value || []);

  useEffect(() => {
    if (field.state.value) {
      setPairs(field.state.value);
    }
  }, [field.state.value]);

  const addPair = () => {
    if (pairs.length < maxPairs) {
      const newPairs = [...pairs, { key: '', value: '' }];
      setPairs(newPairs);
      field.setValue(newPairs);
    }
  };

  const removePair = (index: number) => {
    const newPairs = [...pairs];
    newPairs.splice(index, 1);
    setPairs(newPairs);
    field.setValue(newPairs);
  };

  const updatePair = (index: number, field: 'key' | 'value', value: string) => {
    const newPairs = [...pairs];
    newPairs[index][field] = value;
    setPairs(newPairs);
    field.setValue(newPairs);
  };

  return (
    <FieldWrapper>
      {label && <LabelArea label={label} htmlFor={id} required={required} />}

      <div className="space-y-3">
        {pairs.length > 0 ? (
          <Card>
            <CardContent className="pt-6 space-y-4">
              {pairs.map((pair, index) => (
                <div
                  key={index}
                  className="grid grid-cols-[1fr,1fr,auto] gap-2 items-center"
                >
                  <Input
                    placeholder="Chave"
                    value={pair.key}
                    onChange={(e) => updatePair(index, 'key', e.target.value)}
                  />
                  <Input
                    placeholder="Valor"
                    value={pair.value}
                    onChange={(e) => updatePair(index, 'value', e.target.value)}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removePair(index)}
                    className="text-destructive"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        ) : (
          <div className="text-center p-4 border rounded-md text-muted-foreground">
            Nenhum par chave-valor adicionado
          </div>
        )}

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addPair}
          disabled={pairs.length >= maxPairs}
          className="w-full"
        >
          <Plus className="h-4 w-4 mr-2" />
          Adicionar par chave-valor
          {maxPairs > 0 && ` (${pairs.length}/${maxPairs})`}
        </Button>
      </div>

      {description && (
        <span className="text-sm text-muted-foreground">{description}</span>
      )}
      <FieldError />
    </FieldWrapper>
  );
};

export default KeyValuePairEditorComponent;
