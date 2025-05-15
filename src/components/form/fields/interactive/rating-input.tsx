'use client';

import { useFieldContext } from '@/contexts/form-context';
import { FieldError } from '@/components/form/fields/error';
import { LabelArea } from '@/components/form/fields/label';
import { FieldWrapper } from '@/components/form/fields/wrapper';
import { useState, useEffect } from 'react';
import { Star, Heart } from 'lucide-react';

interface RatingInputProps {
  label?: string;
  id: string;
  description?: string;
  maxRating?: number;
  icon?: 'star' | 'heart';
  required?: boolean;
}

const RatingInputField = ({
  label,
  id,
  description,
  maxRating = 5,
  icon = 'star',
  required,
}: RatingInputProps) => {
  const field = useFieldContext<number>();
  const [rating, setRating] = useState(field.state.value || 0);
  const [hoverRating, setHoverRating] = useState(0);

  useEffect(() => {
    if (field.state.value !== undefined) {
      setRating(field.state.value);
    }
  }, [field.state.value]);

  const handleSetRating = (value: number) => {
    setRating(value);
    field.setValue(value);
  };

  const IconComponent = icon === 'heart' ? Heart : Star;

  return (
    <FieldWrapper>
      {label && <LabelArea label={label} htmlFor={id} required={required} />}

      <div className="flex items-center gap-1">
        {[...Array(maxRating)].map((_, index) => {
          const ratingValue = index + 1;
          return (
            <button
              type="button"
              key={ratingValue}
              className={`text-2xl transition-colors ${
                ratingValue <= (hoverRating || rating)
                  ? icon === 'heart'
                    ? 'text-red-500'
                    : 'text-yellow-400'
                  : 'text-gray-300'
              }`}
              onClick={() => handleSetRating(ratingValue)}
              onMouseEnter={() => setHoverRating(ratingValue)}
              onMouseLeave={() => setHoverRating(0)}
            >
              <IconComponent className="w-6 h-6 fill-current" />
            </button>
          );
        })}
        <span className="ml-2 text-sm">
          {rating > 0 ? `${rating} de ${maxRating}` : 'Sem avaliação'}
        </span>
      </div>

      {description && (
        <span className="text-sm text-muted-foreground">{description}</span>
      )}
      <FieldError />
    </FieldWrapper>
  );
};

export default RatingInputField;
