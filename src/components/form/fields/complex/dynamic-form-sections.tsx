'use client';

import { useFieldContext } from '@/contexts/form-context';
import { FieldError } from '@/components/form/fields/error';
import { LabelArea } from '@/components/form/fields/label';
import { FieldWrapper } from '@/components/form/fields/wrapper';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Plus, X, ChevronDown, ChevronUp } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

interface SectionField {
  name: string;
  label: string;
  type: 'text' | 'number' | 'email' | 'textarea' | 'checkbox' | 'select';
  options?: Array<{ value: string; label: string }>;
  placeholder?: string;
  required?: boolean;
}

interface SectionType {
  type: string;
  label: string;
  fields: SectionField[];
}

interface Section {
  id: string;
  type: string;
  fields: Record<string, any>;
}

interface DynamicFormSectionsProps {
  label?: string;
  id: string;
  description?: string;
  required?: boolean;
  sectionTypes: SectionType[];
}

const DynamicFormSectionsComponent = ({
  label,
  id,
  description,
  required,
  sectionTypes,
}: DynamicFormSectionsProps) => {
  const field = useFieldContext<Section[]>();
  const [sections, setSections] = useState<Section[]>(field.state.value || []);
  const [selectedType, setSelectedType] = useState<string>(
    sectionTypes[0]?.type || '',
  );
  const [expandedSections, setExpandedSections] = useState<string[]>([]);

  useEffect(() => {
    if (field.state.value) {
      setSections(field.state.value);

      // Expandir a primeira seção por padrão
      if (field.state.value.length > 0 && expandedSections.length === 0) {
        setExpandedSections([field.state.value[0].id]);
      }
    }
  }, [field.state.value]);

  const addSection = () => {
    if (!selectedType) return;

    const newSection: Section = {
      id: `section-${Date.now()}`,
      type: selectedType,
      fields: {},
    };

    // Inicializar campos com valores padrão
    const sectionType = sectionTypes.find((type) => type.type === selectedType);
    if (sectionType) {
      sectionType.fields.forEach((field) => {
        newSection.fields[field.name] = field.type === 'checkbox' ? false : '';
      });
    }

    const updatedSections = [...sections, newSection];
    setSections(updatedSections);
    field.setValue(updatedSections);

    // Expandir a nova seção
    setExpandedSections([...expandedSections, newSection.id]);
  };

  const removeSection = (id: string) => {
    const updatedSections = sections.filter((section) => section.id !== id);
    setSections(updatedSections);
    field.setValue(updatedSections);

    // Remover da lista de expandidos
    setExpandedSections(
      expandedSections.filter((sectionId) => sectionId !== id),
    );
  };

  const updateSectionField = (
    sectionId: string,
    fieldName: string,
    value: any,
  ) => {
    const updatedSections = sections.map((section) => {
      if (section.id === sectionId) {
        return {
          ...section,
          fields: {
            ...section.fields,
            [fieldName]: value,
          },
        };
      }
      return section;
    });

    setSections(updatedSections);
    field.setValue(updatedSections);
  };

  const toggleAccordion = (sectionId: string) => {
    setExpandedSections((prev) => {
      if (prev.includes(sectionId)) {
        return prev.filter((id) => id !== sectionId);
      } else {
        return [...prev, sectionId];
      }
    });
  };

  const moveSection = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === sections.length - 1)
    ) {
      return;
    }

    const newIndex = direction === 'up' ? index - 1 : index + 1;
    const updatedSections = [...sections];
    const [movedSection] = updatedSections.splice(index, 1);
    updatedSections.splice(newIndex, 0, movedSection);

    setSections(updatedSections);
    field.setValue(updatedSections);
  };

  const renderField = (
    sectionId: string,
    fieldConfig: SectionField,
    value: any,
  ) => {
    const {
      name,
      label,
      type,
      options,
      placeholder,
      required: fieldRequired,
    } = fieldConfig;

    switch (type) {
      case 'text':
      case 'email':
      case 'number':
        return (
          <div className="space-y-2" key={name}>
            <Label htmlFor={`${sectionId}-${name}`}>
              {label}
              {fieldRequired && (
                <span className="text-destructive ml-1">*</span>
              )}
            </Label>
            <Input
              id={`${sectionId}-${name}`}
              type={type}
              value={value || ''}
              onChange={(e) =>
                updateSectionField(sectionId, name, e.target.value)
              }
              placeholder={placeholder}
              required={fieldRequired}
            />
          </div>
        );

      case 'textarea':
        return (
          <div className="space-y-2" key={name}>
            <Label htmlFor={`${sectionId}-${name}`}>
              {label}
              {fieldRequired && (
                <span className="text-destructive ml-1">*</span>
              )}
            </Label>
            <Textarea
              id={`${sectionId}-${name}`}
              value={value || ''}
              onChange={(e) =>
                updateSectionField(sectionId, name, e.target.value)
              }
              placeholder={placeholder}
              required={fieldRequired}
            />
          </div>
        );

      case 'checkbox':
        return (
          <div className="flex items-center space-x-2" key={name}>
            <Checkbox
              id={`${sectionId}-${name}`}
              checked={value || false}
              onCheckedChange={(checked) =>
                updateSectionField(sectionId, name, checked)
              }
            />
            <Label htmlFor={`${sectionId}-${name}`}>
              {label}
              {fieldRequired && (
                <span className="text-destructive ml-1">*</span>
              )}
            </Label>
          </div>
        );

      case 'select':
        return (
          <div className="space-y-2" key={name}>
            <Label htmlFor={`${sectionId}-${name}`}>
              {label}
              {fieldRequired && (
                <span className="text-destructive ml-1">*</span>
              )}
            </Label>
            <Select
              value={value || ''}
              onValueChange={(value) =>
                updateSectionField(sectionId, name, value)
              }
              required={fieldRequired}
            >
              <SelectTrigger id={`${sectionId}-${name}`}>
                <SelectValue
                  placeholder={
                    placeholder || `Selecione ${label.toLowerCase()}`
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {options?.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <FieldWrapper>
      {label && <LabelArea label={label} htmlFor={id} required={required} />}

      <div className="space-y-4">
        {sections.length > 0 ? (
          <Accordion
            type="multiple"
            value={expandedSections}
            className="w-full"
          >
            {sections.map((section, index) => {
              const sectionType = sectionTypes.find(
                (type) => type.type === section.type,
              );
              if (!sectionType) return null;

              return (
                <AccordionItem
                  key={section.id}
                  value={section.id}
                  className="border rounded-lg mb-4"
                >
                  <div className="flex items-center">
                    <AccordionTrigger
                      onClick={(e) => {
                        e.preventDefault();
                        toggleAccordion(section.id);
                      }}
                      className="flex-1 px-4"
                    >
                      {sectionType.label}
                    </AccordionTrigger>
                    <div className="flex items-center gap-1 px-2">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => moveSection(index, 'up')}
                        disabled={index === 0}
                        className="h-8 w-8"
                      >
                        <ChevronUp className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => moveSection(index, 'down')}
                        disabled={index === sections.length - 1}
                        className="h-8 w-8"
                      >
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeSection(section.id)}
                        className="h-8 w-8 text-destructive"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <AccordionContent className="px-4 pb-4 pt-2">
                    <div className="space-y-4">
                      {sectionType.fields.map((fieldConfig) =>
                        renderField(
                          section.id,
                          fieldConfig,
                          section.fields[fieldConfig.name],
                        ),
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        ) : (
          <Card>
            <CardContent className="p-6 text-center text-muted-foreground">
              Nenhuma seção adicionada
            </CardContent>
          </Card>
        )}

        <div className="flex items-end gap-2">
          <div className="flex-1">
            <Label
              htmlFor="section-type"
              className="text-sm font-medium mb-1 block"
            >
              Tipo de seção
            </Label>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger id="section-type">
                <SelectValue placeholder="Selecione o tipo de seção" />
              </SelectTrigger>
              <SelectContent>
                {sectionTypes.map((type) => (
                  <SelectItem key={type.type} value={type.type}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button type="button" onClick={addSection} disabled={!selectedType}>
            <Plus className="h-4 w-4 mr-2" />
            Adicionar seção
          </Button>
        </div>
      </div>

      {description && (
        <span className="text-sm text-muted-foreground">{description}</span>
      )}
      <FieldError />
    </FieldWrapper>
  );
};

export default DynamicFormSectionsComponent;
