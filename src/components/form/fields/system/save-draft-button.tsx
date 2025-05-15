'use client';

import { Button } from '@/components/ui/button';
import { FieldWrapper } from '@/components/form/fields/wrapper';
import { Save } from 'lucide-react';

interface SaveDraftButtonProps {
  id: string;
  label?: string;
  description?: string;
  onSaveDraft: () => void;
}

const SaveDraftButtonField = ({
  id,
  label = 'Salvar Rascunho',
  description,
  onSaveDraft,
}: SaveDraftButtonProps) => {
  return (
    <FieldWrapper>
      <Button
        id={id}
        type="button"
        variant="secondary"
        onClick={onSaveDraft}
        className="w-full"
      >
        <Save className="w-4 h-4 mr-2" />
        {label}
      </Button>
      {description && (
        <span className="text-sm text-muted-foreground">{description}</span>
      )}
    </FieldWrapper>
  );
};

export default SaveDraftButtonField;
