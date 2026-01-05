// import { Link, useLocation } from "react-router";
// import { useState } from "react";
// import { ChevronDown, ChevronRight } from "lucide-react"; // optional

// import {
// HorizontaLDots,
// UserCircleIcon,
// DocsIcon,
// MailIcon,
// CouponIcon,
// TableIcon,
// GroupIcon,
// ProductListIcon,
// PaymentIcon,
// CategoryIcon,
// MenuIcon,
// OtherChargesIcon,
// AppFeedbackIcon,
// OrderIcon,
// } from "../icons";
// import { useSidebar } from "../context/SidebarContext";
// import SidebarWidget from "./SidebarWidget";
// import { getActiveUser } from "../utility/Cookies";
// import { Typography } from "@mui/material";


// type NavItem = {
//   name: string;
//   icon: React.ReactNode;
//   path?: string;
//   children?: NavItem[];
//   key?: string;
// };

// const adminNavItems: NavItem[] = [
//   {
//     icon: <TableIcon />,
//     name: "Dashboard",
//     path: "/staff/dashboard",
//     key: "dashboard",
//   },
//   {
//     icon: <AppFeedbackIcon />,
//     name: "General Masters",
//     key: "generalmaster",
//     children: [
//       { icon: <AppFeedbackIcon />, name: "Category", path: "/staff/categorymasters", key: "generalmaster" },
//       { icon: <AppFeedbackIcon />, name: "Country", path: "/staff/countrymasters", key: "generalmaster" },
//       { icon: <AppFeedbackIcon />, name: "State", path: "/staff/statemasters", key: "generalmaster" },
//       { icon: <AppFeedbackIcon />, name: "City", path: "/staff/citymasters", key: "generalmaster" },
//     ],
//   },
//   {
//     icon: <AppFeedbackIcon />,
//     name: "Car Masters",
//     key: "carmasters",
//     children: [
//       { icon: <AppFeedbackIcon />, name: "Car Brand", path: "/staff/carbrandmasters", key: "carmasters" },
//       { icon: <AppFeedbackIcon />, name: "Car Name", path: "/staff/carnamemasters", key: "carmasters" },
//       { icon: <AppFeedbackIcon />, name: "Car Fuel Type", path: "/staff/carfueltypemasters", key: "carmasters" },
//       { icon: <AppFeedbackIcon />, name: "Car Ownership", path: "/staff/carownershipmasters", key: "carmasters" },
//       { icon: <AppFeedbackIcon />, name: "Car Color", path: "/staff/carcolormasters", key: "carmasters" },
//       { icon: <AppFeedbackIcon />, name: "Year", path: "/staff/caryearmasters", key: "carmasters" },
//       { icon: <AppFeedbackIcon />, name: "Kilometer", path: "/staff/carkilometermasters", key: "carmasters" },
//     ],
//   },
//   {
//     icon: <AppFeedbackIcon />,
//     name: "Bike Masters",
//     key: "bikemasters",
//     children: [
//       { icon: <AppFeedbackIcon />, name: "Bike Brand", path: "/staff/bikebrandmasters", key: "bikemasters" },
//       { icon: <AppFeedbackIcon />, name: "Bike Name", path: "/staff/bikenamemasters", key: "bikemasters" },
//       { icon: <AppFeedbackIcon />, name: "Bike Fuel Type", path: "/staff/bikefueltypemasters", key: "bikemasters" },
//       { icon: <AppFeedbackIcon />, name: "Bike Ownership", path: "/staff/bikeownershipmasters", key: "bikemasters" },
//       { icon: <AppFeedbackIcon />, name: "Bike Color", path: "/staff/bikecolormasters", key: "bikemasters" },
//       { icon: <AppFeedbackIcon />, name: "Year", path: "/staff/bikeyearmasters", key: "bikemasters" },
//       { icon: <AppFeedbackIcon />, name: "Kilometer", path: "/staff/bikekilometermasters", key: "bikemasters" },
//     ],
//   },
//   // {
//   //   icon: <AppFeedbackIcon />,
//   //   name: "Spareparts Masters",
//   //   key: "sparepartmasters",
//   //   children: [
//   //     { icon: <AppFeedbackIcon />, name: "Product type", path: "/staff/producttypemasters", key: "sparepartmasters" },
//   //     { icon: <AppFeedbackIcon />, name: "Condition", path: "/staff/conditionmasters", key: "sparepartmasters" },
//   //     { icon: <AppFeedbackIcon />, name: "Year of Manufacture", path: "/staff/yearofmfgmasters", key: "sparepartmasters" },

