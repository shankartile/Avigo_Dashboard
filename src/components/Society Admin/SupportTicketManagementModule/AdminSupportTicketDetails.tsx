// import React, { useRef, useEffect, useState } from 'react';
// import { useLocation } from 'react-router-dom';
// import Button from '../../ui/button/Button';
// import TextArea from '../../form/input/TextArea';
// import FileInput from '../../form/input/FileInput';
// import { useParams, useNavigate } from 'react-router-dom';
// import { useDispatch, useSelector } from 'react-redux';
// import { Box, Typography, TextField, Divider, Avatar, Tooltip, Chip } from '@mui/material';
// import Dialog from '@mui/material/Dialog';
// import DialogTitle from '@mui/material/DialogTitle';
// import DialogContent from '@mui/material/DialogContent';
// import IconButton from '@mui/material/IconButton';
// // import { SendIcon } from 'lucide-react';
// import { FileText, MailIcon, PhoneCallIcon } from 'lucide-react';
// import { Attachment } from '@mui/icons-material';
// import SendIcon from '@mui/icons-material/Send';
// import CloseIcon from '@mui/icons-material/Close';
// import { AppDispatch, RootState } from '../../../store/store';
// import { unwrapResult } from '@reduxjs/toolkit';
// import Skeleton from 'react-loading-skeleton';
// import 'react-loading-skeleton/dist/skeleton.css';

// import {
//   fetchsupportticket,
//   updateTicketStatus,
//   addTicketNote,
//   sendMessageToTicket,
//   fetchTicketById
// } from '../../../store/SocietySupportTicketManagement/SocietySupportTicketManagementSlice';
// import JoditEditor from 'jodit-react';
// import Alert from '../../ui/alert/Alert';



// const SocietySupportTicketDetails = () => {
//   const { id } = useParams();
//   const { search } = useLocation();
//   const userType = new URLSearchParams(search).get('userType') || 'Webuser';
//   const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2 MB in bytes

//   const dispatch = useDispatch<AppDispatch>();
//   const navigate = useNavigate();

//   const { currentTicket: ticket } = useSelector((state: RootState) => state.societysupportticket);

//   const editor = useRef(null);
//   const [replyMessage, setReplyMessage] = useState('');
//   const [replyFile, setReplyFile] = useState<File[] | null>(null);
//   const [showEmojiPicker, setShowEmojiPicker] = useState(false);
//   const [alertType, setAlertType] = useState<'success' | 'error' | 'warning' | 'info' | null>(null);
//   const [alertMessage, setAlertMessage] = useState('');
//   const [showAlert, setShowAlert] = useState(false);
//   const [internalNote, setInternalNote] = useState('');
//   const [selectedStatus, setSelectedStatus] = useState("status");
//   const [previewUrl, setPreviewUrl] = useState<string | undefined>(undefined);
//   const [previewOpen, setPreviewOpen] = useState(false);
//   const [isSending, setIsSending] = useState(false);
//   const [showSkeleton, setShowSkeleton] = useState(true);




//   useEffect(() => {
//     const timer = setTimeout(() => setShowSkeleton(false), 1000);
//     return () => clearTimeout(timer);
//   }, []);

//   useEffect(() => {
//     if (id) {
//       dispatch(fetchTicketById({ id, userType }));
//     }
//   }, [dispatch, id, userType]);

//   if (!ticket) return <div className="p-4">Loading ticket details...</div>;

//   // console.log("details", ticket);
//   const isResolved = ticket?.status === 'Resolved';



//   const config = {
//     readonly: false,
//     height: 150,
//     toolbarSticky: false,
//     showXPathInStatusbar: false,
//     buttons: [
//       'bold',
//       'italic',
//       '|',
//       'align',
//     ],
//     controls: {
//       align: {
//         list: {
//           left: 'Align Left',
//           center: 'Align Center',
//           right: 'Align Right',
//           justify: 'Justify',
//         },
//       },
//     },
//     placeholder: 'Type your reply...',
//   };


