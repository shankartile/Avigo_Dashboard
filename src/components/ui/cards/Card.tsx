// import React from "react";

// type CardProps = {
//   title?: string;
//   subtitle?: string;
//   className?: string;
//   children: React.ReactNode;
// };

// const Card: React.FC<CardProps> = ({ title, subtitle, className = "", children }) => {
//   return (
//     <div className={`rounded-2xl shadow-md bg-white p-6 ${className}`}>
//       {title && <h2 className="text-xl font-semibold mb-2">{title}</h2>}
//       {subtitle && <p className="text-gray-500 mb-4">{subtitle}</p>}
//       <div>{children}</div>
//     </div>
//   );
// };

// export default Card;

import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import {
  BarChart,
  Bar,
  XAxis,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from 'recharts';
import { Tooltip, Box } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import { useNavigate } from 'react-router';


interface CardProps {
  title: string;
  tooltip?: string;
  value: string | number;
  percentage: string;
  isIncrease: boolean;
  chartData?: { name: string; value: number }[];
  barColor?: string;
  navigateLink?: string;
  children?: React.ReactNode;
  hideChart?: boolean;

}

const Card: React.FC<CardProps> = ({
  title,
  tooltip,
  value,
  percentage,
  isIncrease,
  chartData,
  barColor = '#22c55e',
  navigateLink = '#',
  children = null,
  hideChart = false,
}) => {
  const navigate = useNavigate()
  const handleClick = () => {
    navigate(navigateLink)
  }

  return (
    <div
      className={`bg-white shadow-md rounded-2xl p-5 flex flex-col justify-between ${navigateLink !== "#" && "cursor-pointer hover:shadow-lg transition-shadow duration-300"}`} onClick={navigateLink === '#' ? undefined : handleClick}

    >
      <div className="flex items-center justify-between text-sm font-semibold text-gray-600 mb-1">
        {/* Left side: title + arrow */}
        <div className="flex items-center gap-1">
          <span>{title}</span>
          <button
            onClick={(e) => {
              e.stopPropagation(); // prevent card click navigation
              console.log(`${title} clicked`);
            }}
            className="text-gray-400 hover:text-blue-600 transition duration-200 ease-in-out"
            title={`Go to ${title}`}
          >
            <ArrowForwardIosIcon
              fontSize="inherit"
              className="text-[20px] text-gray-400"
            />
          </button>
        </div>

        {/* Right side: info icon */}
        {tooltip && (
          <Tooltip
            title={tooltip}
            arrow
            slotProps={{
              popper: {
                sx: {
                 
                  '& .MuiTooltip-tooltip': {
                    fontSize: '0.9rem',         // bigger text
                    backgroundColor: '#245492',
                    color: '#fff', 
                     fontFamily:'outfit',           // white text for contrast
                    padding: '8px 12px',
                  },
                  '& .MuiTooltip-arrow': {
                    color: '#245492',         // arrow color matches tooltip
                  },
                },
              },
            }}
          >
            <InfoIcon
              fontSize="medium"
              sx={{
                color: '#245492',
                cursor: 'pointer',
              }}
              onClick={(e) => e.stopPropagation()}
            />
          </Tooltip>
        )}


      </div>


      <div className="text-3xl font-bold text-gray-900">{value}</div>
      <div className="flex items-center mt-2 text-sm text-gray-500">
        <span className={`${isIncrease ? 'text-green-500' : 'text-red-500'}`}>
        </span>
        <span className="ml-1">Latest data</span>

      </div>

      {!hideChart && (
        <div className="h-16 mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis dataKey="name" hide />
              <RechartsTooltip />
              <Bar dataKey="value" fill={barColor} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {children && (
        <div className="mt-4">
          {children}
        </div>
      )}
    </div>
  );
};

export default Card;

