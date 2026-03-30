import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createApi } from "../services/api";
import { useAuth0 } from "@auth0/auth0-react";
import TaskTable from "./TaskTable";
import type { Meeting, Task } from "../types/task";

export default function MeetingList() {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [taskMap, setTaskMap] = useState<Record<number, Task[]>>({});
  const [loading, setLoading] = useState(false);
  const [expandLoading, setExpandLoading] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { getAccessTokenSilently } = useAuth0();
  const api = createApi(getAccessTokenSilently);

  const fetchMeetings = useCallback(async () => {
  setLoading(true);
  setError(null);
  try {
    const data = await api.getMeetings();
    if (!Array.isArray(data)) throw new Error("Invalid meeting data");
    setMeetings(data);
  } catch (err: any) {
    setError(err.message || "Failed to load meetings");
  } finally {
    setLoading(false);
  }
}, [api]);

useEffect(() => {
    fetchMeetings();
  }, [fetchMeetings]);


  const toggleMeeting = async (id: number) => {
    if (expanded === id) {
      setExpanded(null);
      return;
    }
    setExpanded(id);
    if (taskMap[id]) return; // already loaded

    setExpandLoading(id);
    try {
      const data = await api.getTasksByMeeting(id);
      setTaskMap((prev) => ({ ...prev, [id]: data || [] }));
    } catch (err) {
      console.error(err);
    } finally {
      setExpandLoading(null);
    }
  };

  if (loading) return (
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white rounded-xl p-4 animate-pulse h-16 shadow-sm" />
      ))}
    </div>
  );

  if (error) return (
    <div className="bg-red-50 text-red-600 text-sm p-4 rounded-xl border border-red-100">
      {error}
    </div>
  );

  if (!meetings.length) return (
    <div className="text-center py-12 text-gray-400 text-sm">
      <p className="text-3xl mb-3">📋</p>
      <p>No meetings yet. Process a transcript to begin.</p>
    </div>
  );

  return (
    <div className="space-y-3">
      {meetings.map((m) => (
        <div key={m.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <button
            onClick={() => toggleMeeting(m.id)}
            className="w-full flex justify-between items-center px-5 py-4 hover:bg-gray-50 transition text-left"
          >
            <div>
              <h3 className="font-semibold text-sm">{m.title || "Untitled Meeting"}</h3>
              <p className="text-xs text-gray-400 mt-0.5">{m.createdAt || ""}</p>
            </div>
            <motion.span
              animate={{ rotate: expanded === m.id ? 90 : 0 }}
              transition={{ duration: 0.2 }}
              className="text-gray-400 text-sm"
            >
              ▶
            </motion.span>
          </button>

          <AnimatePresence>
            {expanded === m.id && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden border-t border-gray-100"
              >
                <div className="p-4">
                  {expandLoading === m.id ? (
                    <p className="text-sm text-gray-400 animate-pulse">Loading tasks…</p>
                  ) : (
                    <TaskTable tasks={taskMap[m.id] || []} 
                    refresh={0}
                    onUpdate={() => {}}
                     />
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}
