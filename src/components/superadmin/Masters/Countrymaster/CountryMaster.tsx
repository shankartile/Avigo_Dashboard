import {
    Box,
    Typography,
    IconButton,
    Switch,
    Dialog,
    DialogContent,
    DialogTitle,
    Tooltip
} from '@mui/material';

import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import { MRT_ColumnDef } from 'material-react-table';
import { useEffect, useState } from 'react';
import TextField from '../../../form/input/InputField';
import Button from '../../../ui/button/Button';
import DataTable from '../../../tables/DataTable';
import ToggleSwitch from '../../../ui/toggleswitch/ToggleSwitch';
import Alert from '../../../ui/alert/Alert';
import SweetAlert from '../../../ui/alert/SweetAlert';
import { useDispatch, useSelector } from 'react-redux';
import { addCountryMaster, AddCountryMasterPayload, fetchCountryMaster, UpdateCountryMasterPayload, updateCountryMaster, deleteCountryMaster, toggleCountryMasterStatus } from '../../../../store/Masters/CountryMasterSlice';
import { RootState, AppDispatch } from '../../../../store/store';
import { title } from 'process';


// Type definition
type CountryMaster = {
    id: string;
    country_name: string;
}

const CountryMaster = () => {
    const [newCountry, setnewCountry] = useState<CountryMaster>({

        id: '',
        country_name: ''
    });
    const [selectedcountry, setselectedcountry] = useState<CountryMaster | null>(null);

    const [editIndex, setEditIndex] = useState<number | null>(null);
    const [alertType, setAlertType] = useState<'success' | 'error' | 'warning' | 'info' | null>(null);
    const [alertMessage, setAlertMessage] = useState('');
    const [showAlert, setShowAlert] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [pageIndex, setPageIndex] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [toggleUser, setToggleUser] = useState<{ _id: string; isActive: boolean } | null>(null);
    const [showToggleModal, setShowToggleModal] = useState(false);




    const dispatch = useDispatch<AppDispatch>();
    const { CountryMaster: rawList = [], totalItems } = useSelector((state: RootState) => state.CountryMaster);

    const countryList = rawList.map(item => ({
        ...item,
        id: item._id,
    }));


    useEffect(() => {
        dispatch(fetchCountryMaster({
            search: searchTerm,
            page: pageIndex,
            limit: pageSize,
        }));
    }, [searchTerm, pageIndex, pageSize]);





    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        setnewCountry((prev) => ({
            ...prev,
            [name]: value, // clean number input
        }));
    };

    const isFormValid =
        newCountry.country_name.trim() !== ""




    const handleAddCountryMaster = async () => {
        try {
            const payload: AddCountryMasterPayload = {

                country_name: newCountry.country_name,
            };

            const result = await dispatch(addCountryMaster(payload)).unwrap();

            setAlertType('success');
            setAlertMessage('Country Added successfully.');
            setShowAlert(true);
            setTimeout(() => setShowAlert(false), 3000);
            dispatch(fetchCountryMaster({
                search: searchTerm,
                page: pageIndex,
                limit: pageSize,
            })); setShowForm(false);
        } catch (err: any) {
            setAlertType('error');
            setAlertMessage('Failed to add Country: ' + err);
            setShowAlert(true);
            setTimeout(() => setShowAlert(false), 3000);

        }
    };


    const handleEdit = async (CountryMaster: any, index: number) => {
        try {
            setnewCountry({
                id: CountryMaster._id || '',
                country_name: CountryMaster.country_name || '',

            })
            setEditIndex(index);
            setShowForm(true);
        } catch (err: any) {
            setAlertType('error');
            setAlertMessage(`${err}`);
            setShowAlert(true);
            setTimeout(() => setShowAlert(false), 3000);
        }
    };


    const handleUpdateCountryMaster = async () => {
        try {
            const payload: UpdateCountryMasterPayload = {
                _id: newCountry.id,
                country_name: newCountry.country_name,
            };

            const result = await dispatch(updateCountryMaster(payload)).unwrap();

            setAlertType('success');
            setAlertMessage('Country updated successfully.');
            setShowAlert(true);
            setTimeout(() => setShowAlert(false), 3000);

            setShowForm(false);
            setEditIndex(null);

            dispatch(fetchCountryMaster({
                search: searchTerm,
                page: pageIndex,
                limit: pageSize,
            }));
        } catch (err: any) {
            setAlertType('error');
            setAlertMessage(`${err}`);
            setShowAlert(true);
            setTimeout(() => setShowAlert(false), 3000);
        }
    };



    const requestDelete = (id: string) => {
        setDeleteId(id);
        setShowModal(true);
    };

    const confirmDelete = async () => {
        if (!deleteId) return;

        try {
            await dispatch(deleteCountryMaster(deleteId)).unwrap();
            setAlertType('error');
            setAlertMessage('Country deleted successfully.');
            setShowAlert(true);
            setTimeout(() => setShowAlert(false), 3000);

            dispatch(fetchCountryMaster({
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
            await dispatch(toggleCountryMasterStatus({
                _id: toggleUser._id,
                isActive: !toggleUser.isActive
            })).unwrap();

            setAlertType('success');
            setAlertMessage(`Country ${toggleUser.isActive ? 'deactivated' : 'activated'} successfully.`);
            setShowAlert(true);

            dispatch(fetchCountryMaster({ search: searchTerm, page: pageIndex, limit: pageSize }));
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









    const handleView = (CountryMaster: CountryMaster) => {
        setselectedcountry(CountryMaster);
    };

    const handleCloseModal = () => {
        setselectedcountry(null);
        setShowForm(false);
    };



    const clickHandler = (searchText: string) => {
        setSearchTerm(searchText);
        setPageIndex(0);
        dispatch(fetchCountryMaster({
            search: searchText,
            page: 1,
            limit: pageSize,
        }));
    };





    const CountryMasterColumns: MRT_ColumnDef<any>[] = [
        { accessorKey: 'country_name', header: 'Country Name' },

        {
            header: 'Actions',
            Cell: ({ row }) => {

                return (
                    <Box display="flex" gap={1}>
                        <Tooltip title="View Country Details">
                        <IconButton color="primary" onClick={() => handleView(row.original)}>
                            <VisibilityIcon />
                        </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit Country">
                        <IconButton color="secondary" onClick={() => handleEdit(row.original, row.index)}>
                            <EditIcon />
                        </IconButton>
                        </Tooltip>
                        {/* Uncomment if delete functionality is needed */} 
                        {/* <IconButton color="error" onClick={() => requestDelete(row.original._id)}>
                            <DeleteIcon />
                        </IconButton> */}

                        <ToggleSwitch
                            checked={row.original.isActive}
                            onChange={() => handleToggleClick(row.original)}
                            tooltipTitle={row.original.isActive ? 'Deactivate' : 'Activate'}
                        />
                    </Box>
                );
            }
        }
    ];

    return (
        <>
            <SweetAlert
                show={showToggleModal}
                type="warning"
                title="Confirm Status Change"
                message={`Are you sure you want to ${toggleUser?.isActive ? 'deactivate' : 'activate'} this Country?`}
                onConfirm={confirmToggle}
                onCancel={cancelToggle}
                confirmText="Yes"
                cancelText="No"
            />
            <SweetAlert
                show={showModal}
                type="error"
                title="Confirm Deletion"
                message="Are you sure you want to delete this Country?"
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
                                Country Management
                            </Typography></Box>
                        {/* <Button onClick={() => {
                            setnewCountry({
                                id: '',
                                country_name: '',

                            });
                            setEditIndex(null);
                            setShowForm(true);
                        }}><AddIcon />Add New Country</Button> */}
                    </Box>

                    <DataTable
                        clickHandler={clickHandler}
                        data={countryList}
                        columns={CountryMasterColumns}
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
                <Dialog open={showForm} onClose={(event, reason) => {
                    if (reason !== 'backdropClick') {
                        setShowForm(false);
                    }
                }} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: '25px' } }}
                    BackdropProps={{
                        sx: {
                            backdropFilter: 'blur(4px)',
                            backgroundColor: 'rgba(0, 0, 0, 0.2)'
                        }
                    }}>
                    <Box sx={{ background: 'linear-gradient( #255593 103.05%)', height: 25, p: 4, position: 'relative' }}>
                        <DialogTitle className='font-outfit' sx={{ color: 'white', position: 'absolute', top: 5 }}>
                            {editIndex !== null ? 'Edit Country' : 'Add Country'}
                        </DialogTitle>
                        <IconButton sx={{ position: 'absolute', top: 12, right: 12, color: 'white' }} onClick={() => setShowForm(false)}><CloseIcon /></IconButton>
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
                        <div className="p-4 grid grid-cols-1 md:grid-cols-1 gap-4">
                            <TextField label="Country Title" name="country_name" value={newCountry.country_name} onChange={handleChange} />
                        </div>

                        <Box display="flex" justifyContent="center" gap={6} mt={4}>
                            <Button

                                onClick={editIndex !== null ? handleUpdateCountryMaster : handleAddCountryMaster}
                                className="rounded-[25px]"
                                disabled={!isFormValid}
                            >
                                {editIndex !== null ? 'Update Country' : 'Add Country'}
                            </Button>
                            <Button variant="secondary" onClick={() => setShowForm(false)} className="rounded-[25px]">
                                Cancel
                            </Button>
                        </Box>
                    </DialogContent>

                </Dialog>
            )}

            <Dialog open={!!selectedcountry} onClose={handleCloseModal} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: '25px' } }}
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
                            Country Details
                        </Typography>
                        <IconButton sx={{ color: 'white' }} onClick={handleCloseModal}>
                            <CloseIcon />
                        </IconButton>
                    </Box>
                    <DialogContent>
                        {selectedcountry && (
                            <Box display="flex" flexDirection="column" gap={2}>
                                <Typography className="font-outfit"><strong>Country Name:</strong> {selectedcountry.country_name}</Typography>
                            </Box>
                        )}
                    </DialogContent>
                </Box>
            </Dialog>
        </>
    );
};

export default CountryMaster;
