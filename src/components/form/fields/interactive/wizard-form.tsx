'use client';

import { useFieldContext } from '@/contexts/form-context';
import { FieldError } from '@/components/form/fields/error';
import { LabelArea } from '@/components/form/fields/label';
import { FieldWrapper } from '@/components/form/fields/wrapper';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';

interface WizardStep {
  id: string;
  label: string;
}

interface WizardFormProps {
  label?: string;
  id: string;
  description?: string;
  required?: boolean;
  steps: WizardStep[];
}

const WizardFormField = ({
  label,
  id,
  description,
  required,
  steps,
}: WizardFormProps) => {
  const field = useFieldContext<Record<string, string>>();
  const [values, setValues] = useState<Record<string, string>>(
    field.state.value || {},
  );
  const [currentStep, setCurrentStep] = useState<number>(0);

  useEffect(() => {
    if (field.state.value) {
      setValues(field.state.value);
    } else {
      // Inicializar com valores vazios
      const initialValues: Record<string, string> = {};
      steps.forEach((step) => {
        initialValues[step.id] = '';
      });
      setValues(initialValues);
      field.setValue(initialValues);
    }
  }, [field.state.value, steps]);

  const handleInputChange = (stepId: string, value: string) => {
    const updatedValues = { ...values, [stepId]: value };
    setValues(updatedValues);
    field.setValue(updatedValues);
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;
  const currentStepId = steps[currentStep]?.id || '';

  return (
    <FieldWrapper>
      {label && <LabelArea label={label} htmlFor={id} required={required} />}

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{steps[currentStep]?.label}</CardTitle>
          <div className="flex items-center mt-2">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                    index === currentStep
                      ? 'bg-primary text-primary-foreground'
                      : index < currentStep
                        ? 'bg-primary/20 text-primary'
                        : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {index < currentStep ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    index + 1
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`h-1 w-10 ${index < currentStep ? 'bg-primary/20' : 'bg-muted'}`}
                  />
                )}
              </div>
            ))}
          </div>
        </CardHeader>
        <CardContent>
          <div className="py-4">
            <Input
              id={`${id}-${currentStepId}`}
              value={values[currentStepId] || ''}
              onChange={(e) => handleInputChange(currentStepId, e.target.value)}
              placeholder={`Insira os dados para ${steps[currentStep]?.label}`}
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={prevStep}
            disabled={isFirstStep}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Anterior
          </Button>
          <Button type="button" onClick={nextStep} disabled={isLastStep}>
            Próximo
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>

      {description && (
        <span className="text-sm text-muted-foreground">{description}</span>
      )}
      <FieldError />
    </FieldWrapper>
  );
};

export default WizardFormField;
