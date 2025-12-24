// import React from 'react';

// type AlertType = 'success' | 'error' | 'warning' | 'info';

// interface Props {
//   type: AlertType;
//   title: string;
//   message: string;
//   variant: string;
//   showLink: boolean;
//   linkHref: string;
//   linkText: string;
//   onClose?: () => void;
// }

// const Alert: React.FC<Props> = ({ type, title, message, onClose }) => {
//   const colorMap: Record<AlertType, string> = {
//     success: 'green',
//     error: 'red',
//     warning: 'yellow',
//     info: 'blue',
//   };

//   const color = colorMap[type];

//   return (
//     <div className={`border-l-4 p-4 border-${color}-500 bg-${color}-100 text-${color}-800 w-100 bg-white rounded relative`}>
//       <strong className="font-bold">{title}</strong>
//       <span className="block">{message}</span>
//       {onClose && (
//         <button
//           onClick={onClose}
//           className="absolute top-1 right-2 text-xl text-gray-600 hover:text-gray-800"
//         >
//           &times;
//         </button>
//       )}
//     </div>
//   );
// };

// export default Alert;





// src/ui/alert/Alert.tsx
// New MUI code 


import React, { useEffect, useState } from 'react';
import { Alert as MUIAlert, AlertTitle, Slide, Box, Link } from '@mui/material';

type AlertType = 'success' | 'error' | 'warning' | 'info';

interface Props {
  type: AlertType;
  title: string;
  message: string;
  duration?: number;
  onClose?: () => void;
  variant?: 'standard' | 'outlined' | 'filled';
  showLink?: boolean;
  linkHref?: string;
  linkText?: string;
}

const Alert: React.FC<Props> = ({
  type,
  title,
  message,
  duration = 6000,
  onClose,
  variant = 'filled',
  showLink = false,
  linkHref = '',
  linkText = '',
}) => {
  const [open, setOpen] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setOpen(false);
      if (onClose) onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <Slide direction="down" in={open} mountOnEnter unmountOnExit>
      <Box
        sx={{
          position: 'fixed',
          top: 80,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 9999,
           minWidth: '300px',
          maxWidth: '90%',
          fontFamily: 'Outfit',
          borderRadius: 2,
          overflow: 'hidden',
        }}
      >
        <MUIAlert
          severity={type}
          variant={variant}
          onClose={() => setOpen(false)}
          sx={{
            borderRadius: 2,
            fontFamily: 'Outfit',
          }}
        >
          {title && <AlertTitle sx={{ fontFamily: 'Outfit' }}>{title}</AlertTitle>}
          {message}
          {showLink && linkHref && linkText && (
            <Box mt={1}>
              <Link
                href={linkHref}
                target="_blank"
                rel="noopener noreferrer"
                underline="hover"
                color="inherit"
              >
                {linkText}
              </Link>
            </Box>
          )}
        </MUIAlert>
      </Box>
    </Slide>
  );
};

export default Alert;
