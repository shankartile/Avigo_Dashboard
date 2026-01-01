import { useState, useEffect, useRef } from "react";
// import { Link } from "react-router";
import { useSidebar } from "../context/SidebarContext";
import { Typography } from "@mui/material";
// import { ThemeToggleButton } from "../components/common/ThemeToggleButton";
import NotificationDropdown from "../components/header/NotificationDropdown";
import UserDropdown from "../components/header/UserDropdown";
import { getActiveUser } from "../utility/Cookies";
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/store';
// import { fetchnotification, } from '../store/SuperAdminDashboard/SperAdminDashboardSlice';
import { fetchnotification, } from '../store/SocietySuperAdminDashboard/SocietySuperAdminDashboardSlice';
import { fetchnotifications, } from '../store/SocietyAdminDashboard/societyAdminDashboardSlice';

import { useNavigate } from 'react-router-dom';


const AppHeader: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { unreadCount } = useSelector((state: RootState) => state. superadmindashboard);

  const { isMobileOpen, toggleSidebar, toggleMobileSidebar, isExpanded } = useSidebar();

  const user = getActiveUser();

  // Fetch unread notifications on mount (so count is ready after refresh)
  useEffect(() => {
    dispatch(fetchnotification({}));
  }, [dispatch]);

    useEffect(() => {
    dispatch(fetchnotifications({}));
  }, [dispatch]);

  const handleToggle = () => {
    if (window.innerWidth >= 1024) {
      toggleSidebar();
    } else {
      toggleMobileSidebar();
    }
  };

  // const toggleApplicationMenu = () => {
  //   setApplicationMenuOpen(!isApplicationMenuOpen);
  // };

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault();
        inputRef.current?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);



  return (
    <header className={`sticky top-0 z-[1050] flex w-full bg-white border-b border-gray-200 dark:border-gray-800 dark:bg-gray-900`}>
      <div className="flex items-center justify-between w-full px-2 py-3 lg:px-6" style={{
        background: 'linear-gradient( #255593 103.05%)',
      }}>
        {/* Left: Sidebar Toggle Button */}
        <button
          className={`
    items-center justify-center w-10 h-10 text-white-500 border-white-200 rounded-lg z-99999 dark:border-gray-800 lg:flex dark:text-gray-400 lg:h-11 lg:w-11 lg:border
    transition-all duration-300
    ${isExpanded ? "ml-0" : "ml-10"}
    `}
          onClick={handleToggle}
          aria-label="Toggle Sidebar"
        >

          {isMobileOpen ? (
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M6.21967 7.28131C5.92678 6.98841 5.92678 6.51354 6.21967 6.22065C6.51256 5.92775 6.98744 5.92775 7.28033 6.22065L11.999 10.9393L16.7176 6.22078C17.0105 5.92789 17.4854 5.92788 17.7782 6.22078C18.0711 6.51367 18.0711 6.98855 17.7782 7.28144L13.0597 12L17.7782 16.7186C18.0711 17.0115 18.0711 17.4863 17.7782 17.7792C17.4854 18.0721 17.0105 18.0721 16.7176 17.7792L11.999 13.0607L7.28033 17.7794C6.98744 18.0722 6.51256 18.0722 6.21967 17.7794C5.92678 17.4865 5.92678 17.0116 6.21967 16.7187L10.9384 12L6.21967 7.28131Z"
                fill="white"
              />
            </svg>
          ) : (
            <svg
              width="16"
              height="12"
              viewBox="0 0 16 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M0.583252 1C0.583252 0.585788 0.919038 0.25 1.33325 0.25H14.6666C15.0808 0.25 15.4166 0.585786 15.4166 1C15.4166 1.41421 15.0808 1.75 14.6666 1.75L1.33325 1.75C0.919038 1.75 0.583252 1.41422 0.583252 1ZM0.583252 11C0.583252 10.5858 0.919038 10.25 1.33325 10.25L14.6666 10.25C15.0808 10.25 15.4166 10.5858 15.4166 11C15.4166 11.4142 15.0808 11.75 14.6666 11.75L1.33325 11.75C0.919038 11.75 0.583252 11.4142 0.583252 11ZM1.33325 5.25C0.919038 5.25 0.583252 5.58579 0.583252 6C0.583252 6.41421 0.919038 6.75 1.33325 6.75L7.99992 6.75C8.41413 6.75 8.74992 6.41421 8.74992 6C8.74992 5.58579 8.41413 5.25 7.99992 5.25L1.33325 5.25Z"
                fill="white"
              />
            </svg>
          )}
          {/* Cross Icon */}
        </button>
        <div className="flex items-center gap-3 ml-auto">
          <Typography variant="h6" fontWeight={500} className="font-outfit uppercase">
          </Typography>
        </div>
        {/* Right: Notification and User Icons */}
        <div className="flex items-center gap-3 ml-auto">

          {/* Notification Icon */}
          <button
            className={`relative flex items-center justify-center border rounded-full h-11 w-11 transition-colors ${unreadCount > 0
              ? 'bg-red-50 border-red-300 text-red-600 animate-pulse'
              : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-100'
              }`}
            onClick={() => {
              dispatch(fetchnotification({}));
              const activeRole = sessionStorage.getItem("activeRole");
              const basePath = activeRole === "staff" ? "admin" : "superadmin";
              navigate(`/${basePath}/society-notifications`);
            }}
          >
            {unreadCount > 0 && (
              <>
                {/* Ping animation circle */}
                <span className="bg-red-50 border-red-300 text-red-600 animate-pulse"></span>
                {/* Badge */}
                <span className="absolute top-0 right-0 bg-red-600 text-white text-xs font-semibold px-1.5 py-0.5 rounded-full transform translate-x-1/5 -translate-y-1/5 min-w-[18px] text-center leading-none z-10">
                  {unreadCount}
                </span>
              </>
            )}

            {/* Bell icon */}
            <svg
              className={`fill-current ${unreadCount > 0 ? "animate-pulse" : ""}`}
              width="20"
              height="20"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M10.75 2.292C10.75 1.878 10.414 1.542 10 1.542C9.586 1.542 9.25 1.878 9.25 2.292V2.836C6.083 3.207 3.625 5.9 3.625 9.167V14.459H3.333C2.919 14.459 2.583 14.795 2.583 15.209C2.583 15.623 2.919 15.959 3.333 15.959H16.667C17.081 15.959 17.417 15.623 17.417 15.209C17.417 14.795 17.081 14.459 16.667 14.459H16.375V9.167C16.375 5.9 13.917 3.207 10.75 2.836V2.292ZM14.875 14.459V9.167C14.875 6.475 12.692 4.292 10 4.292C7.308 4.292 5.125 6.475 5.125 9.167V14.459H14.875ZM8 17.709C8 18.123 8.336 18.459 8.75 18.459H11.25C11.664 18.459 12 18.123 12 17.709C12 17.294 11.664 16.959 11.25 16.959H8.75C8.336 16.959 8 17.294 8 17.709Z"
              />
            </svg>
          </button>



          {/* User Dropdown */}
          <UserDropdown />
        </div>
      </div>
    </header>
  );
};
export default AppHeader;