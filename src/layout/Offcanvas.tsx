import React, { useState } from "react";
import {
  ShoppingCart,
  Autorenew,
  HourglassEmpty,
  CheckCircle,
  Cancel,
} from "@mui/icons-material";
import { Badge } from "@mui/material";
import { count } from "console";

const OffcanvasSidebar: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <aside
      className={`fixed right-0 top-[35%] transform -translate-y-[48%]
 z-50 bg-white border border-gray-200 shadow-2xl rounded-l-xl transition-all duration-300 ease-in-out
    ${isExpanded ? "w-72 px-5 py-6" : "w-16 px-2 py-6"}
  `}
    >

      {/* Toggle Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="absolute -left-5 top-1/2 transform -translate-y-1/2 bg-yellow-500 text-white rounded-full p-2 shadow-md hover:bg-yellow-600 z-50"
      >
        {isExpanded ? "➤" : "←"}
      </button>

      {/* Content */}
      <div className="space-y-6">
        <SummaryItem
          icon={<ShoppingCart className="text-black" />}
          label="Total Orders"
          count={50}
          isExpanded={isExpanded}
        />
        <SummaryItem
          icon={<Autorenew className="text-black" />}
          label="In Progress"
          count={10}
          isExpanded={isExpanded}
        />
        <SummaryItem
          icon={<HourglassEmpty className="text-yellow-500" />}
          label="Pending Orders"
          count={10}
          isExpanded={isExpanded}
        />
        <SummaryItem
          icon={<CheckCircle className="text-green-500" />}
          label="Delivered"
          count={40}
          isExpanded={isExpanded}
        />
        <SummaryItem
          icon={<Cancel className="text-red-500" />}
          label="Cancelled"
          count={5}
          isExpanded={isExpanded}
        />
      </div>
    </aside>
  );
};

interface SummaryItemProps {
  icon: React.ReactNode;
  label: string;
  value?: string;
  isExpanded: boolean;
  count?: number;
}

const SummaryItem: React.FC<SummaryItemProps> = ({
  icon,
  label,
  value,
  count,
  isExpanded,
}) => (
  <div
    className={`flex items-center justify-between ${isExpanded ? "" : "flex-col justify-center text-center py-2"
      }`}
  >
    <div
      className={`flex items-center gap-5 ${isExpanded ? "" : "flex-col justify-center w-full"
        }`}
    >
      <span className="text-xl"><Badge badgeContent={count} color="warning">
        {icon}
      </Badge></span>





      {isExpanded && <span className="text-gray-700 text-sm">{label}</span>}
    </div>
    {isExpanded && <span className="font-semibold  text-base">{count}</span>}
  </div>
);



export default OffcanvasSidebar;
