// import React, { useState, useEffect, useMemo } from 'react';
// import {
//   Box,
//   CardHeader,
//   Typography,
//   FormControl,
//   Select,
//   MenuItem,
// } from '@mui/material';
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   Tooltip,
//   CartesianGrid,
//   LabelList,
//   Legend,
// } from 'recharts';
// import PieChartCard from '../../ui/charts/PieChartCard';
// import Skeleton from 'react-loading-skeleton';
// import 'react-loading-skeleton/dist/skeleton.css';
// import dayjs from 'dayjs';
// import DateTimeField from '../../form/input/DateTimeField';
// import { useDispatch, useSelector } from 'react-redux';
// import { RootState, AppDispatch } from '../../../store/store';
// import {
//   fetchSocietyOnboardedGraph,
//   fetchApplicationUsersGraph,
//   fetchCitywiseSocietyGraph,
// } from '../../../store/SocietySuperAdminDashboard/SocietySuperAdminDashboardSlice';

// const GraphicalData: React.FC = () => {
//   const [chartType, setChartType] = useState('society');
//   const [fromDate, setFromDate] = useState<string | null>(null);
//   const [toDate, setToDate] = useState<string | null>(null);
//   const [timeFilter, setTimeFilter] = useState('weekly');
//   const [userCategory, setUserCategory] = useState('all');
//   const [showChartSkeleton, setShowChartSkeleton] = useState(true);

//   useEffect(() => {
//     const timer = setTimeout(() => setShowChartSkeleton(false), 1000);
//     return () => clearTimeout(timer);
//   }, []);

//   const dispatch = useDispatch<AppDispatch>();
//   const {
//     societyOnboarded,
//     applicationUsers,
//     citywiseSociety,
//   } = useSelector((state: RootState) => state.superadmindashboard);

//   /* DISPATCH BASED ON FILTER  */

//   useEffect(() => {
//     const payload = {
//       type: timeFilter,
//       fromDate: fromDate ?? undefined,
//       toDate: toDate ?? undefined,
//     };

//     if (chartType === 'society') {
//       dispatch(fetchSocietyOnboardedGraph(payload));
//     } else if (chartType === 'users') {
//       dispatch(fetchApplicationUsersGraph(payload));
//     } else if (chartType === 'citywise') {
//       dispatch(fetchCitywiseSocietyGraph(payload));
//     }
//   }, [chartType, timeFilter, fromDate, toDate, dispatch]);

//   /* DROPDOWN OPTIONS*/

//   const dropdownOptions = [
//     { label: 'Society On-boarded', value: 'society' },
//     { label: 'Application Users', value: 'users' },
//     { label: 'City-wise Society', value: 'citywise' },
//   ];

//   /*BAR CHART DATA*/

//   const reportData = useMemo(() => {
//     const data =
//       chartType === 'society'
//         ? societyOnboarded
//         : chartType === 'users'
//         ? applicationUsers
//         : chartType === 'citywise'
//         ? citywiseSociety
//         : null;

//     if (!data || !Array.isArray(data)) return [];

//     const sortedData =
//       timeFilter === 'weekly' || timeFilter === 'monthly'
//         ? [...data].sort(
//             (a, b) =>
//               new Date(b.date).getTime() - new Date(a.date).getTime()
//           )
//         : data;

//     if (chartType === 'society') {
//       return sortedData.map((d: any) => ({
//         name:
//           timeFilter === 'monthly'
//             ? dayjs(d.date).format('DD MMM')
//             : d.name,
//         count: d.count ?? 0,
//       }));
//     }

//     if (chartType === 'users') {
//       return sortedData.map((d: any) => ({
//         name:
//           timeFilter === 'monthly'
//             ? dayjs(d.date).format('DD MMM')
//             : d.name,
//         resident:
//           userCategory === 'resident' || userCategory === 'all'
//             ? d.resident ?? 0
//             : 0,
//         treasurer:
//           userCategory === 'treasurer' || userCategory === 'all'
//             ? d.treasurer ?? 0
//             : 0,
//         security:
//           userCategory === 'security' || userCategory === 'all'
//             ? d.security ?? 0
//             : 0,
//       }));
//     }

//     return sortedData.map((d: any) => ({
//       name: d.city,
//       count: d.count ?? 0,
//     }));
//   }, [
//     chartType,
//     timeFilter,
//     societyOnboarded,
//     applicationUsers,
//     citywiseSociety,
//     userCategory,
//   ]);

//   /*PIE CHART DATA*/

//   const pieData = useMemo(() => {
//     if (chartType !== 'users' || !Array.isArray(applicationUsers)) return [];

