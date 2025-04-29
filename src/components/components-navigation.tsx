import { cn } from '@/lib/utils';
import { Button } from './ui/button';

interface ComponentsNavigationProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

interface NavItem {
  title: string;
  id: string;
  description?: string;
  items: { title: string; id: string; disabled?: boolean }[];
}

const navigationItems: NavItem[] = [
  {
    title: 'Text Inputs',
    id: 'text',
    items: [
      { title: 'Basic Text Inputs', id: 'text-inputs' },
      { title: 'Advanced Text', id: 'advanced-text' },
    ],
  },
  {
    title: 'Number Inputs',
    id: 'number',
    items: [{ title: 'Numeric Inputs', id: 'numeric-inputs' }],
  },
  {
    title: 'Date & Time',
    id: 'datetime',
    items: [{ title: 'Date & Time Pickers', id: 'date-time' }],
  },
  {
    title: 'Selection',
    id: 'selection',
    items: [{ title: 'Selection Components', id: 'selection' }],
  },
  {
    title: 'Media & Files',
    id: 'media',
    items: [
      { title: 'File Upload', id: 'file-upload' },
      { title: 'Media Capture', id: 'media-capture' },
    ],
  },
  {
    title: 'Visual & Aesthetic',
    id: 'visual',
    items: [
      { title: 'Color & Theme', id: 'color-theme' },
      { title: 'Avatar & Icons', id: 'avatar-icons' },
    ],
  },
  {
    title: 'Geographic',
    id: 'geographic',
    items: [
      { title: 'Location Inputs', id: 'location' },
      { title: 'Map Selection', id: 'map-selection' },
    ],
  },
  {
    title: 'Complex Fields',
    id: 'complex',
    items: [
      { title: 'Dynamic Forms', id: 'dynamic-forms' },
      { title: 'Compound Fields', id: 'compound-fields' },
    ],
  },
  {
    title: 'Interactive UX',
    id: 'interactive',
    items: [
      { title: 'Rating & Feedback', id: 'rating' },
      { title: 'Progress & Steps', id: 'progress' },
    ],
  },
  {
    title: 'System Controls',
    id: 'system',
    items: [{ title: 'Form Controls', id: 'form-controls' }],
  },
  {
    title: 'Specialized',
    id: 'specialized',
    items: [{ title: 'Special Inputs', id: 'special-inputs' }],
  },
];

export default function ComponentsNavigation({
  selectedCategory,
  onSelectCategory,
}: ComponentsNavigationProps) {
  return (
    <div className="relative pb-4">
      <div className="space-y-4">
        {navigationItems.map((section) => (
          <div key={section.id} className="px-3">
            <h3 className="mb-2 text-sm font-medium">{section.title}</h3>
            {section.description && (
              <p className="text-sm text-muted-foreground">
                {section.description}
              </p>
            )}
            <div className="space-y-1 mt-2">
              {section.items.map((item) => (
                <Button
                  key={item.id}
                  variant={selectedCategory === item.id ? 'secondary' : 'ghost'}
                  className={cn(
                    'w-full justify-start font-normal',
                    selectedCategory === item.id
                      ? 'font-medium'
                      : 'font-normal',
                    item.disabled && 'opacity-60',
                  )}
                  disabled={item.disabled}
                  onClick={() => onSelectCategory(item.id)}
                >
                  {item.title}
                </Button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
