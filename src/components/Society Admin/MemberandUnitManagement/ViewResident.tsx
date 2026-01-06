// import React from "react";
// import {
//   Box,
//   Typography,
//   IconButton,
//   Divider,
//   Dialog,
//   DialogContent,
//   Avatar,
// } from "@mui/material";
// import CloseIcon from "@mui/icons-material/Close";

// interface Props {
//   open: boolean;
//   data: any;
//   onClose: () => void;
// }

// const ViewResident: React.FC<Props> = ({ open, data, onClose }) => {
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
//             }}
//           >
//             <Typography
//               sx={{
//                 fontFamily: "Outfit, sans-serif",
//                 fontSize: "18px",
//                 fontWeight: 600,
//               }}
//             >
//               Resident Details
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
//                 sx={{
//                   width: 90,
//                   height: 90,
//                   bgcolor: "#245492",
//                   fontSize: 32,
//                   fontWeight: 600,
//                 }}
//               >
//                 {data.residentName?.charAt(0)}
//               </Avatar>

//               <Box>
//                 <Typography
//                   sx={{
//                     fontFamily: "Outfit, sans-serif",
//                     fontSize: "20px",
//                     fontWeight: 600,
//                   }}
//                 >
//                   {data.residentName}
//                 </Typography>

//                 <Typography sx={{ fontFamily: "Outfit, sans-serif" }}>
//                   {data.email}
//                 </Typography>

//                 <Typography sx={{ fontFamily: "Outfit, sans-serif" }}>
//                   {data.mobile}
//                 </Typography>
//               </Box>
//             </Box>

//             <Divider sx={{ my: 3 }} />

//             {/* BASIC DETAILS */}
//             <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2}>
//               <Typography>
//                 <strong>Resident Type:</strong> {data.residentType}
//               </Typography>

//               <Typography>
//                 <strong>Flat Area:</strong> {data.residentFlatarea}
//               </Typography>

//               <Typography>
//                 <strong>Flat Size:</strong> {data.residentFlatsize}
//               </Typography>

//               <Typography>
//                 <strong>Parking:</strong> {data.residentParkingname}
//               </Typography>
//             </Box>

//             {/* SECOND RESIDENT */}
//             {(data.secondresidentName ||
//               data.secondresidentEmail ||
//               data.secondresidentMobile) && (
//               <>
//                 <Divider sx={{ my: 3 }} />

//                 <Typography
//                   sx={{
//                     fontFamily: "Outfit, sans-serif",
//                     fontWeight: 600,
//                     mb: 1,
//                   }}
//                 >
//                   Second Resident Details
//                 </Typography>

//                 <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2}>
//                   {data.secondresidentName && (
//                     <Typography>
//                       <strong>Name:</strong> {data.secondresidentName}
//                     </Typography>
//                   )}
//                   {data.secondresidentEmail && (
//                     <Typography>
//                       <strong>Email:</strong> {data.secondresidentEmail}
//                     </Typography>
//                   )}
//                   {data.secondresidentMobile && (
//                     <Typography>
//                       <strong>Mobile:</strong> {data.secondresidentMobile}
//                     </Typography>
//                   )}
//                 </Box>
//               </>
//             )}

//             <Divider sx={{ my: 3 }} />

//             {/* META */}
//             <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2}>
//               <Typography>
//                 <strong>Status:</strong>{" "}
//                 {data.isActive ? "Active" : "Inactive"}
//               </Typography>

//               <Typography>
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

// export default ViewResident;




import React from "react";
import {
  Typography,
  Divider,
  Avatar,
  Chip,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

interface Props {
  data: any;
  onClose: () => void;
}

const ViewResident: React.FC<Props> = ({ data, onClose }) => {
  if (!data) return null;

  const detailFields = [
    ["Resident Type", data.residentType],
    ["Flat Area", data.residentFlatarea],
    ["Flat Size", data.residentFlatsize],
    ["Parking", data.residentParkingname],
    ["Email", data.email],
    ["Mobile", data.mobile],
    [
      "Created On",
      new Date(data.createdAt).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
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

        {/* LEFT : AVATAR */}
        <div className="flex items-center justify-center">
          <div className="w-full h-[380px] rounded-lg bg-gray-100 flex items-center justify-center">
            <Avatar
              sx={{
                width: 140,
                height: 140,
                bgcolor: "#245492",
                fontSize: 48,
                fontWeight: 600,
              }}
            >
              {data.residentName?.charAt(0)}
            </Avatar>
          </div>
        </div>

        {/* RIGHT : DETAILS */}
        <div className="bg-gray-50 p-6 rounded-lg shadow">

          {/* Header */}
          <div className="flex items-center gap-3 mb-4">
            <Avatar
              sx={{
                width: 56,
                height: 56,
                bgcolor: "#245492",
              }}
            >
              {data.residentName?.charAt(0)}
            </Avatar>

            <div>
              <Typography variant="h6" fontWeight={600}>
                {data.residentName}
              </Typography>

              <Chip
                size="small"
                label={data.isActive ? "Active" : "Inactive"}
                color={data.isActive ? "success" : "default"}
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

          {/* DETAILS GRID */}
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

          {/* SECOND RESIDENT */}
          {(data.secondresidentName ||
            data.secondresidentEmail ||
            data.secondresidentMobile) && (
            <>
              <Divider sx={{ my: 4 }} />

              <Typography fontWeight={600} mb={2}>
                Second Resident Details
              </Typography>

              <div className="grid grid-cols-2 gap-y-4 gap-x-6">
                {data.secondresidentName && (
                  <div>
                    <p className="text-gray-500 text-sm">Name</p>
                    <p className="text-gray-800 font-medium">
                      {data.secondresidentName}
                    </p>
                  </div>
                )}

                {data.secondresidentEmail && (
                  <div>
                    <p className="text-gray-500 text-sm">Email</p>
                    <p className="text-gray-800 font-medium">
                      {data.secondresidentEmail}
                    </p>
                  </div>
                )}

                {data.secondresidentMobile && (
                  <div>
                    <p className="text-gray-500 text-sm">Mobile</p>
                    <p className="text-gray-800 font-medium">
                      {data.secondresidentMobile}
                    </p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default ViewResident;