//     const totals = applicationUsers.reduce(
//       (acc: any, curr: any) => {
//         acc.resident += curr.resident ?? 0;
//         acc.treasurer += curr.treasurer ?? 0;
//         acc.security += curr.security ?? 0;
//         return acc;
//       },
//       { resident: 0, treasurer: 0, security: 0 }
//     );

//     return [
//       { name: 'Residents', value: totals.resident },
//       { name: 'Treasurer', value: totals.treasurer },
//       { name: 'Security', value: totals.security },
//     ];
//   }, [chartType, applicationUsers]);

//   /*SKELETON*/

//   const renderChartSkeletons = () => (
//     <Box className="space-y-6">
//       <Box className="w-full bg-white p-4 rounded-xl shadow min-h-[400px]">
//         <Skeleton height={30} width="40%" className="mb-5" />
//         <Skeleton height={300} />
//       </Box>
//       {chartType !== 'citywise' && (
//         <Box className="w-full bg-white p-4 rounded-xl shadow min-h-[400px]">
//           <Skeleton height={30} width="40%" className="mb-5" />
//           <Skeleton circle height={200} width={200} />
//         </Box>
//       )}
//     </Box>
//   );

//   /*RENDER*/

//   return (
//     <Box className="p-6">
//       {/*FILTERS (AS-IT-IS) */}

//       <Box className="flex justify-center flex-wrap gap-6 mb-8">
//         <FormControl className="w-60 font-outfit">
//           <Select
//             className="bg-white font-outfit"
//             value={timeFilter}
//             onChange={(e) => setTimeFilter(e.target.value)}
//           >
//             <MenuItem value="today">Today</MenuItem>
//             <MenuItem value="weekly">Weekly</MenuItem>
//             <MenuItem value="monthly">Monthly</MenuItem>
//             <MenuItem value="yearly">Yearly</MenuItem>
//             <MenuItem value="custom">Custom</MenuItem>
//           </Select>
//         </FormControl>

//         {timeFilter === 'custom' && (
//           <Box className="w-full flex justify-center mb-4">
//             <Box className="w-full flex gap-6 flex-wrap bg-white justify-center p-4 rounded-lg shadow-md items-center">
//               <FormControl className="w-48 sm:w-60">
//                 <DateTimeField
//                   widthClass="30"
//                   label="From"
//                   name="fromDate"
//                   type="date"
//                   value={fromDate ?? ''}
//                   onChange={(e) => setFromDate(e.target.value)}
//                   maxDate={dayjs().format('YYYY-MM-DD')}
//                 />
//               </FormControl>

//               <FormControl className="w-48 sm:w-60">
//                 <DateTimeField
//                   widthClass="30"
//                   label="To"
//                   name="toDate"
//                   type="date"
//                   value={toDate ?? ''}
//                   onChange={(e) => setToDate(e.target.value)}
//                   maxDate={dayjs().format('YYYY-MM-DD')}
//                   minDate={fromDate || undefined}
//                 />
//               </FormControl>
//             </Box>
//           </Box>
//         )}

//         <FormControl className="w-80 font-outfit">
//           <Select
//             className="bg-white font-outfit"
//             value={chartType}
//             onChange={(e) => setChartType(e.target.value)}
//           >
//             {dropdownOptions.map((opt) => (
//               <MenuItem key={opt.value} value={opt.value}>
//                 {opt.label}
//               </MenuItem>
//             ))}
//           </Select>
//         </FormControl>

//         {chartType === 'users' && (
//           <FormControl className="w-60 font-outfit">
//             <Select
//               className="bg-white font-outfit"
//               value={userCategory}
//               onChange={(e) => setUserCategory(e.target.value)}
//             >
//               <MenuItem value="all">All Users</MenuItem>
//               <MenuItem value="resident">Residents</MenuItem>
//               <MenuItem value="treasurer">Treasurer</MenuItem>
//               <MenuItem value="security">Security</MenuItem>
//             </Select>
//           </FormControl>
//         )}
//       </Box>

//       {/* CHARTS */}

//       {showChartSkeleton ? (
//         renderChartSkeletons()
//       ) : (
//         <Box className="space-y-6">
//           <Box className="w-full bg-white p-4 rounded-xl shadow min-h-[400px]">
//             <CardHeader
//               title={dropdownOptions.find((d) => d.value === chartType)?.label}
//               subheader={timeFilter}
//             />

//             <Box sx={{ overflowX: 'auto' }}>
//               <BarChart
//                 width={Math.max(500, reportData.length * 150)}
//                 height={300}
//                 data={reportData}
//                 barCategoryGap={16}
//               >
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="name" />
//                 <YAxis allowDecimals={false} />
//                 <Tooltip />
//                 <Legend />

