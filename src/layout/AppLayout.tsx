import { SidebarProvider, useSidebar } from "../context/SidebarContext";
import React, { useState, useEffect } from "react";
import { Outlet } from "react-router";
import AppHeader from "./AppHeader";
import AppSidebar from "./AppSidebar";
import { Button, Box, useMediaQuery, useTheme } from "@mui/material";
import OffcanvasSidebar from "./Offcanvas";
import { getActiveUser } from "../utility/Cookies";
import Alert from '../components/ui/alert/Alert';
import NotificationButton from "../components/Notification/Notification";
const LayoutContent: React.FC = () => {


  const [alerts, setAlerts] = useState<
    { id: number; type: 'success' | 'error' | 'warning' | 'info'; message: string }[]
  >([]);

  const user = getActiveUser();

  const { isExpanded, isHovered, isMobileOpen } = useSidebar();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const sidebarWidth = isExpanded || isHovered ? 290 : 90;



  const addAlert = (type: 'success' | 'error' | 'warning' | 'info', message: string) => {
    const newAlert = {
      id: Date.now(),
      type,
      message,
    };
    setAlerts((prev) => [...prev, newAlert]);
  };


  const removeAlert = (id: number) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== id));
  };





  return (
    <Box sx={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      {/* Sidebar */}
      <Box
        component="aside"
        sx={{
          width: isMobile ? (isMobileOpen ? sidebarWidth : 0) : sidebarWidth,
          minWidth: isMobile ? 0 : sidebarWidth,
          transition: "width 0.3s ease, min-width 0.3s ease",
          zIndex: 20,
          position: isMobile ? "absolute" : "relative",
          height: "100vh",
          backgroundColor: "background.paper",
          boxShadow: isMobile ? 4 : "none",
        }}
      >
        <AppSidebar />
      </Box>

      {/* Main Content Area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          minWidth: 0,
          height: "100vh",
        }}
      >
        {/* Header */}
        <AppHeader />

        {/* Background Image Layer */}
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100vh",
            backgroundColor: "#d2e0f6",
            // backgroundImage: "url('/images/logo/food doodles (6568x2976).jpg')",
            // backgroundImage: "url('/images/logo/food doodles wed size  (1).webp')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.15,
            zIndex: 0,
          }}
          aria-hidden="true"
        />

        {/* Foreground Content */}
        <Box
          sx={{
            position: "relative",
            zIndex: 1,
            marginY: { xs: 2, md: 3 },
            width: "100%",
            overflowY: "auto",
            flexGrow: 1,
          }}
        >
          <Box
            sx={{
              mx: "auto",
              maxWidth: "var(--breakpoint-2xl)",
              width: "100%",
            }}
          >
            {user && user.role === "hoteladmin" && <OffcanvasSidebar />}
            {alerts.length > 0 && (
              <Box
                className="fixed top-24 left-[44%] transform -translate-x-1/2 z-50"
                sx={{ pointerEvents: 'none' }}
              >
                {alerts.map((alert, index) => (
                  <Box
                    key={alert.id}
                    sx={{
                      position: 'absolute',
                      top: `${index * 12}px`,
                      opacity: 1 - index * 0.1,
                      transform: `scale(${1 - index * 0.03})`,
                      transition: 'all 0.3s ease-in-out',
                      zIndex: alerts.length - index,
                      pointerEvents: 'auto',
                    }}
                  >
                    <Alert
                      type={alert.type}
                      title="New Order Received"
                      message={`Order ID: ${alert.message}`}
                      variant="filled"
                      showLink={false}
                      linkHref=""
                      linkText=""
                      onClose={() => removeAlert(alert.id)}
                    />
                  </Box>
                ))}
              </Box>
            )}



            <Outlet />

          </Box>

        </Box>

      </Box>
    </Box>
  );
};

const AppLayout: React.FC = () => {
  return (
    <SidebarProvider>
      <LayoutContent />
    </SidebarProvider>
  );
};

export default AppLayout;
