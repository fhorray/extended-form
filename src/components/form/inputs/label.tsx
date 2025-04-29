import { Label } from '@/components/ui/label'; // ou de onde você estiver importando

import type { LabelHTMLAttributes } from 'react';

interface LabelAreaProps extends LabelHTMLAttributes<HTMLLabelElement> {
  label: string;
  required?: boolean;
}

export const LabelArea = ({
  label,
  htmlFor,
  required,
  ...props
}: LabelAreaProps) => {
  return (
    <Label htmlFor={htmlFor} {...props}>
      {label && (
        <span className="text-md font-bold">
          {label}

          {required && <span className="text-red-500 ml-0.5">*</span>}
        </span>
      )}
    </Label>
  );
};