//                 {chartType === 'society' || chartType === 'citywise' ? (
//                   <Bar dataKey="count" fill="#245492">
//                     <LabelList dataKey="count" position="top" />
//                   </Bar>
//                 ) : (
//                   <>
//                     <Bar dataKey="resident" fill="#245492">
//                       <LabelList dataKey="resident" position="top" />
//                     </Bar>
//                     <Bar dataKey="treasurer" fill="#E9984C">
//                       <LabelList dataKey="treasurer" position="top" />
//                     </Bar>
//                     <Bar dataKey="security" fill="#ed2424">
//                       <LabelList dataKey="security" position="top" />
//                     </Bar>
//                   </>
//                 )}
//               </BarChart>
//             </Box>
//           </Box>

//           {chartType === 'users' && (
//             <Box className="w-full bg-white p-4 rounded-xl shadow min-h-[400px]">
//               <PieChartCard
//                 title="Application Users Distribution"
//                 subheader={timeFilter}
//                 data={pieData}
//               />
//             </Box>
//           )}
//         </Box>
//       )}
//     </Box>
//   );
// };

// export default GraphicalData;




import React, { useEffect, useMemo, useState } from 'react';
import {
  Box,
  CardHeader,
  FormControl,
  MenuItem,
  Select,
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LabelList,
  Legend,
} from 'recharts';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import dayjs from 'dayjs';

import PieChartCard from '../../ui/charts/PieChartCard';
import DateTimeField from '../../form/input/DateTimeField';


const dummySocietyOnboarded = [
  { date: '2025-09-10', name: '10 Sep', count: 5 },
  { date: '2025-09-11', name: '11 Sep', count: 8 },
  { date: '2025-09-12', name: '12 Sep', count: 6 },
  { date: dayjs().format('YYYY-MM-DD'), name: 'Today', count: 10 },
];

const dummyApplicationUsers = [
  {
    date: '2025-09-10',
    name: '10 Sep',
    resident: 30,
    treasurer: 5,
    security: 10,
  },
  {
    date: '2025-09-11',
    name: '11 Sep',
    resident: 40,
    treasurer: 8,
    security: 12,
  },
  {
    date: dayjs().format('YYYY-MM-DD'),
    name: 'Today',
    resident: 50,
    treasurer: 10,
    security: 15,
  },
];

const dummyCitywiseSociety = [
  { city: 'Pune', count: 25 },
  { city: 'Mumbai', count: 40 },
  { city: 'Nashik', count: 15 },
  { city: 'Nagpur', count: 10 },
];



const GraphicalData = () => {
  const [chartType, setChartType] = useState<'society' | 'users' | 'citywise'>(
    'society'
  );
  const [timeFilter, setTimeFilter] = useState<
    'today' | 'weekly' | 'monthly' | 'yearly' | 'custom'
  >('weekly');
  const [fromDate, setFromDate] = useState<string | null>(null);
  const [toDate, setToDate] = useState<string | null>(null);
  const [userCategory, setUserCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 700);
    return () => clearTimeout(t);
  }, []);



