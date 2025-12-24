// import {
//   Box, Typography, IconButton, Dialog, DialogContent, DialogTitle,
//   Chip, Rating, Tooltip
// } from '@mui/material';
// import InfoIcon from '@mui/icons-material/Info';
// import VisibilityIcon from '@mui/icons-material/Visibility';
// import DoneIcon from '@mui/icons-material/Done';
// import DeleteIcon from '@mui/icons-material/Delete';
// import CloseIcon from '@mui/icons-material/Close';
// import { useParams, useNavigate, useSearchParams } from 'react-router-dom';

// import React, { useEffect, useMemo, useRef, useState } from 'react';
// import { MRT_ColumnDef } from 'material-react-table';
// import { useDispatch, useSelector } from 'react-redux';
// import DataTable from '../../tables/DataTable';
// import Alert from '../../ui/alert/Alert';
// import SweetAlert from '../../ui/alert/SweetAlert';
// import Button from '../../ui/button/Button';
// import DateTimeField from '../../form/input/DateTimeField';
// import { AppDispatch, RootState } from '../../../store/store';
// import { fetchFeedbackList, exportFeedbackList, deleteFeedback, } from '../../../store/SocietyFeedbackManagement/SocietyFeedbackManagementSlice';

// interface Feedback {
//   userId: any;
//   id: string;
//   user_id: string;
//   userName: string;
//   userEmail: string;
//   phone: string;
//   comment: string;
//   rating: number;
//   userType: string;
//   submissionDate: string;
//   responseTimestamp: string;
// }

// /* ===================== DUMMY FEEDBACK DATA ===================== */

// const dummyFeedbacks: Feedback[] = [
//   {
//     id: '1',
//     userId: 'U001',
//     user_id: 'U001',
//     userType: 'admin',
//     userName: 'Rahul Sharma',
//     userEmail: 'rahul.sharma@gmail.com',
//     phone: '9876543210',
//     comment: 'Very good society management and quick response.',
//     rating: 4.5,
//     submissionDate: '2025-01-05T10:30:00',
//     responseTimestamp: '2025-01-05T12:00:00',
//   },
//   {
//     id: '2',
//     userId: 'U002',
//     user_id: 'U002',
//     userType: 'webuser',
//     userName: 'Sneha Patil',
//     userEmail: '',
//     phone: '9123456789',
//     comment: 'Maintenance service can be improved.',
//     rating: 3.0,
//     submissionDate: '2025-01-06T15:45:00',
//     responseTimestamp: '2025-01-06T16:30:00',
//   },
//   {
//     id: '3',
//     userId: 'U003',
//     user_id: 'U003',
//     userType: 'admin',
//     userName: 'Amit Kulkarni',
//     userEmail: 'amit.k@gmail.com',
//     phone: '9988776655',
//     comment: 'Security staff is very helpful and polite.',
//     rating: 5.0,
//     submissionDate: '2025-01-07T09:20:00',
//     responseTimestamp: '2025-01-07T10:00:00',
//   },
// ];



// const SocietyFeedbackManagement = () => {
//   const dispatch = useDispatch<AppDispatch>();
//   const feedbacks = useSelector((state: RootState) => state.societyfeedback.feedbacks);
//   const totalItems = useSelector((state: RootState) => state.societyfeedback.totalItems);
//   const [fromDate, setFromDate] = useState('');
//   const [toDate, setToDate] = useState('');

//   const [filtertype, setFiltertype] = useState<string>('admin');

//   const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);
//   const [alertType, setAlertType] = useState<'success' | 'error' | 'warning' | 'info'>('info');
//   const [alertMessage, setAlertMessage] = useState('');
//   const [showAlert, setShowAlert] = useState(false);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [pageIndex, setPageIndex] = useState(0);
//   const [pageSize, setPageSize] = useState(10);
//   const [columnFilters, setColumnFilters] = useState<{ id: string; value: any }[]>([]);
//   const [prevSearchField, setPrevSearchField] = useState('');
//   const [isInitialised, setIsInitialised] = useState(false);
//   const [searchParams, setSearchParams] = useSearchParams();

//   const [modal, setModal] = useState(false);
//   const [deleteId, setDeleteId] = useState<string | null>(null);


