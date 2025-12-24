import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { httpinstance } from '../../axios/api';

export const fetchBuyerPolicy = createAsyncThunk(
  'buyerPolicy/fetchBuyerPolicy',
  async (_, { rejectWithValue }) => {
    try {
      const response = await httpinstance.get('cms/buyerPrivacyPolicyRoutes/');
      return response.data.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch');
    }
  }
);

export const updateBuyerPolicy = createAsyncThunk(
  'buyerPolicy/updateBuyerPolicy',
  async (
    { id, payload }: { id: string; payload: { title: string; description: string } },
    { rejectWithValue }
  ) => {
    try {
      const response = await httpinstance.put(`cms/buyerPrivacyPolicyRoutes/${id}`, payload);
      return response.data.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Update failed');
    }
  }
);


export const fetchDealerPolicy = createAsyncThunk(
  'DealerPolicy/fetchDealerPolicy',
  async (_, { rejectWithValue }) => {
    try {
      const response = await httpinstance.get('cms/dealerPrivacyPolicyRoutes/');
      return response.data.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch');
    }
  }
);

export const updateDealerPolicy = createAsyncThunk(
  'DealerPolicy/updateDealerPolicy',
  async (
    { id, payload }: { id: string; payload: { title: string; description: string } },
    { rejectWithValue }
  ) => {
    try {
      const response = await httpinstance.put(`cms/dealerPrivacyPolicyRoutes/${id}`, payload);
      return response.data.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Update failed');
    }
  }
);




export const fetchwebsitePolicy = createAsyncThunk(
  'websitePolicy/fetchwebsitePolicy',
  async (_, { rejectWithValue }) => {
    try {
      const response = await httpinstance.get('cms/privacypolicyRoutes/');
      return response.data.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch');
    }
  }
);

export const updatewebsitePolicy = createAsyncThunk(
  'websitePolicy/updatewebsitePolicy',
  async (
    { id, payload }: { id: string; payload: { title: string; description: string } },
    { rejectWithValue }
  ) => {
    try {
      const response = await httpinstance.put(`cms/privacypolicyRoutes/${id}`, payload);
      return response.data.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Update failed');
    }
  }
);





const PrivacyPolicySlice = createSlice({
  name: 'privacypolicy',
  initialState: {
    data: null,
    loading: false,
    error: null,
  } as {
    data: null | { _id: string; title: string; description: string };
    loading: boolean;
    error: string | null;
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBuyerPolicy.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchBuyerPolicy.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchBuyerPolicy.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateBuyerPolicy.fulfilled, (state, action) => {
        state.data = action.payload;
      })


       .addCase(fetchDealerPolicy.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDealerPolicy.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchDealerPolicy.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateDealerPolicy.fulfilled, (state, action) => {
        state.data = action.payload;
      })


       .addCase(fetchwebsitePolicy.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchwebsitePolicy.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchwebsitePolicy.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updatewebsitePolicy.fulfilled, (state, action) => {
        state.data = action.payload;
      });
  },
});

export default PrivacyPolicySlice.reducer;
