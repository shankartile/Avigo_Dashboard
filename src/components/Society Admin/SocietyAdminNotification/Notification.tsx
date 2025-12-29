import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
    Chip,
    CircularProgress,
    Tooltip,
    Box,
} from '@mui/material';
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import CheckIcon from '@mui/icons-material/Check';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../store/store';
import { fetchnotification, markNotificationAsRead, } from '../../../store/SuperAdminDashboard/SperAdminDashboardSlice';
import { useNavigate } from 'react-router-dom';
import {
    UserPlusIcon,
    UserCheckIcon,
    CarIcon,
    CreditCardIcon,
    HelpCircleIcon,
    CheckCircleIcon,
} from 'lucide-react';

const moduleKeyRouteMap: Record<string, string> = {
    subscription: '/superadmin/subscriptionmanagement',
    productlistings: '/superadmin/productlistings',
    supportticket: '/superadmin/supportticketmanagement',
    usermanagement: '/superadmin/usermanagement',
};

const filterOptions = [
    { key: 'all', label: 'All' },
    { key: 'Dealer Management', label: 'Dealer Registered' },
    { key: 'Buyer Management', label: 'Buyer Registered' },
    { key: 'Subscription Management', label: 'Subscription Purchased' },
    { key: 'CarListingManagement', label: 'Car Listings' },
    { key: 'BikeListingManagement', label: 'Bike Listings' },
    { key: 'SpareListingManagement', label: 'Spare Part Listings' },  // <-- FIXED
    { key: 'DealerSupportModule', label: 'Dealer Support Tickets' },
    { key: 'BuyerSupportModule', label: 'Buyer Support Tickets' },
];


const typeBgMap: Record<string, string> = {
    subscription: 'bg-purple-50',
    productlistings: 'bg-yellow-50',
    usermanagement: 'bg-green-50',
    supportticket: 'bg-red-50',
    dealermanagement: 'bg-blue-50',
};

const iconMap: Record<string, React.ReactNode> = {
    subscription: <CreditCardIcon size={18} className="mr-2 text-purple-600" />,
    productlistings: <CarIcon size={18} className="mr-2 text-yellow-600" />,
    usermanagement: <UserCheckIcon size={18} className="mr-2 text-green-600" />,
    supportticket: <HelpCircleIcon size={18} className="mr-2 text-red-600" />,
    dealermanagement: <UserPlusIcon size={18} className="mr-2 text-blue-600" />,
};

const NotificationsSkeleton = () => {
    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <h2 className="font-outfit text-2xl font-bold text-gray-800 mb-4">
                <Skeleton width={200} height={28} />
            </h2>

            {/* Filter Chips */}
            <div className="bg-white rounded-xl p-4 flex flex-wrap gap-4 mb-6 border border-gray-200">
                {Array.from({ length: 6 }).map((_, i) => (
                    <Skeleton
                        key={i}
                        height={32}
                        width={140}
                        style={{ borderRadius: 16 }}
                    />
                ))}
            </div>

            {/* Notifications List */}
            <div className="max-w-[900px] mx-auto">
                {Array.from({ length: 6 }).map((_, i) => (
                    <div
                        key={i}
                        className="bg-white rounded-lg shadow-sm p-4 mb-3 flex flex-col border border-gray-200"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex flex-col flex-1">
                                <Skeleton height={20} width="60%" className="mb-1" />
                                <Skeleton height={16} width="80%" />
                            </div>
                            <Skeleton circle height={28} width={28} />
                        </div>
                        <Skeleton height={14} width="30%" className="mt-1" />
                    </div>
                ))}
            </div>
        </div>
    );
};



