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
import InfoIcon from '@mui/icons-material/Info';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CloseIcon from '@mui/icons-material/Close';
import { MRT_ColumnDef } from 'material-react-table';
import DataTable from '../../tables/DataTable';
import SweetAlert from '../../ui/alert/SweetAlert';
import Alert from '../../ui/alert/Alert';
import Button from '../../ui/button/Button';
import AddIcon from '@mui/icons-material/Add';

import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../../store/store';
import {
    fetchBuyer,
    deleteBuyer,
    toggleBuyerStatus
} from '../../../store/AppUserManagement/BuyerManagementslice';
import ToggleSwitch from '../../ui/toggleswitch/ToggleSwitch';
import BuyerUpdateForm from './BuyerUpdateForm';

type BuyerManagementType = {
    _id: string;
    name: string;
    phone: string;
    productLeadsCount: string;
    dealerLeadsCount: string;
    createdAt: string;
    categories: [];
    cityName?: string;
};

const BuyerManagement = () => {
    const [newBuyer, setNewBuyer] = useState<BuyerManagementType>({
        _id: '',
        name: '',
        phone: '',
        productLeadsCount: '',
        dealerLeadsCount: '',
        createdAt: '',
        categories: [],
    });
    const [SelectedBuyer, setSelectedBuyer] = useState<BuyerManagementType | null>(null);
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
    const [showView, setShowView] = useState(false);
    const [selectedTab, setSelectedTab] = useState(0);
    const [toggleUser, setToggleUser] = useState<{ _id: string; isActive: boolean } | null>(null);
    const [showToggleModal, setShowToggleModal] = useState(false);
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [columnFilters, setColumnFilters] = useState<{ id: string; value: any }[]>([]);

    const dispatch = useDispatch<AppDispatch>();
    const { BuyerManagement, totalItems } = useSelector((state: RootState) => state.BuyerManagement);

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
                fetchBuyer({
                    search: searchTerm,
                    page: pageIndex,
                    limit: pageSize,
                    filters: filterParams, //  include filters
                })
            );
        }, 500); // 500ms delay

        return () => clearTimeout(delayDebounce);

    }, [searchTerm, pageIndex, pageSize, columnFilters, fromDate, toDate]);


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
            dispatch(fetchBuyer(payload));
        }, 500);
    };


    const clickHandler = async (searchText: string, exportType?: string) => {
        setSearchTerm(searchText);
        setPageIndex(0);

        if (exportType) {
            await dispatch(fetchBuyer({
                fromDate,
                toDate,
                search: searchText,
                exportType: exportType as 'csv' | 'pdf',
            }));
            // } else {
            //     await dispatch(
            //         fetchBuyer({
            //             fromDate,
            //             toDate,
            //             search: searchText,
            //             page: 0,
            //             limit: pageSize,
            //         }));
        }
    };



    const handleEdit = (Buyer: BuyerManagementType, index: number) => {
        setNewBuyer(Buyer);
        setEditIndex(index);
        setShowForm(true);
    };


    const handleView = (user: BuyerManagementType) => {
        setSelectedBuyer(user);
        setShowView(true);
        setSelectedTab(0); // Reset to first tab
    };


    const handleCloseModal = () => {
        setSelectedBuyer(null);
    };

    const requestDelete = (id: string) => {
        setDeleteId(id);
        setShowModal(true);
    };


    const confirmDelete = async () => {

        if (!deleteId) return;
        try {
            await dispatch(deleteBuyer(deleteId)).unwrap();
            setAlertType('error');
            setAlertMessage('Buyer deleted successfully.');
            setShowAlert(true);
            dispatch(fetchBuyer({ search: searchTerm, page: pageIndex, limit: pageSize }));
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
            await dispatch(toggleBuyerStatus({
                _id: toggleUser._id,
                isActive: !toggleUser.isActive
            })).unwrap();

            setAlertType('success');
            setAlertMessage(`Buyer ${toggleUser.isActive ? 'deactivated' : 'activated'} successfully.`);
            setShowAlert(true);

            dispatch(fetchBuyer({ search: searchTerm, page: pageIndex, limit: pageSize }));
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

        dispatch(fetchBuyer(payload));
    }, [fromDate, toDate]);



    const userColumns: MRT_ColumnDef<any>[] = [
        { accessorKey: 'name', header: 'Buyer Name', filterVariant: 'text' },
        { accessorKey: 'phone', header: 'Mobile No', filterVariant: 'text' },
        {
            accessorKey: 'cityName',
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
                const dispatch = useDispatch<AppDispatch>();




                return (
                    <Box display="flex" gap={1}>
                        <Tooltip title="View Details" arrow>
                            <IconButton color="primary" onClick={() => handleView(row.original)}>
                                <VisibilityIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit Buyer" arrow>
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
                message={`Are you sure you want to ${toggleUser?.isActive ? 'deactivate' : 'activate'} this Buyer?`}
                onConfirm={confirmToggle}
                onCancel={cancelToggle}
                confirmText="Yes"
                cancelText="No"
            />


            <SweetAlert
                show={showModal}
                type="error"
                title="Confirm Deletion"
                message="Are you sure you want to delete this buyer?"
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
                <BuyerUpdateForm
                    onCancel={() => {
                        setTimeout(() => {
                            setShowForm(false);
                            setEditIndex(null);
                        }, 2000);
                    }}
                    editData={editIndex !== null ? newBuyer : undefined}
                    isEditMode={editIndex !== null}
                />
            ) : showView && SelectedBuyer ? (
                <Box className="max-w-8xl mx-auto rounded-xl shadow-md mb-6" sx={{ backgroundColor: 'white' }}>
                    {/* Gradient Header */}
                    <Box
                        sx={{
                            background: 'linear-gradient( #255593 103.05%)',
                            height: 60,
                            px: 4,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            borderTopLeftRadius: 12,
                            borderTopRightRadius: 12,
                            color: 'white',
                        }}
                    >
                        <Typography className="font-outfit" variant="h6">
                            Buyer Details
                        </Typography>
                        <IconButton sx={{ color: 'white' }} onClick={() => { setShowView(false); setSelectedBuyer(null); }}>
                            <CloseIcon />
                        </IconButton>
                    </Box>

                    {/* Tab Content */}
                    <Box px={4} py={4}>
                        <Box className="grid grid-cols-2 gap-4">
                            <Typography className="font-outfit text-sm"><strong>Name:</strong> {SelectedBuyer.name}</Typography>
                            <Typography className="font-outfit text-sm"><strong>Mobile No:</strong> {SelectedBuyer.phone}</Typography>
                            <Typography className="font-outfit text-sm"><strong>City:</strong> {SelectedBuyer?.cityName
                                ? SelectedBuyer.cityName.charAt(0).toUpperCase() + SelectedBuyer.cityName.slice(1)
                                : 'N/A'}</Typography>
                            <Typography className="font-outfit text-sm"><strong>Product Leads:</strong> {SelectedBuyer.productLeadsCount || 'N/A'}</Typography>
                            <Typography className="font-outfit text-sm">
                                <strong>Registration Date:</strong> {new Date(SelectedBuyer.createdAt).toLocaleDateString('en-IN')}
                            </Typography>
                            <Typography className="font-outfit text-sm"><strong>Dealer Leads:</strong> {SelectedBuyer.dealerLeadsCount || 'N/A'}</Typography>

                            <Typography className="font-outfit text-sm">
                                <strong>Interested Categories:</strong>{" "}
                                {SelectedBuyer?.categories?.filter((c: any) => c.isLookingFor).length
                                    ? SelectedBuyer.categories
                                        .filter((c: any) => c.isLookingFor)
                                        .map((c: any) => c.categoryName)
                                        .join(", ")
                                    : "N/A"}
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            ) : (
                <Box>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                        <Box ml={2}>
                            <Typography variant="h5" fontWeight={500} className="font-outfit">
                                Buyer Management  <Tooltip
                                    title="View and manage buyer profiles, and update buyer details as needed."
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

                        exportType={true}
                        clickHandler={clickHandler}
                        data={BuyerManagement}
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
                            dispatch(fetchBuyer({
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
                    //     dispatch(fetchBuyer({
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
export default BuyerManagement;
