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
    createNotice,
    updateNotice,
} from "../../../store/NoticesandAnnouncementManagementModule/NoticeandAnnouncementSlice";

const ALLOWED_FILE_TYPES = [
    "application/pdf",
    "image/jpeg",
    "image/png",
    "image/jpg",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const stripHtml = (html: string) => {
    return html.replace(/<[^>]*>/g, "").trim();
};


const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB


interface Props {
    onCancel: () => void;
    editData?: any;
    isEditMode: boolean;
    isViewMode?: boolean;
}

/* FORM TYPE */
interface NoticeForm {
    title: string;
    category: string;
    description: string;
    acknowledgeRequired: boolean;
    attachments: File[];
}

/* DEFAULT FORM */
const emptyForm: NoticeForm = {
    title: "",
    category: "",
    description: "",
    acknowledgeRequired: false,
    attachments: [],
};

const CATEGORIES = ["General", "Emergency", "Finance", "Event"];

const CreateNotice: React.FC<Props> = ({
    onCancel,
    editData,
    isEditMode,
    isViewMode = false,
}) => {
    const dispatch = useDispatch<AppDispatch>();

    const [formData, setFormData] = useState<NoticeForm>(emptyForm);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [alertType, setAlertType] =
        useState<"success" | "error" | null>(null);
    const [alertMessage, setAlertMessage] = useState("");
    const [showAlert, setShowAlert] = useState(false);
    const [attachmentError, setAttachmentError] = useState<string>("");
    const [descriptionError, setDescriptionError] = useState("");
    const [categoryError, setCategoryError] = useState("");




    /* INIT DATA */
    useEffect(() => {
        if (editData) {
            setFormData({
                title: editData.title || "",
                category: editData.category || "",
                description: editData.description || "",
                acknowledgeRequired: editData.acknowledgeRequired || false,
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

        if (name === "category") {
            if (!value) {
                setCategoryError("Category is required");
            } else {
                setCategoryError("");
            }
        }

        setFormData((prev) => ({ ...prev, [name]: value }));
    };


    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        const selectedFiles = Array.from(files);
        let error = "";

        if (selectedFiles.length === 0) {
            error = "At least one attachment is required";
        }

        for (const file of selectedFiles) {
            if (!ALLOWED_FILE_TYPES.includes(file.type)) {
                error = "Only PDF, Image, or Doc files are allowed";
                break;
            }

            if (file.size > MAX_FILE_SIZE) {
                error = "Each file must be less than 5 MB";
                break;
            }
        }

        if (error) {
            setAttachmentError(error);
            setFormData((prev) => ({ ...prev, attachments: [] }));
            e.target.value = "";
            return;
        }

        setAttachmentError("");
        setFormData((prev) => ({
            ...prev,
            attachments: selectedFiles,
        }));
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.category) {
            setCategoryError("Category is required");
            setIsSubmitting(false);
            return;
        }

        const plainText = stripHtml(formData.description);

        if (!plainText) {
            setDescriptionError("Description is required");
            setIsSubmitting(false);
            return;
        }

        if (plainText.length < 10) {
            setDescriptionError("Description must be at least 10 characters");
            setIsSubmitting(false);
            return;
        }

        if (!isEditMode && formData.attachments.length === 0) {
            setAttachmentError("Attachments are required");
            setIsSubmitting(false);
            return;
        }

        if (isSubmitting) return;

        setIsSubmitting(true);

        try {
            const payload = new FormData();
            payload.append("title", formData.title);
            payload.append("category", formData.category);
            payload.append("description", formData.description);
            payload.append(
                "acknowledgeRequired",
                String(formData.acknowledgeRequired)
            );

            formData.attachments.forEach((file) => {
                payload.append("attachments", file);
            });

            if (isEditMode && editData?._id) {
                await dispatch(
                    updateNotice({ _id: editData._id, data: payload })
                ).unwrap();
                setAlertMessage("Notice updated successfully");
            } else {
                await dispatch(createNotice(payload)).unwrap();
                setAlertMessage("Notice published successfully");
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
    !!formData.title &&
    !!formData.category &&
    stripHtml(formData.description).length >= 10 &&
    !descriptionError &&
    !categoryError &&
    !attachmentError;




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
                            ? "Notice Details"
                            : isEditMode
                                ? "Update Notice"
                                : "Create Notice"}
                    </Typography>

                    <IconButton sx={{ color: "white" }} onClick={onCancel}>
                        <CloseIcon />
                    </IconButton>
                </Box>

                {/* FORM */}
                <Box component="form" onSubmit={handleSubmit} px={6} py={4}>
                    <div className="grid grid-cols-2 gap-4">
                        <TextField
                            label="Notice Title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            disabled={isViewMode}
                        />

                        {/* CATEGORY */}
                        <div>
                            <label className="text-sm text-gray-600 mb-1 block">
                                Category <span className="text-error-500">*</span>
                            </label>

                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                disabled={isViewMode}
                                className={`w-full p-2 rounded ${categoryError ? "border border-error-500" : "border border-gray-300"
                                    }`}
                            >
                                <option value="">Select Category</option>
                                {CATEGORIES.map((cat) => (
                                    <option key={cat} value={cat}>
                                        {cat}
                                    </option>
                                ))}
                            </select>

                            {categoryError && (
                                <p className="mt-1 text-xs text-error-500">
                                    {categoryError}
                                </p>
                            )}
                        </div>

                    </div>

                    {/* DESCRIPTION */}
                    <div className="mt-4">
                        <label className="text-sm text-gray-600 mb-1 block">
                            Description <span className="text-error-500">*</span>
                        </label>

                        <JoditEditor
                            value={formData.description}
                            config={{
                                readonly: isViewMode,
                                height: 300,
                            }}
                            onBlur={(content) => {
                                const plainText = stripHtml(content);

                                if (!plainText) {
                                    setDescriptionError("Description is required");
                                } else if (plainText.length < 10) {
                                    setDescriptionError("Description must be at least 10 characters");
                                } else {
                                    setDescriptionError("");
                                }

                                setFormData((prev) => ({
                                    ...prev,
                                    description: content,
                                }));
                            }}
                        />

                        {descriptionError && (
                            <p className="mt-1 text-xs text-error-500">
                                {descriptionError}
                            </p>
                        )}
                    </div>


                    {/* ATTACHMENTS */}
                    {!isViewMode && (
                        <div className="mt-4">
                            <label className="text-sm text-gray-600 mb-1 block">
                                Attachments (PDF / Image / Docs)
                                <span className="text-error-500"> *</span>
                            </label>

                            <input
                                type="file"
                                multiple
                                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                                onChange={handleFileChange}
                                className={`w-full border p-2 rounded ${attachmentError ? "border-error-500" : "border-gray-300"
                                    }`}
                            />

                            {attachmentError && (
                                <p className="mt-1 text-xs text-error-500">
                                    {attachmentError}
                                </p>
                            )}
                        </div>
                    )}


                    {/* ACKNOWLEDGE */}
                    <div className="flex items-center gap-2 mt-4">
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
                        <Typography>Acknowledge Required <span className="text-error-500">*</span></Typography>
                    </div>

                    {/* ACTIONS */}
                    <div className="flex justify-center gap-6 mt-6">
                        {!isViewMode && (
                            <Button disabled={!isFormValid || isSubmitting}>
                                {isSubmitting
                                    ? isEditMode
                                        ? "Updating..."
                                        : "Publishing..."
                                    : isEditMode
                                        ? "Update Notice"
                                        : "Publish Notice"}
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

export default CreateNotice;
