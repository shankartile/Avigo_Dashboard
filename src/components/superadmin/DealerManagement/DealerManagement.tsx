import {
    Box,
    Typography,
    IconButton,
    Dialog,
    DialogContent,
    DialogTitle,
    Tooltip,
} from '@mui/material';
import { Tabs, Tab } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { useEffect, useRef, useState } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CloseIcon from '@mui/icons-material/Close';
import { MRT_ColumnDef } from 'material-react-table';
import DataTable from '../../tables/DataTable';
import SweetAlert from '../../ui/alert/SweetAlert';
import Alert from '../../ui/alert/Alert';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../../store/store';
import {
    fetchDealer,
    deleteDealer,
    toggleDealerStatus
} from '../../../store/AppUserManagement/DealerManagementSlice';
import ToggleSwitch from '../../ui/toggleswitch/ToggleSwitch';
import DealerUpdateForm from './DealerUpdateForm';
import DealerListingsTab from './DealerListingsTab';
import DealerLeadsTab from './DealerLeadsTab';
import DealerSubscriptionTab from './DealerSubscriptionTab';
import DealerActivityLogTab from './DealerActivityLogTab';
import { useNavigate } from 'react-router-dom';
import { setSelectedDealer as setDealerRedux } from '../../../store/AppUserManagement/DealerManagementSlice';
import InfoIcon from '@mui/icons-material/Info';


type DealerManagementType = {
    _id: string;
    name: string;
    phone: string;
    email: string;
    createdAt: string;
    updatedAt: string;
    pan_no: string;
    selfie: string,
    dealershipCategories: [];
    activeDealershipCategory: string;
    // Added business details fields
    business_name?: string;
    business_contact_no?: string;
    business_whatsapp_no?: string;
    address?: string;
    city?: string;
    cityId?: string;
    isActive?: boolean;
};

