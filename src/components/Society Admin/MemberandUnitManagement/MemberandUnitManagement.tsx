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
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';


import { MRT_ColumnDef } from "material-react-table";
import { useDispatch, useSelector } from "react-redux";

import DataTable from "../../tables/DataTable";
import Button from "../../ui/button/Button";
import SweetAlert from "../../ui/alert/SweetAlert";
import ToggleSwitch from "../../ui/toggleswitch/ToggleSwitch";

import AddResident from "./AddResident";
import ViewResident from "./ViewResident";

import { RootState, AppDispatch } from "../../../store/store";
import {
    fetchResidents,
    deleteResident,
    toggleResidentStatus,
} from "../../../store/SocietyMemberAndUnitManagement/AddResidentSlice";



const MemberandUnitManagement = () => {
    const dispatch = useDispatch<AppDispatch>();

    /*  FIX: use resident slice */
    const { residents, totalItems } = useSelector(
        (state: RootState) => state.adminresident
    );


    const [pageIndex, setPageIndex] = useState(0);
    const [pageSize, setPageSize] = useState(10);

    const [showForm, setShowForm] = useState(false);
    const [selectedResident, setSelectedResident] = useState<any>(null);
    const [showView, setShowView] = useState(false);
    const [selectedSociety, setSelectedSociety] = useState<any>(null);

    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [toggleId, setToggleId] = useState<string | null>(null);
    const [toggleValue, setToggleValue] = useState<boolean>(false);
    const [viewOnly, setViewOnly] = useState(false);






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
                fetchResidents({
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
            fetchResidents({
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
            fetchResidents({
                search: text,
                fromDate,
                toDate,
                exportType,
                page: 0,
                limit: pageSize,
            })
        );
    };


    const handleResidentExcelData = (rows: any[]) => {
        if (!rows || !rows.length) {
            console.error("Excel file is empty");
            return;
        }

        const errors: { row: number; message: string }[] = [];
        const validRows: any[] = [];

        rows.forEach((row, index) => {
            const rowNumber = index + 2; // Excel header = row 1

            if (!row.residentName) {
                errors.push({ row: rowNumber, message: "Resident Name is required" });
                return;
            }

            if (!row.residentType) {
                errors.push({ row: rowNumber, message: "Resident Type is required" });
                return;
            }

            if (!row.mobile || !/^[6-9]\d{9}$/.test(String(row.mobile))) {
                errors.push({ row: rowNumber, message: "Invalid mobile number" });
                return;
            }

            if (
                row.email &&
                !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(row.email))
            ) {
                errors.push({ row: rowNumber, message: "Invalid email format" });
                return;
            }

            if (
                row.residentFlatsize &&
                (isNaN(row.residentFlatsize) || Number(row.residentFlatsize) <= 0)
            ) {
                errors.push({ row: rowNumber, message: "Invalid flat size" });
                return;
            }

            validRows.push({
                residentName: String(row.residentName).trim(),
                residentType: String(row.residentType).trim(),
                email: row.email ? String(row.email).trim() : "",
                mobile: String(row.mobile).trim(),
                residentFlatsize: row.residentFlatsize
                    ? Number(row.residentFlatsize)
                    : null,
                residentFlatarea: row.residentFlatarea
                    ? String(row.residentFlatarea).trim()
                    : "",
                residentParkingname: row.residentParkingname
                    ? String(row.residentParkingname).trim()
                    : "",
                secondresidentName: row.secondresidentName
                    ? String(row.secondresidentName).trim()
                    : "",
                secondresidentEmail: row.secondresidentEmail
                    ? String(row.secondresidentEmail).trim()
                    : "",
                secondresidentMobile: row.secondresidentMobile
                    ? String(row.secondresidentMobile).trim()
                    : "",
            });
        });

   
        if (errors.length) {
            console.error("Excel Validation Errors:", errors);
            return;
        }

        
        console.log("Validated Excel Data:", validRows);

       
    };






    const columns: MRT_ColumnDef<any>[] = [
        { accessorKey: "residentName", header: "Resident Name", filterVariant: "text" },
        { accessorKey: "residentType", header: "Resident Type", filterVariant: "text" },
        { accessorKey: "email", header: "Email", filterVariant: "text" },
        { accessorKey: "mobile", header: "Mobile", filterVariant: "text" },
        { accessorKey: "societyName", header: "Society", filterVariant: "text" },
        { accessorKey: "residentFlatsize", header: "Resident Flat Size", filterVariant: "text" },
        { accessorKey: "residentFlatarea", header: "Resident Flat Area", filterVariant: "text" },
        { accessorKey: "residentParkingname", header: "Parking Name", filterVariant: "text" },
        { accessorKey: "secondresidentName", header: "Secondary Resident Name", filterVariant: "text" },
        { accessorKey: "secondresidentEmail", header: "Secondary Resident Email", filterVariant: "text" },
        { accessorKey: "secondresidentMobile", header: "Secondary Resident Mobile", filterVariant: "text" },
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
                                setSelectedResident(row.original);
                                setShowView(true);
                            }}
                        >
                            <VisibilityIcon />
                        </IconButton>

                    </Tooltip>

                    <Tooltip title="Edit">
                        <IconButton
                            onClick={() => {
                                setSelectedResident(row.original);
                                setViewOnly(false);
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
        await dispatch(deleteResident(deleteId));
        setDeleteId(null);
    };

    return (
        <>
            <SweetAlert
                show={Boolean(deleteId)}
                type="error"
                title="Delete Resident"
                message="Are you sure you want to delete this resident?"
                onConfirm={confirmDelete}
                onCancel={() => setDeleteId(null)}
            />

            <SweetAlert
                show={Boolean(toggleId)}
                type="warning"
                title="Change Resident Status"
                message={`Are you sure you want to ${toggleValue ? "activate" : "deactivate"
                    } this resident?`}
                confirmText={toggleValue ? "Activate" : "Deactivate"}
                cancelText="Cancel"
                onConfirm={() => {
                    if (toggleId) {
                        dispatch(toggleResidentStatus(toggleId));
                    }
                    setToggleId(null);
                }}
                onCancel={() => setToggleId(null)}
            />

            <ViewResident
                open={showView}
                data={selectedResident}
                onClose={() => {
                    setShowView(false);
                    setSelectedResident(null);
                }}
            />


            {showForm ? (
                <AddResident
                    society={selectedSociety}
                    editData={selectedResident}
                    isEditMode={!viewOnly && Boolean(selectedResident)} // ✏️ edit only
                    viewOnly={viewOnly}                                  // 👁️ view only
                    onCancel={() => {
                        setShowForm(false);
                        setSelectedResident(null);
                        setViewOnly(false);
                    }}
                />

            ) : (
                <>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                        <Typography variant="h5" fontWeight={500} className="font-outfit">
                            Member And Unit Management Module
                            <Tooltip title="This module allows the Society Admin to manage all flats/units and residents." arrow>
                                <InfoIcon sx={{ color: "#245492", ml: 1 }} />
                            </Tooltip>
                        </Typography>

                        <Button 
                            onClick={() => {
                                setSelectedResident(null);
                                setShowForm(true);
                            }}
                            
                        >
                            <PersonAddAlt1Icon/> Add Resident
                        </Button>
                    </Box>



                    <DataTable
                        data={residents}
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
                                fetchResidents({
                                    search: searchTerm,
                                    page: pageIndex,
                                    limit: pageSize,
                                })
                            );
                        }}
                        onFileUpload={handleResidentExcelData}
                    />

                </>
            )}
        </>
    );
};

export default MemberandUnitManagement;