//   // const handleSendReply = async () => {
//   //   try {
//   //     if (!replyMessage.trim() && !replyFile) return;

//   //     // This will throw if the thunk was rejected
//   //     await dispatch(sendMessageToTicket({
//   //       id: ticket._id,
//   //       userType: ticket.userType,
//   //       message: replyMessage,
//   //       attachments: replyFile || undefined
//   //     })).unwrap();

//   //     setAlertType('success');
//   //     setAlertMessage('Ticket reply sent successfully!');
//   //     setShowAlert(true);
//   //     setTimeout(() => setShowAlert(false), 3000);

//   //     setReplyMessage('');
//   //     setReplyFile(null);
//   //   } catch (err: any) {
//   //     setAlertType('error');
//   //     setAlertMessage(err || 'Failed to send message');
//   //     setShowAlert(true);
//   //     setTimeout(() => setShowAlert(false), 3000);
//   //   }
//   // };


//   const TicketDetailsSkeleton = () => {
//     return (
//       <div className="flex min-h-screen bg-gray-50">
//         {/* Left Main Panel */}
//         <main className="flex-1 p-6">
//           <Skeleton height={32} width={300} className="mb-4" />

//           {/* Description */}
//           <div className="bg-gray-200 p-4 rounded-md shadow mb-6">
//             <Skeleton height={24} width={200} className="mb-2" />
//             <Skeleton count={3} />
//             <div className="flex gap-2 mt-4">
//               <Skeleton width={100} height={20} />
//               <Skeleton width={100} height={20} />
//             </div>
//           </div>

//           {/* Chat Replies */}
//           {[1, 2, 3].map((_, i) => (
//             <div key={i} className="flex gap-2 justify-start mb-4">
//               <Skeleton circle width={40} height={40} />
//               <div>
//                 <Skeleton height={18} width={120} className="mb-1" />
//                 <Skeleton height={20} width={300} />
//               </div>
//             </div>
//           ))}

//           {/* Reply Box */}
//           <div className="border bg-white px-10 py-3 space-y-4">
//             <Skeleton height={36} width={100} />
//             <Skeleton height={150} />
//           </div>
//         </main>

//         {/* Right Info Panel */}
//         <aside className="w-[340px] sticky top-14 self-start bg-white border-l p-4 flex flex-col justify-between">
//           {/* User Info */}
//           <div className="flex flex-col items-center text-center space-y-2">
//             <Skeleton circle width={60} height={60} />
//             <Skeleton width={100} />
//             <Skeleton width={120} />
//             <Skeleton width={160} />
//           </div>

//           <div className="bg-gray-50 rounded-lg shadow p-3 mt-6">
//             <Skeleton height={80} />
//             <Skeleton height={36} width={100} className="mt-2 mx-auto" />
//           </div>

//           <div className="mt-4 space-y-2">
//             <Skeleton width={150} height={24} />
//             <Skeleton height={40} count={3} />
//           </div>

//           <div className="bg-gray-50 rounded-lg shadow p-3 mt-6">
//             <Skeleton width={120} height={24} className="mb-2" />
//             <Skeleton height={36} className="mb-2" />
//             <Skeleton height={36} width={150} className="mx-auto" />
//           </div>
//         </aside>
//       </div>
//     );
//   };



//   if (showSkeleton) return <TicketDetailsSkeleton />;

//   console.log("data", ticket?.userId?.name);

//   return (
//     <>
//       {showAlert && alertType && (
//         <div className="p-4">
//           <Alert
//             type={alertType}
//             title={
//               alertType === "success"
//                 ? "Success!"
//                 : alertType === "error" &&
//                   alertMessage.toLowerCase().includes("deleted")
//                   ? "Deleted!"
//                   : alertType === "error"
//                     ? "Error!"
//                     : "Warning!"
//             }
//             message={alertMessage}
//             variant="filled"
//             showLink={false}
//             linkHref=""
//             linkText=""
//             onClose={() => setShowAlert(false)}
//           />
//         </div>
//       )}

