import React, { useEffect, useState } from "react";
import { Box, Typography, IconButton, Checkbox } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useDispatch } from "react-redux";
import JoditEditor from "jodit-react";

import TextField from "../../form/input/InputField";
import Button from "../../ui/button/Button";
import Alert from "../../ui/alert/Alert";

import { AppDispatch } from "../../../store/store";
import {
    createDocument,
    updateDocument,
} from "../../../store/DocumentVaultManagement/DocumentVaultManagementSlice";

interface Props {
    onCancel: () => void;
    editData?: any;
    isEditMode: boolean;
    isViewMode?: boolean;
}

/* FORM TYPE */
interface DocumentForm {
    title: string;
    category: string;
    description: string;
    // acknowledgeRequired: boolean;
    attachments: File[];
}

/* DEFAULT FORM */
const emptyForm: DocumentForm = {
    title: "",
    category: "",
    description: "",
    // acknowledgeRequired: false,
    attachments: [],
};

const CATEGORIES = ["Bylaws", "Circulars", "Certificates", "Agreements"];

const UploadDocument: React.FC<Props> = ({
    onCancel,
    editData,
    isEditMode,
    isViewMode = false,
}) => {
    const dispatch = useDispatch<AppDispatch>();

    const [formData, setFormData] = useState<DocumentForm>(emptyForm);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [alertType, setAlertType] =
        useState<"success" | "error" | null>(null);
    const [alertMessage, setAlertMessage] = useState("");
    const [showAlert, setShowAlert] = useState(false);

    /* INIT DATA */
    useEffect(() => {
        if (editData) {
            setFormData({
                title: editData.title || "",
                category: editData.category || "",
                description: editData.description || "",
                // acknowledgeRequired: editData.acknowledgeRequired || false,
                attachments: [],
            });
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

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        setFormData((prev) => ({
            ...prev,
            attachments: Array.from(files),
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isSubmitting) return;

        setIsSubmitting(true);

        try {
            const payload = new FormData();
            payload.append("title", formData.title);
            payload.append("category", formData.category);
            payload.append("description", formData.description);
            // payload.append(
            //     "acknowledgeRequired",
            //     String(formData.acknowledgeRequired)
            // );

            formData.attachments.forEach((file) => {
                payload.append("attachments", file);
            });

            if (isEditMode && editData?._id) {
                await dispatch(
                    updateDocument({ _id: editData._id, data: payload })
                ).unwrap();
                setAlertMessage("Document updated successfully");
            } else {
                await dispatch(createDocument(payload)).unwrap();
                setAlertMessage("Document published successfully");
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
        formData.title && formData.category && formData.description;

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
                            ? "Document Details"
                            : isEditMode
                                ? "Update Document"
                                : "Upload Document"}
                    </Typography>

                    <IconButton sx={{ color: "white" }} onClick={onCancel}>
                        <CloseIcon />
                    </IconButton>
                </Box>

                {/* FORM */}
                <Box component="form" onSubmit={handleSubmit} px={6} py={4}>
                    <div className="grid grid-cols-2 gap-4">
                        <TextField
                            label="Document Title"
                            name="title"
                            value={formData.title}
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
                    </div>

                    {/* DESCRIPTION */}
                    <div className="mt-4">
                        <label className="text-sm text-gray-600 mb-1 block">
                            Description
                        </label>

                        <JoditEditor
                            value={formData.description}
                            config={{
                                readonly: isViewMode,
                                height: 300,
                            }}
                            onBlur={(content) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    description: content,
                                }))
                            }
                        />

                    </div>

                    {/* ATTACHMENTS */}
                    {!isViewMode && (
                        <div className="mt-4">
                            <label className="text-sm text-gray-600 mb-1 block">
                                Attachments (PDF / Image / Docs)
                            </label>
                            <input
                                type="file"
                                multiple
                                onChange={handleFileChange}
                                className="w-full border p-2 rounded"
                            />
                        </div>
                    )}

                    {/* ACKNOWLEDGE */}
                    {/* <div className="flex items-center gap-2 mt-4">
                        <Checkbox
                            checked={formData.acknowledgeRequired}
                            onChange={(e) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    acknowledgeRequired: e.target.checked,
                                }))
                            }
                            disabled={isViewMode}
                        />
                        <Typography>Acknowledge Required</Typography>
                    </div> */}

                    {/* ACTIONS */}
                    <div className="flex justify-center gap-6 mt-6">
                        {!isViewMode && (
                            <Button disabled={!isFormValid || isSubmitting}>
                                {isSubmitting
                                    ? isEditMode
                                        ? "Updating..."
                                        : "Publishing..."
                                    : isEditMode
                                        ? "Update Document"
                                        : "Save Document"}
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

export default UploadDocument;
