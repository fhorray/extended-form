'use client';

import { useFieldContext } from '@/contexts/form-context';
import { Input } from '@/components/ui/input';
import { FieldError } from '@/components/form/fields/error';
import { LabelArea } from '@/components/form/fields/label';
import { FieldWrapper } from '@/components/form/fields/wrapper';
import { useState, useEffect } from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import * as LucideIcons from 'lucide-react';

interface IconPickerProps {
  label?: string;
  id: string;
  description?: string;
  required?: boolean;
}

type IconName = keyof typeof LucideIcons;

const IconPickerField = ({
  label,
  id,
  description,
  required,
}: IconPickerProps) => {
  const field = useFieldContext<string>();
  const [selectedIcon, setSelectedIcon] = useState<string>(
    field.state.value || 'home',
  );
  const [searchQuery, setSearchQuery] = useState('');

  // useEffect(() => {
  //   if (field.state.value) {
  //     setSelectedIcon(field.state.value);
  //   }
  // }, [field.state.value]);

  // Filtrar ícones com base na consulta de pesquisa
  const filteredIcons = Object.keys(LucideIcons)
    .filter(
      (iconName) =>
        iconName !== 'createLucideIcon' &&
        iconName !== 'default' &&
        iconName.toLowerCase().includes(searchQuery.toLowerCase()),
    )
    .slice(0, 100); // Limitar a 100 resultados para melhor desempenho

  const handleSelectIcon = (iconName: string) => {
    setSelectedIcon(iconName);
    field.setValue(iconName);
  };

  // Renderizar o ícone selecionado
  const SelectedIconComponent =
    LucideIcons[selectedIcon as IconName] || LucideIcons.HelpCircle;

  return (
    <FieldWrapper>
      {label && <LabelArea label={label} htmlFor={id} required={required} />}

      <div className="flex items-center gap-2 w-full">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-10 h-10 p-0">
              <SelectedIconComponent className="w-5 h-5" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-0">
            <Command>
              <CommandInput
                placeholder="Buscar ícone..."
                value={searchQuery}
                onValueChange={setSearchQuery}
              />
              <CommandList className="h-[300px]">
                <CommandEmpty>Nenhum ícone encontrado.</CommandEmpty>
                <CommandGroup>
                  <div className="grid grid-cols-5 gap-2 p-2">
                    {filteredIcons.map((iconName) => {
                      const IconComponent = LucideIcons[iconName as IconName];
                      return (
                        <CommandItem
                          key={iconName}
                          value={iconName}
                          onSelect={() => handleSelectIcon(iconName)}
                          className={`flex items-center justify-center p-2 rounded-md cursor-pointer ${
                            selectedIcon === iconName ? 'bg-primary/10' : ''
                          }`}
                        >
                          <IconComponent className="w-5 h-5" />
                        </CommandItem>
                      );
                    })}
                  </div>
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        <Input
          value={selectedIcon}
          onChange={(e) => {
            setSelectedIcon(e.target.value);
            field.setValue(e.target.value);
          }}
          className="font-mono"
        />
      </div>

      {description && (
        <span className="text-sm text-muted-foreground">{description}</span>
      )}
      <FieldError />
    </FieldWrapper>
  );
};

export default IconPickerField;
