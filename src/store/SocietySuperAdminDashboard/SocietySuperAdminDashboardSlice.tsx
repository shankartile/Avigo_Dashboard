import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { httpinstance } from '../../axios/api';

type DashboardSummary = {
  totalSociety: number;
  activeSociety: number;
  inactiveSociety: number;
  totalResidentUser: number;
  totalTreasurerUser: number;
  totalSecurityUser: number;
  totalSupportTickets: number;
  residentFeedback: number;
  treasurerFeedback: number;
  securityFeedback: number;
  totalEnquiry: number;


  // totalDealers: number;
  // totalBuyers: number;
  // totalListings: number;
  // totalCars: number;
  // totalBikes: number;
  // totalSpareParts: number;
  // totalLeads: number;
  // totalViews: number;
  // totalSubscribedUsers: number;
  // totalSupportTickets: number;
  // openBuyerTickets: number;
  // openDealerTickets: number;
  // buyerFeedbackCount: number;
  // dealerFeedbackCount: number;
  // categoryWiseSubscribedUsers: { count: number; category_id: string; category_name: string; }[];
  // categoryWiseLeads: { count: number; category_id: string; category_name: string; }[];
  // categoryWiseViews: { count: number; category_id: string; category_name: string; }[];
};

interface NotificationItem {
  _id: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  moduleKey: string;
  type: string; // optional, based on legacy support
  productType?: string; // optional, used for listing_submit or listing_sol
}

type DashboardState = {
  summary: DashboardSummary | null;
  Notifications: NotificationItem[];
  loadedPages: number[];
  unreadCount: number;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    pageSize: number;
  };
  productGraph: any;
  onboardUsers: any;
  citywiseUsers: any;
  societyOnboarded: any;
  applicationUsers: any;
  citywiseSociety: any;
  loading: boolean;
  error: string | null;
};

const initialState: DashboardState = {
  summary: null,
  Notifications: [],
  loadedPages: [],
  unreadCount: 0,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    pageSize: 10
  },
  productGraph: null,
  onboardUsers: null,
  citywiseUsers: null,
  societyOnboarded: null,
  applicationUsers: null,
  citywiseSociety: null,
  loading: false,
  error: null,
};

