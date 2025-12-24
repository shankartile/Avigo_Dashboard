import {
    Box,
    Typography,
    IconButton,
    Switch,
    Dialog,
    DialogContent,
    DialogTitle,
    Tooltip,
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
import { addBikeBrandMaster, AddBikeBrandMasterPayload, fetchBikeBrandMaster, UpdateBikeBrandMasterPayload, updateBikeBrandMaster, deleteBikeBrandMaster, toggleBikeBrandMasterStatus } from '../../../../store/Masters/BikeBrandMasterSlice';
import { fetchBiketype } from '../../../../store/Masters/BikeNameMasterSlice';


import { RootState, AppDispatch } from '../../../../store/store';
import { title } from 'process';

// Type definition
type BikeBrandMaster = {
    id: string;
    brand: string;
    bike_type_id: string;
}

const BikeBrandMaster = () => {
    const [newbikebrand, setnewbikebrand] = useState<BikeBrandMaster>({

        id: '',
        brand: '',
        bike_type_id: ''

    });
    const [selectedbikebrand, setselectedbikebrand] = useState<BikeBrandMaster | null>(null);

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
    const { BikeBrandMaster: rawList = [], totalItems } = useSelector((state: RootState) => state.BikeBrandMaster);
    const { BikeTypeMaster } = useSelector((state: RootState) => state.BikeTypeMaster);

    const bikebrandlist = rawList.map(item => ({
        ...item,
        id: item._id,
    }));


    useEffect(() => {
        const delayDebounce = setTimeout(() => {

            dispatch(fetchBikeBrandMaster({
                search: searchTerm,
                page: pageIndex,
                limit: pageSize,
            }));
        }, 500); // 500ms delay

        return () => clearTimeout(delayDebounce);
    }, [searchTerm, pageIndex, pageSize]);


    useEffect(() => {
        const delayDebounce = setTimeout(() => {

            dispatch(fetchBiketype({
                search: searchTerm,
                page: pageIndex,
                limit: pageSize,
            }));
        }, 500); // 500ms delay

        return () => clearTimeout(delayDebounce);
    }, [searchTerm, pageIndex, pageSize]);




    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        setnewbikebrand((prev) => ({
            ...prev,
            [name]: value, // clean number input
        }));
    };

    const isFormValid =
        newbikebrand.brand.trim() !== ""




    const handleAddBikeBrandMaster = async () => {
        try {
            const payload: AddBikeBrandMasterPayload = {

                brand: newbikebrand.brand,
                bike_type_id: newbikebrand.bike_type_id || ''

            };

            const result = await dispatch(addBikeBrandMaster(payload)).unwrap();

            setAlertType('success');
            setAlertMessage('Bike Brand Added successfully.');
            setShowAlert(true);
            setTimeout(() => setShowAlert(false), 3000);
            dispatch(fetchBikeBrandMaster({
                search: searchTerm,
                page: pageIndex,
                limit: pageSize,
            })); setShowForm(false);
        } catch (err: any) {
            setAlertType('error');
            setAlertMessage('Failed to add Bike Brand : ' + err);
            setShowAlert(true);
            setTimeout(() => setShowAlert(false), 3000);

        }
    };


    const handleEdit = async (BikeBrandMaster: any, index: number) => {
        try {
            setnewbikebrand({
                id: BikeBrandMaster._id || '',
                brand: BikeBrandMaster.brand || '',
                bike_type_id: BikeBrandMaster.bike_type_id || ''

            })
            setEditIndex(index);
            setShowForm(true);
        } catch (err) {
            setAlertType('error');
            setAlertMessage('Unable to fetch Bike Brand  details for editing.');
            setShowAlert(true);
        }
    };


    const handleUpdateBikeBrandMaster = async () => {
        try {
            const payload: UpdateBikeBrandMasterPayload = {

                _id: newbikebrand.id,
                brand: newbikebrand.brand,
                bike_type_id: newbikebrand.bike_type_id || ''


            };
            const result = await dispatch(updateBikeBrandMaster(payload)).unwrap();
            setAlertType('success');
            setAlertMessage('Bike Brand  updated successfully.');
            setShowAlert(true);
            setTimeout(() => setShowAlert(false), 3000);

            setShowForm(false);
            setEditIndex(null);
            dispatch(fetchBikeBrandMaster({
                search: searchTerm,
                page: pageIndex,
                limit: pageSize,
            }));
        } catch (err: any) {
            setAlertType('error');
            setAlertMessage('Failed to update Bike Brand : ');
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
            await dispatch(deleteBikeBrandMaster(deleteId)).unwrap();
            setAlertType('error');
            setAlertMessage('Bike Brand  deleted successfully.');
            setShowAlert(true);
            setTimeout(() => setShowAlert(false), 3000);

            dispatch(fetchBikeBrandMaster({
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
            await dispatch(toggleBikeBrandMasterStatus({
                _id: toggleUser._id,
                isActive: !toggleUser.isActive
            })).unwrap();

            setAlertType('success');
            setAlertMessage(`Bike Brand ${toggleUser.isActive ? 'deactivated' : 'activated'} successfully.`);
            setShowAlert(true);

            dispatch(fetchBikeBrandMaster({ search: searchTerm, page: pageIndex, limit: pageSize }));
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

    const handleView = (BikeBrandMaster: BikeBrandMaster) => {
        setselectedbikebrand(BikeBrandMaster);
    };

    const handleCloseModal = () => {
        setselectedbikebrand(null);
        setShowForm(false);
    };



    const clickHandler = (searchText: string) => {
        setSearchTerm(searchText);
        setPageIndex(0);

    };





    const BikeBrandMasterColumns: MRT_ColumnDef<any>[] = [
        { accessorKey: 'brand', header: 'Bike brand' },
        { accessorKey: 'bike_type_name', header: 'Bike Type' },

        {
            header: 'Actions',
            Cell: ({ row }) => {

                return (
                    <Box display="flex" gap={1}>
                        <Tooltip title="View Details">
                            <IconButton color="primary" onClick={() => handleView(row.original)}>
                                <VisibilityIcon />
                            </IconButton>
                        </Tooltip>

                        {!row.original.isOthers && (
                            <Tooltip title="Edit">
                                <span>
                                    <IconButton color="secondary" onClick={() => handleEdit(row.original, row.index)}>
                                        <EditIcon />
                                    </IconButton>
                                </span>
                            </Tooltip>)}

                        {!row.original.isOthers && (
                            <IconButton color="error" onClick={() => requestDelete(row.original._id)}>
                                <DeleteIcon />
                            </IconButton>)}
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
                message={`Are you sure you want to ${toggleUser?.isActive ? 'deactivate' : 'activate'} this Bike Brand?`}
                onConfirm={confirmToggle}
                onCancel={cancelToggle}
                confirmText="Yes"
                cancelText="No"
            />

            <SweetAlert
                show={showModal}
                type="error"
                title="Confirm Deletion"
                message="Are you sure you want to delete this Bike Brand ?"
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
                                Bike Brand Management
                            </Typography>
                        </Box>
                        <Button onClick={() => {
                            setnewbikebrand({
                                id: '',
                                brand: '',
                                bike_type_id: ''

                            });
                            setEditIndex(null);
                            setShowForm(true);
                        }}><AddIcon />Add New Bike Brand </Button>
                    </Box>

                    <DataTable
                        clickHandler={clickHandler}
                        data={bikebrandlist}
                        columns={BikeBrandMasterColumns}
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
                            {editIndex !== null ? 'Edit Bike Brand' : 'Add Bike Brand'}
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

                            <div className="flex flex-col">
                                <label className="text-sm text-gray-600 dark:text-white mb-1 block">Bike Type <span className="text-error-500"> * </span>
                                </label>

                                <select
                                    name="bike_type_id"
                                    value={newbikebrand.bike_type_id}
                                    onChange={handleChange}
                                    className="mt-1 p-2 border rounded"
                                >
                                    <option value="">Select Bike Type</option>
                                    {BikeTypeMaster?.filter((c) => c.isActive).map((biketype) => (
                                        <option key={biketype._id} value={biketype._id}>
                                            {biketype.bike_type}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <TextField label="Bike Brand " name="brand" value={newbikebrand.brand} onChange={handleChange} />
                        </div>

                        <Box display="flex" justifyContent="center" gap={6} mt={4}>
                            <Button

                                onClick={editIndex !== null ? handleUpdateBikeBrandMaster : handleAddBikeBrandMaster}
                                className="rounded-[25px]"
                                disabled={!isFormValid}
                            >
                                {editIndex !== null ? 'Update Bike Brand ' : 'Add Bike Brand '}
                            </Button>
                            <Button variant="secondary" onClick={() => setShowForm(false)} className="rounded-[25px]">
                                Cancel
                            </Button>
                        </Box>
                    </DialogContent>

                </Dialog>
            )}

            <Dialog open={!!selectedbikebrand} onClose={handleCloseModal} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: '25px' } }}
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
                            Bike Brand Details
                        </Typography>
                        <IconButton sx={{ color: 'white' }} onClick={handleCloseModal}>
                            <CloseIcon />
                        </IconButton>
                    </Box>
                    <DialogContent>
                        {selectedbikebrand && (
                            <Box display="flex" flexDirection="column" gap={2}>
                                <Typography className="font-outfit"><strong>Bike Brand :</strong> {selectedbikebrand.brand}</Typography>
                            </Box>
                        )}
                    </DialogContent>
                </Box>
            </Dialog>
        </>
    );
};

export default BikeBrandMaster;
