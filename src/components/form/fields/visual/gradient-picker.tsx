'use client';

import { useFieldContext } from '@/contexts/form-context';
import { Input } from '@/components/ui/input';
import { FieldError } from '@/components/form/fields/error';
import { LabelArea } from '@/components/form/fields/label';
import { FieldWrapper } from '@/components/form/fields/wrapper';
import { useState, useCallback, useMemo } from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Copy, Check, Plus, X, Palette } from 'lucide-react';
import { HexColorPicker } from 'react-colorful';

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
  const [copied, setCopied] = useState(false);
  const [activeStopIndex, setActiveStopIndex] = useState<number | null>(null);

  const [stops, setStops] = useState<GradientStop[]>([
    { color: '#6366F1', position: 0 },
    { color: '#EC4899', position: 100 },
  ]);

  const gradientString = useMemo(() => {
    const sortedStops = [...stops].sort((a, b) => a.position - b.position);
    if (gradientType === 'linear') {
      return `linear-gradient(${angle}deg, ${sortedStops.map((stop) => `${stop.color} ${stop.position}%`).join(', ')})`;
    }
    return `radial-gradient(circle, ${sortedStops.map((stop) => `${stop.color} ${stop.position}%`).join(', ')})`;
  }, [stops, angle, gradientType]);

  const updateGradient = useCallback(() => {
    field.setValue(gradientString);
  }, [gradientString, field]);

  const handleStopColorChange = useCallback((index: number, color: string) => {
    setStops((prev) => {
      const updated = [...prev];
      updated[index].color = color;
      return updated;
    });
  }, []);

  const handleStopPositionChange = useCallback(
    (index: number, position: number) => {
      setStops((prev) => {
        const updated = [...prev];
        updated[index].position = position;
        return updated;
      });
    },
    [],
  );

  const addStop = useCallback(() => {
    if (stops.length < 5) {
      const positions = stops.map((s) => s.position);
      const middle = Math.round(
        (Math.min(...positions) + Math.max(...positions)) / 2,
      );
      setStops([...stops, { color: '#FFFFFF', position: middle }]);
    }
  }, [stops]);

  const removeStop = useCallback(
    (index: number) => {
      if (stops.length > 2) {
        setStops((prev) => prev.filter((_, i) => i !== index));
      }
    },
    [stops],
  );

  const handleCopy = () => {
    navigator.clipboard.writeText(field.state.value || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const gradientStyle = { background: gradientString };

  // Atualiza valor quando `gradientString` muda
  useMemo(() => {
    updateGradient();
  }, [gradientString, updateGradient]);

  return (
    <FieldWrapper>
      {label && <LabelArea label={label} htmlFor={id} required={required} />}
      <div className="flex items-center gap-3 w-full">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="relative w-12 h-12 p-0 rounded-md transition-all duration-200 hover:scale-105 active:scale-95 overflow-hidden"
              style={gradientStyle}
            >
              <div className="absolute inset-0 opacity-20 bg-[linear-gradient(45deg,#ccc_25%,transparent_25%,transparent_75%,#ccc_75%,#ccc),linear-gradient(45deg,#ccc_25%,transparent_25%,transparent_75%,#ccc_75%,#ccc)] bg-[length:10px_10px] bg-[position:0_0,5px_5px]"></div>
              <Palette
                className="absolute bottom-1 right-1 text-white/70"
                size={12}
              />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-4 animate-in fade-in zoom-in-95">
            <div className="flex flex-col gap-4">
              <div
                className="h-24 rounded-lg shadow-inner relative"
                style={gradientStyle}
              >
                <div className="absolute inset-0 opacity-20 pointer-events-none bg-[linear-gradient(45deg,#ccc_25%,transparent_25%,transparent_75%,#ccc_75%,#ccc),linear-gradient(45deg,#ccc_25%,transparent_25%,transparent_75%,#ccc_75%,#ccc)] bg-[length:10px_10px] bg-[position:0_0,5px_5px]"></div>
              </div>

              <Tabs defaultValue="type" className="w-full">
                <TabsList className="grid grid-cols-2 mb-4">
                  <TabsTrigger value="type">Type</TabsTrigger>
                  <TabsTrigger value="stops">Colors</TabsTrigger>
                </TabsList>

                <TabsContent value="type" className="space-y-6">
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-gray-700">
                      Gradient Type
                    </label>
                    <div className="flex gap-2">
                      {['linear', 'radial'].map((type) => (
                        <Button
                          key={type}
                          type="button"
                          variant={
                            gradientType === type ? 'default' : 'outline'
                          }
                          className="flex-1"
                          onClick={() =>
                            setGradientType(type as 'linear' | 'radial')
                          }
                        >
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {gradientType === 'linear' && (
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <label className="text-sm font-medium text-gray-700">
                          Angle
                        </label>
                        <span className="text-sm text-gray-500">{angle}°</span>
                      </div>
                      <Slider
                        value={[angle]}
                        min={0}
                        max={360}
                        step={1}
                        onValueChange={(value) => setAngle(value[0])}
                      />
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="stops" className="space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-medium text-gray-700">
                      Color Stops
                    </label>
                    {stops.length < 5 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={addStop}
                        className="h-8 px-3"
                      >
                        <Plus size={14} className="mr-1" /> Add Stop
                      </Button>
                    )}
                  </div>

                  <div className="space-y-4">
                    {stops.map((stop, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 cursor-pointer rounded border"
                          onClick={() => setActiveStopIndex(index)}
                          style={{ backgroundColor: stop.color }}
                        />

                        <div className="flex-1 space-y-1">
                          <div className="flex justify-between text-xs text-gray-500">
                            <span>Position</span>
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
                            className="h-8 w-8 text-gray-500 hover:text-red-500"
                          >
                            <X size={14} />
                          </Button>
                        )}
                      </div>
                    ))}

                    {activeStopIndex !== null && (
                      <div className="mt-4">
                        <HexColorPicker
                          color={stops[activeStopIndex].color}
                          onChange={(color) =>
                            handleStopColorChange(activeStopIndex, color)
                          }
                        />
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </PopoverContent>
        </Popover>

        <div className="flex-1 relative">
          <Input
            value={field.state.value || ''}
            onChange={(e) => field.setValue(e.target.value)}
            className="font-mono text-sm pr-10"
            readOnly
          />
          <button
            type="button"
            onClick={handleCopy}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-md hover:bg-gray-100 active:bg-gray-200"
          >
            {copied ? (
              <Check size={16} className="text-green-500" />
            ) : (
              <Copy size={16} className="text-gray-500" />
            )}
          </button>
        </div>
      </div>

      {description && (
        <span className="text-sm text-muted-foreground mt-1">
          {description}
        </span>
      )}
      <FieldError />
    </FieldWrapper>
  );
};

export default GradientPickerField;
