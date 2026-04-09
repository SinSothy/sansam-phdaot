import { KanbanBoard } from "@/components/workspaces/KanbanBoard";
import { setRequestLocale } from "next-intl/server";

export default async function BoardPage(props: {
  params: Promise<{ locale: string; boardId: string }>;
}) {
  const { locale, boardId } = await props.params;

  // Enable static rendering
  setRequestLocale(locale);

  return (
    <div className="w-[calc(100%+4rem)] h-[calc(100vh-64px)] -m-8 bg-surface">
      <KanbanBoard boardId={boardId} />
    </div>
  );
}
