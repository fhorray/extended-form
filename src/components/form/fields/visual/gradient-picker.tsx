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
import { Slider } from '@/components/ui/slider';
import { X } from 'lucide-react';

interface GradientPickerProps {
  label?: string;
  id: string;
  description?: string;
  required?: boolean;
}

interface GradientStop {
  color: string;
  position: number;
}

const GradientPickerField = ({
  label,
  id,
  description,
  required,
}: GradientPickerProps) => {
  const field = useFieldContext<string>();
  const [gradientType, setGradientType] = useState<'linear' | 'radial'>(
    'linear',
  );
  const [angle, setAngle] = useState(90);
  const [stops, setStops] = useState<GradientStop[]>([
    { color: '#6366F1', position: 0 },
    { color: '#EC4899', position: 100 },
  ]);

  // useEffect(() => {
  //   if (field.state.value) {
  //     try {
  //       // Tentar extrair informações do gradiente existente
  //       const value = field.state.value;
  //       if (value.includes('linear-gradient')) {
  //         setGradientType('linear');

  //         // Extrair ângulo
  //         const angleMatch = value.match(/linear-gradient\(\s*(\d+)deg/);
  //         if (angleMatch && angleMatch[1]) {
  //           setAngle(Number.parseInt(angleMatch[1]));
  //         }

  //         // Extrair stops
  //         const stopsMatch = value.match(/linear-gradient$$[^,]+,(.+)$$/);
  //         if (stopsMatch && stopsMatch[1]) {
  //           const stopsStr = stopsMatch[1].trim();
  //           const extractedStops: GradientStop[] = [];

  //           // Regex para extrair cores e posições
  //           const stopRegex = /(#[0-9A-Fa-f]{3,8}|\w+$$[^)]+$$)\s*(\d+%)?/g;
  //           let match;
  //           let index = 0;

  //           while ((match = stopRegex.exec(stopsStr)) !== null) {
  //             const color = match[1];
  //             const position = match[2]
  //               ? Number.parseInt(match[2])
  //               : index === 0
  //                 ? 0
  //                 : 100;
  //             extractedStops.push({ color, position });
  //             index++;
  //           }

  //           if (extractedStops.length > 0) {
  //             setStops(extractedStops);
  //           }
  //         }
  //       } else if (value.includes('radial-gradient')) {
  //         setGradientType('radial');

  //         // Extrair stops para radial
  //         const stopsMatch = value.match(/radial-gradient$$[^,]+,(.+)$$/);
  //         if (stopsMatch && stopsMatch[1]) {
  //           const stopsStr = stopsMatch[1].trim();
  //           const extractedStops: GradientStop[] = [];

  //           // Regex para extrair cores e posições
  //           const stopRegex = /(#[0-9A-Fa-f]{3,8}|\w+$$[^)]+$$)\s*(\d+%)?/g;
  //           let match;
  //           let index = 0;

  //           while ((match = stopRegex.exec(stopsStr)) !== null) {
  //             const color = match[1];
  //             const position = match[2]
  //               ? Number.parseInt(match[2])
  //               : index === 0
  //                 ? 0
  //                 : 100;
  //             extractedStops.push({ color, position });
  //             index++;
  //           }

  //           if (extractedStops.length > 0) {
  //             setStops(extractedStops);
  //           }
  //         }
  //       }
  //     } catch (error) {
  //       console.error('Erro ao analisar o gradiente:', error);
  //     }
  //   }
  // }, [field.state.value]);

  const updateGradient = () => {
    const sortedStops = [...stops].sort((a, b) => a.position - b.position);

    let gradientString = '';
    if (gradientType === 'linear') {
      gradientString = `linear-gradient(${angle}deg, ${sortedStops
        .map((stop) => `${stop.color} ${stop.position}%`)
        .join(', ')})`;
    } else {
      gradientString = `radial-gradient(circle, ${sortedStops
        .map((stop) => `${stop.color} ${stop.position}%`)
        .join(', ')})`;
    }

    field.setValue(gradientString);
    return gradientString;
  };

  const handleStopColorChange = (index: number, color: string) => {
    const newStops = [...stops];
    newStops[index].color = color;
    setStops(newStops);
    updateGradient();
  };

  const handleStopPositionChange = (index: number, position: number) => {
    const newStops = [...stops];
    newStops[index].position = position;
    setStops(newStops);
    updateGradient();
  };

  const addStop = () => {
    if (stops.length < 5) {
      // Limitar a 5 stops
      // Encontrar uma posição intermediária
      const positions = stops.map((stop) => stop.position);
      const min = Math.min(...positions);
      const max = Math.max(...positions);
      const middle = Math.round((min + max) / 2);

      setStops([...stops, { color: '#FFFFFF', position: middle }]);
      updateGradient();
    }
  };

  const removeStop = (index: number) => {
    if (stops.length > 2) {
      // Manter pelo menos 2 stops
      const newStops = [...stops];
      newStops.splice(index, 1);
      setStops(newStops);
      updateGradient();
    }
  };

  const computedGradient = (() => {
    const sortedStops = [...stops].sort((a, b) => a.position - b.position);
    if (gradientType === 'linear') {
      return `linear-gradient(${angle}deg, ${sortedStops
        .map((stop) => `${stop.color} ${stop.position}%`)
        .join(', ')})`;
    } else {
      return `radial-gradient(circle, ${sortedStops
        .map((stop) => `${stop.color} ${stop.position}%`)
        .join(', ')})`;
    }
  })();

  const gradientStyle = {
    background: computedGradient,
  };

  return (
    <FieldWrapper>
      {label && <LabelArea label={label} htmlFor={id} required={required} />}

      <div className="flex items-center gap-2 w-full">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-10 h-10 p-0 border-2"
              style={gradientStyle}
            />
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="flex flex-col gap-4">
              <div className="h-20 rounded-md" style={gradientStyle}></div>

              <Tabs defaultValue="type" className="w-full">
                <TabsList className="grid grid-cols-2">
                  <TabsTrigger value="type">Tipo</TabsTrigger>
                  <TabsTrigger value="stops">Cores</TabsTrigger>
                </TabsList>

                <TabsContent value="type" className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Tipo de Gradiente
                    </label>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant={
                          gradientType === 'linear' ? 'default' : 'outline'
                        }
                        className="flex-1"
                        onClick={() => {
                          setGradientType('linear');
                          updateGradient();
                        }}
                      >
                        Linear
                      </Button>
                      <Button
                        type="button"
                        variant={
                          gradientType === 'radial' ? 'default' : 'outline'
                        }
                        className="flex-1"
                        onClick={() => {
                          setGradientType('radial');
                          updateGradient();
                        }}
                      >
                        Radial
                      </Button>
                    </div>
                  </div>

                  {gradientType === 'linear' && (
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <label className="text-sm font-medium">Ângulo</label>
                        <span className="text-sm">{angle}°</span>
                      </div>
                      <Slider
                        value={[angle]}
                        min={0}
                        max={360}
                        step={1}
                        onValueChange={(value) => {
                          setAngle(value[0]);
                          updateGradient();
                        }}
                      />
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="stops" className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-medium">
                        Pontos de Cor
                      </label>
                      {stops.length < 5 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={addStop}
                        >
                          Adicionar
                        </Button>
                      )}
                    </div>

                    <div className="space-y-3">
                      {stops.map((stop, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Input
                            type="color"
                            value={stop.color}
                            onChange={(e) =>
                              handleStopColorChange(index, e.target.value)
                            }
                            className="w-10 h-10 p-1"
                          />

                          <div className="flex-1 space-y-1">
                            <div className="flex justify-between text-xs">
                              <span>Posição</span>
                              <span>{stop.position}%</span>
                            </div>
                            <Slider
                              value={[stop.position]}
                              min={0}
                              max={100}
                              step={1}
                              onValueChange={(value) =>
                                handleStopPositionChange(index, value[0])
                              }
                            />
                          </div>

                          {stops.length > 2 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => removeStop(index)}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </PopoverContent>
        </Popover>

        <Input
          value={field.state.value || ''}
          onChange={(e) => field.setValue(e.target.value)}
          className="font-mono text-sm"
          readOnly
        />
      </div>

      {description && (
        <span className="text-sm text-muted-foreground">{description}</span>
      )}
      <FieldError />
    </FieldWrapper>
  );
};

export default GradientPickerField;
