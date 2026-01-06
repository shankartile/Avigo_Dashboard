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
import FileUploadIcon from '@mui/icons-material/FileUpload';

import { MRT_ColumnDef } from "material-react-table";
import { useDispatch, useSelector } from "react-redux";

import DataTable from "../../tables/DataTable";
import Button from "../../ui/button/Button";
import SweetAlert from "../../ui/alert/SweetAlert";
import ToggleSwitch from "../../ui/toggleswitch/ToggleSwitch";
import ViewDocument from "./ViewDocument";
import UploadDocument from "./UploadDocument";

import { RootState, AppDispatch } from "../../../store/store";
import {
    fetchDocuments,
    deleteDocument,
    toggleDocumentStatus,
} from "../../../store/DocumentVaultManagement/DocumentVaultManagementSlice";

const DocumentVaultManagement = () => {
    const dispatch = useDispatch<AppDispatch>();

    const { documents, totalItems } = useSelector(
        (state: RootState) => state.documentvaultmanagement
    );

    const [pageIndex, setPageIndex] = useState(0);
    const [pageSize, setPageSize] = useState(10);

    const [showForm, setShowForm] = useState(false);
    const [selectedDocument, setSelectedDocument] = useState<any>(null);

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
        'all' | 'Bylaws' | 'Circulars' | 'Certificates' | 'Agreements'
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
                fetchDocuments({
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
            fetchDocuments({
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
            fetchDocuments({
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
        { accessorKey: "title", header: "Document Title", filterVariant: "text" },
        {
            accessorKey: "description",
            header: "Description",
            filterVariant: "text",
            Cell: ({ cell }) => {
                const value = cell.getValue<string>() || "";
                const limit = 60; // 🔹 change length if needed

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
            accessorKey: "attachments",
            header: "File Upload",
            filterVariant: "text",
            muiTableBodyCellProps: {
                align: "center",
            },
            muiTableHeadCellProps: {
                align: "center",
            },

            Cell: ({ row }) => {
                const files: string[] = row.original.attachments || [];

                if (!files.length) return <span>-</span>;

                return (
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "6px",
                        }}
                    >
                        {files.map((file, index) => {
                            const fileName = file.split("/").pop(); // extract name

                            return (
                                <span
                                    key={index}
                                    title={fileName}
                                    onClick={() => window.open(file, "_blank")}
                                    style={{
                                        cursor: "pointer",
                                        color: "#1976d2",
                                        fontSize: "13px",
                                        textDecoration: "underline",
                                        textAlign: "center",
                                        wordBreak: "break-all",
                                    }}
                                >
                                    {fileName}
                                </span>
                            );
                        })}
                    </div>
                );
            },
        },
        // {
        //     accessorKey: "category",
        //     header: "Category",
        //     filterVariant: "select",
        //     filterSelectOptions: ["Bylaws", "Circulars", "Certificates", "Agreements"],
        // },
        {
            accessorKey: "category",
            header: "Category",
            filterVariant: "select",
            filterSelectOptions: [
                "Bylaws",
                "Circulars",
                "Certificates",
                "Agreements",
            ],
            Cell: ({ cell }) => {
                const value = cell.getValue<string>();

                return (
                    <Chip
                        label={cell.getValue<string>()}

                        color={
                            cell.getValue() === "Bylaws"
                                ? "primary"
                                : cell.getValue() === "Circulars"
                                    ? "secondary"
                                    : cell.getValue() === "Certificates"
                                        ? "success"
                                        : "warning"
                        }
                        size="small"
                    />
                );
            },
        },

        {
            accessorKey: "createdAt",
            header: "Created Date",
            filterVariant: "text",
        },

        // {
        //     accessorKey: "readCount",
        //     header: "Read Count",
        //     filterVariant: "text",
        //     muiTableBodyCellProps: {
        //         align: "center",
        //     },
        //     muiTableHeadCellProps: {
        //         align: "center",
        //     },
        //     Cell: ({ cell }) => (
        //         <Box
        //             sx={{
        //                 width: 32,
        //                 height: 32,
        //                 borderRadius: "50%",
        //                 backgroundColor: "#ff9800",
        //                 color: "#fff",
        //                 display: "flex",
        //                 alignItems: "center",
        //                 justifyContent: "center",
        //                 fontSize: "14px",
        //                 fontWeight: 600,
        //                 mx: "auto",
        //             }}
        //         >
        //             {cell.getValue<number>()}
        //         </Box>
        //     ),
        // },

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
                                setSelectedDocument(row.original);
                                setShowView(true);
                            }}
                        >
                            <VisibilityIcon />
                        </IconButton>
                    </Tooltip>




                    <Tooltip title="Edit">
                        <IconButton
                            onClick={() => {
                                setSelectedDocument(row.original);
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
        await dispatch(deleteDocument(deleteId));
        setDeleteId(null);
    };

    return (
        <>
            <SweetAlert
                show={Boolean(deleteId)}
                type="error"
                title="Delete Document"
                message="Are you sure you want to delete this document?"
                onConfirm={confirmDelete}
                onCancel={() => setDeleteId(null)}
            />

            <SweetAlert
                show={Boolean(toggleId)}
                type="warning"
                title="Change Document Status"
                message={`Are you sure you want to ${toggleValue ? "activate" : "deactivate"
                    } this document?`}
                confirmText={toggleValue ? "Activate" : "Deactivate"}
                cancelText="Cancel"
                onConfirm={() => {
                    if (toggleId) {
                        dispatch(toggleDocumentStatus(toggleId));
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
            <ViewDocument
                open={showView}
                data={selectedDocument}
                onClose={() => {
                    setShowView(false);
                    setSelectedDocument(null);
                }}
            />

            {/* EDIT / CREATE */}
            {showForm ? (
                <UploadDocument
                    editData={selectedDocument}
                    isEditMode={Boolean(selectedDocument)}
                    onCancel={() => {
                        setShowForm(false);
                        setSelectedDocument(null);
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
                            Document Vault Management Module
                            <Tooltip
                                title="Create, publish and manage society documentThe Document Vault Module allows the Society Admin to store, manage, and share society-related documents securely."
                                arrow
                            >
                                <InfoIcon sx={{ color: "#245492", ml: 1 }} />
                            </Tooltip>
                        </Typography>

                        <Button
                            onClick={() => {
                                setSelectedDocument(null);
                                setShowForm(true);
                            }}
                        >
                            <FileUploadIcon /> Upload Document
                        </Button>
                    </Box>

                    <DataTable
                        key={filterType}
                        data={documents}
                        columns={columns}
                        rowCount={totalItems}
                        pageIndex={pageIndex}
                        pageSize={pageSize}
                        enableColumnFilters
                        columnFilters={columnFilters}
                        onColumnFiltersChange={handleColumnFilterChange}
                        exportType
                        clickHandler={handleSearchAndDownload}
                        enableDocumenttypeFilter
                        documentTypeValue={filterType}
                        onDocumenttypeChange={(category: string) => {
                            setFilterType(category as any);
                            setPageIndex(0);

                            dispatch(
                                fetchDocuments({
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
                                fetchDocuments({
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

export default DocumentVaultManagement;
