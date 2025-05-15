import { Button } from '@/components/ui/button';
import { FieldWrapper } from '@/components/form/fields/wrapper';
import { Loader2 } from 'lucide-react';

interface SubmitButtonProps {
  id: string;
  label?: string;
  description?: string;
  isSubmitting: boolean;
  canSubmit: boolean;
}

const SubmitButtonField = ({
  id,
  label = 'Enviar',
  description,
  isSubmitting,
  canSubmit,
}: SubmitButtonProps) => {
  return (
    <FieldWrapper>
      <Button
        id={id}
        type="submit"
        disabled={!canSubmit || isSubmitting}
        className="w-full md:w-auto"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Enviando...
          </>
        ) : (
          label
        )}
      </Button>
      {description && (
        <span className="text-sm text-muted-foreground">{description}</span>
      )}
    </FieldWrapper>
  );
};

export default SubmitButtonField;
