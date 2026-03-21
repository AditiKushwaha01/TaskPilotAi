import { useEffect, useState } from "react";
import { getMeetings, getTasksByMeeting } from "../services/api";
import TaskTable from "./TaskTable";

export default function MeetingList() {
  const [meetings, setMeetings] = useState<any[]>([]);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMeetings();
  }, []);

  const fetchMeetings = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getMeetings();

      if (!Array.isArray(data)) {
        throw new Error("Invalid meeting data");
      }

      setMeetings(data);

    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to load meetings");
    } finally {
      setLoading(false);
    }
  };

  const toggleMeeting = async (id: number) => {
    if (expanded === id) {
      setExpanded(null);
      return;
    }

    setExpanded(id);
    setLoading(true);

    try {
      const data = await getTasksByMeeting(id);
      setTasks(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">

      {loading && <p className="text-sm text-gray-500">Loading...</p>}
      {error && <p className="text-red-500 text-sm">{error}</p>}

      {meetings.map((m) => (
        <div key={m.id} className="bg-white p-4 rounded-xl shadow-sm">

          <div
            onClick={() => toggleMeeting(m.id)}
            className="flex justify-between cursor-pointer"
          >
            <div>
              <h3 className="font-semibold">{m.title || "Untitled Meeting"}</h3>
              <p className="text-xs text-gray-500">
                {m.createdAt || ""}
              </p>
            </div>

            <span>{expanded === m.id ? "▼" : "▶"}</span>
          </div>

          {expanded === m.id && (
            <div className="mt-4">
              <TaskTable tasks={tasks} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}