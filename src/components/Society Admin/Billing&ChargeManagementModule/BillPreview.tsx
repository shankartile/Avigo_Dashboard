import React from "react";
import { Box, Typography, IconButton, Divider } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Button from "../../ui/button/Button";

interface Props {
  onCancel: () => void;
  billData?: any;
}

const BillPreview: React.FC<Props> = ({ onCancel, billData }) => {
  const data = billData || {
    billingMode: "SPECIFIC",
    flatType: "2BHK",
    maintenanceAmount: 2500,
    fixedCharges: 0,
    penaltyAmount: 200,
    gstPercentage: 18,
    billingYear: 2025,
    billingMonth: "January",
    totalAmount: 2700,
  };

  return (
    <Box
      className="max-w-4xl mx-auto bg-white shadow-md"
      sx={{ borderRadius: 4, overflow: "hidden" }}   // 🔹 rounded container
    >
      {/* ================= HEADER ================= */}
      <Box
        sx={{
          background: "linear-gradient(#255593 103.05%)",
          height: 60,
          px: 4,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          color: "white",
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
        }}
      >
        <Typography variant="h6">Bill Preview</Typography>

        <IconButton sx={{ color: "white" }} onClick={onCancel}>
          <CloseIcon />
        </IconButton>
      </Box>

      {/* ================= BODY ================= */}
      <Box px={6} py={4}>
        <div className="grid grid-cols-2 gap-y-4 gap-x-10">
          <PreviewItem label="Billing Type" value={data.billingMode} />
          <PreviewItem label="Billing Month" value={data.billingMonth} />

          {data.billingMode === "SPECIFIC" && (
            <PreviewItem label="Flat Type" value={data.flatType} />
          )}

          <PreviewItem
            label="Maintenance Charges"
            value={`₹ ${data.maintenanceAmount}`}
          />

          {data.fixedCharges > 0 && (
            <PreviewItem
              label="Fixed Charges"
              value={`₹ ${data.fixedCharges}`}
            />
          )}

          <PreviewItem
            label="Penalty Charges"
            value={`₹ ${data.penaltyAmount}`}
          />

          <PreviewItem
            label="GST / Tax (%)"
            value={`${data.gstPercentage}%`}
          />

          <PreviewItem label="Billing Year" value={data.billingYear} />
        </div>

        <Divider className="my-6" />

        {/* TOTAL */}
        <div className="flex justify-between items-center text-lg font-semibold">
          <span>Total Payable Amount</span>
          <span className="text-green-600">₹ {data.totalAmount}</span>
        </div>

        {/* ================= ACTIONS ================= */}
        <div className="flex justify-center gap-6 mt-8">
          <Button>Publish Bill</Button>
          <Button variant="secondary" onClick={onCancel}>
            Back
          </Button>
        </div>
      </Box>
    </Box>
  );
};

export default BillPreview;

interface PreviewItemProps {
  label: string;
  value: string | number;
}

const PreviewItem = ({ label, value }: PreviewItemProps) => (
  <div>
    <p className="text-sm text-gray-500">{label}</p>
    <p className="text-base font-medium text-gray-900">{value}</p>
  </div>
);
