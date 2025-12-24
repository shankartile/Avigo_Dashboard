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
import SelectField from "../../form/SelectField";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../store/store";
import { createResidentUser } from "../../../store/SocietyManagement/AddResidentUserSlice";

/* PROPS */
interface Props {
    onCancel: () => void;
    society?: any;
}

/* FORM TYPE */
interface ResidentForm {
    residentName: string;
    residentType: "Owner" | "Tenant" | "";
    flatType: "1RK" | "1BHK" | "2BHK" | "3BHK" | "4BHK" | "5BHK" | "6BHK" | "";
    flatSizeSqFt: string;
    mobile: string;
    email: string;
    secondaryResidentName: string;
    secondaryResidentMobile: string;
    secondaryResidentEmail: string;
}

const emptyForm: ResidentForm = {
    residentName: "",
    residentType: "",
    flatType: "",
    flatSizeSqFt: "",
    mobile: "",
    email: "",
    secondaryResidentName: "",
    secondaryResidentMobile: "",
    secondaryResidentEmail: "",
};

/* COMPONENT*/

const AddResidentUser: React.FC<Props> = ({ onCancel, society }) => {
    const dispatch = useDispatch<AppDispatch>();

    const [formData, setFormData] = useState<ResidentForm>(emptyForm);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [alertType, setAlertType] =
        useState<"success" | "error" | null>(null);
    const [alertMessage, setAlertMessage] = useState("");
    const [showAlert, setShowAlert] = useState(false);

    /* HANDLERS */

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) => {
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
                createResidentUser({
                    societyId: society._id,
                    residentName: formData.residentName,
                    residentType: formData.residentType as "Owner" | "Tenant",
                    flatType: formData.flatType as any,
                    flatSizeSqFt: Number(formData.flatSizeSqFt),
                    mobile: formData.mobile,
                    email: formData.email,
                    secondaryResidentName: formData.secondaryResidentName || undefined,
                    secondaryResidentMobile: formData.secondaryResidentMobile || undefined,
                    secondaryResidentEmail: formData.secondaryResidentEmail || undefined,
                })
            ).unwrap();

            setAlertType("success");
            setAlertMessage("Resident added successfully");
            setShowAlert(true);

            setTimeout(() => {
                setShowAlert(false);
                onCancel();
            }, 1200);
        } catch (err: any) {
            setAlertType("error");
            setAlertMessage(err || "Failed to add resident");
            setShowAlert(true);
        } finally {
            setIsSubmitting(false);
        }
    };

    const isFormValid =
        formData.residentName &&
        formData.residentType &&
        formData.flatType &&
        formData.flatSizeSqFt &&
        formData.mobile &&
        formData.email;

    /*RENDER*/

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
                        Add Resident User
                    </Typography>

                    <IconButton sx={{ color: "white" }} onClick={onCancel}>
                        <CloseIcon />
                    </IconButton>
                </Box>

                {/* FORM */}
                <Box component="form" onSubmit={handleSubmit} px={6} py={4}>
                    {society && (
                        <Typography className="mb-4 text-sm text-gray-600">
                            Society: <strong>{society.societyName}</strong>
                        </Typography>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                        <TextField
                            label="Resident Name"
                            name="residentName"
                            value={formData.residentName}
                            onChange={handleChange}
                        />

                        <SelectField
                            label="Resident Type"
                            name="residentType"
                            value={formData.residentType}
                            onChange={handleChange}
                            options={["Owner", "Tenant"]}
                        />

                        

                        <SelectField
                            label="Flat Type"
                            name="flatType"
                            value={formData.flatType}
                            onChange={handleChange}
                            options={["1RK", "1BHK", "2BHK", "3BHK", "4BHK", "5BHK", "6BHK"]}
                        />

                        <TextField
                            label="Flat Size (Sq Ft)"
                            name="flatSizeSqFt"
                            type="number"
                            value={formData.flatSizeSqFt}
                            onChange={handleChange}
                        />

                        <TextField
                            label="Mobile Number"
                            name="mobile"
                            value={formData.mobile}
                            onChange={handleChange}
                        />

                        <TextField
                            label="Email ID"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                        />

                        <TextField
                            label="Secondary Resident Name"
                            name="secondaryResidentName"
                            value={formData.secondaryResidentName}
                            onChange={handleChange}
                        />

                        <TextField
                            label="Secondary Resident Mobile"
                            name="secondaryResidentMobile"
                            value={formData.secondaryResidentMobile}
                            onChange={handleChange}
                        />

                        <TextField
                            label="Secondary Resident Email"
                            name="secondaryResidentEmail"
                            value={formData.secondaryResidentEmail}
                            onChange={handleChange}
                        />
                    </div>

                    {/* ACTIONS */}
                    <div className="flex justify-center gap-6 mt-6">
                        <Button
                            type="submit"
                            disabled={!isFormValid || isSubmitting}
                        >
                            {isSubmitting ? "Saving..." : "Add Resident"}
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

export default AddResidentUser;
