import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { httpinstance } from '../../axios/api';
import { getActiveUser } from '../../utility/Cookies';

interface FAQManagement {
  _id: string;
  question: string;
  answer: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  isDeleted: boolean;
}

interface FAQManagementState {
  FAQManagement: FAQManagement[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  loading: boolean;
  error: string | null;
}

const initialState: FAQManagementState = {
  FAQManagement: [],
  totalItems: 0,
  totalPages: 0,
  currentPage: 0,
  loading: false,
  error: null,
};

// --- Payload Interfaces ---
export interface AddFAQManagementPayload {
  question: string;
  answer: string;
}

export interface UpdateFAQManagementPayload {
  _id: string;
  question: string;
  answer: string;

}

// --- Thunks ---

// Create FAQ
export const createFAQManagement = createAsyncThunk(
  'faqManagement/createFAQManagement',
  async (data: AddFAQManagementPayload, { rejectWithValue }) => {
    try {
      const token = getActiveUser()?.accessToken;
      const response = await httpinstance.post('/cms/faqRoutes/', data, {
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
  'faqManagement/fetchFAQManagement',
  async (
    { search = '', page = 0, limit = 10 }: { search?: string; page?: number; limit?: number },
    { rejectWithValue }
  ) => {
    try {
      const response = await httpinstance.get(`/cms/faqRoutes/?search=${search}&page=${page + 1}&limit=${limit}`);

      const faqmanagement = response.data.data?.faqmanagement || [];

      return {
        data: faqmanagement,
        totalPages: response.data.data.pagination?.totalPages || 1,
        currentPage: response.data.data.pagination?.currentPage || 1,
        totalItems: response.data.data.pagination?.totalItems || 0,
      };
    } catch (error: any) {
      console.error('Fetch FAQ error:', error.response?.data || error.message);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);



// Delete FAQ
export const deleteFAQManagement = createAsyncThunk(
  'faqManagement/deleteFAQManagement',
  async (_id: string, { rejectWithValue }) => {
    try {
      await httpinstance.delete(`/cms/faqRoutes/${_id}`);
      return _id;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to delete FAQ');
    }
  }
);

// Toggle Active Status
export const toggleFAQManagementStatus = createAsyncThunk(
  'faqManagement/toggleFAQManagementStatus',
  async (_id: string, { rejectWithValue }) => {
    try {
      const response = await httpinstance.patch(`/cms/faqRoutes/${_id}/toggle-active`);
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
export const updateFAQManagement = createAsyncThunk<FAQManagement, UpdateFAQManagementPayload>(
  'faqManagement/updateFAQManagement',
  async ({ _id, ...formData }, { rejectWithValue }) => {
    try {
      const token = getActiveUser()?.accessToken;
      const response = await httpinstance.put(
        `/cms/faqRoutes/${_id}`,
        formData,
        {
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        }
      );
      return response.data.data as FAQManagement;
    } catch (err: any) {
      console.error('Update FAQ error:', err.response?.data || err.message);
      return rejectWithValue(err.response?.data?.message || 'Failed to update FAQ');
    }
  }
);

// --- Slice ---
const FAQManagementSlice = createSlice({
  name: 'faqManagement',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      // Create
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
      .addCase(updateFAQManagement.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateFAQManagement.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.FAQManagement.findIndex(item => item._id === action.payload._id);
        if (index !== -1) {
          state.FAQManagement[index] = action.payload;
        }
      })
      .addCase(updateFAQManagement.rejected, (state, action) => {
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
        state.FAQManagement = action.payload.data;
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

        if (!Array.isArray(state.FAQManagement)) {
          state.FAQManagement = []; // fallback if something broke
          return;
        }

        state.FAQManagement = state.FAQManagement.filter(
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
        const index = state.FAQManagement.findIndex(b => b._id === action.payload._id);
        if (index !== -1) {
          state.FAQManagement[index].isActive = action.payload.isActive;
        }
      })
      .addCase(toggleFAQManagementStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default FAQManagementSlice.reducer;