//   //   ],
//   // },
//   {
//     icon: <GroupIcon />,
//     name: "User Management",
//     children: [
//       {
//         icon: <AppFeedbackIcon />,
//         name: "Dealer Management",
//         path: "/staff/dealermanagment",
//         key: "usermanagement"
//       },
//       {
//         icon: <AppFeedbackIcon />,
//         name: "Buyer Management",
//         path: "/staff/buyermanagment",
//         key: "usermanagement"

//       },
//     ]
//   },

//   {
//     icon: <MailIcon />,
//     name: "Feedback Management",
//     path: "/staff/feedbackmanagement",
//     key: "feedbackmanagement",
//   },

//   {
//     icon: <CouponIcon />,
//     name: "Support Ticket",
//     path: "/staff/supportticketmanagement",
//     key: "supportticket",
//   },

//   {
//     icon: <UserCircleIcon />,
//     name: "Subscription Management",
//     path: "/staff/subscriptionmanagement",
//     key: "subscription",
//   },

//   {
//     icon: <ProductListIcon />,
//     name: "Product Listing",
//     path: "/staff/productlistings",
//     key: "productlistings",
//   },
//   {
//     icon: <GroupIcon />,
//     name: "Staff Management",
//     path: "/staff/staffmanagement",
//     key: "staffmanagement"
//   },

//   {
//     icon: <AppFeedbackIcon />,
//     name: "CMS Management",
//     children: [
//       {
//         icon: <CategoryIcon />,
//         name: "Home Page Banner",
//         path: "/staff/homepagebanner",
//         key: "cmsmanagement"
//       },
//       {
//         icon: <CategoryIcon />,
//         name: "Enquiry Listing",
//         path: "/staff/enquirylisting",
//         key: "cmsmanagement"
//       },
//       {
//         icon: <CategoryIcon />,
//         name: "FAQs",
//         path: "/staff/faqs",
//         key: "cmsmanagement"
//       },
//     ]
//   },


//   {
//     icon: <CategoryIcon />,
//     name: "Tutorial Management",
//     children: [
//       {
//         icon: <CategoryIcon />,
//         name: "Dealer App tutorial",
//         path: "/staff/dealertutorial",
//         key: "tutorialmanagement"
//       },
//       {
//         icon: <CategoryIcon />,
//         name: "Buyer App tutorial",
//         path: "/staff/buyertutorial",
//         key: "tutorialmanagement"
//       },

//     ]
//   },
//   {
//     icon: <CategoryIcon />,
//     name: "App FAQ Management",
//     children: [
//       {
//         icon: <CategoryIcon />,
//         name: "Dealer App FAQ",
//         path: "/staff/dealerappfaq",
//         key: "appfaq"
//       },
//       {
//         icon: <CategoryIcon />,
//         name: "Buyer App FAQ",
//         path: "/staff/buyerappfaq",
//         key: "appfaq"
//       },
//     ]
//   },
//   {
//     icon: <CategoryIcon />,
//     name: "Banner Image Management",
//     children: [
//       {
//         icon: <CategoryIcon />,
//         name: "Dealer Banner",
//         path: "/staff/dealerbanner",
//         key: "banner"
//       },
//       {
//         icon: <CategoryIcon />,
//         name: "Buyer Banner",
//         path: "/staff/buyerbanner",
//         key: "banner"
//       },

//     ]
//   },
//   {
//     icon: <AppFeedbackIcon />,
//     name: "Terms & Condition Privacy Policy",
//     children: [
//       {
//         icon: <AppFeedbackIcon />,
//         name: "Terms & Condition Buyer App",
//         path: "/staff/termsandconditionbuyer",
//         key: "termsandpolicy"
//       },
//       {
//         icon: <AppFeedbackIcon />,
//         name: "Terms & Condition Dealer App",
//         path: "/staff/termsandconditiondealer",
//         key: "termsandpolicy"

