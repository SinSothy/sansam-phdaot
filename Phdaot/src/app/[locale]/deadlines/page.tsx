import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useTranslations } from "next-intl";

export default function DeadlinesPage() {
  const t = useTranslations('Deadlines');

  return (
    <div className="flex flex-col h-full w-full max-w-6xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{t('title')}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            {t('placeholder')}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
