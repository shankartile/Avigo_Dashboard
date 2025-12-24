import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { httpinstance } from '../../axios/api';

type CategoryMasterState = {
  CategoryMaster: CategoryMaster[];

  loading: boolean;
  error: string | null;
};


interface CategoryMaster {
  _id: string;
  category: string;
}



type SubscriptionState = {
  userData: any | null;
  loading: boolean;
  error: string | null;
  totalPages: number;
  totalItems: number;
  currentPage: number;
  SubscriptionList: any[];
  _id?: string;
  CategoryMaster: CategoryMaster[];
  dealerList: any[];
  dealerTotalItems: number;
  dealerCurrentPage: number;
  dealerTotalPages: number;
  assignStatus: 'idle' | 'loading' | 'success' | 'failed';
  assignError: string | { message: string; code?: string } | null;
  assignedData: SubscriptionResponse | null;
};


export interface AddSubscriptionPayload {
  category_id: string;
  category: string;
  title: string;
  listings_allowed: string;
  validity_in_days: string;
  price: string;

}

export interface AssignSubscriptionPayload {
  dealer_id: string;
  subscription_plan_id: string;
  category_id: string,
  start_date: string;
  end_date: string;
}

export interface SubscriptionResponse {
  success?: boolean;
  _id: string;
  dealer_id: string;
  subscription_plan_id: string;
  start_date: string;
  end_date: string;
  invoice_url?: string;
  createdAt?: string;
  updatedAt?: string;
}


export interface UpdateSubscriptionPayload {
  _id: string;
  category_id: string;
  category: string;
  title: string;
  listings_allowed: string;
  validity_in_days: string;
  price: string;
}

interface DealerSubscriptionParams {
  subscriptionId?: string;
  filters?: Record<string, any>;

  search?: string;
  searchField?: string;
  page?: number;
  limit?: number;
  fromDate?: string;
  toDate?: string;
  exportType?: 'csv' | 'pdf';
}






