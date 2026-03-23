const BASE_URL = "http://localhost:8080/api";

// 🔥 COMMON FETCH WRAPPER (VERY IMPORTANT)
const fetchWrapper = async (url: string, options?: RequestInit) => {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options?.headers || {}),
      },
    });

    // ❌ Handle HTTP errors
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `API Error ${response.status}: ${errorText || response.statusText}`
      );
    }

    // ✅ Handle empty responses safely
    const text = await response.text();
    return text ? JSON.parse(text) : null;

  } catch (error: any) {
    console.error("API CALL FAILED:", error.message);

    // 🔥 Centralized error
    throw new Error(error.message || "Something went wrong");
  }
};


// 🔹 Process Meeting (AI Pipeline)
export const processMeeting = async (transcript: string) => {
  if (!transcript.trim()) {
    throw new Error("Transcript cannot be empty");
  }

  return fetchWrapper(`${BASE_URL}/meetings/process`, {
    method: "POST",
    body: JSON.stringify({ transcript }),
  });
};

export const getMeetings = async () => {
  const res = await fetch(`${BASE_URL}/meetings`);
  return res.json();
};

export const getTasksByMeeting = async (id: number) => {
  const res = await fetch(`${BASE_URL}/meetings/${id}/tasks`);
  return res.json();
};

// 🔹 Get Tasks
export const getTasks = async () => {
  return fetchWrapper(`${BASE_URL}/tasks`);
};


// 🔹 Update Task Status
export const updateTaskStatus = async (id: number, status: string) => {
  if (!id) throw new Error("Task ID is required");
  if (!status) throw new Error("Status is required");

  return fetchWrapper(`${BASE_URL}/tasks/${id}?status=${status}`, {
    method: "PUT",
  });
};