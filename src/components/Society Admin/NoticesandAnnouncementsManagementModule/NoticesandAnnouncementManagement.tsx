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
import CampaignIcon from '@mui/icons-material/Campaign';

import { MRT_ColumnDef } from "material-react-table";
import { useDispatch, useSelector } from "react-redux";

import DataTable from "../../tables/DataTable";
import Button from "../../ui/button/Button";
import SweetAlert from "../../ui/alert/SweetAlert";
import ToggleSwitch from "../../ui/toggleswitch/ToggleSwitch";
import ViewNotice from "./ViewNotice";
import AddNotice from "./CreateNotice";

import { RootState, AppDispatch } from "../../../store/store";
import {
    fetchNotices,
    deleteNotice,
    toggleNoticeStatus,
} from "../../../store/NoticesandAnnouncementManagementModule/NoticeandAnnouncementSlice";

const NoticesandAnnouncementManagement = () => {
    const dispatch = useDispatch<AppDispatch>();

    const { notices, totalItems } = useSelector(
        (state: RootState) => state.noticesandannouncement
    );

    const [pageIndex, setPageIndex] = useState(0);
    const [pageSize, setPageSize] = useState(10);

    const [showForm, setShowForm] = useState(false);
    const [selectedNotice, setSelectedNotice] = useState<any>(null);

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
                fetchNotices({
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
            fetchNotices({
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
            fetchNotices({
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
        { accessorKey: "title", header: "Title", filterVariant: "text" },
        {
            accessorKey: "category",
            header: "Category",
            filterVariant: "select",
            filterSelectOptions: ["General", "Emergency", "Finance", "Event"],
        },
        {
            accessorKey: "createdAt",
            header: "Created Date",
            filterVariant: "text",
        },
        {
            accessorKey: "readCount",
            header: "Read Count",
            filterVariant: "text",
            muiTableBodyCellProps: {
                align: "center",
            },
            muiTableHeadCellProps: {
                align: "center",
            },
            Cell: ({ cell }) => (
                <Box
                    sx={{
                        width: 32,
                        height: 32,
                        borderRadius: "50%",
                        backgroundColor: "#ff9800",
                        color: "#fff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "14px",
                        fontWeight: 600,
                        mx: "auto",
                    }}
                >
                    {cell.getValue<number>()}
                </Box>
            ),
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
                    {/* <Tooltip title="View">
                        <IconButton
                            onClick={() => {
                                setSelectedNotice(row.original);
                                setIsViewMode(true);
                                setShowForm(true);
                            }}
                        >
                            <VisibilityIcon />
                        </IconButton>
                    </Tooltip> */}

                    <Tooltip title="View">
                        <IconButton
                            onClick={() => {
                                setSelectedNotice(row.original);
                                setShowView(true);
                            }}
                        >
                            <VisibilityIcon />
                        </IconButton>
                    </Tooltip>




                    <Tooltip title="Edit">
                        <IconButton
                            onClick={() => {
                                setSelectedNotice(row.original);
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
        await dispatch(deleteNotice(deleteId));
        setDeleteId(null);
    };

    return (
        <>
            <SweetAlert
                show={Boolean(deleteId)}
                type="error"
                title="Delete Notice"
                message="Are you sure you want to delete this notice?"
                onConfirm={confirmDelete}
                onCancel={() => setDeleteId(null)}
            />

            <SweetAlert
                show={Boolean(toggleId)}
                type="warning"
                title="Change Notice Status"
                message={`Are you sure you want to ${toggleValue ? "activate" : "deactivate"
                    } this notice?`}
                confirmText={toggleValue ? "Activate" : "Deactivate"}
                cancelText="Cancel"
                onConfirm={() => {
                    if (toggleId) {
                        dispatch(toggleNoticeStatus(toggleId));
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
            <ViewNotice
                open={showView}
                data={selectedNotice}
                onClose={() => {
                    setShowView(false);
                    setSelectedNotice(null);
                }}
            />

            {/* EDIT / CREATE */}
            {showForm ? (
                <AddNotice
                    editData={selectedNotice}
                    isEditMode={Boolean(selectedNotice)}
                    onCancel={() => {
                        setShowForm(false);
                        setSelectedNotice(null);
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
                            Notices & Announcements Management Module
                            <Tooltip
                                title="Create, publish and manage society notices and announcements."
                                arrow
                            >
                                <InfoIcon sx={{ color: "#245492", ml: 1 }} />
                            </Tooltip>
                        </Typography>

                        <Button
                            onClick={() => {
                                setSelectedNotice(null);
                                setShowForm(true);
                            }}
                        >
                            <CampaignIcon /> Create Notice
                        </Button>
                    </Box>

                    <DataTable
                        data={notices}
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
                            dispatch(
                                fetchNotices({
                                    search: searchTerm,
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

export default NoticesandAnnouncementManagement;
