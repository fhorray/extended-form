'use client';

import { Button } from '@/components/ui/button';
import { FieldWrapper } from '@/components/form/fields/wrapper';
import { RefreshCw } from 'lucide-react';

interface ResetButtonProps {
  id: string;
  label?: string;
  description?: string;
  onReset: () => void;
}

const ResetButtonField = ({
  id,
  label = 'Limpar',
  description,
  onReset,
}: ResetButtonProps) => {
  return (
    <FieldWrapper>
      <Button
        id={id}
        type="button"
        variant="outline"
        onClick={onReset}
        className="w-full"
      >
        <RefreshCw className="w-4 h-4 mr-2" />
        {label}
      </Button>
      {description && (
        <span className="text-sm text-muted-foreground">{description}</span>
      )}
    </FieldWrapper>
  );
};

export default ResetButtonField;
