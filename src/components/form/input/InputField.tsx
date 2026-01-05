import React, { FC, useState, forwardRef } from "react";
import { EyeCloseIcon, EyeIcon } from "../../../icons";

interface InputProps {
  label?: string;
  type?: string;
  id?: string;
  name?: string;
  placeholder?: string;
  variant?: 'default' | 'otp';
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  success?: boolean;
  error?: boolean;
  helperText?: string;
  required?: boolean;
  multiline?: boolean | string; // Changed to boolean or string for multiline support
  rows?: number; // Added rows prop for multiline input
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  type = 'text',
  id,
  name,
  placeholder,
  value,
  onChange,
  className = '',
  variant = 'default', // Added variant prop with default value
  min,
  max,
  step,
  multiline,
  rows = 3, // Default rows for multiline input
  disabled = false,
  success = false,
  error = false,
  helperText,
  required = true,
  inputProps = {},
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);

  const [localError, setLocalError] = React.useState("");

  const validateField = (name: string | undefined, value: string) => {
    if (!name) return "";

    switch (name) {

      case "category_name":
      case "country_name":
      case "state_name":
      case "city_name":
      case "car_brand_name":
      case "color_name":
      case "bike_color_name":
      case "brand":
      case "fueltype":
      case "ownership":


        if (!value.trim()) return "Name must contain only letters";
        if (!/^[A-Za-z\s]+$/
          .test(value)) return "Name must contain only letters";
        return "";

      // case "car_name":
      //   if (!value.trim()) return "Name must start only with letters";
      //   if (!/^[A-Za-z][A-Za-z\s]*(\s\d+)?$/.test(value))
      //     if (/^\d/.test(value)) return "Name cannot start with a number";
      //   return "";

      case "business_name":
        if (!value.trim()) return "Business Name is required";
        // Must contain at least one letter
        if (!/[A-Za-z]/.test(value)) return "Business Name must contain at least one letter";
        // Only allow letters, numbers, dots, spaces
        if (!/^[A-Za-z0-9.\s]+$/.test(value)) return "Business Name can contain only letters, numbers, dots, and spaces";
        return "";


      case "city":
        if (!value.trim()) return "City must contain only letters";
        if (!/^[A-Za-z\s]+$/
          .test(value)) return "City must contain only letters";
        return "";



      case "year":
        if (!value.trim()) return "Year is required";
        if (!/^[0-9]{4}$/.test(value)) return "Year must be exactly 4 digits";

        const currentYear = new Date().getFullYear();
        const inputYear = parseInt(value, 10);

        if (inputYear > currentYear) return "Future years are not allowed";
        return "";


      case "carkilometer":
        if (!value.trim()) return "Kilometer is required";
        if (!/^\d+$/.test(value)) return "Kilometer must be a number";

        const km = parseInt(value, 10);
        if (km < 0) return "Kilometer cannot be negative";
        if (km > 600000) return "Maximum allowed car kilometer is 6,00,000";
        return "";


      case "bikekilometer":
        if (!value.trim()) return "Kilometer is required";
        if (!/^\d+$/.test(value)) return "Kilometer must be a number";

        const kms = parseInt(value, 10);
        if (kms < 0) return "Kilometer cannot be negative";
        if (kms > 400000) return "Maximum allowed bike kilometer is 4,00,000";
        return "";


      case "color_code":
      case "bike_color_code":
        if (!value.trim()) return "Color code is required";

        const hexRegex = /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;
        const rgbRegex = /^rgb\(\s*(?:[0-9]{1,3}\s*,\s*){2}[0-9]{1,3}\s*\)$/;

        const isValidHex = hexRegex.test(value);
        const isValidRGB = rgbRegex.test(value);

        if (!isValidHex && !isValidRGB) {
          return "Color code must be a valid hex (e.g., #FFF, #FFFFFF) or RGB (e.g., rgb(255, 255, 255)) format";
        }
        return "";


      case "phone":
      case "business_whatsapp_no":
      case "business_contact_no":
        if (!value.trim()) return "Mobile number is required";
        if (!/^[6-9]\d{9}$/.test(value)) return "Mobile must start with 6/7/8/9 and be exactly 10 digits";
        return "";


      case "price":
      case "listings_allowed":
      case "validity_in_days":
        if (!value.trim()) return "This field must be a valid number";
        if (!/^\d+(\.\d{1,2})?$/.test(value)) return "This field must be a valid number";
        return "";


      case "password":
      case "newPassword":
        if (!value.trim()) return "Password is required";
        if (value.length < 8) return "Password must be at least 8 characters";
        if (!/[A-Z]/.test(value)) return "Password must contain at least one uppercase letter";
        if (!/[a-z]/.test(value)) return "Password must contain at least one lowercase letter";
        if (!/[0-9]/.test(value)) return "Password must contain at least one number";
        if (!/[!@#$%^&*()_+]/.test(value)) return "Password must contain at least one special character";
        return "";

      case "signin_password":
        if (!value.trim()) return "Password is required";
        if (value.length < 8) return "Password must be at least 8 characters";
        return "";


      case "aadhar_no":
        if (!value.trim()) return "Aadhar number is required";
        // Aadhar must be exactly 12 digits and not all digits the same
        if (!/^\d{12}$/.test(value)) return "Aadhar number must be exactly 12 digits";
        if (/^(\d)\1{11}$/.test(value)) return "Aadhar number cannot have all digits the same";
        return "";

      case "productId":
        if (!value.trim()) return "Product ID is required";
        if (/[A-Z]/.test(value)) return "Product ID must not contain uppercase letters";
        return "";


      case "basePlanId":
        if (!value.trim()) return "Base Plan ID is required";
        if (/[A-Z]/.test(value)) return "Base Plan ID must not contain uppercase letters";
        return "";





      case "user_name.firstName":
      case "user_name.lastName":

        if (!value.trim()) return "Name must contain only letters";
        if (!/^[A-Za-z\s]+$/
          .test(value)) return "Name must contain only letters";
        return "";

      case "mobile_no":
      case "contact":
      case "mobile":
      case "secondaryResidentMobile":

        if (!value.trim()) return "Mobile number is required";
        if (!/^[6-9]\d{9}$/.test(value)) return "Mobile must start with 6/7/8/9 and be exactly 10 digits";
        return "";

      case "email":
      case "secondaryResidentEmail":
        if (!value.trim()) return "Email is required";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Invalid email format";
        return "";

      case "title":
      case "sub_title":
        if (!value.trim()) return "Title must contain only letters";
        if (!/^[A-Za-z.\s]+$/
          .test(value)) return "Title must contain only letters";
        return "";


      case "ctaLabel":
        if (!value.trim()) return "Label must contain only letters";
        if (!/^[A-Za-z.\s]+$/
          .test(value)) return "Label must contain only letters";
        return "";

      case "category":
        if (!value.trim()) return "Category Name must contain only letters";
        if (!/^[A-Za-z\s]+$/
          .test(value)) return "Category Name must contain only letters";
        return "";

      case "name":
      case "residentName":
      case "secondaryResidentName":
        if (!value.trim()) return " Name must contain only letters";
        if (!/^[A-Za-z\s]+$/
          .test(value)) return " Name must contain only letters";
        return "";
      default:
        return "";

      case "feedbackTitle":
        if (!value.trim()) return "Feedback Title must contain only letters";
        if (!/^[A-Za-z\s]+$/
          .test(value)) return "Feedback Title must contain only letters";
        return "";

      case "email_otp":
      case "mobile_otp":
        if (!value.trim()) return "OTP is required";
        if (!/^[0-9]{4}$/.test(value)) return "OTP must be exactly 4 digits";
        return "";



      case "star_rating":
        if (!value.trim()) return "Star rating is required";

        // Check for numeric with up to 1 decimal place
        if (!/^(?:[1-4](?:\.\d)?|5(?:\.0)?)$/.test(value)) {
          return "Rating must be between 1.0 and 5.0";
        }
        return "";

      case "ctaLink":
        if (!value.trim()) return "CTA Link is required";
        const urlPattern = /^(https?:\/\/)?([\w\-]+\.)+[a-z]{2,}(\/\S*)?$/i;
        if (!urlPattern.test(value)) return "Link must be a valid URL";
        if (value.length > 500) return "Link cannot exceed 500 characters";                  
        return "";


      case "question":
        if (!/[a-zA-Z]/.test(value)) return "Question must contain words, not just numbers";
        if (value.trim().length < 5) return "Question should be at least 5 characters long";
        return "";


      case "answer":
        if (!/[a-zA-Z]/.test(value)) return "Answer must contain words, not just numbers";
        if (value.trim().length < 5) return "Answer should be at least 5 characters long";
        return "";


      //Add society
      case "societyName":
        if (!value.trim()) return "Society name is required";
        if (!/^[A-Za-z0-9\s.-]+$/.test(value))
          return "Society name can contain letters, numbers, spaces, dot and dash only";
        return "";

      case "state":
        if (!value.trim()) return "State is required";
        if (!/^[A-Za-z\s]+$/.test(value))
          return "State must contain only letters";
        return "";

      // case "city":
      //   if (!value.trim()) return "City is required";
      //   if (!/^[A-Za-z\s]+$/.test(value))
      //     return "City must contain only letters";
      //   return "";

      case "address":
        if (!value.trim()) return "Address is required";
        if (value.trim().length < 10)
          return "Address must be at least 10 characters";
        return "";

      case "totalWings":
        if (!value.trim()) return "Total wings is required";
        if (!/^\d+$/.test(value)) return "Total wings must be a number";
        if (parseInt(value) < 1) return "Minimum 1 wing required";
        if (parseInt(value) > 100) return "Maximum 100 wings allowed";
        return "";

      case "floorsPerWing":
        if (!value.trim()) return "Floors per wing is required";
        if (!/^\d+$/.test(value)) return "Floors must be a number";
        if (parseInt(value) < 1) return "Minimum 1 floor required";
        if (parseInt(value) > 50) return "Maximum 50 floors allowed";
        return "";

      case "flatsPerFloor":
        if (!value.trim()) return "Flats per floor is required";
        if (!/^\d+$/.test(value)) return "Flats must be a number";
        if (parseInt(value) < 1) return "Minimum 1 flat required";
        if (parseInt(value) > 20) return "Maximum 20 flats allowed";
        return "";

      //Add Society Staff
      case "role":
        if (!value.trim()) return "Staff role is required";
        if (!/^[A-Za-z\s]+$/.test(value))
          return "Staff role must contain only letters";
        return "";

      case "flatSizeSqFt":
        if (!value) return "Flat size is required";
        if (!/^\d+(\.\d+)?$/.test(value))
          return "Flat size must be a valid number";
        if (Number(value) <= 0)
          return "Flat size must be greater than 0";
        return "";


      case "residentFlatsize":
        if (!value) return "Flat size is required";
        if (!/^\d+(\.\d+)?$/.test(value))
          return "Flat size must be a valid number";
        if (Number(value) <= 0)
          return "Flat size must be greater than 0";
        return "";

      case "residentFlatarea":
        if (!value) return "Flat area is required";
        if (!/^[a-zA-Z0-9\s]+$/.test(value))
          return "Flat area must be valid";
        return "";

      case "residentParkingname":
        if (!value) return "Parking name is required";
        if (!/^[a-zA-Z\s]+$/.test(value))
          return "Parking name must contain only letters";
        return "";

      case "secondresidentName":
        if (!value) return "Second resident name is required";
        if (!/^[a-zA-Z\s]+$/.test(value))
          return "Name must contain only letters";
        return "";

      case "secondresidentMobile":
        if (!value) return "Mobile number is required";
        if (!/^[6-9]\d{9}$/.test(value))
          return "Enter a valid 10-digit mobile number";
        return "";

      case "secondresidentEmail":
        if (!value) return "Email is required";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
          return "Enter a valid email address";
        return "";

      case "contact_name":
        if (!value) return "Contact name is required";
        if (value.length < 2) return "Contact name must be at least 2 characters";
        return "";

   

      case "role_or_service":
        if (!value) return "Role or service is required";
        return "";

  

      case "alternate_phone":
        if (!value.trim()) return "Mobile number is required";
        if (!/^[6-9]\d{9}$/.test(value)) return "Mobile must start with 6/7/8/9 and be exactly 10 digits";
        return "";

      case "description":
        if (!value) return "Description is required";
        if (value.length < 25)
          return "Description must be at least 25 characters";
        return "";

      case "visibility":
        if (!value) return "Visibility is required";
        if (!["admin", "resident"].includes(value))
          return "Invalid visibility option";
        return "";

      case "vendorName":
        if (!value) return "Vendor name is required";
        if (value.length < 2)
          return "Vendor name must be at least 2 characters";
        return "";

      case "gstNumber":
        if (!value) return "GST number is required";
        if (
          !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(value)
        )
          return "Enter a valid GST number";
        return "";

   
      case "purpose":
        if (!value) return "Purpose is required";
        if (value.length < 5)
          return "Purpose must be at least 5 characters";
        return "";








    }
  };


  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    if (name === "changePassword" || name === "newPassword" || name === "confirmNewPassword") {
      e.preventDefault();
    }
  };



  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    let sanitizedValue = value;

    //  Only sanitize text fields, not date/time
    if (type !== "date" && type !== "time") {
      if (name === "category_name" || name === "country_name" || name === "state_name" || name === "city_name" || name === "car_brand_name" || name === "brand" || name === "fueltype" || name === "title" || name === "category" || name === "name" || name === "feedbackTitle" || name === "city" || name === "ownership" || name === "color_name" || name === "bike_color_name" || name === "sub_title") {
        sanitizedValue = sanitizedValue.replace(/[^A-Za-z.\s]/g, '').slice(0, 30);
      }
      if (name === "car_name") {
        sanitizedValue = sanitizedValue.replace(/[^A-Za-z0-9\s]/g, '').slice(0, 30);
      }

      if (name === "business_name") {
        // Remove invalid characters and limit length
        sanitizedValue = sanitizedValue.replace(/[^A-Za-z0-9.\s]/g, '').slice(0, 30);
      }

      if (name === "ctaLabel") {
        sanitizedValue = sanitizedValue.replace(/[^A-Za-z.\s]/g, '').slice(0, 20);
      }

      if (name === "year") {
        sanitizedValue = sanitizedValue.replace(/[^0-9]/g, '').slice(0, 4);
      }

      if (name === "carkilometer") {
        // Remove non-digits
        sanitizedValue = sanitizedValue.replace(/[^0-9]/g, "");

        // Remove leading zeros
        sanitizedValue = sanitizedValue.replace(/^0+(?!$)/, "");

        // Validate maximum limit (600000)
        if (parseInt(sanitizedValue, 10) > 600000) {
          sanitizedValue = "600000";
        }
      }

      if (name === "bikekilometer") {
        // Remove non-digits
        sanitizedValue = sanitizedValue.replace(/[^0-9]/g, "");

        // Remove leading zeros
        sanitizedValue = sanitizedValue.replace(/^0+(?!$)/, "");

        // Validate maximum limit (400000)
        if (parseInt(sanitizedValue, 10) > 400000) {
          sanitizedValue = "400000";
        }
      }

      if (name === "color_code") {
        sanitizedValue = sanitizedValue.trim(); // Trim spaces
      }

      if (name === "phone" || name === "business_contact_no" || name === "business_whatsapp_no") {
        sanitizedValue = sanitizedValue.replace(/[^0-9]/g, '');
        if (sanitizedValue.length > 0 && !/^[6-9]/.test(sanitizedValue)) {
          sanitizedValue = "";
        }
        sanitizedValue = sanitizedValue.slice(0, 10);
      }

      if (name === "price" || name === "validity_in_days" || name === "listings_allowed") {
        sanitizedValue = sanitizedValue.replace(/[^0-9.]/g, ''); // Allow only numbers and decimal point
        if (sanitizedValue && !/^\d+(\.\d{1,2})?$/.test(sanitizedValue)) {
          sanitizedValue = sanitizedValue.slice(0, sanitizedValue.length - 1); // Remove invalid last character
        }
        // Clamp value between 1 and 5000
        const num = parseFloat(sanitizedValue);
        if (!isNaN(num)) {
          if (num > 100000000000) sanitizedValue = "100000000000";
          else if (num < 1) sanitizedValue = "1";
        }
      }

      if (name === "aadhar_no") {
        sanitizedValue = sanitizedValue.replace(/[^0-9]/g, ''); // Allow only digits
        if (sanitizedValue.length > 12) {
          sanitizedValue = sanitizedValue.slice(0, 12); // Limit to 12 digits
        }
      }

      if (name === "productId") {
        // Remove uppercase letters from input
        sanitizedValue = sanitizedValue.replace(/[A-Z]/g, '');
      }


      if (name === "basePlanId") {
        // Remove uppercase letters from input
        sanitizedValue = sanitizedValue.replace(/[A-Z]/g, '');

      }


      if (name === "mobile_no" || name === "contact" || name === "mobile" || name === "secondaryResidentMobile") {
        sanitizedValue = sanitizedValue.replace(/[^0-9]/g, '');
        if (sanitizedValue.length > 0 && !/^[6-9]/.test(sanitizedValue)) {
          sanitizedValue = "";
        }
        sanitizedValue = sanitizedValue.slice(0, 10);
      }

      if (name === "password" || name === "newPassword" || name === "changePassword") {
        sanitizedValue = sanitizedValue.replace(/[^a-zA-Z0-9!@#$%^&*()_+]/g, ''); // Allow only alphanumeric and special characters
        if (sanitizedValue.length > 20) {
          sanitizedValue = sanitizedValue.slice(0, 20);
        }
      }

      if (name === "email_otp" || name === "mobile_otp") {
        sanitizedValue = sanitizedValue.replace(/[^0-9]/g, '').slice(0, 4);
      }

      if (name === "email" || name === "secondaryResidentEmail") {
        sanitizedValue = sanitizedValue.replace(/[^a-zA-Z0-9@._-]/g, ''); // Allow only valid email characters
      }

      if (name === "star_rating") {
        let sanitizedValue = value;

        // Allow only digits and single decimal
        sanitizedValue = sanitizedValue.replace(/[^0-9.]/g, '');

        // Prevent multiple decimals
        const parts = sanitizedValue.split('.');
        if (parts.length > 2) {
          sanitizedValue = parts[0] + '.' + parts[1];
        }

        // Limit to 1 digit after decimal
        if (/^\d+\.\d{2,}$/.test(sanitizedValue)) {
          sanitizedValue = parseFloat(sanitizedValue).toFixed(1);
        }

        // Restrict to 1.0 - 5.0 range
        const floatVal = parseFloat(sanitizedValue);
        if (!isNaN(floatVal)) {
          if (floatVal > 5) sanitizedValue = '5.0';
          else if (floatVal < 1) sanitizedValue = '1.0';
        }

      }

      if (name === "ctaLink") {
        sanitizedValue = sanitizedValue.trim().slice(0, 300);
      }


      if (name === "cgst_percentage" || name === "sgst_percentage") {
        // Allow only digits and a single dot
        sanitizedValue = sanitizedValue.replace(/[^0-9.]/g, '');

        // Ensure only one decimal point
        const parts = sanitizedValue.split('.');
        if (parts.length > 2) {
          sanitizedValue = parts[0] + '.' + parts[1]; // drop extra dots
        }

        // Limit to 2 decimal places
        if (parts.length === 2) {
          parts[1] = parts[1].substring(0, 2); // max two decimal places
          sanitizedValue = parts[0] + '.' + parts[1];
        }

        // Clamp between 0–100
        const num = parseFloat(sanitizedValue);
        if (!isNaN(num)) {
          if (num > 100) sanitizedValue = "100";
          else if (num < 0) sanitizedValue = "0";
        }
      }

      if (name === "question") {
        // Allow normal input, but validation will check if it's only digits
        sanitizedValue = sanitizedValue.trim();
      }
      if (name === "answer") {
        // Allow normal input, but validation will check if it's only digits
        sanitizedValue = sanitizedValue.trim();
      }

      //add Society
      if (name === "societyName") {
        sanitizedValue = sanitizedValue.replace(/[^A-Za-z0-9\s.-]/g, '').slice(0, 50);
      }

      if (name === "state") {
        sanitizedValue = sanitizedValue.replace(/[^A-Za-z\s]/g, '').slice(0, 30);
      }

      if (name === "address") {
        sanitizedValue = sanitizedValue.replace(/[^A-Za-z0-9\s,./-]/g, '').slice(0, 200);
      }

      if (
        name === "totalWings" ||
        name === "floorsPerWing" ||
        name === "flatsPerFloor"
      ) {
        sanitizedValue = sanitizedValue.replace(/[^0-9]/g, '').slice(0, 3);
      }


      //Add Staff
      if (name === "role") {
        sanitizedValue = sanitizedValue.replace(/[^A-Za-z\s]/g, '').slice(0, 30);
      }


      // Resident Name (only letters & space)
      if (name === "residentName") {
        sanitizedValue = sanitizedValue
          .replace(/[^A-Za-z\s]/g, '')
          .slice(0, 50);
      }

      // Flat Size Sq Ft (numbers + single dot, max 2 decimals)
      if (name === "flatSizeSqFt") {
        sanitizedValue = sanitizedValue
          .replace(/[^0-9.]/g, '')
          .replace(/(\..*)\./g, '$1')
          .replace(/^(\d+)(\.\d{0,2}).*$/, '$1$2');
      }

      // Secondary Resident Name (only letters & space)
      if (name === "secondaryResidentName") {
        sanitizedValue = sanitizedValue
          .replace(/[^A-Za-z\s]/g, '')
          .slice(0, 50);
      }

      // Flat size (numbers + decimal only)
      if (name === "residentFlatsize") {
        sanitizedValue = sanitizedValue
          .replace(/[^0-9.]/g, '')
          .slice(0, 10);
      }

      // Flat area (alphanumeric + space)
      if (name === "residentFlatarea") {
        sanitizedValue = sanitizedValue
          .replace(/[^A-Za-z0-9\s]/g, '')
          .slice(0, 50);
      }

      // Parking name (letters + spaces)
      if (name === "residentParkingname") {
        sanitizedValue = sanitizedValue
          .replace(/[^A-Za-z\s]/g, '')
          .slice(0, 30);
      }

      // Second resident name (letters + spaces)
      if (name === "secondresidentName") {
        sanitizedValue = sanitizedValue
          .replace(/[^A-Za-z\s]/g, '')
          .slice(0, 50);
      }

      // Second resident mobile (numbers only, max 10 digits)
      if (name === "secondresidentMobile") {
        sanitizedValue = sanitizedValue
          .replace(/[^0-9]/g, '')
          .slice(0, 10);
      }

      // Second resident email (basic safe chars only)
      if (name === "secondresidentEmail") {
        sanitizedValue = sanitizedValue
          .replace(/[^a-zA-Z0-9@._-]/g, '')
          .slice(0, 100);
      }

      if (name === "contact_name") {
        sanitizedValue = sanitizedValue
          .replace(/[^a-zA-Z\s]/g, "")
          .slice(0, 50);
      }


      if (name === "role_or_service") {
        sanitizedValue = sanitizedValue
          .replace(/[^a-zA-Z0-9\s]/g, "")
          .slice(0, 50);
      }


      if (name === "alternate_phone") {
        sanitizedValue = sanitizedValue
          .replace(/\D/g, "")
          .slice(0, 10);
      }


      if (name === "description") {
        sanitizedValue = sanitizedValue
          .replace(/[^a-zA-Z0-9\s.,-_]/g, "")
          .slice(0, 500);
      }

      if (name === "visibility") {
        sanitizedValue = sanitizedValue
          .replace(/[^a-z]/g, "")
          .slice(0, 10);
      }

      if (name === "vendorName") {
        sanitizedValue = sanitizedValue
          .replace(/[^a-zA-Z\s]/g, "")
          .slice(0, 50);
      }

      if (name === "gstNumber") {
        sanitizedValue = sanitizedValue
          .replace(/[^0-9A-Za-z]/g, "")
          .slice(0, 15)
          .toUpperCase();
      }

 

      if (name === "purpose") {
        sanitizedValue = sanitizedValue
          .replace(/[^a-zA-Z0-9\s]/g, "")
          .slice(0, 100);
      }












    }

    const errorMsg = validateField(name, sanitizedValue);
    setLocalError(errorMsg);

    if (onChange) {
      onChange({
        ...e,
        target: {
          ...e.target,
          name: name,
          value: sanitizedValue,
        }
      } as React.ChangeEvent<HTMLInputElement>);
    }
  };

  let inputClasses = "";

  if (variant === "otp") {
    inputClasses = `w-14 h-14 text-center text-2xl font-bold border border-black rounded p-2 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 ${className}`;
  } else {
    inputClasses = `h-11 w-full border-b bg-transparent px-0 py-2.5 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-0 dark:bg-transparent dark:text-white/90 dark:placeholder:text-white/30 ${className}`;
  }
  if (disabled) {
    inputClasses += ` text-gray-500 border-gray-300 opacity-50 cursor-not-allowed dark:border-gray-700 dark:text-gray-400`;
  } else if (localError || error) {
    inputClasses += ` border-error-500 focus:border-error-400 dark:border-error-500`;
  } else if (success) {
    inputClasses += ` border-success-500 focus:border-success-400 dark:border-success-500`;
  } else {
    inputClasses += ` border-gray-300 focus:border-brand-500 dark:border-gray-700 dark:focus:border-brand-400`;
  }


  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  //  Force value to be a string for date and time inputs
  const inputValue = type === "date" || type === "time"
    ? (value ? String(value) : '')
    : value;




  return (
    <div className="relative">
      {label && (
        <label htmlFor={id} className="text-sm text-gray-600 dark:text-white mb-1 block">
          {label}
          {required && <span className="text-error-500"> * </span>}
          {name === "carkilometer" && (
            <span className="text-sm text-error-500">
              (Maximum allowed car kilometer is 6,00,000)
            </span>
          )}
          {name === "bikekilometer" && (
            <span className="text-sm text-error-500">
              (Maximum allowed bike kilometer is 4,00,000)
            </span>
          )}
        </label>
      )}

      <input
        type={showPassword ? "text" : type} // Toggle password visibility based on state
        id={id || name}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        className={inputClasses}
        {...inputProps}
        ref={ref}
        multiple={multiline === "true"}
        onPaste={handlePaste}

      />
      {type === "password" && (
        <span
          onClick={togglePasswordVisibility}
          className="absolute right-5 top-1/2 -translate-y-1/3 cursor-pointer"
        >
          {showPassword ? (
            <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
          ) : (
            <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
          )}
        </span>
      )}
      {(localError || helperText) && (
        <p className={`mt-1.5 text-xs ${localError ? "text-error-500" : "text-error-500"}`}>
          {localError || helperText}
        </p>
      )}


    </div>
  );
});

export default Input;