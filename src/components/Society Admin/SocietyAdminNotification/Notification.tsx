// import React, { useEffect, useState, useRef, useCallback } from 'react';
// import {
//     Chip,
//     CircularProgress,
//     Tooltip,
//     Box,
// } from '@mui/material';
// import Skeleton from "react-loading-skeleton";
// import "react-loading-skeleton/dist/skeleton.css";
// import CheckIcon from '@mui/icons-material/Check';
// import { useDispatch, useSelector } from 'react-redux';
// import { AppDispatch, RootState } from '../../../store/store';
// import { fetchnotification, markNotificationAsRead, } from '../../../store/SocietyAdminDashboard/societyAdminDashboardSlice';
// import { useNavigate } from 'react-router-dom';
// import {
//     UserPlusIcon,
//     UserCheckIcon,
//     CarIcon,
//     CreditCardIcon,
//     HelpCircleIcon,
//     CheckCircleIcon,
// } from 'lucide-react';
// import { getActiveUser } from '../../../utility/Cookies';
// import Pagination from '@mui/material/Pagination';
// import Stack from '@mui/material/Stack';
// import Typography from '@mui/material/Typography';
// import { permission } from 'process';



// const moduleKeyRouteMap: Record<string, string> = {
//     adminsupportticket: '/admin/supportticket-management',
// };


// const filterOptions = [
//     { key: 'all', label: 'All', permission: null },
//     { key: 'AdminSupportModule', label: 'Admin Support Tickets',permission: null },
// ];


// const typeBgMap: Record<string, string> = {

//     adminsupportticket: 'bg-red-50',

// };

// const iconMap: Record<string, React.ReactNode> = {

//     adminsupportticket: <HelpCircleIcon size={18} className="mr-2 text-red-600" />,

// };

// const NotificationsSkeleton = () => {
//     return (
//         <div className="p-6 bg-gray-50 min-h-screen">
//             <h2 className="font-outfit text-2xl font-bold text-gray-800 mb-4">
//                 <Skeleton width={200} height={28} />
//             </h2>

//             {/* Filter Chips */}
//             <div className="bg-white rounded-xl p-4 flex flex-wrap gap-4 mb-6 border border-gray-200">
//                 {Array.from({ length: 6 }).map((_, i) => (
//                     <Skeleton
//                         key={i}
//                         height={32}
//                         width={140}
//                         style={{ borderRadius: 16 }}
//                     />
//                 ))}
//             </div>

//             {/* Notifications List */}
//             <div className="max-w-[900px] mx-auto">
//                 {Array.from({ length: 6 }).map((_, i) => (
//                     <div
//                         key={i}
//                         className="bg-white rounded-lg shadow-sm p-4 mb-3 flex flex-col border border-gray-200"
//                     >
//                         <div className="flex items-center justify-between">
//                             <div className="flex flex-col flex-1">
//                                 <Skeleton height={20} width="60%" className="mb-1" />
//                                 <Skeleton height={16} width="80%" />
//                             </div>
//                             <Skeleton circle height={28} width={28} />
//                         </div>
//                         <Skeleton height={14} width="30%" className="mt-1" />
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// };



// const Notification: React.FC = () => {
//     const dispatch = useDispatch<AppDispatch>();
//     const navigate = useNavigate();

//     const user = getActiveUser();
//     const activeRole = sessionStorage.getItem('activeRole');

//     const visibleFilterOptions = React.useMemo(() => {
//         // Admin → see all tabs
//         if (activeRole === 'admin') return filterOptions;

//         // Staff → only permitted tabs
//         const allowedPermissions =
//             user?.permissions
//                 ?.filter((p: any) => p.allowed)
//                 .map((p: any) => p.key) || [];
//         console.log("allowedPermissions", allowedPermissions)
//         return filterOptions.filter(
//             (opt) =>
//                 opt.permission === null ||
//                 allowedPermissions.includes(opt.permission)
//         );
//     }, [activeRole, user]);



//     // local UI state
//     const [selectedFilter, setSelectedFilter] = useState('all');
//     const [showSkeleton, setShowSkeleton] = useState(true);


//     // refs to avoid stale closures
//     // const loadedPagesRef = useRef<number[]>(loadedPages);





