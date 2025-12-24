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


import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
  requiredPermission?: string;
}

const DEV_BYPASS_LOGIN = true; // 🚧 DEV ONLY

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
}) => {
  const role = sessionStorage.getItem("activeRole");

  // 🚧 Allow bypass login
  if (!DEV_BYPASS_LOGIN && !role) {
    return <Navigate to="/" replace />;
  }

  if (allowedRoles && role && !allowedRoles.includes(role)) {
    return <Navigate to="/not-authorized" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;

