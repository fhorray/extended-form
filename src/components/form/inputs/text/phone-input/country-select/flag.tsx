import { Country } from 'react-phone-number-input';
import * as flags from 'country-flag-icons/react/3x2';

interface FlagProps {
  country: Country;
  className?: string;
}

export const Flag = ({ country, className }: FlagProps) => {
  const FlagComponent = flags[country as keyof typeof flags];

  if (!FlagComponent) {
    return (
      <div
        className={`w-6 h-4 bg-zinc-200 dark:bg-zinc-700 rounded ${className}`}
      />
    );
  }

  return (
    <div className={`w-6 h-4 rounded overflow-hidden ${className}`}>
      <FlagComponent className="h-full w-full object-cover" />
    </div>
  );
};
