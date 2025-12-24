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
// import { fetchnotification, markNotificationAsRead, } from '../../../store/SuperAdminDashboard/SperAdminDashboardSlice';
// import { useNavigate } from 'react-router-dom';
// import {
//     UserPlusIcon,
//     UserCheckIcon,
//     CarIcon,
//     CreditCardIcon,
//     HelpCircleIcon,
//     CheckCircleIcon,
// } from 'lucide-react';


// const moduleKeyRouteMap: Record<string, string> = {

//     supportticket: '/superadmin/supportticketmanagement',

// };

// const filterOptions = [
//     { key: 'all', label: 'All' },
//     { key: 'AdminSupportModule', label: 'Admin Support Tickets' },
// ];


// const typeBgMap: Record<string, string> = {
//     supportticket: 'bg-red-50',
// };

// const iconMap: Record<string, React.ReactNode> = {

//     supportticket: <HelpCircleIcon size={18} className="mr-2 text-red-600" />,

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



// const SocietyNotification: React.FC = () => {
//     const dispatch = useDispatch<AppDispatch>();
//     const navigate = useNavigate();

//     const {
//         Notifications,
//         loading,
//         pagination: { totalPages },
//         loadedPages = [],
//     } = useSelector((state: RootState) => state.superadmindashboard);

//     // local UI state
//     const [selectedFilter, setSelectedFilter] = useState('all');
//     const [showSkeleton, setShowSkeleton] = useState(true);
//     const [isFetchingNext, setIsFetchingNext] = useState(false);
//     const [pageState, setPageState] = useState<Record<string, number>>({ all: 1 });


//     // refs to avoid stale closures
//     const observerTarget = useRef<HTMLDivElement | null>(null);
//     const currentPageRef = useRef<number>(1);
//     const totalPagesRef = useRef<number | undefined>(totalPages);
//     // const loadedPagesRef = useRef<number[]>(loadedPages);
//     const isFetchingRef = useRef(false);
//     const loadedPagesRef = useRef<string[]>([]); // <-- store "filter-page" strings


//     useEffect(() => {
//         // Reset page for new filter
//         setPageState((prev) => ({ ...prev, [selectedFilter]: 1 }));
//         // Optionally remove already loaded pages for this filter
//         loadedPagesRef.current = loadedPagesRef.current.filter(p => !p.startsWith(selectedFilter));
//         // Fetch first page for new filter
//         dispatch(fetchnotification({ page: 1, type: selectedFilter }));
//     }, [selectedFilter, dispatch]);



//     // hide skeleton shortly after mount
//     useEffect(() => {
//         const t = setTimeout(() => setShowSkeleton(false), 600);
//         return () => clearTimeout(t);
//     }, []);

//     // initial load of page 1
//     useEffect(() => {
//         dispatch(fetchnotification({ page: 1, type: selectedFilter }));
//     }, [selectedFilter]);



//     // // loadMore uses refs — stable, no stale capture
//     // const loadMore = useCallback(() => {
//     //     if (isFetchingRef.current || isFetchingNext) return;

//     //     const nextPage = currentPageRef.current + 1;
//     //     const tp = totalPagesRef.current ?? 0;

//     //     if (!tp || nextPage > tp) return;
//     //     if (loadedPagesRef.current.includes(nextPage)) {
//     //         currentPageRef.current = nextPage;
//     //         setPageState(nextPage);
//     //         return;
//     //     }

//     //     isFetchingRef.current = true;

//     //     // Show spinner immediately
//     //     setIsFetchingNext(true);

//     //     // Small delay so spinner has time to render before fetch starts
//     //     setTimeout(() => {
//     //         dispatch(fetchnotification({ page: nextPage, type: selectedFilter }))
//     //             .then(() => {
//     //                 currentPageRef.current = Math.max(currentPageRef.current, nextPage);
//     //                 setPageState(currentPageRef.current);
//     //             })
//     //             .catch((err) => console.warn('[notifications] fetch error', err))
//     //             .finally(() => {
//     //                 // Ensure spinner is visible at least 2000ms
//     //                 setTimeout(() => {
//     //                     isFetchingRef.current = false;
//     //                     setIsFetchingNext(false);
//     //                 }, 2000);
//     //             });
//     //     }, 0);
//     // }, [dispatch, isFetchingNext]);


