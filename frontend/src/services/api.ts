const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";
// 🔥 UNIVERSAL SAFE FETCH WRAPPER
const fetchWrapper = async (url: string, options?: RequestInit) => {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options?.headers || {}),
      },
    });

    const text = await response.text();

    // ❌ Handle HTTP errors safely (NO THROW)
    if (!response.ok) {
      console.error("API ERROR:", response.status, text);
      return null;
    }

    // ✅ Handle empty response
    if (!text) return null;

    // ✅ Safe JSON parse (VERY IMPORTANT for Gemini)
    try {
      return JSON.parse(text);
    } catch (err) {
      console.error("JSON PARSE ERROR:", text);
      return null;
    }

  } catch (error: any) {
    console.error("NETWORK ERROR:", error.message);
    return null;
  }
};


// 🔹 Process Meeting (AI Pipeline)
export const processMeeting = async (transcript: string) => {
  if (!transcript.trim()) {
    console.warn("Empty transcript");
    return null; // ❌ don't throw
  }

  return fetchWrapper(`${BASE_URL}/meetings/process`, {
    method: "POST",
    body: JSON.stringify({ transcript }),
  });
};


// 🔹 Get Meetings
export const getMeetings = async () => {
  return fetchWrapper(`${BASE_URL}/meetings`);
};


// 🔹 Get Tasks by Meeting
export const getTasksByMeeting = async (id: number) => {
  if (!id) return null;
  return fetchWrapper(`${BASE_URL}/meetings/${id}/tasks`);
};


// 🔹 Get All Tasks
export const getTasks = async () => {
  return fetchWrapper(`${BASE_URL}/tasks`);
};


// 🔹 Update Task Status
export const updateTaskStatus = async (id: number, status: string) => {
  if (!id || !status) {
    console.warn("Invalid task update params");
    return null;
  }

  return fetchWrapper(`${BASE_URL}/tasks/${id}?status=${status}`, {
    method: "PUT",
  });
};