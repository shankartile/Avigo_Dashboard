import {
  Box,
  Typography,
  Avatar,
  IconButton,
  Dialog,
  DialogContent,
  DialogTitle,
  Table, TableBody, TableCell, TableContainer,
  TableRow, Tooltip,
  Paper, Rating,
  Chip
} from '@mui/material';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import React, { useEffect } from 'react';
import InfoIcon from '@mui/icons-material/Info';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CloseIcon from '@mui/icons-material/Close';
import PreviewIcon from '@mui/icons-material/Preview';
import EditIcon from '@mui/icons-material/Edit';
import { MRT_ColumnDef } from 'material-react-table';
import DataTable from '../../tables/DataTable';
import { useState } from 'react';
import TextField from '../../form/input/InputField';
import Button from '../../ui/button/Button';
import FileInput from '../../form/input/FileInput';
import Alert from '../../ui/alert/Alert';
import SweetAlert from '../../ui/alert/SweetAlert';
import ToggleSwitch from '../../ui/toggleswitch/ToggleSwitch';
import TextAreaField from '../../form/input/TextArea';
import { useNavigate } from 'react-router-dom';


import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../store/store';
import { fetchCategoryMaster, fetchSubscriptionList, fetchdealerlistpersubscription, addSubscriptionDetails, updateSubscriptionDetails, deleteSubscription, toggleSubscriptionStatus } from '../../../store/SubscriptionManagement/SubscriptionManagementSlice';
import { Ban } from 'lucide-react';



type SubscriptionManagement = {
  _id: string;
  title: string;
  description: string;
  category_id: string;
  category: string;
  listings_allowed: string;
  validity_in_days: string;
  price: string;
  basePlanId: string;
  productId: string;
  plan_name: string;


};