//     const loadMore = useCallback(() => {
//         if (isFetchingRef.current || isFetchingNext) return;

//         const currentPage = pageState[selectedFilter] || 1;
//         const nextPage = currentPage + 1;
//         const tp = totalPagesRef.current ?? 0;

//         if (!tp || nextPage > tp) return;
//         if (loadedPagesRef.current.includes(`${selectedFilter}-${nextPage}`)) return;

//         isFetchingRef.current = true;
//         setIsFetchingNext(true);

//         dispatch(fetchnotification({ page: nextPage, type: selectedFilter }))
//             .then(() => {
//                 setPageState((prev) => ({
//                     ...prev,
//                     [selectedFilter]: nextPage,
//                 }));
//                 loadedPagesRef.current.push(`${selectedFilter}-${nextPage}`);
//             })
//             .catch((err) => console.warn('[notifications] fetch error', err))
//             .finally(() => {
//                 isFetchingRef.current = false;
//                 setIsFetchingNext(false);
//             });
//     }, [dispatch, isFetchingNext, selectedFilter, pageState]);

//     // attach IntersectionObserver to the sentinel; re-run when list length changes so it attaches reliably
//     useEffect(() => {
//         const el = observerTarget.current;
//         if (!el) return;
//         let timeout: NodeJS.Timeout;

//         const obs = new IntersectionObserver(
//             (entries) => {
//                 if (entries[0].isIntersecting) {
//                     // Delay API call by 1 second
//                     timeout = setTimeout(() => {
//                         loadMore();
//                     }, 1000);
//                 }
//             },
//             { root: null, rootMargin: '300px', threshold: 0.1 }
//         );

//         obs.observe(el);
//         return () => obs.disconnect();
//     }, [loadMore, Notifications.length, showSkeleton]);


//     // const handleNavigate = (item: any) => {
//     //     let route = '';
//     //     if (item.moduleKey === 'supportticket') {
//     //         route =
//     //             item.type === 'AdminSupportModule'
//     //                 ? '/superadmin/supportticketmanagement?type=admin'
//     //                 : '/superadmin/supportticketmanagement?type=admin';
//     //     } else {
//     //         route = moduleKeyRouteMap[item.moduleKey];
//     //     }

//     //     if (route) {
//     //         dispatch(markNotificationAsRead(item._id)).then(() => {
//     //             navigate(route);
//     //         });
//     //     }
//     // };

//     const handleNavigate = (item: any) => {
//         let route = '';

//         if (item.moduleKey === 'supportticket') {
//             route = '/superadmin/supportticketmanagement?type=admin';
//         } else {
//             route = moduleKeyRouteMap[item.moduleKey];
//         }

//         if (route) {
//             dispatch(markNotificationAsRead(item._id)).then(() => {
//                 navigate(route);
//             });
//         }
//     };


//     const handleMarkRead = (e: React.MouseEvent, id: string) => {
//         e.stopPropagation();
//         dispatch(markNotificationAsRead(id));
//     };

//     const filteredNotifications =
//         selectedFilter === 'all'
//             ? Notifications
//             : Notifications.filter((n) => n.type === selectedFilter || n.moduleKey === selectedFilter);

//     if (showSkeleton) return <NotificationsSkeleton />;

//     return (
//         <div className="p-6 bg-gray-50 min-h-screen">
//             <h2 className="font-outfit text-2xl font-bold text-gray-800 mb-4">Notifications</h2>

