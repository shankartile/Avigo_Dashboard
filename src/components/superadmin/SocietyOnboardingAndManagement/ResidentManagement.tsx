import React, { useEffect, useState } from "react";
import {
    Box,
    Typography,
    IconButton,
    Tooltip,
    Chip,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import InfoIcon from "@mui/icons-material/Info";
import { MRT_ColumnDef } from "material-react-table";
import { useDispatch, useSelector } from "react-redux";
import DataTable from "../../tables/DataTable";
import Button from "../../ui/button/Button";
import SweetAlert from "../../ui/alert/SweetAlert";
import ToggleSwitch from "../../ui/toggleswitch/ToggleSwitch";
import AddResidentUser from "../../../components/superadmin/SocietyOnboardingAndManagement/AddResidentUser";
import { RootState, AppDispatch } from "../../../store/store";
import {
    fetchResidentUsers,
    deleteResidentUser,
    toggleResidentUserStatus,
} from "../../../store/SocietyManagement/AddResidentUserSlice";

/*COMPONENT */

const ResidentManagement = () => {
    const dispatch = useDispatch<AppDispatch>();

    const { residents, totalItems } = useSelector(
        (state: RootState) => state.resident
    );

    /* ===== STATES ===== */
    const [pageIndex, setPageIndex] = useState(0);
    const [pageSize, setPageSize] = useState(10);

    const [showForm, setShowForm] = useState(false);
    const [selectedResident, setSelectedResident] = useState<any>(null);
    const [selectedSociety, setSelectedSociety] = useState<any>(null);

    const [deleteId, setDeleteId] = useState<string | null>(null);

    /* ===== FETCH ===== */
    useEffect(() => {
        if (selectedSociety?._id) {
            dispatch(
                fetchResidentUsers({
                    societyId: selectedSociety._id,
                    page: pageIndex,
                    limit: pageSize,
                })
            );
        }
    }, [dispatch, pageIndex, pageSize, selectedSociety]);

    /* ===== TABLE COLUMNS ===== */
    const columns: MRT_ColumnDef<any>[] = [
        { accessorKey: "residentName", header: "Resident Name" },
        { accessorKey: "residentType", header: "Type" },
        { accessorKey: "flatType", header: "Flat Type" },
        { accessorKey: "flatSizeSqFt", header: "Sq Ft" },
        { accessorKey: "mobile", header: "Mobile" },
        { accessorKey: "email", header: "Email" },
        {
            accessorKey: "isActive",
            header: "Status",
            Cell: ({ cell }) =>
                cell.getValue() ? (
                    <Chip label="Active" color="success" size="small" />
                ) : (
                    <Chip label="Inactive" color="error" size="small" />
                ),
        },
        {
            header: "Actions",
            Cell: ({ row }) => (
                <Box display="flex" gap={1}>
                    {/* VIEW */}
                    <Tooltip title="View">
                        <IconButton
                            onClick={() => {
                                setSelectedResident(row.original);
                                setShowForm(true);
                            }}
                        >
                            <VisibilityIcon />
                        </IconButton>
                    </Tooltip>

                    {/* EDIT */}
                    <Tooltip title="Edit">
                        <IconButton
                            onClick={() => {
                                setSelectedResident(row.original);
                                setShowForm(true);
                            }}
                        >
                            <EditIcon />
                        </IconButton>
                    </Tooltip>

                    {/* DELETE */}
                    <Tooltip title="Delete">
                        <IconButton
                            color="error"
                            onClick={() => setDeleteId(row.original._id)}
                        >
                            <DeleteIcon />
                        </IconButton>
                    </Tooltip>

                    {/* TOGGLE */}
                    <ToggleSwitch
                        checked={row.original.isActive}
                        onChange={() =>
                            dispatch(toggleResidentUserStatus(row.original._id))
                        }
                    />
                </Box>
            ),
        },
    ];

    /* ===== DELETE ===== */
    const confirmDelete = async () => {
        if (!deleteId) return;
        await dispatch(deleteResidentUser(deleteId));
        setDeleteId(null);
    };

    /*RENDER*/

    return (
        <>
            {/* DELETE CONFIRM */}
            <SweetAlert
                show={Boolean(deleteId)}
                type="error"
                title="Delete Resident"
                message="Are you sure you want to delete this resident?"
                onConfirm={confirmDelete}
                onCancel={() => setDeleteId(null)}
            />

            {/* ===== CONDITIONAL RENDER ===== */}
            {showForm ? (
                <AddResidentUser
                    society={selectedSociety}
                    onCancel={() => {
                        setShowForm(false);
                        setSelectedResident(null);
                    }}
                />
            ) : (
                <>
                    {/* HEADER */}
                    <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        mb={2}
                    >
                    

                        <Typography variant="h5" fontWeight={500} className="font-outfit">
                            Resident Management{" "}
                            <Tooltip
                                title="Create society resident, edit and manage society resident."
                                arrow
                            >
                                <InfoIcon sx={{ color: "#245492", cursor: "pointer", ml: 1 }} />
                            </Tooltip>
                        </Typography>

                        <Button
                            onClick={() => {
                                setSelectedResident(null);
                                setShowForm(true);
                            }}
                        >
                            <AddIcon /> Add Resident
                        </Button>
                    </Box>

                    {/* TABLE */}
                    <DataTable
                        data={residents}
                        columns={columns}
                        rowCount={totalItems}
                        pageIndex={pageIndex}
                        pageSize={pageSize}
                        onPaginationChange={({ pageIndex, pageSize }) => {
                            setPageIndex(pageIndex);
                            setPageSize(pageSize);
                        }}
                    />
                </>
            )}
        </>
    );
};

export default ResidentManagement;
