'use client';

import { useFieldContext } from '@/contexts/form-context';

export const FieldError = () => {
  const field = useFieldContext();

  return (
    <>
      {field.state.meta.errors && field.state.meta.errors.length > 0 && (
        <div className="text-sm font-medium text-destructive mt-1">
          {field.state.meta.errors[0]}
        </div>
      )}
    </>
  );
};
