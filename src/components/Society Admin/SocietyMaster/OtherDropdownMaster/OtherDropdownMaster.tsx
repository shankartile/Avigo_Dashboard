import {
    Box,
    Typography,
    IconButton,
    Dialog,
    DialogContent,
    DialogTitle,
    Tooltip,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import InfoIcon from "@mui/icons-material/Info";
import { MRT_ColumnDef } from "material-react-table";
import { useEffect, useState } from "react";
import TextField from "../../../form/input/InputField";
import Button from "../../../ui/button/Button";
import DataTable from "../../../tables/DataTable";
import ToggleSwitch from "../../../ui/toggleswitch/ToggleSwitch";
import Alert from "../../../ui/alert/Alert";
import SweetAlert from "../../../ui/alert/SweetAlert";

import { useDispatch, useSelector } from "react-redux";
import {
    fetchOtherDropdownMasters,
    addOtherDropdownMaster,
    updateOtherDropdownMaster,
    deleteOtherDropdownMaster,
    toggleOtherDropdownMasterStatus,
} from "../../../../store/SocietyAdminMaster/OtherDropdownMasterSlice";

import { RootState, AppDispatch } from "../../../../store/store";



type OtherDropdownForm = {
    id: string;
    master_type: string;
    name: string;
    description?: string;
};

const OtherDropdownMaster = () => {
    const [form, setForm] = useState<OtherDropdownForm>({
        id: "",
        master_type: "",
        name: "",
        description: "",
    });

    const [editIndex, setEditIndex] = useState<number | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [showView, setShowView] = useState<any>(null);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [toggleItem, setToggleItem] = useState<{ _id: string; isActive: boolean } | null>(null);

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showToggleModal, setShowToggleModal] = useState(false);

    const [alertType, setAlertType] = useState<any>(null);
    const [alertMessage, setAlertMessage] = useState("");
    const [showAlert, setShowAlert] = useState(false);

    const dispatch = useDispatch<AppDispatch>();
    const { list } = useSelector((state: RootState) => state.OtherDropdownMaster);


    useEffect(() => {
        if (form.master_type) {
            dispatch(fetchOtherDropdownMasters({ master_type: form.master_type }));
        }
    }, [form.master_type]);



    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const isFormValid = form.master_type && form.name.trim() !== "";

    const handleAdd = async () => {
        try {
            await dispatch(addOtherDropdownMaster({
                master_type: form.master_type,
                name: form.name,
                description: form.description,
            })).unwrap();

            setAlertType("success");
            setAlertMessage("Dropdown value added successfully.");
            setShowAlert(true);
            setShowForm(false);
        } catch {
            setAlertType("error");
            setAlertMessage("Failed to add dropdown value.");
            setShowAlert(true);
        }
    };


    const handleEdit = (row: any, index: number) => {
        setForm({
            id: row._id,
            master_type: row.master_type,
            name: row.name,
            description: row.description || "",
        });
        setEditIndex(index);
        setShowForm(true);
    };

    const handleUpdate = async () => {
        try {
            await dispatch(updateOtherDropdownMaster({
                _id: form.id,
                name: form.name,
                description: form.description,
            })).unwrap();

            setAlertType("success");
            setAlertMessage("Dropdown value updated successfully.");
            setShowAlert(true);
            setShowForm(false);
            setEditIndex(null);
        } catch {
            setAlertType("error");
            setAlertMessage("Update failed.");
            setShowAlert(true);
        }
    };

    const confirmDelete = async () => {
        if (!deleteId) return;

        await dispatch(deleteOtherDropdownMaster(deleteId));
        setShowDeleteModal(false);
        setDeleteId(null);
    };

    const confirmToggle = async () => {
        if (!toggleItem) return;

        await dispatch(toggleOtherDropdownMasterStatus({
            _id: toggleItem._id,
            isActive: !toggleItem.isActive,
        }));

        setShowToggleModal(false);
        setToggleItem(null);
    };


    /* ================= TABLE ================= */

    const columns: MRT_ColumnDef<any>[] = [
        { accessorKey: "name", header: "Dropdown Value" },
        { accessorKey: "master_type", header: "Master Type" },
        {
            header: "Actions",
            Cell: ({ row }) => (
                <Box display="flex" gap={1}>
                    <Tooltip title="View">
                        <IconButton onClick={() => setShowView(row.original)}>
                            <VisibilityIcon />
                        </IconButton>
                    </Tooltip>

                    <Tooltip title="Edit">
                        <IconButton onClick={() => handleEdit(row.original, row.index)}>
                            <EditIcon />
                        </IconButton>
                    </Tooltip>

                    <IconButton color="error" onClick={() => {
                        setDeleteId(row.original._id);
                        setShowDeleteModal(true);
                    }}>
                        <DeleteIcon />
                    </IconButton>

                    <ToggleSwitch
                        checked={row.original.isActive}
                        onChange={() => {
                            setToggleItem(row.original);
                            setShowToggleModal(true);
                        }}
                    />
                </Box>
            ),
        },
    ];

    return (
        <>
            <SweetAlert
                show={showDeleteModal}
                type="error"
                title="Confirm Delete"
                message="Are you sure you want to delete this value?"
                onConfirm={confirmDelete}
                onCancel={() => setShowDeleteModal(false)}
            />

            <SweetAlert
                show={showToggleModal}
                type="warning"
                title="Confirm Status Change"
                message={`Are you sure you want to ${toggleItem?.isActive ? "deactivate" : "activate"} this value?`}
                onConfirm={confirmToggle}
                onCancel={() => setShowToggleModal(false)}
            />

            {showAlert && (
                <Alert
                    type={alertType}
                    title={alertType === "success" ? "Success" : "Error"}
                    message={alertMessage}
                    onClose={() => setShowAlert(false)}
                />
            )}

            {!showForm ? (
                <>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                        <Typography variant="h5" className="font-outfit">
                            Other Dropdown Master
                            <Tooltip
                                title="Relation Types, Payment Methods, Unit Types, etc."
                                arrow
                            >
                                <InfoIcon sx={{ color: "#245492", ml: 1 }} />
                            </Tooltip>
                        </Typography>

                        <Button onClick={() => {
                            setForm({ id: "", master_type: "", name: "", description: "" });
                            setShowForm(true);
                            setEditIndex(null);
                        }}>
                            <AddIcon /> Add New Master
                        </Button>
                    </Box>

                    <DataTable data={list} columns={columns} />
                </>
            ) : (
                <Dialog
                    open={showForm}
                    onClose={(event, reason) => {
                        if (reason !== "backdropClick") setShowForm(false);
                    }}
                    maxWidth="sm"
                    fullWidth
                    PaperProps={{
                        sx: {
                            borderRadius: "25px",
                            overflow: "hidden",
                        },
                    }}
                    BackdropProps={{
                        sx: {
                            backdropFilter: "blur(4px)",
                            backgroundColor: "rgba(0, 0, 0, 0.2)",
                        },
                    }}
                >
                    {/* ===== HEADER ===== */}
                    <Box
                        sx={{
                            background: "linear-gradient(#255593 103.05%)",
                            height: 60,
                            px: 4,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            color: "white",
                        }}
                    >
                        <Typography
                            className="font-outfit"
                            sx={{ fontSize: "18px", fontWeight: 600 }}
                        >
                            {editIndex !== null ? "Edit Dropdown Value" : "Add Dropdown Value"}
                        </Typography>

                        <IconButton sx={{ color: "white" }} onClick={() => setShowForm(false)}>
                            <CloseIcon />
                        </IconButton>
                    </Box>

                    {/* ===== BODY ===== */}
                    <DialogContent>
                        {/* ALERT INSIDE FORM */}
                        {showAlert && alertType && (
                            <div className="mb-4">
                                <Alert
                                    type={alertType}
                                    title={alertType === "success" ? "Success!" : "Error!"}
                                    message={alertMessage}
                                    variant="filled"
                                    showLink={false}
                                    onClose={() => setShowAlert(false)}
                                />
                            </div>
                        )}

                        {/* ===== FORM FIELDS ===== */}
                        <div className="p-4 grid grid-cols-1 gap-4">

                            {/* MASTER TYPE */}
                            <div className="flex flex-col">
                                <label className="text-sm text-gray-600 mb-1">
                                    Master Type <span className="text-error-500">*</span>
                                </label>

                                <select
                                    name="master_type"
                                    value={form.master_type}
                                    onChange={handleChange}
                                    disabled={editIndex !== null}
                                    className="mt-1 p-2 border rounded"
                                >
                                    <option value="">Select Master Type</option>
                                    <option value="relation_type">Relation Type</option>
                                    <option value="payment_method">Payment Method</option>
                                    <option value="unit_type">Unit Type</option>
                                    <option value="vehicle_type">Vehicle Type</option>
                                    <option value="occupancy_status">Occupancy Status</option>
                                </select>
                            </div>

                            {/* DROPDOWN NAME */}
                            <TextField
                                label="Dropdown Value"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                            />

                            {/* DESCRIPTION */}
                            <TextField
                                label="Description"
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                                multiline
                                rows={3}
                            />
                        </div>

                        {/* ===== ACTION BUTTONS ===== */}
                        <Box display="flex" justifyContent="center" gap={6} mt={4}>
                            <Button
                                className="rounded-[25px]"
                                disabled={!isFormValid}
                                onClick={editIndex !== null ? handleUpdate : handleAdd}
                            >
                                {editIndex !== null ? "Update Dropdown Value" : "Add Dropdown Value"}
                            </Button>

                            <Button
                                variant="secondary"
                                className="rounded-[25px]"
                                onClick={() => setShowForm(false)}
                            >
                                Cancel
                            </Button>
                        </Box>
                    </DialogContent>
                </Dialog>

            )}

            <Dialog
                open={!!showView}
                onClose={() => setShowView(null)}
                maxWidth="xs"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: "25px",
                        overflow: "hidden",
                    },
                }}
                BackdropProps={{
                    sx: {
                        backdropFilter: "blur(4px)",
                        backgroundColor: "rgba(0, 0, 0, 0.2)",
                    },
                }}
            >
                {/* ===== HEADER ===== */}
                <Box
                    sx={{
                        background: "linear-gradient(#255593 103.05%)",
                        height: 60,
                        px: 4,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        color: "white",
                    }}
                >
                    <Typography
                        className="font-outfit"
                        sx={{ fontSize: "18px", fontWeight: 600 }}
                    >
                        Dropdown Details
                    </Typography>

                    <IconButton sx={{ color: "white" }} onClick={() => setShowView(null)}>
                        <CloseIcon />
                    </IconButton>
                </Box>

                {/* ===== BODY ===== */}
                <DialogContent>
                    {showView && (
                        <Box display="flex" flexDirection="column" gap={2} p={2}>
                            <Typography className="font-outfit">
                                <strong>Dropdown Name:</strong> {showView.name}
                            </Typography>

                            <Typography className="font-outfit">
                                <strong>Master Type:</strong> {showView.master_type}
                            </Typography>

                            <Typography className="font-outfit">
                                <strong>Description:</strong>{" "}
                                {showView.description && showView.description.trim() !== ""
                                    ? showView.description
                                    : "-"}
                            </Typography>

                            <Typography className="font-outfit">
                                <strong>Status:</strong>{" "}
                                <span
                                    style={{
                                        color: showView.isActive ? "#16a34a" : "#dc2626",
                                        fontWeight: 600,
                                    }}
                                >
                                    {showView.isActive ? "Active" : "Inactive"}
                                </span>
                            </Typography>
                        </Box>
                    )}
                </DialogContent>
            </Dialog>

        </>
    );
};

export default OtherDropdownMaster;
