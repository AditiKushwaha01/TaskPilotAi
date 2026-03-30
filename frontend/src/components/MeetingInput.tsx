import { useState } from "react";
import { createApi } from "../services/api";
import { useAuth0 } from "@auth0/auth0-react";

type Task = {
  id?: string;
  title?: string;
  name?: string;
  owner: string;
  status: string;
};

export default function MeetingInput({
  onTasksGenerated,
}: {
  onTasksGenerated?: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [text, setText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // ✅ AUTH
  const { getAccessTokenSilently } = useAuth0();

  // ✅ API INSTANCE
  const api = createApi(getAccessTokenSilently);

  const handleGenerate = async () => {
    if (!text.trim()) {
      setError("Please enter meeting transcript");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      console.log("🔥 Calling processMeeting API...");

      // ✅ FIXED CALL
      const res = await api.processMeeting(text);

      // ✅ FIXED RESPONSE HANDLING
      const result = res?.tasks || [];

      if (!Array.isArray(result)) {
        throw new Error("Invalid response from server");
      }

      setTasks(result);
      setSuccess(true);

      if (onTasksGenerated) {
        onTasksGenerated();
      }

    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to process meeting");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-2xl border border-gray-100">

      {/* TEXTAREA */}
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="w-full border p-3 rounded mb-4"
        placeholder="Paste your meeting transcript here..."
      />

      {/* BUTTON */}
      <button
        onClick={handleGenerate}
        disabled={loading}
        className="bg-black text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {loading ? "AI is analyzing..." : "Generate Tasks"}
      </button>

      {/* ERROR */}
      {error && (
        <p className="text-red-500 text-sm mt-3">{error}</p>
      )}

      {/* SUCCESS */}
      {success && !loading && (
        <p className="text-green-600 text-sm mt-3">
          Tasks generated successfully
        </p>
      )}

      {/* TASK PREVIEW */}
      {tasks.length > 0 && (
        <div className="mt-4 space-y-2">
          {tasks.map((t, i) => (
            <div key={i} className="p-2 border rounded text-sm">
              {(t.title || t.name)} - {t.owner} ({t.status})
            </div>
          ))}
        </div>
      )}
    </div>
  );
}