const NotificationsPage: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const {
        Notifications,
        loading,
        pagination: { totalPages },
        loadedPages = [],
    } = useSelector((state: RootState) => state.superAdminDashboard);

    // local UI state
    const [selectedFilter, setSelectedFilter] = useState('all');
    const [showSkeleton, setShowSkeleton] = useState(true);
    const [isFetchingNext, setIsFetchingNext] = useState(false);
    const [pageState, setPageState] = useState<Record<string, number>>({ all: 1 });


    // refs to avoid stale closures
    const observerTarget = useRef<HTMLDivElement | null>(null);
    const currentPageRef = useRef<number>(1);
    const totalPagesRef = useRef<number | undefined>(totalPages);
    // const loadedPagesRef = useRef<number[]>(loadedPages);
    const isFetchingRef = useRef(false);
    const loadedPagesRef = useRef<string[]>([]); // <-- store "filter-page" strings


    useEffect(() => {
        // Reset page for new filter
        setPageState((prev) => ({ ...prev, [selectedFilter]: 1 }));
        // Optionally remove already loaded pages for this filter
        loadedPagesRef.current = loadedPagesRef.current.filter(p => !p.startsWith(selectedFilter));
        // Fetch first page for new filter
        dispatch(fetchnotification({ page: 1, type: selectedFilter }));
    }, [selectedFilter, dispatch]);



    // hide skeleton shortly after mount
    useEffect(() => {
        const t = setTimeout(() => setShowSkeleton(false), 600);
        return () => clearTimeout(t);
    }, []);

    // initial load of page 1
    useEffect(() => {
        dispatch(fetchnotification({ page: 1, type: selectedFilter }));
    }, [selectedFilter]);



    // // loadMore uses refs — stable, no stale capture
    // const loadMore = useCallback(() => {
    //     if (isFetchingRef.current || isFetchingNext) return;

    //     const nextPage = currentPageRef.current + 1;
    //     const tp = totalPagesRef.current ?? 0;

    //     if (!tp || nextPage > tp) return;
    //     if (loadedPagesRef.current.includes(nextPage)) {
    //         currentPageRef.current = nextPage;
    //         setPageState(nextPage);
    //         return;
    //     }

    //     isFetchingRef.current = true;

    //     // Show spinner immediately
    //     setIsFetchingNext(true);

    //     // Small delay so spinner has time to render before fetch starts
    //     setTimeout(() => {
    //         dispatch(fetchnotification({ page: nextPage, type: selectedFilter }))
    //             .then(() => {
    //                 currentPageRef.current = Math.max(currentPageRef.current, nextPage);
    //                 setPageState(currentPageRef.current);
    //             })
    //             .catch((err) => console.warn('[notifications] fetch error', err))
    //             .finally(() => {
    //                 // Ensure spinner is visible at least 2000ms
    //                 setTimeout(() => {
    //                     isFetchingRef.current = false;
    //                     setIsFetchingNext(false);
    //                 }, 2000);
    //             });
    //     }, 0);
    // }, [dispatch, isFetchingNext]);


    const loadMore = useCallback(() => {
        if (isFetchingRef.current || isFetchingNext) return;

        const currentPage = pageState[selectedFilter] || 1;
        const nextPage = currentPage + 1;
        const tp = totalPagesRef.current ?? 0;

        if (!tp || nextPage > tp) return;
        if (loadedPagesRef.current.includes(`${selectedFilter}-${nextPage}`)) return;

        isFetchingRef.current = true;
        setIsFetchingNext(true);

        dispatch(fetchnotification({ page: nextPage, type: selectedFilter }))
            .then(() => {
                setPageState((prev) => ({
                    ...prev,
                    [selectedFilter]: nextPage,
                }));
                loadedPagesRef.current.push(`${selectedFilter}-${nextPage}`);
            })
            .catch((err) => console.warn('[notifications] fetch error', err))
            .finally(() => {
                isFetchingRef.current = false;
                setIsFetchingNext(false);
            });
    }, [dispatch, isFetchingNext, selectedFilter, pageState]);

    // attach IntersectionObserver to the sentinel; re-run when list length changes so it attaches reliably
    useEffect(() => {
        const el = observerTarget.current;
        if (!el) return;
        let timeout: NodeJS.Timeout;

        const obs = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    // Delay API call by 1 second
                    timeout = setTimeout(() => {
                        loadMore();
                    }, 1000);
                }
            },
            { root: null, rootMargin: '300px', threshold: 0.1 }
        );

        obs.observe(el);
        return () => obs.disconnect();
    }, [loadMore, Notifications.length, showSkeleton]);


    const handleNavigate = (item: any) => {
        let route = '';
        if (item.moduleKey === 'supportticket') {
            route =
                item.type === 'BuyerSupportModule'
                    ? '/superadmin/supportticketmanagement?type=buyer'
                    : '/superadmin/supportticketmanagement?type=dealer';
        } else if (item.moduleKey === 'productlistings') {
            route =
                item.type === 'CarListingManagement'
                    ? '/superadmin/productlistings?type=car'
                    : item.type === 'BikeListingManagement'
                        ? '/superadmin/productlistings?type=bike'
                        : '/superadmin/productlistings?type=sparepart';
        } else if (item.moduleKey === 'usermanagement') {
            route =
                item.type === 'Buyer Management'
                    ? '/superadmin/buyermanagment'
                    : '/superadmin/dealermanagment';
        } else {
            route = moduleKeyRouteMap[item.moduleKey];
        }

        if (route) {
            dispatch(markNotificationAsRead(item._id)).then(() => {
                navigate(route);
            });
        }
    };

    const handleMarkRead = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        dispatch(markNotificationAsRead(id));
    };

    const filteredNotifications =
        selectedFilter === 'all'
            ? Notifications
            : Notifications.filter((n) => n.type === selectedFilter || n.moduleKey === selectedFilter);

    if (showSkeleton) return <NotificationsSkeleton />;

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <h2 className="font-outfit text-2xl font-bold text-gray-800 mb-4">Notifications</h2>

            {/* Filter Chips -  full width */}
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
                            fontSize: '0.95rem',
                            backgroundColor: selectedFilter === opt.key ? '#255593' : 'transparent',
                            color: selectedFilter === opt.key ? '#fff' : '#255593',
                            borderColor: '#255593',
                            '&:hover': {
                                backgroundColor:
                                    selectedFilter === opt.key ? '#1e467c' : 'rgba(37, 85, 147, 0.08)',
                            },
                            '&.Mui-disabled': {
                                backgroundColor: '#8ca5c2',
                                color: '#fff',
                            },
                        }}
                    />
                ))}
            </Box>

            {/* Notifications List - centered */}
            <div className="max-w-[900px] mx-auto">
                {filteredNotifications.length === 0 && !loading ? (
                    <div className="text-center text-gray-400 mt-10">No notifications</div>
                ) : (
                    filteredNotifications.map((item, index) => {
                        const icon = iconMap[item.moduleKey] || <CheckCircleIcon size={18} />;
                        const typeBg = typeBgMap[item.moduleKey] || '';
                        const readClass = !item.isRead
                            ? 'bg-blue-100 font-semibold'
                            : 'text-gray-500 opacity-70';

                        const isLastItem = index === filteredNotifications.length - 1;

                        return (
                            <div
                                key={item._id}
                                ref={isLastItem ? observerTarget : null}
                                onClick={() => handleNavigate(item)}
                                className={`rounded-lg shadow-sm p-4 mb-3 flex flex-col hover:shadow-md transition cursor-pointer border border-gray-200 ${typeBg} ${readClass}`}
                            >
                                {isLastItem && isFetchingNext ? (
                                    // Spinner instead of content
                                    <div className="flex justify-center py-4">
                                        <CircularProgress size={36} />
                                    </div>
                                ) : (
                                    <>
                                        <div className="flex items-center justify-between">
                                            <div className="flex flex-col text-md text-gray-800">
                                                <div
                                                    className={`flex items-center text-md ${!item.isRead ? 'font-semibold' : 'text-gray-500'}`}
                                                >
                                                    {icon}
                                                    {item.title}
                                                </div>
                                                <div className="text-sm text-gray-600 mt-1">{item.message}</div>
                                            </div>
                                            {!item.isRead && (
                                                <Tooltip title="Mark as read">
                                                    <button
                                                        onClick={(e) => handleMarkRead(e, item._id)}
                                                        className="text-xs ml-2 text-blue-500 hover:underline"
                                                    >
                                                        <CheckIcon />
                                                    </button>
                                                </Tooltip>
                                            )}
                                        </div>
                                        <div className="text-xs text-gray-500 mt-1">
                                            {new Date(item.createdAt).toLocaleString('en-IN', {
                                                timeZone: 'Asia/Kolkata',
                                            })}
                                        </div>
                                    </>
                                )}
                            </div>
                        );
                    })
                )}
            </div>

        </div>
    );
};
export default NotificationsPage;

