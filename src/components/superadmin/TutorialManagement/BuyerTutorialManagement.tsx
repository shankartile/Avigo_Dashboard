import {
    Box,
    Typography,
    IconButton,
    Switch,
    Dialog,
    DialogContent,
    DialogTitle, Tooltip
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
import { addBuyerTutorialManagement, AddBuyerTutorialManagementPayload, fetchBuyerTutorialManagement, UpdateBuyerTutorialManagementPayload, updateBuyerTutorialManagement, deleteBuyerTutorialManagement, toggleBuyerTutorialManagementStatus } from '../../../store/TutorialManagement/BuyerTutorialManagementSlice';
import { RootState, AppDispatch } from '../../../store/store';
import { title } from 'process';
import FileInput from '../../form/input/FileInput';
import RadioInput from '../../form/input/Radio';
import TextAreaField from '../../form/input/TextArea';
import { validateImage } from '../../../utility/imageValidator';

// Type definition
type BuyerTutorialManagement = {
    id: string;
    isFullImage: boolean;
    thumbnail_image: File | null;
    title: string;
    sub_title: string;
    full_image: File | null;
    description: string;


}

const BuyerTutorialManagement = () => {
    const [newtutorial, setnewtutorial] = useState<BuyerTutorialManagement>({
        id: '',
        isFullImage: false,
        thumbnail_image: null,
        title: '',
        sub_title: '',
        full_image: null,
        description: '',
    });
    const [selectedtutorial, setselectedtutorial] = useState<BuyerTutorialManagement | null>(null);
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
    const [errors, setErrors] = useState({
        description: "",

    });


    const dispatch = useDispatch<AppDispatch>();
    const { BuyerTutorialManagement: rawList = [], totalItems } = useSelector((state: RootState) => state.Buyertutorialmanagement);

    const tutoriallist = rawList.map(item => ({
        ...item,
        id: item._id,
    }));


    useEffect(() => {
        const delayDebounce = setTimeout(() => {

            dispatch(fetchBuyerTutorialManagement({
                search: searchTerm,
                page: pageIndex,
                limit: pageSize,
            }));
        }, 500); // 500ms delay

        return () => clearTimeout(delayDebounce);
    }, [searchTerm, pageIndex, pageSize]);


    const validateField = (name: string, value: string): string => {
        if (name === "description") {
            if (!value.trim()) return `${name} is required`;
            if (!/[a-zA-Z]/.test(value)) return `${name} must contain words, not just numbers`;
            if (value.trim().length < 10) return `${name} should be at least 10 characters long`;
        }
        return "";
    };

    const validateFAQFields = () => {
        const dscriptionError = /[a-zA-Z]/.test(newtutorial.description) && newtutorial.description.trim().length >= 10;
        return dscriptionError;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        setnewtutorial((prev) => ({
            ...prev,
            [name]: value, // clean number input
        }));

    };

    // const isFormValid = validateFAQFields();

    const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        setnewtutorial((prev) => ({ ...prev, [name]: value }));

        // Real-time validation
        setErrors((prev) => ({
            ...prev,
            [name]: validateField(name, value),
        }));
    };



    const isFormValid = newtutorial.isFullImage
        ? newtutorial.full_image !== null
        : newtutorial.title.trim() !== '' &&
        validateFAQFields() &&

        newtutorial.sub_title.trim() !== '' &&
        newtutorial.description.trim() !== '' &&
        newtutorial.thumbnail_image !== null;



    const handleAddBuyerTutorialManagement = async () => {
        if (loading) return; // Prevent multiple submissions

        setLoading(true);

        try {
            const payload: AddBuyerTutorialManagementPayload = {
                isFullImage: newtutorial.isFullImage,
                full_image: newtutorial.full_image,
                thumbnail_image: newtutorial.thumbnail_image,
                title: newtutorial.title,
                sub_title: newtutorial.sub_title,
                description: newtutorial.description
            };

            const result = await dispatch(addBuyerTutorialManagement(payload)).unwrap();

            setAlertType('success');
            setAlertMessage('Tutorial Added successfully.');
            setShowAlert(true);
            setTimeout(() => setShowAlert(false), 3000);
            dispatch(fetchBuyerTutorialManagement({
                search: searchTerm,
                page: pageIndex,
                limit: pageSize,
            })); setShowForm(false);
        } catch (err: any) {
            setAlertType('error');
            setAlertMessage('Failed to add Tutorial : ' + err);
            setShowAlert(true);
            setTimeout(() => setShowAlert(false), 3000);

        }
        finally {
            setLoading(false);
        }
    };


    const handleEdit = async (BuyerTutorialManagement: any, index: number) => {


        try {
            setnewtutorial({
                id: BuyerTutorialManagement._id || '',
                isFullImage: BuyerTutorialManagement.isFullImage ?? false,
                thumbnail_image: BuyerTutorialManagement.thumbnail_image ?? null,
                title: BuyerTutorialManagement.title ?? '',
                sub_title: BuyerTutorialManagement.sub_title ?? '',
                full_image: BuyerTutorialManagement.full_image ?? null,
                description: BuyerTutorialManagement.description ?? '',
            })
            setEditIndex(index);
            setShowForm(true);
        } catch (err) {
            setAlertType('error');
            setAlertMessage('Unable to fetch Tutorial details for editing.');
            setShowAlert(true);
        }
    };


    const handleUpdateBuyerTutorialManagement = async () => {
        if (loading) return; // Prevent multiple submissions

        setLoading(true);


        try {
            const payload: UpdateBuyerTutorialManagementPayload = {
                _id: newtutorial.id,
                isFullImage: newtutorial.isFullImage,
                full_image: newtutorial.full_image,
                thumbnail_image: newtutorial.thumbnail_image,
                title: newtutorial.title,
                sub_title: newtutorial.sub_title,
                description: newtutorial.description
            };


            if (typeof payload.thumbnail_image === 'object' && payload.thumbnail_image instanceof File) {
                // fine, send as is
            } else if (typeof payload.thumbnail_image === 'string') {
                // fine, send as URL string
            }
            const result = await dispatch(updateBuyerTutorialManagement(payload)).unwrap();
            setAlertType('success');
            setAlertMessage('Tutorial updated successfully.');
            setShowAlert(true);
            setTimeout(() => setShowAlert(false), 3000);

            setShowForm(false);
            setEditIndex(null);
            dispatch(fetchBuyerTutorialManagement({
                search: searchTerm,
                page: pageIndex,
                limit: pageSize,
            }));
        } catch (err: any) {
            setAlertType('error');
            setAlertMessage('Failed to update Tutorial : ');
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
            await dispatch(deleteBuyerTutorialManagement(deleteId)).unwrap();
            setAlertType('error');
            setAlertMessage('Tutorial deleted successfully.');
            setShowAlert(true);
            setTimeout(() => setShowAlert(false), 3000);

            dispatch(fetchBuyerTutorialManagement({
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


    const handleView = (BuyerTutorialManagement: BuyerTutorialManagement) => {
        setselectedtutorial(BuyerTutorialManagement);
    };

    const handleCloseModal = () => {
        setselectedtutorial(null);
        setShowForm(false);
    };


    // const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     const file = e.target.files && e.target.files[0];
    //     const name = e.target.name;

    //     if (!file) return;

    //     setnewtutorial((prev) => ({
    //         ...prev,
    //         [name]: file,
    //     }));
    //     setErrorsData(null);
    // };



    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        const name = e.target.name;

        if (!file) return;

        const error = await validateImage(
            file,
            'buyerTutorial',
            name // correct field name string
        );

        if (error) {
            setErrorsData(error);
            return;
        }

        setnewtutorial((prev) => ({
            ...prev,
            [name]: file,
        }));
        setErrorsData(null);
    };


    const clickHandler = (searchText: string) => {
        setSearchTerm(searchText);
        setPageIndex(0);

    };




    const handleToggleClick = (user: { _id: string; isActive: boolean }) => {
        setToggleUser(user);
        setShowToggleModal(true);
    };

    const confirmToggle = async () => {
        if (!toggleUser) return;

        try {
            await dispatch(
                toggleBuyerTutorialManagementStatus({
                    _id: toggleUser._id,
                    isActive: !toggleUser.isActive
                })
            ).unwrap();

            setAlertType('success');
            setAlertMessage(`Tutorial ${toggleUser.isActive ? 'deactivated' : 'activated'} successfully.`);
            setShowAlert(true);
            setTimeout(() => setShowAlert(false), 3000);

            dispatch(fetchBuyerTutorialManagement({
                search: searchTerm,
                page: pageIndex,
                limit: pageSize,
            }));

            setShowToggleModal(false);

        } catch (err: unknown) {
            const error = err as { message: string; code?: string };

            setAlertType('error');
            setAlertMessage(error.message);
            setShowAlert(true);
            setShowToggleModal(false);
            setTimeout(() => setShowAlert(false), 6000);
        }
    };

    const cancelToggle = () => {
        setShowToggleModal(false);
        setToggleUser(null);
    };
    const truncateText = (text?: string, maxLength = 50): string => {
        if (!text) return '';
        return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
    };

    const BuyerTutorialManagementColumns: MRT_ColumnDef<any>[] = [


        {
            accessorFn: (row) => row.title || 'N/A',
            id: 'title',
            header: 'Title',
        },
        {
            accessorFn: (row) => row.sub_title || 'N/A',
            id: 'sub_title',
            header: 'Sub Title',
        },

        { accessorKey: 'description', header: 'Description', Cell: ({ row }) => truncateText(row.original.description || 'N/A', 30) },


        {
            accessorKey: 'isFullImage',
            header: 'Type',
            Cell: ({ cell }) => (
                cell.getValue() ? "Full Image" : "Image with Details"
            )
        },


        {
            header: 'Actions',
            Cell: ({ row }) => {
                const BuyerTutorialManagement = row.original;

                // const handleToggle = async () => {
                //     try {
                //         await dispatch(toggleBuyerTutorialManagementStatus({
                //             _id: BuyerTutorialManagement._id,
                //             isActive: row.original.isActive === true ? false : true,
                //         })).unwrap();

                //         dispatch(fetchBuyerTutorialManagement({
                //             search: searchTerm,
                //             page: pageIndex,
                //             limit: pageSize,
                //         }));
                //     } catch (err: unknown) {
                //         const error = err as { code?: string; message?: string };

                //         console.error("Status update failed", error);

                //         setAlertType('error');
                //         if (error.code === 'MAX_ACTIVE_TUTORIALS_REACHED') {
                //             setAlertMessage('You already have 5 active tutorials. Deactivate one first to activate another.');
                //         } else {
                //             setAlertMessage(error.message || 'Failed to update status.');
                //         }

                //         setShowAlert(true);
                //         setTimeout(() => setShowAlert(false), 6000);
                //     }
                // };

                return (
                    <Box display="flex" gap={1}>
                        <Tooltip title="View Tutorial" arrow>
                        <IconButton color="primary" onClick={() => handleView(row.original)}>
                            <VisibilityIcon />
                        </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit Tutorial" arrow>
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
                message={`Are you sure you want to ${toggleUser?.isActive ? 'deactivate' : 'activate'} this tutorial?`}
                onConfirm={confirmToggle}
                onCancel={cancelToggle}
                confirmText="Yes"
                cancelText="No"


            />

            <SweetAlert
                show={showModal}
                type="error"
                title="Confirm Deletion"
                message="Are you sure you want to delete this Tutorial ?"
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
                        sx={{ position: 'absolute', top: 12, right: 12 }}
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
                                Buyer Tutorial Management  <Tooltip
                                    title="Manage buyer app tutorial screens by adding new tutorials, deactivating old ones, and configuring up to five active images in full-image or image-with-details format."
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
                            setnewtutorial({
                                id: '',
                                isFullImage: false,
                                thumbnail_image: null,
                                title: '',
                                sub_title: '',
                                full_image: null,
                                description: '',
                            });
                            setEditIndex(null);
                            setShowForm(true);
                        }}><AddIcon />Add New Tutorial </Button>
                    </Box>

                    <DataTable
                        clickHandler={clickHandler}
                        data={tutoriallist}
                        columns={BuyerTutorialManagementColumns}
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
                }} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: '25px' } }}
                    BackdropProps={{
                        sx: {
                            backdropFilter: 'blur(4px)',
                            backgroundColor: 'rgba(0, 0, 0, 0.2)'
                        }
                    }}>
                    <Box sx={{ background: 'linear-gradient( #255593 103.05%)', height: 25, p: 4, position: 'relative' }}>
                        <DialogTitle className='font-outfit' sx={{ color: 'white', position: 'absolute', top: 5 }}>
                            {editIndex !== null ? 'Edit Buyer Tutorial' : 'Add Buyer Tutorial'}
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

                            <div className="flex gap-4">
                                <RadioInput
                                    id="fullImage"
                                    name="imageType"
                                    checked={newtutorial.isFullImage === true}
                                    label="Full Image"
                                    value="true"
                                    onChange={(value: string) =>
                                        setnewtutorial(prev => ({ ...prev, isFullImage: value === 'true' }))
                                    }
                                />
                                <RadioInput
                                    id="imageWithDetails"
                                    name="imageType"
                                    checked={newtutorial.isFullImage === false}
                                    label="Image with details"
                                    value="false"
                                    onChange={(value: string) =>
                                        setnewtutorial(prev => ({ ...prev, isFullImage: value === 'true' }))
                                    }
                                />
                            </div>

                            {newtutorial.isFullImage ? (
                                <>
                                    <label className="text-sm text-gray-600 mb-4">
                                        Add Full Image<span className="text-error-500"> *  (Image resolution should be 1440×3040px)</span>
                                    </label>
                                    <FileInput
                                        id="full_image"
                                        name="full_image"
                                        onChange={handleFileChange}
                                    />
                                    {editIndex !== null && newtutorial.full_image && (
                                        <span className="text-xs text-gray-500 mb-1 ms-2">
                                            {typeof newtutorial.full_image === 'string'
                                                ? (newtutorial.full_image as string).split('/').pop()
                                                : newtutorial.full_image?.name}
                                        </span>
                                    )}
                                    {errorsData && (
                                        <span className="text-xs text-error-500">
                                            {errorsData}
                                        </span>
                                    )}
                                </>
                            ) : (
                                <>
                                    <TextField
                                        name="title"
                                        value={newtutorial.title}
                                        label="Title"
                                        onChange={handleChange}
                                    />
                                    <TextField
                                        name="sub_title"
                                        value={newtutorial.sub_title}
                                        label="Sub-Title"
                                        onChange={handleChange}
                                    />
                                    <TextAreaField
                                        label="Description"
                                        name="description"
                                        value={newtutorial.description}
                                        onChange={handleTextAreaChange}
                                        errorMessage={errors.description}
                                    />
                                    <label className="text-sm text-gray-600 mb-4">
                                        Add Thumbnail Image<span className="text-error-500"> * (Image resolution should be 1080×1200px)</span>
                                    </label>
                                    <FileInput
                                        id="thumbnail_image"
                                        name="thumbnail_image"
                                        onChange={handleFileChange}
                                    />
                                    {editIndex !== null && newtutorial.thumbnail_image && (
                                        <span className="text-xs text-gray-500 mb-1 ms-2">
                                            {typeof newtutorial.thumbnail_image === 'string'
                                                ? (newtutorial.thumbnail_image as string).split('/').pop()
                                                : newtutorial.thumbnail_image?.name}
                                        </span>
                                    )}
                                    {errorsData && (
                                        <span className="text-xs text-error-500">
                                            {errorsData}
                                        </span>
                                    )}
                                </>
                            )}

                        </div>

                        <Box display="flex" justifyContent="center" gap={6} mt={4}>
                            <Button
                                onClick={editIndex !== null ? handleUpdateBuyerTutorialManagement : handleAddBuyerTutorialManagement}
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

            <Dialog open={!!selectedtutorial} onClose={handleCloseModal} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: '25px' } }}
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
                            Tutorial Details
                        </Typography>
                        <IconButton sx={{ color: 'white' }} onClick={handleCloseModal}>
                            <CloseIcon />
                        </IconButton>
                    </Box>
                    <DialogContent>
                        {selectedtutorial && (
                            <Box display="flex" flexDirection="column" gap={2}>
                                {selectedtutorial.isFullImage ? (
                                    <>
                                        <Typography className="font-outfit" display="flex" alignItems="center" gap={1}>
                                            <strong>Full Image:</strong>
                                            {selectedtutorial.full_image && (
                                                <IconButton
                                                    onClick={() => {
                                                        const src =
                                                            typeof selectedtutorial.full_image === 'string'
                                                                ? selectedtutorial.full_image
                                                                : (selectedtutorial.full_image
                                                                    ? URL.createObjectURL(selectedtutorial.full_image)
                                                                    : '');
                                                        setPreviewUrl(src);
                                                        setPreviewOpen(true);
                                                    }}
                                                >
                                                    <PreviewIcon color="primary" />
                                                </IconButton>
                                            )}
                                        </Typography>


                                    </>
                                ) : (
                                    <>
                                        <Typography className="font-outfit"><strong>Title:</strong> {selectedtutorial.title}</Typography>
                                        <Typography className="font-outfit"><strong>Sub Title:</strong> {selectedtutorial.sub_title}</Typography>
                                        <Typography className="font-outfit"><strong>Description:</strong> {selectedtutorial.description}</Typography>
                                        <Box display="flex" alignItems="center" gap={1}>
                                            <Typography className="font-outfit"><strong>Thumbnail Image:</strong></Typography>
                                            {selectedtutorial.thumbnail_image && (
                                                <IconButton
                                                    onClick={() => {
                                                        const src =
                                                            typeof selectedtutorial.thumbnail_image === 'string'
                                                                ? selectedtutorial.thumbnail_image
                                                                : (selectedtutorial.thumbnail_image
                                                                    ? URL.createObjectURL(selectedtutorial.thumbnail_image)
                                                                    : '');
                                                        setPreviewUrl(src);
                                                        setPreviewOpen(true);
                                                    }}
                                                >
                                                    <PreviewIcon color="primary" />
                                                </IconButton>
                                            )}
                                        </Box>
                                    </>
                                )}
                            </Box>
                        )}
                    </DialogContent>


                </Box>
            </Dialog>
        </>
    );
};

export default BuyerTutorialManagement;
