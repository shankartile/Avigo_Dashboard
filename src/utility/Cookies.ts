export const saveCookies = (user: any) => {
  localStorage.setItem("user", JSON.stringify(user));
};

export const getActiveUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

export const clearCookies = () => {
  localStorage.removeItem("user");
  sessionStorage.removeItem("activeRole");
};
