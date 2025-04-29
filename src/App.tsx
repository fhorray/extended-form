import { MoonIcon, SunIcon } from 'lucide-react';
import { useState } from 'react';
import ComponentsNavigation from './components/components-navigation';
import ShowcaseContainer from './components/showcase-container';
import AdvancedTextShowcase from './components/showcase/advanced-text-showcase';
import NumericInputsShowcase from './components/showcase/numeric-showcase';
import TextInputsShowcase from './components/showcase/text-input-showcase';
import { Button } from './components/ui/button';
import { ScrollArea } from './components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { useTheme } from './hooks/use-theme';

const showcaseMap: Record<string, React.ReactNode> = {
  'text-inputs': <TextInputsShowcase />,
  'advanced-text': <AdvancedTextShowcase />,
  'numeric-inputs': <NumericInputsShowcase />,
  // 'date-time': <DateTimeShowcase />,
  // 'selection': <SelectionShowcase />,
  // 'file-upload': <FileUploadShowcase />,
  // 'media-capture': <MediaCaptureShowcase />,
  // 'color-theme': <ColorThemeShowcase />,
  // 'avatar-icons': <AvatarIconsShowcase />,
  // 'location': <LocationShowcase />,
  // 'map-selection': <MapSelectionShowcase />,
  // 'dynamic-forms': <DynamicFormsShowcase />,
  // 'compound-fields': <CompoundFieldsShowcase />,
  // 'rating': <RatingShowcase />,
  // 'progress': <ProgressShowcase />,
  // 'form-controls': <FormControlsShowcase />,
  // 'special-inputs': <SpecialInputsShowcase />,
};

function App() {
  const [selectedCategory, setSelectedCategory] = useState('text-inputs');
  const { theme, setTheme } = useTheme();
  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-14 items-center">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-semibold tracking-tight">
              Form Components Library
            </h1>
          </div>
          <div className="ml-auto flex items-center space-x-4">
            <Button variant="outline" size="icon" onClick={toggleTheme}>
              {theme === 'dark' ? (
                <SunIcon className="h-5 w-5" />
              ) : (
                <MoonIcon className="h-5 w-5" />
              )}
              <span className="sr-only">Toggle theme</span>
            </Button>
          </div>
        </div>
      </header>
      <div className=" mx-auto container py-6 flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[240px_minmax(0,1fr)]">
        <aside className="overflow-y-hidden fixed top-14 z-30 -ml-2 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 border-r md:sticky md:block">
          <ScrollArea className="py-6 lg:py-8 h-full">
            <ComponentsNavigation
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />
          </ScrollArea>
        </aside>
        <main className="flex w-full flex-col overflow-hidden">
          <div className="hidden items-start md:flex">
            <Tabs defaultValue="preview" className="w-full">
              <div className="flex items-center justify-between">
                <TabsList>
                  <TabsTrigger value="preview">Preview</TabsTrigger>
                  <TabsTrigger value="code">Code</TabsTrigger>
                </TabsList>
              </div>
              <TabsContent value="preview" className="border-none p-0">
                <ShowcaseContainer>
                  {showcaseMap[selectedCategory]}
                </ShowcaseContainer>
              </TabsContent>
              <TabsContent value="code" className="border-none p-0">
                <ShowcaseContainer>
                  <div className="p-4">
                    <h2 className="text-xl font-semibold mb-4">
                      Implementation Code
                    </h2>
                    <p className="text-muted-foreground mb-4">
                      Component source code can be found in the
                      <code className="bg-muted px-1 mx-1 rounded">
                        src/components/form
                      </code>
                      directory, organized by category.
                    </p>
                  </div>
                </ShowcaseContainer>
              </TabsContent>
            </Tabs>
          </div>

          <div className="block md:hidden">
            <ShowcaseContainer>TEST</ShowcaseContainer>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
