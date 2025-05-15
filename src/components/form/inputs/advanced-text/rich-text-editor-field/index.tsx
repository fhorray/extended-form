import { useFieldContext } from '@/contexts/form-context';
import { FieldError } from '@/components/form/fields/error';
import { LabelArea } from '@/components/form/fields/label';
import { FieldWrapper } from '@/components/form/fields/wrapper';
import { TipTap } from './tiptap';
import { Content } from '@tiptap/react';

type TextEditorFieldProps = {
  id: string;
  label?: string;
  required?: boolean;
  content?: Content;
};

const TextEditorField = ({
  id,
  label,
  content,
  required = false,
}: TextEditorFieldProps) => {
  const field = useFieldContext<string>();

  return (
    <FieldWrapper>
      {label && <LabelArea label={label} htmlFor={id} required={required} />}

      <TipTap
        content={content}
        onChange={(content) => field.setValue(content)}
      />

      <FieldError />
    </FieldWrapper>
  );
};

export default TextEditorField;
