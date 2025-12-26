import React, { useEffect, useState } from "react";
import { Box, Typography, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import TextField from "../../form/input/InputField";
import Button from "../../ui/button/Button";
import Alert from "../../ui/alert/Alert";



interface Props {
  onCancel: () => void;
  editData?: any;
  isEditMode?: boolean;
  isViewMode?: boolean;
}



type ApplyToType = "SINGLE" | "ALL";

interface SupplementaryBillForm {
  chargeType: string;
  description: string;
  amount: string;
  applyTo: ApplyToType;
  residentId: string;
}



const CHARGE_TYPES = [
  "Penalty Charges",
  "Amenity Charges",
  "Event Charges",
  "One-Time Charges",
];

const emptyForm: SupplementaryBillForm = {
  chargeType: "",
  description: "",
  amount: "",
  applyTo: "ALL",
  residentId: "",
};

const CreateSupplementaryBill: React.FC<Props> = ({
  onCancel,
  editData,
  isEditMode = false,
  isViewMode = false,
}) => {
  const [formData, setFormData] =
    useState<SupplementaryBillForm>(emptyForm);

  const [alertType, setAlertType] =
    useState<"success" | "error" | null>(null);
  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  

  useEffect(() => {
    if (editData) {
      setFormData({ ...emptyForm, ...editData });
    }
  }, [editData]);


  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (
      formData.applyTo === "SINGLE" &&
      !formData.residentId
    ) {
      setAlertType("error");
      setAlertMessage("Please select a resident");
      setShowAlert(true);
      return;
    }

    setIsSubmitting(true);

    // API integration later
    console.log("Supplementary Bill Payload:", formData);

    setAlertType("success");
    setAlertMessage(
      isEditMode
        ? "Supplementary charge updated successfully"
        : "Supplementary charge created successfully"
    );
    setShowAlert(true);

    setTimeout(() => {
      setShowAlert(false);
      onCancel();
    }, 1500);

    setIsSubmitting(false);
  };



  const isFormValid =
    formData.chargeType &&
    formData.amount &&
    formData.applyTo;



  return (
    <>
      {showAlert && alertType && (
        <Alert
          type={alertType}
          title={alertType === "success" ? "Success!" : "Error!"}
          message={alertMessage}
          variant="filled"
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
              ? "Supplementary Charge Details"
              : isEditMode
              ? "Update Supplementary Charge"
              : "Create Supplementary Charge"}
          </Typography>

          <IconButton sx={{ color: "white" }} onClick={onCancel}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* FORM */}
        <Box component="form" onSubmit={handleSubmit} px={6} py={4}>
          <div className="grid grid-cols-2 gap-4">
            {/* CHARGE TYPE */}
            <div>
              <label className="text-sm text-gray-600 mb-1 block">
                Charge Type
              </label>
              <select
                name="chargeType"
                value={formData.chargeType}
                onChange={handleChange}
                disabled={isViewMode}
                className="w-full p-2 border rounded"
              >
                <option value="">Select Charge Type</option>
                {CHARGE_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* AMOUNT */}
            <TextField
              label="Amount"
              name="amount"
              type="number"
              value={formData.amount}
              onChange={handleChange}
              disabled={isViewMode}
            />

            {/* DESCRIPTION */}
            <TextField
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              disabled={isViewMode}
              multiline
            />

            {/* APPLY TO */}
            <div>
              <label className="text-sm text-gray-600 mb-1 block">
                Apply To
              </label>
              <select
                name="applyTo"
                value={formData.applyTo}
                onChange={handleChange}
                disabled={isViewMode}
                className="w-full p-2 border rounded"
              >
                <option value="ALL">All Residents</option>
                <option value="SINGLE">Single Resident</option>
              </select>
            </div>

            {/* RESIDENT (CONDITIONAL) */}
            {formData.applyTo === "SINGLE" && (
              <TextField
                label="Resident ID / Name"
                name="residentId"
                value={formData.residentId}
                onChange={handleChange}
                disabled={isViewMode}
              />
            )}
          </div>

          {/* ACTIONS */}
          <div className="flex justify-center gap-6 mt-6">
            {!isViewMode && (
              <Button disabled={!isFormValid || isSubmitting}>
                {isSubmitting
                  ? "Saving..."
                  : isEditMode
                  ? "Update Charge"
                  : "Create Charge"}
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

export default CreateSupplementaryBill;