//       {/* Header */}
//       {/* <div
//         className={`${window.innerWidth < 1281
//           ? "w-160"
//           : window.innerWidth < 1460
//             ? "w-180"
//             : window.innerWidth < 1580
//               ? "w-210"
//               : window.innerWidth < 1598
//                 ? "w-240"
//                 : window.innerWidth < 1680
//                   ? "w-250"
//                   : window.innerWidth < 1764
//                     ? "w-260"
//                     : "w-300"
//           }
//  flex flex-column justify-between bg-white px-4 py-3 border-b sticky top-0 z-10`}
//         style={{ backgroundColor: "#fff" }}
//       > */}



//       <div className="flex items-center justify-between bg-white px-4 py-3 border-b sticky top-0 z-10 pr-[380px]">
//         {/* Subject left */}
//         <Typography className="font-outfit mb-0" variant="h5">
//           Ticket Subject: {ticket.subject}
//         </Typography>

//         {/* Status right */}
//         <div className="flex items-center">
//           <span className="font-outfit text-sm text-gray-500">Status:</span>
//           {(() => {
//             const status = String(ticket.status || "").toLowerCase();
//             let color: "success" | "warning" | "error" = "error";
//             let label = ticket.status || "";

//             if (status === "resolved") color = "success";
//             else if (status === "in progress") color = "warning";
//             else if (status === "open") color = "error";

//             return (
//               <Chip
//                 className="font-outfit ml-2"
//                 label={label}
//                 color={color}
//                 size="medium"
//                 variant="filled"
//               />
//             );
//           })()}
//         </div>
//       </div>



//       <div className="flex min-h-screen overflow-hidden bg-gray-50">


//         {/* Main Chat Panel */}
//         <main className="flex-1 overflow-y-auto h-screen p-6 pr-[380px]">
//           {/* Message Thread */}
//           <div className="space-y-4 mb-6">
//             {/* Ticket description */}
//             <Box className="flex gap-2 justify-start">
//               <Box
//                 className="p-3 rounded-2xl max-w-[50%] bg-gray-200 shadow break-words"
//                 style={{ wordBreak: "break-word", overflowWrap: "break-word" }}
//               >
//                 <Typography
//                   className="font-outfit"
//                   variant="subtitle1"
//                   fontWeight={600}
//                 >
//                   Issue Description
//                 </Typography>
//                 <p className="whitespace-pre-wrap">{ticket.description}</p>

//                 {ticket.attachments?.map((file, i) => {
//                   const src =
//                     typeof file === "string"
//                       ? file
//                       : file && typeof file === "object" && file instanceof File
//                         ? URL.createObjectURL(file)
//                         : "";
//                   const isPdf = src.toLowerCase().endsWith(".pdf");

//                   return (
//                     <div
//                       key={i}
//                       onClick={() => {
//                         setPreviewUrl(src);
//                         setPreviewOpen(true);
//                       }}
//                       className="cursor-pointer mt-2 inline-block"
//                     >
//                       {isPdf ? (
//                         <div className="border p-2 rounded bg-gray-100 text-sm text-blue-700 w-fit hover:underline">
//                           📄 PDF Attachment {i + 1}
//                         </div>
//                       ) : (
//                         <img
//                           src={src}
//                           alt={`attachment-${i}`}
//                           className="w-20 h-20 object-cover border rounded hover:opacity-80 transition"
//                         />
//                       )}
//                     </div>
//                   );
//                 })}
//               </Box>
//             </Box>



//             {/* Replies */}
//             {ticket.replies?.map((reply, idx) => (
//               <Box
//                 key={idx}
//                 className={`flex gap-2 ${reply.sender === "Admin" ? "justify-end" : "justify-start"
//                   }`}
//               >
//                 {reply.sender !== "Admin" && <Avatar>{reply.sender[0]}</Avatar>}

