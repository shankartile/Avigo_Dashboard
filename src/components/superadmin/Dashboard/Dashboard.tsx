// import React from 'react';
// import Card from '../../ui/cards/Card';
// import {
//   Typography, Box, MenuItem,
//   Select,
//   FormControl, Tooltip
// } from '@mui/material';
// import { useLocation, useNavigate } from "react-router-dom";
// import Alert from "../../ui/alert/Alert";
// import { useState, useEffect } from "react";
// import { useDispatch, useSelector } from 'react-redux';
// import { RootState, AppDispatch } from '../../../store/store';
// import { fetchDashboardSummary } from '../../../store/SuperAdminDashboard/SperAdminDashboardSlice';
// import Analytics from './Analytics';
// import PieChartCard from '../../ui/charts/PieChartCard';
// import Skeleton from 'react-loading-skeleton';
// import 'react-loading-skeleton/dist/skeleton.css';
// import InfoOutlineIcon from '@mui/icons-material/InfoOutline';

// const Dashboard: React.FC = () => {

//   const location = useLocation();
//   const navigate = useNavigate();
//   const dispatch = useDispatch<AppDispatch>();

//   const { summary, loading } = useSelector((state: RootState) => state.superAdminDashboard);

//   const [timeFilter, setTimeFilter] = useState('weekly');
//   type ChartType = 'listing' | 'onboard' | 'citywise';
//   const [selectedChartType, setSelectedChartType] = useState<ChartType>('listing');
//   const [showCardSkeleton, setShowCardSkeleton] = useState(true);

//   useEffect(() => {
//     const timer = setTimeout(() => setShowCardSkeleton(false), 1000);
//     return () => clearTimeout(timer);
//   }, []);



//   const [alert, setAlert] = useState<{
//     type: "success" | "error" | "warning" | "info";
//     title: string;
//     message: string;
//   } | null>(null);

//   useEffect(() => {
//     dispatch(fetchDashboardSummary());
//   }, [dispatch]);


//   useEffect(() => {
//     if (location.state?.alert) {
//       setAlert(location.state.alert);

//       const timer = setTimeout(() => {
//         setAlert(null);
//         navigate(location.pathname, { replace: true }); // Clear after alert disappears
//       }, 2000);

//       return () => clearTimeout(timer);
//     }
//   }, [location.state, navigate, location.pathname]);





//   const renderCardSkeletons = () => {
//     return (
//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
//         {Array.from({ length: 8 }).map((_, index) => (
//           <Box
//             key={index}
//             sx={{
//               borderRadius: 2,
//               padding: 2,
//               boxShadow: 1,
//               bgcolor: '#fff',
//               minHeight: '140px',
//             }}
//           >
//             <Skeleton height={24} width="60%" />
//             <Skeleton height={36} width="40%" style={{ marginTop: 8 }} />
//             <Box display="flex" justifyContent="space-between" gap={1} mt={2}>
//               <Skeleton height={30} width="30%" />
//               <Skeleton height={30} width="30%" />
//               <Skeleton height={30} width="30%" />
//             </Box>
//           </Box>
//         ))}
//       </div>
//     );
//   };

//   return (
//     <div>
//       {alert && (
//         <Alert
//           type={alert.type}
//           title={alert.title}
//           message={alert.message}
//           variant="filled"
//           showLink={false}
//           linkHref=""
//           linkText=""
//           onClose={() => setAlert(null)}
//         />
//       )}


//       <div className="p-6">
//         <Box ml={2}>

//           <Typography
//             variant="h5"
//             fontWeight={500}
//             className='font-outfit'
//           >
//             Dashboard
//           </Typography>
//         </Box>

//         {showCardSkeleton ? renderCardSkeletons() : (
//           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">

//             <Card
//               title="Total Dealers "
//               tooltip="Number of registered dealers in the platform."
//               value={summary?.totalDealers || 0}
//               navigateLink='/superadmin/dealermanagment'
//               percentage="+2.6%"
//               isIncrease={true}
//               // chartData={superAdminDashboards[0]?.last7DaysStats?.totalAppUsers}
//               barColor="#22c55e"
//             />



