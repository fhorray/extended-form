'use client';

import { useFieldContext } from '@/contexts/form-context';
import { FieldError } from '@/components/form/fields/error';
import { LabelArea } from '@/components/form/fields/label';
import { FieldWrapper } from '@/components/form/fields/wrapper';
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Link,
  ImageIcon,
  Code,
} from 'lucide-react';

interface RichTextFieldProps {
  label?: string;
  id: string;
  description?: string;
  required?: boolean;
  height?: string;
}

const RichTextField = ({
  label,
  id,
  description,
  required,
  height = '200px',
}: RichTextFieldProps) => {
  const field = useFieldContext<string>();
  const [content, setContent] = useState<string>(field.state.value || '');

  useEffect(() => {
    if (field.state.value) {
      setContent(field.state.value);
    }
  }, [field.state.value]);

  const execCommand = (command: string, value: string | null = null) => {
    document.execCommand(command, false, value);

    // Capturar o HTML atualizado do editor
    const editorContent =
      document.getElementById(`${id}-editor`)?.innerHTML || '';
    setContent(editorContent);
    field.setValue(editorContent);
  };

  const handleLinkClick = () => {
    const url = prompt('Insira a URL do link:', 'https://');
    if (url) {
      execCommand('createLink', url);
    }
  };

  const handleImageClick = () => {
    const url = prompt('Insira a URL da imagem:', 'https://');
    if (url) {
      execCommand('insertImage', url);
    }
  };

  return (
    <FieldWrapper>
      {label && <LabelArea label={label} htmlFor={id} required={required} />}

      <Card>
        <div className="flex flex-wrap gap-1 p-2 border-b">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => execCommand('bold')}
          >
            <Bold className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => execCommand('italic')}
          >
            <Italic className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => execCommand('underline')}
          >
            <Underline className="h-4 w-4" />
          </Button>
          <div className="w-px h-6 bg-border mx-1 self-center" />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => execCommand('insertUnorderedList')}
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => execCommand('insertOrderedList')}
          >
            <ListOrdered className="h-4 w-4" />
          </Button>
          <div className="w-px h-6 bg-border mx-1 self-center" />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => execCommand('justifyLeft')}
          >
            <AlignLeft className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => execCommand('justifyCenter')}
          >
            <AlignCenter className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => execCommand('justifyRight')}
          >
            <AlignRight className="h-4 w-4" />
          </Button>
          <div className="w-px h-6 bg-border mx-1 self-center" />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handleLinkClick}
          >
            <Link className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handleImageClick}
          >
            <ImageIcon className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => execCommand('formatBlock', '<pre>')}
          >
            <Code className="h-4 w-4" />
          </Button>
        </div>
        <CardContent className="p-0">
          <div
            id={`${id}-editor`}
            contentEditable
            dangerouslySetInnerHTML={{ __html: content }}
            onInput={(e) => {
              const html = (e.target as HTMLDivElement).innerHTML;
              setContent(html);
              field.setValue(html);
            }}
            className="p-4 outline-none min-h-[100px] prose prose-sm max-w-none"
            style={{ height, overflowY: 'auto' }}
          />
        </CardContent>
      </Card>

      {description && (
        <span className="text-sm text-muted-foreground">{description}</span>
      )}
      <FieldError />
    </FieldWrapper>
  );
};

export default RichTextField;
