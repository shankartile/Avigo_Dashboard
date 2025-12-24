import React, { useEffect, useState } from 'react';
import { Tooltip, IconButton, Dialog, Button } from '@mui/material';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import {
  fetchnotification,
  markNotificationAsRead,
} from '../../store/SuperAdminDashboard/SperAdminDashboardSlice';
import { useNavigate } from 'react-router-dom';
import {
  UserPlusIcon,
  UserCheckIcon,
  CarIcon,
  CreditCardIcon,
  HelpCircleIcon,
  CheckCircleIcon,
} from 'lucide-react';
import { DropdownItem } from '../ui/dropdown/DropdownItem';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';


const moduleKeyRouteMap: Record<string, string> = {
  subscription: '/superadmin/subscriptionmanagement',
  productlistings: '/superadmin/productlistings',
  // usermanagement: '/superadmin/buyermanagment',
  supportticket: '/superadmin/supportticketmanagement',
  // dealermanagement: '/superadmin/dealermanagment',
};




const NotificationDropdown = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const {
    Notifications,
    unreadCount,
    pagination: { currentPage, totalPages },
  } = useSelector((state: RootState) => state.superAdminDashboard);

  const [fullscreenOpen, setFullscreenOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [filterType, setFilterType] = useState<string | undefined>(undefined);


  // Initial + polling fetch
  useEffect(() => {
    dispatch(fetchnotification({ page: 1, type: filterType }));
    const interval = setInterval(() => {
      dispatch(fetchnotification({ page: 1, type: filterType }));
    }, 60000);
    return () => clearInterval(interval);
  }, [dispatch, filterType]);

  const unreadNotifications = Notifications.filter((item) => !item.isRead);


  const handleLoadMore = () => {
    const nextPage = page + 1;
    dispatch(fetchnotification({ page: nextPage, type: filterType }));
    setPage(nextPage);
  };

  const handlePreviousPage = () => {
    const prevPage = page - 1;
    if (prevPage >= 1) {
      dispatch(fetchnotification({ page: prevPage, type: filterType }));
      setPage(prevPage);
    }
  };

  // const handleNavigate = (item: any) => {
  //   const route = sRouteMap[item.moduleKey];
  //   if (route) {
  //     dispatch(markNotificationAsRead(item._id)).then(() => {
  //       dispatch(fetchnotification({ page: 1 })); // refresh list after marking
  //       navigate(route);
  //     });
  //     setFullscreenOpen(false);
  //   }
  // };


  const notificationRouteMap: Record<
    string,
    Record<string, string>
  > = {
    usermanagement: {
      'Buyer Management': '/superadmin/buyermanagment',
      'Dealer Management': '/superadmin/dealermanagment',
    },
    supportticket: {
      BuyerSupportModule: '/superadmin/supportticketmanagement?type=buyer',
      DealerSupportModule: '/superadmin/supportticketmanagement?type=dealer',
    },
    productlistings: {
      CarListingManagement: '/superadmin/productlistings',
      BikeListingManagement: '/superadmin/productlistings?type=bike',
      SpareListingManagement: '/superadmin/productlistings?type=sparepart',
    },
    subscription: {
      default: '/superadmin/subscriptionmanagement',
    },
  };



  const handleNavigate = (item: any) => {
    let route = '';

    if (item.moduleKey === 'supportticket') {
      if (item.type === 'BuyerSupportModule') {
        route = '/superadmin/supportticketmanagement?type=buyer';
      } else if (item.type === 'DealerSupportModule') {
        route = '/superadmin/supportticketmanagement?type=dealer';
      }
    } else if (item.moduleKey === 'productlistings') {
      if (item.type === 'CarListingManagement') {
        route = '/superadmin/productlistings?type=car';
      } else if (item.type === 'BikeListingManagement') {
        route = '/superadmin/productlistings?type=bike';
      } else if (item.type === 'SpareListingManagement') {
        route = '/superadmin/productlistings?type=sparepart';
      }
    } else if (item.moduleKey === 'usermanagement') {
      if (item.type === 'Buyer Management') {
        route = '/superadmin/buyermanagment';
      } else if (item.type === 'Dealer Management') {
        route = '/superadmin/dealermanagment';
      }
    } else {
      // fallback to general route from map
      route = moduleKeyRouteMap[item.moduleKey];
    }

    if (route) {
      dispatch(markNotificationAsRead(item._id)).then(() => {
        dispatch(fetchnotification({ page: 1, type: filterType }));
        navigate(route);
      });
      setFullscreenOpen(false);
    }
  };



  const handleMarkRead = (e: any, id: string) => {
    e.stopPropagation();
    dispatch(markNotificationAsRead(id));
  };

  const markAllAsRead = () => {
    Notifications.filter((n) => !n.isRead).forEach((n) =>
      dispatch(markNotificationAsRead(n._id))
    );
  };

  const typeBgMap: Record<string, string> = {
    subscription: 'bg-purple-50',
    productlistings: 'bg-yellow-50',
    usermanagement: 'bg-green-50',
    supportticket: 'bg-red-50',
    dealermanagement: 'bg-blue-50',
  };

  const iconMap: Record<string, React.ReactNode> = {
    subscription: <CreditCardIcon size={16} className="mr-2 text-purple-600" />,
    productlistings: <CarIcon size={16} className="mr-2 text-yellow-600" />,
    usermanagement: <UserCheckIcon size={16} className="mr-2 text-green-600" />,
    supportticket: <HelpCircleIcon size={16} className="mr-2 text-red-600" />,
    dealermanagement: <UserPlusIcon size={16} className="mr-2 text-blue-600" />,
  };

  return (
    <div className="relative w-full flex justify-end">
      {/* 🔔 Bell Button */}
      <button
        className={`relative flex items-center justify-center border rounded-full h-11 w-11 transition-colors ${unreadCount > 0
          ? 'bg-red-50 border-red-300 text-red-600 animate-pulse'
          : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-100'
          }`}
        onClick={() => {
          setFullscreenOpen(true);
          setPage(1);
          dispatch(fetchnotification({ page: 1, type: filterType }));
        }}
      >
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-red-600 text-white text-xs font-semibold px-1.5 py-0.5 rounded-full transform translate-x-1/5 -translate-y-1/5 min-w-[18px] text-center leading-none">
            {unreadCount}
          </span>
        )}
        <svg className="fill-current" width="20" height="20" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M10.75 2.29248C10.75 1.87827 10.4143 1.54248 10 1.54248C9.58583 1.54248 9.25004 1.87827 9.25004 2.29248V2.83613C6.08266 3.20733 3.62504 5.9004 3.62504 9.16748V14.4591H3.33337C2.91916 14.4591 2.58337 14.7949 2.58337 15.2091C2.58337 15.6234 2.91916 15.9591 3.33337 15.9591H16.6667C17.0809 15.9591 17.4167 15.6234 17.4167 15.2091C17.4167 14.7949 17.0809 14.4591 16.6667 14.4591H16.375V9.16748C16.375 5.9004 13.9174 3.20733 10.75 2.83613V2.29248ZM14.875 14.4591V9.16748C14.875 6.47509 12.6924 4.29248 10 4.29248C7.30765 4.29248 5.12504 6.47509 5.12504 9.16748V14.4591H14.875ZM8.00004 17.7085C8.00004 18.1228 8.33583 18.4585 8.75004 18.4585H11.25C11.6643 18.4585 12 18.1228 12 17.7085C12 17.2943 11.6643 16.9585 11.25 16.9585H8.75004C8.33583 16.9585 8.00004 17.2943 8.00004 17.7085Z"
            fill="currentColor"
          />
        </svg>
      </button>


      {/* 🔳 Fullscreen Dialog */}
      <Dialog open={fullscreenOpen} onClose={() => setFullscreenOpen(false)} maxWidth="sm" fullWidth BackdropProps={{
        sx: {
          backdropFilter: 'blur(4px)',
          backgroundColor: 'rgba(0, 0, 0, 0.2)'
        }
      }}>
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Notifications</h2>
            <div className="flex gap-2">
              {/* {Notifications.length > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-xs text-blue-600 hover:underline"
                >
                  Mark all as read
                </button>
              )} */}
              <IconButton onClick={() => setFullscreenOpen(false)}>
                <CloseIcon />
              </IconButton>
            </div>
          </div>

          <div className="max-h-[70vh] overflow-y-auto">
            {unreadNotifications.length === 0 ? (
              <div className="text-center text-gray-400">No notifications</div>
            ) : (
              unreadNotifications.map((item) => {
                const icon = iconMap[item.moduleKey] || <CheckCircleIcon size={16} />;
                return (
                  <DropdownItem
                    key={item._id}
                    onItemClick={() => handleNavigate(item)}
                    className={`mb-2 rounded-lg border-b border-gray-100 px-4.5 py-3 hover:bg-gray-100 ${typeBgMap[item.moduleKey] || ''}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col text-sm text-gray-800">
                        <div className={`flex items-center ${!item.isRead ? 'font-semibold' : 'text-gray-500'}`}>
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
                            onClick={(e) => handleMarkRead(e, item._id)}
                            className="text-xs ml-2 text-blue-500 hover:underline"
                          >
                            <CheckIcon />
                          </button>
                        </Tooltip>
                      )}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {new Date(item.createdAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
                    </div>
                  </DropdownItem>
                );
              })
            )}

            {/* ⬇ Load More */}
            {totalPages > 1 && (
              <div className="flex flex-col items-center mt-4 space-y-2">
                <div className="text-sm text-gray-500">
                  Page {page} of {totalPages}
                </div>
                <div className="flex space-x-4">
                  <Button
                    onClick={handlePreviousPage}
                    variant="outlined"
                    color="primary"
                    disabled={page === 1}
                    startIcon={<ChevronRightIcon style={{ transform: 'rotate(180deg)' }} />}
                    className="rounded-full normal-case px-4 py-1 shadow-md font-outfit"
                  >
                    Previous page
                  </Button>
                  <Button
                    onClick={handleLoadMore}
                    variant="contained"
                    color="primary"
                    disabled={page >= totalPages}
                    endIcon={<ChevronRightIcon />}
                    className="rounded-full normal-case px-4 py-1 shadow-md font-outfit"
                  >
                    Next page
                  </Button>
                </div>
              </div>
            )}

          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default NotificationDropdown;




//with websocket code

// import { useEffect, useState, useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import { Dropdown } from "../ui/dropdown/Dropdown";
// import { DropdownItem } from "../ui/dropdown/DropdownItem";

// type NotificationItem = {
//   id: number | string;
//   type: string;
//   name: string;
//   createdAt: string;
// };

// const notificationRoutes: Record<string, { message: (name: string) => string; path: string }> = {
//   dealer_register: {
//     message: (name) => `New dealer registered: ${name}`,
//     path: "/superadmin/dealermanagment"
//   },
//   buyer_register: {
//     message: (name) => `New buyer registered: ${name}`,
//     path: "/superadmin/buyermanagment"
//   },
//   listing_submit: {
//     message: (name) => `New listing added: ${name}`,
//     path: "/superadmin/productlistings"
//   },
//   subscription_purchase: {
//     message: (name) => `Subscription purchased by ${name}`,
//     path: "/superadmin/subscriptionmanagement"
//   },
//   support_submitted: {
//     message: (name) => `New Ticket received from ${name}`,
//     path: "/superadmin/supportticketmanagement"
//   },
//   listing_sold: {
//     message: (name) => `${name} marked listing as Sold`,
//     path: "/superadmin/productlistings"
//   }
// };

// export default function NotificationDropdown() {
//   const [isOpen, setIsOpen] = useState(false);
//   const [notifying, setNotifying] = useState(false);
//   const [notifications, setNotifications] = useState<NotificationItem[]>([]);
//   const navigate = useNavigate();
//   const socketRef = useRef<WebSocket | null>(null);

//   useEffect(() => {
//     // ✅ Connect to your WebSocket server
//     const ws = new WebSocket("wss://yourserver.com/notifications"); // <== Replace with your WebSocket URL
//     socketRef.current = ws;

//     ws.onopen = () => {
//       console.log("WebSocket connected");
//     };

//     ws.onmessage = (event) => {
//       try {
//         const data: NotificationItem = JSON.parse(event.data);
//         setNotifications((prev) => [data, ...prev]);
//         setNotifying(false); // show badge
//       } catch (err) {
//         console.error("Error parsing WebSocket message:", err);
//       }
//     };

//     ws.onerror = (err) => {
//       console.error("WebSocket error:", err);
//     };

//     ws.onclose = () => {
//       console.log("WebSocket disconnected");
//     };

//     // Cleanup on unmount
//     return () => {
//       ws.close();
//     };
//   }, []);

//   const handleItemClick = (type: string, path: string) => {
//     navigate(path);
//     setIsOpen(false);
//     setNotifying(false);
//   };

//   return (
//     <div className="relative w-full flex justify-end">
//       <button
//         className="relative flex items-center justify-center text-gray-500 bg-white border border-gray-200 rounded-full h-11 w-11 hover:bg-gray-100 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
//         onClick={() => {
//           setIsOpen(!isOpen);
//           setNotifying(false);
//         }}
//       >
//         {notifying && (
//           <span className="absolute right-0 top-0.5 z-10 h-2 w-2 rounded-full bg-orange-400">
//             <span className="absolute inline-flex w-full h-full bg-orange-400 rounded-full opacity-75 animate-ping" />
//           </span>
//         )}
//         <svg
//           className="fill-current"
//           width="20"
//           height="20"
//           viewBox="0 0 20 20"
//           xmlns="http://www.w3.org/2000/svg"
//         >
//           <path
//             fillRule="evenodd"
//             clipRule="evenodd"
//             d="M10.75 2.29248C10.75 1.87827 10.4143 1.54248 10 1.54248C9.58583 1.54248 9.25004 1.87827 9.25004 2.29248V2.83613C6.08266 3.20733 3.62504 5.9004 3.62504 9.16748V14.4591H3.33337C2.91916 14.4591 2.58337 14.7949 2.58337 15.2091C2.58337 15.6234 2.91916 15.9591 3.33337 15.9591H4.37504H15.625H16.6667C17.0809 15.9591 17.4167 15.6234 17.4167 15.2091C17.4167 14.7949 17.0809 14.4591 16.6667 14.4591H16.375V9.16748C16.375 5.9004 13.9174 3.20733 10.75 2.83613V2.29248ZM14.875 14.4591V9.16748C14.875 6.47509 12.6924 4.29248 10 4.29248C7.30765 4.29248 5.12504 6.47509 5.12504 9.16748V14.4591H14.875ZM8.00004 17.7085C8.00004 18.1228 8.33583 18.4585 8.75004 18.4585H11.25C11.6643 18.4585 12 18.1228 12 17.7085C12 17.2943 11.6643 16.9585 11.25 16.9585H8.75004C8.33583 16.9585 8.00004 17.2943 8.00004 17.7085Z"
//             fill="currentColor"
//           />
//         </svg>
//       </button>

//       <Dropdown
//         isOpen={isOpen}
//         onClose={() => setIsOpen(false)}
//         className="fixed top-[64px] right-4 z-50 w-[90vw] max-w-[360px] max-h-[80vh] overflow-y-auto flex flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark lg:absolute lg:right-0 lg:top-[60px]"
//       >
//         <h5 className="text-lg font-semibold mb-3 text-gray-800 dark:text-white">
//           Notifications
//         </h5>
//         <ul className="flex flex-col h-auto overflow-y-auto custom-scrollbar">
//           {notifications.map((item) => {
//             const config = notificationRoutes[item.type];
//             if (!config) return null;
//             return (
//               <DropdownItem
//                 key={item.id}
//                 onItemClick={() => handleItemClick(item.type, config.path)}
//                 className="rounded-lg border-b border-gray-100 px-4.5 py-3 hover:bg-gray-100 dark:border-gray-800 dark:hover:bg-white/5"
//               >
//                 <div className="text-sm text-gray-800 dark:text-white/90">
//                   {config.message(item.name)}
//                 </div>
//                 <div className="text-xs text-gray-500 mt-1">
//                   {new Date(item.createdAt).toLocaleString()}
//                 </div>
//               </DropdownItem>
//             );
//           })}
//           {notifications.length === 0 && (
//             <div className="text-sm text-gray-500 text-center py-4">No notifications yet</div>
//           )}
//         </ul>
//       </Dropdown>
//     </div>
//   );
// }
