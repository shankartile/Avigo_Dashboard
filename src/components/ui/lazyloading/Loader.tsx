import LinearProgress from '@mui/material/LinearProgress';
import Box from '@mui/material/Box';

// ==============================|| Loader ||============================== //

const Loader: React.FC = () => {
  return (
    <Box sx={{ position: 'fixed', top: 0, left: 0, zIndex: 2001, width: '100%' }}>
      <LinearProgress color="primary" />
    </Box>
  );
};

export default Loader;
