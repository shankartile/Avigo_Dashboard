import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { httpinstance } from '../../axios/api';
import { getActiveUser } from '../../utility/Cookies';

interface BuyerFAQManagement {
  _id: string;
  question: string;
  answer: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  isDeleted: boolean;
}

interface BuyerFAQManagementState {
  BuyerFAQManagement: BuyerFAQManagement[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  loading: boolean;
  error: string | null;
}

const initialState: BuyerFAQManagementState = {
  BuyerFAQManagement: [],
  totalItems: 0,
  totalPages: 0,
  currentPage: 0,
  loading: false,
  error: null,
};

// --- Payload Interfaces ---
export interface AddBuyerFAQManagementPayload {
  question: string;
  answer: string;
}

export interface UpdateBuyerFAQManagementPayload {
  _id: string;
  question: string;
  answer: string;

}

// --- Thunks ---

// Create FAQ
export const createFAQManagement = createAsyncThunk(
  'buyerfaqManagement/createFAQManagement',
  async (data: AddBuyerFAQManagementPayload, { rejectWithValue }) => {
    try {
      const token = getActiveUser()?.accessToken;
      const response = await httpinstance.post('buyer/faqRoutes', data, {
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      return response.data.data;
    } catch (error: any) {
      console.error('Error response:', error.response); // <- Keep this for debugging
      return rejectWithValue(error.response?.data?.message || 'Failed to create FAQ');
    }
  }
);


// Fetch FAQ
export const fetchFAQManagement = createAsyncThunk(
  'buyerfaqManagement/fetchFAQManagement',
  async (
    { search = '', page = 0, limit = 10 }: { search?: string; page?: number; limit?: number },
    { rejectWithValue }
  ) => {
    try {
      const response = await httpinstance.get(`buyer/faqRoutes?search=${search}&page=${page + 1}&limit=${limit}`);


      return {
        data: response.data.data,
        totalPages: response.data.pagination?.totalPages || 1,
        currentPage: response.data.pagination?.currentPage || 1,
        totalItems: response.data.pagination?.totalItems || 0,
      };

    } catch (error: any) {
      console.error('Fetch FAQ error:', error.response?.data || error.message);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);



// Delete FAQ
export const deleteFAQManagement = createAsyncThunk(
  'buyerfaqManagement/deleteFAQManagement',
  async (_id: string, { rejectWithValue }) => {
    try {
      await httpinstance.delete(`buyer/faqRoutes/${_id}`);
      return _id;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to delete FAQ');
    }
  }
);

// Toggle Active Status
export const toggleFAQManagementStatus = createAsyncThunk(
  'buyerfaqManagement/toggleFAQManagementStatus',
  async (_id: string, { rejectWithValue }) => {
    try {
      const response = await httpinstance.patch(`buyer/faqRoutes${_id}/toggle-active`);
      return {
        _id,
        isActive: response.data.data.isActive,
      };
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to toggle FAQ status');
    }
  }
);

// Update FAQ
export const updateBuyerFAQManagement = createAsyncThunk<BuyerFAQManagement, UpdateBuyerFAQManagementPayload>(
  'buyerfaqManagement/updateBuyerFAQManagement',
  async ({ _id, ...formData }, { rejectWithValue }) => {
    try {
      const token = getActiveUser()?.accessToken;
      const response = await httpinstance.put(
        `buyer/faqRoutes/${_id}`,
        formData,
        {
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        }
      );
      return response.data.data as BuyerFAQManagement;
    } catch (err: any) {
      console.error('Update FAQ error:', err.response?.data || err.message);
      return rejectWithValue(err.response?.data?.message || 'Failed to update FAQ');
    }
  }
);



// --- Slice ---
const BuyerFAQManagementSlice = createSlice({
  name: 'buyerfaqManagement',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(createFAQManagement.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createFAQManagement.fulfilled, (state, action) => {
        state.loading = false;
      })

      .addCase(createFAQManagement.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Update
      .addCase(updateBuyerFAQManagement.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBuyerFAQManagement.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.BuyerFAQManagement.findIndex(item => item._id === action.payload._id);
        if (index !== -1) {
          state.BuyerFAQManagement[index] = action.payload;
        }
      })
      .addCase(updateBuyerFAQManagement.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })


      // Fetch
      .addCase(fetchFAQManagement.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFAQManagement.fulfilled, (state, action) => {
        state.loading = false;
        state.BuyerFAQManagement = action.payload.data.faqs;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
        state.totalItems = action.payload.totalItems;
      })
      .addCase(fetchFAQManagement.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Delete
      .addCase(deleteFAQManagement.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteFAQManagement.fulfilled, (state, action) => {
        state.loading = false;

        if (!Array.isArray(state.BuyerFAQManagement)) {
          state.BuyerFAQManagement = []; // fallback if something broke
          return;
        }

        state.BuyerFAQManagement = state.BuyerFAQManagement.filter(
          (b) => b._id !== action.payload
        );
      })
      .addCase(deleteFAQManagement.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Toggle Status
      .addCase(toggleFAQManagementStatus.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(toggleFAQManagementStatus.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.BuyerFAQManagement.findIndex(b => b._id === action.payload._id);
        if (index !== -1) {
          state.BuyerFAQManagement[index].isActive = action.payload.isActive;
        }
      })
      .addCase(toggleFAQManagementStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default BuyerFAQManagementSlice.reducer;
