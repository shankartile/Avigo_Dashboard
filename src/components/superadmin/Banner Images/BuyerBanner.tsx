import {
    Box,
    Typography,
    IconButton,
    Switch,
    Dialog,
    DialogContent,
    DialogTitle,
    Avatar,
    Tooltip
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import PreviewIcon from '@mui/icons-material/Preview';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import { MRT_ColumnDef } from 'material-react-table';
import { useEffect, useState } from 'react';
import TextField from '../../form/input/InputField';
import Button from '../../ui/button/Button';
import DataTable from '../../tables/DataTable';
import ToggleSwitch from '../../ui/toggleswitch/ToggleSwitch';
import Alert from '../../ui/alert/Alert';
import SweetAlert from '../../ui/alert/SweetAlert';
import { useDispatch, useSelector } from 'react-redux';
import { addBuyerBannerImage, AddBuyerBannerImagePayload, fetchBuyerBannerImage, updateBuyerBannerImage, UpdateBuyerBannerImagePayload, deleteBuyerBannerImage, toggleBuyerBannerImageStatus } from '../../../store/BannerImages/BuyerBannerImageSlice';
import { RootState, AppDispatch } from '../../../store/store';
import { title } from 'process';
import FileInput from '../../form/input/FileInput';
import { validateImage } from '../../../utility/imageValidator';

// Type definition
type BuyerBanner = {
    id: string;
    image: File | null;



}

const BuyerBanner = () => {
    const [newBuyerbanner, setnewBuyerbanner] = useState<BuyerBanner>({
        id: '',
        image: null,

    });
    const [selectedBuyerbanner, setselectedBuyerbanner] = useState<BuyerBanner | null>(null);
    const [errorsData, setErrorsData] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [editIndex, setEditIndex] = useState<number | null>(null);
    const [alertType, setAlertType] = useState<'success' | 'error' | 'warning' | 'info' | null>(null);
    const [alertMessage, setAlertMessage] = useState('');
    const [showAlert, setShowAlert] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [pageIndex, setPageIndex] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [toggleUser, setToggleUser] = useState<{ _id: string; isActive: boolean } | null>(null);
    const [showToggleModal, setShowToggleModal] = useState(false);

    const dispatch = useDispatch<AppDispatch>();
    const { BuyerBannerImage: rawList = [], totalItems } = useSelector((state: RootState) => state.BuyerBanner);

    const bannerlist = rawList.map(item => ({
        ...item,
        id: item._id,
    }));


    useEffect(() => {
        dispatch(fetchBuyerBannerImage({
            search: searchTerm,
            page: pageIndex,
            limit: pageSize,
        }));
    }, [searchTerm, pageIndex, pageSize]);




    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        setnewBuyerbanner((prev) => ({
            ...prev,
            [name]: value, // clean number input
        }));
    };




    const isFormValid =
        newBuyerbanner.image !== null



    const handleAddBuyerBanner = async () => {

        if (loading) return; // Prevent multiple submissions

        setLoading(true);


        try {
            const payload: AddBuyerBannerImagePayload = {

                image: newBuyerbanner.image,

            };

            const result = await dispatch(addBuyerBannerImage(payload)).unwrap();

            setAlertType('success');
            setAlertMessage('Buyer banner Added successfully.');
            setShowAlert(true);
            setTimeout(() => setShowAlert(false), 3000);
            dispatch(fetchBuyerBannerImage({
                search: searchTerm,
                page: pageIndex,
                limit: pageSize,
            })); setShowForm(false);
        } catch (err: any) {
            setAlertType('error');
            setAlertMessage('Failed to add Buyer banner : ' + err);
            setShowAlert(true);
            setTimeout(() => setShowAlert(false), 3000);

        }
        finally {
            setLoading(false);
        }
    };


    const handleEdit = async (BuyerBanner: any, index: number) => {
        try {
            setnewBuyerbanner({
                id: BuyerBanner._id || '',
                image: BuyerBanner.image ?? null,

            })
            setEditIndex(index);
            setShowForm(true);
        } catch (err) {
            setAlertType('error');
            setAlertMessage('Unable to fetch Buyer banner details for editing.');
            setShowAlert(true);
        }
    };


    const handleUpdateBuyerBanner = async () => {
        if (loading) return; // Prevent multiple submissions

        setLoading(true);


        try {
            const payload: UpdateBuyerBannerImagePayload = {
                _id: newBuyerbanner.id,
                image: newBuyerbanner.image,

            };


            if (typeof payload.image === 'object' && payload.image instanceof File) {
                // fine, send as is
            } else if (typeof payload.image === 'string') {
                // fine, send as URL string
            }
            const result = await dispatch(updateBuyerBannerImage(payload)).unwrap();
            setAlertType('success');
            setAlertMessage('Buyer banner updated successfully.');
            setShowAlert(true);
            setTimeout(() => setShowAlert(false), 3000);

            setShowForm(false);
            setEditIndex(null);
            dispatch(fetchBuyerBannerImage({
                search: searchTerm,
                page: pageIndex,
                limit: pageSize,
            }));
        } catch (err: any) {
            setAlertType('error');
            setAlertMessage('Failed to update Buyer banner : ');
            setShowAlert(true);
            setTimeout(() => setShowAlert(false), 3000);

        }
        finally {
            setLoading(false);
        }
    };


    const requestDelete = (id: string) => {
        setDeleteId(id);
        setShowModal(true);
    };

    const confirmDelete = async () => {
        if (!deleteId) return;

        try {
            await dispatch(deleteBuyerBannerImage(deleteId)).unwrap();
            setAlertType('error');
            setAlertMessage('Buyer banner deleted successfully.');
            setShowAlert(true);
            setTimeout(() => setShowAlert(false), 3000);

            dispatch(fetchBuyerBannerImage({
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


    const handleView = (BuyerBanner: BuyerBanner) => {
        const imageSrc = typeof BuyerBanner.image === 'string'
            ? BuyerBanner.image
            : BuyerBanner.image
                ? URL.createObjectURL(BuyerBanner.image)
                : null;

        setPreviewUrl(imageSrc);
        setselectedBuyerbanner(BuyerBanner);
    };

    const handleCloseModal = () => {
        setselectedBuyerbanner(null);
        setPreviewUrl(null);
        setShowForm(false);
    };


    // const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     const file = e.target.files && e.target.files[0];
    //     const name = e.target.name;

    //     if (!file) return;

    //     setnewBuyerbanner((prev) => ({
    //         ...prev,
    //         [name]: file,
    //     }));

    //     setErrorsData(null);
    // };


    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        const name = e.target.name;

        if (!file) return;

        const error = await validateImage(file, 'buyerBanner', name);

        if (error) {
            setErrorsData(error);
            return;
        }

        setnewBuyerbanner((prev) => ({
            ...prev,
            [name]: file,
        }));

        setErrorsData(null);
    };

    const clickHandler = (searchText: string) => {
        setSearchTerm(searchText);
        setPageIndex(0);
        dispatch(fetchBuyerBannerImage({
            search: searchText,
            page: 1,
            limit: pageSize,
        }));
    };




    const handleToggleClick = (user: { _id: string; isActive: boolean }) => {
        setToggleUser(user);
        setShowToggleModal(true);
    };

    const confirmToggle = async () => {
        if (!toggleUser) return;

        try {
            await dispatch(toggleBuyerBannerImageStatus({
                _id: toggleUser._id,
                isActive: !toggleUser.isActive
            })).unwrap();

            setAlertType('success');
            setAlertMessage(`Banner ${toggleUser.isActive ? 'deactivated' : 'activated'} successfully.`);
            setShowAlert(true);

            dispatch(fetchBuyerBannerImage({ search: searchTerm, page: pageIndex, limit: pageSize }));
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


    const BuyerBannerColumns: MRT_ColumnDef<any>[] = [

        {
            header: 'Image',
            accessorFn: (row) => row.image || 'N/A',
            Cell: ({ row }) => (
                <img
                    src={row.original.image}
                    alt="Banner"
                    style={{ width: 100, height: 60, objectFit: 'cover', borderRadius: 8 }}
                />
            ),
        },


        {
            header: 'Actions',
            Cell: ({ row }) => {
                const BuyerBanner = row.original;


                return (
                    <Box display="flex" gap={1}>
                        <Tooltip title="Preview Image" arrow>
                            <IconButton color="primary" onClick={() => handleView(row.original)}>
                                <VisibilityIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit Banner" arrow>
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
            }
        }
    ];

    return (
        <>

            <SweetAlert
                show={showToggleModal}
                type="warning"
                title="Confirm Status Change"
                message={`Are you sure you want to ${toggleUser?.isActive ? 'deactivate' : 'activate'} this banner?`}
                onConfirm={confirmToggle}
                onCancel={cancelToggle}
                confirmText="Yes"
                cancelText="No"
            />

            <SweetAlert
                show={showModal}
                type="error"
                title="Confirm Deletion"
                message="Are you sure you want to delete this Buyerbanner ?"
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
                        sx={{ position: 'absolute', top: 12, right: 12, color: 'white' }}
                        onClick={() => setPreviewOpen(false)}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogContent>
            </Dialog>


            {!showForm ? (
                <>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                        <Box ml={2}>

                            <Typography
                                variant="h5"
                                fontWeight={500}

                                className='font-outfit'
                            >
                                Buyer Banner Images    <Tooltip
                                    title="Manage banner images for the Buyer App, including adding new and updating existing banners."
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
                        <Button onClick={() => {
                            setnewBuyerbanner({
                                id: '',
                                image: null,

                            });
                            setEditIndex(null);
                            setShowForm(true);
                        }}><AddIcon />Add New Banner </Button>
                    </Box>

                    <DataTable
                        clickHandler={clickHandler}
                        data={bannerlist}
                        columns={BuyerBannerColumns}
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
                            {editIndex !== null ? 'Edit Banner' : 'Add Banner'}
                        </DialogTitle>
                        <IconButton sx={{ position: 'absolute', top: 12, right: 12, color: 'white' }} onClick={() => {
                            setShowForm(false);
                            setErrorsData(null);
                        }}><CloseIcon /></IconButton>
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


                            <label className="text-sm text-gray-600 mb-4">
                                Add Banner Image<span className="text-error-500"> * (Image resolution should be 1440×540px) </span>
                            </label>
                            <FileInput
                                id="image"
                                name="image"
                                onChange={handleFileChange}
                            />
                            {editIndex !== null && newBuyerbanner.image && (
                                <span className="text-xs text-gray-500 mb-1 ms-2">
                                    {typeof newBuyerbanner.image === 'string'
                                        ? (newBuyerbanner.image as string).split('/').pop()
                                        : newBuyerbanner.image?.name}
                                </span>
                            )}
                            {errorsData && (
                                <span className="text-xs text-error-500">
                                    {errorsData}
                                </span>
                            )}


                        </div>

                        <Box display="flex" justifyContent="center" gap={6} mt={4}>
                            <Button
                                onClick={editIndex !== null ? handleUpdateBuyerBanner : handleAddBuyerBanner}
                                className="rounded-[25px]"
                                disabled={!isFormValid || loading}
                            >
                                {loading ? (editIndex !== null ? 'Updating...' : 'Submitting...') : (editIndex !== null ? 'Update' : 'Submit')}
                            </Button>
                            <Button variant="secondary" onClick={() => {
                                setShowForm(false);
                                setErrorsData(null);
                            }} className="rounded-[25px]">
                                Cancel
                            </Button>
                        </Box>
                    </DialogContent>

                </Dialog>
            )}



            <Dialog open={!!selectedBuyerbanner} onClose={handleCloseModal} maxWidth="sm" fullWidth>
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
                        onClick={handleCloseModal}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogContent>
            </Dialog>

        </>
    );
};

export default BuyerBanner;