export const fetchDashboardSummary = createAsyncThunk(
  'dashboard/fetchSummary',
  async (_, { rejectWithValue }) => {
    try {
      const response = await httpinstance.get('admin/DashboardRoute/dashboard-summary');
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);


// export const fetchnotification = createAsyncThunk(
//   'dashboard/fetchnotification',
//   async ({ page = 1 }: { page?: number }, { rejectWithValue }) => {
//     try {
//       const response = await httpinstance.get(
//         `notificationroute/adminnotificatinRoute/notifications?page=${page}`
//       );

//       return {
//         notifications: response.data.data.notifications as NotificationItem[],
//         unreadCount: response.data.data.unreadCount,
//         pagination: response.data.pagination,
//         currentPage: page, // make sure we pass back which page we requested
//       };
//     } catch (error: any) {
//       return rejectWithValue(error.response?.data || error.message);
//     }
//   }
// );


export const fetchnotification = createAsyncThunk(
  'dashboard/fetchnotification',
  async (
    { page = 1, type }: { page?: number; type?: string },
    { rejectWithValue }
  ) => {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('page', page.toString());
      if (type) queryParams.append('type', type); // 👈 add type if present

      const response = await httpinstance.get(
        `notificationroute/adminnotificatinRoute/notifications?${queryParams.toString()}`
      );

      return {
        notifications: response.data.data.notifications as NotificationItem[],
        unreadCount: response.data.data.unreadCount,
        pagination: response.data.pagination,
        currentPage: page,
      };
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);



export const markNotificationAsRead = createAsyncThunk(
  'dashboard/markNotificationAsRead',
  async (_id: string, { rejectWithValue }) => {
    try {
      await httpinstance.patch(`notificationroute/adminnotificatinRoute/read-receipt/${_id}`);
      return { _id };
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to mark notification as read');
    }
  }
);

type AnalyticsParams = {
  type: string;
  fromDate?: string;
  toDate?: string;
};

export const fetchSocietyOnboardedGraph = createAsyncThunk(
  'dashboard/fetchproductgraph',
  async (params: AnalyticsParams, { rejectWithValue }) => {
    let url = `admin/analyticsRoute/listings-distribution?type=${params.type}`;
    if (params.type === 'custom' && params.fromDate && params.toDate) {
      url += `&fromDate=${params.fromDate}&toDate=${params.toDate}`;
    }
    try {
      const response = await httpinstance.get(url);
      return response.data.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchApplicationUsersGraph = createAsyncThunk(
  'dashboard/fetchonboarduser',
  async (params: AnalyticsParams, { rejectWithValue }) => {
    let url = `admin/analyticsRoute/onboarding-stats?type=${params.type}`;
    if (params.type === 'custom' && params.fromDate && params.toDate) {
      url += `&fromDate=${params.fromDate}&toDate=${params.toDate}`;
    }
    try {
      const response = await httpinstance.get(url);
      return response.data.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchCitywiseSocietyGraph = createAsyncThunk(
  'dashboard/fetchcitywiseuser',
  async (params: AnalyticsParams, { rejectWithValue }) => {
    let url = `admin/analyticsRoute/city-wise-stats?type=${params.type}`;
    if (params.type === 'custom' && params.fromDate && params.toDate) {
      url += `&fromDate=${params.fromDate}&toDate=${params.toDate}`;
    }
    try {
      const response = await httpinstance.get(url);
      return response.data.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const superAdminSocietyDashboardSlice = createSlice({
  name: 'superadmindashboard',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchDashboardSummary.pending, state => { state.loading = true; })
      .addCase(fetchDashboardSummary.fulfilled, (state, action) => {
        state.loading = false;
        state.summary = action.payload;
      })
      .addCase(fetchDashboardSummary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })


      // .addCase(fetchnotification.fulfilled, (state, action) => {
      //   state.loading = false;
      //   state.Notifications = action.payload.notifications;
      //   state.Notifications = action.payload.notifications.filter((n: any) => !n.isRead);
      //   state.unreadCount = action.payload.unreadCount;
      //   state.pagination = action.payload.pagination;
      // })

      .addCase(fetchnotification.pending, (state, action) => {
        state.loading = true; //  always set loading true, regardless of page
      })

      .addCase(fetchnotification.fulfilled, (state, action) => {
        state.loading = false;
        const page = action.payload.currentPage || 1;
        if (page === 1) {
          state.Notifications = action.payload.notifications;
        } else {
          const newItems = action.payload.notifications.filter(
            (n) => !state.Notifications.some((existing) => existing._id === n._id)
          );
          state.Notifications = [...state.Notifications, ...newItems];
        }
        state.unreadCount = action.payload.unreadCount;
        state.pagination = action.payload.pagination;
        state.loadedPages = [...(state.loadedPages || []), page];
      })

      .addCase(fetchnotification.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })


      .addCase(markNotificationAsRead.fulfilled, (state, action) => {
        const index = state.Notifications.findIndex(n => n._id === action.payload._id);
        if (index !== -1) {
          state.Notifications[index].isRead = true;
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }

      })
      .addCase(fetchSocietyOnboardedGraph.pending, state => { state.loading = true; })
      .addCase(fetchSocietyOnboardedGraph.fulfilled, (state, action) => {
        state.loading = false;
        state.productGraph = action.payload;
      })
      .addCase(fetchSocietyOnboardedGraph.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchApplicationUsersGraph.pending, state => { state.loading = true; })
      .addCase(fetchApplicationUsersGraph.fulfilled, (state, action) => {
        state.loading = false;
        state.onboardUsers = action.payload;
      })
      .addCase(fetchApplicationUsersGraph.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchCitywiseSocietyGraph.pending, state => { state.loading = true; })
      .addCase(fetchCitywiseSocietyGraph.fulfilled, (state, action) => {
        state.loading = false;
        state.citywiseUsers = action.payload;
      })
      .addCase(fetchCitywiseSocietyGraph.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default superAdminSocietyDashboardSlice.reducer;
