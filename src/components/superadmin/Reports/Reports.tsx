// import React from 'react';
// import { Typography } from '@mui/material';

// const Reports: React.FC = () => {
//   return (
//     <Typography
//       variant="h5"
//       fontWeight={500}
//       
//      className='font-outfit'
//     >
//      Reports Management
//     </Typography>

//   );
// };

// export default Reports;


import React, { useState, useEffect } from 'react';
import Card from '../../ui/cards/Card';
import Barchart from '../../ui/charts/Barchart'
import PieChartCard from '../../ui/charts/PieChartCard';
import {
  Typography,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Button,
  Box,
  TextField,
  CardHeader
} from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import DataTable from '../../tables/DataTable';

const Reports: React.FC = () => {
  const hotels = ['Hotel A', 'Hotel B', 'Hotel C'];
  const [selectedHotel, setSelectedHotel] = useState('');
  const [reportType, setReportType] = useState('Completed Orders');
  const [timeFilter, setTimeFilter] = useState('Today');
  const [searchCustomer, setSearchCustomer] = useState('');
  const [paymentModeFilter, setPaymentModeFilter] = useState('All');

  type ReportItem = {
    name: string;
    value: number;
  };

  type Order = {
    id: number;
    customer: string;
    amount: string;
    status: string;
    paymentMode: string;
    location: string;
  };

  const [reportData, setReportData] = useState<ReportItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const mockReportData = [
        { name: 'Mon', value: Math.floor(Math.random() * 1000) },
        { name: 'Tue', value: Math.floor(Math.random() * 1000) },
        { name: 'Wed', value: Math.floor(Math.random() * 1000) },
        { name: 'Thu', value: Math.floor(Math.random() * 1000) },
        { name: 'Fri', value: Math.floor(Math.random() * 1000) },
        { name: 'Sat', value: Math.floor(Math.random() * 1000) },
        { name: 'Sun', value: Math.floor(Math.random() * 1000) },
      ];

      const mockOrders = Array.from({ length: 10 }, (_, i) => ({
        id: i + 1,
        customer: `Customer ${i + 1}`,
        amount: `₹${Math.floor(Math.random() * 1000)}`,
        status: i % 2 === 0 ? 'Completed' : 'Cancelled',
        paymentMode: i % 2 === 0 ? 'UPI' : 'Cash',
        location: i % 2 === 0 ? 'Fountain Area' : 'Seating Zone B',
      }));

      setReportData(mockReportData);
      setOrders(mockOrders);
    };

    if (selectedHotel) fetchData();
  }, [selectedHotel, reportType, timeFilter]);

  const filteredOrders = orders.filter(order => {
    const matchCustomer = order.customer.toLowerCase().includes(searchCustomer.toLowerCase());
    const matchPayment = paymentModeFilter === 'All' || order.paymentMode === paymentModeFilter;
    return matchCustomer && matchPayment;
  });

  const orderColumns = [
    { accessorKey: 'customer', header: 'Customer' },
    { accessorKey: 'amount', header: 'Amount' },
    { accessorKey: 'status', header: 'Status' },
    { accessorKey: 'paymentMode', header: 'Payment Mode' },
    { accessorKey: 'location', header: 'Location' },
  ];

  return (
    <div className="p-6">
      <Typography className="font-outfit" variant="h5" fontWeight={500}>
        Report & Analytics
      </Typography>

      {/* Filters */}
      <Box className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <FormControl className="font-outfit" fullWidth>
          <Select
            className="font-outfit bg-white"
            value={selectedHotel}
            onChange={(e) => setSelectedHotel(e.target.value)}
            displayEmpty
          >
            <MenuItem className="font-outfit" value="" disabled>
              Select Hotel
            </MenuItem>
            {hotels.map((hotel) => (
              <MenuItem className="font-outfit" key={hotel} value={hotel}>
                {hotel}
              </MenuItem>
            ))}
          </Select>

        </FormControl>

        <FormControl className="font-outfit" fullWidth>
          <Select
            className="font-outfit bg-white"
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            MenuProps={{
              PaperProps: {
                sx: {
                  bgcolor: 'white',
                  zIndex: 1300,
                },
              },
            }}
          >
            <MenuItem className="font-outfit" value="Completed Orders">Completed Orders</MenuItem>
            <MenuItem className="font-outfit" value="Cancelled Orders">Cancelled Orders</MenuItem>
            <MenuItem className="font-outfit" value="Sales">Sales</MenuItem>
          </Select>
        </FormControl>

        <FormControl className="font-outfit" fullWidth>
          <Select className="font-outfit bg-white" value={timeFilter} onChange={(e) => setTimeFilter(e.target.value)}>
            <MenuItem className="font-outfit" value="Today">Today</MenuItem>
            <MenuItem className="font-outfit" value="Weekly">Weekly</MenuItem>
            <MenuItem className="font-outfit" value="Monthly">Monthly</MenuItem>
            <MenuItem className="font-outfit" value="Yearly">Yearly</MenuItem>
          </Select>
        </FormControl>
      </Box>


      {/* Card */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6 ml-90">
        <Card
          title={`Total ${reportType}`}
          value={reportData.reduce((sum, d) => sum + d.value, 0).toString()}
          percentage="+2.5%"
          isIncrease={true}
          chartData={reportData}
          barColor="#3b82f6"
        />
      </div>


      {/* Chart */}
      {/* <Box className="bg-white p-4 rounded-2xl shadow-md mb-6">
        <Typography className="font-outfit" variant="h6" mb={2}>
          {reportType} Trend
        </Typography>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={reportData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#6366f1" />
          </BarChart>
        </ResponsiveContainer>
      </Box> */}

      <Box className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Bar chart */}
        <Box sx={{ borderRadius: 4, p: 2, backgroundColor: 'white', boxShadow: 1 }}>
          <CardHeader title={`${reportType} Trend`} subheader={timeFilter} />
          <Box sx={{ px: 2, pb: 2 }}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={reportData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#6366f1" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </Box>

        {/* Pie chart */}
        <PieChartCard
          title="Order Distribution"
          subheader={timeFilter}
          data={reportData}
        />
      </Box>




      {/* Data Table */}
      <Typography variant="h6" className="mb-4 font-outfit">Order List</Typography>
      <DataTable data={filteredOrders} columns={orderColumns} />
    </div>
  );
};

export default Reports;

