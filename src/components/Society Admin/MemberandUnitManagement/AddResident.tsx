import React, { useEffect, useState } from "react";
import { Box, Typography, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useDispatch } from "react-redux";

import TextField from "../../form/input/InputField";
import Button from "../../ui/button/Button";
import Alert from "../../ui/alert/Alert";

import { AppDispatch } from "../../../store/store";
import {
  createResident,
  updateResident,
} from "../../../store/SocietyMemberAndUnitManagement/AddResidentSlice";

interface Props {
  society?: any;
  onCancel: () => void;
  editData?: any;
  isEditMode: boolean;
   viewOnly?: boolean;
  isViewMode?: boolean;
}

/* FORM TYPE */
interface ResidentForm {
  residentName: string;
  residentType: string;
  mobile: string;
  email: string;
  residentFlatsize: string;
  residentFlatarea: string;
  residentParkingname: string;
  secondresidentName: string;
  secondresidentMobile: string;
  secondresidentEmail: string;
}

/* DEFAULT FORM */
const emptyForm: ResidentForm = {
  residentName: "",
  residentType: "",
  mobile: "",
  email: "",
  residentFlatsize: "",
  residentFlatarea: "",
  residentParkingname: "",
  secondresidentName: "",
  secondresidentMobile: "",
  secondresidentEmail: "",
};

const FLAT_SIZES = [
  "1RK",
  "1BHK",
  "2BHK",
  "3BHK",
  "4BHK",
  "5BHK",
  "BHK",
];

const AddResident: React.FC<Props> = ({
  society,
  onCancel,
  editData,
  isEditMode,
  isViewMode = false,
}) => {
  const dispatch = useDispatch<AppDispatch>();

  const [formData, setFormData] = useState<ResidentForm>(emptyForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alertType, setAlertType] =
    useState<"success" | "error" | null>(null);
  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  /* INIT DATA */
  useEffect(() => {
    if (editData) {
      setFormData({ ...emptyForm, ...editData });
    } else {
      setFormData(emptyForm);
    }
  }, [editData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      const payload = {
        societyId: society?._id,
        ...formData,
      };

      if (isEditMode && editData?._id) {
        await dispatch(
          updateResident({ _id: editData._id, ...payload })
        ).unwrap();
        setAlertMessage("Resident updated successfully");
      } else {
        await dispatch(createResident(payload)).unwrap();
        setAlertMessage("Resident created successfully");
      }

      setAlertType("success");
      setShowAlert(true);

      setTimeout(() => {
        setShowAlert(false);
        onCancel();
      }, 1500);
    } catch (err: any) {
      setAlertType("error");
      setAlertMessage(err || "Something went wrong");
      setShowAlert(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid =
    formData.residentName &&
    formData.residentType &&
    formData.mobile &&
    formData.email &&
    formData.residentFlatsize &&
    formData.residentFlatarea;

  return (
    <>
      {showAlert && alertType && (
        <Alert
          type={alertType}
          title={alertType === "success" ? "Success!" : "Error!"}
          message={alertMessage}
          variant="filled"
          showLink={false}
          onClose={() => setShowAlert(false)}
        />
      )}

      <Box className="max-w-4xl mx-auto rounded-xl shadow-md bg-white">
        {/* HEADER */}
        <Box
          sx={{
            background: "linear-gradient(#255593 103.05%)",
            height: 60,
            px: 4,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTopLeftRadius: 12,
            borderTopRightRadius: 12,
            color: "white",
          }}
        >
          <Typography variant="h6">
            {isViewMode
              ? "Resident Details"
              : isEditMode
              ? "Update Resident"
              : "Create Resident"}
          </Typography>

          <IconButton sx={{ color: "white" }} onClick={onCancel}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* FORM */}
        <Box component="form" onSubmit={handleSubmit} px={6} py={4}>
          <div className="grid grid-cols-2 gap-4">

            <TextField
              label="Resident Name"
              name="residentName"
              value={formData.residentName}
              onChange={handleChange}
              disabled={isViewMode}
            />

            {/* RESIDENT TYPE */}
            <div>
              <label className="text-sm text-gray-600 mb-1 block">
                Resident Type
              </label>
              <select
                name="residentType"
                value={formData.residentType}
                onChange={handleChange}
                disabled={isViewMode}
                className="w-full p-2 border rounded"
              >
                <option value="">Select Type</option>
                <option value="Owner">Owner</option>
                <option value="Tenant">Tenant</option>
              </select>
            </div>

            <TextField
              label="Resident Mobile Number"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              disabled={isViewMode}
            />

            <TextField
              label="Resident Email ID"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled={isViewMode}
            />

            {/* FLAT SIZE */}
            <div>
              <label className="text-sm text-gray-600 mb-1 block">
                Resident Flat Size
              </label>
              <select
                name="residentFlatsize"
                value={formData.residentFlatsize}
                onChange={handleChange}
                disabled={isViewMode}
                className="w-full p-2 border rounded"
              >
                <option value="">Select Flat Size</option>
                {FLAT_SIZES.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>

            <TextField
              label="Resident Flat Area (Sq Ft)"
              name="residentFlatarea"
              type="number"
              value={formData.residentFlatarea}
              onChange={handleChange}
              disabled={isViewMode}
            />

            <TextField
              label="Allotted Parking Name"
              name="residentParkingname"
              value={formData.residentParkingname}
              onChange={handleChange}
              disabled={isViewMode}
            />

            <TextField
              label="Secondary Resident Name"
              name="secondresidentName"
              value={formData.secondresidentName}
              onChange={handleChange}
              disabled={isViewMode}
            />

            <TextField
              label="Secondary Resident Mobile"
              name="secondresidentMobile"
              value={formData.secondresidentMobile}
              onChange={handleChange}
              disabled={isViewMode}
            />

            <TextField
              label="Secondary Resident Email"
              name="secondresidentEmail"
              value={formData.secondresidentEmail}
              onChange={handleChange}
              disabled={isViewMode}
            />

          </div>

          {/* ACTIONS */}
          <div className="flex justify-center gap-6 mt-6">
            {!isViewMode && (
              <Button disabled={!isFormValid || isSubmitting}>
                {isSubmitting
                  ? isEditMode
                    ? "Updating..."
                    : "Creating..."
                  : isEditMode
                  ? "Update Resident"
                  : "Create Resident"}
              </Button>
            )}

            <Button variant="secondary" onClick={onCancel}>
              {isViewMode ? "Back" : "Cancel"}
            </Button>
          </div>
        </Box>
      </Box>
    </>
  );
};

export default AddResident;