//   useEffect(() => {
//     const delayDebounce = setTimeout(() => {

//       dispatch(fetchFeedbackList({
//         fromDate,
//         toDate,
//         search: searchTerm,
//         searchField: prevSearchField,
//         type: filtertype === 'admin' ? '' : 'webuser',
//         page: pageIndex,
//         limit: pageSize,
//       }));
//     }, 500); // 500ms delay

//     return () => clearTimeout(delayDebounce);
//   }, [searchTerm, pageIndex, pageSize, filtertype, prevSearchField]);




//   useEffect(() => {
//     const typeFromURL = searchParams.get('type');
//     if (
//       (typeFromURL === 'admin' || typeFromURL === 'webuser') &&
//       typeFromURL !== filtertype
//     ) {
//       setFiltertype(typeFromURL);
//     }
//     setIsInitialised(true); //  Allow main fetch after URL param is applied
//   }, []);




//   // const handleColumnFilterChange = (filters: { id: string; value: any }[]) => {
//   //   // Extract the first non-empty filter
//   //   const activeFilter = filters.find(f => f.value?.trim?.() !== '');

//   //   // Extract values safely
//   //   const search = activeFilter?.value?.trim() || '';
//   //   const searchField = activeFilter?.id || '';

//   //   // If filter is same as previous, skip API call
//   //   if (search === searchTerm && searchField === prevSearchField) return;

//   //   // Update states
//   //   setColumnFilters(filters);
//   //   setSearchTerm(search);
//   //   setPrevSearchField(searchField);
//   //   setPageIndex(0);

//   //   // Dispatch API with updated filters
//   //   const delayDebounce = setTimeout(() => {

//   //     dispatch(fetchFeedbackList({
//   //       fromDate,
//   //       toDate,
//   //       search,
//   //       searchField,
//   //       page: 0,
//   //       type: filtertype,
//   //       limit: pageSize,
//   //     }));
//   //   }, 500); // 500ms delay

//   //   return () => clearTimeout(delayDebounce);
//   // };





//   const debounceTimer = useRef<NodeJS.Timeout | null>(null);

//   const handleColumnFilterChange = (filters: { id: string; value: any }[]) => {
//     setColumnFilters(filters);
//     setPageIndex(0);

//     const filterParams: Record<string, any> = {};

//     filters.forEach(({ id, value }) => {
//       if (!value) return;

//       if (id === 'isActive') {
//         filterParams[id] = value === 'Active' ? true : false;
//       } else if (typeof value === 'string' && value.trim()) {
//         filterParams[id] = value.trim();
//       } else {
//         filterParams[id] = value;
//       }
//     });

//     const payload = {
//       type: filtertype,
//       filters: filterParams,
//       fromDate,
//       toDate,
//       page: 0,
//       limit: pageSize,
//     };

//     //  Debounce logic
//     if (debounceTimer.current) clearTimeout(debounceTimer.current);
//     debounceTimer.current = setTimeout(() => {
//       dispatch(fetchFeedbackList(payload));
//     }, 500);
//   };









//   // Confirm Delete
//   const confirmDelete = async () => {
//     if (!deleteId) return;

//     try {
//       await dispatch(deleteFeedback({ id: deleteId, type: filtertype })).unwrap();
//       setAlertType('error');
//       setAlertMessage('Feedback deleted successfully');
//       setTimeout(() => {
//         setShowAlert(false);
//       }, 1000);
//     } catch {
//       setAlertType('error');
//       setAlertMessage('Failed to delete feedback');
//     } finally {
//       setShowAlert(true);
//       setModal(false);
//       setDeleteId(null);
//     }
//   };

//   const clickHandler = async (searchText: string, exportType?: string) => {
//     setSearchTerm(searchText);
//     setPageIndex(0);

//     if (exportType) {
//       await dispatch(exportFeedbackList({
//         fromDate,
//         toDate,
//         type: filtertype,
//         search: searchText,
//         exportType: exportType as 'csv' | 'pdf',
//       }));
//       // } else {
//       //   await dispatch(fetchFeedbackList({
//       //     fromDate,
//       //     toDate,
//       //     search: searchText,
//       //     type: filtertype,
//       //     page: 0,
//       //     limit: pageSize,
//       //   }));
//     }
//   };

