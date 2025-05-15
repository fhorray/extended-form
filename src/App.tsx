'use client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import UploadsShowcase from '@/components/showcases/uploads-showcase';
import VisualShowcase from '@/components/showcases/visual-showcase';
import ComplexFieldsShowcase from '@/components/showcases/complex-fields-showcase';
import InteractiveShowcase from '@/components/showcases/interactive-showcase';
import SystemShowcase from '@/components/showcases/system-showcase';
import SpecializedShowcase from '@/components/showcases/specialized-showcase';

export default function Home() {
  return (
    <main className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Tanstack React Form - Componentes
      </h1>

      <Tabs defaultValue="uploads" className="w-full">
        <TabsList className="grid grid-cols-7 mb-8">
          <TabsTrigger value="uploads">Uploads e Mídia</TabsTrigger>
          <TabsTrigger value="visual">Visual/Cor</TabsTrigger>
          <TabsTrigger value="complex">Campos Complexos</TabsTrigger>
          <TabsTrigger value="interactive">Interativos</TabsTrigger>
          <TabsTrigger value="system">Sistema</TabsTrigger>
          <TabsTrigger value="specialized">Especializados</TabsTrigger>
        </TabsList>

        <Card>
          <CardHeader>
            <CardTitle id="showcase-title">Uploads e Mídia</CardTitle>
            <CardDescription id="showcase-description">
              Componentes para upload e manipulação de arquivos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TabsContent value="uploads">
              <UploadsShowcase />
            </TabsContent>

            <TabsContent value="visual">
              <VisualShowcase />
            </TabsContent>

            <TabsContent value="complex">
              <ComplexFieldsShowcase />
            </TabsContent>

            <TabsContent value="interactive">
              <InteractiveShowcase />
            </TabsContent>

            <TabsContent value="system">
              <SystemShowcase />
            </TabsContent>

            <TabsContent value="specialized">
              <SpecializedShowcase />
            </TabsContent>
          </CardContent>
        </Card>
      </Tabs>
    </main>
  );
}
