// import { Navigate } from "react-router-dom";
// import { getActiveUser } from "../../utility/Cookies";

// interface ProtectedRouteProps {
//   children: React.ReactElement;
//   allowedRoles: string[];
//   requiredPermission?: string;
// }

// const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
//   children,
//   allowedRoles,
//   requiredPermission,
// }) => {
//   const activeRole = sessionStorage.getItem("activeRole");
//   const user = getActiveUser();

//   if (!activeRole || !allowedRoles.includes(activeRole) || !user) {
//     return <Navigate to="/" replace />;
//   }

//   if (activeRole === "admin") {
//     return children;
//   }

//   if (activeRole === "staff" && requiredPermission) {
//     const hasPermission = user.permissions?.some(
//       (perm: any) => perm.key === requiredPermission && perm.allowed
//     );
//     if (!hasPermission) return <Navigate to="/not-authorized" replace />;
//   }

//   return children;
// };

// export default ProtectedRoute;




import React from "react";
import { Navigate } from "react-router-dom";
import { getActiveUser } from "../../utility/Cookies";

interface ProtectedRouteProps {
  children: React.ReactElement;
  allowedRoles: string[];
  requiredPermission?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
  requiredPermission,
}) => {
  const activeRole = sessionStorage.getItem("activeRole");
  const user = getActiveUser();

  if (!activeRole || !allowedRoles.includes(activeRole) || !user) {
    sessionStorage.removeItem("activeRole");
    return <Navigate to="/" replace />;
  }

  // Admin has full access
  if (activeRole === "admin") {
    return children;
  }

  // Staff permission check
  if (activeRole === "staff" && requiredPermission) {
    const hasPermission = user.permissions?.some(
      (perm: any) => perm.key === requiredPermission && perm.allowed
    );

    if (!hasPermission) {
      return <Navigate to="/not-authorized" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
