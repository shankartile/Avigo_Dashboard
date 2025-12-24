import {
  Box, Typography, IconButton, Dialog, DialogContent, DialogTitle,
  Chip, Rating, Tooltip
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DoneIcon from '@mui/icons-material/Done';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { MRT_ColumnDef } from 'material-react-table';
import { useDispatch, useSelector } from 'react-redux';
import DataTable from '../../tables/DataTable';
import Alert from '../../ui/alert/Alert';
import SweetAlert from '../../ui/alert/SweetAlert';
import Button from '../../ui/button/Button';
import DateTimeField from '../../form/input/DateTimeField';
import { AppDispatch, RootState } from '../../../store/store';
import { fetchFeedbackList, exportFeedbackList, deleteFeedback, } from '../../../store/FeedbackManagement/FeedbackManagementSlice';

interface Feedback {
  userId: any;
  id: string;
  user_id: string;
  userName: string;
  userEmail: string;
  phone: string;
  comment: string;
  rating: number;
  userType: string;
  submissionDate: string;
  responseTimestamp: string;
}



const FeedbackManagement = () => {
  const dispatch = useDispatch<AppDispatch>();
  const feedbacks = useSelector((state: RootState) => state.feedback.feedbacks);
  const totalItems = useSelector((state: RootState) => state.feedback.totalItems);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const [filtertype, setFiltertype] = useState<string>('dealer');

  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);
  const [alertType, setAlertType] = useState<'success' | 'error' | 'warning' | 'info'>('info');
  const [alertMessage, setAlertMessage] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [columnFilters, setColumnFilters] = useState<{ id: string; value: any }[]>([]);
  const [prevSearchField, setPrevSearchField] = useState('');
  const [isInitialised, setIsInitialised] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  const [modal, setModal] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {

      dispatch(fetchFeedbackList({
        fromDate,
        toDate,
        search: searchTerm,
        searchField: prevSearchField,
        type: filtertype === 'dealer' ? '' : 'buyer',
        page: pageIndex,
        limit: pageSize,
      }));
    }, 500); // 500ms delay

    return () => clearTimeout(delayDebounce);
  }, [searchTerm, pageIndex, pageSize, filtertype, prevSearchField]);




  useEffect(() => {
    const typeFromURL = searchParams.get('type');
    if (
      (typeFromURL === 'dealer' || typeFromURL === 'buyer') &&
      typeFromURL !== filtertype
    ) {
      setFiltertype(typeFromURL);
    }
    setIsInitialised(true); //  Allow main fetch after URL param is applied
  }, []);




  // const handleColumnFilterChange = (filters: { id: string; value: any }[]) => {
  //   // Extract the first non-empty filter
  //   const activeFilter = filters.find(f => f.value?.trim?.() !== '');

  //   // Extract values safely
  //   const search = activeFilter?.value?.trim() || '';
  //   const searchField = activeFilter?.id || '';

  //   // If filter is same as previous, skip API call
  //   if (search === searchTerm && searchField === prevSearchField) return;

  //   // Update states
  //   setColumnFilters(filters);
  //   setSearchTerm(search);
  //   setPrevSearchField(searchField);
  //   setPageIndex(0);

  //   // Dispatch API with updated filters
  //   const delayDebounce = setTimeout(() => {

  //     dispatch(fetchFeedbackList({
  //       fromDate,
  //       toDate,
  //       search,
  //       searchField,
  //       page: 0,
  //       type: filtertype,
  //       limit: pageSize,
  //     }));
  //   }, 500); // 500ms delay

  //   return () => clearTimeout(delayDebounce);
  // };





  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  const handleColumnFilterChange = (filters: { id: string; value: any }[]) => {
    setColumnFilters(filters);
    setPageIndex(0);

    const filterParams: Record<string, any> = {};

    filters.forEach(({ id, value }) => {
      if (!value) return;

      if (id === 'isActive') {
        filterParams[id] = value === 'Active' ? true : false;
      } else if (typeof value === 'string' && value.trim()) {
        filterParams[id] = value.trim();
      } else {
        filterParams[id] = value;
      }
    });

    const payload = {
      type: filtertype,
      filters: filterParams,
      fromDate,
      toDate,
      page: 0,
      limit: pageSize,
    };

    //  Debounce logic
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      dispatch(fetchFeedbackList(payload));
    }, 500);
  };









  // Confirm Delete
  const confirmDelete = async () => {
    if (!deleteId) return;

    try {
      await dispatch(deleteFeedback({ id: deleteId, type: filtertype })).unwrap();
      setAlertType('error');
      setAlertMessage('Feedback deleted successfully');
      setTimeout(() => {
        setShowAlert(false);
      }, 1000);
    } catch {
      setAlertType('error');
      setAlertMessage('Failed to delete feedback');
    } finally {
      setShowAlert(true);
      setModal(false);
      setDeleteId(null);
    }
  };

  const clickHandler = async (searchText: string, exportType?: string) => {
    setSearchTerm(searchText);
    setPageIndex(0);

    if (exportType) {
      await dispatch(exportFeedbackList({
        fromDate,
        toDate,
        type: filtertype,
        search: searchText,
        exportType: exportType as 'csv' | 'pdf',
      }));
      // } else {
      //   await dispatch(fetchFeedbackList({
      //     fromDate,
      //     toDate,
      //     search: searchText,
      //     type: filtertype,
      //     page: 0,
      //     limit: pageSize,
      //   }));
    }
  };

  const handleCloseModal = () => {
    setSelectedFeedback(null);
  };

  const handleView = (fb: Feedback) => setSelectedFeedback(fb);


  const feedbackTypeMap: Record<string, string> = {
    type: filtertype === 'dealer' ? '' : filtertype

  };
  const filteredFeedbacks = feedbacks.filter((fb) =>
    filtertype === 'dealer' ? true : fb.type === filtertype
  );


  const truncateText = (text?: string, maxLength = 50): string => {
    if (!text) return '';
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  };


  useEffect(() => {
    // Skip if one date is filled and the other is not
    if ((fromDate && !toDate) || (!fromDate && toDate)) return;

    const payload = {
      fromDate: fromDate || undefined,
      toDate: toDate || undefined,
      type: filtertype

      // ...other filters like pagination or search
    };

    dispatch(fetchFeedbackList(payload));
  }, [fromDate, toDate]);



  const columns = useMemo<MRT_ColumnDef<Feedback>[]>(() => {
    const cols: MRT_ColumnDef<Feedback>[] = [
      { accessorKey: 'userType', header: 'Submitted by', filterVariant: 'text' },

      {
        accessorFn: (row) => row.userName || 'N/A',
        id: 'userName',
        header: 'User Name',
        filterVariant: 'text',
      },
    ];

    // 👇 Add exactly one of these based on filtertype
    if (filtertype === 'dealer') {
      cols.push({
        accessorFn: (row) => row.userEmail,
        id: 'userEmail',
        header: 'Email',
        filterVariant: 'text',
      });

    } else if (filtertype === 'buyer') {
      cols.push({
        accessorFn: (row) => row.phone,
        id: 'userPhone',
        header: 'Mobile No',
        filterVariant: 'text',
      });

    }

    cols.push(
      {
        accessorKey: 'comment',
        header: 'Feedback',
        filterVariant: 'text',
        Cell: ({ row }) => (
          <Typography
            sx={{ cursor: 'pointer', fontFamily: 'outfit', fontSize: '14px' }}
            onClick={() => handleView(row.original)}
          >
            {truncateText(row.original.comment, 30)}
          </Typography>
        ),
      },
      {
        accessorKey: 'rating',
        header: 'Rating',
        Cell: ({ cell }) => {
          const rating = Number(cell.getValue() ?? 0);
          return (
            <Box display="flex" alignItems="center" gap={0.5}>
              <Rating value={rating > 0 ? 1 : 0} max={1} readOnly size="small" />
              <Typography className="font-outfit" variant="body2">
                {rating.toFixed(1)}
              </Typography>
            </Box>
          );
        },
      },
      {
        accessorKey: 'submissionDate',
        header: 'Submission Date',
        Cell: ({ row }) => {
          const date = row.original.submissionDate;
          const istDate = date
            ? new Date(date).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
            : '';
          return <span>{istDate}</span>;
        },
      },
      {
        header: 'Actions',
        Cell: ({ row }) => (
          <Box display="flex" gap={1}>
            <Tooltip title="View">
              <IconButton color="primary" onClick={() => handleView(row.original)}>
                <VisibilityIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete">
              <IconButton
                color="error"
                onClick={() => {
                  setDeleteId(row.original.id);
                  setModal(true);
                }}
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </Box>
        ),
      }
    );

    return cols;
  }, [filtertype]);



  return (
    <>
      {showAlert && (
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
      )}

      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Box ml={2}>

          <Typography className="font-outfit" variant="h5" fontWeight={500}>
            Feedback Management  <Tooltip
              title="View and manage feedback submitted by dealers and buyers from their respective applications."
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
      </Box>



      <DataTable
        key={filtertype}
        exportType={true}
        clickHandler={clickHandler}
        onSearchChange={(val) => setSearchTerm(val)}
        enableColumnFilters={true}
        columnFilters={columnFilters}
        onColumnFiltersChange={handleColumnFilterChange}
        data={feedbacks}
        enablefeedbacktypeFilter={true}
        productTypeValue={filtertype}
        onFeedbacktypeChange={(type: string) => {
          setFiltertype(type);
          setPageIndex(0);

          // Update URL query param to enable back/forward navigation
          searchParams.set('type', type);
          setSearchParams(searchParams); // This pushes to history

          dispatch(fetchFeedbackList({
            search: searchTerm,
            type: filtertype,
            page: 0,
            limit: pageSize,
          }));
        }}


        fromDate={fromDate}
        toDate={toDate}
        onFromDateChange={setFromDate}
        onToDateChange={setToDate}
        // onDateFilter={() => {
        //   dispatch(fetchFeedbackList({
        //     fromDate,
        //     toDate,
        //     search: searchTerm,
        //     type: filtertype === 'dealer' ? '' : filtertype,
        //     page: 0,
        //     limit: pageSize,
        //   }));
        //   setPageIndex(0);
        // }}
        columns={columns}
        rowCount={totalItems}
        pageIndex={pageIndex}
        pageSize={pageSize}
        onPaginationChange={({ pageIndex, pageSize }) => {
          setPageIndex(pageIndex);
          setPageSize(pageSize);
          const filterParams: Record<string, any> = {};
          columnFilters.forEach(({ id, value }) => {
            if (!value) return;
            filterParams[id] = id === 'isActive' ? value === 'Active' : value;
          });
          dispatch(fetchFeedbackList({
            filters: filterParams,
            fromDate,
            toDate,
            page: pageIndex,
            limit: pageSize,
          }));
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
                {filtertype !== 'buyer' && (
                  <Typography className="font-outfit">
                    <strong>Email:</strong> {selectedFeedback.userEmail}
                  </Typography>
                )}

                {filtertype !== 'dealer' && (
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

export default FeedbackManagement;