//             <Card
//               title="Total Buyers"
//               tooltip="Number of active buyers on the platform."
//               value={summary?.totalBuyers || 0}
//               navigateLink='/superadmin/buyermanagment'
//               percentage="+0.2%"
//               isIncrease={true}
//               // chartData={superAdminDashboards[0]?.last7DaysStats?.activeAppUsers}
//               barColor="#3b82f6"
//             />


//             <Card
//               title="Total Listings"
//               tooltip='All listings: Cars, Bikes, and Spare Parts are shown here.'
//               value={summary?.totalListings || 0}
//               percentage="-0.1%"
//               isIncrease={true}
//               hideChart={true}
//             >
//               <Box display="flex" justifyContent="space-between" gap={1} mt={2}>
//                 {[
//                   { label: 'Cars', color: '#245492', type: 'car', count: summary?.totalCars },
//                   { label: 'Bikes', color: '#E9984C', type: 'bike', count: summary?.totalBikes },
//                   { label: 'Spare', color: '#ed2424ff', type: 'sparepart', count: summary?.totalSpareParts },
//                 ].map((item) => (
//                   <Box
//                     key={item.label}
//                     flex={1}
//                     p={1}
//                     borderRadius={2}
//                     bgcolor="#f9fafb"
//                     textAlign="center"
//                     boxShadow={1}
//                     sx={{ cursor: 'pointer' }}
//                     onClick={() =>
//                       navigate(`/superadmin/productlistings?type=${item.type}`)
//                     }
//                   >
//                     <Typography variant="caption" fontFamily={'Outfit'}>
//                       {item.label}
//                     </Typography>
//                     <Typography
//                       variant="h5"
//                       fontWeight="bold"
//                       sx={{ color: item.color }}
//                     >
//                       {item.count}
//                     </Typography>
//                   </Box>
//                 ))}
//               </Box>
//             </Card>

//             <Card
//               title="Total Active Subscribed Users"
//               tooltip='Total number of active users who have subscribed to the platform.'
//               value={summary?.totalSubscribedUsers || 0}
//               percentage="-0.1%"
//               isIncrease={true}
//               hideChart={true}
//             >
//               <Box display="flex" justifyContent="space-between" gap={1} mt={2}>
//                 {[
//                   { label: 'Car', color: '#245492', type: 'car', keyword: 'car' },
//                   { label: 'Bike', color: '#E9984C', type: 'bike', keyword: 'bike' },
//                   { label: 'Spare', color: '#ed2424ff', type: 'sparepart', keyword: 'spare' },
//                 ].map((item) => {
//                   const count =
//                     summary?.categoryWiseSubscribedUsers?.find(
//                       (cat) => cat?.category_name?.toLowerCase().includes(item.keyword)
//                     )?.count || 0;

//                   return (
//                     <Box
//                       key={item.label}
//                       flex={1}
//                       p={1}
//                       borderRadius={2}
//                       bgcolor="#f9fafb"
//                       textAlign="center"
//                       boxShadow={1}
//                       sx={{ cursor: 'pointer' }}
//                       onClick={() => navigate(`/superadmin/subscriptionmanagement`)}
//                     >
//                       <Typography variant="caption" fontFamily={'Outfit'}>
//                         {item.label}
//                       </Typography>
//                       <Typography variant="h5" fontWeight="bold" sx={{ color: item.color }}>
//                         {count}
//                       </Typography>
//                     </Box>
//                   );
//                 })}
//               </Box>
//             </Card>

