'use client';

import type React from 'react';
import { useFieldContext } from '@/contexts/form-context';
import { FieldError } from '@/components/form/fields/error';
import { LabelArea } from '@/components/form/fields/label';
import { FieldWrapper } from '@/components/form/fields/wrapper';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, GripVertical, XIcon } from 'lucide-react';
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

interface ArrayFieldProps {
  label?: string;
  id: string;
  description?: string;
  required?: boolean;
  itemLabel?: string;
  maxItems?: number;
}

interface SortableItemProps {
  id: string;
  index: number;
  value: string;
  onRemove: (index: number) => void;
  onUpdate: (index: number, value: string) => void;
}

const SortableItem = ({
  id,
  index,
  value,
  onRemove,
  onUpdate,
}: SortableItemProps) => {
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
      <Input
        id={`item-${id}`}
        value={value}
        onChange={(e) => onUpdate(index, e.target.value)}
        className="flex-1"
      />
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={() => onRemove(index)}
        className="text-destructive hover:text-destructive/80 hover:bg-destructive/10 transition-colors"
      >
        <XIcon className="h-4 w-4" />
      </Button>
    </div>
  );
};

const ArrayFieldComponent = ({
  label,
  id,
  description,
  required,
  itemLabel = 'Item',
  maxItems = 10,
}: ArrayFieldProps) => {
  const field = useFieldContext<string[]>();
  const items = field.state.value || [];

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const addItem = () => {
    if (items.length < maxItems) {
      const newItems = [...items, ''];
      field.setValue(newItems);
    }
  };

  const removeItem = (index: number) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    field.setValue(newItems);
  };

  const updateItem = (index: number, value: string) => {
    const newItems = [...items];
    newItems[index] = value;
    field.setValue(newItems);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex((_, i) => `item-${i}` === active.id);
      const newIndex = items.findIndex((_, i) => `item-${i}` === over.id);

      const newItems = arrayMove(items, oldIndex, newIndex);
      field.setValue(newItems);
    }
  };

  return (
    <FieldWrapper>
      {label && (
        <div className="flex items-center justify-between mb-2">
          <LabelArea label={label} htmlFor={id} required={required} />
          {maxItems > 0 && (
            <Badge variant="outline" className="text-xs font-normal">
              {items.length}/{maxItems} {itemLabel.toLowerCase()}s
            </Badge>
          )}
        </div>
      )}

      <div className="space-y-3">
        {items.length > 0 ? (
          <Card className="border border-border/50 shadow-sm">
            <CardContent className="p-4 space-y-2">
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={items.map((_, i) => `item-${i}`)}
                  strategy={verticalListSortingStrategy}
                >
                  {items.map((item, index) => (
                    <SortableItem
                      key={`item-${index}`}
                      id={`item-${index}`}
                      index={index}
                      value={item}
                      onRemove={removeItem}
                      onUpdate={updateItem}
                    />
                  ))}
                </SortableContext>
              </DndContext>
            </CardContent>
          </Card>
        ) : (
          <div className="text-center p-6 border border-dashed rounded-md text-muted-foreground bg-muted/30">
            Nenhum {itemLabel.toLowerCase()} adicionado
          </div>
        )}

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addItem}
          disabled={items.length >= maxItems}
          className="w-full group hover:border-primary/50 transition-colors"
        >
          <Plus className="h-4 w-4 mr-2 group-hover:text-primary transition-colors" />
          Adicionar {itemLabel}
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

export default ArrayFieldComponent;
