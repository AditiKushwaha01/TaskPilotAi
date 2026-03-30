// src/services/api.ts

import type { Task } from "../types/task";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

export const createApi = (getAccessTokenSilently: any) => {

  // 🔐 Universal fetch with token
  const fetchWrapper = async (url: string, options?: RequestInit) => {
    try {
      const token = await getAccessTokenSilently();

      const response = await fetch(url, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // ✅ AUTH TOKEN
          ...(options?.headers || {}),
        },
      });

      const text = await response.text();

      if (!response.ok) {
        console.error("API ERROR:", response.status, text);
        throw new Error(`API Error ${response.status}`);
      }

      if (!text) return null;

      try {
        return JSON.parse(text);
      } catch {
        return null;
      }

    } catch (error: any) {
      console.error("NETWORK ERROR:", error.message);
      return null;
    }
  };

  // 🔹 APIs
  return {
    processMeeting: (transcript: string) => {
      if (!transcript.trim()) {
        console.warn("Empty transcript");
        return null;
      }

      return fetchWrapper(`${BASE_URL}/meetings/process`, {
        method: "POST",
        body: JSON.stringify({ transcript }),
      });
    },

    getMeetings: () =>
      fetchWrapper(`${BASE_URL}/meetings/my`) ?? [],

    getTasks: () =>
      fetchWrapper(`${BASE_URL}/tasks/my`) ?? [],

    getTasksByMeeting: (id: number) => {
      if (!id) return null;
      return fetchWrapper(`${BASE_URL}/meetings/${id}/tasks`);
    },
    saveTasks: (tasks: Task[]) =>
  fetchWrapper(`${BASE_URL}/tasks/bulk`, {
    method: "POST",
    body: JSON.stringify(tasks),
  }),
    getNotifications: () =>
  fetchWrapper(`${BASE_URL}/notifications/my`) ?? [],

    updateTaskStatus: (id: number, status: string) => {
      if (!id || !status) {
        console.warn("Invalid params");
        return null;
      }

      return fetchWrapper(`${BASE_URL}/tasks/${id}?status=${status}`, {
        method: "PUT",
      });
    },
  };
};