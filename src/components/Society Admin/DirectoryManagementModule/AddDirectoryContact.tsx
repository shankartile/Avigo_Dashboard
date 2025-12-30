import React, { useEffect, useState } from "react";
import { Box, Typography, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useDispatch } from "react-redux";

import TextField from "../../form/input/InputField";
import Button from "../../ui/button/Button";
import Alert from "../../ui/alert/Alert";

import { AppDispatch } from "../../../store/store";
import {
    createDirectory,
    updateDirectory,
} from "../../../store/DirectoryManagement/DirectoryManagementSlice";

interface Props {
    onCancel: () => void;
    editData?: any;
    isEditMode: boolean;
    isViewMode?: boolean;
}

/* FORM TYPE */
interface DirectoryForm {
    contact_name: string;
    category: string;
    role_or_service: string;
    phone: string;
    alternate_phone: string;
    email: string;
    description: string;
    visibility: "admin" | "resident";
}

/* DEFAULT FORM */
const emptyForm: DirectoryForm = {
    contact_name: "",
    category: "",
    role_or_service: "",
    phone: "",
    alternate_phone: "",
    email: "",
    description: "",
    visibility: "resident",
};

const CATEGORIES = ["Committee", "Emergency", "Vendor", "Utility"];

const AddDirectoryContact: React.FC<Props> = ({
    onCancel,
    editData,
    isEditMode,
    isViewMode = false,
}) => {
    const dispatch = useDispatch<AppDispatch>();

    const [formData, setFormData] = useState<DirectoryForm>(emptyForm);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [alertType, setAlertType] =
        useState<"success" | "error" | null>(null);
    const [alertMessage, setAlertMessage] = useState("");
    const [showAlert, setShowAlert] = useState(false);

    /* INIT DATA */
    useEffect(() => {
        if (editData) {
            setFormData({
                contact_name: editData.contact_name || "",
                category: editData.category || "",
                role_or_service: editData.role_or_service || "",
                phone: editData.phone || "",
                alternate_phone: editData.alternate_phone || "",
                email: editData.email || "",
                description: editData.description || "",
                visibility: editData.visibility || "resident",
            });
        } else {
            setFormData(emptyForm);
        }
    }, [editData]);

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
        >
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isSubmitting) return;

        setIsSubmitting(true);

        try {
            if (isEditMode && editData?._id) {
                await dispatch(
                    updateDirectory({
                        _id: editData._id,
                        data: formData,
                    })
                ).unwrap();
                setAlertMessage("Contact updated successfully");
            } else {
                await dispatch(createDirectory(formData)).unwrap();
                setAlertMessage("Contact added successfully");
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
        formData.contact_name &&
        formData.category &&
        formData.role_or_service &&
        formData.phone;

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
                            ? "Contact Details"
                            : isEditMode
                                ? "Update Contact"
                                : "Add Contact"}
                    </Typography>

                    <IconButton sx={{ color: "white" }} onClick={onCancel}>
                        <CloseIcon />
                    </IconButton>
                </Box>

                {/* FORM */}
                <Box component="form" onSubmit={handleSubmit} px={6} py={4}>
                    <div className="grid grid-cols-2 gap-4">
                        <TextField
                            label="Contact Name"
                            name="contact_name"
                            value={formData.contact_name}
                            onChange={handleChange}
                            disabled={isViewMode}
                        />

                        <TextField
                            label="Role / Service Type"
                            name="role_or_service"
                            value={formData.role_or_service}
                            onChange={handleChange}
                            disabled={isViewMode}
                        />

                        <TextField
                            label="Phone Number"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            disabled={isViewMode}
                        />

                        <TextField
                            label="Alternate Number"
                            name="alternate_phone"
                            value={formData.alternate_phone}
                            onChange={handleChange}
                            disabled={isViewMode}
                        />

                        <TextField
                            label="Email ID"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            disabled={isViewMode}
                        />

                        {/* CATEGORY */}
                        <div>
                            <label className="text-sm text-gray-600 mb-1 block">
                                Category
                            </label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                disabled={isViewMode}
                                className="w-full p-2 border rounded"
                            >
                                <option value="">Select Category</option>
                                {CATEGORIES.map((cat) => (
                                    <option key={cat} value={cat}>
                                        {cat}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* VISIBILITY */}
                        <div>
                            <label className="text-sm text-gray-600 mb-1 block">
                                Visibility
                            </label>
                            <select
                                name="visibility"
                                value={formData.visibility}
                                onChange={handleChange}
                                disabled={isViewMode}
                                className="w-full p-2 border rounded"
                            >
                                <option value="resident">Visible to Residents</option>
                                <option value="admin">Admin Only</option>
                            </select>
                        </div>
                    </div>

                    {/* DESCRIPTION */}
                    <div className="mt-4">
                        <label className="text-sm text-gray-600 mb-1 block">
                            Description / Notes
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            disabled={isViewMode}
                            className="w-full border rounded p-2"
                            rows={4}
                        />
                    </div>

                    {/* ACTIONS */}
                    <div className="flex justify-center gap-6 mt-6">
                        {!isViewMode && (
                            <Button disabled={!isFormValid || isSubmitting}>
                                {isSubmitting
                                    ? isEditMode
                                        ? "Updating..."
                                        : "Saving..."
                                    : isEditMode
                                        ? "Update Contact"
                                        : "Save Contact"}
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

export default AddDirectoryContact;