export const fetchCategoryMaster = createAsyncThunk(
  'CategoryMaster/fetchCategoryMaster',
  async (
    { search = '', page = 0, limit = 10, exportType }: {
      search?: string; page?: number; limit?: number, exportType?: 'csv' | 'pdf';
    },
    { rejectWithValue }
  ) => {
    try {

      const response = await httpinstance.get(`admin/categoryRoute/getdata?&search=${search}&page=${page + 1}&limit=${limit}`
      );
      return {
        data: response.data.data,
        totalItems: response.data.pagination.totalItems,
        totalPages: response.data.data.pagination?.totalPages ?? 0,
        currentPage: response.data.data.pagination?.currentPage ?? 0,
      };
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);



export const fetchSubscriptionList = createAsyncThunk(
  'SubscriptionState/fetchSubscriptionList',
  async (
    { search = '', page = 0, limit = 10 }: { search?: string; page?: number; limit?: number },
    { rejectWithValue }
  ) => {
    try {

      const response = await httpinstance.get(`dealer/subscriptionplanRoute/getdata?&search=${search}&page=${page + 1}&limit=${limit}`);
      return {
        data: response.data.data,
        totalItems: response.data.pagination.totalItems,
        totalPages: response.data.data.pagination?.totalPages ?? 0,
        currentPage: response.data.data.pagination?.currentPage ?? 0,
      };
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);


export const fetchdealerlistpersubscription = createAsyncThunk(
  'SubscriptionState/fetchdealerlistpersubscription',
  async (
    {
      subscriptionId,
      search = '',
      filters = {},
      page = 0,
      limit = 10,
      fromDate = '',
      toDate = '',
      exportType,
    }: DealerSubscriptionParams,
    { rejectWithValue }
  ) => {
    try {
      const queryParams = {
        search,
        page: page + 1,
        limit,
        fromDate,
        toDate,
        exportType,
        ...filters,
      };

      // 1. Trigger export if exportType is provided
      if (exportType) {
        const exportRes = await httpinstance.get(
          `dealer/dealerSubscriptionRoute/dealer_bysubscritionid/${subscriptionId}`,
          { params: queryParams }
        );

        const fileUrl = exportRes.data?.downloadUrls?.[exportType];
        if (fileUrl) {
          const link = document.createElement('a');
          link.href = fileUrl;
          link.target = '_blank';
          link.setAttribute('download', `dealer-subscription-export.${exportType}`);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      }

      // 2. Always fetch paginated data for table
      const response = await httpinstance.get(
        `dealer/dealerSubscriptionRoute/dealer_bysubscritionid/${subscriptionId}`,
        { params: queryParams }
      );

      return {
        data: response.data.data,
        totalItems: response.data.pagination.totalItems,
        totalPages: response.data.pagination?.totalPages ?? 0,
        currentPage: response.data.pagination?.currentPage ?? 0,
      };
    } catch (error: any) {
      console.error('Dealer list fetch/export error:', error.response?.data || error.message);
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch dealer list');
    }
  }
);



export const addSubscriptionDetails = createAsyncThunk<SubscriptionState, AddSubscriptionPayload>(
  'SubscriptionState/addSubscriptionDetails',
  async (formData, { rejectWithValue }) => {
    try {
      const res = await httpinstance.post('dealer/subscriptionplanRoute/add', formData, {
        headers: { 'Content-Type': 'application/json' },
      });
      return res.data.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to add State');
    }
  }
);



export const assignsubscriptiontodealer = createAsyncThunk<
  SubscriptionResponse,
  AssignSubscriptionPayload,
  { rejectValue: { message: string; code?: string } }
>(
  'SubscriptionState/assignsubscriptiontodealer',
  async (formData, { rejectWithValue }) => {
    try {
      const res = await httpinstance.post(
        'dealer/dealerSubscriptionRoute/add-by-admin',
        formData,
        { headers: { 'Content-Type': 'application/json' } }
      );
      return res.data.data;
    } catch (err: any) {
      return rejectWithValue({
        message: err.response?.data?.message || 'Failed to assign subscription',
        code: err.response?.data?.code,
      });
    }
  }
);







// Redux thunk for updating  details
export const updateSubscriptionDetails = createAsyncThunk<SubscriptionState, UpdateSubscriptionPayload>(
  'SubscriptionState/updateSubscriptionDetails',
  async ({ _id, ...formData }, { rejectWithValue }) => {
    try {
      const response = await httpinstance.put(
        `dealer/subscriptionplanRoute/${_id}/update`,
        formData,
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );
      return response.data.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to update Subscription');
    }
  }
);


export const deleteSubscription = createAsyncThunk(
  'SubscriptionState/deleteSubscription',
  async (_id: string, { rejectWithValue }) => {
    try {
      // Sending the ID as part of the URL
      await httpinstance.put(`dealer/subscriptionplanRoute/${_id}/isdelete`, { isDeleted: true });
      return _id;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to delete State');
    }
  }
);





export const toggleSubscriptionStatus = createAsyncThunk(
  'SubscriptionState/toggleSubscriptionStatus',
  async (
    { _id, isActive }: { _id: string; isActive: boolean },
    { rejectWithValue }
  ) => {
    try {
      const res = await httpinstance.put(
        `dealer/subscriptionplanRoute/${_id}/isactive`,
        { isActive }
      );
      return res.data.data;
    } catch (err: any) {
      console.error('Toggle Status Error:', err.response?.data || err.message);
      return rejectWithValue(err.response?.data?.message || 'Failed to toggle status');
    }
  }
);

const initialState: SubscriptionState = {
  userData: null,
  loading: false,
  error: null,
  SubscriptionList: [],
  totalPages: 0,
  totalItems: 0,
  currentPage: 0,
  CategoryMaster: [],
  dealerList: [],
  dealerTotalItems: 0,
  dealerCurrentPage: 0,
  dealerTotalPages: 0,
  assignStatus: 'idle',
  assignError: null,
  assignedData: null,
};

const SubscriptionManagementSlice = createSlice({
  name: 'SubscriptionManagement',
  initialState,
  reducers: {

  },
  extraReducers: (builder) => {
    builder

      .addCase(fetchCategoryMaster.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategoryMaster.fulfilled, (state, action) => {
        state.loading = false;
        state.CategoryMaster = action.payload.data.categories;
        state.totalItems = action.payload.data.totalItems;
        state.totalPages = action.payload.data.totalPages;
        state.currentPage = action.payload.data.currentPage;
      })

      .addCase(fetchCategoryMaster.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(fetchSubscriptionList.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubscriptionList.fulfilled, (state, action) => {
        state.loading = false;
        state.SubscriptionList = action.payload.data.plans;
        state.totalItems = action.payload.totalItems;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
      })

      .addCase(fetchSubscriptionList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(fetchdealerlistpersubscription.fulfilled, (state, action) => {
        state.dealerList = action.payload.data;
        state.dealerTotalItems = action.payload.totalItems;
        state.dealerTotalPages = action.payload.totalPages;
        state.dealerCurrentPage = action.payload.currentPage;
      })


      .addCase(assignsubscriptiontodealer.pending, (state) => {
        state.assignStatus = 'loading';
        state.assignError = null;
      })
      .addCase(assignsubscriptiontodealer.fulfilled, (state, action) => {
        state.assignStatus = 'success';
        state.assignedData = action.payload;
      })
      .addCase(assignsubscriptiontodealer.rejected, (state, action) => {
        state.assignStatus = 'failed';
        state.assignError = action.payload || { message: 'Something went wrong' };
      })




      .addCase(addSubscriptionDetails.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addSubscriptionDetails.fulfilled, (state, action) => {
        state.SubscriptionList.push(action.payload);
      })

      .addCase(addSubscriptionDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(updateSubscriptionDetails.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSubscriptionDetails.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.SubscriptionList.findIndex(item => item._id === action.payload._id);
        if (index !== -1) {
          state.SubscriptionList[index] = action.payload;
        }
      })
      .addCase(updateSubscriptionDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })




  },
});

export default SubscriptionManagementSlice.reducer;
