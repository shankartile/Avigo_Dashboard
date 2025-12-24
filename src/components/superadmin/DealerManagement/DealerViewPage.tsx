// DealerViewPage.tsx
import { useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { AppDispatch, RootState } from '../../../store/store';
import { useEffect } from 'react';
import { Box, Typography, Tabs, Tab, Tooltip, Dialog, DialogTitle, DialogContent, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import DealerListingsTab from './DealerListingsTab';
import DealerLeadsTab from './DealerLeadsTab';
import DealerSubscriptionTab from './DealerSubscriptionTab';
import DealerActivityLogTab from './DealerActivityLogTab';
import KYCdetailsTab from './KYCdetails';
import { useDispatch } from 'react-redux';
import { fetchDealerById } from '../../../store/AppUserManagement/DealerManagementSlice';

const DealerViewPage = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [showSkeleton, setShowSkeleton] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowSkeleton(false), 1000);
    return () => clearTimeout(timer);
  }, []);




  const { dealerId } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const selectedDealer = useSelector((state: RootState) => state.DealerManagement.selectedDealer);


  useEffect(() => {
    if (!selectedDealer && dealerId) {
      dispatch(fetchDealerById(dealerId))
        .unwrap()
        .catch(() => {

          const activeRole = sessionStorage.getItem("activeRole");
          const basePath = activeRole === "staff" ? "staff" : "superadmin";

          navigate(`/${basePath}/dealerviewpage/${dealerId}`); // Redirect if invalid or access denied
        });
    }
  }, [selectedDealer, dealerId, dispatch]);







  const ProfileField = ({ label, value }: { label: string; value: string }) => (
    <Box>
      <Typography className="font-outfit" variant="body2" sx={{ color: '#888', fontWeight: 500 }}>{label}</Typography>
      <Typography variant="body1" className="font-outfit">{value}</Typography>
    </Box>
  );







  const renderDealerSkeleton = () => (
    <Box className="flex flex-col items-center px-4 pt-1 pb-4">
      <Box
        className="bg-white rounded-2xl shadow-md p-4 w-full max-w-8xl"
        sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}
      >
        {/* Left Avatar & Info */}
        <Box
          sx={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            justifyContent: 'center', width: { xs: '100%', md: '40%' },
            borderRight: { md: '1px solid #e0e0e0' }, pr: { md: 4 }, mb: { xs: 4, md: 0 },
          }}
        >
          <Skeleton circle height={150} width={150} />
          <Skeleton height={30} width={120} style={{ marginTop: 10 }} />
          <Skeleton height={20} width={200} />
        </Box>

        {/* Right Content */}
        <Box sx={{ flex: 1, pl: { md: 4 }, display: 'flex', flexDirection: 'column', gap: 4 }}>
          <Box>
            <Skeleton height={25} width="40%" />
            <Box className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-2">
              {[...Array(4)].map((_, idx) => (
                <Box key={idx}>
                  <Skeleton height={15} width="60%" />
                  <Skeleton height={20} />
                </Box>
              ))}
            </Box>
          </Box>

          <Box>
            <Skeleton height={25} width="40%" />
            <Box className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-2">
              {[...Array(6)].map((_, idx) => (
                <Box key={idx}>
                  <Skeleton height={15} width="60%" />
                  <Skeleton height={20} />
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </Box>

      <Box
        sx={{
          backgroundColor: 'white',
          borderRadius: 2,
          boxShadow: 1,
          width: '100%',
          mt: 4,
          padding: 2,
        }}
      >
        <Skeleton height={40} />
      </Box>

      <Box className="w-full mt-4 bg-white rounded-xl shadow p-4">
        <Skeleton height={300} />
      </Box>
    </Box>
  );



  if (!selectedDealer) return null;


  return showSkeleton ? renderDealerSkeleton() : (
    <Box className="flex flex-col items-center px-4 pt-1 pb-4">
      <Box className="bg-white rounded-2xl shadow-md p-4 w-full max-w-8xl"
        sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
        <Box
          sx={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            justifyContent: 'center', width: { xs: '100%', md: '40%' },
            borderRight: { md: '1px solid #e0e0e0' }, pr: { md: 4 }, mb: { xs: 4, md: 0 },
          }}
        >
          <Tooltip title="Click to view full image" arrow>
            <Box sx={{ textAlign: "center" }}>
              <Box
                sx={{
                  width: 150,
                  height: 150,
                  borderRadius: "50%",
                  mb: 2,
                  border: "2px solid #ddd",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#1976d2",
                  color: "white",
                  fontSize: "60px",
                  cursor: "default",
                  textTransform: "uppercase",
                  userSelect: "none",
                }}
              >
                {selectedDealer.name?.[0] || "U"}
              </Box>
{/* 
              <Typography variant="h4" className="font-outfit">
                {selectedDealer.name}
              </Typography>

              <Typography className="font-outfit" variant="body1" color="textSecondary">
                {selectedDealer.email}
              </Typography> */}
            </Box>

          </Tooltip>
          <Typography variant="h4" className="font-outfit">{selectedDealer.name}</Typography>
          {/* <Typography className="font-outfit" variant="body1" color="textSecondary">
            {selectedDealer.email}
          </Typography> */}
        </Box>

        <Box sx={{ flex: 1, pl: { md: 4 }, display: 'flex', flexDirection: 'column', gap: 4 }}>
          <Box>
            <Typography className="font-outfit underline" variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
              Personal Details
            </Typography>
            <Box className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <ProfileField label="Mobile No" value={selectedDealer.phone} />
              <ProfileField label="City" value={selectedDealer.city || 'N/A'} />
              <ProfileField label="PAN No" value={selectedDealer.pan_no} />
              <ProfileField label="Account status" value={selectedDealer.isActive ? 'Active' : 'Blocked'} />
            </Box>
          </Box>

          <Box>
            <Typography className="font-outfit underline" variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
              Business Details
            </Typography>
            <Box className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <ProfileField label="Business Name" value={selectedDealer.business_name || 'N/A'} />
              <ProfileField
                label="Registered Dealership Category"
                value={
                  selectedDealer.dealershipCategories?.length
                    ? selectedDealer.dealershipCategories.join(", ")
                    : "N/A"
                }
              />
              <ProfileField label="Active Dealership Category" value={selectedDealer.activeDealershipCategory || 'N/A'} />
              <ProfileField label="Business Contact" value={selectedDealer.business_contact_no || 'N/A'} />
              <ProfileField label="Business WhatsApp" value={selectedDealer.business_whatsapp_no || 'N/A'} />
              <ProfileField label="Address" value={selectedDealer.address || 'N/A'} />
              <ProfileField label="Registered Date" value={new Date(selectedDealer.createdAt).toLocaleDateString('en-IN')} />
            </Box>
          </Box>
        </Box>
      </Box>

      <Box sx={{ backgroundColor: 'white', borderRadius: 2, boxShadow: 1, width: '100%', mt: 4 }}>
        <Tabs value={selectedTab} onChange={(_, v) => setSelectedTab(v)} variant="fullWidth">
          <Tab className="font-outfit" label="Listings" />
          <Tab className="font-outfit" label="Leads" />
          <Tab className="font-outfit" label="Subscription" />
          <Tab className="font-outfit" label="Activity Log" />
          {/* <Tab className="font-outfit" label="KYC Details" /> */}
        </Tabs>
      </Box>

      {selectedTab === 0 && <DealerListingsTab dealer={selectedDealer} />}
      {selectedTab === 1 && <DealerLeadsTab dealer={selectedDealer} />}
      {selectedTab === 2 && <DealerSubscriptionTab dealer={selectedDealer} />}
      {selectedTab === 3 && <DealerActivityLogTab dealer={selectedDealer} />}
      {selectedTab === 4 && <KYCdetailsTab dealer={selectedDealer} />}

      <Dialog open={previewOpen} onClose={() => setPreviewOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle className='font-outfit'>Image Preview</DialogTitle>
        <DialogContent>
          {previewUrl && (
            <img
              src={previewUrl}
              alt="Preview"
              style={{ width: '100%', maxHeight: '500px', objectFit: 'contain', borderRadius: 12 }}
            />
          )}
        </DialogContent>
        <IconButton
          sx={{ position: 'absolute', top: 12, right: 12, color: 'black' }}
          onClick={() => setPreviewOpen(false)}
        >
          <CloseIcon />
        </IconButton>
      </Dialog>
    </Box>
  );
};

export default DealerViewPage;
