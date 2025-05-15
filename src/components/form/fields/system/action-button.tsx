'use client';

import type React from 'react';

import { Button } from '@/components/ui/button';
import { FieldWrapper } from '@/components/form/fields/wrapper';
import { Zap } from 'lucide-react';

interface ActionButtonProps {
  id: string;
  label?: string;
  description?: string;
  onAction: () => void;
  icon?: React.ReactNode;
}

const ActionButtonField = ({
  id,
  label = 'Executar',
  description,
  onAction,
  icon,
}: ActionButtonProps) => {
  return (
    <FieldWrapper>
      <Button id={id} type="button" onClick={onAction} className="w-full">
        {icon || <Zap className="w-4 h-4 mr-2" />}
        {label}
      </Button>
      {description && (
        <span className="text-sm text-muted-foreground">{description}</span>
      )}
    </FieldWrapper>
  );
};

export default ActionButtonField;