//                 <Box
//                   className={`p-3 rounded-2xl max-w-[50%] break-words ${reply.sender === "Admin" ? "bg-blue-100" : "bg-gray-200"
//                     }`}
//                   style={{ wordBreak: "break-word", overflowWrap: "break-word" }}
//                 >
//                   <Typography
//                     component="div"
//                     className="font-outfit font-medium mb-1 whitespace-pre-wrap"
//                   >
//                     <div dangerouslySetInnerHTML={{ __html: reply.message }} />
//                   </Typography>

//                   {reply.attachments?.map((file, i) => {
//                     const src =
//                       typeof file === "string"
//                         ? file
//                         : file && typeof file === "object"
//                           ? URL.createObjectURL(file)
//                           : "";
//                     const isPdf = src.toLowerCase().endsWith(".pdf");

//                     return (
//                       <div
//                         key={i}
//                         onClick={() => {
//                           setPreviewUrl(src);
//                           setPreviewOpen(true);
//                         }}
//                         className="cursor-pointer mt-2"
//                       >
//                         {isPdf ? (
//                           <div className="border p-2 rounded bg-gray-100 text-sm text-blue-700 w-fit hover:underline">
//                             <FileText className="text-red-500 w-5 h-5" />
//                             PDF Attachment {i + 1}
//                           </div>
//                         ) : (
//                           <img
//                             src={src}
//                             alt={`reply-img-${i}`}
//                             className="font-outfit max-w-[100px] max-h-[100px] border rounded object-cover"
//                           />
//                         )}
//                       </div>
//                     );
//                   })}

//                   <Typography className="font-outfit text-xs text-gray-500 mt-1">
//                     {new Date(reply.createdAt).toLocaleString("en-IN")}
//                   </Typography>
//                 </Box>

//                 {reply.sender === "Admin" && <Avatar>{reply.sender[0]}</Avatar>}
//               </Box>
//             ))}
//           </div>



//           {/* Spacer so fixed editor doesn’t overlap content */}
//           <div className="h-44" />
//         </main>



//         {/* Right Info Panel */}
//         <aside
//           className="w-[350px] fixed right-0 top-[64px] h-[calc(100vh-64px)] bg-white border-l p-4 flex flex-col z-30"
//           style={{ boxShadow: '-2px 0 4px rgba(0,0,0,0.05)' }}
//         >


//           {/* Top: User Info */}
//           <div className='mt-2'>
//             <div className="flex items-center gap-4">
//               {/* Left Column */}
//               <div className="flex flex-col items-center">
//                 <Avatar sx={{ width: 60, height: 60 }} />
//                 <Typography className="font-outfit text-sm text-gray-500 mt-1">
//                   {ticket.userType}
//                 </Typography>
//               </div>

//               {/* Middle Divider */}
//               <div className="w-px bg-gray-300 h-16"></div>

//               {/* Right Column */}
//               <div className="flex flex-col">
//                 <Typography className="font-outfit font-semibold">
//                   {ticket.userId?.name || 'User'}
//                 </Typography>
//                 {/* {ticket.userType === 'Dealer' && (
//                   <Typography className="font-outfit text-sm text-gray-500 flex items-center">
//                     <MailIcon size={16} className="mr-1" />
//                     {ticket.userId?.email || 'N/A'}
//                   </Typography>
//                 )} */}
//                 {ticket.userType === 'Webuser' && (
//                   <Typography className="font-outfit text-sm text-gray-500 flex items-center">
//                     <PhoneCallIcon size={16} className="mr-1" />
//                     {ticket.userId?.phone || 'N/A'}
//                   </Typography>
//                 )}
//               </div>
//             </div>


