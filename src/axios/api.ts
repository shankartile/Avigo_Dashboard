import axios from "axios";
import { getActiveUser, removeTokenCookie } from "../utility/Cookies";

export const httpinstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

httpinstance.interceptors.request.use(
  async (request) => {
 const cookiesData = getActiveUser();

    const token = cookiesData?.accessToken;

    if (token) {
      request.headers.Authorization = `Bearer ${token}`;
    }

    return request;
  },
  (error) => {
    return Promise.reject(error);
  }
);

httpinstance.interceptors.response.use(
  (res) => {
    return res;
  },
  (err) => {
    console.error("Error response:", err.response);

    if (err.response?.status === 401) {
      const activeRole = sessionStorage.getItem("activeRole");
      if (activeRole === "admin") {
        removeTokenCookie("admin_user");
      } else if (activeRole === "staff") {
        removeTokenCookie("staff_user");
      }
      window.location.href = "/";
    }
     return Promise.reject(err);
  }
  
);