//   const handleCloseModal = () => {
//     setSelectedFeedback(null);
//   };

//   const handleView = (fb: Feedback) => setSelectedFeedback(fb);


//   const feedbackTypeMap: Record<string, string> = {
//     type: filtertype === 'admin' ? '' : filtertype

//   };
//   const filteredFeedbacks = feedbacks.filter((fb) =>
//     filtertype === 'webuser' ? true : fb.type === filtertype
//   );


//   const truncateText = (text?: string, maxLength = 50): string => {
//     if (!text) return '';
//     return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
//   };


//   useEffect(() => {
//     // Skip if one date is filled and the other is not
//     if ((fromDate && !toDate) || (!fromDate && toDate)) return;

//     const payload = {
//       fromDate: fromDate || undefined,
//       toDate: toDate || undefined,
//       type: filtertype

//       // ...other filters like pagination or search
//     };

//     dispatch(fetchFeedbackList(payload));
//   }, [fromDate, toDate]);



//   const columns = useMemo<MRT_ColumnDef<Feedback>[]>(() => {
//     const cols: MRT_ColumnDef<Feedback>[] = [
//       { accessorKey: 'userType', header: 'Submitted by', filterVariant: 'text' },

//       {
//         accessorFn: (row) => row.userName || 'N/A',
//         id: 'userName',
//         header: 'User Name',
//         filterVariant: 'text',
//       },
//     ];

//     // 👇 Add exactly one of these based on filtertype
//     if (filtertype === 'admin') {
//       cols.push({
//         accessorFn: (row) => row.userEmail,
//         id: 'userEmail',
//         header: 'Email',
//         filterVariant: 'text',
//       });

//     } else if (filtertype === 'webuser') {
//       cols.push({
//         accessorFn: (row) => row.phone,
//         id: 'userPhone',
//         header: 'Mobile No',
//         filterVariant: 'text',
//       });

//     }

//     cols.push(
//       {
//         accessorKey: 'comment',
//         header: 'Feedback',
//         filterVariant: 'text',
//         Cell: ({ row }) => (
//           <Typography
//             sx={{ cursor: 'pointer', fontFamily: 'outfit', fontSize: '14px' }}
//             onClick={() => handleView(row.original)}
//           >
//             {truncateText(row.original.comment, 30)}
//           </Typography>
//         ),
//       },
//       {
//         accessorKey: 'rating',
//         header: 'Rating',
//         Cell: ({ cell }) => {
//           const rating = Number(cell.getValue() ?? 0);
//           return (
//             <Box display="flex" alignItems="center" gap={0.5}>
//               <Rating value={rating > 0 ? 1 : 0} max={1} readOnly size="small" />
//               <Typography className="font-outfit" variant="body2">
//                 {rating.toFixed(1)}
//               </Typography>
//             </Box>
//           );
//         },
//       },
//       {
//         accessorKey: 'submissionDate',
//         header: 'Submission Date',
//         Cell: ({ row }) => {
//           const date = row.original.submissionDate;
//           const istDate = date
//             ? new Date(date).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
//             : '';
//           return <span>{istDate}</span>;
//         },
//       },
//       {
//         header: 'Actions',
//         Cell: ({ row }) => (
//           <Box display="flex" gap={1}>
//             <Tooltip title="View">
//               <IconButton color="primary" onClick={() => handleView(row.original)}>
//                 <VisibilityIcon />
//               </IconButton>
//             </Tooltip>
//             <Tooltip title="Delete">
//               <IconButton
//                 color="error"
//                 onClick={() => {
//                   setDeleteId(row.original.id);
//                   setModal(true);
//                 }}
//               >
//                 <DeleteIcon />
//               </IconButton>
//             </Tooltip>
//           </Box>
//         ),
//       }
//     );

//     return cols;
//   }, [filtertype]);



//   return (
//     <>
//       {showAlert && (
//         <Alert
//           type={alertType}
//           title={
//             alertType === 'success'
//               ? 'Success!'
//               : alertType === 'error' && alertMessage.toLowerCase().includes('deleted')
//                 ? 'Deleted!'
//                 : alertType === 'error'
//                   ? 'Error!'
//                   : 'Warning!'
//           }
//           message={alertMessage}
//           variant="filled"
//           showLink={false}
//           linkHref=""
//           linkText=""
//           onClose={() => setShowAlert(false)}
//         />
//       )}

