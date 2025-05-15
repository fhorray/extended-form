'use client';

import type React from 'react';

import { useFieldContext } from '@/contexts/form-context';
import { FieldError } from '@/components/form/fields/error';
import { LabelArea } from '@/components/form/fields/label';
import { FieldWrapper } from '@/components/form/fields/wrapper';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, X, GripVertical } from 'lucide-react';

interface ArrayFieldProps {
  label?: string;
  id: string;
  description?: string;
  required?: boolean;
  itemLabel?: string;
  maxItems?: number;
}

const ArrayFieldComponent = ({
  label,
  id,
  description,
  required,
  itemLabel = 'Item',
  maxItems = 10,
}: ArrayFieldProps) => {
  const field = useFieldContext<string[]>();
  const [items, setItems] = useState<string[]>(field.state.value || []);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  useEffect(() => {
    if (field.state.value) {
      setItems(field.state.value);
    }
  }, [field.state.value]);

  const addItem = () => {
    if (items.length < maxItems) {
      const newItems = [...items, ''];
      setItems(newItems);
      field.setValue(newItems);
    }
  };

  const removeItem = (index: number) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
    field.setValue(newItems);
  };

  const updateItem = (index: number, value: string) => {
    const newItems = [...items];
    newItems[index] = value;
    setItems(newItems);
    field.setValue(newItems);
  };

  const handleDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    index: number,
  ) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    // Necessário para o Firefox
    e.dataTransfer.setData('text/plain', index.toString());
  };

  const handleDragOver = (
    e: React.DragEvent<HTMLDivElement>,
    index: number,
  ) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (
    e: React.DragEvent<HTMLDivElement>,
    targetIndex: number,
  ) => {
    e.preventDefault();

    if (draggedIndex === null) return;

    const newItems = [...items];
    const [movedItem] = newItems.splice(draggedIndex, 1);
    newItems.splice(targetIndex, 0, movedItem);

    setItems(newItems);
    field.setValue(newItems);
    setDraggedIndex(null);
  };

  return (
    <FieldWrapper>
      {label && <LabelArea label={label} htmlFor={id} required={required} />}

      <div className="space-y-3">
        {items.length > 0 ? (
          <Card>
            <CardContent className="pt-6 space-y-3">
              {items.map((item, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-2 ${draggedIndex === index ? 'opacity-50' : ''}`}
                  draggable
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDrop={(e) => handleDrop(e, index)}
                >
                  <div className="cursor-move p-2">
                    <GripVertical className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <Input
                    id={`${id}-${index}`}
                    value={item}
                    onChange={(e) => updateItem(index, e.target.value)}
                    placeholder={`${itemLabel} ${index + 1}`}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeItem(index)}
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
            Nenhum {itemLabel.toLowerCase()} adicionado
          </div>
        )}

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addItem}
          disabled={items.length >= maxItems}
          className="w-full"
        >
          <Plus className="h-4 w-4 mr-2" />
          Adicionar {itemLabel}
          {maxItems > 0 && ` (${items.length}/${maxItems})`}
        </Button>
      </div>

      {description && (
        <span className="text-sm text-muted-foreground">{description}</span>
      )}
      <FieldError />
    </FieldWrapper>
  );
};

export default ArrayFieldComponent;
