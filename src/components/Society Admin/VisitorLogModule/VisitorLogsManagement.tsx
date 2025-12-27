import React, { useEffect, useRef, useState } from "react";
import {
    Box,
    Typography,
    IconButton,
    Tooltip,
    Chip,
    Avatar,
} from "@mui/material";

import VisibilityIcon from "@mui/icons-material/Visibility";
import NumbersIcon from "@mui/icons-material/Numbers";
import SummarizeIcon from "@mui/icons-material/Summarize";
import InfoIcon from "@mui/icons-material/Info";
import GroupIcon from "@mui/icons-material/Group";

import { MRT_ColumnDef } from "material-react-table";
import { useDispatch, useSelector } from "react-redux";

import DataTable from "../../tables/DataTable";
import SweetAlert from "../../ui/alert/SweetAlert";
import ViewVisitor from "./ViewVisitor";
import ViewVisitorTodaySummary from "./VisitorTodaySummary";

import { RootState, AppDispatch } from "../../../store/store";
import {
    fetchVisitorLogs,
} from "../../../store/VisitorLogModule/visitorLogsSlice";

const VisitorLogsManagement = () => {
    const dispatch = useDispatch<AppDispatch>();

    const { visitors, totalItems, summary } = useSelector(
        (state: RootState) => state.visitorLogs
    );

    const [pageIndex, setPageIndex] = useState(0);
    const [pageSize, setPageSize] = useState(10);

    const [searchTerm, setSearchTerm] = useState("");
    const [columnFilters, setColumnFilters] = useState<
        { id: string; value: any }[]
    >([]);

    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");

    const [selectedVisitor, setSelectedVisitor] = useState<any>(null);
    const [showView, setShowView] = useState(false);
    const [showSummary, setShowSummary] = useState(false);


    const debounceRef = useRef<NodeJS.Timeout | null>(null);


    const [filterType, setFilterType] = useState<
        'all' | 'Guest' | 'Delivery' | 'Vendor'
    >('all');


    const handleColumnFilterChange = (
        filters: { id: string; value: any }[]
    ) => {
        setColumnFilters(filters);
        setPageIndex(0);

        const filterParams: Record<string, any> = {};
        filters.forEach(({ id, value }) => {
            if (!value) return;
            filterParams[id] = value;
        });

        if (debounceRef.current) clearTimeout(debounceRef.current);

        debounceRef.current = setTimeout(() => {
            dispatch(
                fetchVisitorLogs({
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
            fetchVisitorLogs({
                fromDate: fromDate || undefined,
                toDate: toDate || undefined,
                page: 0,
                limit: pageSize,
            })
        );
    }, [fromDate, toDate]);

    const handleSearch = async (text: string) => {
        setSearchTerm(text);
        setPageIndex(0);

        await dispatch(
            fetchVisitorLogs({
                search: text,
                fromDate,
                toDate,
                page: 0,
                limit: pageSize,
            })
        );
    };

    const columns: MRT_ColumnDef<any>[] = [
        {
            accessorKey: "photo",
            header: "Photo",
            Cell: ({ cell }) => (
                <Avatar src={cell.getValue<string>()} />
            ),
            enableColumnFilter: false,
            size: 80,
        },
        { accessorKey: "name", header: "Visitor Name", filterVariant: "text" },
        { accessorKey: "mobile", header: "Mobile Number", filterVariant: "text" },
        { accessorKey: "flatNumber", header: "Flat No", filterVariant: "text" },
        {
            accessorKey: "type",
            header: "Category",
            filterVariant: "select",
            filterSelectOptions: ["Guest", "Delivery", "Vendor"],
            Cell: ({ cell }) => (
                <Chip
                    label={cell.getValue<string>()}
                    color={
                        cell.getValue() === "Guest"
                            ? "primary"
                            : cell.getValue() === "Delivery"
                                ? "success"
                                : "warning"
                    }
                    size="small"
                />
            ),
        },
        { accessorKey: "purpose", header: "Purpose" },
        {
            accessorKey: "entryTime",
            header: "Entry Time",
        },
        {
            header: "Actions",
            Cell: ({ row }) => (
                <Box display="flex" gap={1}>
                    {/* VIEW VISITOR */}
                    <Tooltip title="View Visitor Details">
                        <IconButton
                            onClick={() => {
                                setSelectedVisitor(row.original);
                                setShowView(true);
                            }}
                        >
                            <VisibilityIcon />
                        </IconButton>
                    </Tooltip>

                    {/* VIEW TODAY COUNTS */}
                    <Tooltip title="View Today Visitor Counts">
                        <IconButton
                            color="primary"
                            onClick={() => setShowSummary(true)}
                        >
                            <SummarizeIcon />
                        </IconButton>
                    </Tooltip>
                </Box>
            ),
        },

    ];



    return (
        <>
            <ViewVisitorTodaySummary
                open={showSummary}
                onClose={() => setShowSummary(false)}
                summary={summary}
            />
            {/* VIEW POPUP */}
            <ViewVisitor
                open={showView}
                data={selectedVisitor}
                onClose={() => {
                    setShowView(false);
                    setSelectedVisitor(null);
                }}
            />


            {/* HEADER */}
            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={2}
            >
                {/* LEFT TITLE */}
                <Typography variant="h5" fontWeight={500} className="font-outfit">
                    Visitor Logs Module
                    <Tooltip
                        title="Monitor daily visitor activity recorded by guards"
                        arrow
                    >
                        <InfoIcon sx={{ color: "#245492", ml: 1 }} />
                    </Tooltip>
                </Typography>

                {/* RIGHT TOTAL COUNT */}
                {/* <Box
                    display="flex"
                    alignItems="center"
                    gap={1.5}
                    sx={{
                        backgroundColor: "#f1f5f9",
                        px: 2,
                        py: 0.8,
                        borderRadius: "8px",
                        border: "1px solid #e2e8f0",
                    }}
                >
                    <GroupIcon sx={{ color: "#245492" }} />

                    <Typography
                        className="font-outfit"
                        sx={{ fontSize: "14px", fontWeight: 500 }}
                    >
                        Total Visitor Count:
                    </Typography>

                    <Typography
                        className="font-outfit"
                        sx={{ fontSize: "16px", fontWeight: 700, color: "#245492" }}
                    >
                        {totalItems}
                    </Typography>
                </Box> */}
            </Box>



            {/* TABLE */}
            <DataTable
                key={filterType}
                data={visitors}
                columns={columns}
                rowCount={totalItems}
                pageIndex={pageIndex}
                pageSize={pageSize}
                enableColumnFilters
                columnFilters={columnFilters}
                onColumnFiltersChange={handleColumnFilterChange}
                clickHandler={handleSearch}

                /* ✅ TOTAL COUNT BEFORE VISITOR TYPE */
                customTopLeftContent={
                    <Box
                        display="flex"
                        alignItems="center"
                        gap={1.5}
                        sx={{
                            backgroundColor: "#f1f5f9",
                            px: 2,
                            py: 0.96,
                            borderRadius: "8px",
                            border: "1px solid #e2e8f0",
                        }}
                    >
                        <GroupIcon sx={{ color: "#245492" }} />
                        <Typography
                            className="font-outfit"
                            sx={{ fontSize: "14px", fontWeight: 500 }}
                        >
                            Total Visitor Count:
                        </Typography>
                        <Typography
                            className="font-outfit"
                            sx={{ fontSize: "16px", fontWeight: 700, color: "#245492" }}
                        >
                            {totalItems}
                        </Typography>
                    </Box>
                }

                /* EXISTING FILTER */
                enableProducttypeFilter
                productTypeValue={filterType}
                onProducttypeChange={(type: string) => {
                    setFilterType(type as any);
                    setPageIndex(0);

                    dispatch(
                        fetchVisitorLogs({
                            search: searchTerm,
                            filters: type !== "all" ? { type } : undefined,
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
                        fetchVisitorLogs({
                            search: searchTerm,
                            filters:
                                filterType !== "all" ? { type: filterType } : undefined,
                            page: pageIndex,
                            limit: pageSize,
                        })
                    );
                }}
            />





        </>
    );
};

export default VisitorLogsManagement;
