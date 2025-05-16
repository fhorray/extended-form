'use client';

import type React from 'react';

import { useFieldContext } from '@/contexts/form-context';
import { FieldError } from '@/components/form/fields/error';
import { LabelArea } from '@/components/form/fields/label';
import { FieldWrapper } from '@/components/form/fields/wrapper';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  Plus,
  X,
  ChevronDown,
  GripVertical,
  Briefcase,
  GraduationCap,
  CreditCard,
  Award,
  Building,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { cn } from '@/lib/utils';

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
  icon?: React.ReactNode;
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

interface SortableSectionProps {
  id: string;
  section: Section;
  sectionType: SectionType;
  isExpanded: boolean;
  onToggle: () => void;
  onRemove: () => void;
  onUpdateField: (fieldName: string, value: any) => void;
}

const SortableSection = ({
  id,
  section,
  sectionType,
  isExpanded,
  onToggle,
  onRemove,
  onUpdateField,
}: SortableSectionProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const renderField = (fieldConfig: SectionField) => {
    const {
      name,
      label,
      type,
      options,
      placeholder,
      required: fieldRequired,
    } = fieldConfig;
    const value = section.fields[name];

    switch (type) {
      case 'text':
      case 'email':
      case 'number':
        return (
          <div className="space-y-2" key={name}>
            <Label
              htmlFor={`${section.id}-${name}`}
              className="text-sm font-medium flex items-center"
            >
              {label}
              {fieldRequired && (
                <span className="text-destructive ml-1">*</span>
              )}
            </Label>
            <Input
              id={`${section.id}-${name}`}
              type={type}
              value={value || ''}
              onChange={(e) => onUpdateField(name, e.target.value)}
              placeholder={placeholder}
              required={fieldRequired}
              className="transition-all focus-visible:ring-primary/20"
            />
          </div>
        );

      case 'textarea':
        return (
          <div className="space-y-2" key={name}>
            <Label
              htmlFor={`${section.id}-${name}`}
              className="text-sm font-medium flex items-center"
            >
              {label}
              {fieldRequired && (
                <span className="text-destructive ml-1">*</span>
              )}
            </Label>
            <Textarea
              id={`${section.id}-${name}`}
              value={value || ''}
              onChange={(e) => onUpdateField(name, e.target.value)}
              placeholder={placeholder}
              required={fieldRequired}
              className="min-h-[100px] transition-all focus-visible:ring-primary/20"
            />
          </div>
        );

      case 'checkbox':
        return (
          <div className="flex items-start space-x-2 py-2" key={name}>
            <Checkbox
              id={`${section.id}-${name}`}
              checked={value || false}
              onCheckedChange={(checked) => onUpdateField(name, checked)}
              className="mt-1 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
            />
            <div className="grid gap-1.5 leading-none">
              <Label
                htmlFor={`${section.id}-${name}`}
                className="text-sm font-medium flex items-center"
              >
                {label}
                {fieldRequired && (
                  <span className="text-destructive ml-1">*</span>
                )}
              </Label>
            </div>
          </div>
        );

      case 'select':
        return (
          <div className="space-y-2" key={name}>
            <Label
              htmlFor={`${section.id}-${name}`}
              className="text-sm font-medium flex items-center"
            >
              {label}
              {fieldRequired && (
                <span className="text-destructive ml-1">*</span>
              )}
            </Label>
            <Select
              value={value || ''}
              onValueChange={(value) => onUpdateField(name, value)}
              required={fieldRequired}
            >
              <SelectTrigger
                id={`${section.id}-${name}`}
                className="transition-all focus-visible:ring-primary/20"
              >
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
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'mb-3 rounded-lg border overflow-hidden',
        isDragging ? 'opacity-60 shadow-lg z-10' : '',
        'transition-all duration-200',
      )}
    >
      <div className="flex items-center bg-muted/30 p-2">
        <div
          className="cursor-move p-2 rounded-md hover:bg-muted transition-colors"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-4 w-4 text-muted-foreground" />
        </div>
        <div
          className="flex-1 px-2 font-medium cursor-pointer"
          onClick={onToggle}
        >
          <div className="flex items-center">
            {sectionType.icon && (
              <span className="mr-2">{sectionType.icon}</span>
            )}
            <span>{sectionType.label}</span>
            <Badge
              variant="outline"
              className="ml-2 text-xs font-normal bg-primary/5 border-primary/20"
            >
              {sectionType.type}
            </Badge>
            <ChevronDown
              className={cn(
                'h-4 w-4 ml-auto transition-transform duration-200',
                isExpanded ? 'transform rotate-180' : '',
              )}
            />
          </div>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onRemove}
          className="h-8 w-8 text-destructive hover:text-destructive/80 hover:bg-destructive/10 transition-colors"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      {isExpanded && (
        <div className="p-4 space-y-4 bg-white">
          {sectionType.fields.map((fieldConfig) => renderField(fieldConfig))}
        </div>
      )}
    </div>
  );
};

