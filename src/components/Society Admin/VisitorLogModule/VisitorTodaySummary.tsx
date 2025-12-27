import React from "react";
import {
  Box,
  Typography,
  IconButton,
  Divider,
  Dialog,
  DialogContent,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface Props {
  open: boolean;
  onClose: () => void;
  summary: {
    guests: number;
    deliveries: number;
    vendors: number;
  };
}

const ViewVisitorTodaySummary: React.FC<Props> = ({
  open,
  onClose,
  summary,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
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
            }}
          >
            <Typography
              sx={{
                fontFamily: "Outfit, sans-serif",
                fontSize: "18px",
                fontWeight: 600,
              }}
            >
              Today Visitor Summary
            </Typography>

            <IconButton sx={{ color: "white" }} onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </Box>

          {/* ================= CONTENT ================= */}
          <Box px={5} py={4}>

            <Box
              display="grid"
              gridTemplateColumns="1fr 1fr"
              gap={3}
            >
              <Typography fontFamily="Outfit">
                <strong>Guests Today:</strong>
              </Typography>
              <Typography
                fontFamily="Outfit"
                fontWeight={600}
                color="#2563eb"
              >
                {summary.guests}
              </Typography>

              <Divider sx={{ gridColumn: "1 / -1" }} />

              <Typography fontFamily="Outfit">
                <strong>Deliveries Today:</strong>
              </Typography>
              <Typography
                fontFamily="Outfit"
                fontWeight={600}
                color="#16a34a"
              >
                {summary.deliveries}
              </Typography>

              <Divider sx={{ gridColumn: "1 / -1" }} />

              <Typography fontFamily="Outfit">
                <strong>Vendors Today:</strong>
              </Typography>
              <Typography
                fontFamily="Outfit"
                fontWeight={600}
                color="#d97706"
              >
                {summary.vendors}
              </Typography>
            </Box>

          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default ViewVisitorTodaySummary;
