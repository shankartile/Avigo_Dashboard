import React, { useRef, useState, useEffect } from 'react';
import {
    Box,
    Typography,
    IconButton,
    Tabs,
    Tab,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Tooltip,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import TextField from '../../form/input/InputField';
import Button from '../../ui/button/Button';
import Alert from '../../ui/alert/Alert';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../../store/store';
import { updateBikeListing, fetchProductListing, fetchBiketype, fetchBikeBrandMaster, fetchBikeNameMaster, fetchBikeFueltypeMaster, fetchBikeYearMaster, fetchBikeColorMaster, fetchBikeOwnershipMaster, fetchCityMaster } from '../../../store/ProductListing/ProductListingSlice';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/store';
import FileInput from '../../form/input/FileInput';
import { fetchProductListingbyId, updateBikeImage } from '../../../store/ProductListing/ProductListingSlice';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';


type ProductType = 'car' | 'bike' | 'sparepart';

interface BikeUpdateFormProps {
    onCancel: () => void;
    editData?: any;
    isEditMode?: boolean;
}

const BikeUpdateForm: React.FC<BikeUpdateFormProps> = ({ onCancel, editData, isEditMode = false }) => {
    const [activeTab, setActiveTab] = useState(0);
    const [formData, setFormData] = useState<any>({ ...editData });
    const [alertMessage, setAlertMessage] = useState('');
    const [alertType, setAlertType] = useState<'success' | 'error' | 'warning' | 'info' | null>(null);
    const [showAlert, setShowAlert] = useState(false);
    const [fileName, setFileName] = useState('');
    const [editingImageId, setEditingImageId] = useState<string | null>(null);
    const [editingSequence, setEditingSequence] = useState<number | null>(null);
    const [editingFile, setEditingFile] = useState<File | null>(null);
    const [filtertype, setFiltertype] = useState<ProductType>('bike');
    const [showSkeleton, setShowSkeleton] = useState(true);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setShowSkeleton(false), 1000);
        return () => clearTimeout(timer);
    }, []);


    const inputRef = useRef<HTMLInputElement>(null);

    const dispatch = useDispatch<AppDispatch>();
    const { BikeBrandMaster } = useSelector((state: RootState) => state.BikeBrandMaster);
    const { BikeNameMaster } = useSelector((state: RootState) => state.BikeNameMaster);
    const { BikeFueltypeMaster } = useSelector((state: RootState) => state.BikeFueltypeMaster);
    const { BikeYearMaster } = useSelector((state: RootState) => state.BikeYearMaster);
    const { BikeColorMaster } = useSelector((state: RootState) => state.BikeColorMaster);
    const { BikeOwnershipMaster } = useSelector((state: RootState) => state.BikeOwnershipMaster);
    const { CityMaster } = useSelector((state: RootState) => state.CityMaster);
    const { BikeTypeMaster } = useSelector((state: RootState) => state.BikeTypeMaster);


    useEffect(() => {
        dispatch(fetchCityMaster({
        }));
        dispatch(fetchBikeFueltypeMaster({
        }));
        dispatch(fetchBikeYearMaster({
        }));
        dispatch(fetchBikeColorMaster({
        }));
        dispatch(fetchBikeOwnershipMaster({
        }));
        dispatch(fetchBikeBrandMaster({
        }));
        dispatch(fetchBikeNameMaster({
        }));
        dispatch(fetchBiketype({
        }));
    }, [dispatch]);


    const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => setActiveTab(newValue);


    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev: any) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (loading) return; // Prevent multiple submissions

        setLoading(true);
        try {
            await dispatch(updateBikeListing({ _id: formData._id, ...formData })).unwrap();

            setAlertType('success');
            setAlertMessage('Bike details updated successfully.');
            setShowAlert(true);
            setTimeout(() => {
                setShowAlert(false);
                onCancel();
                dispatch(fetchProductListing({ search: '', page: 0, limit: 10, type: filtertype, }));
            }, 3000);
        } catch (error: any) {
            setAlertType('error');
            setAlertMessage(error.message || 'Failed to update');
            setShowAlert(true);
            setTimeout(() => setShowAlert(false), 3000);
        }
        finally {
            setLoading(false);
        }
    };

    const handleImagePreview = (url: string) => window.open(url, '_blank');

    const handleImageDelete = async (_id: string) => {
        try {
            await dispatch(updateBikeImage({
                bikeId: formData._id,
                mode: 'remove',
                remove_image_ids: [_id],
            })).unwrap();

            // Refetch updated Bike images
            const updatedBike = await dispatch(fetchProductListingbyId({ _id: formData._id, type: formData.type })).unwrap();

            setFormData((prev: any) => ({
                ...prev,
                bike_images: updatedBike.images || [],
            }));

            setAlertType('success');
            setAlertMessage('Image deleted successfully');
            setShowAlert(true);
        } catch (error) {
            console.error('Delete failed:', error);
            setAlertType('error');
            setAlertMessage('Failed to delete image');
            setShowAlert(true);
        }
    };

    const handleImageEdit = (img: any) => {
        setEditingImageId(img._id);
        setEditingSequence(img.sequence);
        setEditingFile(null); // reset any previously selected file
    };

    const handleImageUpdate = async () => {
        if (!editingImageId || !editingFile) return;

        try {
            const imageToUpdate = formData.bike_images.find((img: any) => img._id === editingImageId);

            await dispatch(updateBikeImage({
                bikeId: formData._id,
                file: editingFile,
                mode: 'update_at_sequence',
                sequence: imageToUpdate?.sequence,
            })).unwrap();

            // Refresh listing data
            const updatedBike = await dispatch(fetchProductListingbyId({ _id: formData._id, type: formData.type })).unwrap();

            setFormData((prev: any) => ({
                ...prev,
                bike_images: updatedBike.images || [],
            }));

            setEditingImageId(null);
            setEditingFile(null);
            setEditingSequence(null);
            setAlertType('success');
            setAlertMessage('Image updated successfully');
            setShowAlert(true);
        } catch (error) {
            setAlertType('error');
            setAlertMessage('Failed to update image');
            setShowAlert(true);
        }
    };

    // console.log('Selected Fuel ID:', formData.fuel_type_id);
    // console.log('Dropdown Fuel Types:', BikeFueltypeMaster?.map(f => f._id));


    const BikeFormSkeleton = () => (
        <div className="max-w-8xl mx-auto rounded-xl shadow-md bg-white mb-6 p-6">
            <Skeleton height={60} width="100%" className="mb-4" />
            <Skeleton height={40} width="100%" className="mb-4" />

            {/* Fields Skeleton */}
            <div className="grid grid-cols-2 gap-4 mb-6">
                {Array.from({ length: 10 }).map((_, i) => (
                    <Skeleton key={i} height={56} />
                ))}
            </div>

            <Skeleton height={120} className="mb-6" />

            <div className="flex justify-center gap-4">
                <Skeleton height={40} width={100} />
                <Skeleton height={40} width={100} />
            </div>
        </div>
    );

    if (showSkeleton) return <BikeFormSkeleton />;


    return (
        <>
            {showAlert && alertType && (
                <div className="p-4">
                    <Alert
                        type={alertType}
                        title={alertType === 'success' ? 'Success!' : 'Error!'}
                        message={alertMessage}
                        variant="filled"
                        showLink={false}
                        linkHref=""
                        linkText=""
                        onClose={() => setShowAlert(false)}
                    />
                </div>
            )}

            <Box className="max-w-8xl mx-auto rounded-xl shadow-md mb-6" sx={{ backgroundColor: 'white' }}>
                <Box sx={{
                    background: 'linear-gradient( #255593 103.05%)',
                    height: 60,
                    px: 4,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderTopLeftRadius: 12,
                    borderTopRightRadius: 12,
                    color: 'white',
                }}>
                    <Typography className="font-outfit" variant="h6">
                        {isEditMode ? 'Update Bike Listing' : 'Add New Bike'}
                    </Typography>
                    <IconButton sx={{ color: 'white' }} onClick={onCancel}><CloseIcon /></IconButton>
                </Box>

                <Tabs value={activeTab} onChange={handleTabChange} variant="fullWidth">
                    <Tab label="Bike Details" className='font-outfit' />
                    <Tab label="Bike Images" className='font-outfit' />
                </Tabs>

                <Box component="form" onSubmit={handleSubmit} px={6} py={4}>
                    {activeTab === 0 && (
                        <>
                            <div className="grid grid-cols-2 gap-4">

                                <div className="flex flex-col">
                                    <label className="text-sm text-gray-600 dark:text-white block">
                                        Bike Type <span className="text-error-500"> * </span>
                                    </label>
                                    <select
                                        name="bike_type_id"
                                        value={formData.bike_type_id}
                                        onChange={handleChange}
                                        className="mt-1 p-2 border rounded"
                                    >
                                        <option value="">Select Bike Type</option>
                                        {BikeTypeMaster?.filter((c) => c.isActive).map((bike_type) => (
                                            <option key={bike_type._id} value={bike_type._id}>
                                                {bike_type.bike_type}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Bike Brand */}
                                <div className="flex flex-col">
                                    <label className="text-sm text-gray-600 dark:text-white block">
                                        Bike Brand <span className="text-error-500"> * </span>
                                    </label>
                                    <select
                                        name="brand_id"
                                        value={formData.brand_id}
                                        onChange={handleChange}
                                        className="mt-1 p-2 border rounded"
                                    >
                                        <option value="">Select Bike Brand</option>
                                        {BikeBrandMaster?.filter(
                                            (brand) =>
                                                brand.isActive &&
                                                (!formData.bike_type_id || brand.bike_type_id === formData.bike_type_id)
                                        ).map((bike_brand) => (
                                            <option key={bike_brand._id} value={bike_brand._id}>
                                                {bike_brand.brand}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Bike Name */}
                                <div className="flex flex-col">
                                    <label className="text-sm text-gray-600 dark:text-white block">
                                        Bike Name <span className="text-error-500"> * </span>
                                    </label>
                                    <select
                                        name="bike_id"
                                        value={formData.bike_id}
                                        onChange={handleChange}
                                        className="mt-1 p-2 border rounded"
                                    >
                                        <option value="">Select Bike Name</option>
                                        {BikeNameMaster?.filter(
                                            (bike) =>
                                                bike.isActive &&
                                                (!formData.bike_type_id || bike.bike_type_id === formData.bike_type_id) &&
                                                (!formData.brand_id || bike.bike_brand_id === formData.brand_id)
                                        ).map((bike_name) => (
                                            <option key={bike_name._id} value={bike_name._id}>
                                                {bike_name.bikename}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="flex flex-col">
                                    <label className="text-sm text-gray-600 dark:text-white  block">Fuel Type <span className="text-error-500"> * </span>
                                    </label>

                                    <select
                                        name="fuel_type_id"
                                        value={formData.fuel_type_id}
                                        onChange={handleChange}
                                        className="mt-1 p-2 border rounded"
                                    >
                                        <option value="">Select Fuel Type</option>
                                        {BikeFueltypeMaster?.filter((c) => c.isActive).map((fuel_type) => (
                                            <option key={fuel_type._id} value={fuel_type._id}>
                                                {fuel_type.fueltype}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="flex flex-col">
                                    <label className="text-sm text-gray-600 dark:text-white  block">Bike Color <span className="text-error-500"> * </span>
                                    </label>

                                    <select
                                        name="color_id"
                                        value={formData.color_id}
                                        onChange={handleChange}
                                        className="mt-1 p-2 border rounded"
                                    >
                                        <option value="">Select Bike Color</option>
                                        {BikeColorMaster?.filter((c) => c.isActive).map((color_name) => (
                                            <option key={color_name._id} value={color_name._id}>
                                                {color_name.bike_color_name}
                                            </option>
                                        ))}
                                    </select>
                                </div>



                                <div className="flex flex-col">
                                    <label className="text-sm text-gray-600 dark:text-white  block">Ownership type <span className="text-error-500"> * </span>
                                    </label>

                                    <select
                                        name="ownership_id"
                                        value={formData.ownership_id}
                                        onChange={handleChange}
                                        className="mt-1 p-2 border rounded"
                                    >
                                        <option value="">Select Ownership</option>
                                        {BikeOwnershipMaster?.filter((c) => c.isActive).map((ownership) => (
                                            <option key={ownership._id} value={ownership._id}>
                                                {ownership.ownership}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="flex flex-col">
                                    <label className="text-sm text-gray-600 dark:text-white  block">City <span className="text-error-500"> * </span>
                                    </label>

                                    <select
                                        name="city_id"
                                        value={formData.city_id}
                                        onChange={handleChange}
                                        className="mt-1 p-2 border rounded"
                                    >
                                        <option value="">Select City</option>
                                        {CityMaster?.filter((c) => c.isActive).map((city_name) => (
                                            <option key={city_name._id} value={city_name._id}>
                                                {city_name.city_name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="flex flex-col">
                                    <label className="text-sm text-gray-600 dark:text-white  block">Bike Year <span className="text-error-500"> * </span>
                                    </label>

                                    <select
                                        name="year_id"
                                        value={formData.year_id}
                                        onChange={handleChange}
                                        className="mt-1 p-2 border rounded"
                                    >
                                        <option value="">Select Bike Year</option>
                                        {BikeYearMaster?.filter((c) => c.isActive).map((Bike_year) => (
                                            <option key={Bike_year._id} value={Bike_year._id}>
                                                {Bike_year.year}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <TextField label="Model Name" name="model_name" value={formData.model_name} onChange={handleChange} />
                                <TextField label="Kilometers Driven" name="kilometers_driven" value={formData.kilometers_driven} onChange={handleChange} />
                                <TextField label="Price" name="price" value={formData.price} onChange={handleChange} />
                            </div>

                            <Box width="100%" mt={3}>
                                <Box display="flex" justifyContent="center" gap={2} flexDirection="row">
                                    <Button
                                        className="font-outfit"
                                        disabled={loading}
                                    >
                                        {loading ? 'Updating...' : 'Update'}
                                    </Button>

                                    <Button
                                        className="font-outfit"
                                        variant="secondary"
                                        onClick={onCancel}
                                    >
                                        Cancel
                                    </Button>
                                </Box>
                            </Box>
                        </>
                    )}


                    {activeTab === 1 && (
                        <>
                            <TableContainer component={Paper}>
                                <Table className="border border-gray-300">
                                    <TableHead>
                                        <TableRow className="border border-gray-300">
                                            <TableCell align="center" className="font-outfit border border-gray-300">
                                                Sequence ID
                                            </TableCell>
                                            <TableCell align="center" className="font-outfit border border-gray-300">
                                                Preview
                                            </TableCell>
                                            <TableCell align="center" className="font-outfit border border-gray-300">
                                                Actions
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {formData.bike_images?.map((img: any) => (
                                            <TableRow className="border border-gray-300" key={img._id}>
                                                <TableCell align="center" className="border border-gray-300">
                                                    {img.sequence}
                                                </TableCell>

                                                <TableCell align="center" className="border border-gray-300">
                                                    <div className="flex justify-center items-center">
                                                        <img
                                                            src={img.url}
                                                            alt="Preview"
                                                            className="h-28 w-56 object-cover rounded"
                                                        />
                                                    </div>
                                                </TableCell>

                                                <TableCell align="center" className="border border-gray-300">
                                                    {editingImageId === img._id ? (
                                                        <Box display="flex" alignItems="center" gap={1} flexWrap="wrap" justifyContent="center">
                                                            {/* Hidden sequence input */}
                                                            <input
                                                                type="hidden"
                                                                name="sequence"
                                                                value={editingSequence ?? img.sequence}
                                                            />
                                                            <Box display="flex" flexDirection="column" alignItems="center" gap={1}>
                                                                {/* File Input */}
                                                                <FileInput
                                                                    id={`file-input-${img._id}`}
                                                                    name="updatedImage"
                                                                    iconOnly={false}
                                                                    onChange={(e) => {
                                                                        const file = e.target.files?.[0];
                                                                        if (file) setEditingFile(file);
                                                                    }}
                                                                />

                                                                {/* Save & Cancel side-by-side */}
                                                                <Box display="flex" gap={1}>
                                                                    <Button

                                                                        disabled={!editingFile}
                                                                        className="font-outfit"
                                                                        size="sm"
                                                                        onClick={handleImageUpdate}
                                                                    >
                                                                        Save
                                                                    </Button>

                                                                    <Button
                                                                        className="font-outfit"
                                                                        size="sm"
                                                                        variant="secondary"
                                                                        onClick={() => setEditingImageId(null)}
                                                                    >
                                                                        Cancel
                                                                    </Button>
                                                                </Box>
                                                            </Box>
                                                        </Box>
                                                    ) : (
                                                        <Box display="flex" alignItems="center" gap={1} justifyContent="center">
                                                            {/* View */}
                                                            <Tooltip title="View">
                                                                <IconButton color="primary" onClick={() => handleImagePreview(img.url)}>
                                                                    <VisibilityIcon />
                                                                </IconButton>
                                                            </Tooltip>

                                                            {/* Edit */}
                                                            <Tooltip title="Edit">
                                                                <IconButton color="secondary" onClick={() => handleImageEdit(img)}>
                                                                    <EditIcon />
                                                                </IconButton>
                                                            </Tooltip>

                                                            {/* Delete */}
                                                            <Tooltip title="Delete">
                                                                <IconButton color="error" onClick={() => handleImageDelete(img._id)}>
                                                                    <DeleteIcon />
                                                                </IconButton>
                                                            </Tooltip>
                                                        </Box>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </>
                    )}
                </Box>
            </Box>
        </>
    );
};

export default BikeUpdateForm;