import { configureStore } from '@reduxjs/toolkit';

import authReducer from '../store/AuthManagement/authSlice';
import CategoryMasterReducer from './Masters/CategoryMasterSlice'
import CountryMasterReducer from './Masters/CountryMasterSlice'
import StateMasterReducer from './Masters/StateMasterSlice'
import CityMasterReducer from './Masters/CityMasterSlice'
import CarBrandMasterReducer from './Masters/CarBrandMasterSlice'
import CarNameMasterReducer from './Masters/CarNameMasterSlice'
import CarFueltypeMasterReducer from './Masters/CarFueltypeMasterSlice'
import CarOwnershipMasterReducer from './Masters/CarOwnershipMasterSlice';
import CarYearMasterReducer from './Masters/CarYearMasterSlice';
import CarkilometerMasterReducer from './Masters/CarKilometerSlice'
import CarColorMasterReducer from './Masters/CarColorMasterSlice'

import BikeBrandMasterReducer from './Masters/BikeBrandMasterSlice'
import BikeNameMasterReducer from './Masters/BikeNameMasterSlice'
import BikeFueltypeMasterReducer from './Masters/BikeFueltypeMasterSlice'
import BikeOwnershipMasterReducer from './Masters/BikeOwnershipMasterSlice'
import BikeYearMasterReducer from './Masters/BikeYearMasterSlice';
import BikekilometerMasterReducer from './Masters/BikeKilometerMasterSlice'
import BikeColorMasterReducer from './Masters/BikeColorMasterSlice'
import ProducttypeMasterReducer from './Masters/ProducttypeMasterSlice';
import ConditionMasterReducer from './Masters/ConditionMasterSlice';
import BuyerTutorialmanagementReducer from './TutorialManagement/BuyerTutorialManagementSlice';
import DealerTutorialmanagementReducer from './TutorialManagement/DealerTutorialManagementSlice';
import DealerBannerReducer from './BannerImages/DealerBannerImageSlice';
import BuyerBannerReducer from './BannerImages/BuyerBannerImageSlice';
import StaffManagementReducer from './StaffManagement/StaffManagementSlice';
import SubscriptionManagementReducer from './SubscriptionManagement/SubscriptionManagementSlice';
import TermsandConditionReducer from './TermsandConditionPrivacyPolicy/TermsandConditionSlice';
import PrivacyPolicyreducer from './TermsandConditionPrivacyPolicy/PrivacyPolicySlice';
import DealerManagementReducer from './AppUserManagement/DealerManagementSlice';
import BuyerManagementReducer from './AppUserManagement/BuyerManagementslice';
import ProductListingReducer from './ProductListing/ProductListingSlice';
import YearofManufactureMasterReducer from './Masters/YearofManufactureMasterSlice';
import DealerFAQReducer from './AppFAQ/DealerAppFAQSlice';
import BuyerFAQReducer from './AppFAQ/BuyerAppFAQSlice';
import supportticketReducer from './SupportticketManagement/SupportticketManagementSlice'
import feedbackReducer from './FeedbackManagement/FeedbackManagementSlice';
import FAQManagementReducer from './CMSManagement/FAQManagementSlice'
import superAdminDashboardReducer from './SuperAdminDashboard/SperAdminDashboardSlice';
import EnquiryListingReducer from './CMSManagement/EnquiryListingSlice';
import HomepageBannerReducer from './CMSManagement/HomepageBannerSlice';


import societyReducer from "./SocietyManagement/SocietyManagementSlice";
import assignAdminReducer from "./SocietyManagement/SocietyManagementSlice";
import addResidentReducer from "./SocietyManagement/AddResidentUserSlice";
import societyStaffManagementReducer from "./SocietyStaffManagement/SocietyStaffManagementSlice";
import superAdminSocietyDashboardReducer from './SocietySuperAdminDashboard/SocietySuperAdminDashboardSlice';
import societySupportTicketReducer from './SocietySupportTicketManagement/SocietySupportTicketManagementSlice';
import societyFeedbackManagementReducer from './SocietyFeedbackManagement/SocietyFeedbackManagementSlice';


