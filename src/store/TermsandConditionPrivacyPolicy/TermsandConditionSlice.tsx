import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { httpinstance } from '../../axios/api';

export const fetchBuyerTerms = createAsyncThunk(
  'buyerTerms/fetchBuyerTerms',
  async (_, { rejectWithValue }) => {
    try {
      const response = await httpinstance.get('cms/buyertcRoutes/');
      return response.data.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch');
    }
  }
);

export const updateBuyerTerms = createAsyncThunk(
  'buyerTerms/updateBuyerTerms',
  async (
    { id, payload }: { id: string; payload: { title: string; description: string } },
    { rejectWithValue }
  ) => {
    try {
      const response = await httpinstance.put(`cms/buyertcRoutes/${id}`, payload);
      return response.data.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Update failed');
    }
  }
);


export const fetchDealerTerms = createAsyncThunk(
  'DealerTerms/fetchDealerTerms',
  async (_, { rejectWithValue }) => {
    try {
      const response = await httpinstance.get('cms/dealertcRoutes/');
      return response.data.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch');
    }
  }
);

export const updateDealerTerms = createAsyncThunk(
  'DealerTerms/updateDealerTerms',
  async (
    { id, payload }: { id: string; payload: { title: string; description: string } },
    { rejectWithValue }
  ) => {
    try {
      const response = await httpinstance.put(`cms/dealertcRoutes/${id}`, payload);
      return response.data.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Update failed');
    }
  }
);




export const fetchwebsiteTerms = createAsyncThunk(
  'websiteTerms/fetchwebsiteTerms',
  async (_, { rejectWithValue }) => {
    try {
      const response = await httpinstance.get('cms/cmstcRoutes/');
      return response.data.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch');
    }
  }
);

export const updatewebsiteTerms = createAsyncThunk(
  'websiteTerms/updatewebsiteTerms',
  async (
    { id, payload }: { id: string; payload: { title: string; description: string } },
    { rejectWithValue }
  ) => {
    try {
      const response = await httpinstance.put(`cms/cmstcRoutes/${id}`, payload);
      return response.data.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Update failed');
    }
  }
);





const TermsandconditionSlice = createSlice({
  name: 'termsandcondition',
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
      .addCase(fetchBuyerTerms.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchBuyerTerms.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchBuyerTerms.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateBuyerTerms.fulfilled, (state, action) => {
        state.data = action.payload;
      })


       .addCase(fetchDealerTerms.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDealerTerms.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchDealerTerms.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateDealerTerms.fulfilled, (state, action) => {
        state.data = action.payload;
      })


       .addCase(fetchwebsiteTerms.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchwebsiteTerms.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchwebsiteTerms.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updatewebsiteTerms.fulfilled, (state, action) => {
        state.data = action.payload;
      });
  },
});

export default TermsandconditionSlice.reducer;
