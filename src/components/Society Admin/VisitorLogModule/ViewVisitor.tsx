// import React from "react";
// import {
//   Box,
//   Typography,
//   IconButton,
//   Divider,
//   Chip,
//   Dialog,
//   DialogContent,
//   Avatar,
// } from "@mui/material";
// import CloseIcon from "@mui/icons-material/Close";
// import VisitorTodaySummary from "./VisitorTodaySummary";


// interface Props {
//   open: boolean;
//   data: any;
//   onClose: () => void;
// }

// const ViewVisitor: React.FC<Props> = ({ open, data, onClose }) => {
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

//           {/* ================= HEADER ================= */}
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
//               Visitor Details
//             </Typography>

//             <IconButton sx={{ color: "white" }} onClick={onClose}>
//               <CloseIcon />
//             </IconButton>
//           </Box>

//           {/* ================= CONTENT ================= */}
//           <Box px={6} py={4}>

//             {/* TOP SECTION */}
//             <Box display="flex" gap={3} mb={3} alignItems="center">
//               <Avatar
//                 src={data.photo}
//                 sx={{
//                   width: 90,
//                   height: 90,
//                   border: "2px solid #e5e7eb",
//                 }}
//               />

//               <Box>
//                 <Typography
//                   sx={{
//                     fontFamily: "Outfit, sans-serif",
//                     fontSize: "20px",
//                     fontWeight: 600,
//                     color: "#1f2937",
//                   }}
//                 >
//                   {data.name}
//                 </Typography>

//                 <Typography sx={{ fontFamily: "Outfit, sans-serif" }}>
//                   {data.mobile}
//                 </Typography>

//                 <Typography sx={{ fontFamily: "Outfit, sans-serif" }}>
//                   Flat: <strong>{data.flatNumber}</strong>
//                 </Typography>
//               </Box>
//             </Box>

//             <Box display="flex" gap={2} mb={2}>
//               <Chip
//                 label={data.type}
//                 color={
//                   data.type === "Guest"
//                     ? "primary"
//                     : data.type === "Delivery"
//                     ? "success"
//                     : "warning"
//                 }
//               />
//             </Box>

//             <Divider sx={{ my: 3 }} />

//             {/* PURPOSE */}
//             <Typography
//               sx={{
//                 fontFamily: "Outfit, sans-serif",
//                 fontSize: "15px",
//                 fontWeight: 600,
//                 mb: 1,
//               }}
//             >
//               Purpose
//             </Typography>

//             <Box
//               sx={{
//                 border: "1px solid #e5e7eb",
//                 borderRadius: 1,
//                 p: 2,
//                 backgroundColor: "#fafafa",
//                 fontFamily: "Outfit, sans-serif",
//                 fontSize: "14px",
//               }}
//             >
//               {data.purpose}
//             </Box>

//             {data.reason && (
//               <>
//                 <Divider sx={{ my: 3 }} />

//                 <Typography
//                   sx={{
//                     fontFamily: "Outfit, sans-serif",
//                     fontSize: "15px",
//                     fontWeight: 600,
//                     mb: 1,
//                   }}
//                 >
//                   Reason
//                 </Typography>

//                 <Box
//                   sx={{
//                     border: "1px solid #e5e7eb",
//                     borderRadius: 1,
//                     p: 2,
//                     backgroundColor: "#fafafa",
//                     fontFamily: "Outfit, sans-serif",
//                     fontSize: "14px",
//                   }}
//                 >
//                   {data.reason}
//                 </Box>
//               </>
//             )}

//             <Divider sx={{ my: 3 }} />

//             {/* META INFO */}
//             <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2}>
//               <Typography sx={{ fontFamily: "Outfit, sans-serif" }}>
//                 <strong>Entry Time:</strong> {data.entryTime}
//               </Typography>

//               {data.exitTime && (
//                 <Typography sx={{ fontFamily: "Outfit, sans-serif" }}>
//                   <strong>Exit Time:</strong> {data.exitTime}
//                 </Typography>
//               )}

//               <Typography sx={{ fontFamily: "Outfit, sans-serif" }}>
//                 <strong>Visited On:</strong>{" "}
//                 {new Date(data.createdAt).toLocaleDateString()}
//               </Typography>
//             </Box>

//           </Box>
//         </Box>
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default ViewVisitor;





import React, { useState } from "react";
import { Typography, Divider, Chip, Avatar } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Lightbox from "yet-another-react-lightbox";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Download from "yet-another-react-lightbox/plugins/download";

import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";

interface Props {
  data: any;
  onClose: () => void;
}

const ViewVisitor: React.FC<Props> = ({ data, onClose }) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);

  if (!data) return null;

  /*VISITOR IMAGES */
  const images =
    data.photos?.length > 0
      ? data.photos
      : [
          {
            url: data.photo || "/images/default-user.png",
          },
        ];

  /* DETAIL FIELDS */
  const detailFields = [
    ["Visitor Name", data.name],
    ["Mobile Number", data.mobile],
    ["Flat Number", data.flatNumber],
    ["Purpose", data.purpose],
    ["Reason", data.reason],
    ["Entry Time", data.entryTime],
    ["Exit Time", data.exitTime || "-"],
    [
      "Visited On",
      new Date(data.createdAt).toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
    ],
  ];

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

        {/* LEFT : IMAGES */}
        <div>
          <div className="w-full h-[380px] rounded-lg overflow-hidden mb-4 flex items-center justify-center bg-gray-100">
            {images[0] && (
              <img
                src={images[0].url}
                alt="visitor"
                className="w-full h-full object-contain cursor-pointer"
                onClick={() => {
                  setPhotoIndex(0);
                  setLightboxOpen(true);
                }}
              />
            )}
          </div>

          {/* <div className="grid grid-cols-4 gap-2">
            {images.map((img: any, idx: number) => (
              <img
                key={idx}
                src={img.url}
                alt={`thumb-${idx}`}
                className="h-20 w-full object-cover border rounded cursor-pointer"
                onClick={() => {
                  setPhotoIndex(idx);
                  setLightboxOpen(true);
                }}
              />
            ))}
          </div> */}

          <Lightbox
            open={lightboxOpen}
            close={() => setLightboxOpen(false)}
            index={photoIndex}
            slides={images.map((img: any) => ({
              src: img.url,
              title: "Visitor Image",
            }))}
            plugins={[Fullscreen, Thumbnails, Zoom, Download]}
            zoom={{ maxZoomPixelRatio: 3 }}
          />
        </div>

        {/*RIGHT : DETAILS */}
        <div className="bg-gray-50 p-6 rounded-lg shadow">

          {/* Header */}
          <div className="flex items-center gap-3 mb-4">
            <Avatar
              src={data.photo}
              sx={{ width: 56, height: 56 }}
            />
            <div>
              <Typography variant="h6" fontWeight={600}>
                {data.name}
              </Typography>

              <Chip
                size="small"
                label={data.type}
                color={
                  data.type === "Guest"
                    ? "primary"
                    : data.type === "Delivery"
                    ? "success"
                    : "warning"
                }
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

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-y-4 gap-x-6">
            {detailFields.map(([label, value], index) => (
              <div key={index}>
                <p className="text-gray-500 text-sm">{label}</p>
                <p className="text-gray-800 font-medium">
                  {value || "-"}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default ViewVisitor;
