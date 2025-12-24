import React, { useState } from "react";
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
import { assignSocietyAdmin } from "../../../store/SocietyManagement/SocietyManagementSlice";

/* PROPS (SAME STYLE) */
interface Props {
  onCancel: () => void;
  society?: any;
}

/* FORM TYPE */
interface AdminForm {
  name: string;
  email: string;
  mobile: string;
}

const emptyForm: AdminForm = {
  name: "",
  email: "",
  mobile: "",
};

const AssignSocietyAdminDialog: React.FC<Props> = ({
  onCancel,
  society,
}) => {
  const [formData, setFormData] = useState<AdminForm>(emptyForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alertType, setAlertType] =
    useState<"success" | "error" | null>(null);
  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const dispatch = useDispatch<AppDispatch>();


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // if (isSubmitting || !society?._id) return;
      if (isSubmitting || !society?._id) {
            setAlertType("error");
            setAlertMessage("Society not selected. Please select a society first.");
            setShowAlert(true);
            return;
        }

    setIsSubmitting(true);

    try {
      await dispatch(
        assignSocietyAdmin({
          societyId: society._id,
          adminName: formData.name,
          adminEmail: formData.email,
          adminPhone: formData.mobile,
        })
      ).unwrap();

      setAlertType("success");
      setAlertMessage("Society admin assigned successfully");
      setShowAlert(true);

      setTimeout(() => {
        setShowAlert(false);
        onCancel();
      }, 1200);
    } catch (err: any) {
      setAlertType("error");
      setAlertMessage(err || "Failed to assign admin");
      setShowAlert(true);
    } finally {
      setIsSubmitting(false);
    }
  };


  const isFormValid =
    formData.name &&
    formData.email &&
    formData.mobile;

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

      <Box className="max-w-3xl mx-auto rounded-xl shadow-md bg-white">
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
            Assign Society Admin
          </Typography>

          <IconButton sx={{ color: "white" }} onClick={onCancel}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* FORM */}
        <Box component="form" onSubmit={handleSubmit} px={6} py={4}>
          {society && (
            <Typography
              className="font-outfit mb-4 text-sm text-gray-600"
            >
              Society: <strong>{society.societyName}</strong>
            </Typography>
          )}

          <div className="grid grid-cols-2 gap-4">
            <TextField
              label="Admin Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />

            <TextField
              label="Admin Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />

            <TextField
              label="Admin Mobile Number"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
            />
          </div>

          {/* ACTIONS */}
          <div className="flex justify-center gap-6 mt-6">
            <Button disabled={!isFormValid || isSubmitting}>
              {isSubmitting ? "Assigning..." : "Assign Admin"}
            </Button>

            <Button variant="secondary" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </Box>
      </Box>
    </>
  );
};

export default AssignSocietyAdminDialog;