import societydashboardSlice from './SocietyAdminDashboard/societyAdminDashboardSlice';
import addadminResidentReducer from './SocietyMemberAndUnitManagement/AddResidentSlice';
import billingManagementReducer from './Billing&ChargeManagementModule/BillingSlice';
import noticesandAnnouncementReducer from './NoticesandAnnouncementManagementModule/NoticeandAnnouncementSlice';
import visitorLogsReducer from './VisitorLogModule/visitorLogsSlice';
import subAdminManagementReducer from './SubAdminManagement/SubAdminManagementSlice';



export const store = configureStore({
  reducer: {

    auth: authReducer,
    CategoryMaster: CategoryMasterReducer,
    CountryMaster: CountryMasterReducer,
    StateMaster: StateMasterReducer,
    CityMaster: CityMasterReducer,
    staff: StaffManagementReducer,
    Subscription: SubscriptionManagementReducer,
    superAdminDashboard: superAdminDashboardReducer,


    // Bike Masters
    BikeBrandMaster: BikeBrandMasterReducer,
    BikeNameMaster: BikeNameMasterReducer,
    BikeFueltypeMaster: BikeFueltypeMasterReducer,
    BikeOwnershipMaster: BikeOwnershipMasterReducer,
    BikeYearMaster: BikeYearMasterReducer,
    BikekilometerMaster: BikekilometerMasterReducer,
    BikeColorMaster: BikeColorMasterReducer,
    BikeTypeMaster: BikeNameMasterReducer,

    // Car Masters
    CarBrandMaster: CarBrandMasterReducer,
    CarNameMaster: CarNameMasterReducer,
    CarOwnershipMaster: CarOwnershipMasterReducer,
    CarFueltypeMaster: CarFueltypeMasterReducer,
    CarYearMaster: CarYearMasterReducer,
    KilometerMaster: CarkilometerMasterReducer,
    CarColorMaster: CarColorMasterReducer,
    CarTransmission: CarNameMasterReducer,

    // Spare Parts Masters
    ProducttypeMaster: ProducttypeMasterReducer,
    ConditionMaster: ConditionMasterReducer,
    YearofManufactureMaster: YearofManufactureMasterReducer,

    DealerManagement: DealerManagementReducer,
    BuyerManagement: BuyerManagementReducer,
    ProductLisiting: ProductListingReducer,
    supportticket: supportticketReducer,
    feedback: feedbackReducer,

    homepagebanner: HomepageBannerReducer,
    enquirylisting: EnquiryListingReducer,
    FAQManagement: FAQManagementReducer,
    termsandcondition: TermsandConditionReducer,
    privacypolicy: PrivacyPolicyreducer,

    Buyertutorialmanagement: BuyerTutorialmanagementReducer,
    Dealertutorialmanagement: DealerTutorialmanagementReducer,
    DealerBanner: DealerBannerReducer,
    BuyerBanner: BuyerBannerReducer,
    DealerFAQManagement: DealerFAQReducer,
    BuyerFAQManagement: BuyerFAQReducer,


    society: societyReducer,
    societyAdmin: assignAdminReducer,
    resident: addResidentReducer,
    societystaff: societyStaffManagementReducer,
    superadmindashboard: superAdminSocietyDashboardReducer,
    societysupportticket: societySupportTicketReducer,
    societyfeedback: societyFeedbackManagementReducer,


    admindashboard: societydashboardSlice,
    adminresident:  addadminResidentReducer,
    billing : billingManagementReducer,
    noticesandannouncement : noticesandAnnouncementReducer,
    visitorLogs : visitorLogsReducer,
    subadmin : subAdminManagementReducer,

  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
