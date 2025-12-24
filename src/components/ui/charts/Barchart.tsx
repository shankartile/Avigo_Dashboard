import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import { Typography, Box } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const Barchart = ({ title, subheader, data }: {
  title: string;
  subheader: string;
  data: { name: string; value: number }[];
}) => {
  return (
    <Card sx={{ borderRadius: 4, p: 2, height: 400, display: 'flex', flexDirection: 'column' }}>
      <CardHeader title={title} subheader={subheader} />
      <Box sx={{ flexGrow: 1 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#6366f1" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Card>
  );
};
export default Barchart;