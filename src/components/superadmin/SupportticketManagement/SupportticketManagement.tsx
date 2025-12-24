import {
  Box,
  Typography,
  IconButton,
  Switch,
  Dialog,
  DialogContent,
  DialogTitle,
  Chip,
  Tooltip,
  Rating
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CloseIcon from '@mui/icons-material/Close';
import { MRT_ColumnDef } from 'material-react-table';
import { useEffect, useMemo, useRef, useState } from 'react';
import TextField from '../../form/input/InputField';
import Button from '../../ui/button/Button';
import DataTable from '../../tables/DataTable';
import Alert from '../../ui/alert/Alert';
import SweetAlert from '../../ui/alert/SweetAlert';
import { useDispatch, useSelector } from 'react-redux';
import { fetchsupportticket, deleteItem, updateTicketStatus, addTicketNote } from '../../../store/SupportticketManagement/SupportticketManagementSlice';
import { RootState, AppDispatch } from '../../../store/store';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';

// Type definition
type SupportticketManagement = {
  _id?: string; // Optional for new tickets
  userId: string;
  userType: string;
  subject: string;
  description: string;
  attachments?: File[];
}



const SupportticketManagement = () => {
  const [newsupportticket, setnewsupportticket] = useState<SupportticketManagement>({

    userId: '',
    userType: '',
    subject: '',
    description: '',
    attachments: [],
  });
  const [selectedsupportticket, setselectedsupportticket] = useState<SupportticketManagement | null>(null);

  const [selectedStatus, setSelectedStatus] = useState('open');
  const [replyMessage, setReplyMessage] = useState('');
  const [replyFile, setReplyFile] = useState<File | null>(null);
  const [internalNote, setInternalNote] = useState('');
  const [filtertype, setFiltertype] = useState<string>('dealer');

  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [alertType, setAlertType] = useState<'success' | 'error' | 'warning' | 'info' | null>(null);
  const [alertMessage, setAlertMessage] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10)
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [columnFilters, setColumnFilters] = useState<{ id: string; value: any }[]>([]);
  const [prevSearchField, setPrevSearchField] = useState('');
  const [isInitialised, setIsInitialised] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { supportticket, totalItems, totalPages } = useSelector((state: RootState) => state.supportticket);


  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      const filterParams: Record<string, any> = {};

      columnFilters.forEach(({ id, value }) => {
        if (!value) return;

        if (id === 'isActive') {
          filterParams[id] = value === 'Active' ? true : false;
        } else if (typeof value === 'string' && value.trim()) {
          filterParams[id] = value.trim();
        } else {
          filterParams[id] = value;
        }
      });

      dispatch(fetchsupportticket({
        filters: filterParams,
        search: searchTerm,
        page: pageIndex,
        limit: pageSize,
        type: filtertype,
      }));
    }, 500); // 500ms delay

    return () => clearTimeout(delayDebounce);

  }, [searchTerm, pageIndex, pageSize, filtertype, columnFilters, fromDate, toDate]); //  added columnFilters, fromDate, toDate




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

  //     dispatch(fetchsupportticket({
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
      dispatch(fetchsupportticket(payload));
    }, 500);
  };











  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    setnewsupportticket((prev) => ({
      ...prev,
      [name]: name.includes('percentage') ? value.replace(/[^0-9.]/g, '') : value, // clean number input
    }));
  };



  const requestDelete = (id: string) => {
    setDeleteId(id);
    setShowModal(true);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;

    try {
      await dispatch(deleteItem(deleteId)).unwrap();
      setAlertType('error');
      setAlertMessage('Ticket deleted successfully.');
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);

      dispatch(fetchsupportticket({
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


// Handle staff and admin  viewing ticket details
  const handleView = (ticket: SupportticketManagement) => {
    const activeRole = sessionStorage.getItem("activeRole");
    const basePath = activeRole === "staff" ? "staff" : "superadmin";
    navigate(`/${basePath}/supportticketmanagement/${ticket._id}?userType=${ticket.userType}`);
  };

  const handleCloseModal = () => {
    setselectedsupportticket(null);
    setShowForm(false);
  };




  const clickHandler = async (searchText: string, exportType: string) => {
    setSearchTerm(searchText);
    setPageIndex(0);

    if (exportType) {
      // 1. Trigger export
      await dispatch(fetchsupportticket({
        fromDate,
        toDate,
        search: searchText,
        type: filtertype,
        exportType: exportType as 'csv' | 'pdf',
      }));

      // 2. Refetch actual data (without exportType)
      await dispatch(fetchsupportticket({
        fromDate,
        toDate,
        search: searchText,
        page: 0,
        limit: pageSize,
        type: filtertype,
      }));
    } else {
      await dispatch(fetchsupportticket({
        search: searchText,
        page: 0,
        limit: pageSize,
        type: filtertype,
      }));
    }
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

    dispatch(fetchsupportticket(payload));
  }, [fromDate, toDate]);


  const truncateText = (text?: string, maxLength = 50): string => {
    if (!text) return '';
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  };


  const columns = useMemo<MRT_ColumnDef<any>[]>(() => {
    const cols: MRT_ColumnDef<any>[] = [
      { accessorKey: 'userType', header: 'Submitted by', filterVariant: 'text' },
      {
        accessorFn: (row) => row.userId?.name || 'N/A',
        id: 'userName',
        header: 'User Name',
        filterVariant: 'text',
      },
    ];

    // Dynamic column based on filtertype
    if (filtertype === 'dealer') {
      cols.push({
        accessorFn: (row) => row.userId?.email || 'N/A',
        id: 'userEmail',
        header: 'Email',
        filterVariant: 'text',
      });
    } else if (filtertype === 'buyer') {
      cols.push({
        accessorFn: (row) => row.userId?.phone || 'N/A',
        id: 'userPhone',
        header: 'Mobile No',
        filterVariant: 'text',
      });
    }

    cols.push(

      {
        accessorKey: 'subject',
        header: 'Subject',
        filterVariant: 'text',
        Cell: ({ row }) => truncateText(row.original.subject, 30),
        muiTableHeadCellProps: { align: 'center' },
        muiTableBodyCellProps: { align: 'center' },
      },
      {
        accessorKey: 'description',
        header: 'Description',
        filterVariant: 'text',
        Cell: ({ row }) => truncateText(row.original.description, 30),
      },
      {
        accessorKey: 'createdAt',
        header: 'Ticket Date',
        Cell: ({ cell }) => {
          const date = cell.getValue() as string;
          return date
            ? new Date(date).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
            : '';
        },
      },
      {
        accessorKey: 'updatedAt',
        header: 'Last Updated',
        Cell: ({ cell }) => {
          const date = cell.getValue() as string;
          return date
            ? new Date(date).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
            : '';
        },
      },
      {
        accessorKey: 'status',
        header: 'Status',
        muiTableHeadCellProps: { align: 'center' },
        muiTableBodyCellProps: { align: 'center' },
        Cell: ({ row }) => {
          const status = String(row.original.status || '').toLowerCase();
          let color: 'success' | 'warning' | 'error' = 'error';
          if (status === 'resolved') color = 'success';
          else if (status === 'in progress') color = 'warning';
          else if (status === 'open') color = 'error';
          return (
            <Box display="flex" justifyContent="center">
              <Chip
                className="font-outfit"
                label={row.original.status || ''}
                color={color}
                size="small"
                variant="outlined"
              />
            </Box>
          );
        },
        filterVariant: 'select',
        filterSelectOptions: ['Resolved', 'In Progress', 'Open'],
        filterFn: (row, id, filterValue) => {
          const value = String(row.getValue(id) ?? '').toLowerCase();
          return value === filterValue?.toLowerCase();
        },
      },
      {
        header: 'Actions',
        Cell: ({ row }) => (
          <Box display="flex">
            <Tooltip title="View Details" arrow>
              <IconButton color="primary" onClick={() => handleView(row.original)}>
                <VisibilityIcon />
              </IconButton>
            </Tooltip>
            {/* Uncomment if needed */}
            {/* <IconButton color="secondary" onClick={() => handleEdit(row.original, row.index)}>
            <EditIcon />
          </IconButton> */}
            {/* <IconButton color="error" onClick={() => requestDelete(row.original._id)}>
            <DeleteIcon />
          </IconButton> */}
          </Box>
        ),
      }
    );

    return cols;
  }, [filtertype]);




  return (
    <>

      <SweetAlert
        show={showModal}
        type="error"
        title="Confirm Deletion"
        message="Are you sure you want to delete this coupon?"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        confirmText="Yes"
        cancelText="No"
      />
      {/* Always visible alert */}
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
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Box ml={2}>

              <Typography
                variant="h5"
                fontWeight={500}
                className='font-outfit'
              >
                Support Ticket Management  <Tooltip
                  title="Manage support tickets raised by dealers and buyers, address their queries, and resolve reported issues."
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
            columns={columns}
            key={filtertype}
            exportType={true}
            clickHandler={clickHandler}
            data={supportticket}
            // columns={supportticketcolumns}
            enableColumnFilters={true}
            columnFilters={columnFilters}
            onColumnFiltersChange={handleColumnFilterChange}
            rowCount={totalItems}
            enableUserTypeFilter={true}
            productTypeValue={filtertype}
            onUserTypeChange={(type: string) => {
              setFiltertype(type);
              setPageIndex(0);

              // Update URL query param to enable back/forward navigation
              const newSearchParams = new URLSearchParams(searchParams);
              newSearchParams.set('type', type.toLowerCase());
              setSearchParams(newSearchParams);

              dispatch(fetchsupportticket({
                search: searchTerm,
                type,
                page: 0,
                limit: pageSize,
              }));
            }}

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
              dispatch(fetchsupportticket({
                filters: filterParams,
                fromDate,
                toDate,
                page: pageIndex,
                limit: pageSize,
              }));
            }}
            fromDate={fromDate}
            toDate={toDate}
            onFromDateChange={setFromDate}
            onToDateChange={setToDate}
          // onDateFilter={() => {
          //   dispatch(fetchsupportticket({
          //     fromDate,
          //     toDate,
          //     search: searchTerm,
          //     page: 0,
          //     type: filtertype,
          //     limit: pageSize,
          //   }));
          //   setPageIndex(0);
          // }}

          />



        </>


      ) : (
        <Dialog open={showForm} onClose={() => setShowForm(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: '25px' } }}
          BackdropProps={{
            sx: {
              backdropFilter: 'blur(4px)',
              backgroundColor: 'rgba(0, 0, 0, 0.2)'
            }
          }}>
          <Box sx={{ background: 'linear-gradient( #255593 103.05%)', height: 25, p: 4, position: 'relative' }}>
            <DialogTitle className='font-outfit' sx={{ color: 'white', position: 'absolute', top: 5 }}>
              {editIndex !== null ? 'Edit Coupon' : 'Add Coupon'}
            </DialogTitle>
            <IconButton sx={{ position: 'absolute', top: 12, right: 12 }} onClick={() => setShowForm(false)}><CloseIcon /></IconButton>
          </Box>
          <DialogContent>
            {/* Alert inside dialog */}
            {showAlert && alertType && (
              <div className="mb-4">
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

            {/* Form fields */}
            <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextField label="User type" name="userType" value={newsupportticket.userType} onChange={handleChange} />
              <TextField label="Subject" name="subject" value={newsupportticket.subject} onChange={handleChange} />
              <TextField label="Description" name="description" value={newsupportticket.description} onChange={handleChange} />
            </div>


          </DialogContent>

        </Dialog>
      )}


    </>
  );
};

export default SupportticketManagement;
