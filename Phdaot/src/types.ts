export type Priority = "Low" | "Medium" | "High" | "Critical";
export type Status = "Todo" | "In Progress" | "Done" | "Blocked";
export type Owner = "Me" | "Team member" | string;
export type Source = "meeting" | "manual" | "imported";
export type Tag = "bug" | "enhancement" | "project" | string;

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: Priority;
  status: Status;
  owner: Owner;
  deadline?: string; // ISO date string
  source: Source;
  tags: Tag[];
  createdAt: string; // ISO date string
}
