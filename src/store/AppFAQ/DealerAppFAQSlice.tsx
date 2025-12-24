import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { httpinstance } from '../../axios/api';
import { getActiveUser } from '../../utility/Cookies';

interface DealerFAQManagement {
  _id: string;
  question: string;
  answer: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  isDeleted: boolean;
}

interface DealerFAQManagementState {
  DealerFAQManagement: DealerFAQManagement[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  loading: boolean;
  error: string | null;
}

const initialState: DealerFAQManagementState = {
  DealerFAQManagement: [],
  totalItems: 0,
  totalPages: 0,
  currentPage: 0,
  loading: false,
  error: null,
};

// --- Payload Interfaces ---
export interface AddDealerFAQManagementPayload {
  question: string;
  answer: string;
}

export interface UpdateDealerFAQManagementPayload {
  _id: string;
  question: string;
  answer: string;

}

// --- Thunks ---

// Create FAQ
export const createDealerFAQManagement = createAsyncThunk(
  'dealerfaqManagement/createDealerFAQManagement',
  async (data: AddDealerFAQManagementPayload, { rejectWithValue }) => {
    try {
      const token = getActiveUser()?.accessToken;
      const response = await httpinstance.post('dealer/faqRoutes', data, {
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      return response.data.data;
    } catch (error: any) {
      console.error('Error response:', error.response);
      return rejectWithValue(error.response?.data?.message || 'Failed to create FAQ');
    }
  }
);


// Fetch FAQ
export const fetchDealerFAQManagement = createAsyncThunk(
  'dealerfaqManagement/fetchDealerFAQManagement',
  async (
    { search = '', page = 0, limit = 10 }: { search?: string; page?: number; limit?: number },
    { rejectWithValue }
  ) => {
    try {
      const response = await httpinstance.get(`dealer/faqRoutes?search=${search}&page=${page + 1}&limit=${limit}`);

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
export const deleteDealerFAQManagement = createAsyncThunk(
  'dealerfaqManagement/deleteDealerFAQManagement',
  async (_id: string, { rejectWithValue }) => {
    try {
      await httpinstance.delete(`dealer/faqRoutes/${_id}`);
      return _id;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to delete FAQ');
    }
  }
);

// Toggle Active Status
export const toggleDealerFAQManagementStatus = createAsyncThunk(
  'dealerfaqManagement/toggleDealerFAQManagementStatus',
  async (_id: string, { rejectWithValue }) => {
    try {
      const response = await httpinstance.patch(`dealer/faqRoutes/${_id}/toggle-active`);
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
export const updateDealerFAQManagement = createAsyncThunk<DealerFAQManagement, UpdateDealerFAQManagementPayload>(
  'dealerfaqManagement/updateDealerFAQManagement',
  async ({ _id, ...formData }, { rejectWithValue }) => {
    try {
      const token = getActiveUser()?.accessToken;
      const response = await httpinstance.put(
        `dealer/faqRoutes/${_id}`,
        formData,
        {
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        }
      );
      return response.data.data as DealerFAQManagement;
    } catch (err: any) {
      console.error('Update FAQ error:', err.response?.data || err.message);
      return rejectWithValue(err.response?.data?.message || 'Failed to update FAQ');
    }
  }
);

// --- Slice ---
const DealerFAQManagementSlice = createSlice({
  name: 'dealerfaqManagement',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      // Create
      .addCase(createDealerFAQManagement.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createDealerFAQManagement.fulfilled, (state, action) => {
        state.loading = false;
        state.DealerFAQManagement?.push(action.payload);
      })
      .addCase(createDealerFAQManagement.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Update
      .addCase(updateDealerFAQManagement.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateDealerFAQManagement.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.DealerFAQManagement.findIndex(item => item._id === action.payload._id);
        if (index !== -1) {
          state.DealerFAQManagement[index] = action.payload;
        }
      })
      .addCase(updateDealerFAQManagement.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })


      // Fetch
      .addCase(fetchDealerFAQManagement.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDealerFAQManagement.fulfilled, (state, action) => {
        state.loading = false;
        state.DealerFAQManagement = action.payload.data.faqs;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
        state.totalItems = action.payload.totalItems;
      })
      .addCase(fetchDealerFAQManagement.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Delete
      .addCase(deleteDealerFAQManagement.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteDealerFAQManagement.fulfilled, (state, action) => {
        state.loading = false;

        if (!Array.isArray(state.DealerFAQManagement)) {
          state.DealerFAQManagement = []; // fallback if something broke
          return;
        }

        state.DealerFAQManagement = state.DealerFAQManagement.filter(
          (b) => b._id !== action.payload
        );
      })
      .addCase(deleteDealerFAQManagement.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Toggle Status
      .addCase(toggleDealerFAQManagementStatus.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(toggleDealerFAQManagementStatus.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.DealerFAQManagement.findIndex(b => b._id === action.payload._id);
        if (index !== -1) {
          state.DealerFAQManagement[index].isActive = action.payload.isActive;
        }
      })
      .addCase(toggleDealerFAQManagementStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default DealerFAQManagementSlice.reducer;
