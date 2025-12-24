import React, { useState, useRef, useEffect } from 'react';
import {
    Box, Typography, IconButton, Tabs, Tab,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import TextField from '../../form/input/InputField';
import Button from '../../ui/button/Button';
import {
    verifyPasswordChangeOtp,
    requestPasswordChangeOtp,
    verifyEmailChangeOtp,
    requestEmailChangeOtp,
} from '../../../store/AuthManagement/ProfileSettingSlice';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../../store/store';
import Alert from '../../ui/alert/Alert';
import OTPInput from '../../form/input/OTPInput';
import { getActiveUser, removeTokenCookie } from '../../../utility/Cookies';
import { useNavigate } from "react-router-dom";

const ProfileSetting: React.FC = () => {

    const user = getActiveUser();


    const adminId = user?.id || '';
    const oldEmail = user?.email || '';

    const dispatch = useDispatch<AppDispatch>();

    const [alertType, setAlertType] = useState<'success' | 'error' | null>(null);
    const [alertMessage, setAlertMessage] = useState('');
    const [showAlert, setShowAlert] = useState(false);
    const [activeTab, setActiveTab] = useState(0);
    const [oldemail, setOldEmail] = useState('');
    const [emailData, setEmailData] = useState({ newEmail: '' });
    const [emailOtpSent, setEmailOtpSent] = useState(false);
    const [enteredEmailOtp, setEnteredEmailOtp] = useState('');

    const [passwordData, setPasswordData] = useState({
        newPassword: '',
        confirmNewPassword: '',
    });
    const [passwordOtpSent, setPasswordOtpSent] = useState(false);
    const [enteredPasswordOtp, setEnteredPasswordOtp] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [timer, setTimer] = useState(60);
    const [canResend, setCanResend] = useState(false);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const [emailTimer, setEmailTimer] = useState(60);
    const [emailCanResend, setEmailCanResend] = useState(false);
    const emailTimerRef = useRef<NodeJS.Timeout | null>(null);



    const role = user?.role || "";
    const email = user?.email || "";
    const navigate = useNavigate();





    useEffect(() => {
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, []);

    useEffect(() => {
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
            if (emailTimerRef.current) clearInterval(emailTimerRef.current);
        };
    }, []);


    const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
        setActiveTab(newValue);
        // reset states
        setEmailOtpSent(false);
        setPasswordOtpSent(false);
        setEnteredEmailOtp('');
        setEnteredPasswordOtp('');
    };


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmailData({ ...emailData, [e.target.name]: e.target.value });
    };


    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const updated = { ...passwordData, [name]: value };
        setPasswordData(updated);

        if (
            updated.newPassword &&
            updated.confirmNewPassword &&
            updated.newPassword !== updated.confirmNewPassword
        ) {
            setPasswordError('Passwords do not match');
        } else {
            setPasswordError('');
        }
    };

    // const handleRequestEmailOtp = async () => {
    //     try {
    //         await dispatch(requestEmailChangeOtp({
    //             adminId,
    //             oldEmail,
    //             newEmail: emailData.newEmail
    //         })).unwrap();

    //         setEmailOtpSent(true);
    //         setAlertType('success');
    //         setAlertMessage('OTP sent to Mobile no');

    //         // Reset and start timer
    //         setEmailTimer(60);
    //         setEmailCanResend(false);
    //         if (emailTimerRef.current) clearInterval(emailTimerRef.current);

    //         emailTimerRef.current = setInterval(() => {
    //             setEmailTimer((prev) => {
    //                 if (prev === 1) {
    //                     clearInterval(emailTimerRef.current!);
    //                     setEmailCanResend(true);
    //                     return 0;
    //                 }
    //                 return prev - 1;
    //             });
    //         }, 1000);
    //     } catch (error: any) {
    //         setAlertType('error');
    //         setAlertMessage(error?.message || 'Failed to send OTP');
    //     } finally {
    //         setShowAlert(true);
    //         setTimeout(() => setShowAlert(false), 3000);
    //     }
    // };

    const handleRequestEmailOtp = async () => {
        try {
            await dispatch(requestEmailChangeOtp({
                adminId,
                oldEmail,
                newEmail: emailData.newEmail,
            })).unwrap();

            setEmailOtpSent(true);
            setAlertType('success');
            setAlertMessage('OTP sent to Mobile no');

            // Reset and start timer
            setEmailTimer(60);
            setEmailCanResend(false);
            if (emailTimerRef.current) clearInterval(emailTimerRef.current);

            emailTimerRef.current = setInterval(() => {
                setEmailTimer((prev) => {
                    if (prev === 1) {
                        clearInterval(emailTimerRef.current!);
                        setEmailCanResend(true);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        } catch (error: any) {
            const waitTime = error?.meta?.waitTime;
            setAlertType('error');

            if (error?.code === 'OTP_COOLDOWN' && waitTime) {
                setAlertMessage(`Please wait ${waitTime} seconds before requesting another OTP.`);
            } else {
                setAlertMessage(error?.message || 'Failed to send OTP');
            }
        } finally {
            setShowAlert(true);
            setTimeout(() => setShowAlert(false), 3000);
        }
    };


    const handleVerifyEmailOtp = async () => {
        try {
            await dispatch(verifyEmailChangeOtp({
                adminId,
                newEmail: emailData.newEmail,
                enteredOtp: enteredEmailOtp
            })).unwrap();

            // Update current email field immediately
            setOldEmail(emailData.newEmail);

            setAlertType('success');
            setAlertMessage('Email changed successfully');
            setEmailOtpSent(false);
            setEmailData({ newEmail: '' });
            setEnteredEmailOtp('');
            setTimeout(() => {
                if (role === 'admin') {
                    removeTokenCookie('admin_user');
                } else if (role === 'staff') {
                    removeTokenCookie('staff_user');
                }

                // redirect to login
                navigate('/', { replace: true });
            }, 2000);
        } catch (error: any) {
            setAlertType('error');
            setAlertMessage(error?.message || 'Failed to verify OTP');
        } finally {
            setShowAlert(true);
            setTimeout(() => setShowAlert(false), 3000);
        }
    };




    const handleRequestPasswordOtp = async () => {
        try {
            await dispatch(
                requestPasswordChangeOtp({

                    email,
                    newPassword: passwordData.newPassword,
                    confirmNewPassword: passwordData.confirmNewPassword,
                })
            ).unwrap();

            setPasswordOtpSent(true);
            setAlertType('success');
            setAlertMessage('OTP sent for password change');
            setTimeout(() => setShowAlert(false), 3000);



            //  Reset fields after submit
            setPasswordData({ newPassword: '', confirmNewPassword: '' });


            // Start the timer (default 60s if backend doesn’t provide)
            const initialTime = 60;
            setTimer(initialTime);
            setCanResend(false);

            if (timerRef.current) clearInterval(timerRef.current);

            timerRef.current = setInterval(() => {
                setTimer((prev) => {
                    if (prev === 1) {
                        clearInterval(timerRef.current!);
                        setCanResend(true);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        } catch (error: any) {
            const waitTime = error?.meta?.waitTime;
            setAlertType('error');

            if (error?.code === 'OTP_COOLDOWN' && waitTime) {
                setAlertMessage(`Please wait ${waitTime} seconds before requesting another OTP.`);

                // Sync timer with backend cooldown
                setTimer(waitTime);
                setCanResend(false);

                if (timerRef.current) clearInterval(timerRef.current);
                timerRef.current = setInterval(() => {
                    setTimer((prev) => {
                        if (prev === 1) {
                            clearInterval(timerRef.current!);
                            setCanResend(true);
                            return 0;
                        }
                        return prev - 1;
                    });
                }, 1000);
            } else {
                setAlertMessage(error?.message || 'Failed to send password OTP');
            }
        } finally {
            setShowAlert(true);
        }
    };



    // const handleVerifyPasswordOtp = async () => {
    //     try {
    //         await dispatch(verifyPasswordChangeOtp({
    //             adminId,
    //             enteredOtp: enteredPasswordOtp,
    //             newPassword: passwordData.newPassword,
    //             confirmNewPassword: passwordData.confirmNewPassword
    //         })).unwrap();
    //         setAlertType('success');
    //         setAlertMessage('Password changed successfully');

    //         setPasswordOtpSent(false);
    //         setPasswordData({ newPassword: '', confirmNewPassword: '' });
    //     } catch (error: any) {
    //         setAlertType('error');
    //         setAlertMessage(error?.message || 'Failed to verify OTP');
    //     } finally {
    //         setShowAlert(true);
    //         setTimeout(() => setShowAlert(false), 3000);
    //     }
    // };




    const handleVerifyPasswordOtp = async () => {
        try {
            await dispatch(
                verifyPasswordChangeOtp({

                    email,
                    enteredOtp: enteredPasswordOtp,
                    newPassword: passwordData.newPassword,
                    confirmNewPassword: passwordData.confirmNewPassword,
                })
            ).unwrap();

            setAlertType('success');
            setAlertMessage('Password changed successfully');

            // reset state
            setPasswordOtpSent(false);
            setPasswordData({ newPassword: '', confirmNewPassword: '' });

            // wait 2 seconds before removing token & redirecting
            setTimeout(() => {
                if (role === 'admin') {
                    removeTokenCookie('admin_user');
                } else if (role === 'staff') {
                    removeTokenCookie('staff_user');
                }

                // redirect to login
                navigate('/', { replace: true });
            }, 2000);
        } catch (error: any) {
            setAlertType('error');
            setAlertMessage(error?.message || 'Failed to verify OTP');
        } finally {
            setShowAlert(true);
            setTimeout(() => setShowAlert(false), 4000);
        }
    };


    return (
        <>

            {showAlert && alertType && (
                <div className="p-4">
                    <Alert
                        type={alertType}
                        title={alertType === 'success' ? 'Success!' : alertType === 'error' ? 'Error!' : 'Warning!'}
                        message={alertMessage}
                        variant="filled"
                        showLink={false}
                        linkHref=""
                        linkText=""
                        onClose={() => setShowAlert(false)}
                    />
                </div>
            )}

            <Box className="max-w-6xl mx-auto rounded-xl shadow-md" sx={{ backgroundColor: 'white' }}>
                <Box sx={{
                    background: 'linear-gradient( #255593 103.05%)',
                    height: 60, px: 4, display: 'flex', alignItems: 'center',
                    justifyContent: 'space-between', borderTopLeftRadius: 12, borderTopRightRadius: 12, color: 'white',
                }}>
                    <Typography className="font-outfit" variant="h6">Profile Settings</Typography>
                    {/* <IconButton sx={{ color: 'white' }}><CloseIcon /></IconButton> */}
                </Box>

                <Tabs value={activeTab} onChange={handleTabChange} variant="fullWidth">
                    <Tab className="font-outfit" label="Update Admin Email" />
                    <Tab className="font-outfit" label="Change Admin Password" />
                </Tabs>

                <Box component="div" px={6} py={4}>
                    {activeTab === 0 && (
                        <>
                            {!emailOtpSent && (
                                <div className="grid grid-cols-2 gap-4">
                                    <TextField
                                        label="Current Email"
                                        name="oldEmail"
                                        value={oldEmail}
                                        disabled
                                    />
                                    <TextField
                                        label="New Email"
                                        name="newEmail"
                                        value={emailData.newEmail}
                                        onChange={handleChange}
                                    />
                                </div>
                            )}

                            {!emailOtpSent ? (
                                <div className="mt-6 text-center">
                                    <Button
                                        onClick={handleRequestEmailOtp}
                                        disabled={!emailData.newEmail.trim()}
                                    >
                                        Request OTP
                                    </Button>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center mt-6">
                                    <OTPInput
                                        showOtp={true}
                                        onChangeOtp={(otp: string) => setEnteredEmailOtp(otp)}
                                    />

                                    <div className="mt-4 text-center">
                                        {!emailCanResend ? (
                                            <p className="text-sm text-error-500">OTP expires in {emailTimer} sec</p>
                                        ) : (
                                            <Button
                                                onClick={handleRequestEmailOtp}
                                                variant="customBlue"
                                            >
                                                Resend OTP
                                            </Button>
                                        )}
                                    </div>

                                    {!emailCanResend && (
                                        <div className="mt-4 text-center">
                                            <Button
                                                onClick={handleVerifyEmailOtp}
                                                disabled={!enteredEmailOtp}
                                            >
                                                Verify & Update
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </>
                    )}


                    {activeTab === 1 && (
                        <>
                            {!passwordOtpSent && (
                                <div className="grid grid-cols-2 gap-4">
                                    <TextField
                                        label="New Password"
                                        type="password"
                                        name="newPassword"
                                        value={passwordData.newPassword}
                                        onChange={handlePasswordChange}
                                    />
                                    <TextField
                                        label="Confirm Password"
                                        type="password"
                                        name="confirmNewPassword"
                                        value={passwordData.confirmNewPassword}
                                        onChange={handlePasswordChange}
                                        error={!!passwordError}
                                        helperText={passwordError}
                                    />
                                </div>
                            )}

                            {!passwordOtpSent ? (
                                <div className="mt-6 text-center">
                                    <Button

                                        onClick={handleRequestPasswordOtp}
                                        disabled={
                                            !passwordData.newPassword ||
                                            !passwordData.confirmNewPassword ||
                                            passwordError !== ''
                                        }
                                    >
                                        Request OTP
                                    </Button>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center mt-6">
                                    <OTPInput
                                        showOtp={true}
                                        onChangeOtp={(otp: string) => setEnteredPasswordOtp(otp)}
                                    />

                                    <div className="mt-4 text-center">
                                        {!canResend ? (
                                            <p className="text-sm text-error-500"> OTP expires in {timer} sec</p>
                                        ) : (
                                            <Button onClick={handleRequestPasswordOtp} variant="customBlue">
                                                Resend OTP
                                            </Button>
                                        )}
                                    </div>

                                    {!canResend && (
                                        <div className="mt-4 text-center">
                                            <Button

                                                onClick={handleVerifyPasswordOtp}
                                                disabled={!enteredPasswordOtp}
                                            >
                                                Verify & Update
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </>
                    )}
                </Box>
            </Box>
        </>
    );
};

export default ProfileSetting;
