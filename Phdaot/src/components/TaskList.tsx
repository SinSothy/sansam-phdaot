"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { Badge } from "./ui/badge";
import { Task, Priority, Status } from "../types";
import { cn } from "@/lib/utils";

import { Clock } from "lucide-react";

const initialTasks: Task[] = [
  {
    id: "1",
    title: "Fix home menu reorder",
    priority: "High",
    status: "Todo",
    owner: "Me",
    source: "manual",
    tags: ["bug"],
    deadline: "2026-03-20T17:00:00Z", // Yesterday - Overdue / Carry-over
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Demo pilot plan",
    priority: "Medium",
    status: "In Progress",
    owner: "Team member",
    source: "meeting",
    tags: ["project"],
    deadline: "2026-03-21T16:00:00Z", // Today - Due soon
    createdAt: new Date().toISOString(),
  },
  {
    id: "3",
    title: "Write documentation",
    priority: "Low",
    status: "Todo",
    owner: "Me",
    source: "manual",
    tags: ["chore"],
    deadline: "2026-03-25T12:00:00Z", // Future
    createdAt: new Date().toISOString(),
  },
];

export function TaskList() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [noteInput, setNoteInput] = useState("");

  const handleConvertNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteInput.trim()) return;

    // Simple NLP mockup: splitting by "and" or newlines to extract tasks
    const newTitles = noteInput.split(/\n| and /i).map((t) => t.trim()).filter(Boolean);
    
    const newTasks: Task[] = newTitles.map((title) => ({
      id: Math.random().toString(36).substr(2, 9),
      title,
      priority: "Medium" as Priority,
      status: "Todo" as Status,
      owner: "Me",
      source: "manual",
      tags: [],
      createdAt: new Date().toISOString(),
    }));

    setTasks([...newTasks, ...tasks]);
    setNoteInput("");
  };

  const toggleTaskStatus = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, status: t.status === "Done" ? "Todo" : "Done" } : t));
  };

  const priorityColors: Record<Priority, string> = {
    Low: "bg-slate-500",
    Medium: "bg-blue-500",
    High: "bg-orange-500",
    Critical: "bg-red-500",
  };

  const getDeadlineConfig = (deadline?: string) => {
    if (!deadline) return null;
    const now = new Date("2026-03-21T10:54:27+07:00");
    const due = new Date(deadline);
    const diffHours = (due.getTime() - now.getTime()) / (1000 * 60 * 60);
    
    if (diffHours < 0) return { label: "Overdue", color: "text-red-500", bg: "bg-red-500/10 border-red-500" };
    if (diffHours < 24) return { label: "Due Soon", color: "text-orange-500", bg: "bg-orange-500/10 border-orange-500" };
    return { label: "Upcoming", color: "text-muted-foreground", bg: "bg-secondary text-secondary-foreground" };
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Smart Tasks & Notes</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-4">
        <form onSubmit={handleConvertNote} className="flex gap-2">
          <Input 
            placeholder="Type notes here (e.g. 'Fix login and update UI')..." 
            value={noteInput}
            onChange={(e) => setNoteInput(e.target.value)}
          />
          <Button type="submit">Convert to Tasks</Button>
        </form>

        <div className="flex-1 overflow-y-auto space-y-3">
          {tasks.map((task) => {
            const deadlineConfig = getDeadlineConfig(task.deadline);
            return (
            <div key={task.id} className={`flex items-start gap-4 p-4 border rounded-xl transition-colors ${task.status === "Done" ? "opacity-60 bg-muted/20" : "bg-card hover:bg-muted/50"} ${deadlineConfig?.label === "Overdue" && task.status !== "Done" ? "border-red-500/50 shadow-[0_0_10px_rgba(239,68,68,0.1)]" : "border-border shadow-sm"}`}>
              <Checkbox 
                checked={task.status === "Done"} 
                onCheckedChange={() => toggleTaskStatus(task.id)} 
                className="mt-1 flex-shrink-0"
              />
              <div className="flex-1 space-y-2">
                <div className={`text-base font-semibold ${task.status === "Done" ? "line-through text-muted-foreground" : "text-foreground"}`}>
                  {task.title}
                </div>
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <Badge variant="outline" className={cn(priorityColors[task.priority], "text-white border-transparent")}>
                    {task.priority}
                  </Badge>
                  <Badge variant="secondary" className="bg-secondary/50 text-secondary-foreground border-transparent">
                    {task.owner}
                  </Badge>
                  {deadlineConfig && task.status !== "Done" && (
                    <Badge variant="outline" className={cn(deadlineConfig.bg, deadlineConfig.color, "flex items-center gap-1")}>
                      <Clock className="w-3 h-3" />
                      {deadlineConfig.label}
                    </Badge>
                  )}
                  {task.tags.map(tag => (
                    <Badge key={tag} variant="outline" className="text-muted-foreground border-border bg-background">#{tag}</Badge>
                  ))}
                </div>
              </div>
            </div>
            );
          })}
          {tasks.length === 0 && (
            <div className="text-center text-muted-foreground text-sm py-10">
              No tasks yet. Enter a note to extract tasks!
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
