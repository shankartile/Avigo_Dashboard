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
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../../store/store';
import { fetchProductListing } from '../../../store/ProductListing/ProductListingSlice';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/store';
import FileInput from '../../form/input/FileInput';
import TextAreaField from '../../form/input/TextArea';
import {
    fetchProductListingbyId, updateSparepartListing, updateSparepartImage, fetchCityMaster, fetchBikeBrandMaster, fetchBikeNameMaster, fetchBikeFueltypeMaster, fetchBikeYearMaster, fetchBikeColorMaster, fetchBikeOwnershipMaster,
    fetchCarBrandMaster, fetchCarNameMaster, fetchYearofManufactureMaster, fetchConditionMaster, fetchproducttypeMaster, fetchsubproducttypeMaster
} from '../../../store/ProductListing/ProductListingSlice';


type ProductType = 'car' | 'bike' | 'sparepart';

interface SparepartUpdateFormProps {
    onCancel: () => void;
    editData?: any;
    isEditMode?: boolean;
}

const SparepartUpdateForm: React.FC<SparepartUpdateFormProps> = ({ onCancel, editData, isEditMode = false }) => {
    const [activeTab, setActiveTab] = useState(0);
    const [formData, setFormData] = useState<any>({ ...editData });
    const [alertMessage, setAlertMessage] = useState('');
    const [alertType, setAlertType] = useState<'success' | 'error' | 'warning' | 'info' | null>(null);
    const [showAlert, setShowAlert] = useState(false);
    const [fileName, setFileName] = useState('');
    const [editingImageId, setEditingImageId] = useState<string | null>(null);
    const [editingSequence, setEditingSequence] = useState<number | null>(null);
    const [editingFile, setEditingFile] = useState<File | null>(null);
    const [filtertype, setFiltertype] = useState<ProductType>('sparepart');
    const [searchTerm, setSearchTerm] = useState('');
    const [pageIndex, setPageIndex] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [showSkeleton, setShowSkeleton] = useState(true);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setShowSkeleton(false), 1000);
        return () => clearTimeout(timer);
    }, []);


    const inputRef = useRef<HTMLInputElement>(null);

    const dispatch = useDispatch<AppDispatch>();
    const { CarNameMaster } = useSelector((state: RootState) => state.CarNameMaster);
    const { CarBrandMaster } = useSelector((state: RootState) => state.CarBrandMaster);
    const { producttypeMaster } = useSelector((state: RootState) => state.ProducttypeMaster);
    const { subproducttypeMaster } = useSelector((state: RootState) => state.ProducttypeMaster);
    const { ConditionMaster } = useSelector((state: RootState) => state.ConditionMaster);
    const { YearofManufactureMaster } = useSelector((state: RootState) => state.YearofManufactureMaster);
    const { BikeBrandMaster } = useSelector((state: RootState) => state.BikeBrandMaster);
    const { BikeNameMaster } = useSelector((state: RootState) => state.BikeNameMaster);
    const { BikeFueltypeMaster } = useSelector((state: RootState) => state.BikeFueltypeMaster);
    const { CityMaster } = useSelector((state: RootState) => state.CityMaster);
    const { BikeYearMaster } = useSelector((state: RootState) => state.BikeYearMaster);
    const { BikeColorMaster } = useSelector((state: RootState) => state.BikeColorMaster);
    const { BikeOwnershipMaster } = useSelector((state: RootState) => state.BikeOwnershipMaster);
    const { BikeTypeMaster } = useSelector((state: RootState) => state.BikeTypeMaster);


    useEffect(() => {
        dispatch(fetchproducttypeMaster({
        }));
        dispatch(fetchsubproducttypeMaster({
        }));
        dispatch(fetchCarNameMaster({
        }));
        dispatch(fetchConditionMaster({
        }));
        dispatch(fetchYearofManufactureMaster({
        }));
        dispatch(fetchCarBrandMaster({
        }));
        dispatch(fetchBikeBrandMaster({
        }));
        dispatch(fetchBikeNameMaster({
        }));
        dispatch(fetchCityMaster({
        }));
    }, [dispatch]);


    const selectedProductTypeObj = producttypeMaster?.find((p) => p._id === formData.product_type_id);
    const selectedProductType = selectedProductTypeObj?.product_type;
    const selectedSubProductTypeObj = subproducttypeMaster?.find((s) => s._id === formData.subproduct_type_id);
    const selectedBikeTypeName = selectedSubProductTypeObj?.subproduct_type; // "Scooty" or "Bike"
    const selectedCarBrandId = formData.brand_id;
    const selectedBikeBrandId = formData.brand_id;

    const isBikeType = selectedProductType === 'Bike';
    const isCarType = selectedProductType === 'Car';

    const chooseProductTypeId = formData.product_type_id;

    const chooseProductTypeObj = producttypeMaster?.find(
        (p) => p._id === chooseProductTypeId
    );

    const chooseProductType = chooseProductTypeObj?.product_type; // 'Car' or 'Bike'

    const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => setActiveTab(newValue);


    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev: any) => ({ ...prev, [name]: value }));
    };


    const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setFormData((prev: any) => ({ ...prev, description: e.target.value }));
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (loading) return; // Prevent multiple submissions

        setLoading(true);

        // Clone the formData
        const payload = { ...formData };

        //  Add model_id based on selected product type
        const selectedProductType = producttypeMaster?.find((p) => p._id === formData.product_type_id)?.product_type;

        if (selectedProductType === 'Car' && formData.car_id) {
            payload.model_id = formData.car_id;
        } else if (selectedProductType === 'Bike' && formData.bike_id) {
            payload.model_id = formData.bike_id;
        }

        try {
            await dispatch(updateSparepartListing({ _id: formData._id, ...payload })).unwrap();

            setAlertType('success');
            setAlertMessage('Spare part details updated successfully.');
            setShowAlert(true);
            setTimeout(() => {
                setShowAlert(false);
                onCancel();
                dispatch(fetchProductListing({
                    fromDate,
                    toDate,
                    type: filtertype,
                    search: searchTerm,
                }));
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
            await dispatch(updateSparepartListing({
                sparesId: formData._id,
                mode: 'remove',
                remove_image_ids: [_id],
            })).unwrap();

            // Refetch updated Bike images
            const updatedspares = await dispatch(fetchProductListingbyId({ _id: formData._id, type: formData.type })).unwrap();

            setFormData((prev: any) => ({
                ...prev,
                spares_images: updatedspares.images || [],
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
            const imageToUpdate = formData.spares_images.find((img: any) => img._id === editingImageId);

            await dispatch(updateSparepartImage({
                sparesId: formData._id,
                file: editingFile,
                mode: 'update_at_sequence',
                sequence: imageToUpdate?.sequence,
            })).unwrap();

            // Refresh listing data
            const updatedSpare = await dispatch(fetchProductListingbyId({ _id: formData._id, type: formData.type })).unwrap();

            setFormData((prev: any) => ({
                ...prev,
                spares_images: updatedSpare.images || [],
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


    const SparePartFormSkeleton = () => (
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

    if (showSkeleton) return <SparePartFormSkeleton />;


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
                        {isEditMode ? 'Update Spare part Listing' : 'Add New Spare part Listing'}
                    </Typography>
                    <IconButton sx={{ color: 'white' }} onClick={onCancel}><CloseIcon /></IconButton>
                </Box>

                <Tabs value={activeTab} onChange={handleTabChange} variant="fullWidth">
                    <Tab label="Spare part Details" className='font-outfit' />
                    <Tab label="Spare part Images" className='font-outfit' />
                </Tabs>

                <Box component="form" onSubmit={handleSubmit} px={6} py={4}>
                    {activeTab === 0 && (
                        <>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col">
                                    <label className="text-sm text-gray-600 dark:text-white  block">Product Type <span className="text-error-500"> * </span>
                                    </label>

                                    <select
                                        name="product_type_id"
                                        value={formData.product_type_id}
                                        onChange={handleChange}
                                        className="mt-1 p-2 border rounded"
                                    >
                                        <option value="">Select product type</option>
                                        {producttypeMaster?.filter((c) => c.isActive).map((product_type: any) => (
                                            <option key={product_type._id} value={product_type._id}>
                                                {product_type.product_type}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="flex flex-col">
                                    <label className="text-sm text-gray-600 dark:text-white  block">Sub Product Type <span className="text-error-500"> * </span>
                                    </label>

                                    <select
                                        name="subproduct_type_id"
                                        value={formData.subproduct_type_id}
                                        onChange={handleChange}
                                        className="mt-1 p-2 border rounded"
                                    >
                                        <option value="">Select subproduct type</option>
                                        {subproducttypeMaster
                                            ?.filter(
                                                (sub) =>
                                                    sub.isActive &&
                                                    sub.product_type_id === chooseProductTypeId // Filter by selected product type ID
                                            )
                                            .map((subproduct_type: any) => (
                                                <option key={subproduct_type._id} value={subproduct_type._id}>
                                                    {subproduct_type.subproduct_type}
                                                </option>
                                            ))}

                                    </select>
                                </div>


                                {isCarType && (
                                    <>
                                        <div className="flex flex-col">
                                            <label className="text-sm text-gray-600 dark:text-white  block">Car Brand <span className="text-error-500"> * </span>
                                            </label>

                                            <select
                                                name="brand_id"
                                                value={formData.brand_id}
                                                onChange={handleChange}
                                                className="mt-1 p-2 border rounded"
                                            >
                                                <option value="">Select Brand</option>
                                                {CarBrandMaster?.filter((c) => c.isActive).map((brand) => (
                                                    <option key={brand._id} value={brand._id}>
                                                        {brand.car_brand_name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>


                                        <div className="flex flex-col">
                                            <label className="text-sm text-gray-600 dark:text-white  block">Car Name <span className="text-error-500"> * </span>
                                            </label>

                                            <select
                                                name="car_id"
                                                value={formData.car_id}
                                                onChange={handleChange}
                                                className="mt-1 p-2 border rounded"
                                            >
                                                <option value="">Select Car Name</option>
                                                {CarNameMaster?.filter(
                                                    (car) =>
                                                        car.isActive &&
                                                        (!selectedCarBrandId || car.car_brand_id === selectedCarBrandId)
                                                ).map((car_name) => (
                                                    <option key={car_name._id} value={car_name._id}>
                                                        {car_name.car_name}
                                                    </option>
                                                ))}

                                            </select>
                                        </div>

                                    </>
                                )}


                                {isBikeType && (
                                    <>
                                        <div className="flex flex-col">
                                            <label className="text-sm text-gray-600 dark:text-white  block">Bike Brand <span className="text-error-500"> * </span>
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
                                                        (!selectedBikeTypeName || brand.bike_type_name === selectedBikeTypeName)
                                                ).map((bike_brand) => (
                                                    <option key={bike_brand._id} value={bike_brand._id}>
                                                        {bike_brand.brand}
                                                    </option>
                                                ))}

                                            </select>
                                        </div>


                                        <div className="flex flex-col">
                                            <label className="text-sm text-gray-600 dark:text-white  block">Bike Name <span className="text-error-500"> * </span>
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
                                                        (!selectedBikeTypeName || bike.bike_type_name === selectedBikeTypeName) &&
                                                        (!selectedBikeBrandId || bike.bike_brand_id === selectedBikeBrandId)
                                                ).map((bike_name) => (
                                                    <option key={bike_name._id} value={bike_name._id}>
                                                        {bike_name.bikename}
                                                    </option>
                                                ))}


                                            </select>
                                        </div>
                                    </>
                                )}


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
                                    <label className="text-sm text-gray-600 dark:text-white  block">Condition <span className="text-error-500"> * </span>
                                    </label>

                                    <select
                                        name="condition_id"
                                        value={formData.condition_id}
                                        onChange={handleChange}
                                        className="mt-1 p-2 border rounded"
                                    >
                                        <option value="">Select Condition</option>
                                        {ConditionMaster?.filter((c) => c.isActive).map((condition) => (
                                            <option key={condition._id} value={condition._id}>
                                                {condition.condition}
                                            </option>
                                        ))}
                                    </select>
                                </div>


                                <div className="flex flex-col">
                                    <label className="text-sm text-gray-600 dark:text-white  block">Year of Manufacture <span className="text-error-500"> * </span>
                                    </label>

                                    <select
                                        name="year_of_manufacture_id"
                                        value={formData.year_of_manufacture_id}
                                        onChange={handleChange}
                                        className="mt-1 p-2 border rounded"
                                    >
                                        <option value="">Select year of mfg</option>
                                        {YearofManufactureMaster?.filter((c) => c.isActive).map((year) => (
                                            <option key={year._id} value={year._id}>
                                                {year.year_of_manufacture}
                                            </option>
                                        ))}
                                    </select>
                                </div>



                                <TextField label="Spare Part Name" name="sapre_name" value={formData.sapre_name} onChange={handleChange} />


                                <TextField label="Price" name="price" value={formData.price} onChange={handleChange} />
                                <TextAreaField
                                    label="Description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleTextAreaChange}
                                />


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
                                        {formData.spares_images?.map((img: any) => (
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

export default SparepartUpdateForm;