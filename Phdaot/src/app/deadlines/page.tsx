import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function DeadlinesPage() {
  return (
    <div className="flex flex-col h-full w-full max-w-6xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Deadlines Tracker</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Feature Placeholder: Calendar or list view highlighting critical and overdue tasks.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
