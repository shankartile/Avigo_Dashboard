import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardHeader, Box } from '@mui/material';

type PieChartCardProps = {
  title?: string;
  subheader?: string;
  data: {
    name: string;
    value: number;
  }[];
  colors?: string[];
};

const defaultColors = ['#245492', '#E9984C', '#ed2424ff', '#ef4444', '#3b82f6', '#8b5cf6'];

const PieChartCard: React.FC<PieChartCardProps> = ({ title, subheader, data, colors = defaultColors }) => {
  return (
    <Card sx={{ borderRadius: 4, p: 2 }}>
      <CardHeader title={title} subheader={subheader} />
      <Box sx={{ px: 2, pb: 2 }}>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend verticalAlign="bottom" height={36} />
          </PieChart>
        </ResponsiveContainer>
      </Box>
    </Card>
  );
};

export default PieChartCard;
