export type TaskStatus = "PENDING" | "COMPLETED" | "DELAYED" | "REJECTED";

export type Task = {
  id: number;
  title?: string;
  name?: string;
  owner: string;
  status: TaskStatus;
  deadline?: string;
  priority?: "Low" | "Medium" | "High";
};

export type Meeting = {
  id: number;
  title?: string;
  createdAt?: string;
};

export type Notification = {
  id: string;
  message: string;
  type: "PENDING" | "COMPLETED" | "DELAYED" | "REJECTED" | "INFO";
  taskTitle?: string;
  deadline?: string;
  read: boolean;
  time: number;
};

export type ActivityLog = {
  id: string;
  agent: string;
  action: string;
  detail: string;
  status: "success" | "error" | "info" | "warn";
  timestamp: number;
  timeStr: string;
};
