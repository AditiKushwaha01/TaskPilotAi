export type TaskStatus =
  | "PENDING"
  | "COMPLETED"
  | "DELAYED"
  | "REJECTED";

export type Task = {
  id: number;
  title?: string;
  name?: string;
  owner: string;
  status: TaskStatus; // ✅ strict type
  deadline?: string;
  priority?: "Low" | "Medium" | "High";
};