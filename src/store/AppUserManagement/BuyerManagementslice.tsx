import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { httpinstance } from '../../axios/api';

type BuyerState = {
  BuyerManagement: BuyerManagement[];
  buyerData: BuyerManagement | null;

  totalItems: number;
  totalPages: number;
  currentPage: number;
  loading: boolean;
  error: string | null;
};



interface BuyerManagement {
  _id: string;
  name?: string;
  email: string;
  phone: string;
  createdAt: string;
  updatedAt: string;
  cityName: string;
  category_name: string[];
  is_verified: boolean;
  is_profile_completed: boolean;
  isActive: boolean;
  isDelete: boolean;
}


export interface updateBuyerProfilePayload {

}

export interface updateBuyerProfilePayload {
  _id: string;
  name?: string;
  phone?: string;
  cityName?: string;
  category_name?: string[];
}

const initialState: BuyerState = {
  BuyerManagement: [],
  buyerData: null,
  totalItems: 0,
  totalPages: 0,
  currentPage: 0,
  loading: false,
  error: null,
};

export const fetchBuyer = createAsyncThunk(
  'Buyer/fetchBuyer',
  async (
    {
      search = '',
      filters = {},
      page = 0,
      limit = 10,
      fromDate = '',
      toDate = '',
      exportType,
    }: {
      filters?: Record<string, any>;
      search?: string;
      page?: number;
      limit?: number;
      fromDate?: string;
      toDate?: string;
      exportType?: 'csv' | 'pdf';
    },
    { rejectWithValue }
  ) => {
    try {
      const params: any = {
        page: page + 1,
        limit,
        fromDate,
        search,
        toDate,
        ...filters, // spread all filters as query params
      };
      if (exportType) {
        const exportRes = await httpinstance.get('buyer/buyerRoute/get-all-buyers', {
          params: {
            ...params, exportType,
          },
        });

        const fileUrl = exportRes.data?.data?.downloadUrls?.[exportType];
        if (fileUrl) {
          const link = document.createElement('a');
          link.href = fileUrl;
          link.target = '_blank';
          link.setAttribute('download', `buyer-export.${exportType}`);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      }

      const response = await httpinstance.get('buyer/buyerRoute/get-all-buyers', {
        params: {
          search,
          page: page + 1,
          limit,
          fromDate,
          toDate,
          ...filters,
        },
      });

      const payload = response.data;

      return {
        data: payload.data,
        totalItems: payload.pagination?.totalItems ?? 0,
        totalPages: payload.pagination?.totalPages ?? 0,
        currentPage: payload.pagination?.currentPage ?? 0,
      };

    } catch (error: any) {
      console.error('Buyer fetch/export error:', error.response?.data || error.message);
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch buyer data');
    }
  }
);


export const updateBuyerProfile = createAsyncThunk<BuyerManagement, updateBuyerProfilePayload>(
  'BuyerManagement/updateBuyerProfile',
  async ({ _id, ...formData }, { rejectWithValue }) => {
    try {
      const response = await httpinstance.put(
        `buyer/buyerRoute/updateprofile/${_id}`,
        formData,
        { headers: { 'Content-Type': 'application/json' } }
      );
      return response.data.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to update Buyer profile');
    }
  }
);


//   Delete User
export const deleteBuyer = createAsyncThunk(
  'Buyer/deleteBuyer',
  async (_id: string, { rejectWithValue }) => {
    try {
      await httpinstance.put(`buyer/buyerRoute/${_id}/isdelete`,);
      return _id;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to delete Buyer');
    }
  }
);


//  Toggle User Active/Inactive
export const toggleBuyerStatus = createAsyncThunk(
  'Buyer/toggleBuyerStatus',
  async ({ _id, isActive }: { _id: string; isActive: boolean }, { rejectWithValue }) => {
    try {
      await httpinstance.put(`buyer/buyerRoute/${_id}/isactive`, { isActive: true });
      return { _id, isActive };
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to update user Buyer');
    }
  }
);



const BuyerManagementSlice = createSlice({
  name: 'Buyer',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchBuyer.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBuyer.fulfilled, (state, action) => {
        state.loading = false;
        state.BuyerManagement = action.payload.data;
        state.totalItems = action.payload.totalItems;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
      })


      .addCase(fetchBuyer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(updateBuyerProfile.pending, state => {
        state.loading = true;
        state.error = null;
      })


      .addCase(updateBuyerProfile.rejected, (state, action) => {
        console.error("Update Error", action.payload);
        state.loading = false;
        state.error = action.payload as string;
      })


      // Handle user deletion
      .addCase(deleteBuyer.fulfilled, (state, action) => {
        state.BuyerManagement = state.BuyerManagement.filter(user => user._id !== action.payload);
      })

      // Handle active/inactive toggle
      .addCase(toggleBuyerStatus.fulfilled, (state, action) => {
        const index = state.BuyerManagement.findIndex(user => user._id === action.payload._id);
        if (index !== -1) {
          state.BuyerManagement[index].isActive = action.payload.isActive;
        }
      });


  },
});

export default BuyerManagementSlice.reducer;