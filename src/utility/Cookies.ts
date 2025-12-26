// export const saveCookies = (user: any) => {
//   localStorage.setItem("user", JSON.stringify(user));
// };

// export const getActiveUser = () => {
//   const user = localStorage.getItem("user");
//   return user ? JSON.parse(user) : null;
// };

// export const clearCookies = () => {
//   localStorage.removeItem("user");
//   sessionStorage.removeItem("activeRole");
// };

import Cookies from "js-cookie";

/* ================= SAVE ================= */
export const saveCookies = (role: string, data: object) => {
  const key = role === "admin" ? "admin_user" : "staff_user";

  Cookies.set(key, JSON.stringify(data), {
    secure: true,
    sameSite: "Strict",
    path: "/",
  });
};

/* ================= GET ================= */
export const getCookies = <T = any>(key: string): T | null => {
  const cookie = Cookies.get(key);

  if (!cookie || cookie === "undefined") {
    return null;
  }

  try {
    return JSON.parse(cookie) as T;
  } catch (error) {
    console.error(`Invalid JSON in cookie: ${key}`, cookie);
    Cookies.remove(key, { path: "/" });
    return null;
  }
};

export const getActiveUser = () => {
  const activeRole = sessionStorage.getItem("activeRole");
  if (!activeRole) return null;

  const key = activeRole === "admin" ? "admin_user" : "staff_user";
  return getCookies(key);
};

/* ================= REMOVE ================= */
export const removeTokenCookie = (key: string) => {
  Cookies.remove(key, { path: "/" });
};

export const clearAllAuthCookies = () => {
  Cookies.remove("admin_user", { path: "/" });
  Cookies.remove("staff_user", { path: "/" });
  sessionStorage.removeItem("activeRole");
};
