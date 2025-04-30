import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface ToolbarButtonProps {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  label: string;
  onClick?: () => void;
  isActive?: boolean;
  disabled?: boolean;
  tooltip?: string;
  className?: string;
}

export const ToolbarButton = ({
  icon: Icon,
  label,
  onClick,
  isActive = false,
  disabled = false,
  tooltip,
  className,
}: ToolbarButtonProps) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              'h-8 w-8 p-0 rounded-md',
              isActive && 'bg-secondary text-secondary-foreground',
              'transition-all duration-200 hover:scale-105',
              className,
            )}
            onClick={onClick}
            disabled={disabled}
            aria-label={label}
          >
            <Icon className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p className="text-xs">{tooltip ?? label}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
