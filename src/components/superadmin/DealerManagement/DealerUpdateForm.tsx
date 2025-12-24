import React, { useRef, useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Checkbox,
    FormControlLabel,
    IconButton,
    Tooltip
} from '@mui/material';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Tabs, Tab } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import TextField from '../../form/input/InputField';
import Button from '../../ui/button/Button';
import {
    fetchDealer,
    updateDealerBusinessDetails,
    updateDealerProfile, fetchCityMaster
} from '../../../store/AppUserManagement/DealerManagementSlice';

import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../../store/store';
import Alert from '../../ui/alert/Alert';


interface DealerUpdateFormProps {
    onCancel: () => void;
    editData?: any; // ideally type properly
    isEditMode?: boolean;
}


const DealerUpdateForm: React.FC<DealerUpdateFormProps> = ({ onCancel, editData, isEditMode = false }) => {
    const [alertType, setAlertType] = useState<'success' | 'error' | 'warning' | 'info' | null>(null);
    const [alertMessage, setAlertMessage] = useState('');
    const [showAlert, setShowAlert] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | undefined>(undefined);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [activeTab, setActiveTab] = useState(0);


    const [formData, setFormData] = useState({
        _id: editData?._id || '',
        name: editData?.name || '',
        phone: editData?.phone || '',
        email: editData?.email || '',
        city: editData?.cityId || '',
        aadhar_no: editData?.aadhar_no || '',
        selfie: editData?.selfie || '',
        business_name: editData?.business_name || '',
        address: editData?.address || '',
        business_contact_no: editData?.business_contact_no || '',
        business_whatsapp_no: editData?.business_whatsapp_no || '',
    });

    const inputRef = useRef<HTMLInputElement>(null);
    const [fileName, setFileName] = useState("");
    const [isDragOver, setIsDragOver] = useState(false);
    const [error, setError] = useState("");

    const dispatch = useDispatch<AppDispatch>();
    const { dealerListings, totalItems } = useSelector((state: RootState) => state.DealerManagement);
    const { CityMaster } = useSelector((state: RootState) => state.CityMaster);

    useEffect(() => {

        dispatch(fetchCityMaster({
        }));
    }, [dispatch]);







    const handlePreview = async (url: string) => {
        const isPdf = url?.toLowerCase().endsWith('.pdf');
        if (isPdf) {
            try {
                const response = await fetch(url);
                const blob = await response.blob();
                const blobUrl = URL.createObjectURL(blob);
                setPreviewUrl(blobUrl);
            } catch (err) {
                console.error('Error fetching file:', err);
                setPreviewUrl(undefined);
            }
        } else {
            setPreviewUrl(url); // for image preview
        }
        setPreviewOpen(true);
    };


    const validateFile = (file: File) => {
        const allowedImageTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
        if (!allowedImageTypes.includes(file.type)) {
            setError("Only JPG, JPEG, PNG images are allowed!");
            return false;
        }
        if (file.size > 1 * 1024 * 1024) {
            setError("File size must be less than 1MB");
            return false;
        }
        setError("");
        return true;
    };


    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && validateFile(file)) {
            setFormData((prev: any) => ({
                ...prev,
                selfie: file, //  Store file object
            }));
            setFileName(file.name);
        }
    };


    const handleDrop = (event: React.DragEvent<HTMLLabelElement>) => {
        event.preventDefault();
        const file = event.dataTransfer.files?.[0];
        if (file && validateFile(file)) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setFormData((prev: any) => ({
                    ...prev,
                    selfie: event.target?.result as string,
                }));
            };
            reader.readAsDataURL(file);
            setFileName(file.name);
        }
        setIsDragOver(false);
    };


    const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
        setActiveTab(newValue);
    };


    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };




    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {

            // get the selected city object
            const selectedCity = CityMaster.find((c: any) => c._id === formData.city);
            const cityName = selectedCity ? selectedCity.city_name : '';
            const cityId = selectedCity ? selectedCity._id : '';

            if (activeTab === 0) {
                // Handle update/ dealer details

                let finalForm: any = {
                    userId: formData._id,
                    name: formData.name,
                    phone: formData.phone,
                    email: formData.email,
                    city: cityName,
                    cityId: cityId,
                    aadhar_no: formData.aadhar_no,
                    selfie: formData.selfie
                };

                if (isEditMode && editData?._id) {
                    await dispatch(updateDealerProfile({ ...finalForm })).unwrap();
                    setAlertType('success');
                    setAlertMessage('Dealer Profile updated successfully');
                }

            } else if (activeTab === 1) {
                // Handle password change
                const payload = {
                    userId: editData._id,
                    business_name: formData.business_name,
                    business_contact_no: formData.business_contact_no,
                    business_whatsapp_no: formData.business_whatsapp_no,
                    address: formData.address,
                };

                // Call custom thunk or Axios directly here
                await dispatch(updateDealerBusinessDetails({
                    userId: editData._id,
                    business_name: formData.business_name,
                    business_contact_no: formData.business_contact_no,
                    business_whatsapp_no: formData.business_whatsapp_no,
                    address: formData.address,
                })).unwrap();


                setAlertType('success');
                setAlertMessage('Business Details updated successfully');
            }

            setShowAlert(true);
            onCancel();
            dispatch(fetchDealer({ search: '', page: 0, limit: 10 }));
        } catch (error) {
            setAlertType('error');
            setAlertMessage(`Failed: ` + (error as any)?.message);
            setShowAlert(true);
        }

        setTimeout(() => setShowAlert(false), 3000);
    };


    const isBusinessNameValid = (name: string) => {
        const trimmed = name.trim();
        if (!trimmed) return false; // empty
        if (!/[A-Za-z]/.test(trimmed)) return false; // must contain at least 1 letter
        if (/[^A-Za-z0-9.\s]/.test(trimmed)) return false; // only letters, numbers, dot, space
        if (trimmed.length > 30) return false; // optional length limit
        return true;
    };

    // Form valid flags
    const isProfileTabValid = formData.name.trim() && formData.phone.trim() && formData.email.trim();
    const isBusinessTabValid = isBusinessNameValid(formData.business_name); // add more checks if needed


    // Update button logic
    const isFormValid =
        formData.name.trim() &&
        formData.phone.trim() &&
        formData.email.trim() &&
        isBusinessNameValid(formData.business_name); // add this check

    return (
        <>
            <Dialog
                open={previewOpen}
                onClose={() => setPreviewOpen(false)}
                maxWidth="md"
                fullWidth
                disableEnforceFocus
            >
                <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    Preview
                    <IconButton onClick={() => setPreviewOpen(false)}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>

                <DialogContent>
                    {previewUrl ? (
                        previewUrl.toLowerCase().includes('blob') ? (
                            <iframe
                                src={previewUrl}
                                title="PDF Preview"
                                style={{
                                    width: '100%',
                                    height: '80vh',
                                    border: 'none',
                                }}
                            />
                        ) : (
                            <img
                                src={previewUrl}
                                alt="Preview"
                                style={{
                                    width: '50%',
                                    height: 'auto',
                                    display: 'block',
                                    margin: '0 auto',
                                }}
                            />
                        )
                    ) : (
                        <Typography>No file selected.</Typography>
                    )}
                </DialogContent>
            </Dialog>
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

            <Box
                className="max-w-8xl mx-auto rounded-xl shadow-md mb-6"
                sx={{ backgroundColor: 'white' }}
            >
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
                        {isEditMode ? 'Update Dealer Details' : 'Create Staff User'}
                    </Typography>
                    <IconButton sx={{ color: 'white' }} onClick={onCancel}>
                        <CloseIcon />
                    </IconButton>
                </Box>

                {isEditMode && (
                    <Tabs value={activeTab} onChange={handleTabChange} variant="fullWidth">
                        <Tab className="font-outfit" label="Update Dealer Profile" />
                        <Tab className="font-outfit" label="Update Business Details" />
                    </Tabs>
                )}

                {/* Form Content */}
                <Box component="form" onSubmit={handleSubmit} px={6} py={4}>
                    {(!isEditMode || activeTab === 0) && (

                        <>
                            <div className="grid grid-cols-2 gap-4">
                                <TextField
                                    label="Name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                />
                                <TextField
                                    label="Mobile Number"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                />
                                <TextField
                                    label="Email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                />

                                <div className="flex flex-col">
                                    <label className="text-sm text-gray-600 dark:text-white block mb-2">
                                        City <span className="text-error-500"> * </span>
                                    </label>

                                    <select
                                        name="city"
                                        value={formData.city}   // will hold cityId
                                        onChange={handleChange}
                                        className="mt-1 p-2 border rounded"
                                    >
                                        <option value="">Select City</option>
                                        {CityMaster?.filter((c) => c.isActive).map((city) => (
                                            <option key={city._id} value={city._id}>
                                                {city.city_name}
                                            </option>
                                        ))}
                                    </select>
                                </div>


                                <TextField
                                    label="Aadhar Number"
                                    name="aadhar_no"
                                    value={formData.aadhar_no}
                                    onChange={handleChange}
                                />

                                <div className="flex flex-col">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        ref={inputRef}
                                        className="hidden"
                                        id="profile-image-upload"
                                    />

                                    <label
                                        htmlFor="profile-image-upload"
                                        className={`cursor-pointer text-gray-400 mt-9 hover:text-gray-600 flex items-center gap-2 border-b border-gray-300 px-2 py-1 min-w-[400px] ${isDragOver ? "border-blue-500 bg-blue-100" : ""}`}
                                        onDragOver={(e) => {
                                            e.preventDefault();
                                            setIsDragOver(true);
                                        }}
                                        onDragLeave={() => setIsDragOver(false)}
                                        onDrop={handleDrop}
                                    >
                                        {fileName ? (
                                            <span className="text-sm text-gray-500 font-medium">{fileName}</span>
                                        ) : (
                                            <>
                                                <span>Drag & Drop or Click to Upload</span>
                                                <AddPhotoAlternateIcon />
                                            </>
                                        )}
                                    </label>

                                    {formData?.selfie && (
                                        <div
                                            onClick={() => handlePreview(formData.selfie)}
                                            className="flex items-center cursor-pointer mt-2"
                                        >
                                            <VisibilityIcon className="text-blue-600" fontSize="small" />
                                            <span className="ml-2 text-sm text-blue-600">Existing Profile Image</span>
                                        </div>
                                    )}

                                    {error ? (
                                        <p className="mt-1.5 text-xs text-red-600">{error}</p>
                                    ) :

                                        <p className="mt-1 text-xs text-gray-400 italic">
                                            * File size should be up to 1 MB
                                        </p>
                                    }
                                </div>
                            </div>


                            {!isEditMode && (
                                <>
                                    <TextField
                                        label="Business Name"
                                        name="business_name"
                                        value={formData.business_name}
                                        onChange={handleChange}
                                    />
                                    <TextField
                                        label="Business Contact No."
                                        name="business_contact_no"
                                        value={formData.business_contact_no}
                                        onChange={handleChange}
                                    />
                                    <TextField
                                        label="Business Whatsapp No."
                                        name="business_whatsapp_no"
                                        value={formData.business_whatsapp_no}
                                        onChange={handleChange}
                                    />
                                    <TextField
                                        label="Business Address"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                    />
                                </>
                            )}
                        </>
                    )}

                    {isEditMode && activeTab === 1 && (
                        <>
                            <div className="grid grid-cols-2 gap-4">
                                <>
                                    <TextField
                                        label="Business Name"
                                        name="business_name"
                                        value={formData.business_name}
                                        onChange={handleChange}
                                    />
                                    <TextField
                                        label="Business Contact No."
                                        name="business_contact_no"
                                        value={formData.business_contact_no}
                                        onChange={handleChange}
                                    />
                                    <TextField
                                        label="Business Whatsapp No."
                                        name="business_whatsapp_no"
                                        value={formData.business_whatsapp_no}
                                        onChange={handleChange}
                                    />
                                    <TextField
                                        label="Business Address"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                    />
                                </>
                            </div>
                        </>
                    )}

                    <div className="flex justify-center gap-6 mt-6">
                        {activeTab === 0 ? (
                            <Button disabled={!isProfileTabValid}>
                                {isEditMode ? 'Update' : 'Create User'}
                            </Button>
                        ) : (
                            <Button disabled={!isBusinessTabValid}>
                                Update
                            </Button>
                        )}
                    </div>
                </Box>
            </Box >
        </>
    )
};
export default DealerUpdateForm;
