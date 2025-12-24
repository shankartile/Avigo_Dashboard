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
import { fetchCarBrandMaster, addCarNameMaster, AddCarNameMasterPayload, fetchCarNameMaster, UpdateCarNameMasterPayload, updateCarNameMaster, deleteCarNameMaster, toggleCarNameMasterStatus } from '../../../../store/Masters/CarNameMasterSlice';
import { RootState, AppDispatch } from '../../../../store/store';


// Type definition
type CarNameMaster = {
    car_brand_id?: string;
    car_brand_name?: string
    id: string;
    car_name: string;
}

const CarNameMaster = () => {
    const [newCarName, setnewCarName] = useState<CarNameMaster>({
        car_brand_id: '',
        car_brand_name: '',
        id: '',
        car_name: ''
    });
    const [selectedcarname, setselectedcarname] = useState<CarNameMaster | null>(null);

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
    const { CarNameMaster: rawList = [], totalItems } = useSelector((state: RootState) => state.CarNameMaster);

    const stateList = rawList.map(item => ({
        ...item,
        id: item._id,
    }));

    const { CarBrandMaster } = useSelector((state: RootState) => state.CarBrandMaster);


    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            dispatch(fetchCarNameMaster({
                search: searchTerm,
                page: pageIndex,
                limit: pageSize,
            }));
        }, 500); // 500ms delay

        return () => clearTimeout(delayDebounce);
    }, [searchTerm, pageIndex, pageSize]);


    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            dispatch(fetchCarBrandMaster({
                search: searchTerm,
                page: pageIndex,
                limit: pageSize,
            }));
        }, 500); // 500ms delay

        return () => clearTimeout(delayDebounce);
    }, [searchTerm, pageIndex, pageSize]);




    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        setnewCarName((prev) => ({
            ...prev,
            [name]: value, // clean number input
        }));
    };

    const isFormValid =
        newCarName.car_name.trim() !== ""




    const handleAddCarNameMaster = async () => {
        try {
            const selectedCarBrand = CarBrandMaster.find(c => c._id === newCarName.car_brand_id);

            const payload: AddCarNameMasterPayload = {
                car_brand_id: newCarName.car_brand_id || "",
                car_brand_name: selectedCarBrand?.car_brand_name || "",
                car_name: newCarName.car_name,
            };

            const result = await dispatch(addCarNameMaster(payload)).unwrap();

            setAlertType('success');
            setAlertMessage('Car Name Added successfully.');
            setShowAlert(true);
            setTimeout(() => setShowAlert(false), 3000);
            dispatch(fetchCarNameMaster({
                search: searchTerm,
                page: pageIndex,
                limit: pageSize,
            })); setShowForm(false);
        } catch (err: any) {
            setAlertType('error');
            setAlertMessage('Failed to add Car Name: ' + err);
            setShowAlert(true);
            setTimeout(() => setShowAlert(false), 3000);

        }
    };


    const handleEdit = async (CarNameMaster: any, index: number) => {
        try {

            setnewCarName({
                id: CarNameMaster._id || '',
                car_brand_id: CarNameMaster.car_brand_id || '',
                car_brand_name: CarNameMaster.car_brand_name || '',
                car_name: CarNameMaster.car_name || '',

            })
            setEditIndex(index);
            setShowForm(true);
        } catch (err) {
            setAlertType('error');
            setAlertMessage('Unable to fetch Car Name details for editing.');
            setShowAlert(true);
        }
    };


    const handleUpdateCarNameMaster = async () => {
        try {
            const payload: UpdateCarNameMasterPayload = {

                _id: newCarName.id,
                car_brand_id: newCarName.car_brand_id || "",
                car_name: newCarName.car_name,

            };
            const result = await dispatch(updateCarNameMaster(payload)).unwrap();
            setAlertType('success');
            setAlertMessage('Car Name updated successfully.');
            setShowAlert(true);
            setTimeout(() => setShowAlert(false), 3000);

            setShowForm(false);
            setEditIndex(null);
            dispatch(fetchCarNameMaster({
                search: searchTerm,
                page: pageIndex,
                limit: pageSize,
            }));
        } catch (err: any) {
            setAlertType('error');
            setAlertMessage('Failed to update Car Name: ');
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
            await dispatch(deleteCarNameMaster(deleteId)).unwrap();
            setAlertType('error');
            setAlertMessage('Car Name deleted successfully.');
            setShowAlert(true);
            setTimeout(() => setShowAlert(false), 3000);

            dispatch(fetchCarNameMaster({
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
            await dispatch(toggleCarNameMasterStatus({
                _id: toggleUser._id,
                isActive: !toggleUser.isActive
            })).unwrap();

            setAlertType('success');
            setAlertMessage(`User ${toggleUser.isActive ? 'deactivated' : 'activated'} successfully.`);
            setShowAlert(true);

            dispatch(fetchCarNameMaster({ search: searchTerm, page: pageIndex, limit: pageSize }));
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


    const handleView = (CarNameMaster: CarNameMaster) => {
        setselectedcarname(CarNameMaster);
    };

    const handleCloseModal = () => {
        setselectedcarname(null);
        setShowForm(false);
    };



    const clickHandler = (searchText: string) => {
        setSearchTerm(searchText);
        setPageIndex(0);
        // dispatch(fetchCarNameMaster({
        //     search: searchText,
        //     page: 0,
        //     limit: pageSize,
        // }));
    };





    const CarNameMasterColumns: MRT_ColumnDef<any>[] = [
        { accessorKey: 'car_name', header: 'Car Name' },

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
                            </Tooltip>

                        )}

                        {!row.original.isOthers && (
                            <IconButton color="error" onClick={() => requestDelete(row.original._id)}>
                                <DeleteIcon />
                            </IconButton>
                        )}

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
                message={`Are you sure you want to ${toggleUser?.isActive ? 'deactivate' : 'activate'} this Car Name?`}
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
                                Car Name Management
                            </Typography></Box>
                        <Button onClick={() => {
                            setnewCarName({
                                id: '',
                                car_name: '',

                            });
                            setEditIndex(null);
                            setShowForm(true);
                        }}><AddIcon />Add New Car Name</Button>
                    </Box>

                    <DataTable
                        clickHandler={clickHandler}
                        data={stateList}
                        columns={CarNameMasterColumns}
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
                            {editIndex !== null ? 'Edit Car Name' : 'Add Car Name'}
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
                                <label className="text-sm text-gray-600 dark:text-white mb-1 block">Car Brand <span className="text-error-500"> * </span>
                                </label>

                                <select
                                    name="car_brand_id"
                                    value={newCarName.car_brand_id}
                                    onChange={handleChange}
                                    className="mt-1 p-2 border rounded"
                                >
                                    <option value="">Select Car Brand</option>
                                    {CarBrandMaster?.filter((c) => c.isActive).map((car_brand) => (
                                        <option key={car_brand._id} value={car_brand._id}>
                                            {car_brand.car_brand_name}
                                        </option>
                                    ))}
                                </select>


                            </div>
                            <TextField label="Car Name" name="car_name" value={newCarName.car_name} onChange={handleChange} />
                        </div>

                        <Box display="flex" justifyContent="center" gap={6} mt={4}>
                            <Button

                                onClick={editIndex !== null ? handleUpdateCarNameMaster : handleAddCarNameMaster}
                                className="rounded-[25px]"
                                disabled={!isFormValid}
                            >
                                {editIndex !== null ? 'Update Car Name' : 'Add Car Name'}
                            </Button>
                            <Button variant="secondary" onClick={() => setShowForm(false)} className="rounded-[25px]">
                                Cancel
                            </Button>
                        </Box>
                    </DialogContent>

                </Dialog>
            )}

            <Dialog open={!!selectedcarname} onClose={handleCloseModal} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: '25px' } }}
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
                            Car Name Details
                        </Typography>
                        <IconButton sx={{ color: 'white' }} onClick={handleCloseModal}>
                            <CloseIcon />
                        </IconButton>
                    </Box>
                    <DialogContent>
                        {selectedcarname && (
                            <Box display="flex" flexDirection="column" gap={2}>
                                <Typography className="font-outfit"><strong>Car Brand:</strong> {selectedcarname.car_brand_name}</Typography>

                                <Typography className="font-outfit"><strong>Car Name:</strong> {selectedcarname.car_name}</Typography>

                            </Box>
                        )}
                    </DialogContent>
                </Box>
            </Dialog>
        </>
    );
};

export default CarNameMaster;
