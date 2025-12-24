import {
    Box,
    Typography,
    IconButton,
    Switch,
    Dialog,
    DialogContent,
    DialogTitle,
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
import { addproducttypeMaster, AddproducttypeMasterPayload, fetchproducttypeMaster, UpdateproducttypeMasterPayload, updateproducttypeMaster, deleteproducttypeMaster, toggleproducttypeMasterStatus } from '../../../../store/Masters/ProducttypeMasterSlice';
import { RootState, AppDispatch } from '../../../../store/store';
import { title } from 'process';

// Type definition
type ProducttypeMaster = {
    id: string;
    product_type: string;
}

const ProducttypeMaster = () => {
    const [newcarbrand, setnewcarbrand] = useState<ProducttypeMaster>({

        id: '',
        product_type: ''
    });
    const [selectedCategory, setSelectedCategory] = useState<ProducttypeMaster | null>(null);

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
    const { producttypeMaster: rawList = [], totalItems } = useSelector((state: RootState) => state.ProducttypeMaster);

    const productypelist = rawList.map(item => ({
        ...item,
        id: item._id,
    }));


    useEffect(() => {
        dispatch(fetchproducttypeMaster({
            search: searchTerm,
            page: pageIndex,
            limit: pageSize,
        }));
    }, [searchTerm, pageIndex, pageSize]);





    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        setnewcarbrand((prev) => ({
            ...prev,
            [name]: value, // clean number input
        }));
    };

    const isFormValid =
        newcarbrand.product_type.trim() !== ""




    const handleAddProducttypeMaster = async () => {
        try {
            const payload: AddproducttypeMasterPayload = {

                product_type: newcarbrand.product_type,
            };

            const result = await dispatch(addproducttypeMaster(payload)).unwrap();

            setAlertType('success');
            setAlertMessage('Product type added successfully.');
            setShowAlert(true);
            setTimeout(() => setShowAlert(false), 3000);
            dispatch(fetchproducttypeMaster({
                search: searchTerm,
                page: pageIndex,
                limit: pageSize,
            })); setShowForm(false);
        } catch (err: any) {
            setAlertType('error');
            setAlertMessage('Failed to addProduct type : ' + err);
            setShowAlert(true);
            setTimeout(() => setShowAlert(false), 3000);

        }
    };


    const handleEdit = async (ProducttypeMaster: any, index: number) => {
        try {
            setnewcarbrand({
                id: ProducttypeMaster._id || '',
                product_type: ProducttypeMaster.product_type || '',

            })
            setEditIndex(index);
            setShowForm(true);
        } catch (err) {
            setAlertType('error');
            setAlertMessage('Unable to fetchProduct type  details for editing.');
            setShowAlert(true);
        }
    };


    const handleUpdateProducttypeMaster = async () => {
        try {
            const payload: UpdateproducttypeMasterPayload = {

                _id: newcarbrand.id,
                product_type: newcarbrand.product_type,

            };
            const result = await dispatch(updateproducttypeMaster(payload)).unwrap();
            setAlertType('success');
            setAlertMessage('Product type updated successfully.');
            setShowAlert(true);
            setTimeout(() => setShowAlert(false), 3000);

            setShowForm(false);
            setEditIndex(null);
            dispatch(fetchproducttypeMaster({
                search: searchTerm,
                page: pageIndex,
                limit: pageSize,
            }));
        } catch (err: any) {
            setAlertType('error');
            setAlertMessage('Failed to updateProduct type : ');
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
            await dispatch(deleteproducttypeMaster(deleteId)).unwrap();
            setAlertType('error');
            setAlertMessage('Product type deleted successfully.');
            setShowAlert(true);
            setTimeout(() => setShowAlert(false), 3000);

            dispatch(fetchproducttypeMaster({
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
            await dispatch(toggleproducttypeMasterStatus({
                _id: toggleUser._id,
                isActive: !toggleUser.isActive
            })).unwrap();

            setAlertType('success');
            setAlertMessage(`Product type ${toggleUser.isActive ? 'deactivated' : 'activated'} successfully.`);
            setShowAlert(true);

            dispatch(fetchproducttypeMaster({ search: searchTerm, page: pageIndex, limit: pageSize }));
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



    const handleView = (ProducttypeMaster: ProducttypeMaster) => {
        setSelectedCategory(ProducttypeMaster);
    };

    const handleCloseModal = () => {
        setSelectedCategory(null);
        setShowForm(false);
    };



    const clickHandler = (searchText: string) => {
        setSearchTerm(searchText);
        setPageIndex(0);
        dispatch(fetchproducttypeMaster({
            search: searchText,
            page: 1,
            limit: pageSize,
        }));
    };





    const ProducttypeMasterColumns: MRT_ColumnDef<any>[] = [
        { accessorKey: 'product_type', header: 'Product Type' },

        {
            header: 'Actions',
            Cell: ({ row }) => {

                return (
                    <Box display="flex" gap={1}>
                        <IconButton color="primary" onClick={() => handleView(row.original)}>
                            <VisibilityIcon />
                        </IconButton>
                        <IconButton color="secondary" onClick={() => handleEdit(row.original, row.index)}>
                            <EditIcon />
                        </IconButton>
                        {!row.original.isOther && (
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
                message={`Are you sure you want to ${toggleUser?.isActive ? 'deactivate' : 'activate'} thisProduct type?`}
                onConfirm={confirmToggle}
                onCancel={cancelToggle}
                confirmText="Yes"
                cancelText="No"
            />

            <SweetAlert
                show={showModal}
                type="error"
                title="Confirm Deletion"
                message="Are you sure you want to delete thisProduct type ?"
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
                           Product type  Management
                        </Typography>
                        </Box>
                        <Button onClick={() => {
                            setnewcarbrand({
                                id: '',
                                product_type: '',

                            });
                            setEditIndex(null);
                            setShowForm(true);
                        }}><AddIcon />Add New Product type </Button>
                    </Box>

                    <DataTable
                        clickHandler={clickHandler}
                        data={productypelist}
                        columns={ProducttypeMasterColumns}
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
                            {editIndex !== null ? 'Edit Product type' : 'Add Product type'}
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
                        <div className="p-4 grid grid-cols-1 md:grid-cols-1 gap-4">
                            <TextField label="Product type " name="product_type" value={newcarbrand.product_type} onChange={handleChange} />
                        </div>

                        <Box display="flex" justifyContent="center" gap={6} mt={4}>
                            <Button

                                onClick={editIndex !== null ? handleUpdateProducttypeMaster : handleAddProducttypeMaster}
                                className="rounded-[25px]"
                                disabled={!isFormValid}
                            >
                                {editIndex !== null ? 'Update Product type ' : 'Add Product type '}
                            </Button>
                            <Button variant="secondary" onClick={() => setShowForm(false)} className="rounded-[25px]">
                                Cancel
                            </Button>
                        </Box>
                    </DialogContent>

                </Dialog>
            )}

            <Dialog open={!!selectedCategory} onClose={handleCloseModal} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: '25px' } }}
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
                           Product type Details
                        </Typography>
                        <IconButton sx={{ color: 'white' }} onClick={handleCloseModal}>
                            <CloseIcon />
                        </IconButton>
                    </Box>
                    <DialogContent>
                        {selectedCategory && (
                            <Box display="flex" flexDirection="column" gap={2}>
                                <Typography className="font-outfit"><strong>Product type:</strong> {selectedCategory.product_type}</Typography>
                            </Box>
                        )}
                    </DialogContent>
                </Box>
            </Dialog>
        </>
    );
};

export default ProducttypeMaster;
