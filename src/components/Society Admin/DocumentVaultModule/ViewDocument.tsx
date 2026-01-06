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




// import React from "react";
// import {
//   Box,
//   Typography,
//   IconButton,
//   Divider,
//   Chip,
//   Dialog,
//   DialogContent,
// } from "@mui/material";
// import CloseIcon from "@mui/icons-material/Close";

// interface Props {
//   open: boolean;
//   data: any;
//   onClose: () => void;
// }

// /*  FILE TYPE HELPER */
// const getFileType = (url: string) => {
//   const ext = url.split(".").pop()?.toLowerCase();

//   if (!ext) return "other";
//   if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext)) return "image";
//   if (ext === "pdf") return "pdf";
//   return "other";
// };

// const ViewDocument: React.FC<Props> = ({ open, data, onClose }) => {
//   if (!data) return null;

//   return (
//     <Dialog
//       open={open}
//       onClose={onClose}
//       maxWidth="md"
//       fullWidth
//       PaperProps={{
//         sx: {
//           borderRadius: "16px",
//           overflow: "hidden",
//         },
//       }}
//     >
//       <DialogContent sx={{ p: 0 }}>
//         <Box className="bg-white rounded-xl">

//           <Box
//             sx={{
//               background: "linear-gradient(#255593 103.05%)",
//               height: 60,
//               px: 4,
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "space-between",
//               color: "white",
//               borderTopLeftRadius: "16px",
//               borderTopRightRadius: "16px",
//             }}
//           >
//             <Typography
//               sx={{
//                 fontFamily: "Outfit, sans-serif",
//                 fontSize: "18px",
//                 fontWeight: 600,
//               }}
//             >
//               Documents Details
//             </Typography>

//             <IconButton sx={{ color: "white" }} onClick={onClose}>
//               <CloseIcon />
//             </IconButton>
//           </Box>


//           <Box px={6} py={4}>
//             {/* TITLE */}
//             <Typography
//               sx={{
//                 fontFamily: "Outfit, sans-serif",
//                 fontSize: "22px",
//                 fontWeight: 600,
//                 color: "#1f2937",
//                 mb: 1,
//               }}
//             >
//               {data.title}
//             </Typography>

//             <Box display="flex" gap={2} mb={2}>
//               <Chip label={data.category} color="primary" />
//               <Chip
//                 label={data.isActive ? "Active" : "Inactive"}
//                 color={data.isActive ? "success" : "error"}
//               />
//             </Box>

//             <Divider sx={{ my: 2 }} />

//             {/* DESCRIPTION */}
//             <Typography
//               sx={{
//                 fontFamily: "Outfit, sans-serif",
//                 fontSize: "15px",
//                 fontWeight: 600,
//                 mb: 1,
//               }}
//             >
//               Description
//             </Typography>

//             <Box
//               sx={{
//                 border: "1px solid #e5e7eb",
//                 borderRadius: 1,
//                 p: 2,
//                 backgroundColor: "#fafafa",
//                 fontFamily: "Outfit, sans-serif",
//                 fontSize: "14px",
//                 lineHeight: "22px",
//               }}
//               dangerouslySetInnerHTML={{ __html: data.description }}
//             />


//             {Array.isArray(data.attachments) &&
//               data.attachments.length > 0 && (
//                 <>
//                   <Divider sx={{ my: 3 }} />

//                   <Typography
//                     sx={{
//                       fontFamily: "Outfit, sans-serif",
//                       fontSize: "15px",
//                       fontWeight: 600,
//                       mb: 2,
//                     }}
//                   >
//                     Attachments
//                   </Typography>

//                   <Box
//                     display="grid"
//                     gridTemplateColumns="repeat(auto-fill, minmax(160px, 1fr))"
//                     gap={2}
//                   >
//                     {data.attachments.map(
//                       (file: string, index: number) => {
//                         const type = getFileType(file);
//                         const fileName = file.split("/").pop();

//                         return (
//                           <Box
//                             key={index}
//                             sx={{
//                               border: "1px solid #e5e7eb",
//                               borderRadius: "12px",
//                               p: 1.5,
//                               textAlign: "center",
//                               cursor: "pointer",
//                               backgroundColor: "#fafafa",
//                               "&:hover": {
//                                 boxShadow: 3,
//                               },
//                             }}
//                             onClick={() => window.open(file, "_blank")}
//                           >
//                             {/* IMAGE PREVIEW */}
//                             {type === "image" && (
//                               <img
//                                 src={file}
//                                 alt={fileName}
//                                 style={{
//                                   width: "100%",
//                                   height: 120,
//                                   objectFit: "cover",
//                                   borderRadius: 8,
//                                 }}
//                               />
//                             )}

//                             {/* PDF PREVIEW */}
//                             {type === "pdf" && (
//                               <iframe
//                                 src={file}
//                                 title={fileName}
//                                 style={{
//                                   width: "100%",
//                                   height: 120,
//                                   border: "none",
//                                   borderRadius: 8,
//                                 }}
//                               />
//                             )}

