// import { useState, useEffect, useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import { EyeCloseIcon, EyeIcon } from "../../icons";
// import Label from "../form/Label";
// import Input from "../form/input/InputField";
// import Button from "../ui/button/Button";
// import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
// import { requestOtp, verifyOtp } from '../../store/AuthManagement/authSlice';
// import type { RootState, AppDispatch } from '../../store/store';
// import Alert from "../ui/alert/Alert";
// import { useLocation } from 'react-router-dom';
// import ReCAPTCHA from "react-google-recaptcha";
// import { saveCookies } from '../../utility/Cookies';
// import OTPInput from "../form/input/OTPInput";

// export default function SignInForm() {

//   const location = useLocation();


//   const navigate = useNavigate();
//   const [showOtp, setShowOtp] = useState(false);
//   const [otp, setOtp] = useState("");
//   const [timer, setTimer] = useState(60);
//   const [canResend, setCanResend] = useState(false);

//   const [fieldsDisabled, setFieldsDisabled] = useState(false);

//   const [showPassword, setShowPassword] = useState(false);
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [isCaptchaVerified, setCaptchaVerified] = useState(false);
//   const [errorMsg, setErrorMsg] = useState("");
//   const [alert, setAlert] = useState<{
//     type: "success" | "error" | "warning" | "info";
//     title: string;
//     message: string;
//   } | null>(location.state?.alert || null);



//   // Clear alert from history after first read to prevent showing after refresh
//   useEffect(() => {
//     if (location.state?.alert) {
//       window.history.replaceState({}, document.title);
//     }
//   }, [location.state]);

//   // Auto-hide alert after 1500ms
//   useEffect(() => {
//     if (alert) {
//       const timer = setTimeout(() => setAlert(null), 1500);
//       return () => clearTimeout(timer);
//     }
//   }, [alert]);


//   const dispatch = useDispatch<AppDispatch>();
//   const { otpSent, phone, loading, error } = useSelector((state: RootState) => state.auth);


//   const captchaRef = useRef(null);
//   const onChange = () => {
//     setCaptchaVerified(true);
//   };



//   const handleLogin = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!showOtp) {
//       // Validation
//       if (!email.trim() || !password.trim()) {
//         setAlert({
//           type: "error",
//           title: "Missing Fields",
//           message: "Please enter both email and password.",
//         });
//         setTimeout(() => setAlert(null), 6000);
//         return;
//       }

//       if (!isCaptchaVerified) {
//         setAlert({
//           type: "error",
//           title: "CAPTCHA Required",
//           message: "Please complete the CAPTCHA to proceed.",
//         });
//         setTimeout(() => setAlert(null), 6000);
//         return;
//       }

//       try {
//         const res = await dispatch(requestOtp({ email, password })).unwrap();
//         if (res?.message && res?.phone) {
//           setFieldsDisabled(true);
//           setShowOtp(true);
//           setTimer(60);
//           setCanResend(false);

//           // Start countdown
//           const countdown = setInterval(() => {
//             setTimer((prev) => {
//               if (prev === 1) {
//                 clearInterval(countdown);
//                 setCanResend(true);
//               }
//               return prev - 1;
//             });
//           }, 1000);

//           setAlert({
//             type: "info",
//             title: "OTP Sent",
//             message: `An OTP has been sent to your mobile.`,
//           });
//           setTimeout(() => setAlert(null), 6000);
//         }

//         // } catch (err) {
//         //   setAlert({
//         //     type: "error",
//         //     title: "Request Failed",
//         //     message: "Invalid email or password.",
//         //   });
//         //   setTimeout(() => setAlert(null), 6000);
//         //   console.error("OTP request failed:", err);
//         // }
//       } catch (err: any) {
//         const errorMessage = err?.message || 'Something went wrong.';
//         setAlert({
//           type: 'error',
//           title: 'Request Failed',
//           message: errorMessage,
//         });
//         setTimeout(() => setAlert(null), 6000);
//       }

//       return;
//     }

//     // Now in OTP flow
//     if (!otp.trim()) {
//       setAlert({
//         type: "error",
//         title: "Missing OTP",
//         message: "Please enter the OTP sent to your phone.",
//       });
//       setTimeout(() => setAlert(null), 6000);
//       return;
//     }

//     try {
//       const result = await dispatch(verifyOtp({ phone: phone ?? "", enteredOtp: otp })).unwrap();
//       // console.log("OTP verified result:", result);
//       const role = result?.data?.role;