//       },
//       {
//         icon: <AppFeedbackIcon />,
//         name: "Terms & Condition Website",
//         path: "/staff/termsandconditionwebsite",
//         key: "termsandpolicy"

//       },
//       {
//         icon: <AppFeedbackIcon />,
//         name: "Privacy Policy Buyer App",
//         path: "/staff/privacypolicybuyer",
//         key: "termsandpolicy"

//       },
//       {
//         icon: <AppFeedbackIcon />,
//         name: "Privacy Policy Dealer App",
//         path: "/staff/privacypolicydealer",
//         key: "termsandpolicy"

//       },
//       {
//         icon: <AppFeedbackIcon />,
//         name: "Privacy Policy Website",
//         path: "/staff/privacypolicywebsite",
//         key: "termsandpolicy"

//       },
//     ]
//   },
// ];




// const superAdminNavItems: NavItem[] = [
//   {
//     icon: <TableIcon />,
//     name: "Dashboard",
//     path: "/superadmin/dashboard",
//   },

//   {
//     icon: <AppFeedbackIcon />,
//     name: "General Masters",
//     children: [
//       {
//         icon: <AppFeedbackIcon />,
//         name: "Category",
//         path: "/superadmin/categorymasters"
//       },
//       {
//         icon: <AppFeedbackIcon />,
//         name: "Country",
//         path: "/superadmin/countrymasters"
//       },
//       {
//         icon: <AppFeedbackIcon />,
//         name: "State",
//         path: "/superadmin/statemasters"
//       },
//       {
//         icon: <AppFeedbackIcon />,
//         name: "City",
//         path: "/superadmin/citymasters"
//       },
//     ]
//   },

//   {
//     icon: <AppFeedbackIcon />,
//     name: "Car Masters",
//     children: [
//       {
//         icon: <AppFeedbackIcon />,
//         name: "Car Brand",
//         path: "/superadmin/carbrandmasters"
//       },
//       {
//         icon: <AppFeedbackIcon />,
//         name: "Car Name",
//         path: "/superadmin/carnamemasters"
//       },
//       {
//         icon: <AppFeedbackIcon />,
//         name: "Car Fuel Type",
//         path: "/superadmin/carfueltypemasters"
//       },
//       {
//         icon: <AppFeedbackIcon />,
//         name: "Car Ownership",
//         path: "/superadmin/carownershipmasters"
//       },
//       {
//         icon: <AppFeedbackIcon />,
//         name: "Car Color",
//         path: "/superadmin/carcolormasters"
//       },
//       {
//         icon: <AppFeedbackIcon />,
//         name: "Year",
//         path: "/superadmin/caryearmasters"
//       },
//       {
//         icon: <AppFeedbackIcon />,
//         name: "Kilometer",
//         path: "/superadmin/carkilometermasters"
//       },

//     ]
//   },

// {
//   icon: <AppFeedbackIcon />,
//   name: "Bike Masters",
//   children: [
//     {
//       icon: <AppFeedbackIcon />,
//       name: "Bike Brand",
//       path: "/superadmin/bikebrandmasters"
//     },
//     {
//       icon: <AppFeedbackIcon />,
//       name: "Bike Name",
//       path: "/superadmin/bikenamemasters"
//     },
//     {
//       icon: <AppFeedbackIcon />,
//       name: "Bike Fuel Type",
//       path: "/superadmin/bikefueltypemasters"
//     },
//     {
//       icon: <AppFeedbackIcon />,
//       name: "Bike Ownership",
//       path: "/superadmin/bikeownershipmasters"
//     },
//     {
//       icon: <AppFeedbackIcon />,
//       name: "Bike Color",
//       path: "/superadmin/bikecolormasters"
//     },
//     {
//       icon: <AppFeedbackIcon />,
//       name: "Year",
//       path: "/superadmin/bikeyearmasters"
//     },
//     {
//       icon: <AppFeedbackIcon />,
//       name: "Kilometer",
//       path: "/superadmin/bikekilometermasters"
//     },

