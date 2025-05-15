import { Textarea } from '@/components/ui/textarea';
import { useFieldContext } from '../../../../contexts/form-context';
import { LabelArea } from '../label';
import { FieldWrapper } from '../wrapper';
import { FieldError } from '../error';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface TextAreaProps extends React.InputHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  rows?: number;
  id: string;
  description?: string;
}

const TextAreaField = ({
  label,
  id,
  rows,
  description,
  ...props
}: TextAreaProps) => {
  const field = useFieldContext<string>();
  const [characterCount, setCharacterCount] = useState(
    props.defaultValue ? (props.defaultValue as string)?.length : 0,
  );

  return (
    <FieldWrapper>
      {label && (
        <LabelArea label={label} htmlFor={id} required={props.required} />
      )}

      <div className="w-full">
        <Textarea
          id={id}
          value={field.state.value}
          onChange={(e) => {
            setCharacterCount(e.target.value.length);
            field.setValue(e.target.value);
          }}
          rows={rows}
          {...props}
        />

        <div className="w-full flex justify-between text-sm opacity-45">
          {description && <span className="w-full">{description}</span>}

          {props.maxLength && (
            <span className="w-full flex justify-end self-end">
              {characterCount}/{props.maxLength}
            </span>
          )}
        </div>
      </div>

      <FieldError />
    </FieldWrapper>
  );
};

export default TextAreaField;
