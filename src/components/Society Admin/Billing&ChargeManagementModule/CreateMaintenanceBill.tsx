import React, { useEffect, useState } from "react";
import { Box, Typography, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import TextField from "../../form/input/InputField";
import Button from "../../ui/button/Button";
import Alert from "../../ui/alert/Alert";

/* ================= TYPES ================= */

interface Props {
  onCancel: () => void;
  editData?: any;
  isEditMode?: boolean;
  isViewMode?: boolean;
}

type BillingMode = "SPECIFIC" | "ALL";

interface MaintenanceBillForm {
  billingMode: BillingMode;
  flatType: string;
  maintenanceAmount: string;
  fixedCharges: string;
  penaltyAmount: string;
  billingYear: string;
}

/* ================= CONSTANTS ================= */

const FLAT_TYPES = [
  "1RK",
  "1BHK",
  "2BHK",
  "3BHK",
  "4BHK",
  "5BHK",
  "6BHK",
];

const emptyForm: MaintenanceBillForm = {
  billingMode: "SPECIFIC",
  flatType: "",
  maintenanceAmount: "",
  fixedCharges: "",
  penaltyAmount: "",
  billingYear: "",
};

const CreateMaintenanceBill: React.FC<Props> = ({
  onCancel,
  editData,
  isEditMode = false,
  isViewMode = false,
}) => {
  const [formData, setFormData] =
    useState<MaintenanceBillForm>(emptyForm);

  const [alertType, setAlertType] =
    useState<"success" | "error" | null>(null);
  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  /* ================= INIT ================= */

  useEffect(() => {
    if (editData) {
      setFormData({ ...emptyForm, ...editData });
    }
  }, [editData]);

  /* ================= HANDLERS ================= */

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validatePenalty = () => {
    const maintenance = Number(formData.maintenanceAmount);
    const penalty = Number(formData.penaltyAmount);
    return penalty <= maintenance * 0.21;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (
      formData.billingMode === "SPECIFIC" &&
      !validatePenalty()
    ) {
      setAlertType("error");
      setAlertMessage(
        "Penalty charge cannot exceed 21% of maintenance amount"
      );
      setShowAlert(true);
      return;
    }

    setIsSubmitting(true);

    // 🔴 API integration later
    console.log("Maintenance Bill Payload:", formData);

    setAlertType("success");
    setAlertMessage(
      isEditMode
        ? "Maintenance bill updated successfully"
        : "Maintenance bill created successfully"
    );
    setShowAlert(true);

    setTimeout(() => {
      setShowAlert(false);
      onCancel();
    }, 1500);

    setIsSubmitting(false);
  };

  /* ================= VALIDATION ================= */

  const isFormValid =
    formData.billingYear &&
    (formData.billingMode === "ALL"
      ? formData.fixedCharges
      : formData.flatType && formData.maintenanceAmount);

  /* ================= UI ================= */

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
            {isEditMode
              ? "Update Maintenance Bill"
              : "Create Maintenance Bill"}
          </Typography>

          <IconButton sx={{ color: "white" }} onClick={onCancel}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* FORM */}
        <Box component="form" onSubmit={handleSubmit} px={6} py={4}>
          {/* BILLING MODE */}
          <div className="mb-4">
            <label className="text-sm text-gray-600 mb-1 block">
              Billing Type
            </label>
            <select
              name="billingMode"
              value={formData.billingMode}
              onChange={handleChange}
              disabled={isViewMode}
              className="w-full p-2 border rounded"
            >
              <option value="SPECIFIC">Specific Flat Type</option>
              <option value="ALL">All Flat Types</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* SPECIFIC FLAT TYPE */}
            {formData.billingMode === "SPECIFIC" && (
              <>
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">
                    Flat Type
                  </label>
                  <select
                    name="flatType"
                    value={formData.flatType}
                    onChange={handleChange}
                    disabled={isViewMode}
                    className="w-full p-2 border rounded"
                  >
                    <option value="">Select Flat Type</option>
                    {FLAT_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                <TextField
                  label="Fixed Monthly Maintenance Charges"
                  name="maintenanceAmount"
                  type="number"
                  value={formData.maintenanceAmount}
                  onChange={handleChange}
                  disabled={isViewMode}
                />

                <TextField
                  label="Monthly Penalty Charge"
                  name="penaltyAmount"
                  type="number"
                  value={formData.penaltyAmount}
                  onChange={handleChange}
                  disabled={isViewMode}
                />
              </>
            )}

            {/* ALL FLAT TYPE */}
            {formData.billingMode === "ALL" && (
              <>
                <TextField
                  label="Fixed Monthly Charges"
                  name="fixedCharges"
                  type="number"
                  value={formData.fixedCharges}
                  onChange={handleChange}
                  disabled={isViewMode}
                />

                <TextField
                  label="Monthly Maintenance Charges"
                  name="maintenanceAmount"
                  type="number"
                  value={formData.maintenanceAmount}
                  onChange={handleChange}
                  disabled={isViewMode}
                />
              </>
            )}

            {/* YEAR */}
            <TextField
              label="Billing Year"
              name="billingYear"
              type="number"
              value={formData.billingYear}
              onChange={handleChange}
              disabled={isViewMode}
            />
          </div>

          {/* ACTIONS */}
          <div className="flex justify-center gap-6 mt-6">
            {!isViewMode && (
              <Button disabled={!isFormValid || isSubmitting}>
                {isSubmitting
                  ? "Saving..."
                  : isEditMode
                  ? "Update Bill"
                  : "Create Bill"}
              </Button>
            )}

            <Button variant="secondary" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </Box>
      </Box>
    </>
  );
};

export default CreateMaintenanceBill;
