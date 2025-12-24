import {
    Box,
    Typography,
    IconButton,
    Dialog,
    DialogContent,
    DialogTitle, Tooltip
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { useEffect, useRef, useState } from 'react';
import InfoIcon from '@mui/icons-material/Info';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import { MRT_ColumnDef } from 'material-react-table';
import DataTable from '../../../components/tables/DataTable';
import Button from '../../../components/ui/button/Button';
import SweetAlert from '../../../components/ui/alert/SweetAlert';
import ToggleSwitch from '../../../components/ui/toggleswitch/ToggleSwitch';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../../store/store';
import Alert from '../../../components/ui/alert/Alert';
import TextField from '../../../components/form/input/InputField';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';

import {
    createEnquiryListing,
    fetchEnquiryListing,
    deleteEnquiryListing,
    toggleEnquiryListingStatus,
    AddEnquiryListingPayload,
    updateEnquiryListing,
    UpdateEnquiryListingPayload
} from '../../../store/CMSManagement/EnquiryListingSlice';

type EnquiryListingType = {
    _id: string;
    username: string;
    contact: string;
    email: string;
    message: string;
    createdAt: string;
    updatedAt: string;
    isActive: boolean;
};

const EnquiryListing = () => {

    const [newEnquiryListing, setNewEnquiryListing] = useState<EnquiryListingType>({
        _id: '',
        username: '',
        contact: '',
        message: '',
        email: '',
        createdAt: '',
        updatedAt: '',
        isActive: false,
    });

    const dispatch = useDispatch<AppDispatch>();
    const { enquiryListing, loading } = useSelector((state: RootState) => state.enquirylisting);

    const [editIndex, setEditIndex] = useState<number | null>(null);
    const [selectedEnquiryListing, setSelectedEnquiryListing] = useState<EnquiryListingType | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [pageIndex, setPageIndex] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [alertType, setAlertType] = useState<'success' | 'error' | null>(null);
    const [alertMessage, setAlertMessage] = useState('');
    const [showAlert, setShowAlert] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [columnFilters, setColumnFilters] = useState<{ id: string; value: any }[]>([]);
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [prevSearchField, setPrevSearchField] = useState('');
    const [filtertype, setFiltertype] = useState<string>('dealer');
    const [searchParams, setSearchParams] = useSearchParams();
    const [isInitialised, setIsInitialised] = useState(false);


    const { enquiryListing: rawList = [], totalItems } = useSelector((state: RootState) => state.enquirylisting);

    const enquirylistingList = rawList.map(item => ({
        ...item,
        id: item._id,
    }));


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
            dispatch(fetchEnquiryListing({
                filters: filterParams,
                search: searchTerm,
                page: pageIndex,
                limit: pageSize,
                type: filtertype === 'dealer' ? '' : 'buyer',

            }));
        }, 500); // 500ms delay

        return () => clearTimeout(delayDebounce);
    }, [searchTerm, pageIndex, pageSize, filtertype, columnFilters, fromDate, toDate]);


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
    //     // Extract the first non-empty filter
    //     const activeFilter = filters.find(f => f.value?.trim?.() !== '');

    //     // Extract values safely
    //     const search = activeFilter?.value?.trim() || '';
    //     const searchField = activeFilter?.id || '';

    //     // If filter is same as previous, skip API call
    //     if (search === searchTerm && searchField === prevSearchField) return;

    //     // Update states
    //     setColumnFilters(filters);
    //     setSearchTerm(search);
    //     setPrevSearchField(searchField);
    //     setPageIndex(0);

    //     // Dispatch API with updated filters
    //     const delayDebounce = setTimeout(() => {

    //         dispatch(fetchEnquiryListing({
    //             fromDate,
    //             toDate,
    //             search,
    //             searchField,
    //             page: 0,
    //             limit: pageSize,
    //         }));
    //     }, 500); // 500ms delay

    //     return () => clearTimeout(delayDebounce);
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
            type: filtertype,
            fromDate,
            toDate,
            page: pageIndex,
            limit: pageSize,
        };

        //  Debounce logic
        if (debounceTimer.current) clearTimeout(debounceTimer.current);
        debounceTimer.current = setTimeout(() => {
            dispatch(fetchEnquiryListing(payload));
        }, 500);
    };




    const clickHandler = async (searchText: string, exportType?: string) => {
        setSearchTerm(searchText);
        setPageIndex(0);

        if (exportType) {
            await dispatch(fetchEnquiryListing({
                type: filtertype,
                fromDate,
                toDate,
                search: searchText,
                exportType: exportType as 'csv' | 'pdf',
            }));
        }

    };


    // const clickHandler = (searchText: string) => {
    //     setSearchTerm(searchText);
    //     setPageIndex(0);
    //     dispatch(fetchEnquiryListing({ page: 0, limit: pageSize }));
    // };

    const handleView = (enquirylisting: EnquiryListingType) => {
        setSelectedEnquiryListing(enquirylisting);
    };

    const handleCloseModal = () => {
        setSelectedEnquiryListing(null);
    };

    const requestDelete = (id: string) => {
        setDeleteId(id);
        setShowModal(true);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        setNewEnquiryListing((prev) => ({
            ...prev,
            [name]: value, // clean number input
        }));
    };









    const confirmDelete = async () => {
        if (!deleteId) return;
        try {
            await dispatch(deleteEnquiryListing({ _id: deleteId, type: filtertype })).unwrap();
            setAlertType('error');
            setAlertMessage('Enquiry deleted successfully.');
            dispatch(fetchEnquiryListing({ page: pageIndex, limit: pageSize }));
        } catch (err) {
            setAlertType('error');
            setAlertMessage('Delete failed: ' + err);
        }
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 3000);
        setShowModal(false);
        setDeleteId(null);
    };

    const cancelDelete = () => {
        setShowModal(false);
        setDeleteId(null);
    };

    const handleToggleStatus = async (id: string) => {
        try {
            await dispatch(toggleEnquiryListingStatus(id)).unwrap();
            setAlertType('success');
            setAlertMessage('Status updated successfully.');
            dispatch(fetchEnquiryListing({ page: pageIndex, limit: pageSize }));
        } catch (err) {
            setAlertType('error');
            setAlertMessage('Failed to update status: ' + err);
        }
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 3000);
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

        dispatch(fetchEnquiryListing(payload));
    }, [fromDate, toDate]);




    const truncateText = (text?: string, maxLength = 50): string => {
        if (!text) return '';
        return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
    };




    const userColumns: MRT_ColumnDef<any>[] = [
        { accessorKey: 'username', header: 'Username', filterVariant: 'text' },
        { accessorKey: 'email', header: 'Email', filterVariant: 'text' },
        { accessorKey: 'contact', header: 'Contact', filterVariant: 'text' },
        { accessorKey: 'message', header: 'Message', filterVariant: 'text', Cell: ({ row }) => truncateText(row.original.message, 30) },

        // {
        //     accessorKey: 'date',
        //     header: 'Date',
        //     Cell: ({ row }) => {
        //         const date = row.original.date;
        //         const istDate = date
        //             ? new Date(date).toLocaleDateString('en-IN')
        //             : '';
        //         return <span>{istDate}</span>;
        //     },
        // },
        {
            accessorKey: 'createdAt',
            header: 'Enquiry Date',
            Cell: ({ row }) => {
                const date = row.original.createdAt;
                const istDate = date
                    ? new Date(date).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
                    : '';
                return <span>{istDate}</span>;
            },
        },
        // { accessorKey: 'updatedAt', header: 'Updated At' },
        {
            header: 'Actions',
            Cell: ({ row }) => (
                <Box display="flex" gap={1}>
                    <Tooltip title="View Enquiry" arrow>
                        <IconButton color="primary" onClick={() => handleView(row.original)}>
                            <VisibilityIcon />
                        </IconButton>
                    </Tooltip>
                    {/* <IconButton color="secondary" onClick={() => handleEdit(row.original, row.index)}>
                        <EditIcon />
                    </IconButton> */}
                    <IconButton color="error" onClick={() => requestDelete(row.original._id)}>
                        <DeleteIcon />
                    </IconButton>
                </Box>
            ),
        },
    ];

    return (
        <>
            <SweetAlert
                show={showModal}
                type="error"
                title="Confirm Deletion"
                message="Are you sure you want to delete this enquiry?"
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
                            <Typography variant="h5" fontWeight={500} className="font-outfit">
                                Enquiry Listing   <Tooltip
                                    title="View website enquiries submitted through the Contact Us form, including dealer and buyer-related queries."
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
                        {/* <Button onClick={() => {
                            setNewEnquiryListing({
                                _id: '',
                                username: '',
                                contact: '',
                                message: '',
                                date: '',
                                createdAt: '',
                                updatedAt: '',
                                isActive: false,


                            });
                            setEditIndex(null);
                            setShowForm(true);
                        }}>Add New Enquiry</Button> */}
                    </Box>

                    <DataTable
                        exportType={true}
                        clickHandler={clickHandler}
                        data={enquirylistingList}
                        columns={userColumns}
                        enableColumnFilters={true}
                        columnFilters={columnFilters}
                        onColumnFiltersChange={handleColumnFilterChange}
                        rowCount={totalItems}
                        pageIndex={pageIndex}
                        pageSize={pageSize}
                        enablefeedbacktypeFilter={true}
                        productTypeValue={filtertype}
                        onFeedbacktypeChange={(type: string) => {
                            setFiltertype(type);
                            setPageIndex(0);

                            // Update URL query param to enable back/forward navigation
                            searchParams.set('type', type);
                            setSearchParams(searchParams); // This pushes to history

                            dispatch(fetchEnquiryListing({
                                search: searchTerm,
                                type: filtertype,
                                page: 0,
                                limit: pageSize,
                            }));
                        }}

                        onPaginationChange={({ pageIndex, pageSize }) => {
                            setPageIndex(pageIndex);
                            setPageSize(pageSize);
                            const filterParams: Record<string, any> = {};
                            columnFilters.forEach(({ id, value }) => {
                                if (!value) return;
                                filterParams[id] = id === 'isActive' ? value === 'Active' : value;
                            });
                            dispatch(fetchEnquiryListing({
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
                            {editIndex !== null ? 'Edit Enquiry Listing' : 'Add Enquiry'}
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
                            <TextField label="Username" name="username" value={newEnquiryListing.username} onChange={handleChange} />
                            <TextField label="Contact" name="contact" value={newEnquiryListing.contact} onChange={handleChange} />
                            <TextField label="Message" name="message" value={newEnquiryListing.message} onChange={handleChange} />
                        </div>

                        <Box display="flex" justifyContent="center" gap={6} mt={4}>

                            <Button variant="secondary" onClick={() => setShowForm(false)} className="rounded-[25px]">
                                Cancel
                            </Button>
                        </Box>
                    </DialogContent>

                </Dialog>
            )}

            <Dialog
                open={!!selectedEnquiryListing}
                onClose={handleCloseModal}
                maxWidth="md"
                fullWidth
                PaperProps={{ sx: { borderRadius: '25px' } }}
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
                            Enquiry Details
                        </Typography>
                        <IconButton sx={{ color: 'white' }} onClick={handleCloseModal}>
                            <CloseIcon />
                        </IconButton>
                    </Box>
                    <DialogContent>
                        {selectedEnquiryListing && (
                            <Box display="flex" flexDirection="column" gap={2}>
                                <Typography className="font-outfit">
                                    <strong>Username:</strong> {selectedEnquiryListing.username}
                                </Typography>
                                <Typography className="font-outfit">
                                    <strong>Contact:</strong> {selectedEnquiryListing.contact}
                                </Typography>
                                <Typography className="font-outfit">
                                    <strong>Email:</strong> {selectedEnquiryListing.email}
                                </Typography>
                                <Typography className="font-outfit">
                                    <strong>Date:</strong> {new Date(selectedEnquiryListing.createdAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
                                </Typography>
                                <Typography className="font-outfit">
                                    <strong>Message:</strong> {selectedEnquiryListing.message}
                                </Typography>


                                {/* <Typography className="font-outfit">
                                    <strong>Updated At:</strong> {selectedEnquiryListing.updatedAt}
                                </Typography> */}


                            </Box>
                        )}
                    </DialogContent>
                </Box>
            </Dialog>

        </>
    );

}

export default EnquiryListing;
