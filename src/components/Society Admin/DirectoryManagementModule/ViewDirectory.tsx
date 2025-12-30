// import React from "react";
// import {
//     Box,
//     Typography,
//     IconButton,
//     Divider,
//     Chip,
//     Dialog,
//     DialogContent,
// } from "@mui/material";
// import CloseIcon from "@mui/icons-material/Close";

// interface Props {
//     open: boolean;
//     data: any;
//     onClose: () => void;
// }

// const ViewDocument: React.FC<Props> = ({ open, data, onClose }) => {
//     if (!data) return null;

//     return (
//         <Dialog
//             open={open}
//             onClose={onClose}
//             maxWidth="md"
//             fullWidth
//             PaperProps={{
//                 sx: {
//                     borderRadius: "16px", // 🔥 rounded popup
//                     overflow: "hidden",   // ensures header corners are clean
//                 },
//             }}
//         >

//             <DialogContent sx={{ p: 0 }}>
//                 <Box className="bg-white rounded-xl">

//                     {/* HEADER */}
//                     <Box
//                         sx={{
//                             background: "linear-gradient(#255593 103.05%)",
//                             height: 60,
//                             px: 4,
//                             display: "flex",
//                             alignItems: "center",
//                             justifyContent: "space-between",
//                             color: "white",
//                             borderTopLeftRadius: "16px",
//                             borderTopRightRadius: "16px",
//                         }}
//                     >

//                         <Typography
//                             sx={{
//                                 fontFamily: "Outfit, sans-serif",
//                                 fontSize: "18px",
//                                 fontWeight: 600,
//                             }}
//                         >
//                             Documents Details
//                         </Typography>

//                         <IconButton sx={{ color: "white" }} onClick={onClose}>
//                             <CloseIcon />
//                         </IconButton>
//                     </Box>

//                     {/* CONTENT */}
//                     <Box px={6} py={4}>

//                         {/* TITLE */}
//                         <Typography
//                             sx={{
//                                 fontFamily: "Outfit, sans-serif",
//                                 fontSize: "22px",
//                                 fontWeight: 600,
//                                 color: "#1f2937",
//                                 mb: 1,
//                             }}
//                         >
//                             {data.title}
//                         </Typography>

//                         <Box display="flex" gap={2} mb={2}>
//                             <Chip label={data.category} color="primary" />
//                             <Chip
//                                 label={data.isActive ? "Active" : "Inactive"}
//                                 color={data.isActive ? "success" : "error"}
//                             />
//                         </Box>

//                         <Divider sx={{ my: 2 }} />

//                         {/* DESCRIPTION */}
//                         <Typography
//                             sx={{
//                                 fontFamily: "Outfit, sans-serif",
//                                 fontSize: "15px",
//                                 fontWeight: 600,
//                                 mb: 1,
//                             }}
//                         >
//                             Description
//                         </Typography>

//                         <Box
//                             sx={{
//                                 border: "1px solid #e5e7eb",
//                                 borderRadius: 1,
//                                 p: 2,
//                                 backgroundColor: "#fafafa",
//                                 fontFamily: "Outfit, sans-serif",
//                                 fontSize: "14px",
//                                 lineHeight: "22px",
//                             }}
//                             dangerouslySetInnerHTML={{ __html: data.description }}
//                         />

//                         <Divider sx={{ my: 3 }} />

                        

//                         {/* META INFO */}
//                         <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2}>
//                             {/* <Typography sx={{ fontFamily: "Outfit, sans-serif" }}>
//                                 <strong>Acknowledge Required:</strong>{" "}
//                                 {data.acknowledgeRequired ? "Yes" : "No"}
//                             </Typography>

//                             <Typography sx={{ fontFamily: "Outfit, sans-serif" }}>
//                                 <strong>Read Count:</strong> {data.readCount}
//                             </Typography> */}

//                             <Typography sx={{ fontFamily: "Outfit, sans-serif" }}>
//                                 <strong>Created On:</strong>{" "}
//                                 {new Date(data.createdAt).toLocaleDateString()}
//                             </Typography>
//                         </Box>

//                     </Box>
//                 </Box>
//             </DialogContent>
//         </Dialog>
//     );
// };

// export default ViewDocument;




import React from "react";
import {
  Box,
  Typography,
  IconButton,
  Divider,
  Chip,
  Dialog,
  DialogContent,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface Props {
  open: boolean;
  data: any;
  onClose: () => void;
}

const ViewDirectory: React.FC<Props> = ({ open, data, onClose }) => {
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
          {/* HEADER */}
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
              Contact Details
            </Typography>

            <IconButton sx={{ color: "white" }} onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </Box>

          {/* BODY */}
          <Box px={6} py={4}>
            {/* CONTACT NAME */}
            <Typography
              sx={{
                fontFamily: "Outfit, sans-serif",
                fontSize: "22px",
                fontWeight: 600,
                color: "#1f2937",
                mb: 1,
              }}
            >
              {data.contact_name}
            </Typography>

            <Box display="flex" gap={2} mb={2}>
              <Chip label={data.category} color="primary" />
              <Chip
                label={data.isActive ? "Active" : "Inactive"}
                color={data.isActive ? "success" : "error"}
              />
              <Chip
                label={
                  data.visibility === "admin"
                    ? "Admin Only"
                    : "Visible to Residents"
                }
                color={data.visibility === "admin" ? "secondary" : "info"}
              />
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* DETAILS */}
            <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2}>
              <Typography sx={{ fontFamily: "Outfit, sans-serif" }}>
                <strong>Role / Service:</strong> {data.role_or_service}
              </Typography>

              <Typography sx={{ fontFamily: "Outfit, sans-serif" }}>
                <strong>Phone:</strong> {data.phone}
              </Typography>

              {data.alternate_phone && (
                <Typography sx={{ fontFamily: "Outfit, sans-serif" }}>
                  <strong>Alternate Number:</strong> {data.alternate_phone}
                </Typography>
              )}

              {data.email && (
                <Typography sx={{ fontFamily: "Outfit, sans-serif" }}>
                  <strong>Email:</strong> {data.email}
                </Typography>
              )}
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* DESCRIPTION */}
            {data.description && (
              <>
                <Typography
                  sx={{
                    fontFamily: "Outfit, sans-serif",
                    fontSize: "15px",
                    fontWeight: 600,
                    mb: 1,
                  }}
                >
                  Description / Notes
                </Typography>

                <Box
                  sx={{
                    border: "1px solid #e5e7eb",
                    borderRadius: 1,
                    p: 2,
                    backgroundColor: "#fafafa",
                    fontFamily: "Outfit, sans-serif",
                    fontSize: "14px",
                    lineHeight: "22px",
                  }}
                >
                  {data.description}
                </Box>

                <Divider sx={{ my: 3 }} />
              </>
            )}

            {/* META */}
            <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2}>
              <Typography sx={{ fontFamily: "Outfit, sans-serif" }}>
                <strong>Created On:</strong>{" "}
                {new Date(data.createdAt).toLocaleDateString()}
              </Typography>

              <Typography sx={{ fontFamily: "Outfit, sans-serif" }}>
                <strong>Last Updated:</strong>{" "}
                {new Date(data.updatedAt).toLocaleDateString()}
              </Typography>
            </Box>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default ViewDirectory;