const SubscriptionManagement = () => {
  const [showForm, setShowForm] = useState(false);
  const [newSubscription, setnewSubscription] = useState<SubscriptionManagement>({
    _id: '',
    title: '',
    category_id: '',
    category: '',
    listings_allowed: '',
    validity_in_days: '',
    price: '',
    description: '',
    basePlanId: '',
    productId: '',
    plan_name: ''


  });
  const [selectedSubscription, setselectedSubscription] = useState<SubscriptionManagement | null>(null);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [alertType, setAlertType] = useState<'success' | 'error' | 'warning' | 'info' | null>(null);
  const [alertMessage, setAlertMessage] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [errors, setErrors] = useState({
    title: '',
    category_id: '',
    category: '',
    listings_allowed: 0,
    validity_in_days: 0,
    price: 0,
    basePlanId: '',
    productId: '',
    plan_name: '',
    description: ''

  });
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [toggleUser, setToggleUser] = useState<{ _id: string; isActive: boolean } | null>(null);
  const [showToggleModal, setShowToggleModal] = useState(false);
  const [viewDealerDialogOpen, setViewDealerDialogOpen] = useState(false);
  const [selectedSubscriptionId, setSelectedSubscriptionId] = useState<string | null>(null);
  const [dealerPageIndex, setDealerPageIndex] = useState(0);
  const [dealerPageSize, setDealerPageSize] = useState(10);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();


  const dispatch = useDispatch<AppDispatch>();

  // Define the type for CategoryMaster items
  type CategoryMasterType = {
    _id: string;
    category_name: string;
    isActive: boolean;
  };

  const { CategoryMaster: rawList = [] } = useSelector((state: RootState) => state.CategoryMaster);
  const CategoryMaster = (rawList as CategoryMasterType[]).filter((c) => c.isActive);


  const { dealerList = [], dealerTotalItems: dealerTotal = 0 } = useSelector((state: RootState) => state.Subscription);

  useEffect(() => {
    if (selectedSubscriptionId) {
      dispatch(fetchdealerlistpersubscription({
        subscriptionId: selectedSubscriptionId,
        page: dealerPageIndex,
        limit: dealerPageSize,
      }));
    }
  }, [selectedSubscriptionId, dealerPageIndex, dealerPageSize]);


  useEffect(() => {
    const delayDebounce = setTimeout(() => {

      dispatch(fetchCategoryMaster({
        search: searchTerm,
        page: pageIndex,
        limit: pageSize,
      }));
    }, 500); // 500ms delay

    return () => clearTimeout(delayDebounce);
  }, [searchTerm, pageIndex, pageSize]);


  useEffect(() => {
    const delayDebounce = setTimeout(() => {

      dispatch(fetchSubscriptionList({
        search: searchTerm,
        page: pageIndex,
        limit: pageSize,
      }));
    }, 500); // 500ms delay

    return () => clearTimeout(delayDebounce);
  }, [searchTerm, pageIndex, pageSize]);


  const { SubscriptionList, totalItems } = useSelector((state: RootState) => state.Subscription);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    setnewSubscription((prev) => ({
      ...prev,
      [name]: value, // clean number input
    }));
  };


  const validateField = (name: string, value: string): string => {
    if (name === "description") {
      if (!value.trim()) return `${name} is required`;
      if (!/[a-zA-Z]/.test(value)) return `${name} must contain words, not just numbers`;
      if (value.trim().length < 10) return `${name} should be at least 10 characters long`;
    }
    return "";
  };

  const validateFAQFields = () => {
    const dscriptionError = /[a-zA-Z]/.test(newSubscription.description) && newSubscription.description.trim().length >= 10;
    return dscriptionError;
  };


  const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    setnewSubscription((prev) => ({ ...prev, [name]: value }));

    // Real-time validation
    setErrors((prev) => ({
      ...prev,
      [name]: validateField(name, value),
    }));
  };


  // function to add new subscription details
  const handleAddSubscriptiondetails = async () => {

    if (loading) return; // Prevent multiple submissions

    setLoading(true);


    try {
      const selectedCategory = CategoryMaster.find(
        (cat) => cat._id === newSubscription.category_id
      );

      const payload = {
        //  Required default values
        packageName: "com.gadilobharat.dealers",
        listing: {
          languageCode: "en-US",
          title: newSubscription.title, // optional: if you want to send title
          description: newSubscription.description // optional default
        },
        basePlan: {
          basePlanId: "monthly-base", // or generate dynamically
          autoRenewingBasePlanType: {
            billingPeriodDuration: "P1M"
          }
        },

        //  Dynamic fields from form
        productId: newSubscription.productId,
        title: newSubscription.title,
        category_id: newSubscription.category_id,
        category: selectedCategory?.category_name || '',
        listings_allowed: newSubscription.listings_allowed,
        validity_in_days: newSubscription.validity_in_days,
        price: newSubscription.price,
      };

      const result = await dispatch(addSubscriptionDetails(payload)).unwrap();

      setAlertType('success');
      setAlertMessage('Subscription details submitted successfully.');
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);

      // Refresh the table data
      dispatch(fetchSubscriptionList({
        search: searchTerm,
        page: pageIndex,
        limit: pageSize,
      }));

      setShowForm(false);
    } catch (err: any) {
      setAlertType('error');
      setAlertMessage('Submission failed: ' + err);
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
    } finally {
      setLoading(false);
    }
  };


  // const isFinalFormEmpty =
  //   !newSubscription.title?.trim() ||
  //   !newSubscription.category?.trim() ||
  //   !newSubscription.listings_allowed &&
  //   !newSubscription.validity_in_days &&
  //   !newSubscription.price;



  const isFinalFormEmpty =
    !newSubscription.title?.trim() ||
    !newSubscription.category_id?.trim() ||
    !newSubscription.listings_allowed?.trim() ||
    !newSubscription.validity_in_days?.trim() ||
    !validateFAQFields() ||
    !newSubscription.price?.trim();





  // const handleEdit = async (subscription: any, index: number) => {

  //   setnewSubscription({
  //     _id: subscription._id,
  //     category_id: subscription.category_id,
  //     category: subscription.category,
  //     title: subscription.title || '',
  //     listings_allowed: subscription.listings_allowed || '',
  //     validity_in_days: subscription.validity_in_days || '',
  //     price: subscription.price || '',
  //     description: subscription.description || '',
  //     basePlanId: subscription.basePlanId || '',
  //     productId: subscription.productId || ''
  //   });

  //   setShowForm(true);
  //   setEditIndex(index);
  // };




  // Function to handle the update of subscription details



  // const handleUpdateSubscriptionDetails = async () => {

  //   try {
  //     const selectedCategory = CategoryMaster.find(
  //       (cat) => cat._id === newSubscription.category_id
  //     );


  //     const payload = {
  //       _id: newSubscription._id,

  //       title: newSubscription.title,
  //       category_id: newSubscription.category_id,
  //       category: selectedCategory?.category_name || '',
  //       listings_allowed: (newSubscription.listings_allowed),
  //       validity_in_days: (newSubscription.validity_in_days),
  //       price: (newSubscription.price),
  //     };


  //     const result = await dispatch(updateSubscriptionDetails(payload)).unwrap();

  //     setAlertType('success');
  //     setAlertMessage('Subscription details updated successfully.');
  //     setShowAlert(true);
  //     setTimeout(() => {
  //       setShowAlert(false);
  //     }, 3000);

  //     setShowForm(false);
  //     setEditIndex(null);
  //     dispatch(fetchSubscriptionList({
  //       search: searchTerm,
  //       page: pageIndex,
  //       limit: pageSize,
  //     }));
  //   } catch (err: any) {
  //     setAlertType('error');
  //     setAlertMessage('Update failed: ' + err);
  //     setShowAlert(true);
  //     setTimeout(() => setShowAlert(false), 3000);

  //   }
  // };


  const requestDelete = (id: string) => {
    setDeleteId(id);
    setShowModal(true);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;

    try {
      await dispatch(deleteSubscription(deleteId)).unwrap();
      setAlertType('error');
      setAlertMessage('Subscription deleted successfully.');
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
      }, 3000);

      dispatch(fetchSubscriptionList({
        search: searchTerm,
        page: pageIndex,
        limit: pageSize,
      }));
    } catch (err) {
      setAlertType('error');
      setAlertMessage('Delete failed: ' + err);
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);

    }

    setShowModal(false);
    setDeleteId(null);
  };

  const cancelDelete = () => {
    setShowModal(false);
    setDeleteId(null);
  };




  const handleToggleClick = (user: { _id: string; isActive: boolean }) => {
    setToggleUser(user);
    setShowToggleModal(true);
  };

  const confirmToggle = async () => {
    if (!toggleUser) return;

    try {
      await dispatch(toggleSubscriptionStatus({
        _id: toggleUser._id,
        isActive: !toggleUser.isActive
      })).unwrap();

      setAlertType('success');
      setAlertMessage(`Subscription ${toggleUser.isActive ? 'deactivated' : 'activated'} successfully.`);
      setShowAlert(true);

      dispatch(fetchSubscriptionList({ search: searchTerm, page: pageIndex, limit: pageSize }));
    } catch (err) {
      setAlertType('error');
      setAlertMessage('Status toggle failed: ' + err);
      setShowAlert(true);
    }

    setTimeout(() => setShowAlert(false), 3000);
    setShowToggleModal(false);
    setToggleUser(null);
  };

  const cancelToggle = () => {
    setShowToggleModal(false);
    setToggleUser(null);
  };




  const handleView = (user: any) => {
    setShowForm(false);
    setselectedSubscription(user);
  };


  const handleCloseModal = () => {
    setselectedSubscription(null);
    setShowForm(false);

  };


  const clickHandler = (searchText: string) => {
    setSearchTerm(searchText);
    setPageIndex(0);
    // dispatch(fetchSubscriptionList({
    //   search: searchText,
    //   page: 0,
    //   limit: pageSize,
    // }));
  };
  const userColumns: MRT_ColumnDef<any>[] = [
    {
      accessorKey: 'plan_name',
      header: 'Plan Name',
      muiTableHeadCellProps: { align: 'center' },
      muiTableBodyCellProps: { align: 'center' },
    },
    {
      accessorKey: 'google_product_id',
      header: 'Category Name',
      muiTableHeadCellProps: { align: 'center' },
      muiTableBodyCellProps: { align: 'center' },
    },
    {
      header: 'Price (₹)',
      accessorFn: (row) => row.price ?? 0,
      Cell: ({ cell }) => `₹${cell.getValue()}`,
      muiTableHeadCellProps: { align: 'center' },
      muiTableBodyCellProps: { align: 'center' },
    },
    {
      accessorKey: 'listings_allowed',
      header: 'Listings Allowed',
      muiTableHeadCellProps: { align: 'center' },
      muiTableBodyCellProps: { align: 'center' },
    },
    {
      accessorKey: 'validity_in_days',
      header: 'Validity In Days',
      muiTableHeadCellProps: { align: 'center' },
      muiTableBodyCellProps: { align: 'center' },
    },
    {
      accessorKey: 'dealerPurchaseCount',
      header: 'Total Subscribers',
      muiTableHeadCellProps: { align: 'center' },
      muiTableBodyCellProps: { align: 'center' },
      Cell: ({ cell }) => (
        <Box display="flex" justifyContent="center">
          <Chip
            className="font-outfit"
            label={cell.getValue<number>()}
            color="primary"
            size="medium"
            sx={{ fontWeight: 500 }}
          />
        </Box>
      ),
    },
    {
      accessorKey: 'createdAt',
      header: 'Registration Date',
      muiTableHeadCellProps: { align: 'center' },
      muiTableBodyCellProps: { align: 'center' },
      Cell: ({ cell }) => {
        const date = cell.getValue() as string;
        return new Date(date).toLocaleString('en-IN', {
          timeZone: 'Asia/Kolkata',
        });
      },
    },
    // {
    //   accessorKey: 'updatedAt',
    //   header: 'Last Updated',
    //   muiTableHeadCellProps: { align: 'center' },
    //   muiTableBodyCellProps: { align: 'center' },
    //   Cell: ({ cell }) => {
    //     const date = cell.getValue() as string;
    //     return new Date(date).toLocaleString('en-IN', {
    //       timeZone: 'Asia/Kolkata',
    //     });
    //   },
    // },
    {
      header: 'Actions',
      muiTableHeadCellProps: { align: 'center' },
      muiTableBodyCellProps: { align: 'center' },
      Cell: ({ row }) => {
        const dispatch = useDispatch<AppDispatch>();
        const subscription = row.original;

        return (

          <Box display="flex" justifyContent="center" gap={1}>
            <Tooltip title='Click to view subscribed users'>
              <IconButton
                color="primary"
                onClick={() => navigate(`${subscription._id}/dealers`)}
              >
                <VisibilityIcon />
              </IconButton>
            </Tooltip>
            {/* <ToggleSwitch
              checked={row.original.isActive}
              onChange={() => handleToggleClick(row.original)}
              tooltipTitle={row.original.isActive ? 'Deactivate' : 'Activate'}
            /> */}
          </Box>
        );
      },
    },
  ];



  // const dealerColumns: MRT_ColumnDef<any>[] = [
  //   { accessorKey: 'dealer.name', header: 'Dealer Name' },
  //   { accessorKey: 'dealer.email', header: 'Email' },
  //   { accessorKey: 'dealer.phone', header: 'Phone' },
  //   {
  //     accessorKey: 'listings_used',
  //     header: 'Listings Used',
  //     Cell: ({ cell }) => (
  //       <Chip label={cell.getValue<number>()} color="secondary" />
  //     )
  //   },
  //   {
  //     accessorKey: 'start_date',
  //     header: 'Start Date',
  //     Cell: ({ cell }) => {
  //       const dateStr = cell.getValue() as string;
  //       return new Date(dateStr).toLocaleDateString('en-IN');
  //     },
  //   },
  //   {
  //     accessorKey: 'end_date',
  //     header: 'End Date',
  //     Cell: ({ cell }) => {
  //       const dateStr = cell.getValue() as string;
  //       return new Date(dateStr).toLocaleDateString('en-IN');
  //     },
  //   },

  //   {
  //     accessorKey: 'invoice_url',
  //     header: 'Invoice',
  //     Cell: ({ cell }) => {
  //       const url = cell.getValue() as string | undefined;
  //       return url ? (
  //         <a href={url} target="_blank" rel="noopener noreferrer">
  //           <PictureAsPdfIcon color="error" />
  //         </a>
  //       ) : (
  //         <span>N/A</span>
  //       );
  //     }
  //   }

  // ];


  return (
    <>
      {/* <Dialog
        open={viewDealerDialogOpen}
        onClose={() => {
          setViewDealerDialogOpen(false);
          setSelectedSubscriptionId(null);
        }}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>
          Dealers Subscribed
          <IconButton onClick={() => setViewDealerDialogOpen(false)} sx={{ float: 'right' }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <DataTable
            data={dealerList}
            columns={dealerColumns}
            rowCount={dealerTotal}
            pageIndex={dealerPageIndex}
            pageSize={dealerPageSize}
            onPaginationChange={({ pageIndex, pageSize }) => {
              setDealerPageIndex(pageIndex);
              setDealerPageSize(pageSize);
            }}
          />
        </DialogContent>
      </Dialog> */}

      <Dialog
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        maxWidth="md"
        fullWidth
        disableEnforceFocus
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Preview
          <IconButton onClick={() => setPreviewOpen(false)} sx={{ color: 'black' }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
      </Dialog>


      <SweetAlert
        show={showToggleModal}
        type="warning"
        title="Confirm Status Change"
        message={`Are you sure you want to ${toggleUser?.isActive ? 'deactivate' : 'activate'} this subscription?`}
        onConfirm={confirmToggle}
        onCancel={cancelToggle}
        confirmText="Yes"
        cancelText="No"
      />
      <SweetAlert
        show={showModal}
        type="error"
        title="Confirm Deletion"
        message="Are you sure you want to delete this subscription?"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        confirmText="Yes"
        cancelText="No"
      />

      {showAlert && alertType && (
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
      )}

      {!showForm ? (
        <>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2} >
            <Box ml={2}>

              <Typography
                variant="h5"
                fontWeight={500}
                className='font-outfit'
              >
                Subscription Management  <Tooltip
                  title="Create and manage subscription plans for car, bike, and spare part categories."
                  arrow
                  slotProps={{
                    popper: {
                      sx: {
                        '& .MuiTooltip-tooltip': {
                          fontSize: '0.9rem',
                          backgroundColor: '#245492',
                          color: '#fff',
                          fontFamily: 'Outfit',
                          padding: '8px 12px',
                        },
                        '& .MuiTooltip-arrow': {
                          color: '#245492',
                        },
                      },
                    },
                  }}
                >
                  <InfoIcon
                    fontSize="medium"
                    sx={{ color: '#245492', cursor: 'pointer' }}
                    onClick={(e) => e.stopPropagation()}
                  />
                </Tooltip>
              </Typography>
            </Box>
            {/* <Button onClick={() => setShowForm(true)}> */}
            {/* <Button
              onClick={() => {
                setnewSubscription({
                  title: '',
                  description: '',
                  category_id: '',
                  category: '',
                  listings_allowed: '',
                  validity_in_days: '',
                  basePlanId: '',
                  price: '',
                  productId: '',
                  plan_name: '',

                  _id: ''

                });
                setEditIndex(null);
                setShowForm(true);
              }}
            >
              <PersonAddIcon />Add Subscription Plan
            </Button> */}
          </Box>



          <DataTable
            clickHandler={clickHandler}
            data={SubscriptionList}
            columns={userColumns}
            rowCount={totalItems}
            pageIndex={pageIndex}
            pageSize={pageSize}
            onPaginationChange={({ pageIndex, pageSize }) => {
              setPageIndex(pageIndex);
              setPageSize(pageSize);
            }}
          />
        </>
      ) : (
        <></>
        // <Dialog
        //   open={showForm}
        //   onClose={(event, reason) => {
        //     if (reason !== 'backdropClick') {
        //       setShowForm(false);
        //     }
        //   }}
        //   maxWidth="md"
        //   fullWidth
        //   PaperProps={{ sx: { borderRadius: '25px' } }}
        //   BackdropProps={{
        //     sx: {
        //       backdropFilter: 'blur(4px)',
        //       backgroundColor: 'rgba(0, 0, 0, 0.2)'
        //     }
        //   }}
        // >
        //   <Box
        //     sx={{
        //       background: 'linear-gradient( #255593 103.05%)',
        //       height: 25,
        //       p: 4,
        //       position: 'relative',
        //     }}
        //   >
        //     <DialogTitle className='font-outfit' sx={{ color: 'white', position: 'absolute', top: 5 }}>
        //       {editIndex !== null ? 'Edit Subscription Plan' : 'Add New Subscription Plan'}
        //     </DialogTitle>

        //     <IconButton
        //       sx={{ position: 'absolute', top: 12, right: 12, color: 'white' }}
        //       onClick={() => setShowForm(false)}
        //     >
        //       <CloseIcon />
        //     </IconButton>
        //   </Box>
        //   <DialogContent>


        //     <>
        //       {showAlert && alertType && (
        //         <div className="p-4">
        //           <Alert
        //             type={alertType}
        //             title={alertType === 'success' ? 'Success!' : alertType === 'error' ? 'Error!' : 'Warning!'}
        //             message={alertMessage}
        //             variant="filled"
        //             showLink={false}
        //             linkHref=""
        //             linkText=""
        //             onClose={() => setShowAlert(false)}
        //           />
        //         </div>
        //       )}

        //       <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4" >

        //         <div className="flex flex-col">
        //           <label className="text-sm text-gray-600 dark:text-white mb-1 block">Category <span className="text-error-500"> * </span>
        //           </label>

        //           <select
        //             name="category_id"
        //             value={newSubscription.category_id}
        //             onChange={handleChange}
        //             className="mt-1 p-2 border rounded"
        //           >
        //             <option value="">Select Category</option>
        //             {CategoryMaster?.filter((c) => c.isActive).map((category) => (
        //               <option key={category._id} value={category._id}>
        //                 {category.category_name}
        //               </option>
        //             ))}
        //           </select>

        //         </div>

        //         <TextField
        //           label="Product Id"
        //           name="productId"
        //           value={newSubscription.productId}
        //           type="text"
        //           onChange={handleChange}
        //           error={!!errors.productId}
        //           helperText={errors.productId}
        //         />
        //         <TextField
        //           label="Title"
        //           name="title"
        //           value={newSubscription.title}
        //           type="text"
        //           onChange={handleChange}
        //           error={!!errors.title}
        //           helperText={errors.title}
        //         />

        //         <>
        //           <TextField
        //             label="Base Plan"
        //             name="basePlanId"
        //             value={newSubscription.basePlanId}
        //             type="text"
        //             onChange={handleChange}
        //             error={!!errors.basePlanId}
        //             helperText={errors.basePlanId}
        //           />
        //           <TextField
        //             label="Listings Allowed"
        //             name="listings_allowed"
        //             value={newSubscription.listings_allowed}
        //             onChange={handleChange}
        //             error={!!errors.listings_allowed}
        //           />
        //           <TextField
        //             label="Validity in Days"
        //             name="validity_in_days"
        //             value={newSubscription.validity_in_days}
        //             type="validity_in_days"
        //             onChange={handleChange}
        //             error={!!errors.validity_in_days}
        //           />
        //         </>

        //         <TextField
        //           label="Price"
        //           name="price"
        //           value={newSubscription.price}
        //           onChange={handleChange}
        //           error={!!errors.price}
        //         />
        //         <TextAreaField
        //           label="Description"
        //           name="description"
        //           value={newSubscription.description}
        //           onChange={handleTextAreaChange}
        //           errorMessage={errors.description}
        //         />
        //       </div>

        //       <Box display="flex" justifyContent="center" gap={6} mt={4} >
        //         <Button
        //           onClick={handleAddSubscriptiondetails}
        //           disabled={isFinalFormEmpty || loading}
        //         >
        //           {loading ? (editIndex !== null ? 'Updating...' : 'Submitting...') : (editIndex !== null ? 'Update' : 'Submit')}
        //         </Button>

        //         <Button variant="secondary" onClick={() => setShowForm(false)} className="rounded-[25px]">
        //           Cancel
        //         </Button>
        //       </Box>

        //     </>
        //   </DialogContent>
        // </Dialog>
      )}

      <Dialog open={!!selectedSubscription} onClose={handleCloseModal} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: '25px' } }}
        BackdropProps={{
          sx: {
            backdropFilter: 'blur(4px)',
            backgroundColor: 'rgba(0, 0, 0, 0.2)'
          }
        }}>
        <Box className="rounded-xl overflow-hidden">
          {/* Gradient Header */}
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
            <Typography className="font-outfit" variant="h6">
              Subscription Details
            </Typography>
            <IconButton sx={{ color: 'white' }} onClick={handleCloseModal}>
              <CloseIcon />
            </IconButton>
          </Box>

          <DialogContent sx={{ pb: 4 }}>
            {selectedSubscription && (
              <Box className="grid grid-cols-2 gap-4">
                <Typography className="font-outfit">
                  <strong>Plan Name:</strong> {selectedSubscription.plan_name}
                </Typography>
                <Typography className="font-outfit">
                  <strong>Category:</strong> {selectedSubscription.category}
                </Typography>
                <Typography className="font-outfit">
                  <strong>Listings Allowed:</strong> {selectedSubscription.listings_allowed}
                </Typography>
                <Typography className="font-outfit">
                  <strong>Validity In Days:</strong> {selectedSubscription.validity_in_days}
                </Typography>
                <Typography className="font-outfit">
                  <strong>Price:</strong> {selectedSubscription.price}
                </Typography>
              </Box>
            )}
          </DialogContent>
        </Box>
      </Dialog>
    </>
  );
};

export default SubscriptionManagement;