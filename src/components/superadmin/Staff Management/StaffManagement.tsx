import {
  Box,
  Typography,
  IconButton,
  Dialog,
  DialogContent,
  DialogTitle,
  Tooltip,
  Chip,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';

import { useEffect, useRef, useState } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CloseIcon from '@mui/icons-material/Close';
import { MRT_ColumnDef } from 'material-react-table';
import DataTable from '../../tables/DataTable';
import SweetAlert from '../../ui/alert/SweetAlert';
import Alert from '../../ui/alert/Alert';
import Button from '../../ui/button/Button';
import AddIcon from '@mui/icons-material/Add';
import InfoIcon from '@mui/icons-material/Info';

import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../../store/store';
import {
  fetchStaff,
  deleteStaff,
  togglestaffStatus,
  fetchPermissions
} from '../../../store/StaffManagement/StaffManagementSlice';
import ToggleSwitch from '../../ui/toggleswitch/ToggleSwitch';
import StaffForm from './StaffForm';

type StaffManagementType = {
  id: string;
  name: string;
  phone: string;
  email: string;
  role?: string;
  createdAt: string;
  updatedAt: string;
  permissions?: PermissionType[];
};

type PermissionType = {
  permissionId: string;
  allowed: boolean;
};

const StaffManagement = () => {
  const [newStaff, setNewStaff] = useState<StaffManagementType>({
    id: '',
    name: '',
    phone: '',
    email: '',
    role: '',
    createdAt: '',
    updatedAt: '',
    permissions: [],
  });
  const [SelectedStaff, setSelectedStaff] = useState<StaffManagementType | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [alertType, setAlertType] = useState<'success' | 'error' | 'warning' | 'info' | null>(null);
  const [alertMessage, setAlertMessage] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [toggleUser, setToggleUser] = useState<{ _id: string; isActive: boolean } | null>(null);
  const [showToggleModal, setShowToggleModal] = useState(false);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [columnFilters, setColumnFilters] = useState<{ id: string; value: any }[]>([]);
  const [prevSearchField, setPrevSearchField] = useState('');
  


  // const dispatch = useDispatch<AppDispatch>();
  // const { staff, permissions, totalItems } = useSelector((state: RootState) => state.staff);

  // useEffect(() => {

  //   dispatch(
  //     fetchStaff({
  //       search: searchTerm,
  //       page: pageIndex,
  //       limit: pageSize,
  //     })
  //   );
  // }, [searchTerm, pageIndex, pageSize]);

  const dispatch = useDispatch<AppDispatch>();
  const { staff, permissions, totalItems } = useSelector((state: RootState) => state.staff);

  // Filter out staff where role is 'admin'
  const filteredStaffList = staff.filter((item) => item.role?.toLowerCase() !== 'admin');

  // Adjust totalItems count
  const filteredTotalItems = filteredStaffList.length;

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

      dispatch(
        fetchStaff({
          filters: filterParams,
          search: searchTerm,
          page: pageIndex,
          limit: pageSize,
        }));
    }, 500); // 500ms delay

    return () => clearTimeout(delayDebounce);
  }, [searchTerm, pageIndex, pageSize, columnFilters, fromDate, toDate, dispatch]);



  useEffect(() => {
    const delayDebounce = setTimeout(() => {

      dispatch(
        fetchPermissions(
        ));
    }, 500); // 500ms delay

    return () => clearTimeout(delayDebounce);
  }, [dispatch]);


  const getPermissionLabel = (id: string) => {
    const found = permissions.find((perm: any) => perm._id === id);
    return found ? found.label : 'Unknown Permission';
  };


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

  //     dispatch(fetchStaff({
  //       fromDate,
  //       toDate,
  //       search,
  //       searchField,
  //       page: 0,
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
      filters: filterParams,
      fromDate,
      toDate,
      page: 0,
      limit: pageSize,
    };

    //  Debounce logic
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      dispatch(fetchStaff(payload));
    }, 500);
  };





  const clickHandler = async (searchText: string, exportType?: string) => {
    setSearchTerm(searchText);
    setPageIndex(0);

    if (exportType) {
      await dispatch(fetchStaff({
        fromDate, toDate,
        search: searchText,
        exportType: exportType as 'csv' | 'pdf',
      }))
      // } else {
      //   await dispatch(fetchStaff({
      //     fromDate, toDate,
      //     search: searchText,
      //     page: 0,
      //     limit: pageSize,
      //   }));
    }
  };





  const handleEdit = (staff: StaffManagementType, index: number) => {
    setNewStaff(staff);
    setEditIndex(index);
    setShowForm(true);
  };

  const handleView = (user: StaffManagementType) => {
    setSelectedStaff(user);
  };

  const handleCloseModal = () => {
    setSelectedStaff(null);
  };

  const requestDelete = (id: string) => {
    setDeleteId(id);
    setShowModal(true);
  };

  const confirmDelete = async () => {

    if (!deleteId) return;
    try {
      await dispatch(deleteStaff(deleteId)).unwrap();
      setAlertType('error');
      setAlertMessage('Staff User deleted successfully.');
      setShowAlert(true);
      dispatch(fetchStaff({ search: searchTerm, page: pageIndex, limit: pageSize }));
    } catch (err) {
      setAlertType('error');
      setAlertMessage('Delete failed: ' + err);
      setShowAlert(true);
    }
    setTimeout(() => setShowAlert(false), 3000);
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
      await dispatch(togglestaffStatus({
        _id: toggleUser._id,
        isActive: !toggleUser.isActive
      })).unwrap();

      setAlertType('success');
      setAlertMessage(`Staff ${toggleUser.isActive ? 'deactivated' : 'activated'} successfully.`);
      setShowAlert(true);

      dispatch(fetchStaff({ search: searchTerm, page: pageIndex, limit: pageSize }));
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


  useEffect(() => {
    // Skip if one date is filled and the other is not
    if ((fromDate && !toDate) || (!fromDate && toDate)) return;

    const payload = {
      fromDate: fromDate || undefined,
      toDate: toDate || undefined,
      // ...other filters like pagination or search
    };

    dispatch(fetchStaff(payload));
  }, [fromDate, toDate]);



  const userColumns: MRT_ColumnDef<any>[] = [
    { accessorKey: 'name', header: 'Staff Name', id: 'name', filterVariant: 'text' },
    { accessorKey: 'phone', header: 'Mobile No', id: 'phone', filterVariant: 'text' },
    { accessorKey: 'email', header: 'Email ID', id: 'email', filterVariant: 'text' },
    {
      accessorKey: 'isActive',
      header: 'Account Status',
      muiTableHeadCellProps: { align: 'center' },
      muiTableBodyCellProps: { align: 'center' },
      Cell: ({ cell }) => (cell.getValue() ? 'Active' : 'Inactive'),
      filterVariant: 'select',
      filterSelectOptions: ['Active', 'Inactive'],
    },

    {
      accessorKey: 'createdAt',
      header: 'Registration Date',
      muiTableHeadCellProps: { align: 'center' },
      muiTableBodyCellProps: { align: 'center' },
      Cell: ({ cell }) => {
        const date = cell.getValue() as string;
        return new Date(date).toLocaleDateString('en-IN', {
          year: 'numeric',
          month: 'numeric',
          day: 'numeric',
        });
      },
    },



    // {
    //   header: 'Last Updated',
    //   Cell: ({ row }) => {
    //     const updatedAt = new Date(row.original.updatedAt);

    //     // Format date
    //     const formattedDate = updatedAt.toLocaleDateString('en-IN', {
    //       year: 'numeric',
    //       month: 'numeric',
    //       day: 'numeric',
    //     });

    //     // Format time
    //     let hours = updatedAt.getHours();
    //     const minutes = updatedAt.getMinutes();
    //     const ampm = hours >= 12 ? 'PM' : 'AM';
    //     hours = hours % 12 || 12;
    //     const formattedTime = `${hours}:${minutes.toString().padStart(2, '0')} ${ampm}`;

    //     return `${formattedDate} ${formattedTime}`;
    //   },
    // },


    {
      accessorKey: 'updatedAt',
      header: 'Last Login Time',
      Cell: ({ row }) => {
        const updatedAt = new Date(row.original.updatedAt);

        // Format date
        const formattedDate = updatedAt.toLocaleDateString('en-IN', {
          year: 'numeric',
          month: 'numeric',
          day: 'numeric',
        });

        // Format time
        let hours = updatedAt.getHours();
        const minutes = updatedAt.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12;
        const formattedTime = `${hours}:${minutes.toString().padStart(2, '0')} ${ampm}`;

        return `${formattedDate} ${formattedTime}`;
      },
    },


    {
      header: 'Actions',
      Cell: ({ row }) => {
        const dispatch = useDispatch<AppDispatch>();



        return (
          <Box display="flex" gap={1}>
            <Tooltip title="View Staff Details" arrow>
              <IconButton color="primary" onClick={() => handleView(row.original)}>
                <VisibilityIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Edit Staff" arrow>
              <IconButton color="secondary" onClick={() => handleEdit(row.original, row.index)}>
                <EditIcon />
              </IconButton>
            </Tooltip>
            <IconButton color="error" onClick={() => requestDelete(row.original._id)}>
              <DeleteIcon />
            </IconButton>

            <ToggleSwitch
              checked={row.original.isActive}
              onChange={() => handleToggleClick(row.original)}
              tooltipTitle={row.original.isActive ? 'Deactivate' : 'Activate'}
            />
          </Box>
        );
      },
    },
  ];

  return (
    <>
      <SweetAlert
        show={showToggleModal}
        type="warning"
        title="Confirm Status Change"
        message={`Are you sure you want to ${toggleUser?.isActive ? 'deactivate' : 'activate'} this staff?`}
        onConfirm={confirmToggle}
        onCancel={cancelToggle}
        confirmText="Yes"
        cancelText="No"
      />

      <SweetAlert
        show={showModal}
        type="error"
        title="Confirm Deletion"
        message="Are you sure you want to delete this staff?"
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

      {showForm ? (
        <StaffForm
          onCancel={() => {
            setShowForm(false);
            setEditIndex(null);
          }}
          editData={editIndex !== null ? newStaff : undefined}
          isEditMode={editIndex !== null}
        />
      ) : (

        <>
          <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Box ml={2}>
                <Typography variant="h5" fontWeight={500} className="font-outfit">
                  Staff Management <Tooltip
                    title="Create staff accounts, assign and update module permissions, and manage staff login credentials."
                    arrow
                    slotProps={{
                      popper: {
                        sx: {
                          '& .MuiTooltip-tooltip': {
                            fontSize: '0.8rem',
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
              <Button
                onClick={() => {
                  setNewStaff({
                    id: '',
                    name: '',
                    phone: '',
                    email: '',
                    role: '',
                    createdAt: '',
                    updatedAt: '',
                    permissions: [],
                  });
                  setEditIndex(null);
                  setShowForm(true);
                }}
              >
                <AddIcon /> Add Staff
              </Button>
            </Box>



            <DataTable
              exportType={true}
              clickHandler={clickHandler}
              data={filteredStaffList}
              columns={userColumns}
              enableColumnFilters={true}
              columnFilters={columnFilters}
              onColumnFiltersChange={handleColumnFilterChange}
              rowCount={filteredTotalItems}
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
                dispatch(fetchStaff({
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
            //   dispatch(fetchStaff({
            //     fromDate,
            //     toDate,
            //     search: searchTerm,
            //     page: 0,
            //     limit: pageSize,
            //   }));
            //   setPageIndex(0);
            // }}
            />


            <Dialog
              open={!!SelectedStaff}
              onClose={handleCloseModal}
              maxWidth="md"
              fullWidth
              PaperProps={{ sx: { borderRadius: '20px' } }}
              BackdropProps={{
                sx: {
                  backdropFilter: 'blur(4px)',
                  backgroundColor: 'rgba(0, 0, 0, 0.2)',
                },
              }}
            >
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
                    Staff Details
                  </Typography>
                  <IconButton sx={{ color: 'white' }} onClick={handleCloseModal}>
                    <CloseIcon />
                  </IconButton>
                </Box>

                {/* Content */}
                <DialogContent sx={{ p: 4 }}>
                  {SelectedStaff && (
                    <Box className="grid grid-cols-2 gap-4">
                      <Typography className="font-outfit text-sm">
                        <strong>Name:</strong> {SelectedStaff.name}
                      </Typography>
                      <Typography className="font-outfit text-sm">
                        <strong>Mobile No:</strong> {SelectedStaff.phone}
                      </Typography>
                      <Typography className="font-outfit text-sm">
                        <strong>Email:</strong> {SelectedStaff.email}
                      </Typography>
                      <Typography className="font-outfit text-sm">
                        <strong>Registration Date:</strong>{' '}
                        {new Date(SelectedStaff.createdAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
                      </Typography>
                      <Typography className="font-outfit text-sm">
                        <strong>Last Login Time:</strong>{' '}
                        {new Date(SelectedStaff.updatedAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
                      </Typography>
                      <Typography className="font-outfit text-sm">
                        <strong>Module Permissions:</strong>

                        <Box
                          display="grid"
                          gridTemplateColumns="repeat(2, 1fr)"
                          gap={1}
                          mt={1}
                        >
                          {SelectedStaff?.permissions
                            ?.filter((perm: any) => perm.allowed)
                            .map((perm: any, index: number) => (
                              <Chip
                                className='font-outfit'
                                key={index}
                                label={getPermissionLabel(perm.permissionId)}
                                color="primary"
                                size="small"
                              />
                            ))}
                        </Box>
                      </Typography>
                    </Box>
                  )}
                </DialogContent>
              </Box>
            </Dialog>
          </Box>
        </>
      )}
    </>
  );
}
export default StaffManagement;