// Example section types with more variety
const exampleSectionTypes: SectionType[] = [
  {
    type: 'contact',
    label: 'Informações de Contato',
    icon: <Building className="h-4 w-4" />,
    fields: [
      { name: 'name', label: 'Nome Completo', type: 'text', required: true },
      { name: 'email', label: 'Email', type: 'email', required: true },
      { name: 'phone', label: 'Telefone', type: 'text' },
    ],
  },
  {
    type: 'address',
    label: 'Endereço',
    icon: <Building className="h-4 w-4" />,
    fields: [
      { name: 'street', label: 'Rua', type: 'text', required: true },
      { name: 'number', label: 'Número', type: 'text', required: true },
      { name: 'complement', label: 'Complemento', type: 'text' },
      { name: 'city', label: 'Cidade', type: 'text', required: true },
      { name: 'state', label: 'Estado', type: 'text', required: true },
      { name: 'zipcode', label: 'CEP', type: 'text', required: true },
    ],
  },
  {
    type: 'education',
    label: 'Formação Acadêmica',
    icon: <GraduationCap className="h-4 w-4" />,
    fields: [
      {
        name: 'institution',
        label: 'Instituição',
        type: 'text',
        required: true,
      },
      {
        name: 'degree',
        label: 'Grau',
        type: 'select',
        required: true,
        options: [
          { value: 'high_school', label: 'Ensino Médio' },
          { value: 'technical', label: 'Técnico' },
          { value: 'bachelor', label: 'Graduação' },
          { value: 'master', label: 'Mestrado' },
          { value: 'doctorate', label: 'Doutorado' },
        ],
      },
      { name: 'field', label: 'Área de Estudo', type: 'text', required: true },
      { name: 'startDate', label: 'Data de Início', type: 'text' },
      { name: 'endDate', label: 'Data de Conclusão', type: 'text' },
      { name: 'current', label: 'Cursando atualmente', type: 'checkbox' },
      { name: 'description', label: 'Descrição', type: 'textarea' },
    ],
  },
  {
    type: 'experience',
    label: 'Experiência Profissional',
    icon: <Briefcase className="h-4 w-4" />,
    fields: [
      { name: 'company', label: 'Empresa', type: 'text', required: true },
      { name: 'position', label: 'Cargo', type: 'text', required: true },
      {
        name: 'startDate',
        label: 'Data de Início',
        type: 'text',
        required: true,
      },
      { name: 'endDate', label: 'Data de Término', type: 'text' },
      { name: 'current', label: 'Trabalho atual', type: 'checkbox' },
      {
        name: 'description',
        label: 'Descrição das atividades',
        type: 'textarea',
      },
    ],
  },
  {
    type: 'payment',
    label: 'Informações de Pagamento',
    icon: <CreditCard className="h-4 w-4" />,
    fields: [
      {
        name: 'method',
        label: 'Método de Pagamento',
        type: 'select',
        required: true,
        options: [
          { value: 'credit_card', label: 'Cartão de Crédito' },
          { value: 'debit_card', label: 'Cartão de Débito' },
          { value: 'bank_transfer', label: 'Transferência Bancária' },
          { value: 'pix', label: 'PIX' },
        ],
      },
      { name: 'cardName', label: 'Nome no Cartão', type: 'text' },
      { name: 'cardNumber', label: 'Número do Cartão', type: 'text' },
      { name: 'expiryDate', label: 'Data de Validade', type: 'text' },
      { name: 'cvv', label: 'CVV', type: 'text' },
      {
        name: 'saveInfo',
        label: 'Salvar informações para futuras compras',
        type: 'checkbox',
      },
    ],
  },
  {
    type: 'skills',
    label: 'Habilidades',
    icon: <Award className="h-4 w-4" />,
    fields: [
      {
        name: 'skillName',
        label: 'Nome da Habilidade',
        type: 'text',
        required: true,
      },
      {
        name: 'proficiency',
        label: 'Nível de Proficiência',
        type: 'select',
        required: true,
        options: [
          { value: 'beginner', label: 'Iniciante' },
          { value: 'intermediate', label: 'Intermediário' },
          { value: 'advanced', label: 'Avançado' },
          { value: 'expert', label: 'Especialista' },
        ],
      },
      { name: 'yearsExperience', label: 'Anos de Experiência', type: 'number' },
      { name: 'description', label: 'Descrição', type: 'textarea' },
    ],
  },
];

