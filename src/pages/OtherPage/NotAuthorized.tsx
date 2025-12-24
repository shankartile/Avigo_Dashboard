import React from "react";
import GridShape from "../../components/common/GridShape";
import { Link } from "react-router";
import PageMeta from "../../components/common/PageMeta";
import { removeTokenCookie } from "../../utility/Cookies";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
const NotAuthorized: React.FC = () => {

const navigate = useNavigate();

const handleLogoutClick = () => {
    
    removeTokenCookie('user'); //  logout logic
   
    // Navigate to sign-in with alert
    navigate('/', {
      state: {
        alert: {
          type: 'error',
          title: 'Logout Successful',
          message: 'Signed out successfully.',
        },
      },
    });
  };


   return (
    <>
      <PageMeta
        title="React.js 404 Dashboard | TailAdmin - React.js Admin Dashboard Template"
        description="This is React.js 404 Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <div className="relative flex flex-col items-center justify-center min-h-screen p-6 overflow-hidden z-1">
        <GridShape />
        <div className="mx-auto w-full max-w-[242px] text-center sm:max-w-[472px]">
          <h1 className="mb-8 font-bold text-error-500 text-title-md dark:text-white/90 xl:text-title-2xl">
          ACCESS DENIED
          </h1>

          {/* <img src="/images/error/404.svg" alt="404" className="dark:hidden" />
          <img
            src="/images/error/404-dark.svg"
            alt="404"
            className="hidden dark:block"
          /> */}

          <p className="mt-10 mb-6 text-base text-gray-700 dark:text-gray-400 sm:text-lg">
           Not Authorized to access this page!
          </p>

          <Link
          onClick={handleLogoutClick}
            to="/"
            className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-5 py-3.5 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
          >
            Back to Home Page
          </Link>
        </div>
        {/* <!-- Footer --> */}
        
      </div>
    </>
  );
}
 export default NotAuthorized;