//     // hide skeleton shortly after mount
//     useEffect(() => {
//         const t = setTimeout(() => setShowSkeleton(false), 600);
//         return () => clearTimeout(t);
//     }, []);

//     // initial load of page 1

//     const {
//         Notifications,
//         loading,
//         pagination: { currentPage, totalPages, totalItems, pageSize },
//     } = useSelector((state: RootState) => state.superAdminDashboard);


//     useEffect(() => {
//         dispatch(fetchnotification({ page: 1, moduleKes: selectedFilter }));
//     }, [selectedFilter, dispatch]);





//     // attach IntersectionObserver to the sentinel; re-run when list length changes so it attaches reliably

//     const handleNavigate = (item: any) => {
//         let route = '';
//         if (item.moduleKey === 'adminsupportticket') {
//             route =
//                 item.type === 'AdminSupportModule'
//                     ? '/admin/notification-management?type=admin'
//                     : '/admin/notification-management?type=admin';
//         } else {
//             route = moduleKeyRouteMap[item.moduleKey];
//         }

//         if (route) {
//             dispatch(markNotificationAsRead(item._id)).then(() => {
//                 navigate(route);
//             });
//         }
//     };

//     // const handleNavigate = (item: any) => {
//     //     let route = '';

//     //     if (item.moduleKey === 'supportticket') {
//     //         route = '/admin/notification-management?type=admin';
//     //     } else {
//     //         route = moduleKeyRouteMap[item.moduleKey];
//     //     }

//     //     if (route) {
//     //         dispatch(markNotificationAsRead(item._id)).then(() => {
//     //             navigate(route);
//     //         });
//     //     }
//     // };

//     // const handleNavigate = (item: any) => {
//     //     let route = '';
//     //     if (item.moduleKey === 'supportticket') {
//     //         route =
//     //             item.type === 'AdminSupportModule'
//     //                 ? '/admin/supportticketmanagement?type=admin'
//     //                 : '/superadmin/supportticketmanagement?type=dealer';
//     //     } else {
//     //         route = moduleKeyRouteMap[item.moduleKey];
//     //     }

//     //     if (route) {
//     //         dispatch(markNotificationAsRead(item._id)).then(() => {
//     //             navigate(route);
//     //         });
//     //     }
//     // };

//     const handleMarkRead = (e: React.MouseEvent, id: string) => {
//         e.stopPropagation();
//         dispatch(markNotificationAsRead(id));
//     };
//     const filteredNotifications = Notifications;


//     if (showSkeleton) return <NotificationsSkeleton />;
//     const handlePageChange = (_: React.ChangeEvent<unknown>, page: number) => {
//         dispatch(fetchnotification({ page, moduleKes: selectedFilter }));
//     };

//     return (
//         <div className="p-6 bg-gray-50 min-h-screen">
//             <h2 className="font-outfit text-2xl font-bold text-gray-800 mb-4">Notifications</h2>
//             {/* Pagination Bar */}
//             {/* Pagination Footer */}


//             {/* Filter Chips -  full width */}
//             <Box className="bg-white rounded-xl p-4 flex flex-wrap gap-4 mb-6 border border-gray-200 sticky top-0 z-10">
//                 {visibleFilterOptions.map((opt) => (
//                     <Chip
//                         key={opt.key}
//                         label={opt.label}
//                         clickable
//                         onClick={() => setSelectedFilter(opt.key)}
//                         variant={selectedFilter === opt.key ? 'filled' : 'outlined'}
//                         sx={{
//                             fontFamily: 'Outfit, sans-serif',
//                             fontSize: '0.95rem',
//                             backgroundColor: selectedFilter === opt.key ? '#255593' : 'transparent',
//                             color: selectedFilter === opt.key ? '#fff' : '#255593',
//                             borderColor: '#255593',
//                             '&:hover': {
//                                 backgroundColor:
//                                     selectedFilter === opt.key ? '#1e467c' : 'rgba(37, 85, 147, 0.08)',
//                             },
//                             '&.Mui-disabled': {
//                                 backgroundColor: '#8ca5c2',
//                                 color: '#fff',
//                             },
//                         }}
//                     />
//                 ))}
//             </Box>

