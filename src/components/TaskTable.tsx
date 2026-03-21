import { useEffect, useState, useCallback } from "react";
import type { Task } from "../types/task";
import { motion } from "framer-motion";
import { getTasks, updateTaskStatus } from "../services/api";

export default function TaskTable({
  refresh,
  tasks: externalTasks,
}: {
  refresh?: number;
  tasks?: Task[];
}) {
  const [tasks, setTasks] = useState<Task[]>(externalTasks || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 🔥 Only fetch if tasks NOT passed
  const fetchTasks = useCallback(async () => {
    if (externalTasks) return; // ✅ skip fetch if controlled

    setLoading(true);
    setError(null);

    try {
      const data = await getTasks();
      setTasks(data || []);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to fetch tasks");
    } finally {
      setLoading(false);
    }
  }, [externalTasks]);

  // 🔥 Sync external tasks
  useEffect(() => {
    if (externalTasks) {
      setTasks(externalTasks);
    }
  }, [externalTasks]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks, refresh]);

  // 🔥 Update status
  const handleUpdate = async (id: number, status: Task["status"]) => {
  try {
    await updateTaskStatus(id, status);

    setTasks((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, status } : t
      )
    );

    if (!externalTasks) fetchTasks();

  } catch (err: any) {
    alert(err.message);
  }
};
  const getStatusStyle = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "bg-green-100 text-green-600";
      case "PENDING":
        return "bg-yellow-100 text-yellow-600";
      case "DELAYED":
        return "bg-red-100 text-red-600";
      case "REJECTED":
        return "bg-gray-200 text-gray-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold text-lg">Tasks</h2>
        <span className="text-sm text-gray-500">
          {tasks.length} total
        </span>
      </div>

      {loading && (
        <p className="text-sm text-gray-500">Loading tasks...</p>
      )}

      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}

      {!loading && !error && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-500 border-b">
                <th className="text-left py-3">Task</th>
                <th className="text-left py-3">Owner</th>
                <th className="text-left py-3">Status</th>
                <th className="text-left py-3">Action</th>
              </tr>
            </thead>

            <tbody>
              {tasks.map((t) => (
                <motion.tr
                  key={t.id}
                  whileHover={{ scale: 1.01 }}
                  className="border-b last:border-none"
                >
                  <td className="py-4 font-medium">
                    {t.title || t.name}
                  </td>

                  <td className="py-4 text-gray-600">
                    {t.owner}
                  </td>

                  <td className="py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(
                        t.status
                      )}`}
                    >
                      {t.status}
                    </span>
                  </td>

                  <td className="py-4 space-x-2">
                    {t.status !== "COMPLETED" && (
                      <button
                        onClick={() => handleUpdate(t.id, "COMPLETED")}
                        className="text-green-600 text-xs"
                      >
                        Done
                      </button>
                    )}

                    {t.status !== "REJECTED" && (
                      <button
                        onClick={() => handleUpdate(t.id, "REJECTED")}
                        className="text-red-600 text-xs"
                      >
                        Reject
                      </button>
                    )}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}