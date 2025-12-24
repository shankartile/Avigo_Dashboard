import React from 'react';
import {
  Box,
  Typography,
  IconButton,
  Dialog,
  DialogContent,
  DialogTitle,
  Chip
} from '@mui/material';
import Button from '../../ui/button/Button';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import { DownloadIcon, Subscript } from 'lucide-react';
import { MRT_ColumnDef } from 'material-react-table';
import DataTable from '../../tables/DataTable';
import { DealerManagementType } from './DealerManagement';
import { useState, useEffect } from 'react';
import { RootState, AppDispatch } from '../../../store/store';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSubscriptionbydealer } from '../../../store/AppUserManagement/DealerManagementSlice';
import { assignsubscriptiontodealer, AssignSubscriptionPayload } from '../../../store/SubscriptionManagement/SubscriptionManagementSlice';

import { fetchSubscriptionList } from '../../../store/SubscriptionManagement/SubscriptionManagementSlice';
import DateTimeField from '../../form/input/DateTimeField';
import dayjs from 'dayjs';
import Alert from '../../ui/alert/Alert';

import { httpinstance } from '../../../axios/api';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';

type Props = {
  dealer: DealerManagementType;
};

const DealerSubscriptionTab: React.FC<Props> = ({ dealer }) => {


  const [newPlan, setNewPlan] = useState({ plan_id: '', category_id: '' });
  const [openAssignDialog, setOpenAssignDialog] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState<any>(null);
  const [selectedPlanId, setSelectedPlanId] = useState<string>('');
  const [selectedStartDate, setSelectedStartDate] = useState<string>('');
  const [selectedEndDate, setSelectedEndDate] = useState<string>('');

  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const [start_date, setstart_date] = useState('');
  const [end_date, setend_date] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [alertType, setAlertType] = useState<'success' | 'error' | 'warning' | 'info' | null>(null);
  const [alertMessage, setAlertMessage] = useState('');
  const [showAlert, setShowAlert] = useState(false);



  const dispatch = useDispatch<AppDispatch>();
  const { SubscriptionList } = useSelector((state: RootState) => state.Subscription);



  const { dealerSubscription, totalItems } = useSelector((state: RootState) => state.DealerManagement);

  const subscriptions = dealerSubscription; // coming from Redux


  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (dealer?._id) {
        dispatch(fetchSubscriptionbydealer({ userId: dealer._id, page: pageIndex, limit: pageSize, search: searchTerm, }));
      }
    }, 500); // 500ms delay

    return () => clearTimeout(delayDebounce);
  }, [dealer?._id, pageIndex, pageSize, searchTerm]);


  useEffect(() => {
    if (openAssignDialog) {
      dispatch(fetchSubscriptionList({ search: searchTerm, limit: pageSize, }));
    }
  }, [openAssignDialog, dispatch]);



  useEffect(() => {
    if (selectedSubscription) {
      setNewPlan({ plan_id: selectedSubscription.subscription_plan_id?._id, category_id: selectedSubscription.subscription_plan_id.category_id });
    }
  }, [selectedSubscription]);


  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewPlan((prev) => ({
      ...prev,
      [name]: value,
    }));
  };


  const handleAssignSubscriptionToDealer = async () => {
    if (!newPlan.plan_id || !start_date || !end_date) {
      setAlertType('error');
      setAlertMessage('Please fill all required fields.');
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
      return;
    }

    try {
      const payload: AssignSubscriptionPayload = {
        dealer_id: dealer._id,
        subscription_plan_id: newPlan.plan_id,
        category_id: newPlan.category_id,
        start_date,
        end_date,
      };

      const result = await dispatch(assignsubscriptiontodealer(payload)).unwrap();

      setAlertType('success');
      setAlertMessage('Subscription assigned successfully.');
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 8000);

      dispatch(fetchSubscriptionbydealer({
        search: searchTerm,
        page: pageIndex,
        limit: pageSize,
        userId: dealer._id,
      }));

      resetForm();
      // setOpenAssignDialog(false);
    } catch (err: any) {
      console.log("assignsubscription error:", err);

      let errorMessage = 'Failed to assign subscription';

      if (typeof err === 'string') {
        errorMessage = err;
      } else if (err?.code === 'DUPLICATE_SUBSCRIPTION') {
        errorMessage = err.message;
      } else if (err?.message) {
        errorMessage = err.message;
      }

      setAlertType('error');
      setAlertMessage(errorMessage);
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 5000);
    }
  };





  const columns: MRT_ColumnDef<any>[] = [
    {
      header: 'Plan Subscribed',
      id: "subscription_plan_id.plan_name",
      accessorFn: (row) => row.subscription_plan_id?.plan_name || 'N/A',
    },
    {
      header: 'Category',
      id: "category_id.category_name",
      accessorFn: (row) => row.category_id?.category_name || 'N/A',
    },
    {
      header: 'Amount Paid (₹)',
      id: "subscription_plan_id.price",
      accessorFn: (row) => row.subscription_plan_id?.price ?? 0,
      Cell: ({ cell }) => `₹${cell.getValue()}`,
    },
    {
      header: 'Start Date',
      accessorFn: (row) => row.start_date,
      Cell: ({ cell }) => new Date(cell.getValue<string>()).toLocaleDateString('en-IN'),
    },
    {
      header: 'End Date',
      accessorFn: (row) => row.end_date,
      Cell: ({ cell }) => new Date(cell.getValue<string>()).toLocaleDateString('en-IN'),
    },
    {
      header: 'Status',
      Cell: ({ row }) => {
        const isActive = new Date(row.original.end_date) >= new Date();
        return (
          <Chip
            label={isActive ? 'Active' : 'Expired'}
            color={isActive ? 'success' : 'error'}
            size="small"
            sx={{ fontWeight: 500, fontFamily: 'Outfit' }}
          />
        );
      },
    },
    {
      header: 'Invoice',
      Cell: ({ row }) => {
        const dealerSub = row.original;

        const handleInvoiceClick = async () => {
          if (dealerSub.invoice_url) {
            // Open existing invoice
            window.open(dealerSub.invoice_url, '_blank');
          } else {
            // Generate invoice dynamically
            try {
              const response = await httpinstance.post(
                `/dealer/dealerSubscriptionRoute/generate-invoice/${dealerSub._id}`
              );
              const invoiceUrl = response.data?.data?.invoiceUrl;
              if (invoiceUrl) {
                window.open(invoiceUrl, '_blank');
              } else {
                console.error('Invoice URL not found');
              }
            } catch (err) {
              console.error('Error generating invoice', err);
            }
          }
        };

        return (
          <PictureAsPdfIcon
            color={dealerSub.isActive ? 'primary' : 'error'}
            style={{ cursor: 'pointer' }}
            onClick={handleInvoiceClick}
          />
        );
      },
    }

  ];

  const resetForm = () => {
    setNewPlan({ plan_id: '', category_id: '' });
    setstart_date('');
    setend_date('');
    setSelectedSubscription(null);
  };

  // Handle dialog close
  const handleCloseDialog = () => {
    resetForm();
    setOpenAssignDialog(false);
  };

  // Get current active plan
  const currentPlan = subscriptions?.find(
    (sub: any) => new Date(sub.end_date) >= new Date()
  );




  const clickHandler = async (searchText: string) => {

    const currentPage = 0;
    const currentLimit = 10;

    setSearchTerm(searchText);
    setPageIndex(currentPage);

    if (dealer?._id) {
      // First, export the file
      await dispatch(
        fetchSubscriptionbydealer({
          search: searchText,
          page: currentPage,
          limit: currentLimit,
          userId: dealer._id,
        })
      );

      // Then, refetch table data (important: use updated search and page)
      dispatch(
        fetchSubscriptionbydealer({
          search: searchText,
          page: currentPage,
          limit: currentLimit,
          userId: dealer._id,
        })
      );
    }
  };





  return (
    <>
      {/* {showAlert && alertType && (
        <div className="p-4">
          <Alert
            type={alertType}
            title={
              alertType === 'success'
                ? 'Success!'
                : alertType === 'error' && alertMessage.toLowerCase().includes('deleted')
                  ? 'Deleted!'
                  : alertType === 'error'
                    ? 'Error!'
                    : 'Warning!'
            }
            message={alertMessage}
            variant="filled"
            showLink={false}
            linkHref=""
            linkText=""
            onClose={() => setShowAlert(false)}
          />
        </div>
      )} */}

      <Box className="mt-10 w-full max-w-8xl">
        {/* Current Plan + Assign Plan in same row */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="subtitle1" className="font-outfit" sx={{ fontWeight: 600 }}>
            Current Plan:{' '}
            <strong>{currentPlan?.subscription_plan_id?.plan_name || 'No Active Plan'}</strong>
          </Typography>

          <Button
            onClick={() => {
              setSelectedSubscription(null);
              setOpenAssignDialog(true);
            }}
          >
            <AddIcon /> Assign Plan
          </Button>
        </Box>

        {/* Data Table */}
        <DataTable
          data={subscriptions}
          clickHandler={clickHandler}
          columns={columns}
          pageIndex={pageIndex}
          pageSize={pageSize}
          rowCount={totalItems}
          onPaginationChange={({ pageIndex, pageSize }) => {
            setPageIndex(pageIndex);
            setPageSize(pageSize);
            dispatch(fetchSubscriptionbydealer({
              userId: dealer._id,
              search: searchTerm,
              page: pageIndex,
              limit: pageSize,
            }));
          }}
        />

        {/* Assign Plan Dialog */}
        <Dialog
          open={openAssignDialog}
          onClose={handleCloseDialog}
          maxWidth="sm"
          fullWidth
          PaperProps={{ sx: { borderRadius: '25px' } }}
          BackdropProps={{
            sx: {
              backdropFilter: 'blur(4px)',
              backgroundColor: 'rgba(0, 0, 0, 0.2)',
            },
          }}
        >
          <Box
            sx={{
              background: 'linear-gradient( #255593 103.05%)',
              height: 60,
              px: 4,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              color: 'white',
            }}
          >
            <DialogTitle className="font-outfit" sx={{ color: 'white' }}>
              Assign Subscription Plan
            </DialogTitle>
            <IconButton sx={{ color: 'white' }} onClick={handleCloseDialog}>
              <CloseIcon />
            </IconButton>
          </Box>

          <DialogContent>
            {/* 🔔 Alert moved inside the dialog */}
            {showAlert && alertType && (
              <Box mb={2}>
                <Alert
                  type={alertType}
                  title={
                    alertType === 'success'
                      ? 'Success!'
                      : alertType === 'error'
                        ? 'Error!'
                        : 'Warning!'
                  }
                  message={alertMessage}
                  variant="filled"
                  showLink={false}
                  linkHref=""
                  linkText=""
                  onClose={() => setShowAlert(false)}
                />
              </Box>
            )}

            {selectedSubscription !== undefined && (
              <Box display="flex" flexDirection="column" gap={2} mt={2}>
                <div className="flex flex-col">
                  <label className="text-sm text-gray-600 dark:text-white mb-1 block">
                    Plans <span className="text-error-500"> * </span>
                  </label>

                  <select
                    name="plan_id"
                    value={newPlan.plan_id}
                    onChange={(e) => {
                      const selectedPlan = SubscriptionList.find(plan => plan._id === e.target.value);
                      if (selectedPlan) {
                        setNewPlan({
                          plan_id: selectedPlan._id,
                          category_id: selectedPlan.category_id, // store category_id as well
                        });
                      } else {
                        setNewPlan({ plan_id: '', category_id: '' });
                      }
                    }}
                    className="mt-1 p-2 border rounded"
                  >
                    <option value="">Select Subscription Plan</option>
                    {SubscriptionList?.filter((p) => p.isActive).map((plan) => (
                      <option key={plan._id} value={plan._id}>
                        {plan.google_product_id} — {plan.plan_name} — ₹{plan.price}
                      </option>
                    ))}
                  </select>
                </div>


                <Box display="flex" gap={10}>
                  <DateTimeField
                    widthClass="50"
                    label="Start Date"
                    name="start_date"
                    type="date"
                    value={start_date ?? ''}
                    onChange={(e) => setstart_date(e.target.value)}
                    minDate={dayjs().format('YYYY-MM-DD')}
                  />

                  <DateTimeField
                    widthClass="50"
                    label="End Date"
                    name="end_date"
                    type="date"
                    value={end_date ?? ''}
                    onChange={(e) => setend_date(e.target.value)}
                    minDate={start_date}
                  />
                </Box>

                <Box display="flex" justifyContent="center" gap={3} mt={4}>
                  {newPlan.plan_id && start_date && end_date && (
                    <Button onClick={handleAssignSubscriptionToDealer}>Save</Button>
                  )}
                  <Button variant="secondary" onClick={handleCloseDialog}>
                    Cancel
                  </Button>
                </Box>
              </Box>
            )}
          </DialogContent>
        </Dialog>

      </Box>
    </>
  );
};
export default DealerSubscriptionTab;