//   ]
// },
//   //  {
//   //     icon: <AppFeedbackIcon />,
//   //     name: "Spareparts Masters",
//   //     children: [
//   //       {
//   //         icon: <AppFeedbackIcon />,
//   //         name: "Product type",
//   //         path: "/superadmin/producttypemasters"
//   //       },
//   //       {
//   //         icon: <AppFeedbackIcon />,
//   //         name: "Condition",
//   //         path: "/superadmin/conditionmasters"
//   //       },
//   //       {
//   //         icon: <AppFeedbackIcon />,
//   //         name: "Year of Manufacture",
//   //         path: "/superadmin/yearofmfgmasters"
//   //       },
//   //     ]
//   //   },
//   {
//     icon: <GroupIcon />,
//     name: "Staff Management",
//     path: "/superadmin/staffmanagement",
//   },

//   {
//     icon: <GroupIcon />,
//     name: "User Management",
//     children: [
//       {
//         icon: <AppFeedbackIcon />,
//         name: "Dealer Management",
//         path: "/superadmin/dealermanagment"
//       },
//       {
//         icon: <AppFeedbackIcon />,
//         name: "Buyer Management",
//         path: "/superadmin/buyermanagment"
//       },
//     ]
//   },
//   {
//     icon: <ProductListIcon />,
//     name: "Product Listing",
//     path: "/superadmin/productlistings",
//   },
//   {
//     icon: <CouponIcon />,
//     name: "Support Ticket",
//     path: "/superadmin/supportticketmanagement",
//   },
//   {
//     icon: <MailIcon />,
//     name: "Feedback Management",
//     path: "/superadmin/feedbackmanagement",
//     key: "feedbackmanagement",
//   },
//   {
//     icon: <UserCircleIcon />,
//     name: "Subscription Management",
//     path: "/superadmin/subscriptionmanagement",
//   },


//   {
//     icon: <AppFeedbackIcon />,
//     name: "CMS Management",
//     children: [
//       {
//         icon: <CategoryIcon />,
//         name: "Home Page Banner",
//         path: "/superadmin/homepagebanner",
//       },
//       {
//         icon: <CategoryIcon />,
//         name: "Enquiry Listing",
//         path: "/superadmin/enquirylisting",
//       },
//       {
//         icon: <CategoryIcon />,
//         name: "FAQs",
//         path: "/superadmin/faqs",
//       },
//     ]
//   },
//   {
//     icon: <CategoryIcon />,
//     name: "Tutorial Management",
//     children: [
//       {
//         icon: <CategoryIcon />,
//         name: "Dealer App tutorial",
//         path: "/superadmin/dealertutorial",
//       },
//       {
//         icon: <CategoryIcon />,
//         name: "Buyer App tutorial",
//         path: "/superadmin/buyertutorial",
//       },

//     ]
//   },

//   {
//     icon: <CategoryIcon />,
//     name: "App FAQ Management",
//     children: [
//       {
//         icon: <CategoryIcon />,
//         name: "Dealer App FAQ",
//         path: "/superadmin/dealerappfaq",
//       },
//       {
//         icon: <CategoryIcon />,
//         name: "Buyer App FAQ",
//         path: "/superadmin/buyerappfaq",
//       },
//     ]
//   },
//   {
//     icon: <CategoryIcon />,
//     name: "Banner Image Management",
//     children: [
//       {
//         icon: <CategoryIcon />,
//         name: "Dealer Banner",
//         path: "/superadmin/dealerbanner",
//       },
//       {
//         icon: <CategoryIcon />,
//         name: "Buyer Banner",
//         path: "/superadmin/buyerbanner",
//       },

//     ]
//   },
//   {
//     icon: <AppFeedbackIcon />,
//     name: "Terms & Condition Privacy Policy",
//     children: [
//       {
//         icon: <AppFeedbackIcon />,
//         name: "Terms & Condition Buyer App",
//         path: "/superadmin/termsandconditionbuyer",
//       },
//       {
//         icon: <AppFeedbackIcon />,
//         name: "Terms & Condition Dealer App",
//         path: "/superadmin/termsandconditiondealer",
//       },
//       {
//         icon: <AppFeedbackIcon />,
//         name: "Terms & Condition Website",
//         path: "/superadmin/termsandconditionwebsite",
//       },
//       {
//         icon: <AppFeedbackIcon />,
//         name: "Privacy Policy Buyer App",
//         path: "/superadmin/privacypolicybuyer",
//       },
//       {
//         icon: <AppFeedbackIcon />,
//         name: "Privacy Policy Dealer App",
//         path: "/superadmin/privacypolicydealer",
//       },
//       {
//         icon: <AppFeedbackIcon />,
//         name: "Privacy Policy Website",
//         path: "/superadmin/privacypolicywebsite",
//       },
//     ]
//   },
// ];