//             {/* Notifications List - centered */}
//             <div className="max-w-[900px] mx-auto">
//                 {filteredNotifications.length === 0 && !loading ? (
//                     <div className="text-center text-gray-400 mt-10">No notifications</div>
//                 ) : (
//                     filteredNotifications.map((item, index) => {
//                         const icon = iconMap[item.moduleKey] || <CheckCircleIcon size={18} />;
//                         const typeBg = typeBgMap[item.moduleKey] || '';
//                         const readClass = !item.isRead
//                             ? 'bg-blue-100 font-semibold'
//                             : 'text-gray-500 opacity-70';

//                         const isLastItem = index === filteredNotifications.length - 1;

//                         return (
//                             <div
//                                 key={item._id}
//                                 onClick={() => handleNavigate(item)}
//                                 className={`rounded-lg shadow-sm p-4 mb-3 flex flex-col hover:shadow-md transition cursor-pointer border border-gray-200 ${typeBg} ${readClass}`}
//                             >

//                                 <>
//                                     <div className="flex items-center justify-between">
//                                         <div className="flex flex-col text-md text-gray-800">
//                                             <div
//                                                 className={`flex items-center text-md ${!item.isRead ? 'font-semibold' : 'text-gray-500'}`}
//                                             >
//                                                 {icon}
//                                                 {item.title}
//                                             </div>
//                                             <div className="text-sm text-gray-600 mt-1">{item.message}</div>
//                                         </div>
//                                         {!item.isRead && (
//                                             <Tooltip title="Mark as read">
//                                                 <button
//                                                     onClick={(e) => handleMarkRead(e, item._id)}
//                                                     className="text-xs ml-2 text-blue-500 hover:underline"
//                                                 >
//                                                     <CheckIcon />
//                                                 </button>
//                                             </Tooltip>
//                                         )}
//                                     </div>
//                                     <div className="text-xs text-gray-500 mt-1">
//                                         {new Date(item.createdAt).toLocaleString('en-IN', {
//                                             timeZone: 'Asia/Kolkata',
//                                         })}
//                                     </div>
//                                 </>

//                             </div>
//                         );
//                     })
//                 )}
//             </div>
//             {totalPages > 1 && (
//                 <Box className="max-w-[900px] mx-auto mt-6">
//                     <Box
//                         className="bg-white border border-gray-200 rounded-xl px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
//                     >
//                         {/* Info */}
//                         <Typography
//                             variant="body2"
//                             className="text-gray-600 text-center sm:text-left"
//                         >
//                             Showing{" "}
//                             <span className="font-medium text-gray-800">
//                                 {(currentPage - 1) * pageSize + 1}
//                             </span>
//                             –
//                             <span className="font-medium text-gray-800">
//                                 {Math.min(currentPage * pageSize, totalItems)}
//                             </span>{" "}
//                             of{" "}
//                             <span className="font-medium text-gray-800">{totalItems}</span>
//                         </Typography>

//                         {/* Pagination */}
//                         <Pagination
//                             page={currentPage}
//                             count={totalPages}
//                             onChange={handlePageChange}
//                             shape="rounded"
//                             size="small"
//                             siblingCount={1}
//                             boundaryCount={1}
//                             disabled={loading}
//                             sx={{
//                                 '& .MuiPaginationItem-root': {
//                                     fontFamily: 'Outfit, sans-serif',
//                                     fontSize: '0.85rem',
//                                 },
//                                 '& .Mui-selected': {
//                                     backgroundColor: '#255593 !important',
//                                     color: '#fff',
//                                 },
//                             }}
//                         />
//                     </Box>
//                 </Box>
//             )}
//         </div>
//     );
// };
// export default Notification;




import React, { useEffect, useState } from 'react';
import {
    Chip,
    Tooltip,
    Box,
    Pagination,
    Typography,
} from '@mui/material';
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import CheckIcon from '@mui/icons-material/Check';
import { useNavigate } from 'react-router-dom';
import {
    HelpCircleIcon,
    CheckCircleIcon,
} from 'lucide-react';
import InfoIcon from "@mui/icons-material/Info";