//       // console.log("User role after OTP verification:", role);
//       if (role) {
//         sessionStorage.setItem("activeRole", role);
//       }
//       if (role === "admin") {
//         navigate("/superadmin/dashboard", {
//           state: {
//             alert: {
//               type: "success",
//               title: "Login Successful",
//               message: `Welcome ${role}!`,
//             },
//           },
//         });
//       } else if (role === "staff") {
//         navigate("/staff/dashboard", {
//           state: {
//             alert: {
//               type: "success",
//               title: "Login Successful",
//               message: `Welcome ${role}!`,
//             },
//           },
//         });
//       } else {
//         setAlert({
//           type: "error",
//           title: "Access Denied",
//           message: `Unknown role: ${role}`,
//         });
//         setTimeout(() => setAlert(null), 6000);
//       }
//     } catch (err) {
//       console.error("OTP verification failed:", err);
//       setAlert({
//         type: "error",
//         title: "Verification Failed",
//         message: "Invalid OTP or session expired.",
//       });
//       setTimeout(() => setAlert(null), 6000);
//     }
//   };


//   return (
//     <>
//       {/* Alert at top-left */}
//       {alert && (
//         <div className="absolute top-10 left-5 z-10">
//           <div className="max-w-sm w-full">
//             <Alert
//               type={alert.type}
//               title={alert.title}
//               message={alert.message}
//               variant="filled"
//               showLink={false}
//               linkHref=""
//               linkText=""
//               onClose={() => setAlert(null)}
//             />
//           </div>
//         </div>
//       )}

//       <div className="flex flex-col flex-1">
//         <div className="w-full max-w-md pt-10 mx-auto" />

//         <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
//           <div>
//             <div className="mb-5 sm:mb-8">
//               <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
//                 Sign In
//               </h1>
//               <p className="text-sm text-gray-500 dark:text-gray-400">
//                 {showOtp ? "Verify OTP & Sign In" : "Enter your email and password to sign in!"}
//               </p>
//             </div>

//             <form onSubmit={handleLogin}>
//               <div className="space-y-6">
//                 {!showOtp && (
//                   <>
//                     <div>
//                       <Label>
//                         Email ID <span className="text-error-500">*</span>
//                       </Label>
//                       <Input
//                         placeholder="info@gmail.com"
//                         value={email}
//                         name="email"
//                         onChange={(e) => setEmail(e.target.value)}
//                         label=""
//                       />
//                     </div>

//                     <div>
//                       <Label>
//                         Password <span className="text-error-500">*</span>
//                       </Label>
//                       <div className="relative">
//                         <Input
//                           placeholder="Enter your password"
//                           name="signin_password"
//                           value={password}
//                           onChange={(e) => setPassword(e.target.value)}
//                           type={showPassword ? "text" : "password"}
//                         />
//                       </div>
//                     </div>
//                   </>
//                 )}

//                 {showOtp && (
//                   <OTPInput
//                     showOtp={showOtp}
//                     onChangeOtp={(otp) => setOtp(otp)}
//                   />
//                 )}

//                 {showOtp && (
//                   <div className="flex justify-between items-center">
//                     <p
//                       className={`text-sm ${canResend
//                         ? "text-blue-600"
//                         : "text-red-500 border-b-4 border-red-500 pb-0.5"
//                         }`}
//                     >
//                       {canResend ? (
//                         <button
//                           type="button"
//                           className="text-blue-600 hover:underline"
//                           onClick={async () => {
//                             try {
//                               const res = await dispatch(requestOtp({ email, password })).unwrap();
//                               if (res?.message && res?.phone) {
//                                 setTimer(60);
//                                 setCanResend(false);
//                                 const countdown = setInterval(() => {
//                                   setTimer((prev) => {
//                                     if (prev === 1) {
//                                       clearInterval(countdown);
//                                       setCanResend(true);
//                                     }
//                                     return prev - 1;
//                                   });
//                                 }, 1000);

//                                 setAlert({
//                                   type: "info",
//                                   title: "OTP Resent",
//                                   message: "A new OTP has been sent to your mobile.",
//                                 });
//                                 setTimeout(() => setAlert(null), 6000);
//                               }
//                             } catch (err) {
//                               setAlert({
//                                 type: "error",
//                                 title: "Failed",
//                                 message: "Could not resend OTP. Try again later.",
//                               });
//                               setTimeout(() => setAlert(null), 6000);
//                             }
//                           }}
//                         >
//                           Resend OTP
//                         </button>
//                       ) : (
//                         `OTP Expires in ${timer} sec`
//                       )}
//                     </p>
//                   </div>

//                 )}


//                 {!showOtp && (
//                   <div>
//                     <ReCAPTCHA
//                       className="my-4 ms-2"
//                       ref={captchaRef}
//                       sitekey={import.meta.env.VITE_CAPTCHA_KEY}
//                       onChange={onChange}
//                     />
//                   </div>
//                 )}

//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center gap-3">
//                   </div>