// const AppSidebar: React.FC = () => {
//   const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
//   const location = useLocation();
//   const cookiesData = getActiveUser();
//   const userRole = cookiesData?.role;
//   const permissionsArray = cookiesData?.permissions || [];

//   const allowedKeys = permissionsArray
//     .filter((perm: any) => perm.allowed)
//     .map((perm: any) => perm.key);

//   //  Recursively filter by allowed keys
//   const filterMenuByPermission = (items: NavItem[], allowed: string[]): NavItem[] =>
//     items
//       .map(item => {
//         // If the item has children, recursively filter them
//         if (item.children) {
//           const filteredChildren = filterMenuByPermission(item.children, allowed);
//           // Only include parent if at least one child is allowed
//           if (filteredChildren.length > 0) {
//             return { ...item, children: filteredChildren };
//           }
//           return null; // No visible children, skip entire section
//         }

//         // For non-parent item: show only if allowed or has no key
//         if (!item.key || allowed.includes(item.key)) {
//           return item;
//         }

//         return null;
//       })
//       .filter(Boolean) as NavItem[];


//   const navItemsToRender = userRole === "admin"
//     ? superAdminNavItems
//     : filterMenuByPermission(adminNavItems, allowedKeys);

//   const isActive = (path: string) => location.pathname === path;

//   const [openDropdowns, setOpenDropdowns] = useState<{ [key: string]: boolean }>({});

//   const toggleDropdown = (name: string) => {
//     setOpenDropdowns(prev => {
//       const isCurrentlyOpen = prev[name];
//       return isCurrentlyOpen ? {} : { [name]: true };
//     });
//   };


//   const renderMenuItems = (items: NavItem[]) => (
//     <ul className="flex flex-col gap-4">
//       {items.map((nav) => (
//         <li key={nav.name}>
//           {nav.children ? (
//             <>
//               <div onClick={() => toggleDropdown(nav.name)}
//                 className={`menu-item group cursor-pointer flex items-center justify-between ${openDropdowns[nav.name] ? "menu-item-active" : "menu-item-inactive"}`}>
//                 <div className="flex items-center gap-3">
//                   <span className="menu-item-icon-size">{nav.icon}</span>
//                   {(isExpanded || isHovered || isMobileOpen) && (
//                     <span className="menu-item-text">{nav.name}</span>
//                   )}
//                 </div>
//                 {(isExpanded || isHovered || isMobileOpen) && (
//                   <span className="pr-2 transition-transform duration-200">
//                     {openDropdowns[nav.name] ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
//                   </span>
//                 )}
//               </div>
//               {openDropdowns[nav.name] && (
//                 <ul className={`${isExpanded ? 'ml-8' : ''} mt-2 flex flex-col gap-2`}>
//                   {nav.children.map((child) => (
//                     <li key={child.name}>
//                       <Link to={child.path ?? "#"}
//                         className={`menu-item group ${isActive(child.path || "") ? "menu-item-active" : "menu-item-inactive"}`}>
//                         <span className="menu-item-icon-size">{child.icon ?? <span className="pl-4">•</span>}</span>
//                         {(isExpanded || isHovered || isMobileOpen) && (
//                           <span className="menu-item-text">{child.name}</span>
//                         )}
//                       </Link>
//                     </li>
//                   ))}
//                 </ul>
//               )}
//             </>
//           ) : (
//             <Link to={nav.path ?? "#"}
//               className={`menu-item group ${isActive(nav.path || "") ? "menu-item-active" : "menu-item-inactive"}`}>
//               <span className="menu-item-icon-size">{nav.icon}</span>
//               {(isExpanded || isHovered || isMobileOpen) && (
//                 <span className="menu-item-text">{nav.name}</span>
//               )}
//             </Link>
//           )}
//         </li>
//       ))}
//     </ul>
//   );