//                             {/* OTHER FILE TYPES */}
//                             {type === "other" && (
//                               <Box
//                                 height={120}
//                                 display="flex"
//                                 alignItems="center"
//                                 justifyContent="center"
//                                 flexDirection="column"
//                                 sx={{ fontSize: 40 }}
//                               >
//                                 📄
//                               </Box>
//                             )}

//                             <Typography
//                               sx={{
//                                 fontSize: "12px",
//                                 mt: 1,
//                                 wordBreak: "break-all",
//                                 fontFamily: "Outfit, sans-serif",
//                               }}
//                             >
//                               {fileName}
//                             </Typography>
//                           </Box>
//                         );
//                       }
//                     )}
//                   </Box>
//                 </>
//               )}


//             <Divider sx={{ my: 3 }} />

//             <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2}>
//               <Typography sx={{ fontFamily: "Outfit, sans-serif" }}>
//                 <strong>Created On:</strong>{" "}
//                 {new Date(data.createdAt).toLocaleDateString()}
//               </Typography>
//             </Box>
//           </Box>
//         </Box>
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default ViewDocument;




import React from "react";
import {
  Typography,
  Divider,
  Chip,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

/* FILE TYPE HELPER */
const getFileType = (url: string) => {
  const ext = url.split(".").pop()?.toLowerCase();
  if (!ext) return "other";
  if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext)) return "image";
  if (ext === "pdf") return "pdf";
  if (["doc", "docx"].includes(ext)) return "word";

  return "other";
};


interface Props {
  data: any;
  onClose: () => void;
}

const ViewDocument: React.FC<Props> = ({ data, onClose }) => {
  if (!data) return null;

  return (
    <>
      {/* BACK BUTTON */}
      <div className="px-6 pt-6 bg-white flex items-center gap-2">
        <button
          onClick={onClose}
          className="flex items-center text-[#255593] hover:underline"
        >
          <ArrowBackIcon fontSize="small" />
          <span className="ml-1 font-medium">Back</span>
        </button>
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 px-6 py-10 bg-white">

        {/* LEFT : ATTACHMENTS */}
        <div>
          <Typography variant="h6" fontWeight={600} mb={2}>
            Attachments
          </Typography>

          {Array.isArray(data.attachments) && data.attachments.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-1 gap-4">
              {data.attachments.map((file: string, index: number) => {
                const type = getFileType(file);
                const fileName = file.split("/").pop();

                return (
                  <div
                    key={index}
                    onClick={() => window.open(file, "_blank")}
                    className="border rounded-lg p-2 bg-gray-50 hover:shadow cursor-pointer text-center"
                  >
                   
                    {/* IMAGE */}
                    {type === "image" && (
                      <img
                        src={file}
                        alt={fileName}
                        className="h-100 w-full object-cover rounded"
                      />
                    )}

                    {/* PDF VIEWER */}
                    {type === "pdf" && (
                      <iframe
                        src={file}
                        title={fileName}
                        className="h-100 w-full rounded border-none"
                      />
                    )}

                    {/* WORD (DOC / DOCX) VIEWER */}
                    {type === "word" && (
                      <iframe
                        src={`https://docs.google.com/gview?url=${encodeURIComponent(
                          file
                        )}&embedded=true`}
                        title={fileName}
                        className="h-100 w-full rounded border-none"
                      />
                    )}

                    {/* OTHER FILES */}
                    {type === "other" && (
                      <div className="h-100 flex items-center justify-center text-4xl">
                        📎
                      </div>
                    )}



                    <p className="text-xs mt-2 break-all text-gray-700">
                      {fileName}
                    </p>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-500">No attachments available</p>
          )}
        </div>

        {/* RIGHT : DETAILS */}
        <div className="bg-gray-50 p-6 rounded-lg shadow">

          {/* HEADER */}
          <div className="mb-3">
            <Typography variant="h6" fontWeight={600}>
              {data.title}
            </Typography>

            <div className="flex gap-2 mt-2">
              <Chip label={data.category} color="primary" size="small" />
              <Chip
                label={data.isActive ? "Active" : "Inactive"}
                color={data.isActive ? "success" : "error"}
                size="small"
              />
            </div>
          </div>

          <Divider
            sx={{
              borderColor: "#255593",
              borderBottomWidth: "2px",
              mb: 3,
            }}
          />

          {/* DESCRIPTION */}
          <div className="mb-4">
            <p className="text-gray-500 text-sm mb-1">Description</p>
            <div
              className="text-gray-800 text-sm leading-6"
              dangerouslySetInnerHTML={{ __html: data.description }}
            />
          </div>

          {/* <Divider sx={{ my: 3 }} /> */}

          {/* META INFO */}
          <div className="grid grid-cols-2 gap-y-4 gap-x-6">
            <div>
              <p className="text-gray-500 text-sm">Created On</p>
              <p className="text-gray-800 font-medium">
                {new Date(data.createdAt).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ViewDocument;
