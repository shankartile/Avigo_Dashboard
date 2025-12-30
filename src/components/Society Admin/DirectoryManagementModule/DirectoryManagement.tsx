import React, { useEffect, useRef, useState } from "react";
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
import ViewDirectory from "./ViewDirectory";
import AddDirectoryContact from "./AddDirectoryContact";

import { RootState, AppDispatch } from "../../../store/store";
import {
    fetchDirectories,
    deleteDirectory,
    toggleDirectoryStatus,
} from "../../../store/DirectoryManagement/DirectoryManagementSlice";

const DirectoryManagement = () => {
    const dispatch = useDispatch<AppDispatch>();

    const { directories, totalItems } = useSelector(
        (state: RootState) => state.directorymanagement
    );

    const [pageIndex, setPageIndex] = useState(0);
    const [pageSize, setPageSize] = useState(10);

    const [showForm, setShowForm] = useState(false);
    const [selectedDirectory, setSelectedDirectory] = useState<any>(null);

    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [toggleId, setToggleId] = useState<string | null>(null);
    const [toggleValue, setToggleValue] = useState<boolean>(false);
    const [isViewMode, setIsViewMode] = useState(false);
    const [showView, setShowView] = useState(false);


    const [searchTerm, setSearchTerm] = useState("");
    const [columnFilters, setColumnFilters] = useState<
        { id: string; value: any }[]
    >([]);

    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");

    const debounceRef = useRef<NodeJS.Timeout | null>(null);
    const [filterType, setFilterType] = useState<
        'all' | 'Committee' | 'Emergency' | 'Vendor' | 'Utility'
    >('all');


    const handleColumnFilterChange = (
        filters: { id: string; value: any }[]
    ) => {
        setColumnFilters(filters);
        setPageIndex(0);

        const filterParams: Record<string, any> = {};

        filters.forEach(({ id, value }) => {
            if (!value) return;
            filterParams[id] = id === "isActive" ? value === "Active" : value;
        });

        if (debounceRef.current) clearTimeout(debounceRef.current);

        debounceRef.current = setTimeout(() => {
            dispatch(
                fetchDirectories({
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
            fetchDirectories({
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

        await dispatch(
            fetchDirectories({
                search: text,
                fromDate,
                toDate,
                exportType,
                page: 0,
                limit: pageSize,
            })
        );
    };


    const columns: MRT_ColumnDef<any>[] = [
    {
        accessorKey: "contact_name",
        header: "Contact Name",
        filterVariant: "text",
    },
    {
        accessorKey: "role_or_service",
        header: "Role / Service",
        filterVariant: "text",
    },
    {
        accessorKey: "phone",
        header: "Phone",
        filterVariant: "text",
    },
    {
        accessorKey: "description",
        header: "Description",
        filterVariant: "text",
        Cell: ({ cell }) => {
            const value = cell.getValue<string>() || "";
            const limit = 60;

            return (
                <span title={value}>
                    {value.length > limit
                        ? `${value.substring(0, limit)}...`
                        : value}
                </span>
            );
        },
    },
    {
        accessorKey: "category",
        header: "Category",
        filterVariant: "select",
        filterSelectOptions: [
            "Committee",
            "Emergency",
            "Vendor",
            "Utility",
        ],
        Cell: ({ cell }) => (
            <Chip
                label={cell.getValue<string>()}
                color={
                    cell.getValue() === "Committee"
                        ? "primary"
                        : cell.getValue() === "Emergency"
                            ? "secondary"
                            : cell.getValue() === "Vendor"
                                ? "success"
                                : "warning"
                }
                size="small"
            />
        ),
    },
    {
        accessorKey: "visibility",
        header: "Visibility",
        filterVariant: "select",
        filterSelectOptions: ["admin", "resident"],
        Cell: ({ cell }) => (
            <Chip
                label={
                    cell.getValue() === "admin"
                        ? "Admin Only"
                        : "Residents"
                }
                color={cell.getValue() === "admin" ? "secondary" : "info"}
                size="small"
            />
        ),
    },
    {
        accessorKey: "createdAt",
        header: "Created Date",
        filterVariant: "text",
        Cell: ({ cell }) =>
            new Date(cell.getValue<string>()).toLocaleDateString(),
    },
    {
        accessorKey: "updatedAt",
        header: "Updated Date",
        filterVariant: "text",
        Cell: ({ cell }) =>
            new Date(cell.getValue<string>()).toLocaleDateString(),
    },
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
                            setSelectedDirectory(row.original);
                            setShowView(true);
                        }}
                    >
                        <VisibilityIcon />
                    </IconButton>
                </Tooltip>

                <Tooltip title="Edit">
                    <IconButton
                        onClick={() => {
                            setSelectedDirectory(row.original);
                            setIsViewMode(false);
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
                    onChange={() => {
                        setToggleId(row.original._id);
                        setToggleValue(!row.original.isActive);
                    }}
                />
            </Box>
        ),
    },
];



    const confirmDelete = async () => {
        if (!deleteId) return;
        await dispatch(deleteDirectory(deleteId));
        setDeleteId(null);
    };

    return (
        <>
            <SweetAlert
                show={Boolean(deleteId)}
                type="error"
                title="Delete Directory"
                message="Are you sure you want to delete this directory?"
                onConfirm={confirmDelete}
                onCancel={() => setDeleteId(null)}
            />

            <SweetAlert
                show={Boolean(toggleId)}
                type="warning"
                title="Change Directory Status"
                message={`Are you sure you want to ${toggleValue ? "activate" : "deactivate"
                    } this directory?`}
                confirmText={toggleValue ? "Activate" : "Deactivate"}
                cancelText="Cancel"
                onConfirm={() => {
                    if (toggleId) {
                        dispatch(toggleDirectoryStatus(toggleId));
                    }
                    setToggleId(null);
                }}
                onCancel={() => setToggleId(null)}
            />

            {/* {showForm ? (
                <AddNotice
                    editData={selectedNotice}
                    isEditMode={!isViewMode && Boolean(selectedNotice)}
                    isViewMode={isViewMode}
                    onCancel={() => {
                        setShowForm(false);
                        setSelectedNotice(null);
                        setIsViewMode(false);
                    }}
                /> */}

            {/* VIEW POPUP (always mounted) */}
            <ViewDirectory
                open={showView}
                data={selectedDirectory}
                onClose={() => {
                    setShowView(false);
                    setSelectedDirectory(null);
                }}
            />

            {/* EDIT / CREATE */}
            {showForm ? (
                <AddDirectoryContact
                    editData={selectedDirectory}
                    isEditMode={Boolean(selectedDirectory)}
                    onCancel={() => {
                        setShowForm(false);
                        setSelectedDirectory(null);
                    }}
                />
            ) : (
                <>
                    <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        mb={2}
                    >
                        <Typography variant="h5" fontWeight={500} className="font-outfit">
                            Directory Management Module
                            <Tooltip
                                title="The Directory Module allows the Society Admin to centrally manage and publish important contact information for residents."
                                arrow
                            >
                                <InfoIcon sx={{ color: "#245492", ml: 1 }} />
                            </Tooltip>
                        </Typography>

                        <Button
                            onClick={() => {
                                setSelectedDirectory(null);
                                setShowForm(true);
                            }}
                        >
                            <AddIcon /> Add Directory Contact
                        </Button>
                    </Box>

                    <DataTable
                        key={filterType}
                        data={directories}
                        columns={columns}
                        rowCount={totalItems}
                        pageIndex={pageIndex}
                        pageSize={pageSize}
                        enableColumnFilters
                        columnFilters={columnFilters}
                        onColumnFiltersChange={handleColumnFilterChange}
                        exportType
                        clickHandler={handleSearchAndDownload}
                        enableDirectorytypeFilter
                        directoryTypeValue={filterType}
                        onDirectorytypeChange={(category: string) => {
                            setFilterType(category as any);
                            setPageIndex(0);

                            dispatch(
                                fetchDirectories({
                                    search: searchTerm,
                                    filters: category !== "all" ? { category } : undefined,
                                    fromDate,
                                    toDate,
                                    page: 0,
                                    limit: pageSize,
                                })
                            );
                        }}
                        fromDate={fromDate}
                        toDate={toDate}
                        onFromDateChange={setFromDate}
                        onToDateChange={setToDate}
                        onPaginationChange={({ pageIndex, pageSize }) => {
                            setPageIndex(pageIndex);
                            setPageSize(pageSize);
                            dispatch(
                                fetchDirectories({
                                    search: searchTerm,
                                    filters:
                                        filterType !== "all" ? { category: filterType } : undefined,
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

export default DirectoryManagement;
