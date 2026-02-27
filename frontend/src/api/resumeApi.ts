import API_BASE from "./api";
import { apiFetch } from "./client";

export const uploadResume = async (file: File) => {
  const formData = new FormData();
  formData.append("resume", file);

  const res = await apiFetch(`/resume`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    let msg = `Upload failed with status ${res.status}`;
    try {
      const payload = await res.json();
      if (payload && payload.message) msg = payload.message;
    } catch (e) {
      try {
        const txt = await res.text();
        if (txt) msg = txt;
      } catch (e) {}
    }
    throw new Error(msg);
  }

  return res.json();
};