import React from "react";
import {
  Box,
  Typography,
  IconButton,
  Divider,
  Dialog,
  DialogContent,
  Avatar,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface Props {
  open: boolean;
  data: any;
  onClose: () => void;
}

const ViewResident: React.FC<Props> = ({ open, data, onClose }) => {
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
            }}
          >
            <Typography
              sx={{
                fontFamily: "Outfit, sans-serif",
                fontSize: "18px",
                fontWeight: 600,
              }}
            >
              Resident Details
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
                sx={{
                  width: 90,
                  height: 90,
                  bgcolor: "#245492",
                  fontSize: 32,
                  fontWeight: 600,
                }}
              >
                {data.residentName?.charAt(0)}
              </Avatar>

              <Box>
                <Typography
                  sx={{
                    fontFamily: "Outfit, sans-serif",
                    fontSize: "20px",
                    fontWeight: 600,
                  }}
                >
                  {data.residentName}
                </Typography>

                <Typography sx={{ fontFamily: "Outfit, sans-serif" }}>
                  {data.email}
                </Typography>

                <Typography sx={{ fontFamily: "Outfit, sans-serif" }}>
                  {data.mobile}
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* BASIC DETAILS */}
            <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2}>
              <Typography>
                <strong>Resident Type:</strong> {data.residentType}
              </Typography>

              <Typography>
                <strong>Flat Area:</strong> {data.residentFlatarea}
              </Typography>

              <Typography>
                <strong>Flat Size:</strong> {data.residentFlatsize}
              </Typography>

              <Typography>
                <strong>Parking:</strong> {data.residentParkingname}
              </Typography>
            </Box>

            {/* SECOND RESIDENT */}
            {(data.secondresidentName ||
              data.secondresidentEmail ||
              data.secondresidentMobile) && (
              <>
                <Divider sx={{ my: 3 }} />

                <Typography
                  sx={{
                    fontFamily: "Outfit, sans-serif",
                    fontWeight: 600,
                    mb: 1,
                  }}
                >
                  Second Resident Details
                </Typography>

                <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2}>
                  {data.secondresidentName && (
                    <Typography>
                      <strong>Name:</strong> {data.secondresidentName}
                    </Typography>
                  )}
                  {data.secondresidentEmail && (
                    <Typography>
                      <strong>Email:</strong> {data.secondresidentEmail}
                    </Typography>
                  )}
                  {data.secondresidentMobile && (
                    <Typography>
                      <strong>Mobile:</strong> {data.secondresidentMobile}
                    </Typography>
                  )}
                </Box>
              </>
            )}

            <Divider sx={{ my: 3 }} />

            {/* META */}
            <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2}>
              <Typography>
                <strong>Status:</strong>{" "}
                {data.isActive ? "Active" : "Inactive"}
              </Typography>

              <Typography>
                <strong>Created On:</strong>{" "}
                {new Date(data.createdAt).toLocaleDateString()}
              </Typography>
            </Box>

          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default ViewResident;
