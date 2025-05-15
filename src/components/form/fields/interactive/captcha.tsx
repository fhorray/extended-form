'use client';

import type React from 'react';

import { useFieldContext } from '@/contexts/form-context';
import { FieldError } from '@/components/form/fields/error';
import { LabelArea } from '@/components/form/fields/label';
import { FieldWrapper } from '@/components/form/fields/wrapper';
import { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

interface CaptchaProps {
  label?: string;
  id: string;
  description?: string;
  required?: boolean;
}

const CaptchaField = ({ label, id, description, required }: CaptchaProps) => {
  const field = useFieldContext<string>();
  const [value, setValue] = useState<string>(field.state.value || '');
  const [captchaText, setCaptchaText] = useState<string>('');
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (field.state.value) {
      setValue(field.state.value);
    }
  }, [field.state.value]);

  useEffect(() => {
    generateCaptcha();
  }, []);

  const generateCaptcha = () => {
    // Gerar texto aleatório para o captcha
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
    let captcha = '';
    for (let i = 0; i < 6; i++) {
      captcha += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaText(captcha);

    // Desenhar o captcha no canvas
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#f5f5f5';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Adicionar ruído (pontos)
        for (let i = 0; i < 100; i++) {
          ctx.fillStyle = `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.3)`;
          ctx.fillRect(
            Math.random() * canvas.width,
            Math.random() * canvas.height,
            2,
            2,
          );
        }

        // Adicionar linhas
        for (let i = 0; i < 5; i++) {
          ctx.beginPath();
          ctx.moveTo(
            Math.random() * canvas.width,
            Math.random() * canvas.height,
          );
          ctx.lineTo(
            Math.random() * canvas.width,
            Math.random() * canvas.height,
          );
          ctx.strokeStyle = `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.3)`;
          ctx.stroke();
        }

        // Desenhar o texto
        ctx.font = 'bold 24px Arial';
        ctx.fillStyle = '#333';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Desenhar cada caractere com rotação aleatória
        const chars = captcha.split('');
        const charWidth = canvas.width / (chars.length + 1);

        chars.forEach((char, i) => {
          ctx.save();
          const x = charWidth * (i + 1);
          const y = canvas.height / 2 + Math.random() * 10 - 5;
          ctx.translate(x, y);
          ctx.rotate(((Math.random() * 30 - 15) * Math.PI) / 180);
          ctx.fillText(char, 0, 0);
          ctx.restore();
        });
      }
    }

    // Resetar o estado
    setValue('');
    setIsValid(null);
    field.setValue('');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setValue(inputValue);
    field.setValue(inputValue);

    // Validar apenas se o usuário digitou algo
    if (inputValue.length > 0) {
      setIsValid(inputValue === captchaText);
    } else {
      setIsValid(null);
    }
  };

  return (
    <FieldWrapper>
      {label && <LabelArea label={label} htmlFor={id} required={required} />}

      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <canvas
            ref={canvasRef}
            width={200}
            height={60}
            className="border rounded-md bg-gray-50"
          />
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={generateCaptcha}
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>

        <Input
          id={id}
          value={value}
          onChange={handleChange}
          placeholder="Digite os caracteres acima"
          className={
            isValid === true
              ? 'border-green-500 focus-visible:ring-green-500'
              : isValid === false
                ? 'border-red-500 focus-visible:ring-red-500'
                : ''
          }
        />

        {isValid === true && (
          <p className="text-sm text-green-600">Captcha válido!</p>
        )}
        {isValid === false && (
          <p className="text-sm text-red-600">
            Captcha inválido. Tente novamente.
          </p>
        )}
      </div>

      {description && (
        <span className="text-sm text-muted-foreground">{description}</span>
      )}
      <FieldError />
    </FieldWrapper>
  );
};

export default CaptchaField;
