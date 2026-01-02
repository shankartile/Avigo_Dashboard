import React, { Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/protectroute/ProtectedRoute";
import Loader from "./components/ui/lazyloading/Loader";  // Lazy Loading Spinner
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { ScrollToTop } from "./components/common/ScrollToTop";
import ProducttypeMaster from "./components/superadmin/Masters/Producttypemaster/ProducttypeMaster";
// import SupportTicketDetails from "./components/superadmin/SupportticketManagement/SupportTicketDetails ";
// Lazy-loaded components
const SignIn = React.lazy(() => import("./pages/AuthPages/SignIn"));
const SignUp = React.lazy(() => import("./pages/AuthPages/SignUp"));
const NotFound = React.lazy(() => import("./pages/OtherPage/NotFound"));
const AppLayout = React.lazy(() => import("./layout/AppLayout"));
const NotAuthorized = React.lazy(() => import("./pages/OtherPage/NotAuthorized"));

// Staff Dashboard Sidebar Menuitem
const StaffDashboard = React.lazy(() => import("./pages/staff/Dashboard"));

//Admin Dashboard
const AdminDashboard = React.lazy(() => import("./pages/societyadmin/SocietyAdminDashboard"));
const MemberandUnitManagement = React.lazy(() => import("./pages/societyadmin/MemberandUnitManagement"));
const BillingManagement = React.lazy(() => import("./pages/societyadmin/BillingManagemet"));
const SocietyLedgerManagement = React.lazy(() => import("./pages/societyadmin/SocietyLedgerManagement"));
const NoticesandAnnouncementManagement = React.lazy(() => import("./pages/societyadmin/NoticesandAnnouncementManagement"));
const VisitorLogsManagement = React.lazy(() => import("./pages/societyadmin/VisitorLogsManagement"));
const SubAdminManagement = React.lazy(() => import("./pages/societyadmin/SubAdminManagement"));
const AdminSocietySupportticketManagement = React.lazy(() => import("./pages/societyadmin/AdminSupportTicketManagement"));
const AdminSocietySupportticketDetails = React.lazy(() => import("./pages/societyadmin/AdminSupportTicketDetails"));
const DocumentVaultManagement = React.lazy(() => import("./pages/societyadmin/DocumentVaultManagement"));
const DirectoryManagement = React.lazy(() => import("./pages/societyadmin/DirectoryManagement"));
const Notification = React.lazy(() => import("./pages/societyadmin/Notification"));

const ExpenseCategoryMaster = React.lazy(() => import("./pages/societyadmin/ExpenseCategoryMaster"));
const IncomeCategoryMaster = React.lazy(() => import("./pages/societyadmin/IncomeCategoryMaster"));
const ComplaintCategoryMaster = React.lazy(() => import("./pages/societyadmin/ComplaintCategoryMaster"));
const NoticeCategoryMaster = React.lazy(() => import("./pages/societyadmin/NoticeCategoryMaster"));
const VendorMaster = React.lazy(() => import("./pages/societyadmin/VendorMaster"));
const VisitorCategoryMaster = React.lazy(() => import("./pages/societyadmin/VisitorCategoryMaster"));
const DocumentCategoryMaster = React.lazy(() => import("./pages/societyadmin/DocumentCategoryMaster"));
const OtherDropdownMaster = React.lazy(() => import("./pages/societyadmin/OtherDropdownMaster"))




// Super Admin Dashboard Sidebar Menuitem
const Dashboard = React.lazy(() => import("./pages/superadmin/Dashboard"));

const SocietyOnboarding = React.lazy(() => import("./pages/superadmin/SocietyOnboarding"))
const SocietyAdminManagement = React.lazy(() => import("./pages/superadmin/SocietyAdminManagementMaster"))
const ResidentManagement = React.lazy(() => import("./pages/superadmin/SocietyResidentManagement"))
const SocietyStaffManagement = React.lazy(() => import("./pages/superadmin/SocietyStaffManagement"));
const SocietyNotifications = React.lazy(() => import("./pages/superadmin/SocietyNotification"));
const SocietySupportticketManagement = React.lazy(() => import("./pages/superadmin/SocietySupportTicketManagement"));
const SocietySupportticketDetails = React.lazy(() => import("./pages/superadmin/SocietySupportTicketDetail"));
const SocietyFeedbackManagement = React.lazy(() => import("./pages/superadmin/SocietyFeedbackManagement"));





const Profile = React.lazy(() => import("./pages/superadmin/ProfileSettings"));
const Notifications = React.lazy(() => import("./pages/superadmin/Notification"));

const StaffManagement = React.lazy(() => import("./pages/superadmin/StaffManagement"));
const CategoryMasters = React.lazy(() => import("./pages/superadmin/CategoryMasters"));
const CountryMasters = React.lazy(() => import("./pages/superadmin/CountryMasters"));
const StateMasters = React.lazy(() => import("./pages/superadmin/StateMasters"));
const CityMasters = React.lazy(() => import("./pages/superadmin/CityMasters"));
const CarBrandMasters = React.lazy(() => import("./pages/superadmin/CarBrandMasters"));
const CarNameMasters = React.lazy(() => import("./pages/superadmin/CarNameMasters"));
const CarFueltypeMasters = React.lazy(() => import("./pages/superadmin/CarFueltypeMasters"));
const CarOwnershipMasters = React.lazy(() => import("./pages/superadmin/CarOwnershipMasters"));
const CarYearMasters = React.lazy(() => import("./pages/superadmin/CarYearMasters"));
const CarKilometerMasters = React.lazy(() => import("./pages/superadmin/CarKilometerMasters"));
const CarColorMasters = React.lazy(() => import("./pages/superadmin/CarColorMasters"));

const BikeBrandMasters = React.lazy(() => import("./pages/superadmin/BikeBrandMasters"));
const BikeNameMasters = React.lazy(() => import("./pages/superadmin/BikeNameMasters"));
const BikeFueltypeMasters = React.lazy(() => import("./pages/superadmin/BikeFueltypeMasters"));
const BikeKilometerMasters = React.lazy(() => import("./pages/superadmin/BikeKilometerMasters"));
const BikeColorMasters = React.lazy(() => import("./pages/superadmin/BikeColorMasters"));
const BikeYearMasters = React.lazy(() => import("./pages/superadmin/BikeYearMasters"));
const BikeOwnershipMasters = React.lazy(() => import("./pages/superadmin/BikeOwnershipMasters"));


const ProducttypeMasters = React.lazy(() => import("./pages/superadmin/ProducttypeMaster"));
const ConditionMasters = React.lazy(() => import("./pages/superadmin/ConditionMasters"));
const YearofManufactureMasters = React.lazy(() => import("./pages/superadmin/YearofManufactureMasters"));


const DealerManagement = React.lazy(() => import("./pages/superadmin/DealerManagement"));
const DealerViewPage = React.lazy(() => import("./pages/superadmin/DealerViewPage"));
const BuyerManagement = React.lazy(() => import("./pages/superadmin/BuyerManagement"));
const FeedbackManagement = React.lazy(() => import("./pages/superadmin/FeedbackManagement"));
const SupportticketManagement = React.lazy(() => import("./pages/superadmin/SupportticketManagement"));
const SupportticketDetails = React.lazy(() => import("./pages/superadmin/SupportticketDetails"));

const TermsandConditionBuyer = React.lazy(() => import("./pages/superadmin/TermsandConditionBuyer"));
const TermsandConditionDealer = React.lazy(() => import("./pages/superadmin/TermsandConditionDealer"));
const TermsandConditionWebsite = React.lazy(() => import("./pages/superadmin/TermsandConditionWebsite"));
const PrivacyPolicyBuyer = React.lazy(() => import("./pages/superadmin/PrivacyPolicyBuyer"));
const PrivacyPolicyDealer = React.lazy(() => import("./pages/superadmin/PrivacyPolicyDealer"));
const PrivacyPolicyWebsite = React.lazy(() => import("./pages/superadmin/PrivacyPolicyWebsite"));
const BuyerTutorialManagement = React.lazy(() => import("./pages/superadmin/BuyerTutorialManagement"));
const DealerTutorialManagement = React.lazy(() => import("./pages/superadmin/DealerTutorialManagement"));
const DealerBannerImage = React.lazy(() => import("./pages/superadmin/DealerBannerImage"));
const BuyerBannerImage = React.lazy(() => import("./pages/superadmin/BuyerBannerImage"));

const DealerAppFAQ = React.lazy(() => import("./pages/superadmin/DealerAppFAQ"));
const BuyerAppFAQ = React.lazy(() => import("./pages/superadmin/BuyerAppFAQ"));


const HomepageBanner = React.lazy(() => import("./pages/superadmin/HomepageBanner"));
const EnquiryListing = React.lazy(() => import("./pages/superadmin/EnquiryListing"));
const FAQManagement = React.lazy(() => import("./pages/superadmin/FAQManagement"));
const SubscriptionManagement = React.lazy(() => import("./pages/superadmin/SubscriptionManagement"));
const DealerListBySubscription = React.lazy(() => import("./pages/superadmin/DealerListBySubscription"));
const ProductListingManagement = React.lazy(() => import("./pages/superadmin/ProductListingmanagement"));
const CarDetails = React.lazy(() => import("./pages/superadmin/CarDetails"));



const Reports = React.lazy(() => import("./pages/superadmin/Reports"));





const App: React.FC = () => {
  const [showForm, setShowForm] = React.useState(false);
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Suspense fallback={<Loader />}>
            <Routes>
              {/* Staff Routes */}
              <Route
                path="/admin"
                element={<ProtectedRoute allowedRoles={["admin", "staff"]}><AppLayout /></ProtectedRoute>}
              >
                <Route
                  path="dashboard"
                  element={
                    <ProtectedRoute allowedRoles={["admin", "staff"]} requiredPermission="dashboard">
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="notifications"
                  element={
                    <ProtectedRoute allowedRoles={["admin", "staff"]} requiredPermission="dashboard">
                      <SocietyNotifications />
                    </ProtectedRoute>

                  }
                />

                {/* Society Admin Path */}
                <Route path="membermanagement" element={<ProtectedRoute allowedRoles={["staff"]} requiredPermission="dashboard"><MemberandUnitManagement /></ProtectedRoute>} />
                <Route path="billingmanagement" element={<ProtectedRoute allowedRoles={["staff"]} requiredPermission="dashboard"><BillingManagement /></ProtectedRoute>} />
                <Route path="society-ledgermanagement" element={<ProtectedRoute allowedRoles={["staff"]} requiredPermission="dashboard"><SocietyLedgerManagement /></ProtectedRoute>} />
                <Route path="notice-management" element={<ProtectedRoute allowedRoles={["staff"]} requiredPermission="dashboard"><NoticesandAnnouncementManagement /></ProtectedRoute>} />
                <Route path="visitor-log-management" element={<ProtectedRoute allowedRoles={["staff"]} requiredPermission="dashboard"><VisitorLogsManagement /></ProtectedRoute>} />
                <Route path="rolebase-access-management" element={<ProtectedRoute allowedRoles={["staff"]} requiredPermission="dashboard"><SubAdminManagement /></ProtectedRoute>} />
                <Route path="supportticket-management" element={<ProtectedRoute allowedRoles={["staff"]} requiredPermission="dashboard"><AdminSocietySupportticketManagement /></ProtectedRoute>} />
                <Route path="supportticket-management/:id" element={<ProtectedRoute allowedRoles={["staff"]} requiredPermission="dashboard"><AdminSocietySupportticketDetails /></ProtectedRoute>} />
                <Route path="document-vault-management" element={<ProtectedRoute allowedRoles={["staff"]} requiredPermission="dashboard"><DocumentVaultManagement /></ProtectedRoute>} />
                <Route path="directory-management" element={<ProtectedRoute allowedRoles={["staff"]} requiredPermission="dashboard"><DirectoryManagement /></ProtectedRoute>} />
                <Route path="society-notifications" element={<ProtectedRoute allowedRoles={["staff"]} requiredPermission="dashboard"><Notification /></ProtectedRoute>} />

                {/*Society Admin Master */}
                <Route path="expensecategorymaster" element={<ProtectedRoute allowedRoles={["staff"]} requiredPermission="dashboard"><ExpenseCategoryMaster /></ProtectedRoute>} />
                <Route path="incomecategorymaster" element={<ProtectedRoute allowedRoles={["staff"]} requiredPermission="dashboard"><IncomeCategoryMaster /></ProtectedRoute>} />
                <Route path="complaintcategorymaster" element={<ProtectedRoute allowedRoles={["staff"]} requiredPermission="dashboard"><ComplaintCategoryMaster /></ProtectedRoute>} />
                <Route path="noticecategorymaster" element={<ProtectedRoute allowedRoles={["staff"]} requiredPermission="dashboard"><NoticeCategoryMaster /></ProtectedRoute>} />
                <Route path="vendormaster" element={<ProtectedRoute allowedRoles={["staff"]} requiredPermission="dashboard"><VendorMaster /></ProtectedRoute>} />
                <Route path="visitorpurposemaster" element={<ProtectedRoute allowedRoles={["staff"]} requiredPermission="dashboard"><VisitorCategoryMaster /></ProtectedRoute>} />
                <Route path="documentcategorymaster" element={<ProtectedRoute allowedRoles={["staff"]} requiredPermission="dashboard"><DocumentCategoryMaster /></ProtectedRoute>} />
                <Route path="otherdropdownmaster" element={<ProtectedRoute allowedRoles={["staff"]} requiredPermission="dashboard"><OtherDropdownMaster /></ProtectedRoute>} />



                <Route path="categorymasters" element={<ProtectedRoute allowedRoles={["staff"]} requiredPermission="generalmaster"><CategoryMasters /></ProtectedRoute>} />
                <Route path="countrymasters" element={<ProtectedRoute allowedRoles={["staff"]} requiredPermission="generalmaster"><CountryMasters /></ProtectedRoute>} />
                <Route path="statemasters" element={<ProtectedRoute allowedRoles={["staff"]} requiredPermission="generalmaster"><StateMasters /></ProtectedRoute>} />
                <Route path="citymasters" element={<ProtectedRoute allowedRoles={["staff"]} requiredPermission="generalmaster"><CityMasters /></ProtectedRoute>} />

                <Route path="carbrandmasters" element={<ProtectedRoute allowedRoles={["staff"]} requiredPermission="carmasters"><CarBrandMasters /></ProtectedRoute>} />
                <Route path="carnamemasters" element={<ProtectedRoute allowedRoles={["staff"]} requiredPermission="carmasters"><CarNameMasters /></ProtectedRoute>} />
                <Route path="carcolormasters" element={<ProtectedRoute allowedRoles={["staff"]} requiredPermission="carmasters"><CarColorMasters /></ProtectedRoute>} />
                <Route path="caryearmasters" element={<ProtectedRoute allowedRoles={["staff"]} requiredPermission="carmasters"><CarYearMasters /></ProtectedRoute>} />
                <Route path="carownershipmasters" element={<ProtectedRoute allowedRoles={["staff"]} requiredPermission="carmasters"><CarOwnershipMasters /></ProtectedRoute>} />
                <Route path="carfueltypemasters" element={<ProtectedRoute allowedRoles={["staff"]} requiredPermission="carmasters"><CarFueltypeMasters /></ProtectedRoute>} />
                <Route path="carkilometermasters" element={<ProtectedRoute allowedRoles={["staff"]} requiredPermission="carmasters"><CarKilometerMasters /></ProtectedRoute>} />


                <Route path="bikebrandmasters" element={<ProtectedRoute allowedRoles={["staff"]} requiredPermission="bikemasters"><BikeBrandMasters /></ProtectedRoute>} />
                <Route path="bikenamemasters" element={<ProtectedRoute allowedRoles={["staff"]} requiredPermission="bikemasters"><BikeNameMasters /></ProtectedRoute>} />
                <Route path="bikefueltypemasters" element={<ProtectedRoute allowedRoles={["staff"]} requiredPermission="bikemasters"><BikeFueltypeMasters /></ProtectedRoute>} />
                <Route path="bikeyearmasters" element={<ProtectedRoute allowedRoles={["staff"]} requiredPermission="bikemasters"><BikeYearMasters /></ProtectedRoute>} />
                <Route path="bikekilometermasters" element={<ProtectedRoute allowedRoles={["staff"]} requiredPermission="bikemasters"><BikeKilometerMasters /></ProtectedRoute>} />
                <Route path="bikeownershipmasters" element={<ProtectedRoute allowedRoles={["staff"]} requiredPermission="bikemasters"><BikeOwnershipMasters /></ProtectedRoute>} />
                <Route path="bikecolormasters" element={<ProtectedRoute allowedRoles={["staff"]} requiredPermission="bikemasters"><BikeColorMasters /></ProtectedRoute>} />

                <Route path="ProducttypeMasters" element={<ProtectedRoute allowedRoles={["staff"]} requiredPermission="sparepartmasters"><ProducttypeMasters /></ProtectedRoute>} />
                <Route path="ConditionMasters" element={<ProtectedRoute allowedRoles={["staff"]} requiredPermission="sparepartmasters"><ConditionMasters /></ProtectedRoute>} />
                <Route path="YearofManufactureMasters" element={<ProtectedRoute allowedRoles={["staff"]} requiredPermission="sparepartmasters"><YearofManufactureMasters /></ProtectedRoute>} />




                <Route path="productlistings" element={<ProtectedRoute allowedRoles={["staff"]} requiredPermission="productlistings"><ProductListingManagement /></ProtectedRoute>} />
                <Route path="car-details/:carId" element={<ProtectedRoute allowedRoles={["staff"]} requiredPermission="productlistings"><CarDetails /></ProtectedRoute>} />
                <Route path="staffmanagement" element={<ProtectedRoute allowedRoles={["staff"]} requiredPermission="staffmanagement"><StaffManagement /></ProtectedRoute>} />
                <Route path="dealermanagment" element={<ProtectedRoute allowedRoles={["staff"]} requiredPermission="usermanagement"><DealerManagement /></ProtectedRoute>} />
                <Route path="dealerviewpage/:dealerId" element={<ProtectedRoute allowedRoles={["staff"]} requiredPermission="usermanagement"><DealerViewPage /></ProtectedRoute>} />


                <Route path="buyermanagment" element={<ProtectedRoute allowedRoles={["staff"]} requiredPermission="usermanagement"><BuyerManagement /></ProtectedRoute>} />
                <Route path="subscriptionmanagement" element={<ProtectedRoute allowedRoles={["staff"]} requiredPermission="subscription"><SubscriptionManagement /></ProtectedRoute>} />
                <Route path="subscriptionmanagement/:id/dealers" element={<ProtectedRoute allowedRoles={["staff"]} requiredPermission="subscription"><DealerListBySubscription /></ProtectedRoute>} />


                <Route path="supportticketmanagement" element={<ProtectedRoute allowedRoles={["staff"]} requiredPermission="supportticket"><SupportticketManagement /></ProtectedRoute>} />
                <Route path="supportticketmanagement/:id" element={<ProtectedRoute allowedRoles={["staff"]} requiredPermission="supportticket"><SupportticketDetails /></ProtectedRoute>} />
                <Route path="feedbackmanagement" element={<ProtectedRoute allowedRoles={["staff"]} requiredPermission="feedbackmanagement"><FeedbackManagement /></ProtectedRoute>} />

                <Route path="faqs" element={<ProtectedRoute allowedRoles={["staff"]} requiredPermission="cmsmanagement"><FAQManagement /></ProtectedRoute>} />
                <Route path="homepagebanner" element={<ProtectedRoute allowedRoles={["staff"]} requiredPermission="cmsmanagement"><HomepageBanner /></ProtectedRoute>} />
                <Route path="enquirylisting" element={<ProtectedRoute allowedRoles={["staff"]} requiredPermission="cmsmanagement"><EnquiryListing /></ProtectedRoute>} />

                <Route path="buyertutorial" element={<ProtectedRoute allowedRoles={["staff"]} requiredPermission="tutorialmanagement"><BuyerTutorialManagement /></ProtectedRoute>} />
                <Route path="dealertutorial" element={<ProtectedRoute allowedRoles={["staff"]} requiredPermission="tutorialmanagement"><DealerTutorialManagement /></ProtectedRoute>} />

                <Route path="dealerbanner" element={<ProtectedRoute allowedRoles={["staff"]} requiredPermission="banner"><DealerBannerImage /></ProtectedRoute>} />
                <Route path="buyerbanner" element={<ProtectedRoute allowedRoles={["staff"]} requiredPermission="banner"><BuyerBannerImage /></ProtectedRoute>} />


                <Route path="dealerappfaq" element={<ProtectedRoute allowedRoles={["staff"]} requiredPermission="appfaq"><DealerAppFAQ /></ProtectedRoute>} />
                <Route path="buyerappfaq" element={<ProtectedRoute allowedRoles={["staff"]} requiredPermission="appfaq"><BuyerAppFAQ /></ProtectedRoute>} />


                <Route path="termsandconditionbuyer" element={<ProtectedRoute allowedRoles={["staff"]} requiredPermission="termsandpolicy"><TermsandConditionBuyer /></ProtectedRoute>} />
                <Route path="termsandconditiondealer" element={<ProtectedRoute allowedRoles={["staff"]} requiredPermission="termsandpolicy"><TermsandConditionDealer /></ProtectedRoute>} />
                <Route path="termsandconditionwebsite" element={<ProtectedRoute allowedRoles={["staff"]} requiredPermission="termsandpolicy"><TermsandConditionWebsite /></ProtectedRoute>} />
                <Route path="privacypolicybuyer" element={<ProtectedRoute allowedRoles={["staff"]} requiredPermission="termsandpolicy"><PrivacyPolicyBuyer /></ProtectedRoute>} />
                <Route path="privacypolicydealer" element={<ProtectedRoute allowedRoles={["staff"]} requiredPermission="termsandpolicy"><PrivacyPolicyDealer /></ProtectedRoute>} />
                <Route path="privacypolicywebsite" element={<ProtectedRoute allowedRoles={["staff"]} requiredPermission="termsandpolicy"><PrivacyPolicyWebsite /></ProtectedRoute>} />


              </Route>



              {/* Super Admin Routes */}
              <Route
                path="/superadmin"
                element={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <AppLayout />
                  </ProtectedRoute>
                }
              >

                <Route path="dashboard" element={<Dashboard />} />


                <Route path="society-onboarding" element={<SocietyOnboarding />} />
                <Route path="assign-society-admin" element={<SocietyAdminManagement />} />
                <Route path="society-resident" element={<ResidentManagement />} />
                <Route path="society-staff-management" element={<SocietyStaffManagement />} />
                <Route path="society-notifications" element={<SocietyNotifications />} />
                <Route path="society-supportticket-management" element={<SocietySupportticketManagement />} />
                <Route path="society-supportticketmanagement/:id" element={<SocietySupportticketDetails />} />
                <Route path="society-feedback-management" element={<SocietyFeedbackManagement />} />




                <Route path="staffmanagement" element={<StaffManagement />} />
                <Route path="categorymasters" element={<CategoryMasters />} />
                <Route path="countrymasters" element={<CountryMasters />} />
                <Route path="statemasters" element={<StateMasters />} />
                <Route path="citymasters" element={<CityMasters />} />
                <Route path="carbrandmasters" element={<CarBrandMasters />} />
                <Route path="carnamemasters" element={<CarNameMasters />} />
                <Route path="carfueltypemasters" element={<CarFueltypeMasters />} />
                <Route path="carcolormasters" element={<CarColorMasters />} />
                <Route path="caryearmasters" element={<CarYearMasters />} />
                <Route path="carkilometermasters" element={<CarKilometerMasters />} />
                <Route path="carownershipmasters" element={<CarOwnershipMasters />} />


                <Route path="bikebrandmasters" element={<BikeBrandMasters />} />
                <Route path="bikenamemasters" element={<BikeNameMasters />} />
                <Route path="bikefueltypemasters" element={<BikeFueltypeMasters />} />
                <Route path="bikeyearmasters" element={<BikeYearMasters />} />
                <Route path="bikekilometermasters" element={<BikeKilometerMasters />} />
                <Route path="bikeownershipmasters" element={<BikeOwnershipMasters />} />
                <Route path="bikecolormasters" element={<BikeColorMasters />} />

                <Route path="producttypemasters" element={<ProducttypeMasters />} />
                <Route path="conditionmasters" element={<ConditionMasters />} />
                <Route path="yearofmfgmasters" element={<YearofManufactureMasters />} />




                <Route path="termsandconditionbuyer" element={<TermsandConditionBuyer />} />
                <Route path="termsandconditiondealer" element={<TermsandConditionDealer />} />
                <Route path="termsandconditionwebsite" element={<TermsandConditionWebsite />} />
                <Route path="privacypolicybuyer" element={<PrivacyPolicyBuyer />} />
                <Route path="privacypolicydealer" element={<PrivacyPolicyDealer />} />
                <Route path="privacypolicywebsite" element={<PrivacyPolicyWebsite />} />


                <Route path="dealermanagment" element={<DealerManagement />} />
                <Route path="dealerviewpage/:dealerId" element={<DealerViewPage />} />


                <Route path="buyermanagment" element={<BuyerManagement />} />


                <Route path="productlistings" element={<ProductListingManagement />} />
                <Route path="car-details/:carId" element={<CarDetails />} />


                <Route path="feedbackmanagement" element={<FeedbackManagement />} />
                <Route path="subscriptionmanagement" element={<SubscriptionManagement />} />
                <Route path="subscriptionmanagement/:id/dealers" element={<DealerListBySubscription />} />
                <Route path="supportticketmanagement" element={<SupportticketManagement />} />
                <Route path="supportticketmanagement/:id" element={<SupportticketDetails />} />
                <Route path="buyertutorial" element={<BuyerTutorialManagement />} />
                <Route path="dealertutorial" element={<DealerTutorialManagement />} />
                <Route path="dealerbanner" element={<DealerBannerImage />} />
                <Route path="buyerbanner" element={<BuyerBannerImage />} />


                <Route path="dealerappfaq" element={<DealerAppFAQ />} />
                <Route path="buyerappfaq" element={<BuyerAppFAQ />} />

                <Route path="faqs" element={<FAQManagement />} />
                <Route path="homepagebanner" element={<HomepageBanner />} />
                <Route path="enquirylisting" element={<EnquiryListing />} />

                <Route path="profile" element={<Profile />} />
                <Route path="notifications" element={<Notifications />} />
                <Route path="reports" element={<Reports />} />


              </Route>

              {/* Public Routes */}
              <Route path="/" element={<SignIn />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/not-authorized" element={<NotAuthorized />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </LocalizationProvider>
      </Router>
    </AuthProvider>
  );
};

export default App;