//             {/* Internal Notes */}
//             {!isResolved && (
//               <div className="bg-gray-50 rounded-lg shadow p-3 mt-4">
//                 <TextArea
//                   label="Internal Notes"
//                   value={internalNote}
//                   onChange={(e) => setInternalNote(e.target.value)}
//                   rows={3}
//                   maxLength={300}
//                   hint="Visible only to support staff"
//                 />
//                 <div className="flex justify-center">
//                   <Button
//                     size='xs'
//                     disabled={!internalNote}
//                     className="mt-2"
//                     onClick={() => {
//                       if (!internalNote.trim()) {
//                         setAlertType('warning');
//                         setAlertMessage('Please enter a note before saving.');
//                         setShowAlert(true);
//                         return;
//                       }
//                       dispatch(addTicketNote({
//                         id: ticket._id,
//                         note: internalNote,
//                         userType: ticket.userType
//                       }));
//                       setInternalNote('');
//                       setAlertType('success');
//                       setAlertMessage('Internal note added successfully!');
//                       setShowAlert(true);
//                       setTimeout(() => setShowAlert(false), 3000);

//                     }}
//                   >
//                     Save Note
//                   </Button>
//                 </div>
//               </div>
//             )}
//           </div>


//           <div className="mt-2 space-y-2 overflow-y-auto ">
//             <Typography variant="subtitle1" className="font-outfit font-semibold">Internal Notes</Typography>
//             {ticket.internalNotes && ticket.internalNotes.length > 0 ? (
//               ticket.internalNotes.map((note, index) => (
//                 <div key={index} className="bg-gray-100 text-sm p-2 rounded">
//                   {note}
//                 </div>
//               ))
//             ) : (
//               <Typography className="font-outfit text-sm text-gray-500">No internal notes yet.</Typography>
//             )}
//           </div>


//           {/* Bottom: Ticket Status */}
//           {!isResolved && (
//             <div className="bg-gray-100 rounded-lg shadow p-3 mt-auto  bottom-0">
//               <Typography
//                 component="label"
//                 htmlFor="ticketStatus"
//                 className="font-outfit mb-2 block cursor-pointer select-none"
//               >
//                 Ticket Status
//               </Typography>

//               <select
//                 value={selectedStatus}
//                 onChange={(e) => setSelectedStatus(e.target.value)}
//                 className="w-full border border-gray-300 focus:border-black focus:ring-0 rounded-lg shadow px-3 py-2 mb-2"
//               >
//                 <option value="status">Select Ticket Status</option>
//                 {ticket.status !== 'In Progress' && (
//                   <option value="Open">Open</option>
//                 )}
//                 <option value="In Progress">In Progress</option>
//                 <option value="Resolved">Resolved</option>
//               </select>

//               <div className="flex justify-center">
//                 <Button size='xs'
//                   // className="w-30"
//                   disabled={isSending || selectedStatus === 'status'}// disable button while sending
//                   onClick={async () => {
//                     if (selectedStatus === "status") {
//                       setAlertType("warning");
//                       setAlertMessage("Please select a valid ticket status.");
//                       setShowAlert(true);
//                       return;
//                     }

//                     if (!replyMessage.trim() && !replyFile?.length) {
//                       setAlertType("warning");
//                       setAlertMessage("Please enter a reply message or upload an attachment.");
//                       setShowAlert(true);
//                       return;
//                     }
//                     if (replyFile?.some(file => file.size > MAX_FILE_SIZE)) {
//                       setAlertType("warning");
//                       setAlertMessage("Each attachment must be less than 2 MB.");
//                       setShowAlert(true);
//                       return;
//                     }
//                     setIsSending(true); // start loading

//                     try {
//                       // 1. Send reply

//                       await dispatch(sendMessageToTicket({
//                         id: ticket._id,
//                         userType: ticket.userType,
//                         message: replyMessage,
//                         attachments: replyFile || undefined
//                       })).unwrap();

//                       // 2.  Update ticket status 
//                       await dispatch(updateTicketStatus({
//                         id: ticket._id,
//                         status: selectedStatus,
//                         userType: ticket.userType
//                       })).unwrap();

