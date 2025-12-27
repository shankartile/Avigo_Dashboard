import React from "react";
import {
  Box,
  Typography,
  IconButton,
  Divider,
  Chip,
  Dialog,
  DialogContent,
  Avatar,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import VisitorTodaySummary from "./VisitorTodaySummary";


interface Props {
  open: boolean;
  data: any;
  onClose: () => void;
}

const ViewVisitor: React.FC<Props> = ({ open, data, onClose }) => {
  if (!data) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "16px",
          overflow: "hidden",
        },
      }}
    >
      <DialogContent sx={{ p: 0 }}>
        <Box className="bg-white rounded-xl">

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
              borderTopLeftRadius: "16px",
              borderTopRightRadius: "16px",
            }}
          >
            <Typography
              sx={{
                fontFamily: "Outfit, sans-serif",
                fontSize: "18px",
                fontWeight: 600,
              }}
            >
              Visitor Details
            </Typography>

            <IconButton sx={{ color: "white" }} onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </Box>

          {/* ================= CONTENT ================= */}
          <Box px={6} py={4}>

            {/* TOP SECTION */}
            <Box display="flex" gap={3} mb={3} alignItems="center">
              <Avatar
                src={data.photo}
                sx={{
                  width: 90,
                  height: 90,
                  border: "2px solid #e5e7eb",
                }}
              />

              <Box>
                <Typography
                  sx={{
                    fontFamily: "Outfit, sans-serif",
                    fontSize: "20px",
                    fontWeight: 600,
                    color: "#1f2937",
                  }}
                >
                  {data.name}
                </Typography>

                <Typography sx={{ fontFamily: "Outfit, sans-serif" }}>
                  {data.mobile}
                </Typography>

                <Typography sx={{ fontFamily: "Outfit, sans-serif" }}>
                  Flat: <strong>{data.flatNumber}</strong>
                </Typography>
              </Box>
            </Box>

            <Box display="flex" gap={2} mb={2}>
              <Chip
                label={data.type}
                color={
                  data.type === "Guest"
                    ? "primary"
                    : data.type === "Delivery"
                    ? "success"
                    : "warning"
                }
              />
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* PURPOSE */}
            <Typography
              sx={{
                fontFamily: "Outfit, sans-serif",
                fontSize: "15px",
                fontWeight: 600,
                mb: 1,
              }}
            >
              Purpose
            </Typography>

            <Box
              sx={{
                border: "1px solid #e5e7eb",
                borderRadius: 1,
                p: 2,
                backgroundColor: "#fafafa",
                fontFamily: "Outfit, sans-serif",
                fontSize: "14px",
              }}
            >
              {data.purpose}
            </Box>

            {data.reason && (
              <>
                <Divider sx={{ my: 3 }} />

                <Typography
                  sx={{
                    fontFamily: "Outfit, sans-serif",
                    fontSize: "15px",
                    fontWeight: 600,
                    mb: 1,
                  }}
                >
                  Reason
                </Typography>

                <Box
                  sx={{
                    border: "1px solid #e5e7eb",
                    borderRadius: 1,
                    p: 2,
                    backgroundColor: "#fafafa",
                    fontFamily: "Outfit, sans-serif",
                    fontSize: "14px",
                  }}
                >
                  {data.reason}
                </Box>
              </>
            )}

            <Divider sx={{ my: 3 }} />

            {/* META INFO */}
            <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2}>
              <Typography sx={{ fontFamily: "Outfit, sans-serif" }}>
                <strong>Entry Time:</strong> {data.entryTime}
              </Typography>

              {data.exitTime && (
                <Typography sx={{ fontFamily: "Outfit, sans-serif" }}>
                  <strong>Exit Time:</strong> {data.exitTime}
                </Typography>
              )}

              <Typography sx={{ fontFamily: "Outfit, sans-serif" }}>
                <strong>Visited On:</strong>{" "}
                {new Date(data.createdAt).toLocaleDateString()}
              </Typography>
            </Box>

          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default ViewVisitor;
