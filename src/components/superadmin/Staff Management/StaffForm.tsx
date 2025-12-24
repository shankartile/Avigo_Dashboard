import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Checkbox,
    FormControlLabel,
    IconButton,
    Tooltip
} from '@mui/material';
import { Tabs, Tab } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import TextField from '../../form/input/InputField';
import Button from '../../ui/button/Button';
import {
    fetchStaff,
    addStaff,
    updateStaff,
    changeStaffPassword,
    fetchPermissions
} from '../../../store/StaffManagement/StaffManagementSlice';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../../store/store';
import Alert from '../../ui/alert/Alert';


interface StaffFormProps {
    onCancel: () => void;
    editData?: any; // ideally type properly
    isEditMode?: boolean;
}

interface Permission {
    _id: string;
    key: string;
    label: string;
}

const StaffForm: React.FC<StaffFormProps> = ({ onCancel, editData, isEditMode = false }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [alertType, setAlertType] = useState<'success' | 'error' | 'warning' | 'info' | null>(null);
    const [alertMessage, setAlertMessage] = useState('');
    const [showAlert, setShowAlert] = useState(false);
    const [activeTab, setActiveTab] = useState(0);
    const [changepasswordData, setChangepasswordData] = useState({
        newPassword: '',
        changePassword: '',
    });
    const [passwordError, setPasswordError] = useState('');

    const [formData, setFormData] = useState({
        name: editData?.name || '',
        phone: editData?.phone || '',
        email: editData?.email || '',
        password: '',
        permissions: {} as Record<string, boolean>,
    });

    const dispatch = useDispatch<AppDispatch>();
    const permissionsList: Permission[] = useSelector((state: RootState) => state.staff.permissions);

    useEffect(() => {
        dispatch(fetchPermissions());
    }, [dispatch]);

    useEffect(() => {
        if (!permissionsList.length) return;

        const permissionMap = (editData?.permissions || []).reduce((acc: Record<string, boolean>, curr: any) => {
            const perm = permissionsList.find(p => p._id === curr.permissionId);
            if (perm) {
                acc[perm.key] = curr.allowed;
            }
            return acc;
        }, {});

        setFormData(prev => ({
            ...prev,
            permissions: permissionsList.reduce((acc, perm) => {
                // Always set 'dashboard' as true
                acc[perm.key] = perm.key === 'dashboard'
                    ? true
                    : isEditMode
                        ? permissionMap[perm.key] || false
                        : false;
                return acc;
            }, {} as Record<string, boolean>)
        }));
    }, [permissionsList, isEditMode, editData]);


    const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
        setActiveTab(newValue);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        const updatedData = {
            ...changepasswordData,
            [name]: value,
        };

        // Check if both fields are filled and mismatched
        if (
            updatedData.newPassword &&
            updatedData.changePassword &&
            updatedData.newPassword !== updatedData.changePassword
        ) {
            setPasswordError('Password does not match');
        } else {
            setPasswordError('');
        }

        setChangepasswordData(updatedData);
    };

    const handlePermissionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            permissions: {
                ...prev.permissions,
                [name]: checked,
            },
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (isSubmitting) return; // Prevent double submission
        setIsSubmitting(true); // Start loading

        try {
            if (activeTab === 0) {
                // Handle update/create staff details
                const selectedPermissions = permissionsList
                    .filter(p => formData.permissions[p.key])
                    .map(p => ({
                        permissionId: p._id,
                        allowed: true,
                    }));

                let finalForm: any = {
                    name: formData.name,
                    phone: formData.phone,
                    email: formData.email,
                    permissions: selectedPermissions,
                };

                if (!isEditMode) {
                    finalForm.password = formData.password;
                }


                if (isEditMode && editData?._id) {
                    await dispatch(updateStaff({ _id: editData._id, ...finalForm })).unwrap();
                    setAlertType('success');
                    setAlertMessage('Staff updated successfully');
                    setShowAlert(true);
                    setTimeout(() => setShowAlert(false), 3000);
                } else {
                    await dispatch(addStaff(finalForm)).unwrap();
                    setAlertType('success');
                    setAlertMessage('Staff added successfully');
                    setShowAlert(true);
                    setTimeout(() => setShowAlert(false), 3000);
                }
            } else if (activeTab === 1) {
                // Handle password change
                const payload = {
                    staffId: editData._id,
                    newPassword: changepasswordData.newPassword,
                    confirmPassword: changepasswordData.changePassword,
                };

                // Call custom thunk or Axios directly here
                await dispatch(changeStaffPassword({
                    _id: editData._id,
                    formData: {
                        newPassword: changepasswordData.newPassword,
                        confirmPassword: changepasswordData.changePassword,
                    },
                })).unwrap();


                setAlertType('success');
                setAlertMessage('Password updated successfully');
                setShowAlert(true);
                setTimeout(() => setShowAlert(false), 3000);
            }

            setShowAlert(true);
            setTimeout(() => {
                onCancel();

            }, 2000);
            dispatch(fetchStaff({ search: '', page: 0, limit: 10 }));
        } catch (error) {
            setAlertType('error');
            setAlertMessage(`Failed: ` + (error as any)?.message);
            setShowAlert(true);
        } finally {
            setIsSubmitting(false); // Reset loading state
        }

        setTimeout(() => setShowAlert(false), 3000);
    };

    const isFormValid =
        formData.name.trim() &&
        formData.phone.trim() &&
        formData.email.trim() &&
        (isEditMode || formData.password.trim()) &&
        Object.values(formData.permissions).some(allowed => allowed);


    const isChangePasswordFormValid =
        changepasswordData.newPassword.trim() &&
        changepasswordData.changePassword.trim()



    return (
        <>
            {showAlert && alertType && (
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
            )}

            <Box
                className="max-w-5xl mx-auto rounded-xl shadow-md mb-6"
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
                        {isEditMode ? 'Update Staff User' : 'Create Staff User'}
                    </Typography>
                    <IconButton sx={{ color: 'white' }} onClick={onCancel}>
                        <CloseIcon />
                    </IconButton>
                </Box>

                {isEditMode && (
                    <Tabs value={activeTab} onChange={handleTabChange} variant="fullWidth">
                        <Tab className="font-outfit" label="Update Staff Details" />
                        <Tab className="font-outfit" label="Change Staff Password" />
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
                                {!isEditMode &&
                                    <TextField
                                        label="Password"
                                        name="password"
                                        type='password'
                                        value={formData.password}
                                        onChange={handleChange}
                                    />
                                }
                            </div>

                            <Typography className="font-outfit" variant="subtitle1" mt={4} mb={2}>
                                Module Permissions:
                            </Typography>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                {permissionsList
                                    .filter((perm) => perm.key !== 'dashboard' && perm.key !== "staffmanagement") // <-- HIDE dashboard from UI
                                    .map((perm) => (
                                        <FormControlLabel
                                            key={perm.key}
                                            control={
                                                <Checkbox
                                                    checked={formData.permissions?.[perm.key] || false}
                                                    onChange={handlePermissionChange}
                                                    name={perm.key}
                                                />
                                            }
                                            label={<span className="font-outfit">{perm.label}</span>}
                                        />
                                    ))}
                            </div>


                        </>
                    )}

                    {isEditMode && activeTab === 1 && (
                        <>
                            <div className="grid grid-cols-2 gap-4">
                                <TextField
                                    label="New Password"
                                    type="password"
                                    name="newPassword"
                                    value={changepasswordData.newPassword}
                                    onChange={handlePasswordChange}
                                />
                                <TextField
                                    label="Confirm Password"
                                    type="password"
                                    name="changePassword"
                                    value={changepasswordData.changePassword}
                                    onChange={handlePasswordChange}
                                    error={!!passwordError}
                                    helperText={passwordError}
                                />
                            </div>
                        </>
                    )}

                    <div className="flex justify-center gap-6 mt-6">
                        {activeTab === 0 ? (
                            <Button disabled={!isFormValid || isSubmitting}>
                                {isSubmitting
                                    ? (isEditMode ? 'Updating...' : 'Creating...')
                                    : (isEditMode ? 'Update Staff' : 'Create Staff')}
                            </Button>

                        ) : (
                            <Button disabled={!isChangePasswordFormValid || isSubmitting}>
                                {isSubmitting ? 'Updating...' : 'Update Password'}
                            </Button>

                        )}
                        <Button variant="secondary" onClick={onCancel}>
                            Cancel
                        </Button>
                    </div>
                </Box>
            </Box>
        </>
    )
};
export default StaffForm;