//             {/* Filter Chips -  full width */}
//             <Box className="bg-white rounded-xl p-4 flex flex-wrap gap-4 mb-6 border border-gray-200 sticky top-0 z-10">
//                 {filterOptions.map((opt) => (
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
//                                 ref={isLastItem ? observerTarget : null}
//                                 onClick={() => handleNavigate(item)}
//                                 className={`rounded-lg shadow-sm p-4 mb-3 flex flex-col hover:shadow-md transition cursor-pointer border border-gray-200 ${typeBg} ${readClass}`}
//                             >
//                                 {isLastItem && isFetchingNext ? (
//                                     // Spinner instead of content
//                                     <div className="flex justify-center py-4">
//                                         <CircularProgress size={36} />
//                                     </div>
//                                 ) : (
//                                     <>
//                                         <div className="flex items-center justify-between">
//                                             <div className="flex flex-col text-md text-gray-800">
//                                                 <div
//                                                     className={`flex items-center text-md ${!item.isRead ? 'font-semibold' : 'text-gray-500'}`}
//                                                 >
//                                                     {icon}
//                                                     {item.title}
//                                                 </div>
//                                                 <div className="text-sm text-gray-600 mt-1">{item.message}</div>
//                                             </div>
//                                             {!item.isRead && (
//                                                 <Tooltip title="Mark as read">
//                                                     <button
//                                                         onClick={(e) => handleMarkRead(e, item._id)}
//                                                         className="text-xs ml-2 text-blue-500 hover:underline"
//                                                     >
//                                                         <CheckIcon />
//                                                     </button>
//                                                 </Tooltip>
//                                             )}
//                                         </div>
//                                         <div className="text-xs text-gray-500 mt-1">
//                                             {new Date(item.createdAt).toLocaleString('en-IN', {
//                                                 timeZone: 'Asia/Kolkata',
//                                             })}
//                                         </div>
//                                     </>
//                                 )}
//                             </div>
//                         );
//                     })
//                 )}
//             </div>

//         </div>
//     );
// };
// export default SocietyNotification;





