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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from '@/components/ui/command';

interface EmojiPickerProps {
  label?: string;
  id: string;
  description?: string;
  required?: boolean;
}

// Lista simplificada de emojis por categoria
const emojiCategories = {
  smileys: [
    '😀',
    '😃',
    '😄',
    '😁',
    '😆',
    '😅',
    '😂',
    '🤣',
    '😊',
    '😇',
    '🙂',
    '🙃',
    '😉',
    '😌',
    '😍',
    '🥰',
    '😘',
  ],
  people: [
    '👶',
    '👧',
    '🧒',
    '👦',
    '👩',
    '🧑',
    '👨',
    '👵',
    '🧓',
    '👴',
    '👲',
    '👳‍♀️',
    '👳‍♂️',
    '🧕',
    '👮‍♀️',
    '👮‍♂️',
  ],
  animals: [
    '🐶',
    '🐱',
    '🐭',
    '🐹',
    '🐰',
    '🦊',
    '🐻',
    '🐼',
    '🐨',
    '🐯',
    '🦁',
    '🐮',
    '🐷',
    '🐸',
    '🐵',
    '🙈',
    '🙉',
  ],
  food: [
    '🍏',
    '🍎',
    '🍐',
    '🍊',
    '🍋',
    '🍌',
    '🍉',
    '🍇',
    '🍓',
    '🍈',
    '🍒',
    '🍑',
    '🥭',
    '🍍',
    '🥥',
    '🥝',
    '🍅',
  ],
  activities: [
    '⚽️',
    '🏀',
    '🏈',
    '⚾️',
    '🥎',
    '🎾',
    '🏐',
    '🏉',
    '🥏',
    '🎱',
    '🪀',
    '🏓',
    '🏸',
    '🏒',
    '🏑',
    '🥍',
    '🏏',
  ],
  travel: [
    '🚗',
    '🚕',
    '🚙',
    '🚌',
    '🚎',
    '🏎',
    '🚓',
    '🚑',
    '🚒',
    '🚐',
    '🚚',
    '🚛',
    '🚜',
    '🛴',
    '🚲',
    '🛵',
    '🏍',
  ],
  objects: [
    '⌚️',
    '📱',
    '📲',
    '💻',
    '⌨️',
    '🖥',
    '🖨',
    '🖱',
    '🖲',
    '🕹',
    '🗜',
    '💽',
    '💾',
    '💿',
    '📀',
    '📼',
    '📷',
  ],
  symbols: [
    '❤️',
    '🧡',
    '💛',
    '💚',
    '💙',
    '💜',
    '🖤',
    '🤍',
    '🤎',
    '💔',
    '❣️',
    '💕',
    '💞',
    '💓',
    '💗',
    '💖',
    '💘',
  ],
};

const EmojiPickerField = ({
  label,
  id,
  description,
  required,
}: EmojiPickerProps) => {
  const field = useFieldContext<string>();
  const [selectedEmoji, setSelectedEmoji] = useState<string>(
    field.state.value || '😊',
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('smileys');

  // useEffect(() => {
  //   if (field.state.value) {
  //     setSelectedEmoji(field.state.value);
  //   }
  // }, [field.state.value]);

  // Função para filtrar emojis com base na pesquisa
  const getFilteredEmojis = () => {
    if (!searchQuery) return [];

    return Object.values(emojiCategories)
      .flat()
      .filter((emoji) => emoji.includes(searchQuery));
  };

  const handleSelectEmoji = (emoji: string) => {
    setSelectedEmoji(emoji);
    field.setValue(emoji);
  };

  return (
    <FieldWrapper>
      {label && <LabelArea label={label} htmlFor={id} required={required} />}

      <div className="flex items-center gap-2 w-full">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-10 h-10 p-0 text-xl">
              {selectedEmoji}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-0">
            <div className="p-2">
              <Command>
                <CommandInput
                  placeholder="Buscar emoji..."
                  value={searchQuery}
                  onValueChange={setSearchQuery}
                />
                <CommandList className="h-[200px]">
                  <CommandEmpty>Nenhum emoji encontrado.</CommandEmpty>
                  {searchQuery ? (
                    <CommandGroup>
                      <div className="grid grid-cols-6 gap-2 p-2">
                        {getFilteredEmojis().map((emoji) => (
                          <CommandItem
                            key={emoji}
                            value={emoji}
                            onSelect={() => handleSelectEmoji(emoji)}
                            className="flex items-center justify-center p-2 text-xl cursor-pointer"
                          >
                            {emoji}
                          </CommandItem>
                        ))}
                      </div>
                    </CommandGroup>
                  ) : (
                    <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
                      <TabsList className="grid grid-cols-4 h-auto">
                        <TabsTrigger value="smileys" className="text-lg p-1">
                          😊
                        </TabsTrigger>
                        <TabsTrigger value="people" className="text-lg p-1">
                          👨
                        </TabsTrigger>
                        <TabsTrigger value="animals" className="text-lg p-1">
                          🐱
                        </TabsTrigger>
                        <TabsTrigger value="food" className="text-lg p-1">
                          🍎
                        </TabsTrigger>
                      </TabsList>

                      {Object.entries(emojiCategories).map(
                        ([category, emojis]) => (
                          <TabsContent
                            key={category}
                            value={category}
                            className="mt-2"
                          >
                            <div className="grid grid-cols-6 gap-2">
                              {emojis.map((emoji) => (
                                <button
                                  key={emoji}
                                  type="button"
                                  onClick={() => handleSelectEmoji(emoji)}
                                  className={`flex items-center justify-center p-2 text-xl rounded-md hover:bg-muted ${
                                    selectedEmoji === emoji
                                      ? 'bg-primary/10'
                                      : ''
                                  }`}
                                >
                                  {emoji}
                                </button>
                              ))}
                            </div>
                          </TabsContent>
                        ),
                      )}
                    </Tabs>
                  )}
                </CommandList>
              </Command>
            </div>
          </PopoverContent>
        </Popover>

        <Input
          value={selectedEmoji}
          onChange={(e) => {
            setSelectedEmoji(e.target.value);
            field.setValue(e.target.value);
          }}
          className="text-center text-xl"
        />
      </div>

      {description && (
        <span className="text-sm text-muted-foreground">{description}</span>
      )}
      <FieldError />
    </FieldWrapper>
  );
};

export default EmojiPickerField;
