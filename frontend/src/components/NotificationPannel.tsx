import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import type { Task } from "../types/task";

type Props = {
  tasks: Task[];
  onClose: () => void;
};

const TYPE_CONFIG: Record<string, any> = {
  PENDING: { icon: "📌", bg: "bg-yellow-50", text: "text-yellow-700", label: "Assigned" },
  COMPLETED: { icon: "✅", bg: "bg-green-50", text: "text-green-700", label: "Done" },
  REJECTED: { icon: "❌", bg: "bg-red-50", text: "text-red-600", label: "Rejected" },
  DELAYED: { icon: "⚠️", bg: "bg-orange-50", text: "text-orange-600", label: "Delayed" },
};

export default function NotificationPanel({ tasks, onClose }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);
  
  useEffect(() => {
  const demoMode = localStorage.getItem("demoMode") === "true";

  if (demoMode) {
    setTimeout(() => {
      alert("🔔 New tasks assigned!");
    }, 1000);
  }
}, []);

  const unread = tasks?.filter((t) => t.status === "PENDING").length || 0;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: -8, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.97 }}
      className="bg-white rounded-2xl shadow-xl border w-80"
    >
      {/* HEADER */}
      <div className="flex justify-between px-4 py-3 border-b">
        <span className="font-semibold text-sm">
          Notifications {unread > 0 && `(${unread})`}
        </span>
        <button onClick={onClose}>✕</button>
      </div>

      {/* LIST */}
      <div className="max-h-72 overflow-y-auto">
        {!tasks || tasks.length === 0 ? (
          <div className="text-center py-10 text-sm text-gray-400">
            No notifications
          </div>
        ) : (
          tasks.map((t) => {
            const cfg = TYPE_CONFIG[t.status] || TYPE_CONFIG.PENDING;

            return (
              <div key={t.id} className="flex gap-3 px-4 py-3 hover:bg-gray-50">
                <div className={`w-8 h-8 flex items-center justify-center ${cfg.bg}`}>
                  {cfg.icon}
                </div>

                <div className="flex-1">
                  <p className="text-sm font-medium">
                    {t.title || t.name}
                  </p>
                  <p className={`text-xs ${cfg.text}`}>
                    {cfg.label}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </motion.div>
  );
}