//             <Card
//               title="Total Leads Generated"
//               tooltip='Total leads generated from all listings and categories.'
//               value={summary?.totalLeads || 0}
//               percentage="-0.1%"
//               isIncrease={true}
//               hideChart={true}
//             >
//               <Box display="flex" justifyContent="space-between" gap={1} mt={2}>
//                 {[
//                   { label: 'Car', color: '#245492', type: 'car', keyword: 'car' },
//                   { label: 'Bike', color: '#E9984C', type: 'bike', keyword: 'bike' },
//                   { label: 'Spare', color: '#ed2424ff', type: 'sparepart', keyword: 'spare' },
//                 ].map((item) => {
//                   const count =
//                     summary?.categoryWiseLeads?.find((cat) =>
//                       cat?.category_name?.toLowerCase().includes(item.keyword)
//                     )?.count || 0;

//                   return (
//                     <Box
//                       key={item.label}
//                       flex={1}
//                       p={1}
//                       borderRadius={2}
//                       bgcolor="#f9fafb"
//                       textAlign="center"
//                       boxShadow={1}
//                       sx={{ cursor: 'pointer' }}
//                       onClick={() => navigate(`/superadmin/productlistings?type=${item.type}`)}
//                     >
//                       <Typography variant="caption" fontFamily={'Outfit'}>
//                         {item.label}
//                       </Typography>
//                       <Typography variant="h5" fontWeight="bold" sx={{ color: item.color }}>
//                         {count}
//                       </Typography>
//                     </Box>
//                   );
//                 })}
//               </Box>
//             </Card>




//             <Card
//               title="Total Views Generated"
//               tooltip='Total views generated from all listings and categories.'
//               value={summary?.totalViews || 0}
//               percentage="-0.1%"
//               isIncrease={true}
//               hideChart={true}
//             >
//               <Box display="flex" justifyContent="space-between" gap={1} mt={2}>
//                 {[
//                   { label: 'Car', color: '#245492', type: 'car', keyword: 'car' },
//                   { label: 'Bike', color: '#E9984C', type: 'bike', keyword: 'bike' },
//                   { label: 'Spare', color: '#ed2424ff', type: 'sparepart', keyword: 'spare' },
//                 ].map((item) => {
//                   const count =
//                     summary?.categoryWiseViews?.find((cat) =>
//                       cat?.category_name?.toLowerCase().includes(item.keyword)
//                     )?.count || 0;

//                   return (
//                     <Box
//                       key={item.label}
//                       flex={1}
//                       p={1}
//                       borderRadius={2}
//                       bgcolor="#f9fafb"
//                       textAlign="center"
//                       boxShadow={1}
//                       sx={{ cursor: 'pointer' }}
//                       onClick={() => navigate(`/superadmin/productlistings?type=${item.type}`)}
//                     >
//                       <Typography variant="caption" fontFamily={'Outfit'}>
//                         {item.label}
//                       </Typography>
//                       <Typography variant="h5" fontWeight="bold" sx={{ color: item.color }}>
//                         {count}
//                       </Typography>
//                     </Box>
//                   );
//                 })}
//               </Box>
//             </Card>




//             <Card
//               title="Total Tickets Raised"
//               tooltip='Total number of support tickets raised by dealers and buyers.'
//               value={summary?.totalSupportTickets || 0}
//               percentage="-0.1%"
//               isIncrease={true}
//               hideChart={true}
//             >
//               <Box display="flex" justifyContent="space-between" gap={1} mt={2}>
//                 {[
//                   { label: 'Dealers', color: '#245492', type: 'dealer', count: summary?.openDealerTickets },
//                   { label: 'Buyers', color: '#E9984C', type: 'buyer', count: summary?.openBuyerTickets },
//                 ].map((item) => (
//                   <Box
//                     key={item.label}
//                     flex={1}
//                     p={1}
//                     borderRadius={2}
//                     bgcolor="#f9fafb"
//                     textAlign="center"
//                     boxShadow={1}
//                     sx={{ cursor: 'pointer' }}
//                     onClick={() =>
//                       navigate(`/superadmin/supportticketmanagement?type=${item.type}`)
//                     }
//                   >
//                     <Typography variant="caption" fontFamily={'Outfit'}>
//                       {item.label}
//                     </Typography>
//                     <Typography
//                       variant="h5"
//                       fontWeight="bold"
//                       sx={{ color: item.color }}
//                     >
//                       {item.count}
//                     </Typography>
//                   </Box>
//                 ))}
//               </Box>
//             </Card>

