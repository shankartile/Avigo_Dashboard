import React, { useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../store/store';
import { fetchKycDetails } from '../../../store/AppUserManagement/DealerManagementSlice';
import { DealerManagementType } from './DealerManagement';

type Props = {
  dealer: DealerManagementType;
};

const KYCdetailsTab: React.FC<Props> = ({ dealer }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { kycDetails, loading, error } = useSelector(
    (state: RootState) => state.DealerManagement
  );

  useEffect(() => {
    if (dealer?._id) {
      dispatch(fetchKycDetails({ dealerId: dealer._id }));
    }
  }, [dealer?._id, dispatch]);

  if (loading) return <Typography className="font-outfit">Loading KYC details...</Typography>;
  if (error) return <Typography className="font-outfit" color="error">Error: {error}</Typography>;
  if (!kycDetails) return <Typography className="font-outfit">No KYC details found</Typography>;

  const { pdfUrl, CertificateData } = kycDetails;
  const kycRes = CertificateData?.KycRes;
  const poi = kycRes?.UidData?.Poi;
  const poa = kycRes?.UidData?.Poa;
  const ldata = kycRes?.UidData?.LData;

  return (
    <Box className="mt-6 p-4 bg-white rounded-xl shadow">
      <Typography variant="h6" className="font-outfit mb-4">
        KYC Details
      </Typography>

      <Box
  sx={{
    display: 'flex',
    flexDirection: { xs: 'column', md: 'row' },
    gap: 4,
    justifyContent: 'center',
    alignItems: 'stretch', // ensures equal height
  }}
>
  {/* Personal Information */}
  <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
    <Typography variant="subtitle1" sx={{ fontWeight: 600 }} className="font-outfit mb-2">
      Personal Information
    </Typography>
    <TableContainer component={Paper} sx={{ flex: 1 }}> {/* flex:1 makes table stretch */}
      <Table>
        <TableBody>
          <TableRow>
            <TableCell className="font-outfit"><strong>Name</strong></TableCell>
            <TableCell className="font-outfit">{poi?.name} ({ldata?.name})</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-outfit"><strong>Date of Birth</strong></TableCell>
            <TableCell className="font-outfit">{poi?.dob}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-outfit"><strong>Gender</strong></TableCell>
            <TableCell className="font-outfit">{poi?.gender}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-outfit"><strong>Aadhaar No</strong></TableCell>
            <TableCell className="font-outfit">{kycRes?.UidData?.uid}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell colSpan={2} align="center">
              <Button
                variant="contained"
                color="primary"
                href={pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-outfit"
              >
                View Aadhaar PDF
              </Button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  </Box>

  {/* Address Information */}
  <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
    <Typography variant="subtitle1" sx={{ fontWeight: 600 }} className="font-outfit mb-2">
      Address Information
    </Typography>
    <TableContainer component={Paper} sx={{ flex: 1 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell className="font-outfit"><strong>Field</strong></TableCell>
            <TableCell className="font-outfit"><strong>English</strong></TableCell>
            <TableCell className="font-outfit"><strong>Local</strong></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell className="font-outfit">Village / Town</TableCell>
            <TableCell className="font-outfit">{poa?.vtc}</TableCell>
            <TableCell className="font-outfit">{ldata?.vtc}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-outfit">District</TableCell>
            <TableCell className="font-outfit">{poa?.dist}</TableCell>
            <TableCell className="font-outfit">{ldata?.dist}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-outfit">State</TableCell>
            <TableCell className="font-outfit">{poa?.state}</TableCell>
            <TableCell className="font-outfit">{ldata?.state}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-outfit">Pincode</TableCell>
            <TableCell className="font-outfit">{poa?.pc}</TableCell>
            <TableCell className="font-outfit">{ldata?.pc}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-outfit">Care Of</TableCell>
            <TableCell className="font-outfit">{poa?.co}</TableCell>
            <TableCell className="font-outfit">{ldata?.co}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  </Box>
</Box>

    </Box>
  );
};

export default KYCdetailsTab;
