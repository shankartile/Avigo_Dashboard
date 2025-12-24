import React from 'react';
import Card from '../../ui/cards/Card';
import {
  Typography, Box, MenuItem,
  Select,
  FormControl,
} from '@mui/material';
import { useLocation, useNavigate } from "react-router-dom";
import Alert from "../../ui/alert/Alert";
import { useState, useEffect } from "react";

const Dashboard: React.FC = () => {

  const location = useLocation();
  const navigate = useNavigate();

  const [alert, setAlert] = useState<{
    type: "success" | "error" | "warning" | "info";
    title: string;
    message: string;
  } | null>(null);

  

  useEffect(() => {
    if (location.state?.alert) {
      setAlert(location.state.alert);
      const timer = setTimeout(() => {
        setAlert(null);
        navigate(location.pathname, { replace: true }); // Clear after alert disappears
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [location.state, navigate, location.pathname]);





  return (
    <>
      {alert && (
        <Alert
          type={alert.type}
          title={alert.title}
          message={alert.message}
          variant="filled"
          showLink={false}
          linkHref=""
          linkText=""
          onClose={() => setAlert(null)}
        />
      )}


      <div className="p-6">
        <Box ml={2}>

          <Typography
            variant="h5"
            fontWeight={500}
            className='font-outfit'
          >
            Dashboard
          </Typography>
        </Box>

        <Box className="bg-white p-12 rounded-xl shadow flex flex-col items-center text-center">
          {/* <img
            src="/illustrations/welcome-staff.svg" // Replace with your actual image path
            alt="Welcome"
            className="w-40 h-40 mb-4"
          /> */}
          <Typography variant="h4" fontWeight={600} className='font-outfit'>
            Welcome, Staff!
          </Typography>
          <Typography variant="body1" color="text.secondary" className="mt-2 font-outfit">
            You're logged in as staff. Use the menu on the left to access your assigned tools and features.
          </Typography>

        </Box>

      </div>
    </>
  );
}

export default Dashboard;
