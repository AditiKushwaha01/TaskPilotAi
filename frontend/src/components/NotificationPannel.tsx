import type { Task } from "../types/task";

type Props = {
  tasks: Task[];
};

export default function NotificationPanel({ tasks }: Props) {

  const getMessage = (t: Task) => {
    switch (t.status) {
      case "PENDING":
        return `📌 New task assigned: ${t.title || t.name}`;
      case "COMPLETED":
        return `✅ Completed: ${t.title || t.name}`;
      case "REJECTED":
        return `❌ Rejected: ${t.title || t.name}`;
      case "DELAYED":
        return `⚠ Delayed: ${t.title || t.name}`;
      default:
        return null;
    }
  };

  if (!tasks || tasks.length === 0) {
    return (
      <div className="bg-white p-4 rounded-xl shadow text-sm text-gray-500">
        No notifications yet
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-xl shadow w-72">
      <h2 className="font-semibold mb-3">Notifications</h2>

      <div className="space-y-2 max-h-64 overflow-y-auto">
        {tasks.map((t) => {
          const message = getMessage(t);

          if (!message) return null;

          return (
            <div
              key={t.id}
              className="text-sm p-2 rounded hover:bg-gray-50 transition"
            >
              <p>{message}</p>

              {/* 🔥 Future ready (timestamp) */}
              {t.deadline && (
                <p className="text-xs text-gray-400">
                  Deadline: {t.deadline}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}