//             <Card
//               title="Total Feedback"
//               tooltip='Total feedback received from dealers and buyers.'
//               value={(summary?.buyerFeedbackCount || 0) + (summary?.dealerFeedbackCount || 0)}
//               percentage="-0.1%"
//               isIncrease={true}
//               hideChart={true}
//             >
//               <Box display="flex" justifyContent="space-between" gap={1} mt={2}>
//                 {[
//                   { label: 'Dealers', color: '#245492', type: 'dealer', count: summary?.dealerFeedbackCount },
//                   { label: 'Buyers', color: '#E9984C', type: 'buyer', count: summary?.buyerFeedbackCount },
//                 ].map((item) => (
//                   <Box
//                     key={item.label}
//                     flex={1}
//                     p={1}
//                     borderRadius={2}
//                     bgcolor="#f9fafb"
//                     textAlign="center"
//                     boxShadow={1}
//                     sx={{ cursor: 'pointer' }}
//                     onClick={() =>
//                       navigate(`/superadmin/feedbackmanagement?type=${item.type}`)
//                     }
//                   >
//                     <Typography variant="caption" fontFamily={'Outfit'}>
//                       {item.label}
//                     </Typography>
//                     <Typography
//                       variant="h5"
//                       fontWeight="bold"
//                       sx={{ color: item.color }}
//                     >
//                       {item.count}
//                     </Typography>
//                   </Box>
//                 ))}
//               </Box>
//             </Card>
//           </div>
//         )}
//       </div>
//       {/* Left - Bar Chart */}
//       <Analytics />
//     </div>
//   );
// }
// export default Dashboard;



import React, { useEffect, useState } from "react";
import { Box, Typography, Tooltip } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import InfoIcon from '@mui/icons-material/Info';

import Card from "../../ui/cards/Card";
import Alert from "../../ui/alert/Alert";
import Analytics from "./Analytics";
import GraphicalData from "./GraphicalData";

import { RootState, AppDispatch } from "../../../store/store";
import { fetchDashboardSummary } from "../../../store/SocietySuperAdminDashboard/SocietySuperAdminDashboardSlice";

