import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import TextField from "../../form/input/InputField";
import Button from "../../ui/button/Button";
import Alert from "../../ui/alert/Alert";

import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../store/store";
import {
  addSocieties,
  updateSocieties,
  fetchSocieties,
} from "../../../store/SocietyManagement/SocietyManagementSlice";

/*PROPS (STAFF STYLE)*/
interface Props {
  onCancel: () => void;
  editData?: any;
  isEditMode: boolean;
  isViewMode?: boolean;
}

/*FORM TYPE*/
interface SocietyForm {
  societyName: string;
  state: string;
  city: string;
  address: string;
  totalWings: string;
  floorsPerWing: string;
  flatsPerFloor: string;
}

const STATE_CITY: Record<string, string[]> = {
  Maharashtra: ["Mumbai", "Pune", "Nagpur", "Nashik"],
  Karnataka: ["Bengaluru", "Mysuru", "Hubli"],
  Gujarat: ["Ahmedabad", "Surat", "Vadodara"],
  Delhi: ["New Delhi"],
  Telangana: ["Hyderabad"],
};

const emptyForm: SocietyForm = {
  societyName: "",
  state: "",
  city: "",
  address: "",
  totalWings: "",
  floorsPerWing: "",
  flatsPerFloor: "",
};

const AddEditSocietyDialog: React.FC<Props> = ({
  onCancel,
  editData,
  isEditMode,
  isViewMode = false,
}) => {
  const dispatch = useDispatch<AppDispatch>();

  const [formData, setFormData] = useState<SocietyForm>(emptyForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alertType, setAlertType] =
    useState<"success" | "error" | null>(null);
  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  /* INIT FORM DATA */
  useEffect(() => {
    if (editData) {
      setFormData({
        ...emptyForm,
        ...editData,
        address: editData.address || editData.detailAddress || "",
      });
    } else {
      setFormData(emptyForm);
    }
  }, [editData]);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      if (isEditMode) {
        await dispatch(
          updateSocieties({ _id: editData._id, ...formData })
        ).unwrap();
        setAlertMessage("Society updated successfully");
      } else {
        await dispatch(addSocieties(formData)).unwrap();
        setAlertMessage("Society created successfully");
      }

      setAlertType("success");
      setShowAlert(true);
      dispatch(fetchSocieties({}));

      setTimeout(() => {
        setShowAlert(false);
        onCancel();
      }, 1500);
    } catch (error: any) {
      setAlertType("error");
      setAlertMessage(error?.message || "Something went wrong");
      setShowAlert(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid =
    formData.societyName &&
    formData.state &&
    formData.city &&
    formData.address &&
    formData.totalWings &&
    formData.floorsPerWing &&
    formData.flatsPerFloor;

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
              ? "Society Details"
              : isEditMode
                ? "Update Society"
                : "Create Society"}
          </Typography>

          <IconButton sx={{ color: "white" }} onClick={onCancel}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* FORM */}
        <Box component="form" onSubmit={handleSubmit} px={6} py={4}>
          <div className="grid grid-cols-2 gap-4">
            <TextField
              label="Name of Society"
              name="societyName"
              value={formData.societyName}
              onChange={handleChange}
              disabled={isViewMode}
              className={isViewMode ? "text-gray-900 font-bold text-base" : ""}

            />

            {/* STATE */}
            <div>
              <label className="text-sm text-gray-600 mb-1 block ">
                State
              </label>
              <select
                value={formData.state}
                disabled={isViewMode}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    state: e.target.value,
                    city: "",
                  })
                }
                className="w-full p-2 border rounded "
              >
                <option value="">Select State</option>
                {Object.keys(STATE_CITY).map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            </div>

            {/* CITY */}
            <div>
              <label className="text-sm text-gray-600 mb-1 block">
                City
              </label>
              <select
                value={formData.city}

                disabled={!formData.state || isViewMode}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    city: e.target.value,
                  })
                }
                className="w-full p-2 border rounded"
              >
                <option value="">Select City</option>
                {(STATE_CITY[formData.state] || []).map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>

            <TextField
              label="Detail Address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              disabled={isViewMode}
              className={isViewMode ? "text-gray-900 font-bold text-base" : ""}

            />

            <TextField
              label="Total Number of Wings"
              name="totalWings"
              type="number"
              value={formData.totalWings}
              onChange={handleChange}
              disabled={isViewMode}
              className={isViewMode ? "text-gray-900 font-bold text-base" : ""}
              

            />

            <TextField
              label="Floors per Wing"
              name="floorsPerWing"
              type="number"
              value={formData.floorsPerWing}
              onChange={handleChange}
              disabled={isViewMode}
              className={isViewMode ? "text-gray-900 font-bold text-base" : ""}

            />

            <TextField
              label="Flats per Floor"
              name="flatsPerFloor"
              type="number"
              value={formData.flatsPerFloor}
              onChange={handleChange}
              disabled={isViewMode}
              className={isViewMode ? "text-gray-900 font-bold text-base" : ""}

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
                    ? "Update Society"
                    : "Create Society"}
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

export default AddEditSocietyDialog;
