// import React, { createContext, useContext, useEffect, useState } from "react";

// type AuthContextType = {
//   role: string | null;
//   login: (role: string) => void;
//   logout: () => void;
// };

// const AuthContext = createContext<AuthContextType>({
//   role: null,
//   login: () => {},
//   logout: () => {},
// });

// export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const [role, setRole] = useState<string | null>(null);
//   useEffect(() => {
//     const storedRole = localStorage.getItem("role");
//     if (storedRole) {
//       setRole(storedRole);
//     }
//   }, []);

//   const login = (userRole: string) => {
//     localStorage.setItem("role", userRole);
    
//     setRole(userRole);
//   };

//   const logout = () => {
//     localStorage.clear();
//     setRole(null);
//   };


//   return (
//     <AuthContext.Provider value={{ role, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);




import React, { createContext, useContext, useEffect, useState } from "react";

type AuthContextType = {
  role: string | null;
  login: (role: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType>({
  role: null,
  login: () => {},
  logout: () => {},
});

// 🚧 DEV FLAG
const DEV_BYPASS_LOGIN = true;

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    // 🔹 Prefer sessionStorage (bypass login)
    const sessionRole = sessionStorage.getItem("activeRole");
    const localRole = localStorage.getItem("role");

    if (sessionRole) {
      setRole(sessionRole);
    } else if (localRole) {
      setRole(localRole);
    }

    // 🚧 Auto-login for DEV bypass
    if (DEV_BYPASS_LOGIN && !sessionRole && !localRole) {
      const devRole = "admin"; // change to "staff" if needed
      sessionStorage.setItem("activeRole", devRole);
      setRole(devRole);
    }
  }, []);

  const login = (userRole: string) => {
    localStorage.setItem("role", userRole);
    sessionStorage.setItem("activeRole", userRole);
    setRole(userRole);
  };

  const logout = () => {
    localStorage.clear();
    sessionStorage.clear();
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