import React, { useEffect, useRef, useState, useCallback } from 'react';
import InfoIcon from '@mui/icons-material/Info';
import {
    Chip,
    Tooltip,
    Box,
    CircularProgress,
    Typography,
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import { useNavigate } from 'react-router-dom';
import {
    HelpCircleIcon,
    CheckCircleIcon,
    GlobeIcon,
} from 'lucide-react';

/* ------------------ ROUTE MAP ------------------ */
const moduleKeyRouteMap: Record<string, string> = {
    supportticket: '/superadmin/society-supportticket-management?type=admin',
    websiteenquiry: '/superadmin/society-supportticket-management?type=webuser',
};

/* ------------------ FILTER OPTIONS ------------------ */
const filterOptions = [
    { key: 'all', label: 'All' },
    { key: 'AdminSupportModule', label: 'Admin Support Tickets' },
    { key: 'WebsiteEnquiryModule', label: 'Website Enquiry' },
];

/* ------------------ UI MAPS ------------------ */
const typeBgMap: Record<string, string> = {
    supportticket: 'bg-red-50',
    websiteenquiry: 'bg-green-50'

};

const iconMap: Record<string, React.ReactNode> = {
    supportticket: <HelpCircleIcon size={18} className="mr-2 text-red-600" />,
    websiteenquiry: <GlobeIcon size={18} className="mr-2 text-green-600" />,
};

/* ------------------ DUMMY DATA ------------------ */
const dummyNotifications = [
    {
        _id: '1',
        moduleKey: 'supportticket',
        type: 'AdminSupportModule',
        title: 'New Support Ticket',
        message: 'A new support ticket has been raised.',
        isRead: false,
        createdAt: new Date().toISOString(),
    },
    {
        _id: '2',
        moduleKey: 'supportticket',
        type: 'AdminSupportModule',
        title: 'Ticket Updated',
        message: 'Support ticket #124 has been updated.',
        isRead: true,
        createdAt: new Date(Date.now() - 3600000).toISOString(),
    },
    {
        _id: '3',
        moduleKey: 'supportticket',
        type: 'AdminSupportModule',
        title: 'Ticket Closed',
        message: 'Support ticket #120 has been closed.',
        isRead: false,
        createdAt: new Date(Date.now() - 7200000).toISOString(),
    },
    {
        _id: '4',
        moduleKey: 'websiteenquiry',
        type: 'WebsiteEnquiryModule',
        title: 'New Enquiry',
        message: 'New website enquiry has been raised.',
        isRead: false,
        createdAt: new Date(Date.now() - 7200000).toISOString(),
    },
];

const SocietyNotification: React.FC = () => {
    const navigate = useNavigate();

    /* ------------------ LOCAL STATE ------------------ */
    const [notifications, setNotifications] = useState(dummyNotifications);
    const [selectedFilter, setSelectedFilter] = useState('all');
    const [isFetchingNext, setIsFetchingNext] = useState(false);

    const observerTarget = useRef<HTMLDivElement | null>(null);

    /* ------------------ LOAD MORE (DUMMY) ------------------ */
    const loadMore = useCallback(() => {
        if (isFetchingNext) return;
        setIsFetchingNext(true);

        setTimeout(() => {
            setIsFetchingNext(false);
        }, 1000);
    }, [isFetchingNext]);

    /* ------------------ INTERSECTION OBSERVER ------------------ */
    useEffect(() => {
        const el = observerTarget.current;
        if (!el) return;

        const obs = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) loadMore();
            },
            { rootMargin: '200px' }
        );

        obs.observe(el);
        return () => obs.disconnect();
    }, [loadMore]);

    /* ------------------ HANDLERS ------------------ */
    const handleNavigate = (item: any) => {
        const route = moduleKeyRouteMap[item.moduleKey];
        if (route) navigate(route);
    };

    const handleMarkRead = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        setNotifications((prev) =>
            prev.map((n) =>
                n._id === id ? { ...n, isRead: true } : n
            )
        );
    };

    /* ------------------ FILTER ------------------ */
    const filteredNotifications =
        selectedFilter === 'all'
            ? notifications
            : notifications.filter(
                (n) =>
                    n.type === selectedFilter || n.moduleKey === selectedFilter
            );

    /* ------------------ UI ------------------ */
    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <Typography
                variant="h5"
                fontWeight={500}
                className='font-outfit'
            >
                Notification  <Tooltip
                    title="Notification related to all modules."
                    arrow
                    slotProps={{
                        popper: {
                            sx: {
                                '& .MuiTooltip-tooltip': {
                                    fontSize: '0.9rem',
                                    backgroundColor: '#245492',
                                    color: '#fff',
                                    fontFamily: 'Outfit',
                                    padding: '8px 12px',
                                },
                                '& .MuiTooltip-arrow': {
                                    color: '#245492',
                                },
                            },
                        },
                    }}
                >
                    <InfoIcon
                        fontSize="medium"
                        sx={{ color: '#245492', cursor: 'pointer' }}
                        onClick={(e) => e.stopPropagation()}
                    />
                </Tooltip>
            </Typography>

            {/* FILTERS */}
            <Box className="bg-white p-4 rounded-xl flex gap-3 mb-6 sticky top-0 z-10">
                {filterOptions.map((opt) => (
                    <Chip
                        key={opt.key}
                        label={opt.label}
                        clickable
                        onClick={() => setSelectedFilter(opt.key)}
                        variant={selectedFilter === opt.key ? 'filled' : 'outlined'}
                        sx={{
                            backgroundColor:
                                selectedFilter === opt.key ? '#255593' : 'transparent',
                            color:
                                selectedFilter === opt.key ? '#fff' : '#255593',
                            borderColor: '#255593',
                        }}
                    />
                ))}
            </Box>

            {/* LIST */}
            <div className="max-w-[900px] mx-auto">
                {filteredNotifications.length === 0 ? (
                    <div className="text-center text-gray-400">
                        No notifications
                    </div>
                ) : (
                    filteredNotifications.map((item, index) => {
                        const icon =
                            iconMap[item.moduleKey] || (
                                <CheckCircleIcon size={18} />
                            );
                        const bg = typeBgMap[item.moduleKey] || '';
                        const unread = !item.isRead;

                        const isLast =
                            index === filteredNotifications.length - 1;

                        return (
                            <div
                                key={item._id}
                                ref={isLast ? observerTarget : null}
                                onClick={() => handleNavigate(item)}
                                className={`p-4 mb-3 rounded-lg border cursor-pointer transition hover:shadow-md
                  ${bg} ${unread ? 'bg-blue-100 font-semibold' : 'opacity-70'}`}
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
                                            <button
                                                onClick={(e) =>
                                                    handleMarkRead(e, item._id)
                                                }
                                            >
                                                <CheckIcon />
                                            </button>
                                        </Tooltip>
                                    )}
                                </div>

                                <div className="text-xs text-gray-500 mt-1">
                                    {new Date(item.createdAt).toLocaleString('en-IN')}
                                </div>

                                {isLast && isFetchingNext && (
                                    <div className="flex justify-center mt-4">
                                        <CircularProgress size={28} />
                                    </div>
                                )}
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default SocietyNotification;