//       <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
//         <Box ml={2}>

//           <Typography className="font-outfit" variant="h5" fontWeight={500}>
//             Society Feedback Management  <Tooltip
//               title="View and manage feedback submitted by admin and webuser from their respective applications."
//               arrow
//               slotProps={{
//                 popper: {
//                   sx: {
//                     '& .MuiTooltip-tooltip': {
//                       fontSize: '0.9rem',
//                       backgroundColor: '#245492',
//                       color: '#fff',
//                       fontFamily: 'Outfit',
//                       padding: '8px 12px',
//                     },
//                     '& .MuiTooltip-arrow': {
//                       color: '#245492',
//                     },
//                   },
//                 },
//               }}
//             >
//               <InfoIcon
//                 fontSize="medium"
//                 sx={{ color: '#245492', cursor: 'pointer' }}
//                 onClick={(e) => e.stopPropagation()}
//               />
//             </Tooltip>
//           </Typography>
//         </Box>
//       </Box>



//       <DataTable
//         key={filtertype}
//         exportType={true}
//         clickHandler={clickHandler}
//         onSearchChange={(val) => setSearchTerm(val)}
//         enableColumnFilters={true}
//         columnFilters={columnFilters}
//         onColumnFiltersChange={handleColumnFilterChange}
//         data={feedbacks}
//         enablefeedbacktypeFilter={true}
//         productTypeValue={filtertype}
//         onFeedbacktypeChange={(type: string) => {
//           setFiltertype(type);
//           setPageIndex(0);

//           // Update URL query param to enable back/forward navigation
//           searchParams.set('type', type);
//           setSearchParams(searchParams); // This pushes to history

//           dispatch(fetchFeedbackList({
//             search: searchTerm,
//             type: filtertype,
//             page: 0,
//             limit: pageSize,
//           }));
//         }}


//         fromDate={fromDate}
//         toDate={toDate}
//         onFromDateChange={setFromDate}
//         onToDateChange={setToDate}
//         // onDateFilter={() => {
//         //   dispatch(fetchFeedbackList({
//         //     fromDate,
//         //     toDate,
//         //     search: searchTerm,
//         //     type: filtertype === 'dealer' ? '' : filtertype,
//         //     page: 0,
//         //     limit: pageSize,
//         //   }));
//         //   setPageIndex(0);
//         // }}
//         columns={columns}
//         rowCount={totalItems}
//         pageIndex={pageIndex}
//         pageSize={pageSize}
//         onPaginationChange={({ pageIndex, pageSize }) => {
//           setPageIndex(pageIndex);
//           setPageSize(pageSize);
//           const filterParams: Record<string, any> = {};
//           columnFilters.forEach(({ id, value }) => {
//             if (!value) return;
//             filterParams[id] = id === 'isActive' ? value === 'Active' : value;
//           });
//           dispatch(fetchFeedbackList({
//             filters: filterParams,
//             fromDate,
//             toDate,
//             page: pageIndex,
//             limit: pageSize,
//           }));
//         }}
//       />



//       <SweetAlert
//         show={modal}
//         type="error"
//         title="Delete Confirmation"
//         message="Are you sure you want to delete this feedback?"
//         onConfirm={confirmDelete}
//         onCancel={() => setModal(false)}
//         confirmText="Yes"
//         cancelText="No"
//       />