//   return (
//     <aside className={`
//       fixed top-0 left-0 z-50 h-screen bg-white dark:bg-gray-900 text-gray-900 border-r border-gray-200 transition-all duration-300 ease-in-out mt-16 px-4 lg:mt-0
//       ${isMobileOpen ? "block w-[290px]" : "hidden"}
//       lg:block lg:translate-x-0 ${isExpanded || isHovered ? "lg:w-[290px]" : ""}
//     `}
//       onMouseEnter={() => !isExpanded && setIsHovered(true)}
//       onMouseLeave={() => setIsHovered(false)}
//     >
//       <div className={`py-4 flex ${!isExpanded && !isHovered ? "lg:justify-center" : "justify-center"}`}>
//         <Link to={userRole === "admin" ? "/superadmin/dashboard" : "/staff/dashboard"}>
//           {isExpanded || isHovered || isMobileOpen ? (
//             <img src="/images/logo/GADILO Bharat logo.png" alt="Logo" width={150} height={20} />
//           ) : (
//             <img src="/images/logo/GADILO Bharat logo.png" alt="Logo" width={60} height={32} />
//           )}
//         </Link>
//       </div>

//       <div className={`flex flex-col ${isExpanded || isHovered || isMobileOpen ? "overflow-y-auto pr-2" : "overflow-hidden"} h-[calc(100vh-12rem)]`}>
//         <nav className="mb-6">
//           <h2 className={`mb-4 text-xs uppercase text-gray-400 ${!isExpanded && !isHovered ? "lg:justify-center" : "justify-start"}`}>
//             {isExpanded || isHovered || isMobileOpen ? "Menu" : "Menu"}
//           </h2>
//           {renderMenuItems(navItemsToRender)}
//         </nav>
//         {(isExpanded || isHovered || isMobileOpen) && <SidebarWidget />}
//       </div>
//     </aside>
//   );
// };

// export default AppSidebar;






import { Link, useLocation } from "react-router";
import { useState } from "react";
import { ChevronDown, ChevronRight, Users } from "lucide-react"; // optional

import {
  HorizontaLDots,
  UserCircleIcon,
  DocsIcon,
  MailIcon,
  CouponIcon,
  TableIcon,
  GroupIcon,
  ProductListIcon,
  PaymentIcon,
  CategoryIcon,
  MenuIcon,
  OtherChargesIcon,
  AppFeedbackIcon,
  OrderIcon,

} from "../icons";
import {
  WalletIcon,
  IndianRupeeIcon,
  AlertTriangleIcon,
  MegaphoneIcon,
  TruckIcon,
  UserIcon,
  FileTextIcon,
  ListIcon,
} from "lucide-react";

import ApartmentIcon from "@mui/icons-material/Apartment";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { useSidebar } from "../context/SidebarContext";
import SidebarWidget from "./SidebarWidget";
import { getActiveUser } from "../utility/Cookies";
import { Typography } from "@mui/material";
import { Receipt } from "@mui/icons-material";
import CampaignIcon from "@mui/icons-material/Campaign";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import FolderZipIcon from "@mui/icons-material/FolderZip";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import SettingsIcon from "@mui/icons-material/Settings";
import ContactsIcon from "@mui/icons-material/Contacts";


type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  children?: NavItem[];
  key?: string;
};

