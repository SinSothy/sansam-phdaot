import { KanbanBoard } from "@/components/workspaces/KanbanBoard";

export default function PlannerPage() {
  return (
    <div className="w-[calc(100%+4rem)] h-[calc(100vh-64px)] -m-8 bg-surface">
      <KanbanBoard />
    </div>
  );
}
