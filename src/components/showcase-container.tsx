import { Card } from './ui/card';

interface ShowcaseContainerProps {
  children: React.ReactNode;
}

export default function ShowcaseContainer({
  children,
}: ShowcaseContainerProps) {
  return (
    <Card className="rounded-md border bg-card text-card-foreground shadow w-full overflow-hidden">
      <div className="flex flex-col space-y-1.5 p-6">
        <div className="flex flex-col gap-2">{children}</div>
      </div>
    </Card>
  );
}
