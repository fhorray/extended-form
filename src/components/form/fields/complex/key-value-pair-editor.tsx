'use client';

import { useFieldContext } from '@/contexts/form-context';
import { FieldError } from '@/components/form/fields/error';
import { LabelArea } from '@/components/form/fields/label';
import { FieldWrapper } from '@/components/form/fields/wrapper';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, X, GripVertical } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { cn } from '@/lib/utils';

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

interface SortableItemProps {
  id: string;
  pair: KeyValuePair;
  onRemove: () => void;
  onUpdate: (field: 'key' | 'value', value: string) => void;
}

const SortableItem = ({ id, pair, onRemove, onUpdate }: SortableItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'flex items-center gap-2 p-2 rounded-md',
        isDragging ? 'bg-muted/50 shadow-md z-10' : '',
        'transition-all duration-200',
      )}
    >
      <div
        className="cursor-move p-2 rounded-md hover:bg-muted transition-colors"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="grid grid-cols-2 gap-2 flex-1">
        <Input
          placeholder="Chave"
          value={pair.key}
          onChange={(e) => onUpdate('key', e.target.value)}
          className="flex-1"
        />
        <Input
          placeholder="Valor"
          value={pair.value}
          onChange={(e) => onUpdate('value', e.target.value)}
          className="flex-1"
        />
      </div>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={onRemove}
        className="text-destructive hover:text-destructive/80 hover:bg-destructive/10 transition-colors"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
};

const KeyValuePairEditorComponent = ({
  label,
  id,
  description,
  required,
  maxPairs = 10,
}: KeyValuePairEditorProps) => {
  const field = useFieldContext<KeyValuePair[]>();
  const [pairs, setPairs] = useState<KeyValuePair[]>(field.state.value || []);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

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

  const updatePair = (
    index: number,
    fieldData: 'key' | 'value',
    value: string,
  ) => {
    const newPairs = [...pairs];
    newPairs[index][fieldData] = value;
    setPairs(newPairs);
    field.setValue(newPairs);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = parseInt(active.id.toString().split('-')[1]);
      const newIndex = parseInt(over.id.toString().split('-')[1]);

      const newPairs = arrayMove(pairs, oldIndex, newIndex);
      setPairs(newPairs);
      field.setValue(newPairs);
    }
  };

  return (
    <FieldWrapper>
      {label && (
        <div className="flex items-center justify-between mb-2">
          <LabelArea label={label} htmlFor={id} required={required} />
          {maxPairs > 0 && (
            <Badge variant="outline" className="text-xs font-normal">
              {pairs.length}/{maxPairs} pares
            </Badge>
          )}
        </div>
      )}

      <div className="space-y-3">
        {pairs.length > 0 ? (
          <Card className="border border-border/50 shadow-sm">
            <CardHeader className="p-3 pb-0">
              <CardTitle className="text-sm font-medium text-muted-foreground flex justify-between">
                <span>Chave</span>
                <span>Valor</span>
                <span className="w-8"></span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 space-y-2">
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={pairs.map((_, i) => `pair-${i}`)}
                  strategy={verticalListSortingStrategy}
                >
                  {pairs.map((pair, index) => (
                    <SortableItem
                      key={`pair-${index}`}
                      id={`pair-${index}`}
                      pair={pair}
                      onRemove={() => removePair(index)}
                      onUpdate={(field, value) =>
                        updatePair(index, field, value)
                      }
                    />
                  ))}
                </SortableContext>
              </DndContext>
            </CardContent>
          </Card>
        ) : (
          <div className="text-center p-6 border border-dashed rounded-md text-muted-foreground bg-muted/30">
            Nenhum par chave-valor adicionado
          </div>
        )}

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addPair}
          disabled={pairs.length >= maxPairs}
          className="w-full group hover:border-primary/50 transition-colors"
        >
          <Plus className="h-4 w-4 mr-2 group-hover:text-primary transition-colors" />
          Adicionar par chave-valor
        </Button>
      </div>

      {description && (
        <span className="text-sm text-muted-foreground mt-2 block">
          {description}
        </span>
      )}
      <FieldError />
    </FieldWrapper>
  );
};

export default KeyValuePairEditorComponent;
