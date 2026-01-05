import React, { useState } from "react";
import { Typography, Divider } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CloseIcon from "@mui/icons-material/Close";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Download from "yet-another-react-lightbox/plugins/download";

import "yet-another-react-lightbox/plugins/thumbnails.css";

interface Props {
  data: any;
  onClose: () => void;
}

const ViewSociety: React.FC<Props> = ({ data, onClose }) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);

  if (!data) return null;

  const images =
    data.images?.length > 0
      ? data.images
      : [
          {
            url: "/images/societyimage/building.jpg",
            
          },
        ];

  const detailFields = [
    ["Society Name", data.societyName],
    ["State", data.state],
    ["City", data.city],
    ["Address", data.address || data.detailAddress],
    ["Total Wings", data.totalWings],
    ["Floors per Wing", data.floorsPerWing],
    ["Flats per Floor", data.flatsPerFloor],
    ["Created On",new Date(data.createdAt).toLocaleString("en-IN", {day: "2-digit",month: "short",year: "numeric",hour: "2-digit",minute: "2-digit",hour12: true,}),],
    ["Active", data.isActive ? "Yes" : "No"],
  ];

  return (
    <>

      <div className="px-6 pt-6 bg-white flex items-center gap-2">
        <button
          onClick={onClose}
          className="flex items-center text-[#255593] hover:underline"
        >
          <ArrowBackIcon fontSize="small" />
          <span className="ml-1 font-medium">Back</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 px-6 py-10 bg-white">

        <div>
          <div className="w-full h-[400px] rounded-lg overflow-hidden mb-4">
            {images[0] && (
              <img
                src={images[0].url}
                alt="society"
                className="w-full h-full object-contain cursor-pointer"
                onClick={() => {
                  setPhotoIndex(0);
                  setLightboxOpen(true);
                }}
              />
            )}
          </div>

          <div className="grid grid-cols-4 gap-2">
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
          </div>

          
          <Lightbox
            open={lightboxOpen}
            close={() => setLightboxOpen(false)}
            index={photoIndex}
            slides={images.map((img: any) => ({
              src: img.url,
              title: "Society Image",
            }))}
            plugins={[Fullscreen, Thumbnails, Zoom, Download]}
            zoom={{ maxZoomPixelRatio: 3 }}
          />
        </div>


        <div className="bg-gray-50 p-6 rounded-lg shadow">
          <Typography
            variant="h5"
            className="font-bold text-gray-700 mb-4"
          >
            SOCIETY DETAILS
          </Typography>

          <Divider
            sx={{
              borderColor: "#255593",
              borderBottomWidth: "2px",
            }}
          />

          <div className="grid grid-cols-2 gap-y-4 gap-x-6 mt-4">
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

export default ViewSociety;



// import React from "react";
// import { Box, Typography, Tooltip } from "@mui/material";
// import ArrowBackIcon from "@mui/icons-material/ArrowBack";

// interface Props {
//   data: any;
//   onClose: () => void;
// }


// const ProfileField = ({ label, value }: { label: string; value?: string }) => (
//   <Box>
//     <Typography
//       variant="body2"
//       sx={{ color: "#888", fontWeight: 500 }}
//       className="font-outfit"
//     >
//       {label}
//     </Typography>
//     <Typography
//       variant="body1"
//       className="font-outfit"
//       sx={{ fontWeight: 600 }}
//     >
//       {value || "N/A"}
//     </Typography>
//   </Box>
// );

// const ViewSociety: React.FC<Props> = ({ data, onClose }) => {
//   if (!data) return null;

//   return (
//     <Box className="flex flex-col items-center px-4 pt-2 pb-6 bg-[#f5f7fb] min-h-screen">
  
//       <Box className="w-full max-w-8xl mb-2">
//         <button
//           onClick={onClose}
//           className="flex items-center text-[#255593] font-medium hover:underline"
//         >
//           <ArrowBackIcon fontSize="small" />
//           <span className="ml-1">Back</span>
//         </button>
//       </Box>

   
//       <Box
//         className="bg-white rounded-2xl shadow-md p-5 w-full max-w-8xl"
//         sx={{
//           display: "flex",
//           flexDirection: { xs: "column", md: "row" },
//           gap: 4,
//         }}
//       >
        
//         <Box
//           sx={{
//             display: "flex",
//             flexDirection: "column",
//             alignItems: "center",
//             justifyContent: "center",
//             width: { xs: "100%", md: "35%" },
//             borderRight: { md: "1px solid #e0e0e0" },
//             pr: { md: 4 },
//             mb: { xs: 4, md: 0 },
//           }}
//         >
//           <Tooltip title="Society Image" arrow>
//             <Box
//               sx={{
//                 width: 160,
//                 height: 160,
//                 borderRadius: "50%",
//                 mb: 2,
//                 border: "2px solid #ddd",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 backgroundColor: "#255593",
//                 color: "white",
//                 fontSize: "64px",
//                 fontWeight: 700,
//                 textTransform: "uppercase",
//                 userSelect: "none",
//               }}
//             >
//               {data.societyName?.[0] || "S"}
//             </Box>
//           </Tooltip>

//           <Typography variant="h4" className="font-outfit">
//             {data.societyName}
//           </Typography>

//           <Typography
//             variant="body1"
//             className="font-outfit"
//             color="textSecondary"
//           >
//             {data.city}, {data.state}
//           </Typography>
//         </Box>

       
//         <Box
//           sx={{
//             flex: 1,
//             pl: { md: 4 },
//             display: "flex",
//             flexDirection: "column",
//             gap: 4,
//           }}
//         >
//           {/* BASIC DETAILS */}
//           <Box>
//             <Typography
//               className="font-outfit underline"
//               variant="subtitle1"
//               sx={{ fontWeight: 600, mb: 1 }}
//             >
//               Society Details
//             </Typography>

//             <Box className="grid grid-cols-1 sm:grid-cols-2 gap-5">
//               <ProfileField
//                 label="Society Name"
//                 value={data.societyName}
//               />
//               <ProfileField
//                 label="Address"
//                 value={data.address || data.detailAddress}
//               />
//               <ProfileField
//                 label="State"
//                 value={data.state}
//               />
//               <ProfileField
//                 label="City"
//                 value={data.city}
//               />
//               <ProfileField
//                 label="Status"
//                 value={data.isActive ? "Active" : "Inactive"}
//               />
//             </Box>
//           </Box>

//           {/* STRUCTURE DETAILS */}
//           <Box>
//             <Typography
//               className="font-outfit underline"
//               variant="subtitle1"
//               sx={{ fontWeight: 600, mb: 1 }}
//             >
//               Society Structure
//             </Typography>

//             <Box className="grid grid-cols-1 sm:grid-cols-2 gap-5">
//               <ProfileField
//                 label="Total Wings"
//                 value={String(data.totalWings)}
//               />
//               <ProfileField
//                 label="Floors per Wing"
//                 value={String(data.floorsPerWing)}
//               />
//               <ProfileField
//                 label="Flats per Floor"
//                 value={String(data.flatsPerFloor)}
//               />
//               <ProfileField
//                 label="Created On"
//                 value={new Date(data.createdAt).toLocaleDateString("en-IN")}
//               />
//             </Box>
//           </Box>
//         </Box>
//       </Box>
//     </Box>
//   );
// };

// export default ViewSociety;
