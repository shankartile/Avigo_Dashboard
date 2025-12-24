import React, { useEffect, useState, useRef } from "react";
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
import AssignSocietyAdminDialog from "../../../components/superadmin/SocietyOnboardingAndManagement/AssignSocietyAdminDialog";
import { RootState, AppDispatch } from "../../../store/store";
import {
    fetchSocietyAdmins,
    deleteSocietyAdmin,
    toggleSocietyAdminStatus,
} from "../../../store/SocietyManagement/AssignSocietyAdminSlice";

/* MAIN COMPONENT */

const SocietyAdminManagement = () => {
    const dispatch = useDispatch<AppDispatch>();

    const { societies, totalItems } = useSelector(
        (state: RootState) => state.society
    );


    /* ===== STATES ===== */
    const [pageIndex, setPageIndex] = useState(0);
    const [pageSize, setPageSize] = useState(10);

    const [showForm, setShowForm] = useState(false);
    const [selectedAdmin, setSelectedAdmin] = useState<any>(null);
    const [selectedSociety, setSelectedSociety] = useState<any>(null);

    const [deleteId, setDeleteId] = useState<string | null>(null);

    const [searchTerm, setSearchTerm] = useState("");
    const [columnFilters, setColumnFilters] = useState<{ id: string; value: any }[]>([]);
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const debounceRef = useRef<NodeJS.Timeout | null>(null);


    /* ===== FETCH ===== */
    // useEffect(() => {
    //     dispatch(fetchSocietyAdmins({ page: pageIndex, limit: pageSize }));
    // }, [dispatch, pageIndex, pageSize]);

    const handleColumnFilterChange = (
        filters: { id: string; value: any }[]
    ) => {
        setColumnFilters(filters);
        setPageIndex(0);

        const filterParams: Record<string, any> = {};

        filters.forEach(({ id, value }) => {
            if (!value) return;

            if (id === "isActive") {
                filterParams[id] = value === "Active";
            } else if (typeof value === "string" && value.trim()) {
                filterParams[id] = value.trim();
            }
        });

        if (debounceRef.current) clearTimeout(debounceRef.current);

        debounceRef.current = setTimeout(() => {
            dispatch(
                fetchSocietyAdmins({
                    search: searchTerm,
                    filters: filterParams,
                    fromDate: fromDate || undefined,
                    toDate: toDate || undefined,
                    page: 0,
                    limit: pageSize,
                })
            );
        }, 500);
    };


    useEffect(() => {
        if ((fromDate && !toDate) || (!fromDate && toDate)) return;

        dispatch(
            fetchSocietyAdmins({
                fromDate: fromDate || undefined,
                toDate: toDate || undefined,
                page: 0,
                limit: pageSize,
            })
        );
    }, [fromDate, toDate]);


    const handleSearchAndDownload = async (
        text: string,
        exportType?: "csv" | "pdf"
    ) => {
        setSearchTerm(text);
        setPageIndex(0);

        if (exportType) {
            await dispatch(
                fetchSocietyAdmins({
                    search: text,
                    fromDate,
                    toDate,
                    exportType,
                })
            );
        } else {
            dispatch(
                fetchSocietyAdmins({
                    search: text,
                    fromDate,
                    toDate,
                    page: 0,
                    limit: pageSize,
                })
            );
        }
    };






    /* ===== TABLE COLUMNS ===== */
    const columns: MRT_ColumnDef<any>[] = [
        { accessorKey: "name", header: "Admin Name", filterVariant: "text" },
        { accessorKey: "email", header: "Email", filterVariant: "text" },
        { accessorKey: "mobile", header: "Mobile", filterVariant: "text" },
        { accessorKey: "societyName", header: "Society", filterVariant: "text" },
        {
            accessorKey: "isActive",
            header: "Status",
            filterVariant: "select",
            filterSelectOptions: ["Active", "Inactive"],
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
                    <Tooltip title="View">
                        <IconButton
                            onClick={() => {
                                setSelectedAdmin(row.original);
                                setShowForm(true);
                            }}
                        >
                            <VisibilityIcon />
                        </IconButton>
                    </Tooltip>

                    <Tooltip title="Edit">
                        <IconButton
                            onClick={() => {
                                setSelectedAdmin(row.original);
                                setShowForm(true);
                            }}
                        >
                            <EditIcon />
                        </IconButton>
                    </Tooltip>

                    <Tooltip title="Delete">
                        <IconButton
                            color="error"
                            onClick={() => setDeleteId(row.original._id)}
                        >
                            <DeleteIcon />
                        </IconButton>
                    </Tooltip>

                    <ToggleSwitch
                        checked={row.original.isActive}
                        onChange={() =>
                            dispatch(toggleSocietyAdminStatus(row.original._id))
                        }
                    />
                </Box>
            ),
        },
    ];


    /* ===== DELETE ===== */
    const confirmDelete = async () => {
        if (!deleteId) return;
        await dispatch(deleteSocietyAdmin(deleteId));
        setDeleteId(null);
    };

    /*RENDER*/

    return (
        <>
            {/* DELETE CONFIRM */}
            <SweetAlert
                show={Boolean(deleteId)}
                type="error"
                title="Delete Admin"
                message="Are you sure you want to delete this admin?"
                onConfirm={confirmDelete}
                onCancel={() => setDeleteId(null)}
            />

            {/* ===== CONDITIONAL RENDER ===== */}
            {showForm ? (
                <AssignSocietyAdminDialog
                    society={selectedSociety}
                    onCancel={() => {
                        setShowForm(false);
                        setSelectedAdmin(null);
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
                            Assign Society Admin{" "}
                            <Tooltip
                                title="Create society admin, edit and manage society admin."
                                arrow
                            >
                                <InfoIcon sx={{ color: "#245492", cursor: "pointer", ml: 1 }} />
                            </Tooltip>
                        </Typography>

                        <Button
                            onClick={() => {
                                setSelectedAdmin(null);
                                setShowForm(true);
                            }}
                        >
                            <AddIcon /> Add Admin
                        </Button>
                    </Box>

                    {/* TABLE */}
                    <DataTable
                        data={societies}
                        columns={columns}
                        rowCount={totalItems}
                        pageIndex={pageIndex}
                        pageSize={pageSize}

                        enableColumnFilters
                        columnFilters={columnFilters}
                        onColumnFiltersChange={handleColumnFilterChange}

                        exportType
                        clickHandler={handleSearchAndDownload}

                        fromDate={fromDate}
                        toDate={toDate}
                        onFromDateChange={setFromDate}
                        onToDateChange={setToDate}

                        onPaginationChange={({ pageIndex, pageSize }) => {
                            setPageIndex(pageIndex);
                            setPageSize(pageSize);

                            const filterParams: Record<string, any> = {};
                            columnFilters.forEach(({ id, value }) => {
                                if (!value) return;
                                filterParams[id] =
                                    id === "isActive" ? value === "Active" : value;
                            });

                            dispatch(
                                fetchSocietyAdmins({
                                    search: searchTerm,
                                    filters: filterParams,
                                    fromDate,
                                    toDate,
                                    page: pageIndex,
                                    limit: pageSize,
                                })
                            );
                        }}
                    />


                </>
            )}
        </>
    );
};

export default SocietyAdminManagement;