const Dashboard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();

  const { summary, loading } = useSelector(
    (state: RootState) => state.superadmindashboard
  );

  // cast summary once
  const s = summary as any;

  const [showSkeleton, setShowSkeleton] = useState(true);
  const [alert, setAlert] = useState<{
    type: "success" | "error" | "warning" | "info";
    title: string;
    message: string;
  } | null>(null);

  useEffect(() => {
    dispatch(fetchDashboardSummary());
    const t = setTimeout(() => setShowSkeleton(false), 800);
    return () => clearTimeout(t);
  }, [dispatch]);

  useEffect(() => {
    if (location.state?.alert) {
      setAlert(location.state.alert);
      const t = setTimeout(() => {
        setAlert(null);
        navigate(location.pathname, { replace: true });
      }, 2000);
      return () => clearTimeout(t);
    }
  }, [location, navigate]);

  const renderSkeletons = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
      {Array.from({ length: 7 }).map((_, i) => (
        <Box key={i} sx={{ p: 2, bgcolor: "#fff", borderRadius: 2, boxShadow: 1 }}>
          <Skeleton height={22} width="70%" />
          <Skeleton height={36} width="40%" style={{ marginTop: 8 }} />
        </Box>
      ))}
    </div>
  );

  return (
    <div>
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
        <Typography variant="h5" fontWeight={500} mb={2}>
          Dashboard
          <Tooltip
            title="Disply count of all modules,display graph and calculations !"
            arrow
            slotProps={{
              popper: {
                sx: {
                  '& .MuiTooltip-tooltip': {
                    fontSize: '0.8rem',
                    backgroundColor: '#245492',
                    color: '#fff',
                    fontFamily: 'Outfit',
                    padding: '8px 12px',
                  },
                  '& .MuiTooltip-arrow': {
                    color: '#245492',
                  },
                },
              },
            }}
          >
            <InfoIcon
              fontSize="medium"
              sx={{ color: '#245492', cursor: 'pointer' }}
              onClick={(e) => e.stopPropagation()}
            />
          </Tooltip>
        </Typography>

        {showSkeleton || loading ? (
          renderSkeletons()
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">

            {/* 1. Society */}
            <Card
              title="Total No. Society-Sub Counter"
              tooltip="Total societies"
              value={s?.totalSociety || 0}
              navigateLink='/superadmin/society-onboarding'
              percentage=""
              isIncrease={false}
              hideChart
            >
              <Box display="flex" gap={1} mt={2}>
                {[
                  { label: "Active", color: "#22c55e", count: s?.activeSociety || 0 },
                  { label: "Inactive", color: "#ef4444", count: s?.inactiveSociety || 0 },
                ].map((i) => (
                  <Box key={i.label} flex={1} p={1} textAlign="center" bgcolor="#f9fafb" borderRadius={2}>
                    <Typography variant="caption">{i.label}</Typography>
                    <Typography variant="h5" fontWeight="bold" sx={{ color: i.color }}>
                      {i.count}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Card>

            {/* 2. Resident */}
            <Card
              title="Total No. Resident User"
              tooltip="Total resident users"
              value={s?.totalResidentUser || 0}
              navigateLink='/superadmin/society-resident'
              percentage=""
              isIncrease={false}
              hideChart
            />

            {/* 3. Treasurer */}
            <Card
              title="Total No. Treasurer User"
              tooltip="Total treasurer users"
              value={s?.totalTreasurerUser || 0}
              percentage=""
              isIncrease={false}
              hideChart
            />

            {/* 4. Security */}
            <Card
              title="Total No. Security User"
              tooltip="Total security users"
              value={s?.totalSecurityUser || 0}
              percentage=""
              isIncrease={false}
              hideChart
            />

            {/* 5. Tickets */}
            <Card
              title="Total No. of Support Tickets Raised"
              tooltip="Support tickets"
              value={s?.totalSupportTickets || 0}
              navigateLink='/superadmin/society-supportticket-management'
              percentage=""
              isIncrease={false}
              hideChart
            />

            {/* 6. Feedback */}
            <Card
              title="Total No. of Application Feedback"
              tooltip="Feedback from all roles"
              value={
                (s?.residentFeedback || 0) +
                (s?.treasurerFeedback || 0) +
                (s?.securityFeedback || 0)
              }
              navigateLink='/superadmin/society-feedback-management'
              percentage=""
              isIncrease={false}
              hideChart
            >
              <Box display="flex" gap={1} mt={2}>
                {[
                  { label: "Resident", color: "#3b82f6", count: s?.residentFeedback || 0 },
                  { label: "Treasurer", color: "#f59e0b", count: s?.treasurerFeedback || 0 },
                  { label: "Security", color: "#8b5cf6", count: s?.securityFeedback || 0 },
                ].map((i) => (
                  <Box key={i.label} flex={1} p={1} textAlign="center" bgcolor="#f9fafb" borderRadius={2}>
                    <Typography variant="caption">{i.label}</Typography>
                    <Typography variant="h5" fontWeight="bold" sx={{ color: i.color }}>
                      {i.count}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Card>

            {/* 7. Enquiry */}
            <Card
              title="Total No. of Enquiry"
              tooltip="Total enquiries"
              value={s?.totalEnquiry || 0}
              navigateLink='/superadmin/society-notifications'
              percentage=""
              isIncrease={false}
              hideChart
            />
          </div>
        )}
      </div>

      <GraphicalData />
    </div>
  );
};

export default Dashboard;