//   <Dialog open={!!selectedFeedback} onClose={() => setSelectedFeedback(null)} maxWidth="lg" fullWidth PaperProps={{ sx: { borderRadius: '25px' } }}
//     BackdropProps={{
//       sx: {
//         backdropFilter: 'blur(4px)',
//         backgroundColor: 'rgba(0, 0, 0, 0.2)'
//       }
//     }}>
//     <Box className="rounded-xl overflow-hidden">
//       {/* Gradient Header */}
//       <Box
//         sx={{
//           background: 'linear-gradient( #255593 103.05%)',
//           height: 60,
//           px: 4,
//           display: 'flex',
//           alignItems: 'center',
//           justifyContent: 'space-between',
//           color: 'white',
//         }}
//       >
//         <Typography className="font-outfit" variant="h6">
//           Feedback Details
//         </Typography>
//         <IconButton sx={{ color: 'white' }} onClick={handleCloseModal}>
//           <CloseIcon />
//         </IconButton>
//       </Box>
//       <DialogContent>
//         {selectedFeedback && (
//           <Box className="grid grid-cols-2 gap-4">
//             <Typography className="font-outfit"><strong>Submitted By:</strong> {selectedFeedback.userType}</Typography>
//             <Typography className="font-outfit"><strong>User Name:</strong> {selectedFeedback.userName}</Typography>
//             {filtertype !== 'webuser' && (
//               <Typography className="font-outfit">
//                 <strong>Email:</strong> {selectedFeedback.userEmail}
//               </Typography>
//             )}

//             {filtertype !== 'admin' && (
//               <Typography className="font-outfit">
//                 <strong>Mobile No:</strong> {selectedFeedback.phone}
//               </Typography>
//             )}
//             <Typography className="font-outfit flex items-center gap-1">
//               <strong>Rating:</strong>
//               <span className="flex items-center gap-1">
//                 <Rating
//                   value={selectedFeedback.rating > 0 ? 1 : 0}
//                   max={1}
//                   readOnly
//                   size="small"
//                 />
//                 {selectedFeedback.rating.toFixed(1)}
//               </span>
//             </Typography>

//             {/* <Typography className="font-outfit"><strong>Rating:</strong> {selectedFeedback.rating} <Rating /></Typography> */}
//             <Typography className="font-outfit"><strong>Date:</strong> {new Date(selectedFeedback.submissionDate).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
//             </Typography>
//             <Typography className="font-outfit"><strong>Message:</strong> {selectedFeedback.comment}</Typography>
//           </Box>
//         )}
//       </DialogContent>
//     </Box>
//   </Dialog>
//     </>
//   );
// };

// export default SocietyFeedbackManagement;



