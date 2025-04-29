import { useState, useRef, useEffect } from 'react';

import { ChevronDown, Search, XIcon } from 'lucide-react';
import {
  Country,
  getCountries,
  getCountryCallingCode,
} from 'react-phone-number-input';
import { cn } from '@/lib/utils';
import { Flag } from './flag';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';

const allCountries = getCountries();

interface CountryOption {
  code: Country;
  name: string;
  callingCode: string;
}

interface CountrySelectProps {
  value: Country;
  onChange: (value: Country) => void;
  disabled?: boolean;
  className?: string;
}

export const CountrySelect = ({
  value,
  onChange,
  disabled = false,
  className,
}: CountrySelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const countryOptions: CountryOption[] = allCountries.map((country) => ({
    code: country,
    name: getCountryCallingCode(country) || country,
    callingCode: getCountryCallingCode(country),
  }));

  const filteredCountries = countryOptions.filter(
    (country) =>
      country.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      country.callingCode.includes(searchQuery),
  );

  const selectedCountry = countryOptions.find(
    (country) => country.code === value,
  );

  useEffect(() => {
    if (isOpen && inputRef.current) {
      // Focus the search input when dropdown opens
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleCountrySelect = (countryCode: Country) => {
    onChange(countryCode);
    setIsOpen(false);
    setSearchQuery('');
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setSearchQuery('');
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            'flex items-center justify-between px-2 min-w-[100px] hover:cursor-pointer',
            'border border-zinc-200 dark:border-zinc-800 rounded-md',
            'bg-white dark:bg-black/5',
            'focus:outline-none focus:ring-2 focus:ring-zinc-900/20 dark:focus:ring-zinc-100/20',
            'transition-all duration-200',
            disabled && 'opacity-50 cursor-not-allowed',
            className,
          )}
        >
          <div className="flex items-center gap-2">
            {selectedCountry && (
              <>
                <Flag country={selectedCountry.code} />
                <span className="font-medium">
                  +{selectedCountry.callingCode}
                </span>
              </>
            )}
          </div>
          <ChevronDown className="h-4 w-4 opacity-50 ml-1" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="overflow-hidden space-y-4  w-[150px]">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-zinc-400" />
          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Code"
            className="w-full pl-8 pr-8 py-2 text-sm border border-zinc-200 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900/20 dark:focus:ring-zinc-100/20"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2 top-2.5"
            >
              <XIcon className="h-4 w-4 text-zinc-400" />
            </button>
          )}
        </div>

        <ScrollArea className="overflow-y-hidden h-[200px]">
          {filteredCountries.length > 0 ? (
            filteredCountries.map((country) => (
              <button
                key={country.code}
                type="button"
                onClick={() => handleCountrySelect(country.code)}
                className={cn(
                  'w-full flex items-center px-3 py-2 text-sm rounded-md gap-4 hover:cursor-pointer',
                  'hover:bg-zinc-100 dark:hover:bg-zinc-800',
                  'transition-colors duration-150',
                  country.code === value && 'bg-zinc-100 dark:bg-zinc-800',
                )}
              >
                <Flag country={country.code} />

                <span className="text-zinc-500 dark:text-zinc-400">
                  +{country.callingCode}
                </span>
              </button>
            ))
          ) : (
            <div className="px-3 py-4 text-center text-zinc-500 dark:text-zinc-400 text-sm">
              No countries found
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};
