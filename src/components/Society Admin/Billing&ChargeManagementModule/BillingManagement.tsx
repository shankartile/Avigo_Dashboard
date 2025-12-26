import React, { useState } from "react";
import { Box, Typography, Tooltip, IconButton, Chip } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import InfoIcon from "@mui/icons-material/Info";

import { MRT_ColumnDef } from "material-react-table";
import DataTable from "../../tables/DataTable";
import Button from "../../ui/button/Button";

import CreateMaintenanceBill from "./CreateMaintenanceBill";
import CreateSupplementaryBill from "./CreateSupplementaryBill";
import BillPreview from "./BillPreview";

const BillingManagement = () => {
    const [showMaintenance, setShowMaintenance] = useState(false);
    const [showSupplementary, setShowSupplementary] = useState(false);
    const [showPreview, setShowPreview] = useState(false);
    const [selectedBill, setSelectedBill] = useState<any>(null);

    //  Dummy Data (replace with API)
    const bills = [
        {
            billMonth: "January",
            billYear: "2025",
            flatType: "2BHK",
            billType: "Maintenance",
            amount: 2500,
            status: "Draft",
        },
    ];

    const columns: MRT_ColumnDef<any>[] = [
        { accessorKey: "billMonth", header: "Month" },
        { accessorKey: "billYear", header: "Year" },
        { accessorKey: "flatType", header: "Flat Type" },
        { accessorKey: "billType", header: "Bill Type" },
        { accessorKey: "amount", header: "Amount" },
        {
            accessorKey: "status",
            header: "Status",
            Cell: ({ cell }) =>
                cell.getValue() === "Published" ? (
                    <Chip label="Published" color="success" size="small" />
                ) : (
                    <Chip label="Draft" color="warning" size="small" />
                ),
        },
        {
            header: "Actions",
            Cell: ({ row }) => (
                <Box display="flex" gap={1}>
                    <Tooltip title="Preview">
                        <IconButton onClick={() => setShowPreview(true)}>
                            <VisibilityIcon />
                        </IconButton>
                    </Tooltip>

                    <Tooltip title="Edit">
                        <IconButton onClick={() => setShowMaintenance(true)}>
                            <EditIcon />
                        </IconButton>
                    </Tooltip>

                    <Tooltip title="Download PDF">
                        <IconButton>
                            <PictureAsPdfIcon />
                        </IconButton>
                    </Tooltip>
                </Box>
            ),
        },
    ];

    if (showMaintenance)
        return <CreateMaintenanceBill onCancel={() => setShowMaintenance(false)} />;

    if (showSupplementary)
        return <CreateSupplementaryBill onCancel={() => setShowSupplementary(false)} />;

    if (showPreview)
        return <BillPreview onCancel={() => setShowPreview(false)} />;

    return (
        <>
            <Box display="flex" justifyContent="space-between" mb={2}>
                <Typography variant="h5" fontWeight={500} className="font-outfit">
                     Billing & Charge Management
                    <Tooltip title="Manage maintenance & supplementary bills." arrow>
                        <InfoIcon sx={{ color: "#245492", ml: 1 }} />
                    </Tooltip>
                </Typography>

                <Box display="flex" gap={2}>
                    <Button onClick={() => setShowMaintenance(true)}>
                        <AddIcon /> Create Maintenance Bill
                    </Button>
                    <Button variant="secondary" onClick={() => setShowSupplementary(true)}>
                        <AddIcon /> Supplementary Bill
                    </Button>
                </Box>
            </Box>

            <DataTable
                data={bills}
                columns={columns}
                rowCount={bills.length}
                pageIndex={0}
                pageSize={10}
                exportType
            />
        </>
    );
};

export default BillingManagement;