const adminNavItems: NavItem[] = [
  {
    icon: <TableIcon />,
    name: "Dashboard",
    path: "/admin/dashboard",
    key: "dashboard",
  },


  {
    icon: <Users />,
    name: "Member And Unit Management Module",
    path: "/admin/membermanagement",
  },

  // {
  //   icon: <Receipt />,
  //   name: "Billing And Charge Management Module",
  //   path: "/admin/billingmanagement",
  // },


  // {
  //   icon: <ReceiptLongIcon />,
  //   name: "Society Ledger Management Module",
  //   path: "/admin/society-ledgermanagement",
  // },

  {
    icon: <CampaignIcon />,
    name: "Notices & Announcements Management Module",
    path: "/admin/notice-management",
  },

  {
    icon: <PeopleAltIcon />,
    name: "Visitor Logs Management Module",
    path: "/admin/visitor-log-management",
  },

  {
    icon: <AdminPanelSettingsIcon />,
    name: "Role-Based Access Management Module",
    path: "/admin/rolebase-access-management",
  },

  {
    icon: <SupportAgentIcon />,
    name: "Support Ticket Management Module",
    path: "/admin/supportticket-management",
  },

  {
    icon: <FolderZipIcon />,
    name: "Document Vault Management Module",
    path: "/admin/document-vault-management",
  },

  {
    icon: <NotificationsActiveIcon />,
    name: "Notification Management Module",
    path: "/admin/society-notifications",
  },

  // {
  //   icon: <SettingsIcon />,
  //   name: "Master Management Module",
  //   path: "/admin/master-management",
  // },
  {
    icon: <SettingsIcon />,
    name: "Master Management Module",
    key:"expensecategorymaster",
    children: [
      {
        icon: <WalletIcon size={18} />,
        name: "Expense Category Master",
        path: "/admin/expensecategorymaster",
      },
      {
        icon: <IndianRupeeIcon size={18} />,
        name: "Income Category Master",
        path: "/admin/incomecategorymaster",
      },
      {
        icon: <AlertTriangleIcon size={18} />,
        name: "Complaint Category Master",
        path: "/admin/complaintcategorymaster",
      },
      {
        icon: <MegaphoneIcon size={18} />,
        name: "Notice Category Master",
        path: "/admin/noticecategorymaster",
      },
      {
        icon: <TruckIcon size={18} />,
        name: "Vendor Master",
        path: "/admin/vendormaster",
      },
      {
        icon: <UserIcon size={18} />,
        name: "Visitor Purpose Master",
        path: "/admin/visitorpurposemaster",
      },
      {
        icon: <FileTextIcon size={18} />,
        name: "Document Category Master",
        path: "/admin/documentcategorymaster",
      },
      {
        icon: <ListIcon size={18} />,
        name: "Other Drop-down Masters",
        path: "/admin/otherdropdownmaster",
      },
    ]

  },

  {
    icon: <ContactsIcon />,
    name: "Directory Management Module",
    path: "/admin/directory-management",
  },


];