const dummyNotifications = [
    {
        _id: "1",
        title: "New Admin Support Ticket",
        message: "A new support ticket has been created.",
        moduleKey: "adminsupportticket",
        type: "AdminSupportModule",
        isRead: false,
        createdAt: new Date().toISOString(),
    },
    {
        _id: "2",
        title: "Ticket Updated",
        message: "Support ticket status updated by admin.",
        moduleKey: "adminsupportticket",
        type: "AdminSupportModule",
        isRead: true,
        createdAt: new Date(Date.now() - 3600000).toISOString(),
    },
    {
        _id: "3",
        title: "Ticket Closed",
        message: "Support ticket has been closed.",
        moduleKey: "adminsupportticket",
        type: "AdminSupportModule",
        isRead: false,
        createdAt: new Date(Date.now() - 86400000).toISOString(),
    },
    {
        _id: "4",
        title: "New Admin Support Ticket",
        message: "A new support ticket has been created.",
        moduleKey: "adminsupportticket",
        type: "AdminSupportModule",
        isRead: false,
        createdAt: new Date().toISOString(),
    },
    {
        _id: "5",
        title: "Ticket Updated",
        message: "Support ticket status updated by admin.",
        moduleKey: "adminsupportticket",
        type: "AdminSupportModule",
        isRead: true,
        createdAt: new Date(Date.now() - 3600000).toISOString(),
    },
    {
        _id: "6",
        title: "Ticket Closed",
        message: "Support ticket has been closed.",
        moduleKey: "adminsupportticket",
        type: "AdminSupportModule",
        isRead: false,
        createdAt: new Date(Date.now() - 86400000).toISOString(),
    },
    {
        _id: "7",
        title: "New Admin Support Ticket",
        message: "A new support ticket has been created.",
        moduleKey: "adminsupportticket",
        type: "AdminSupportModule",
        isRead: false,
        createdAt: new Date().toISOString(),
    },
    {
        _id: "8",
        title: "Ticket Updated",
        message: "Support ticket status updated by admin.",
        moduleKey: "adminsupportticket",
        type: "AdminSupportModule",
        isRead: true,
        createdAt: new Date(Date.now() - 3600000).toISOString(),
    },
    {
        _id: "9",
        title: "Ticket Closed",
        message: "Support ticket has been closed.",
        moduleKey: "adminsupportticket",
        type: "AdminSupportModule",
        isRead: false,
        createdAt: new Date(Date.now() - 86400000).toISOString(),
    },
    {
        _id: "10",
        title: "New Admin Support Ticket",
        message: "A new support ticket has been created.",
        moduleKey: "adminsupportticket",
        type: "AdminSupportModule",
        isRead: false,
        createdAt: new Date().toISOString(),
    },
    {
        _id: "11",
        title: "Ticket Updated",
        message: "Support ticket status updated by admin.",
        moduleKey: "adminsupportticket",
        type: "AdminSupportModule",
        isRead: true,
        createdAt: new Date(Date.now() - 3600000).toISOString(),
    },
    {
        _id: "12",
        title: "Ticket Closed",
        message: "Support ticket has been closed.",
        moduleKey: "adminsupportticket",
        type: "AdminSupportModule",
        isRead: false,
        createdAt: new Date(Date.now() - 86400000).toISOString(),
    },
];


const moduleKeyRouteMap: Record<string, string> = {
    adminsupportticket: '/admin/supportticket-management',
};

const filterOptions = [
    { key: 'all', label: 'All', permission: null },
    { key: 'AdminSupportModule', label: 'Admin Support Tickets', permission: null },
];

const typeBgMap: Record<string, string> = {
    adminsupportticket: 'bg-red-50',
};

const iconMap: Record<string, React.ReactNode> = {
    adminsupportticket: <HelpCircleIcon size={18} className="mr-2 text-red-600" />,
};



const NotificationsSkeleton = () => {
    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <h2 className="font-outfit text-2xl font-bold text-gray-800 mb-4">
                <Skeleton width={200} height={28} />
            </h2>

            <div className="bg-white rounded-xl p-4 flex flex-wrap gap-4 mb-6 border border-gray-200">
                {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} height={32} width={140} style={{ borderRadius: 16 }} />
                ))}
            </div>

            <div className="max-w-[900px] mx-auto">
                {Array.from({ length: 5 }).map((_, i) => (
                    <div
                        key={i}
                        className="bg-white rounded-lg p-4 mb-3 border border-gray-200"
                    >
                        <Skeleton height={18} width="60%" />
                        <Skeleton height={14} width="80%" className="mt-1" />
                    </div>
                ))}
            </div>
        </div>
    );
};



