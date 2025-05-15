import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useFieldContext } from '../../../../contexts/form-context';
import { FieldError } from '../error';
import { LabelArea } from '../label';
import { FieldWrapper } from '../wrapper';
import { SearchIcon } from 'lucide-react';

interface SearchFieldProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  id: string;
  onSearch?: (value: string) => void;
  placeholder?: string;
  description?: string;
  searchOnChange?: boolean;
  searchIcon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

const SearchField = ({
  label,
  id,
  onSearch,
  description,
  searchOnChange,
  searchIcon,
  ...props
}: SearchFieldProps) => {
  const field = useFieldContext<string>();

  const handleSearch = () => {
    if (onSearch) {
      onSearch(field.state.value);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  };

  const CustomSearchIcon = searchIcon;

  return (
    <FieldWrapper>
      {label && (
        <LabelArea label={label} htmlFor={id} required={props.required} />
      )}

      <div className="relative w-full flex items-center">
        <Input
          id={id}
          type="text"
          role="searchbox"
          defaultValue={field.state.value}
          onChange={(e) => field.setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className={cn('pr-16', props.className)}
          {...props}
        />
        {searchIcon && (
          <Button
            type="button"
            variant={'outline'}
            size={'icon'}
            onClick={handleSearch}
            className=" absolute right-0 opacity-45 hover:cursor-pointer"
          >
            {CustomSearchIcon ? <CustomSearchIcon /> : <SearchIcon />}
          </Button>
        )}
      </div>

      {description && <span className="text-sm opacity-45">{description}</span>}
      <FieldError />
    </FieldWrapper>
  );
};

export default SearchField;
