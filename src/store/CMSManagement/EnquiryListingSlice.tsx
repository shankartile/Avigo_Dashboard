import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { httpinstance } from '../../axios/api';
import { getActiveUser } from '../../utility/Cookies';

interface EnquiryListing {
  _id: string;
  username: string;
  contact: string;
  message: string;
  date: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  isDeleted: boolean;
}

interface EnquiryListingState {
  enquiryListing: EnquiryListing[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  loading: boolean;
  error: string | null;
}

const initialState: EnquiryListingState = {
  enquiryListing: [],
  totalItems: 0,
  totalPages: 0,
  currentPage: 0,
  loading: false,
  error: null,
};

// --- Payload Interfaces ---
export interface AddEnquiryListingPayload {
  username: string;
  contact: string;
  message: string;
  date: string;
}

export interface UpdateEnquiryListingPayload {
  _id: string;
  username: string;
  contact: string;
  message: string;
  date: string;
}

type ThunkApiConfig = {
  rejectValue: string;
};

// --- Thunks ---

// Create Enquiry
export const createEnquiryListing = createAsyncThunk<EnquiryListing, AddEnquiryListingPayload, ThunkApiConfig>(
  'enquiryListing/createEnquiryListing',
  async (data: AddEnquiryListingPayload, { rejectWithValue }) => {
    try {
      const token = getActiveUser()?.accessToken; const formData = new FormData();

      formData.append('username', data.username);
      formData.append('contact', data.contact);
      formData.append('message', data.message);
      formData.append('date', data.date);

      const response = await httpinstance.post('/cms/enqRoutes/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create enquiry listing');
    }
  }
);



// Fetch Enquiry Listing
export const fetchEnquiryListing = createAsyncThunk(
  'enquiryListing/fetchEnquiryListing',
  async (
    {
      search = '',
      filters = {},
      page = 0,
      limit = 10,
      fromDate = '',
      toDate = '',
      type = '',
      exportType,
    }: {
      search?: string;
      filters?: Record<string, any>;
      page?: number;
      limit?: number;
      fromDate?: string;
      toDate?: string;
      type?: string;
      exportType?: 'csv' | 'pdf';
    },
    { rejectWithValue }
  ) => {
    try {
      const params: Record<string, any> = {
        search,
        ...filters, // spread all filters as query params
        page: page + 1,
        fromDate,
        toDate,
        limit,
      };

      if (exportType) {
        params.exportType = exportType;
      }

      let endpoint = '';
      if (type === 'buyer') {
        endpoint = search ? 'cms/buyerenqRoutes/' : 'cms/buyerenqRoutes/';
      } else {
        endpoint = 'cms/dealerenqRoutes/';
      }
      //  1. If export is requested, download file first
      if (exportType) {
        const exportRes = await httpinstance.get(endpoint, { params });

        const fileUrl = exportRes.data?.data?.downloadUrls?.[exportType];
        if (fileUrl) {
          const link = document.createElement('a');
          link.href = fileUrl;
          link.target = '_blank';
          link.setAttribute('download', `enquiry-export.${exportType}`);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      }

      //  2. Always fetch data for list display
      const response = await httpinstance.get(endpoint, {
        params: {
          search,
          page: page + 1,
          limit,
          fromDate,
          toDate,
          ...filters, // spread all filters as query params

        },
      });

      return {
        data: response.data.data,
        totalItems: response.data.pagination?.totalItems || 0,
        totalPages: response.data.pagination?.totalPages || 0,
        currentPage: response.data.pagination?.currentPage || 0,
      };
    } catch (error: any) {
      console.error('Enquiry fetch/export error:', error.response?.data || error.message);
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch or export enquiry list');
    }
  }
);


// Delete Banner
export const deleteEnquiryListing = createAsyncThunk(
  'enquiryListing/deleteEnquiryListing',
  async ({_id, type}: {_id: string; type:string}, { rejectWithValue }) => {
    try {
      await httpinstance.delete(`/cms/enqRoutes/${_id}`);
      return _id;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to delete enquiry');
    }
  }
);

// Toggle Active Status
export const toggleEnquiryListingStatus = createAsyncThunk(
  'enquiryListing/toggleEnquiryListingStatus',
  async (_id: string, { rejectWithValue }) => {
    try {
      const response = await httpinstance.patch(`/cms/enqRoutes/${_id}/toggle-active`);
      return {
        _id,
        isActive: response.data.data.isActive,
      };
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to toggle enqiry status');
    }
  }
);

// Update enquiry listing
export const updateEnquiryListing = createAsyncThunk(
  'enquiryListing/updateEnquiryListing',
  async (data: UpdateEnquiryListingPayload, { rejectWithValue }) => {
    try {
      const token = getActiveUser()?.accessToken;
      const formData = new FormData();

      formData.append('username', data.username);
      formData.append('contact', data.contact);
      formData.append('message', data.message);
      formData.append('date', data.date);


      const response = await httpinstance.put(`/cms/enqRoutes/${data._id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      return response.data.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to update enquiry listing');
    }
  }
);

// --- Slice ---
const EnquiryListingSlice = createSlice({
  name: 'enquiryListing',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      // Create
      .addCase(createEnquiryListing.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createEnquiryListing.fulfilled, (state, action) => {
        state.loading = false;
        state.enquiryListing?.push(action.payload);
      })
      .addCase(createEnquiryListing.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Update
      .addCase(updateEnquiryListing.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateEnquiryListing.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.enquiryListing.findIndex(b => b._id === action.payload._id);
        if (index !== -1) {
          state.enquiryListing[index] = action.payload;
        }
      })
      .addCase(updateEnquiryListing.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch
      .addCase(fetchEnquiryListing.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEnquiryListing.fulfilled, (state, action) => {
        state.loading = false;
        state.enquiryListing = action.payload.data;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
        state.totalItems = action.payload.totalItems;
      })
      .addCase(fetchEnquiryListing.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Delete
      .addCase(deleteEnquiryListing.pending, state => {
        state.loading = true;
        state.error = null;
      })


      .addCase(deleteEnquiryListing.fulfilled, (state, action) => {
        state.loading = false;
        state.enquiryListing = state.enquiryListing.filter(b => b._id !== action.payload);

      })
      .addCase(deleteEnquiryListing.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Toggle Status
      .addCase(toggleEnquiryListingStatus.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(toggleEnquiryListingStatus.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.enquiryListing.findIndex(b => b._id === action.payload._id);
        if (index !== -1) {
          state.enquiryListing[index].isActive = action.payload.isActive;
        }
      })
      .addCase(toggleEnquiryListingStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default EnquiryListingSlice.reducer;
