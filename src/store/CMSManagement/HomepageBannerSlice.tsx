import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { httpinstance } from '../../axios/api';
import { getActiveUser } from '../../utility/Cookies';

interface HomepageBanner {
  _id: string;
  type: string;
  title?: string;
  shortDescription: string;
  images: string[];
  ctaLabel: string;
  ctaLink?: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  isDeleted: boolean;
}

interface HomepageBannerState {
  HomepageBanner: HomepageBanner[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  loading: boolean;
  error: string | null;
}

const initialState: HomepageBannerState = {
  HomepageBanner: [],
  totalItems: 0,
  totalPages: 0,
  currentPage: 0,
  loading: false,
  error: null,
};

// --- Payload Interfaces ---
export interface AddBannerPayload {
  title: string;
  type: string;
  images: File[]; // <-- File instead of string
  ctaLabel: string;
  ctaLink?: string;
  shortDescription: string;
}

export interface UpdateBannerPayload {
  _id: string;
  type: string;
  title: string;
  ctaLabel: string;
  ctaLink?: string;
  shortDescription: string;
  images: (File | string)[]; // new files or existing URLs
}

// --- Thunks ---



// Fetch Banners
// export const fetchHomepageBanners = createAsyncThunk(
//   'homepageBanner/fetchHomepageBanners',
//   async (
//     { search = '', page = 0, limit = 10 }: { search?: string; page?: number; limit?: number },
//     { rejectWithValue }
//   ) => {
//     try {
//       const response = await httpinstance.get(`/cms/bannerRoutes/getdata?&search=${search}&page=${page + 1}&limit=${limit}`);
//       return {
//         data: response.data.data?.banners || [],
//         totalItems: response.data.data.pagination.totalItems,
//         totalPages: response.data.data.pagination.totalPages,
//         currentPage: response.data.data.pagination.currentPage,
//       };
//     } catch (error: any) {
//       return rejectWithValue(error.response?.data || error.message);
//     }
//   }
// );

export const fetchHomepageBanners = createAsyncThunk(
  'homepageBanner/fetchHomepageBanners',
  async (
    { search = '', page = 0, limit = 10 }: { search?: string; page?: number; limit?: number },
    { rejectWithValue }
  ) => {
    try {
      const response = await httpinstance.get(
        `/cms/bannerRoutes/getdata`,
        {
          params: {
            search,
            page: page + 1,
            limit,
          },
        }
      );

      const banners = response.data.data?.banners || [];
      const pagination = response.data.pagination || {};

      return {
        data: banners,
        totalPages: pagination.totalPages || 1,
        currentPage: pagination.currentPage || 1,
        totalItems: pagination.totalItems || 0,
      };
    } catch (error: any) {
      console.error('Fetch homepage banner error:', error.response?.data || error.message);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Delete Banner
export const deleteHomepageBanner = createAsyncThunk(
  'homepageBanner/deleteHomepageBanner',
  async (_id: string, { rejectWithValue }) => {
    try {
      await httpinstance.delete(`/cms/bannerRoutes/${_id}`);
      return _id;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to delete banner');
    }
  }
);

// Toggle Active Status
export const toggleHomepageBannerStatus = createAsyncThunk(
  'homepageBanner/toggleHomepageBannerStatus',
  async (_id: string, { rejectWithValue }) => {
    try {
      const response = await httpinstance.patch(`/cms/bannerRoutes/${_id}/toggle-active`);
      return {
        _id,
        isActive: response.data.data.isActive,
      };
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to toggle banner status');
    }
  }
);



// Create Banner
export const createHomepageBanner = createAsyncThunk(
  'homepageBanner/createHomepageBanner',
  async (data: AddBannerPayload, { rejectWithValue }) => {
    try {
      const token = getActiveUser()?.accessToken;
      const formData = new FormData();

      formData.append('type', data.type);
      formData.append('title', data.title);
      formData.append('ctaLabel', data.ctaLabel);
      formData.append('shortDescription', data.shortDescription);
      if (data.ctaLink) {
        formData.append('ctaLink', data.ctaLink);
      }

      data.images.forEach((file) => {
        formData.append('images', file);
      });

      const response = await httpinstance.post('/cms/bannerRoutes/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);


// Update Banner
export const updateHomepageBanner = createAsyncThunk(
  'homepageBanner/updateHomepageBanner',
  async (data: UpdateBannerPayload, { rejectWithValue }) => {
    try {
      const token = getActiveUser()?.accessToken;
      const formData = new FormData();

      formData.append('type', data.type);
      formData.append('title', data.title);
      formData.append('ctaLabel', data.ctaLabel);
      formData.append('shortDescription', data.shortDescription);

      if (data.ctaLink) {
        formData.append('ctaLink', data.ctaLink);
      }

      data.images.forEach((img) => {
        if (img instanceof File) {
          formData.append('images', img);
        }
      });

      const response = await httpinstance.put(`/cms/bannerRoutes/${data._id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      return response.data.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to update banner');
    }
  }
);

// --- Slice ---
const HomepageBannerSlice = createSlice({
  name: 'homepageBanner',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      // Create
      .addCase(createHomepageBanner.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createHomepageBanner.fulfilled, (state, action) => {
        state.loading = false;
        state.HomepageBanner?.push(action.payload);
      })
      .addCase(createHomepageBanner.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Update
      .addCase(updateHomepageBanner.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateHomepageBanner.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.HomepageBanner.findIndex(b => b._id === action.payload._id);
        if (index !== -1) {
          state.HomepageBanner[index] = action.payload;
        }
      })
      .addCase(updateHomepageBanner.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch
      .addCase(fetchHomepageBanners.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHomepageBanners.fulfilled, (state, action) => {
        state.loading = false;
        state.HomepageBanner = action.payload.data;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
        state.totalItems = action.payload.totalItems;
      })

      .addCase(fetchHomepageBanners.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Delete
      .addCase(deleteHomepageBanner.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteHomepageBanner.fulfilled, (state, action) => {
        state.loading = false;
        state.HomepageBanner = state.HomepageBanner.filter(b => b._id !== action.payload);
      })
      .addCase(deleteHomepageBanner.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Toggle Status
      .addCase(toggleHomepageBannerStatus.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(toggleHomepageBannerStatus.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.HomepageBanner.findIndex(b => b._id === action.payload._id);
        if (index !== -1) {
          state.HomepageBanner[index].isActive = action.payload.isActive;
        }
      })
      .addCase(toggleHomepageBannerStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});
export default HomepageBannerSlice.reducer;
