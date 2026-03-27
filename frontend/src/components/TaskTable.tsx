import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Task } from "../types/task";
import { getTasks, updateTaskStatus } from "../services/api";

type Props = {
  refresh?: number;
  tasks?: Task[];
};

const STATUS_STYLES: Record<string, string> = {
  COMPLETED: "bg-green-100 text-green-700",
  PENDING: "bg-yellow-100 text-yellow-700",
  DELAYED: "bg-red-100 text-red-600",
  REJECTED: "bg-gray-200 text-gray-500",
};

const PRIORITY_STYLES: Record<string, string> = {
  High: "bg-red-50 text-red-600",
  Medium: "bg-yellow-50 text-yellow-600",
  Low: "bg-green-50 text-green-600",
};

export default function TaskTable({ refresh, tasks: externalTasks }: Props) {
  const [tasks, setTasks] = useState<Task[]>(externalTasks || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const fetchTasks = useCallback(async () => {
    if (externalTasks) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getTasks();
      setTasks(data || []);
    } catch (err: any) {
      setError(err.message || "Failed to fetch tasks");
    } finally {
      setLoading(false);
    }
  }, [externalTasks]);

  useEffect(() => {
    if (externalTasks) setTasks(externalTasks);
  }, [externalTasks]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks, refresh]);

  const handleUpdate = async (id: number, status: Task["status"]) => {
    setUpdatingId(id);
    try {
      await updateTaskStatus(id, status);
      setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)));
    } catch (err: any) {
      alert(err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) return (
    <div className="space-y-2">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-12 bg-gray-100 rounded-xl animate-pulse" />
      ))}
    </div>
  );

  if (error) return (
    <div className="text-red-500 text-sm p-3 bg-red-50 rounded-xl">{error}</div>
  );

  if (!tasks.length) return (
    <div className="text-center py-10 text-gray-400 text-sm">
      <p className="text-3xl mb-2">✓</p>
      <p>No tasks yet. Process a meeting to generate tasks.</p>
    </div>
  );

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="flex justify-between items-center px-5 py-4 border-b border-gray-100">
        <h2 className="font-semibold text-sm">Tasks</h2>
        <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-lg">
          {tasks.length} total
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs text-gray-400 uppercase tracking-wide border-b border-gray-100">
              <th className="text-left px-5 py-3 font-medium">Task</th>
              <th className="text-left px-5 py-3 font-medium">Owner</th>
              <th className="text-left px-5 py-3 font-medium">Priority</th>
              <th className="text-left px-5 py-3 font-medium">Deadline</th>
              <th className="text-left px-5 py-3 font-medium">Status</th>
              <th className="text-left px-5 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {tasks.map((t) => (
                <motion.tr
                  key={t.id}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="border-b border-gray-50 last:border-none hover:bg-gray-50/50 transition-colors"
                >
                  <td className="px-5 py-3.5 font-medium text-gray-800">
                    {t.title || t.name}
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold">
                        {(t.owner?.[0] || "?").toUpperCase()}
                      </div>
                      <span className="text-gray-600 text-xs">{t.owner}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`text-xs px-2 py-1 rounded-lg font-medium ${PRIORITY_STYLES[t.priority || "Medium"]}`}>
                      {t.priority || "Medium"}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-xs text-gray-400 font-mono">
                    {t.deadline || "—"}
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${STATUS_STYLES[t.status] || "bg-gray-100 text-gray-500"}`}>
                      {t.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex gap-2">
                      {t.status !== "COMPLETED" && (
                        <button
                          onClick={() => handleUpdate(t.id, "COMPLETED")}
                          disabled={updatingId === t.id}
                          className="text-xs text-green-600 hover:text-green-800 font-medium disabled:opacity-40 transition"
                        >
                          Done
                        </button>
                      )}
                      {t.status !== "REJECTED" && (
                        <button
                          onClick={() => handleUpdate(t.id, "REJECTED")}
                          disabled={updatingId === t.id}
                          className="text-xs text-red-400 hover:text-red-600 font-medium disabled:opacity-40 transition"
                        >
                          Reject
                        </button>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </div>
  );
}