const DynamicFormSectionsComponent = ({
  label,
  id,
  description,
  required,
  sectionTypes = exampleSectionTypes,
}: DynamicFormSectionsProps) => {
  const field = useFieldContext<Section[]>();
  const [sections, setSections] = useState<Section[]>(field.state.value || []);
  const [selectedType, setSelectedType] = useState<string>(
    sectionTypes[0]?.type || '',
  );
  const [expandedSections, setExpandedSections] = useState<string[]>([]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

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

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = sections.findIndex(
        (section) => section.id === active.id,
      );
      const newIndex = sections.findIndex((section) => section.id === over.id);

      const newSections = arrayMove(sections, oldIndex, newIndex);
      setSections(newSections);
      field.setValue(newSections);
    }
  };

  return (
    <FieldWrapper>
      {label && (
        <div className="flex items-center justify-between mb-2">
          <LabelArea label={label} htmlFor={id} required={required} />
          <Badge variant="outline" className="text-xs font-normal">
            {sections.length} seções
          </Badge>
        </div>
      )}

      <div className="space-y-4">
        {sections.length > 0 ? (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={sections.map((section) => section.id)}
              strategy={verticalListSortingStrategy}
            >
              {sections.map((section) => {
                const sectionType = sectionTypes.find(
                  (type) => type.type === section.type,
                );
                if (!sectionType) return null;

                return (
                  <SortableSection
                    key={section.id}
                    id={section.id}
                    section={section}
                    sectionType={sectionType}
                    isExpanded={expandedSections.includes(section.id)}
                    onToggle={() => toggleAccordion(section.id)}
                    onRemove={() => removeSection(section.id)}
                    onUpdateField={(fieldName, value) =>
                      updateSectionField(section.id, fieldName, value)
                    }
                  />
                );
              })}
            </SortableContext>
          </DndContext>
        ) : (
          <Card className="border-dashed">
            <CardContent className="p-6 text-center text-muted-foreground">
              Nenhuma seção adicionada
            </CardContent>
          </Card>
        )}

        <Card className="border border-border/50 shadow-sm">
          <CardHeader className="p-4 pb-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Adicionar nova seção
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-3">
            <div className="flex items-end gap-2">
              <div className="flex-1">
                <Label
                  htmlFor="section-type"
                  className="text-sm font-medium mb-1.5 block"
                >
                  Tipo de seção
                </Label>
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger
                    id="section-type"
                    className="transition-all focus-visible:ring-primary/20"
                  >
                    <SelectValue placeholder="Selecione o tipo de seção" />
                  </SelectTrigger>
                  <SelectContent>
                    {sectionTypes.map((type) => (
                      <SelectItem key={type.type} value={type.type}>
                        <div className="flex items-center">
                          {type.icon && (
                            <span className="mr-2">{type.icon}</span>
                          )}
                          {type.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button
                type="button"
                onClick={addSection}
                disabled={!selectedType}
                className="transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" />
                Adicionar seção
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {description && (
        <span className="text-sm text-muted-foreground mt-2 block">
          {description}
        </span>
      )}
      <FieldError />
    </FieldWrapper>
  );
};

export default DynamicFormSectionsComponent;