import {
    Box,
    Typography,
    IconButton,
    Dialog,
    DialogContent,
    Tooltip,
    Rating,
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';

import React, { useMemo, useRef, useState } from 'react';
import { MRT_ColumnDef } from 'material-react-table';
import { useSearchParams } from 'react-router-dom';

import DataTable from '../../tables/DataTable';
import Alert from '../../ui/alert/Alert';
import SweetAlert from '../../ui/alert/SweetAlert';

/* ===================== INTERFACE ===================== */

interface Feedback {
    id: string;
    userId: string;
    user_id: string;
    userName: string;
    userEmail: string;
    phone: string;
    comment: string;
    rating: number;
    userType: 'admin' | 'webuser';
    submissionDate: string;
    responseTimestamp: string;
}

/* ===================== DUMMY DATA ===================== */

const dummyFeedbacks: Feedback[] = [
    {
        id: '1',
        userId: 'U001',
        user_id: 'U001',
        userType: 'admin',
        userName: 'Rahul Sharma',
        userEmail: 'rahul@gmail.com',
        phone: '9876543210',
        comment: 'Very good society management and quick response.',
        rating: 4.5,
        submissionDate: '2025-01-05T10:30:00',
        responseTimestamp: '2025-01-05T12:00:00',
    },
    {
        id: '2',
        userId: 'U002',
        user_id: 'U002',
        userType: 'webuser',
        userName: 'Sneha Patil',
        userEmail: '',
        phone: '9123456789',
        comment: 'Maintenance service can be improved.',
        rating: 3.0,
        submissionDate: '2025-01-06T15:45:00',
        responseTimestamp: '2025-01-06T16:30:00',
    },
    {
        id: '3',
        userId: 'U003',
        user_id: 'U003',
        userType: 'admin',
        userName: 'Amit Kulkarni',
        userEmail: 'amit@gmail.com',
        phone: '9988776655',
        comment: 'Security staff is very helpful.',
        rating: 5.0,
        submissionDate: '2025-01-07T09:20:00',
        responseTimestamp: '2025-01-07T10:00:00',
    },
];

/* ===================== COMPONENT ===================== */

const SocietyFeedbackManagement = () => {
    const [feedbacks, setFeedbacks] = useState<Feedback[]>(dummyFeedbacks);
    const [filtertype, setFiltertype] = useState<'admin' | 'webuser'>('admin');
    const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [modal, setModal] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [pageIndex, setPageIndex] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [columnFilters, setColumnFilters] = useState<any[]>([]);
    const [searchParams, setSearchParams] = useSearchParams();
    const [fromDate, setFromDate] = useState<string>('');
    const [toDate, setToDate] = useState<string>('');


    /* ===================== FILTER DATA ===================== */

    const filteredFeedbacks = useMemo(() => {
        return feedbacks.filter((fb) => {
            // user type filter
            if (filtertype && fb.userType !== filtertype) return false;

            const itemDate = new Date(fb.submissionDate).getTime();

            // from date
            if (fromDate) {
                const from = new Date(fromDate).setHours(0, 0, 0, 0);
                if (itemDate < from) return false;
            }

            // to date
            if (toDate) {
                const to = new Date(toDate).setHours(23, 59, 59, 999);
                if (itemDate > to) return false;
            }

            return true;
        });
    }, [feedbacks, filtertype, fromDate, toDate]);



    /* ===================== DELETE ===================== */

    const confirmDelete = () => {
        if (!deleteId) return;
        setFeedbacks((prev) => prev.filter((f) => f.id !== deleteId));
        setAlertMessage('Feedback deleted successfully');
        setShowAlert(true);
        setModal(false);
        setDeleteId(null);
    };

    const handleCloseModal = () => {
        setSelectedFeedback(null);
    };

    /* ===================== COLUMNS ===================== */

    const columns = useMemo<MRT_ColumnDef<Feedback>[]>(() => {
        const cols: MRT_ColumnDef<Feedback>[] = [
            { accessorKey: 'userType', header: 'Submitted By' },
            { accessorKey: 'userName', header: 'User Name' },
        ];

        if (filtertype === 'admin') {
            cols.push({ accessorKey: 'userEmail', header: 'Email' });
        } else {
            cols.push({ accessorKey: 'phone', header: 'Mobile No' });
        }

        cols.push(
            {
                accessorKey: 'comment',
                header: 'Feedback',
                Cell: ({ row }) => (
                    <Typography
                        sx={{ cursor: 'pointer' }}
                        onClick={() => setSelectedFeedback(row.original)}
                    >
                        {row.original.comment.slice(0, 30)}...
                    </Typography>
                ),
            },
            {
                accessorKey: 'rating',
                header: 'Rating',
                Cell: ({ cell }) => (
                    <Box display="flex" gap={0.5}>
                        <Rating value={1} max={1} readOnly size="small" />
                        {Number(cell.getValue()).toFixed(1)}
                    </Box>
                ),
            },
            {
                accessorKey: 'submissionDate',
                header: 'Submission Date',
                Cell: ({ cell }) =>
                    new Date(cell.getValue<string>()).toLocaleString('en-IN'),
            },
            {
                header: 'Actions',
                Cell: ({ row }) => (
                    <Box display="flex" gap={1}>
                        <IconButton onClick={() => setSelectedFeedback(row.original)}>
                            <VisibilityIcon />
                        </IconButton>
                        <IconButton
                            color="error"
                            onClick={() => {
                                setDeleteId(row.original.id);
                                setModal(true);
                            }}
                        >
                            <DeleteIcon />
                        </IconButton>
                    </Box>
                ),
            }
        );

        return cols;
    }, [filtertype]);

    /* ===================== RENDER ===================== */

    return (
        <>
            {showAlert && (
                <Alert
                    type="success"
                    title="Deleted!"
                    message={alertMessage}
                    variant="filled"
                    showLink={false}
                    onClose={() => setShowAlert(false)}
                />
            )}

            <Box ml={2} mb={2}>
                <Typography variant="h5" fontWeight={500}>
                    Society Feedback Management{' '}
                    <Tooltip title="View and manage feedback">
                        <InfoIcon sx={{ color: '#245492' }} />
                    </Tooltip>
                </Typography>
            </Box>



            <DataTable
                data={filteredFeedbacks}
                columns={columns}
                fromDate={fromDate}
                toDate={toDate}
                onFromDateChange={setFromDate}
                onToDateChange={setToDate}

                enableColumnFilters
                columnFilters={columnFilters}
                onColumnFiltersChange={setColumnFilters}
                pageIndex={pageIndex}
                pageSize={pageSize}
                rowCount={filteredFeedbacks.length}
                exportType={false}
                enablefeedbacktypeFilter
                productTypeValue={filtertype}
                onFeedbacktypeChange={(type: string) => {
                    setFiltertype(type as 'admin' | 'webuser');
                    searchParams.set('type', type);
                    setSearchParams(searchParams);
                }}
                onPaginationChange={({ pageIndex, pageSize }) => {
                    setPageIndex(pageIndex);
                    setPageSize(pageSize);
                }}
            />


            <SweetAlert
                show={modal}
                type="error"
                title="Delete Confirmation"
                message="Are you sure you want to delete this feedback?"
                onConfirm={confirmDelete}
                onCancel={() => setModal(false)}
                confirmText="Yes"
                cancelText="No"
            />

            {/* <Dialog open={!!selectedFeedback} onClose={() => setSelectedFeedback(null)} maxWidth="lg" fullWidth>
        <Box>
          <Box sx={{ background: '#245492', color: 'white', p: 2 }}>
            <Typography>Feedback Details</Typography>
            <IconButton onClick={() => setSelectedFeedback(null)} sx={{ color: 'white' }}>
              <CloseIcon />
            </IconButton>
          </Box>
          <DialogContent>
            {selectedFeedback && (
              <Box className="grid grid-cols-2 gap-4">
                <Typography><b>User:</b> {selectedFeedback.userName}</Typography>
                <Typography><b>Type:</b> {selectedFeedback.userType}</Typography>
                <Typography><b>Rating:</b> {selectedFeedback.rating}</Typography>
                <Typography><b>Date:</b> {new Date(selectedFeedback.submissionDate).toLocaleString('en-IN')}</Typography>
                <Typography className="col-span-2"><b>Message:</b> {selectedFeedback.comment}</Typography>
              </Box>
            )}
          </DialogContent>
        </Box>
      </Dialog> */}

            <Dialog open={!!selectedFeedback} onClose={() => setSelectedFeedback(null)} maxWidth="lg" fullWidth PaperProps={{ sx: { borderRadius: '25px' } }}
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
                            Feedback Details
                        </Typography>
                        <IconButton sx={{ color: 'white' }} onClick={handleCloseModal}>
                            <CloseIcon />
                        </IconButton>
                    </Box>
                    <DialogContent>
                        {selectedFeedback && (
                            <Box className="grid grid-cols-2 gap-4">
                                <Typography className="font-outfit"><strong>Submitted By:</strong> {selectedFeedback.userType}</Typography>
                                <Typography className="font-outfit"><strong>User Name:</strong> {selectedFeedback.userName}</Typography>
                                {filtertype !== 'webuser' && (
                                    <Typography className="font-outfit">
                                        <strong>Email:</strong> {selectedFeedback.userEmail}
                                    </Typography>
                                )}

                                {filtertype !== 'admin' && (
                                    <Typography className="font-outfit">
                                        <strong>Mobile No:</strong> {selectedFeedback.phone}
                                    </Typography>
                                )}
                                <Typography className="font-outfit flex items-center gap-1">
                                    <strong>Rating:</strong>
                                    <span className="flex items-center gap-1">
                                        <Rating
                                            value={selectedFeedback.rating > 0 ? 1 : 0}
                                            max={1}
                                            readOnly
                                            size="small"
                                        />
                                        {selectedFeedback.rating.toFixed(1)}
                                    </span>
                                </Typography>

                                {/* <Typography className="font-outfit"><strong>Rating:</strong> {selectedFeedback.rating} <Rating /></Typography> */}
                                <Typography className="font-outfit"><strong>Date:</strong> {new Date(selectedFeedback.submissionDate).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
                                </Typography>
                                <Typography className="font-outfit"><strong>Message:</strong> {selectedFeedback.comment}</Typography>
                            </Box>
                        )}
                    </DialogContent>
                </Box>
            </Dialog>

        </>
    );
};

export default SocietyFeedbackManagement;