const filterByTime = (data: any[]) => {
  if (!Array.isArray(data)) return [];

  const today = dayjs().startOf('day');

  let startDate: dayjs.Dayjs;
  let endDate: dayjs.Dayjs;

  switch (timeFilter) {
    case 'today':
      startDate = today;
      endDate = today.endOf('day');
      break;

    case 'weekly':
      startDate = today.subtract(6, 'day'); // last 7 days incl today
      endDate = today.endOf('day');
      break;

    case 'monthly':
      startDate = today.startOf('month');
      endDate = today.endOf('month');
      break;

    case 'yearly':
      startDate = today.startOf('year');
      endDate = today.endOf('year');
      break;

    case 'custom':
      if (!fromDate || !toDate) return data;
      startDate = dayjs(fromDate).startOf('day');
      endDate = dayjs(toDate).endOf('day');
      break;

    default:
      return data;
  }

  return data.filter((d) => {
    const current = dayjs(d.date);
    return current.isAfter(startDate) && current.isBefore(endDate);
  });
};


 

  const reportData = useMemo(() => {
    if (chartType === 'society') {
      return filterByTime(dummySocietyOnboarded).map((d) => ({
        name:
          timeFilter === 'monthly'
            ? dayjs(d.date).format('DD MMM')
            : d.name,
        count: d.count,
      }));
    }

    if (chartType === 'users') {
      return filterByTime(dummyApplicationUsers).map((d) => ({
        name:
          timeFilter === 'monthly'
            ? dayjs(d.date).format('DD MMM')
            : d.name,
        resident:
          userCategory === 'resident' || userCategory === 'all'
            ? d.resident
            : 0,
        treasurer:
          userCategory === 'treasurer' || userCategory === 'all'
            ? d.treasurer
            : 0,
        security:
          userCategory === 'security' || userCategory === 'all'
            ? d.security
            : 0,
      }));
    }

    return dummyCitywiseSociety.map((d) => ({
      name: d.city,
      count: d.count,
    }));
  }, [chartType, timeFilter, fromDate, toDate, userCategory]);



  const pieData = useMemo(() => {
    if (chartType === 'society') {
      const total = filterByTime(dummySocietyOnboarded).reduce(
        (sum, d) => sum + d.count,
        0
      );
      return [{ name: 'Societies', value: total }];
    }

    if (chartType === 'users') {
      const totals = filterByTime(dummyApplicationUsers).reduce(
        (acc, d) => {
          acc.resident += d.resident;
          acc.treasurer += d.treasurer;
          acc.security += d.security;
          return acc;
        },
        { resident: 0, treasurer: 0, security: 0 }
      );

      return [
        { name: 'Residents', value: totals.resident },
        { name: 'Treasurer', value: totals.treasurer },
        { name: 'Security', value: totals.security },
      ];
    }

    return dummyCitywiseSociety.map((d) => ({
      name: d.city,
      value: d.count,
    }));
  }, [chartType, timeFilter, fromDate, toDate]);



  if (loading) {
    return (
      <Box className="space-y-6 p-6">
        <Skeleton height={30} width="40%" />
        <Skeleton height={300} />
        <Skeleton height={300} />
      </Box>
    );
  }

  return (
    <Box className="p-6">
      {/* FILTERS */}
      <Box className="flex justify-center flex-wrap gap-6 mb-8">
        <FormControl className="w-60">
          <Select
            value={timeFilter}
            onChange={(e) =>
              setTimeFilter(e.target.value as any)
            }
          >
            <MenuItem value="today">Today</MenuItem>
            <MenuItem value="weekly">Weekly</MenuItem>
            <MenuItem value="monthly">Monthly</MenuItem>
            <MenuItem value="yearly">Yearly</MenuItem>
            <MenuItem value="custom">Custom</MenuItem>
          </Select>
        </FormControl>

        {timeFilter === 'custom' && (
          <Box className="flex gap-4">
            <DateTimeField
              label="From"
              type="date"
              value={fromDate ?? ''}
              onChange={(e) => setFromDate(e.target.value)}
              maxDate={dayjs().format('YYYY-MM-DD')}
            />
            <DateTimeField
              label="To"
              type="date"
              value={toDate ?? ''}
              onChange={(e) => setToDate(e.target.value)}
              maxDate={dayjs().format('YYYY-MM-DD')}
              minDate={fromDate || undefined}
            />
          </Box>
        )}

        <FormControl className="w-72">
          <Select
            value={chartType}
            onChange={(e) =>
              setChartType(e.target.value as any)
            }
          >
            <MenuItem value="society">Society On-boarded</MenuItem>
            <MenuItem value="users">Application Users</MenuItem>
            <MenuItem value="citywise">City-wise Society</MenuItem>
          </Select>
        </FormControl>

        {chartType === 'users' && (
          <FormControl className="w-60">
            <Select
              value={userCategory}
              onChange={(e) => setUserCategory(e.target.value)}
            >
              <MenuItem value="all">All Users</MenuItem>
              <MenuItem value="resident">Residents</MenuItem>
              <MenuItem value="treasurer">Treasurer</MenuItem>
              <MenuItem value="security">Security</MenuItem>
            </Select>
          </FormControl>
        )}
      </Box>

      {/* BAR CHART */}
      <Box className="bg-white p-4 rounded-xl shadow mb-6">
        <CardHeader
          title={chartType.toUpperCase()}
          subheader={timeFilter}
        />

        <BarChart
          width={Math.max(500, reportData.length * 150)}
          height={300}
          data={reportData}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Legend />

          {chartType === 'users' ? (
            <>
              <Bar dataKey="resident" fill="#245492">
                <LabelList dataKey="resident" position="top" />
              </Bar>
              <Bar dataKey="treasurer" fill="#E9984C">
                <LabelList dataKey="treasurer" position="top" />
              </Bar>
              <Bar dataKey="security" fill="#ed2424">
                <LabelList dataKey="security" position="top" />
              </Bar>
            </>
          ) : (
            <Bar dataKey="count" fill="#245492">
              <LabelList dataKey="count" position="top" />
            </Bar>
          )}
        </BarChart>
      </Box>

      {/* PIE CHART (FOR ALL) */}
      <Box className="bg-white p-4 rounded-xl shadow">
        <PieChartCard
          title="Distribution"
          subheader={timeFilter}
          data={pieData}
        />
      </Box>
    </Box>
  );
};

export default GraphicalData;
