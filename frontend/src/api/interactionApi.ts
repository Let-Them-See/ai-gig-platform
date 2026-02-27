import API_BASE from "./api";

export const logInteraction = async (gigId: string, action: string) => {
  try {
    await fetch(`${API_BASE}/interactions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify({ gigId, action })
    });
  } catch (e) {
    // swallow errors; logging should not block user
    console.error("interaction log failed", e);
  }
};
