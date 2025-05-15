'use client';

import type React from 'react';
import { useFieldContext } from '@/contexts/form-context';
import { FieldError } from '@/components/form/fields/error';
import { LabelArea } from '@/components/form/fields/label';
import { FieldWrapper } from '@/components/form/fields/wrapper';
import { useState, useEffect } from 'react';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDebounce } from 'use-debounce';

interface AutoSuggestProps {
  label?: string;
  id: string;
  description?: string;
  required?: boolean;
  suggestions: string[];
  placeholder?: string;
  allowCustomValues?: boolean;
}

const AutoSuggestField = ({
  label,
  id,
  description,
  required,
  suggestions,
  placeholder = 'Digite para buscar...',
  allowCustomValues = true,
}: AutoSuggestProps) => {
  const field = useFieldContext<string>();
  const [open, setOpen] = useState<boolean>(false);
  const [filteredSuggestions, setFilteredSuggestions] =
    useState<string[]>(suggestions);
  const [debouncedValue] = useDebounce(field.state.value, 300);

  useEffect(() => {
    if (debouncedValue) {
      const filtered = suggestions.filter((suggestion) =>
        suggestion.toLowerCase().includes(debouncedValue.toLowerCase()),
      );
      setFilteredSuggestions(filtered);
    } else {
      setFilteredSuggestions(suggestions);
    }
  }, [debouncedValue, suggestions]);

  const handleSelect = (selectedValue: string) => {
    field.setValue(selectedValue);
    setOpen(false);
  };

  return (
    <FieldWrapper>
      {label && <LabelArea label={label} htmlFor={id} required={required} />}

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            {field.state.value || placeholder}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command>
            <CommandInput
              placeholder={placeholder}
              value={field.state.value}
              onValueChange={field.setValue}
            />
            <CommandList>
              <CommandEmpty>Nenhuma sugestão encontrada</CommandEmpty>
              <CommandGroup>
                {filteredSuggestions.map((suggestion) => (
                  <CommandItem
                    key={suggestion}
                    value={suggestion}
                    onSelect={() => handleSelect(suggestion)}
                  >
                    <Check
                      className={cn(
                        'mr-2 h-4 w-4',
                        field.state.value === suggestion
                          ? 'opacity-100'
                          : 'opacity-0',
                      )}
                    />
                    {suggestion}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {description && (
        <span className="text-sm text-muted-foreground">{description}</span>
      )}
      <FieldError />
    </FieldWrapper>
  );
};

export default AutoSuggestField;