const DealerManagement = () => {
    const [newDealer, setNewDealer] = useState<DealerManagementType>({
        _id: '',
        name: '',
        phone: '',
        email: '',
        createdAt: '',
        updatedAt: '',
        pan_no: '',
        dealershipCategories: [],
        activeDealershipCategory: '',
        selfie: '',
        isActive: undefined,
    });
    const [SelectedDealer, setSelectedDealer] = useState<DealerManagementType | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [pageIndex, setPageIndex] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [alertType, setAlertType] = useState<'success' | 'error' | 'warning' | 'info' | null>(null);
    const [alertMessage, setAlertMessage] = useState('');
    const [showAlert, setShowAlert] = useState(false);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [toggleUser, setToggleUser] = useState<{ _id: string; isActive: boolean } | null>(null);
    const [showToggleModal, setShowToggleModal] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [editIndex, setEditIndex] = useState<number | null>(null);
    const [showView, setShowView] = useState(false);
    const [selectedTab, setSelectedTab] = useState(0);
    const [showActivityLog, setShowActivityLog] = useState(false);
    const [activityDealer, setActivityDealer] = useState<DealerManagementType | null>(null);
    const [columnFilters, setColumnFilters] = useState<{ id: string; value: any }[]>([]);
    const [prevSearchField, setPrevSearchField] = useState('');
    const navigate = useNavigate();
    const activeRole = sessionStorage.getItem("activeRole");

    const dispatch = useDispatch<AppDispatch>();
    const { dealerList, totalItems } = useSelector((state: RootState) => state.DealerManagement);


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
                fetchDealer({
                    search: searchTerm,
                    filters: filterParams,
                    page: pageIndex,
                    limit: pageSize,
                }));
        }, 500); // 500ms delay

        return () => clearTimeout(delayDebounce);

    }, [searchTerm, pageIndex, pageSize, columnFilters, fromDate, toDate]);




    //  const handleColumnFilterChange = (filters: { id: string; value: any }[]) => {
    //         setColumnFilters(filters);
    //         setPageIndex(0);

    //         const payload: any = {
    //             fromDate,
    //             toDate,
    //             page: 0,
    //             limit: pageSize,
    //         };

    //         filters.forEach(({ id, value }) => {
    //             if (id === 'isActive') {
    //                 payload.search = value === 'Active' ? 'true' : 'false';
    //                 payload.searchField = 'isActive';
    //             } else if (value?.trim?.()) {
    //                 payload.search = value.trim();
    //                 payload.searchField = id;
    //             }
    //         });
    //         const delayDebounce = setTimeout(() => {

    //             dispatch(fetchDealer(payload));
    //         }, 500); // 500ms delay

    //         return () => clearTimeout(delayDebounce);
    //     };



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
            dispatch(fetchDealer(payload));
        }, 500);
    };






    const clickHandler = async (searchText: string, exportType?: string) => {
        setSearchTerm(searchText);
        setPageIndex(0);

        if (exportType) {
            await dispatch(fetchDealer({
                fromDate,
                toDate,
                search: searchText,
                exportType: exportType as 'csv' | 'pdf',
            }));
            // } else {
            //     await dispatch(fetchDealer({
            //         fromDate,
            //         toDate,
            //         search: searchText,
            //         page: 0,
            //         limit: pageSize,
            //     }));
        }
    };


    const handleEdit = (Dealer: DealerManagementType, index: number) => {
        setNewDealer(Dealer);
        setEditIndex(index);
        setShowForm(true);
    };


    // const handleView = (dealer: DealerManagementType) => {
    //     dispatch(setDealerRedux(dealer));
    //     navigate(`/superadmin/dealerviewpage/${dealer._id}`);
    // };

    const handleView = (dealer: DealerManagementType) => {
        dispatch(setDealerRedux(dealer));

        const activeRole = sessionStorage.getItem("activeRole");
        const basePath = activeRole === "staff" ? "staff" : "superadmin";

        navigate(`/${basePath}/dealerviewpage/${dealer._id}`, { state: dealer });

    };



    const handleCloseModal = () => {
        setSelectedDealer(null);
    };

    const requestDelete = (id: string) => {
        setDeleteId(id);
        setShowModal(true);
    };

    const confirmDelete = async () => {

        if (!deleteId) return;
        try {
            await dispatch(deleteDealer(deleteId)).unwrap();
            setAlertType('error');
            setAlertMessage('Dealer User deleted successfully.');
            setShowAlert(true);
            dispatch(fetchDealer({ search: searchTerm, page: pageIndex, limit: pageSize }));
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
            await dispatch(toggleDealerStatus({
                _id: toggleUser._id,
                isActive: !toggleUser.isActive
            })).unwrap();

            setAlertType('success');
            setAlertMessage(`User ${toggleUser.isActive ? 'deactivated' : 'activated'} successfully.`);
            setShowAlert(true);

            dispatch(fetchDealer({ search: searchTerm, page: pageIndex, limit: pageSize }));
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


    const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
        setSelectedTab(newValue);
    };

    useEffect(() => {
        //  if one date is filled and the other is not
        if ((fromDate && !toDate) || (!fromDate && toDate)) return;

        const payload = {
            fromDate: fromDate || undefined,
            toDate: toDate || undefined,
        };

        dispatch(fetchDealer(payload));
    }, [fromDate, toDate]);




    const userColumns: MRT_ColumnDef<any>[] = [
        {
            accessorKey: 'name',
            header: 'Dealer Name', filterVariant: 'text',
            Cell: ({ row }) => (
                <Typography
                    sx={{ cursor: 'pointer', fontFamily: 'outfit', fontSize: '14px' }}
                    onClick={() => handleView(row.original)}
                >
                    {row.original.name}
                </Typography>
            ),
        },
        { accessorKey: 'phone', header: 'Mobile No', filterVariant: 'text', },
        { accessorKey: 'business_name', header: 'Business Name', filterVariant: 'text', },
        { accessorKey: 'business_contact_no', header: 'Business Contact', filterVariant: 'text', },
        { accessorKey: 'business_whatsapp_no', header: 'Business Whatsapp', filterVariant: 'text', },
        { accessorKey: 'email', header: 'Email ID', filterVariant: 'text', },
        {
            accessorKey: 'city',
            header: 'City',
            filterVariant: 'text',
            Cell: ({ cell }) => {
                const value = cell.getValue<string>() || '';
                return value.charAt(0).toUpperCase() + value.slice(1);
            }
        },
        {
            accessorKey: 'isActive',
            header: 'Account Status',
            Cell: ({ cell }) => (cell.getValue() ? 'Active' : 'Inactive'),
            filterVariant: 'select',
            filterSelectOptions: ['Active', 'Inactive'],
        },



        {
            accessorKey: 'createdAt',
            header: 'Registration Date',
            Cell: ({ cell }) => {
                const date = cell.getValue() as string;
                return new Date(date).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
            }
        },
        {
            accessorKey: 'updatedAt',
            header: 'Last Updated',
            Cell: ({ cell }) => {
                const date = cell.getValue() as string;
                return new Date(date).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
            }
        },
        {
            header: 'Actions',
            Cell: ({ row }) => {
                return (
                    <Box display="flex" gap={1}>
                        <Tooltip title="View Details" arrow>
                            <IconButton color="primary" onClick={() => handleView(row.original)}>
                                <VisibilityIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit Dealer" arrow>
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

    // const ProfileField = ({ label, value }: { label: string; value: string }) => (
    //     <Box>
    //         <Typography className="font-outfit" variant="body2" sx={{ color: '#888', fontWeight: 500 }}>
    //             {label}
    //         </Typography>
    //         <Typography variant="body1" className="font-outfit">
    //             {value}
    //         </Typography>
    //     </Box>
    // );

    return (
        <>
            <SweetAlert
                show={showModal}
                type="error"
                title="Confirm Deletion"
                message="Are you sure you want to delete this dealer?"
                onConfirm={confirmDelete}
                onCancel={cancelDelete}
                confirmText="Yes"
                cancelText="No"
            />

            <SweetAlert
                show={showToggleModal}
                type="warning"
                title="Confirm Status Change"
                message={`Are you sure you want to ${toggleUser?.isActive ? 'deactivate' : 'activate'} this user?`}
                onConfirm={confirmToggle}
                onCancel={cancelToggle}
                confirmText="Yes"
                cancelText="No"
            />

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
                    <IconButton
                        sx={{ position: 'absolute', top: 12, right: 12 }}
                        onClick={() => setPreviewOpen(false)}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogContent>
            </Dialog>

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
                <DealerUpdateForm
                    onCancel={() => {
                        setTimeout(() => {
                            setShowForm(false);
                            setEditIndex(null);
                        }, 1000);
                    }}
                    editData={editIndex !== null ? newDealer : undefined}
                    isEditMode={editIndex !== null}
                />

            ) : showView && SelectedDealer ? (
                <Box className="flex flex-col items-center px-4 pt-1 pb-4">
                    {/* Profile Card */}
                    {/* <Box
                        className="bg-white rounded-2xl shadow-md p-4 w-full max-w-8xl"

                        sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}
                    > */}
                    {/* Left Profile */}
                    {/* <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: { xs: '100%', md: '40%' },
                                borderRight: { md: '1px solid #e0e0e0' },
                                pr: { md: 4 },
                                mb: { xs: 4, md: 0 },
                            }}
                        > */}
                    {/* <Tooltip title="Click to view full image" arrow>
                                <Box
                                    component="img"
                                    src={SelectedDealer.selfie}
                                    alt={SelectedDealer.name}
                                    sx={{
                                        width: 150,
                                        height: 150,
                                        borderRadius: '50%',
                                        objectFit: 'cover',
                                        mb: 2,
                                        border: '2px solid #ddd',
                                        cursor: 'pointer',
                                    }}
                                    onClick={() => {
                                        const src =
                                            typeof SelectedDealer.selfie === 'string'
                                                ? SelectedDealer.selfie
                                                : (SelectedDealer.selfie
                                                    ? URL.createObjectURL(SelectedDealer.selfie)
                                                    : '');
                                        setPreviewUrl(src);
                                        setPreviewOpen(true);
                                    }}
                                />
                            </Tooltip> */}
                    {/* <Typography variant="h4" className="font-outfit">
                                {SelectedDealer.name}
                            </Typography>
                            <Typography className="font-outfit" variant="body1" color="textSecondary">
                                {SelectedDealer.email}
                            </Typography>
                        </Box> */}

                    {/* Right Info */}
                    {/* <Box sx={{ flex: 1, pl: { md: 4 }, display: 'flex', flexDirection: 'column', gap: 4 }}> */}
                    {/* Personal Details */}
                    {/* <Box>
                                <Typography className="font-outfit underline" variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                                    Personal Details
                                </Typography>
                                <Box className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <ProfileField label="Mobile No" value={SelectedDealer.phone} />
                                    <ProfileField label="City" value={SelectedDealer.city || 'N/A'} />
                                    <ProfileField label="Aadhar No" value={SelectedDealer.aadhar_no} />
                                    <ProfileField label="Account status" value={typeof SelectedDealer.isActive === 'boolean' ? (SelectedDealer.isActive ? 'Active' : 'Blocked') : 'N/A'} />

                                </Box>
                            </Box> */}

                    {/* Business Details */}
                    {/* <Box>
                                <Typography className="font-outfit underline" variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                                    Business Details
                                </Typography>
                                <Box className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <ProfileField label="Business Name" value={SelectedDealer.business_name || 'N/A'} />
                                    <ProfileField label="Dealership Category" value={SelectedDealer.activeDealershipCategory || 'N/A'} />
                                    <ProfileField label="Business Contact" value={SelectedDealer.business_contact_no || 'N/A'} />
                                    <ProfileField label="Business WhatsApp" value={SelectedDealer.business_whatsapp_no || 'N/A'} />
                                    <ProfileField label="Address" value={SelectedDealer.address || 'N/A'} />
                                    <ProfileField label="Registered Date" value={new Date(SelectedDealer.createdAt).toLocaleDateString('en-IN')} />
                                </Box>
                            </Box> */}
                    {/* </Box> */}
                    {/* </Box> */}


                    {/* <Box
                        sx={{
                            backgroundColor: 'white',
                            borderRadius: 2,
                            boxShadow: 1,
                            width: '100%',
                            mt: 4,
                        }}
                    >
                        <Tabs value={selectedTab} onChange={handleTabChange} variant="fullWidth">
                            <Tab className="font-outfit" label="Listings" />
                            <Tab className="font-outfit" label="Leads" />
                            <Tab className="font-outfit" label="Subscription" />
                            <Tab className="font-outfit" label="Activity Log" />
                        </Tabs>
                    </Box> */}

                    {/* Tab Panels */}
                    {/* {selectedTab === 0 && <DealerListingsTab dealer={SelectedDealer} />}
                    {selectedTab === 1 && <DealerLeadsTab dealer={SelectedDealer} />}
                    {selectedTab === 2 && <DealerSubscriptionTab dealer={SelectedDealer} />}
                    {selectedTab === 3 && <DealerActivityLogTab dealer={SelectedDealer} />} */}

                </Box>
            ) : (
                <Box>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                        <Box ml={2}>

                            <Typography variant="h5" fontWeight={500} className="font-outfit">
                                Dealer Management  <Tooltip
                                    title="Manage dealer details, view listings, leads, subscriptions, activity logs, and update profile or business information."
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


                    {/* <DataTable
                        exportType={true}
                        clickHandler={clickHandler}
                        data={dealerList}
                        columns={userColumns}
                        enableColumnFilters={true}
                        columnFilters={columnFilters}
                        onColumnFiltersChange={handleColumnFilterChange}
                        rowCount={totalItems}
                        pageIndex={pageIndex}
                        pageSize={pageSize}
                        onPaginationChange={({ pageIndex, pageSize }) => {
                            setPageIndex(pageIndex);
                            setPageSize(pageSize);
                        }}
                        fromDate={fromDate}
                        toDate={toDate}
                        onFromDateChange={setFromDate}
                        onToDateChange={setToDate}
                    /> */}



                    <DataTable
                        exportType={true}
                        clickHandler={clickHandler}
                        data={dealerList}
                        columns={userColumns}
                        enableColumnFilters={true}
                        columnFilters={columnFilters}
                        onColumnFiltersChange={handleColumnFilterChange}
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
                            dispatch(fetchDealer({
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
                    //     dispatch(fetchDealer({
                    //         fromDate,
                    //         toDate,
                    //         search: searchTerm,
                    //         page: 0,
                    //         limit: pageSize,
                    //     }));
                    //     setPageIndex(0);
                    // }}
                    />
                </Box>
            )}
        </>
    );
}
export default DealerManagement;
export type { DealerManagementType };
