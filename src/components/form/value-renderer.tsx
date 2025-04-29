import { ChevronRight } from 'lucide-react';

export const ValueRenderer = ({ value }: { value: string }) => {
  return (
    <div className="flex items-center gap-2 p-4 bg-gray-950/10 rounded-md border text-gray-500 text-sm mt-4">
      <ChevronRight className="text-gray-950/80" />
      {value ?? 'Write something'}
    </div>
  );
};