//                   {/* <a
//                     href="/reset-password"
//                     className="text-sm text-green-600 hover:text-green-500 dark:text-green-500"
//                   >
//                     Forgot password?
//                   </a> */}
//                 </div>
//                 <div>
//                   <Button
//                     variant="customBlue"
//                     className={showOtp ? "w-60 group" : "w-full group"}
//                     size="sm"
//                     disabled={showOtp && canResend && !otp}
//                   >
//                     <svg
//                       xmlns="http://www.w3.org/2000/svg"
//                       viewBox="0 0 24 24"
//                       width="24"
//                       height="24"
//                       className="mr-2 transition-transform duration-300 group-hover:rotate-50"
//                     >
//                       <path fill="none" d="M0 0h24v24H0z"></path>
//                       <path
//                         fill="currentColor"
//                         d="M1.946 9.315c-.522-.174-.527-.455.01-.634l19.087-6.362c.529-.176.832.12.684.638l-5.454 19.086c-.15.529-.455.547-.679.045L12 14l6-8-8 6-8.054-2.685z"
//                       ></path>
//                     </svg>
//                     {loading
//                       ? showOtp
//                         ? "Verifying..."
//                         : "Submitting..."
//                       : showOtp
//                         ? "Verify OTP & Sign In"
//                         : "Request OTP"}
//                   </Button>


//                 </div>
//               </div>
//             </form>

//           </div>
//         </div>
//       </div>
//     </>
//   );
// }











import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";
import Alert from "../ui/alert/Alert";
import ReCAPTCHA from "react-google-recaptcha";
import { saveCookies } from "../../utility/Cookies";
import OTPInput from "../form/input/OTPInput";

export default function SignInForm() {
  const location = useLocation();
  const navigate = useNavigate();

  const [showOtp, setShowOtp] = useState(false); // kept for structure
  const [otp, setOtp] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isCaptchaVerified, setCaptchaVerified] = useState(false);

  const [alert, setAlert] = useState<{
    type: "success" | "error" | "warning" | "info";
    title: string;
    message: string;
  } | null>(location.state?.alert || null);

  const captchaRef = useRef<any>(null);

  // Clear alert after refresh
  useEffect(() => {
    if (location.state?.alert) {
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  // Auto hide alert
  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => setAlert(null), 1500);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setAlert({
        type: "error",
        title: "Missing Fields",
        message: "Please enter email and password",
      });
      return;
    }

    if (!isCaptchaVerified) {
      setAlert({
        type: "error",
        title: "CAPTCHA Required",
        message: "Please verify captcha",
      });
      return;
    }

    // 🔹 Dummy credentials
    const admin = {
      email: "admin@avigo.com",
      password: "Admin@123",
      role: "admin",
      permissions: [],
    };

    const staff = {
      email: "staff@avigo.com",
      password: "Staff@123",
      role: "staff",
      permissions: [
        { key: "dashboard", allowed: true },
        { key: "generalmaster", allowed: true },
      ],
    };

    let user = null;

    if (email === admin.email && password === admin.password) {
      user = admin;
    } else if (email === staff.email && password === staff.password) {
      user = staff;
    }

    if (!user) {
      setAlert({
        type: "error",
        title: "Invalid Credentials",
        message: "Email or password is incorrect",
      });
      return;
    }

    // Save role + user
    saveCookies(user);
    sessionStorage.setItem("activeRole", user.role);

    navigate(
      user.role === "admin"
        ? "/superadmin/dashboard"
        : "/admin/dashboard",
      {
        state: {
          alert: {
            type: "success",
            title: "Login Successful",
            message: `Welcome ${user.role}!`,
          },
        },
      }
    );
  };

  return (
    <>
      {/* Alert */}
      {alert && (
        <div className="absolute top-10 left-5 z-10">
          <div className="max-w-sm w-full">
            <Alert
              type={alert.type}
              title={alert.title}
              message={alert.message}
              variant="filled"
              showLink={false}
              linkHref=""
              linkText=""
              onClose={() => setAlert(null)}
            />
          </div>
        </div>
      )}

      <div className="flex flex-col flex-1">
        <div className="w-full max-w-md pt-10 mx-auto" />

        <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
          <div>
            <div className="mb-5 sm:mb-8">
              <h1 className="mb-2 font-semibold text-gray-800 text-title-sm sm:text-title-md">
                Sign In
              </h1>
              <p className="text-sm text-gray-500">
                Enter your email and password to sign in!
              </p>
            </div>

            <form onSubmit={handleLogin}>
              <div className="space-y-6">
                <div>
                  <Label>
                    Email ID <span className="text-error-500">*</span>
                  </Label>
                  <Input
                    placeholder="admin@avigo.com / staff@avigo.com"
                    value={email}
                    name="email"
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div>
                  <Label>
                    Password <span className="text-error-500">*</span>
                  </Label>
                  <Input
                    placeholder="Enter your password"
                    value={password}
                    name="signin_password"
                    type={showPassword ? "text" : "password"}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                <div>
                  <ReCAPTCHA
                    ref={captchaRef}
                    sitekey={import.meta.env.VITE_CAPTCHA_KEY}
                    onChange={() => setCaptchaVerified(true)}
                  />
                </div>

                <Button variant="customBlue" className="w-full group">
                  Sign In
                </Button>
              </div>
            </form>

          </div>
        </div>
      </div>
    </>
  );
}
