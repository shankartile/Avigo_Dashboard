import Cookies from 'js-cookie';

export const saveCookies = (role: string, data: object) => {
  const key = role === 'admin' ? 'admin_user' : 'staff_user';
  Cookies.set(key, JSON.stringify(data), {
    secure: true,
    sameSite: 'Strict',
    path: '/',
  });
};

export const getCookies = <T = any>(key: string): T | null => {
  const cookie = Cookies.get(key);
  if (cookie) {
    return JSON.parse(cookie) as T;
  }
  return null;
};

export const removeTokenCookie = (key: string) => {
  Cookies.remove(key, { path: '/' });
};


export const getActiveUser = () => {
  const activeRole = sessionStorage.getItem("activeRole");
  if (!activeRole) return null;
  return activeRole === "admin"
    ? getCookies("admin_user")
    : getCookies("staff_user");
};



export const clearAllAuthCookies = () => {
  Cookies.remove('admin_user', { path: '/' });
  Cookies.remove('staff_user', { path: '/' });
};