//                       setAlertType('success');
//                       setAlertMessage('Status updated & reply sent successfully!');
//                       setShowAlert(true);
//                       setReplyMessage('');
//                       setReplyFile(null);
//                       setSelectedStatus('status');
//                     } catch (err: any) {
//                       setAlertType('error');
//                       setAlertMessage(err || 'Failed to update status or send reply');
//                       setShowAlert(true);
//                     } finally {
//                       setTimeout(() => setShowAlert(false), 4000);
//                       setIsSending(false); // reset loading
//                     }
//                   }}
//                 >
//                   {isSending ? 'Sending...' : <>Send <SendIcon /></>}
//                 </Button>
//               </div>
//             </div>
//           )}
//         </aside>




//         {/* Fixed Reply Composer */}
//         {!isResolved && (
//           <div className="fixed left-0 right-[40px] bottom-2 z-20 flex justify-center">
//             <Box
//               className={`bg-white border rounded-2xl shadow p-3 w-full ${window.innerWidth < 1281
//                 ? "max-w-xl"
//                 : window.innerWidth < 1580
//                   ? "max-w-3xl"
//                   : window.innerWidth < 1715
//                     ? "max-w-4xl"
//                     : window.innerWidth < 1760
//                       ? "max-w-5xl"
//                       : "max-w-6xl"
//                 }`}
//             >

//               {/* Toolbar */}
//               <Box className="flex items-center gap-2 mb-2">
//                 <Tooltip title="Attach file">
//                   <IconButton component="label">
//                     <Attachment />
//                     <input
//                       hidden
//                       type="file"
//                       onChange={(e) =>
//                         setReplyFile(Array.from(e.target.files || []))
//                       }
//                     />
//                   </IconButton>
//                 </Tooltip>
//               </Box>

//               {/* Jodit Editor */}
//               <div style={{ minHeight: 110 }}>
//                 <JoditEditor
//                   ref={editor}
//                   value={replyMessage}
//                   config={{
//                     ...config,
//                     toolbarSticky: true,
//                     toolbarStickyOffset: 64,
//                     minHeight: 110,
//                     maxHeight: 220,
//                     readonly: false,
//                     toolbarAdaptive: false,
//                     placeholder: "Type your reply...",
//                   }}
//                   tabIndex={1}
//                   onBlur={(newContent) => setReplyMessage(newContent)}
//                 />
//               </div>
//             </Box>
//           </div>
//         )}



//         {/* Preview Dialog */}
//         <Dialog
//           open={previewOpen}
//           onClose={() => setPreviewOpen(false)}
//           maxWidth="lg"
//           fullWidth
//         >
//           <DialogTitle className="font-outfit flex justify-between items-center text-[#063f1f] font-semibold">
//             Preview
//             <IconButton onClick={() => setPreviewOpen(false)}>
//               <CloseIcon />
//             </IconButton>
//           </DialogTitle>
//           <DialogContent dividers>
//             {previewUrl?.endsWith(".pdf") ? (
//               <iframe
//                 src={previewUrl}
//                 width="100%"
//                 height="600px"
//                 title="Document Preview"
//                 style={{ border: "none" }}
//               />
//             ) : (
//               <img
//                 src={previewUrl}
//                 alt="Preview"
//                 className="w-full max-h-[600px] object-contain"
//               />
//             )}
//           </DialogContent>
//         </Dialog>
//       </div>
//     </>
//   );

// };
// export default SocietySupportTicketDetails;





import React, { useRef, useEffect, useState } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import Button from '../../ui/button/Button';
import TextArea from '../../form/input/TextArea';
import { Box, Typography, Avatar, Tooltip, Chip } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import { FileText, PhoneCallIcon } from 'lucide-react';
import { Attachment } from '@mui/icons-material';
import SendIcon from '@mui/icons-material/Send';
import CloseIcon from '@mui/icons-material/Close';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import JoditEditor from 'jodit-react';
import Alert from '../../ui/alert/Alert';

/* ===================== DUMMY TICKET ===================== */

