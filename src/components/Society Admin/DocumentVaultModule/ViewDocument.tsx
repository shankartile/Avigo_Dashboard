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

/*  FILE TYPE HELPER */
const getFileType = (url: string) => {
  const ext = url.split(".").pop()?.toLowerCase();

  if (!ext) return "other";
  if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext)) return "image";
  if (ext === "pdf") return "pdf";
  return "other";
};

const ViewDocument: React.FC<Props> = ({ open, data, onClose }) => {
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
              Documents Details
            </Typography>

            <IconButton sx={{ color: "white" }} onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </Box>

          
          <Box px={6} py={4}>
            {/* TITLE */}
            <Typography
              sx={{
                fontFamily: "Outfit, sans-serif",
                fontSize: "22px",
                fontWeight: 600,
                color: "#1f2937",
                mb: 1,
              }}
            >
              {data.title}
            </Typography>

            <Box display="flex" gap={2} mb={2}>
              <Chip label={data.category} color="primary" />
              <Chip
                label={data.isActive ? "Active" : "Inactive"}
                color={data.isActive ? "success" : "error"}
              />
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* DESCRIPTION */}
            <Typography
              sx={{
                fontFamily: "Outfit, sans-serif",
                fontSize: "15px",
                fontWeight: 600,
                mb: 1,
              }}
            >
              Description
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
              dangerouslySetInnerHTML={{ __html: data.description }}
            />

       
            {Array.isArray(data.attachments) &&
              data.attachments.length > 0 && (
                <>
                  <Divider sx={{ my: 3 }} />

                  <Typography
                    sx={{
                      fontFamily: "Outfit, sans-serif",
                      fontSize: "15px",
                      fontWeight: 600,
                      mb: 2,
                    }}
                  >
                    Attachments
                  </Typography>

                  <Box
                    display="grid"
                    gridTemplateColumns="repeat(auto-fill, minmax(160px, 1fr))"
                    gap={2}
                  >
                    {data.attachments.map(
                      (file: string, index: number) => {
                        const type = getFileType(file);
                        const fileName = file.split("/").pop();

                        return (
                          <Box
                            key={index}
                            sx={{
                              border: "1px solid #e5e7eb",
                              borderRadius: "12px",
                              p: 1.5,
                              textAlign: "center",
                              cursor: "pointer",
                              backgroundColor: "#fafafa",
                              "&:hover": {
                                boxShadow: 3,
                              },
                            }}
                            onClick={() => window.open(file, "_blank")}
                          >
                            {/* IMAGE PREVIEW */}
                            {type === "image" && (
                              <img
                                src={file}
                                alt={fileName}
                                style={{
                                  width: "100%",
                                  height: 120,
                                  objectFit: "cover",
                                  borderRadius: 8,
                                }}
                              />
                            )}

                            {/* PDF PREVIEW */}
                            {type === "pdf" && (
                              <iframe
                                src={file}
                                title={fileName}
                                style={{
                                  width: "100%",
                                  height: 120,
                                  border: "none",
                                  borderRadius: 8,
                                }}
                              />
                            )}

                            {/* OTHER FILE TYPES */}
                            {type === "other" && (
                              <Box
                                height={120}
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                                flexDirection="column"
                                sx={{ fontSize: 40 }}
                              >
                                📄
                              </Box>
                            )}

                            <Typography
                              sx={{
                                fontSize: "12px",
                                mt: 1,
                                wordBreak: "break-all",
                                fontFamily: "Outfit, sans-serif",
                              }}
                            >
                              {fileName}
                            </Typography>
                          </Box>
                        );
                      }
                    )}
                  </Box>
                </>
              )}

           
            <Divider sx={{ my: 3 }} />

            <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2}>
              <Typography sx={{ fontFamily: "Outfit, sans-serif" }}>
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

export default ViewDocument;
