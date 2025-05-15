'use client';

import { Button } from '@/components/ui/button';
import { FieldWrapper } from '@/components/form/fields/wrapper';
import { Eye } from 'lucide-react';

interface PreviewButtonProps {
  id: string;
  label?: string;
  description?: string;
  onPreview: () => void;
}

const PreviewButtonField = ({
  id,
  label = 'Visualizar',
  description,
  onPreview,
}: PreviewButtonProps) => {
  return (
    <FieldWrapper>
      <Button
        id={id}
        type="button"
        variant="outline"
        onClick={onPreview}
        className="w-full"
      >
        <Eye className="w-4 h-4 mr-2" />
        {label}
      </Button>
      {description && (
        <span className="text-sm text-muted-foreground">{description}</span>
      )}
    </FieldWrapper>
  );
};

export default PreviewButtonField;