const dummyTicket: any = {
  _id: 'st-101',
  userType: 'Webuser',
  subject: 'Unable to submit enquiry form',
  description: 'I am trying to submit the enquiry form but it keeps loading.',
  status: 'Open',
  userId: {
    name: 'Rohit Patil',
    phone: '9876543210',
  },
  attachments: [],
  replies: [
    {
      sender: 'Webuser',
      message: 'Please help me with this issue.',
      createdAt: new Date().toISOString(),
    },
    {
      sender: 'Admin',
      message: '<p>We are checking this issue.</p>',
      createdAt: new Date().toISOString(),
    },
  ],
  internalNotes: ['Checked backend logs', 'Issue might be API timeout'],
};

/* ===================== COMPONENT ===================== */

const AdminSupportTicketDetails = () => {
  const { search } = useLocation();
  const userType = new URLSearchParams(search).get('userType') || 'Webuser';
  const navigate = useNavigate();
  const editor = useRef<any>(null);

  const MAX_FILE_SIZE = 2 * 1024 * 1024;

  /* ---------- STATE ---------- */
  const [ticket, setTicket] = useState<any>(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [replyFile, setReplyFile] = useState<File[] | null>(null);
  const [alertType, setAlertType] =
    useState<'success' | 'error' | 'warning' | 'info' | null>(null);
  const [alertMessage, setAlertMessage] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [internalNote, setInternalNote] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('status');
  const [previewUrl, setPreviewUrl] = useState<string | undefined>();
  const [previewOpen, setPreviewOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [showSkeleton, setShowSkeleton] = useState(true);

  /* ---------- EFFECTS ---------- */
  useEffect(() => {
    const timer = setTimeout(() => {
      setTicket(dummyTicket);
      setShowSkeleton(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  if (showSkeleton) {
    return (
      <div className="p-6">
        <Skeleton height={32} width={300} />
        <Skeleton count={6} className="mt-4" />
      </div>
    );
  }

  if (!ticket) return <div className="p-4">Loading ticket details...</div>;

  const isResolved = ticket.status === 'Resolved';

  /* ===================== RENDER ===================== */

  return (
    <>
      {showAlert && alertType && (
        <div className="p-4">
          <Alert
            type={alertType}
            title="Info"
            message={alertMessage}
            variant="filled"
            onClose={() => setShowAlert(false)}
          />
        </div>
      )}

      {/* HEADER (AS-IT-IS) */}
      <div className="flex items-center justify-between bg-white px-4 py-3 border-b sticky top-0 z-10 pr-[380px]">
        <Typography className="font-outfit mb-0" variant="h5">
          Ticket Subject: {ticket.subject}
        </Typography>

        <div className="flex items-center">
          <span className="font-outfit text-sm text-gray-500">Status:</span>
          <Chip
            className="font-outfit ml-2"
            label={ticket.status}
            color={
              ticket.status === 'Resolved'
                ? 'success'
                : ticket.status === 'In Progress'
                ? 'warning'
                : 'error'
            }
            size="medium"
            variant="filled"
          />
        </div>
      </div>

      <div className="flex min-h-screen overflow-hidden bg-gray-50">
        {/* MAIN CHAT */}
        <main className="flex-1 overflow-y-auto h-screen p-6 pr-[380px]">
          <Box className="flex gap-2 justify-start">
            <Box className="p-3 rounded-2xl max-w-[50%] bg-gray-200 shadow break-words">
              <Typography className="font-outfit" fontWeight={600}>
                Issue Description
              </Typography>
              <p>{ticket.description}</p>
            </Box>
          </Box>

          {ticket.replies.map((reply: any, idx: number) => (
            <Box
              key={idx}
              className={`flex gap-2 ${
                reply.sender === 'Admin' ? 'justify-end' : 'justify-start'
              }`}
            >
              {reply.sender !== 'Admin' && <Avatar>{reply.sender[0]}</Avatar>}
              <Box
                className={`p-3 rounded-2xl max-w-[50%] ${
                  reply.sender === 'Admin' ? 'bg-blue-100' : 'bg-gray-200'
                }`}
              >
                <div dangerouslySetInnerHTML={{ __html: reply.message }} />
                <Typography className="text-xs text-gray-500 mt-1">
                  {new Date(reply.createdAt).toLocaleString('en-IN')}
                </Typography>
              </Box>
              {reply.sender === 'Admin' && <Avatar>A</Avatar>}
            </Box>
          ))}

          <div className="h-44" />
        </main>

        {/* RIGHT PANEL */}
        <aside className="w-[350px] fixed right-0 top-[64px] h-[calc(100vh-64px)] bg-white border-l p-4 flex flex-col z-30">
          <div className="flex items-center gap-4">
            <Avatar sx={{ width: 60, height: 60 }} />
            <div>
              <Typography className="font-outfit font-semibold">
                {ticket.userId.name}
              </Typography>
              <Typography className="font-outfit text-sm text-gray-500 flex items-center">
                <PhoneCallIcon size={16} className="mr-1" />
                {ticket.userId.phone}
              </Typography>
            </div>
          </div>

          {!isResolved && (
            <div className="bg-gray-50 rounded-lg shadow p-3 mt-4">
              <TextArea
                label="Internal Notes"
                value={internalNote}
                onChange={(e) => setInternalNote(e.target.value)}
              />
              <div className="flex justify-center">
                <Button
                  size="xs"
                  disabled={!internalNote}
                  onClick={() => {
                    setTicket((prev: any) => ({
                      ...prev,
                      internalNotes: [...prev.internalNotes, internalNote],
                    }));
                    setInternalNote('');
                    setAlertType('success');
                    setAlertMessage('Internal note added successfully!');
                    setShowAlert(true);
                  }}
                >
                  Save Note
                </Button>
              </div>
            </div>
          )}

          <div className="mt-2 space-y-2 overflow-y-auto">
            <Typography className="font-outfit font-semibold">
              Internal Notes
            </Typography>
            {ticket.internalNotes.map((note: string, i: number) => (
              <div key={i} className="bg-gray-100 text-sm p-2 rounded">
                {note}
              </div>
            ))}
          </div>

          {!isResolved && (
            <div className="bg-gray-100 rounded-lg shadow p-3 mt-auto">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full border rounded px-3 py-2 mb-2"
              >
                <option value="status">Select Ticket Status</option>
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
              </select>

              <div className="flex justify-center">
                <Button
                  size="xs"
                  disabled={selectedStatus === 'status'}
                  onClick={() => {
                    setTicket((p: any) => ({
                      ...p,
                      status: selectedStatus,
                    }));
                    setSelectedStatus('status');
                    setAlertType('success');
                    setAlertMessage('Status updated & reply sent!');
                    setShowAlert(true);
                  }}
                >
                  Send <SendIcon />
                </Button>
              </div>
            </div>
          )}
        </aside>

        {/* FIXED REPLY COMPOSER (AS-IT-IS) */}
        {!isResolved && (
          <div className="fixed left-0 right-[40px] bottom-2 z-20 flex justify-center">
            <Box className="bg-white border rounded-2xl shadow p-3 w-full max-w-5xl">
              <Box className="flex items-center gap-2 mb-2">
                <Tooltip title="Attach file">
                  <IconButton component="label">
                    <Attachment />
                    <input
                      hidden
                      type="file"
                      onChange={(e) =>
                        setReplyFile(Array.from(e.target.files || []))
                      }
                    />
                  </IconButton>
                </Tooltip>
              </Box>

              <JoditEditor
                ref={editor}
                value={replyMessage}
                config={{
                  height: 150,
                  placeholder: 'Type your reply...',
                }}
                onBlur={(content) => setReplyMessage(content)}
              />
            </Box>
          </div>
        )}

        {/* PREVIEW */}
        <Dialog
          open={previewOpen}
          onClose={() => setPreviewOpen(false)}
          maxWidth="lg"
          fullWidth
        >
          <DialogTitle>
            Preview
            <IconButton onClick={() => setPreviewOpen(false)}>
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            {previewUrl?.endsWith('.pdf') ? (
              <iframe src={previewUrl} width="100%" height="600" />
            ) : (
              <img src={previewUrl} className="w-full" />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

export default AdminSupportTicketDetails;