const Notification: React.FC = () => {
    const navigate = useNavigate();

    const [selectedFilter, setSelectedFilter] = useState('all');
    const [showSkeleton, setShowSkeleton] = useState(true);

    /* Dummy pagination */
    const Notifications = dummyNotifications;
    const loading = false;
    const pageSize = 10;
    const currentPage = 1;
    const totalItems = Notifications.length;
    const totalPages = Math.ceil(totalItems / pageSize);


    useEffect(() => {
        const t = setTimeout(() => setShowSkeleton(false), 600);
        return () => clearTimeout(t);
    }, []);

    const handleNavigate = (item: any) => {
        const route = moduleKeyRouteMap[item.moduleKey];
        if (route) navigate(route);
    };

    const handleMarkRead = (e: React.MouseEvent) => {
        e.stopPropagation();
    };

    if (showSkeleton) return <NotificationsSkeleton />;

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        mb={2}
                    >
                        <Typography variant="h5" fontWeight={500} className="font-outfit">
                            Notification Module
                            <Tooltip
                                title="All user notification related to there complaint and other tasks."
                                arrow
                            >
                                <InfoIcon sx={{ color: "#245492", ml: 1 }} />
                            </Tooltip>
                        </Typography>

                      
                    </Box>

            {/* FILTER CHIPS */}
            <Box className="bg-white rounded-xl p-4 flex flex-wrap gap-4 mb-6 border border-gray-200 sticky top-0 z-10">
                {filterOptions.map((opt) => (
                    <Chip
                        key={opt.key}
                        label={opt.label}
                        clickable
                        onClick={() => setSelectedFilter(opt.key)}
                        variant={selectedFilter === opt.key ? 'filled' : 'outlined'}
                        sx={{
                            fontFamily: 'Outfit, sans-serif',
                            backgroundColor: selectedFilter === opt.key ? '#255593' : 'transparent',
                            color: selectedFilter === opt.key ? '#fff' : '#255593',
                            borderColor: '#255593',
                        }}
                    />
                ))}
            </Box>

            {/* LIST */}
            <div className="max-w-[900px] mx-auto">
                {Notifications.map((item) => {
                    const icon = iconMap[item.moduleKey] || <CheckCircleIcon size={18} />;
                    const bg = typeBgMap[item.moduleKey] || '';
                    const readClass = !item.isRead
                        ? 'bg-blue-100 font-semibold'
                        : 'text-gray-500 opacity-70';

                    return (
                        <div
                            key={item._id}
                            onClick={() => handleNavigate(item)}
                            className={`rounded-lg p-4 mb-3 border border-gray-200 cursor-pointer ${bg} ${readClass}`}
                        >
                            <div className="flex justify-between">
                                <div>
                                    <div className="flex items-center">
                                        {icon}
                                        {item.title}
                                    </div>
                                    <div className="text-sm text-gray-600 mt-1">
                                        {item.message}
                                    </div>
                                </div>

                                {!item.isRead && (
                                    <Tooltip title="Mark as read">
                                        <button onClick={handleMarkRead}>
                                            <CheckIcon />
                                        </button>
                                    </Tooltip>
                                )}
                            </div>

                            <div className="text-xs text-gray-500 mt-1">
                                {new Date(item.createdAt).toLocaleString('en-IN')}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* PAGINATION */}
            {totalPages > 1 && (
                <Box
                    className="max-w-[900px] mx-auto mt-6 bg-white p-3 border rounded-xl"
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 2,
                        flexWrap: 'wrap', // mobile safe
                    }}
                >
                    <Typography variant="body2" sx={{ whiteSpace: 'nowrap' }}>
                        Showing{" "}
                        <strong>{(currentPage - 1) * pageSize + 1}</strong> –{" "}
                        <strong>{Math.min(currentPage * pageSize, totalItems)}</strong> of{" "}
                        <strong>{totalItems}</strong>
                    </Typography>

                    <Pagination
                        page={currentPage}
                        count={totalPages}
                        shape="rounded"
                        size="small"
                        sx={{
                            '& .MuiPagination-ul': {
                                flexWrap: 'nowrap',
                            },
                            '& .Mui-selected': {
                                backgroundColor: '#255593 !important',
                                color: '#fff',
                            },
                        }}
                    />
                </Box>
            )}

        </div>
    );
};

export default Notification;


