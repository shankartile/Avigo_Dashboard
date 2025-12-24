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
} from 'recharts';
import PieChartCard from '../../ui/charts/PieChartCard';
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

        if (!data?.data) return [];

        if (chartType === 'listing') {
            if (listingCategory === 'all') {
                return data.data.map((d: any) => ({
                    name: d.name,
                    car: d.car,
                    bike: d.bike,
                    spare: d.spare,
                }));
            } else {
                return data.data.map((d: any) => ({
                    name: d.name,
                    value: d[listingCategory],
                }));
            }
        }

        return data.data.map((d: any) => ({
            name: d.name,
            value: d.count ?? d.value ?? 0,
        }));
    }, [chartType, productGraph, onboardUsers, citywiseUsers, listingCategory]);

    const pieData = useMemo(() => {
        const data =
            chartType === 'listing' ? productGraph :
                chartType === 'onboarded' ? onboardUsers :
                    chartType === 'citywise' ? citywiseUsers :
                        null;

        if (!data?.data) return [];

        if (chartType === 'listing') {
            const totalCar = data.data.reduce((acc: number, curr: any) => acc + curr.car, 0);
            const totalBike = data.data.reduce((acc: number, curr: any) => acc + curr.bike, 0);
            const totalSpare = data.data.reduce((acc: number, curr: any) => acc + curr.spare, 0);
            return [
                { name: 'Car', value: totalCar },
                { name: 'Bike', value: totalBike },
                { name: 'Spare', value: totalSpare },
            ];
        }

        return data.data.map((d: any) => ({
            name: d.name,
            value: d.count ?? d.value ?? 0,
        }));
    }, [chartType, productGraph, onboardUsers, citywiseUsers]);

    const CustomTooltip = ({ active, payload, label }: any) =>
        active && payload?.length ? (
            <Box sx={{ backgroundColor: '#fff', padding: 1, border: '1px solid #ccc' }}>
                <Typography variant="subtitle2">{label}</Typography>
                <Typography variant="body2">Count: {payload[0].value}</Typography>
            </Box>
        ) : null;

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
            <Box className="flex flex-wrap gap-6 justify-between">
                {/* Bar Chart */}
                <Box className="w-full lg:w-[49%] bg-white p-4 rounded-xl shadow" style={{ minHeight: 400 }}>
                    <CardHeader
                        title={dropdownOptions.find((d) => d.value === chartType)?.label}
                        subheader={timeFilter}
                    />
                    <Box sx={{ flexGrow: 1, overflowX: listingCategory === 'all' ? 'auto' : 'hidden' }}>
                        {chartType === 'listing' && listingCategory === 'all' ? (
                            <BarChart
                                width={800}
                                height={300}
                                data={reportData}
                                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="car" fill="#8884d8" name="Car">
                                    <LabelList dataKey="car" position="top" />
                                </Bar>
                                <Bar dataKey="bike" fill="#82ca9d" name="Bike">
                                    <LabelList dataKey="bike" position="top" />
                                </Bar>
                                <Bar dataKey="spare" fill="#ffc658" name="Spare">
                                    <LabelList dataKey="spare" position="top" />
                                </Bar>
                            </BarChart>
                        ) : (
                            <BarChart width={500} height={300} data={reportData} barCategoryGap={16}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" tick={{ fontSize: 12 }} height={40} />
                                <YAxis label={{ value: 'Count', angle: -90, position: 'insideLeft' }} />
                                <Tooltip content={<CustomTooltip />} />
                                <Bar
                                    dataKey="value"
                                    fill="#6366f1"
                                    radius={[8, 8, 0, 0]}
                                    barSize={40}
                                >
                                    <LabelList
                                        dataKey="value"
                                        position="top"
                                        style={{ fill: '#111', fontSize: 12 }}
                                    />
                                </Bar>
                            </BarChart>
                        )}
                    </Box>
                </Box>

                {/* Pie Chart */}
                {chartType !== 'citywise' && (
                    <Box className="w-full lg:w-[49%] p-4 bg-white rounded-xl shadow" style={{ minHeight: 400 }}>
                        <PieChartCard
                            title={`${dropdownOptions.find((d) => d.value === chartType)?.label}`}
                            subheader={timeFilter}
                            data={pieData}
                        />
                    </Box>
                )}
            </Box>
        </Box>
    );
};

export default Analytics;
