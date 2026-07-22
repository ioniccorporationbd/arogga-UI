import axios from "axios";

export const apiClient = axios.create({ baseURL: "" });

apiClient.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    try {
      const raw = window.localStorage.getItem("arogga-auth-user");
      const user = raw ? JSON.parse(raw) as { phone?: string } : null;
      if (user?.phone) {
        config.headers = config.headers || {};
        config.headers["x-user-phone"] = user.phone;
      }
    } catch {}
  }
  return config;
});
