import React from 'react';

export const FieldWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-full flex flex-col items-start gap-2">{children}</div>
  );
};
