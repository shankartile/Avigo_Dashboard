import React, { useState, useEffect, useMemo } from 'react';
import {
    Box,
    CardHeader,
    Typography,
    FormControl,
    Select,
    MenuItem,
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
    ResponsiveContainer,
    Rectangle,
} from 'recharts';
import PieChartCard from '../../ui/charts/PieChartCard';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import dayjs from 'dayjs';
import DateTimeField from '../../form/input/DateTimeField';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../../store/store';
import {
    fetchproductgraph,
    fetchonboarduser,
    fetchcitywiseuser,
} from '../../../store/SuperAdminDashboard/SperAdminDashboardSlice';

const Analytics: React.FC = () => {
    const [chartType, setChartType] = useState('listing');
    const [fromDate, setFromDate] = useState<string | null>(null);
    const [toDate, setToDate] = useState<string | null>(null);
    const [timeFilter, setTimeFilter] = useState('weekly');
    const [listingCategory, setListingCategory] = useState('all');
    const [showChartSkeleton, setShowChartSkeleton] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setShowChartSkeleton(false), 1000);
        return () => clearTimeout(timer);
    }, []);



    const dispatch = useDispatch<AppDispatch>();
    const { productGraph, onboardUsers, citywiseUsers } = useSelector(
        (state: RootState) => state.superAdminDashboard
    );


    //  Dispatch on change of filters
    useEffect(() => {
        const payload = {
            type: timeFilter,
            fromDate: fromDate ?? undefined,
            toDate: toDate ?? undefined,
        };

        if (chartType === 'listing') {
            dispatch(fetchproductgraph(payload));
        } else if (chartType === 'onboarded') {
            dispatch(fetchonboarduser(payload));
        } else if (chartType === 'citywise') {
            dispatch(fetchcitywiseuser(payload));
        }
    }, [chartType, timeFilter, fromDate, toDate, dispatch]);


    const dropdownOptions = [
        { label: 'Listing Distribution', value: 'listing' },
        { label: 'Dealer & Buyer Onboarded', value: 'onboarded' },
        { label: 'City-wise Dealer/Buyer Count', value: 'citywise' },
    ];


    const reportData = useMemo(() => {
        const data =
            chartType === 'listing' ? productGraph :
                chartType === 'onboarded' ? onboardUsers :
                    chartType === 'citywise' ? citywiseUsers :
                        null;

        if (!data || !Array.isArray(data)) return [];

        //  Sort descending only for weekly
        const sortedData = timeFilter === 'weekly' || 'monthly'
            ? [...data].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            : data;

        if (chartType === 'listing') {
            return sortedData.map((d: any) => ({
                name: timeFilter === 'monthly' ? dayjs(d.date).format('DD MMM') : d.name,
                car: listingCategory === 'car' || listingCategory === 'all' ? d.car ?? 0 : 0,
                bike: listingCategory === 'bike' || listingCategory === 'all' ? d.bike ?? 0 : 0,
                spare: listingCategory === 'spare' || listingCategory === 'all' ? d.spare ?? 0 : 0,
            }));
        }

        //  For onboarded or citywise, format name only if monthly
        return sortedData.map((d: any) => ({
            name: timeFilter === 'monthly' ? dayjs(d.date).format('DD MMM') : d.name,
            dealer: d.dealer ?? 0,
            buyer: d.buyer ?? 0,
        }));
    }, [chartType, timeFilter, productGraph, onboardUsers, citywiseUsers, listingCategory]);



    const pieData = useMemo(() => {
        const data =
            chartType === 'listing' ? productGraph :
                chartType === 'onboarded' ? onboardUsers :
                    chartType === 'citywise' ? citywiseUsers :
                        null;

        if (!data || !Array.isArray(data)) return [];

        if (chartType === 'listing') {
            const totalCar = data.reduce((acc: number, curr: any) => acc + curr.car, 0);
            const totalBike = data.reduce((acc: number, curr: any) => acc + curr.bike, 0);
            const totalSpare = data.reduce((acc: number, curr: any) => acc + curr.spare, 0);
            return [
                { name: 'Car', value: totalCar },
                { name: 'Bike', value: totalBike },
                { name: 'Spare', value: totalSpare },
            ];
        }

        const totalDealer = data.reduce((acc: number, curr: any) => acc + curr.dealer, 0);
        const totalBuyer = data.reduce((acc: number, curr: any) => acc + curr.buyer, 0);
        return [
            { name: 'Dealer', value: totalDealer },
            { name: 'Buyer', value: totalBuyer },
        ];
    }, [chartType, productGraph, onboardUsers, citywiseUsers]);

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <Box sx={{ backgroundColor: '#fff', padding: 1, border: '1px solid #ccc' }}>
        <Typography variant="subtitle2">{label}</Typography>
        {payload.map((entry: any, index: number) => (
          <Typography key={index} variant="body2" color={entry.color}>
            {entry.name}: {entry.value}
          </Typography>
        ))}
      </Box>
    );
  }
  return null;
};



    const renderChartSkeletons = () => (
        <Box className="space-y-6">
            {/* Bar Chart Skeleton */}
            <Box className="w-full bg-white p-4 rounded-xl shadow" style={{ minHeight: 400 }}>
                <Skeleton height={30} width="40%" style={{ marginBottom: 20 }} />
                <Skeleton height={300} width="100%" />
            </Box>

            {/* Pie Chart Skeleton */}
            {chartType !== 'citywise' && (
                <Box className="w-full bg-white p-4 rounded-xl shadow" style={{ minHeight: 400 }}>
                    <Skeleton height={30} width="40%" style={{ marginBottom: 20 }} />
                    <Skeleton circle height={200} width={200} />
                </Box>
            )}
        </Box>
    );


    return (
        
        <Box className="p-6">
            {/* Filters */}
            <Box className="flex justify-center flex-wrap gap-6 mb-8">
                <FormControl className="w-60 font-outfit">
                    <Select
                        className="bg-white font-outfit"
                        value={timeFilter}
                        onChange={(e) => setTimeFilter(e.target.value)}
                    >
                        <MenuItem value="today">Today</MenuItem>
                        <MenuItem value="weekly">Weekly</MenuItem>
                        <MenuItem value="monthly">Monthly</MenuItem>
                        <MenuItem value="yearly">Yearly</MenuItem>
                        <MenuItem value="custom">Custom</MenuItem>
                    </Select>
                </FormControl>

                {timeFilter === 'custom' && (
                    <Box className="w-full flex justify-center mb-4">
                        <Box className="w-full flex gap-6 flex-wrap bg-white justify-center p-4 rounded-lg shadow-md items-center">
                            <FormControl className="w-48 sm:w-60">
                                <DateTimeField
                                    widthClass="30"
                                    label="From"
                                    name="fromDate"
                                    type="date"
                                    value={fromDate ?? ''}
                                    onChange={(e) => setFromDate(e.target.value)}
                                    maxDate={dayjs().format('YYYY-MM-DD')}
                                />
                            </FormControl>

                            <FormControl className="w-48 sm:w-60">
                                <DateTimeField
                                    widthClass="30"
                                    label="To"
                                    name="toDate"
                                    type="date"
                                    value={toDate ?? ''}
                                    onChange={(e) => setToDate(e.target.value)}
                                    maxDate={dayjs().format('YYYY-MM-DD')}
                                    minDate={fromDate || undefined}
                                />
                            </FormControl>
                        </Box>
                    </Box>
                )}

                <FormControl className="w-80 font-outfit">
                    <Select
                        className="bg-white font-outfit"
                        value={chartType}
                        onChange={(e) => setChartType(e.target.value)}
                    >
                        {dropdownOptions.map((opt) => (
                            <MenuItem key={opt.value} value={opt.value}>
                                {opt.label}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                {chartType === 'listing' && (
                    <FormControl className="w-60 font-outfit">
                        <Select
                            className="bg-white font-outfit"
                            value={listingCategory}
                            onChange={(e) => setListingCategory(e.target.value)}
                        >
                            <MenuItem value="all">All</MenuItem>
                            <MenuItem value="car">Car Listings</MenuItem>
                            <MenuItem value="bike">Bike Listings</MenuItem>
                            <MenuItem value="spare">Spare Parts Listings</MenuItem>
                        </Select>
                    </FormControl>
                )}
            </Box>


            {/* Charts */}
            {showChartSkeleton ? renderChartSkeletons() : (
            <Box className="space-y-6">
                {/* Bar Chart - Full Width */}
                <Box className="w-full bg-white p-4 rounded-xl shadow" style={{ minHeight: 400 }}>
                    <CardHeader
                        title={dropdownOptions.find((d) => d.value === chartType)?.label}
                        subheader={timeFilter}
                    />
                    <Box sx={{ overflowX: 'auto' }}>
                        {chartType === 'listing' ? (
                            <BarChart
                                width={Math.max(500, reportData.length * 150)}
                                height={300}
                                data={reportData}
                                barCategoryGap={16}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis domain={[0, 'auto']} allowDecimals={false} />
                                <Tooltip />
                                <Legend />

                                {(listingCategory === 'all' || listingCategory === 'car') && (
                                    <Bar dataKey="car" fill="#245492" name="Car Listings">
                                        <LabelList dataKey="car" position="top" />
                                    </Bar>
                                )}
                                {(listingCategory === 'all' || listingCategory === 'bike') && (
                                    <Bar dataKey="bike" fill="#E9984C" name="Bike Listings">
                                        <LabelList dataKey="bike" position="top" />
                                    </Bar>
                                )}
                                {(listingCategory === 'all' || listingCategory === 'spare') && (
                                    <Bar dataKey="spare" fill="#ed2424ff" name="Spare Parts Listings">
                                        <LabelList dataKey="spare" position="top" />
                                    </Bar>
                                )}
                            </BarChart>
                        ) : (
                            <BarChart
                                width={Math.max(500, reportData.length * 150)}
                                height={300}
                                data={reportData}
                                barCategoryGap={16}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" tick={{ fontSize: 12 }} height={40} />
                                <YAxis
                                    label={{ value: 'Count', angle: -90, position: 'insideLeft' }}
                                    domain={[0, 'auto']}
                                    allowDecimals={false}
                                />
                                <Tooltip content={<CustomTooltip />} />
                                <Bar dataKey="dealer" fill="#245492" name="Dealer" barSize={40} isAnimationActive={false}>
                                    <LabelList dataKey="dealer" position="top" />
                                </Bar>
                                <Bar dataKey="buyer" fill="#E9984C" name="Buyer" barSize={40} isAnimationActive={false}>
                                    <LabelList dataKey="buyer" position="top" />
                                </Bar>
                            </BarChart>
                        )}
                    </Box>
                </Box>

                {/* Pie Chart - Full Width Below */}
                {chartType !== 'citywise' && (
                    <Box className="w-full bg-white p-4 rounded-xl shadow" style={{ minHeight: 400 }}>
                        <PieChartCard
                            title={`${dropdownOptions.find((d) => d.value === chartType)?.label}`}
                            subheader={timeFilter}
                            data={pieData}
                        />
                    </Box>
                )}
            </Box>
            )}
        </Box>
    );
};
export default Analytics;