const superAdminNavItems: NavItem[] = [
  {
    icon: <TableIcon />,
    name: "Dashboard",
    path: "/superadmin/dashboard",
  },
  // {
  //   icon: <GroupIcon />,
  //   name: "Society Onboarding & Management",
  //   path: "/superadmin/society-onboarding",
  // },

  {
    icon: <GroupIcon />,
    name: "Society Onboarding & Management",
    children: [
      {
        icon: <ApartmentIcon />,
        name: "Add Society",
        path: "/superadmin/society-onboarding",
      },
      {
        icon: <AdminPanelSettingsIcon />,
        name: "Assign Society Admin",
        path: "/superadmin/assign-society-admin",
      },
      {
        icon: <PersonAddIcon />,
        name: "Add Resident",
        path: "/superadmin/society-resident",
      },
    ]
  },

  // {
  //   icon: <UserCircleIcon />,
  //   name: "Super Admin Authentication",
  //   path: "/superadmin/supportticketmanagement",
  // },

  {
    icon: <UserCircleIcon />,
    name: "Role & Permission Management",
    path: "/superadmin/society-staff-management",
  },
  {
    icon: <NotificationsActiveIcon/>,
    name: "Notification Management",
    path: "/superadmin/society-notifications",
  },
  {
    icon: <SupportAgentIcon />,
    name: "Support Ticket Management",
    path: "/superadmin/society-supportticket-management",
  },
  {
    icon: <AppFeedbackIcon />,
    name: "Society Feedback Management",
    path: "/superadmin/society-feedback-management",
  },
];

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const location = useLocation();
  const cookiesData = getActiveUser();
  const userRole = cookiesData?.role;
  const permissionsArray = cookiesData?.permissions || [];

  const allowedKeys = permissionsArray
    .filter((perm: any) => perm.allowed)
    .map((perm: any) => perm.key);

  //  Recursively filter by allowed keys
  const filterMenuByPermission = (items: NavItem[], allowed: string[]): NavItem[] =>
    items
      .map(item => {
        // If the item has children, recursively filter them
        if (item.children) {
          const filteredChildren = filterMenuByPermission(item.children, allowed);
          // Only include parent if at least one child is allowed
          if (filteredChildren.length > 0) {
            return { ...item, children: filteredChildren };
          }
          return null; // No visible children, skip entire section
        }

        // For non-parent item: show only if allowed or has no key
        if (!item.key || allowed.includes(item.key)) {
          return item;
        }

        return null;
      })
      .filter(Boolean) as NavItem[];


  const navItemsToRender = userRole === "admin"
    ? superAdminNavItems
    : filterMenuByPermission(adminNavItems, allowedKeys);

  const isActive = (path: string) => location.pathname === path;

  const [openDropdowns, setOpenDropdowns] = useState<{ [key: string]: boolean }>({});

  const toggleDropdown = (name: string) => {
    setOpenDropdowns(prev => {
      const isCurrentlyOpen = prev[name];
      return isCurrentlyOpen ? {} : { [name]: true };
    });
  };


  const renderMenuItems = (items: NavItem[]) => (
    <ul className="flex flex-col gap-4">
      {items.map((nav) => (
        <li key={nav.name}>
          {nav.children ? (
            <>
              <div onClick={() => toggleDropdown(nav.name)}
                className={`menu-item group cursor-pointer flex items-center justify-between ${openDropdowns[nav.name] ? "menu-item-active" : "menu-item-inactive"}`}>
                <div className="flex items-center gap-3">
                  <span className="menu-item-icon-size">{nav.icon}</span>
                  {(isExpanded || isHovered || isMobileOpen) && (
                    <span className="menu-item-text">{nav.name}</span>
                  )}
                </div>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className="pr-2 transition-transform duration-200">
                    {openDropdowns[nav.name] ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                  </span>
                )}
              </div>
              {openDropdowns[nav.name] && (
                <ul className={`${isExpanded ? 'ml-8' : ''} mt-2 flex flex-col gap-2`}>
                  {nav.children.map((child) => (
                    <li key={child.name}>
                      <Link to={child.path ?? "#"}
                        className={`menu-item group ${isActive(child.path || "") ? "menu-item-active" : "menu-item-inactive"}`}>
                        <span className="menu-item-icon-size">{child.icon ?? <span className="pl-4">•</span>}</span>
                        {(isExpanded || isHovered || isMobileOpen) && (
                          <span className="menu-item-text">{child.name}</span>
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </>
          ) : (
            <Link to={nav.path ?? "#"}
              className={`menu-item group ${isActive(nav.path || "") ? "menu-item-active" : "menu-item-inactive"}`}>
              <span className="menu-item-icon-size">{nav.icon}</span>
              {(isExpanded || isHovered || isMobileOpen) && (
                <span className="menu-item-text">{nav.name}</span>
              )}
            </Link>
          )}
        </li>
      ))}
    </ul>
  );

  return (
    <aside className={`
      fixed top-0 left-0 z-50 h-screen bg-white dark:bg-gray-900 text-gray-900 border-r border-gray-200 transition-all duration-300 ease-in-out mt-16 px-4 lg:mt-0
      ${isMobileOpen ? "block w-[290px]" : "hidden"}
      lg:block lg:translate-x-0 ${isExpanded || isHovered ? "lg:w-[290px]" : ""}
    `}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`py-4 flex ${!isExpanded && !isHovered ? "lg:justify-center" : "justify-center"}`}>
        <Link to={userRole === "admin" ? "/superadmin/dashboard" : "/staff/dashboard"}>
          {isExpanded || isHovered || isMobileOpen ? (
            <img src="/images/logo/Avigo.png" alt="Logo" width={150} height={20} />
          ) : (
            <img src="/images/logo/Avigo.png" alt="Logo" width={60} height={32} />
          )}
        </Link>
      </div>

      <div className={`flex flex-col ${isExpanded || isHovered || isMobileOpen ? "overflow-y-auto pr-2" : "overflow-hidden"} h-[calc(100vh-12rem)]`}>
        <nav className="mb-6">
          <h2 className={`mb-4 text-xs uppercase text-gray-400 ${!isExpanded && !isHovered ? "lg:justify-center" : "justify-start"}`}>
            {isExpanded || isHovered || isMobileOpen ? "Menu" : "Menu"}
          </h2>
          {renderMenuItems(navItemsToRender)}
        </nav>
        {(isExpanded || isHovered || isMobileOpen) && <SidebarWidget />}
      </div>
    </aside>
  );
};

export default AppSidebar;
