export type Task = {
  name: string;
  owner: string;
  deadline?: string;
  status: "Pending" | "In Progress" | "Completed" | "Escalated";
  priority?: "Low" | "Medium" | "High";
};