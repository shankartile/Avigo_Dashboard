import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { httpinstance } from '../../axios/api';



// Define a type for a single feedback item (row)
export interface FeedbackItem {
  id: string;
  userName: string;
  comment: string;
  rating: number;
  userType: string;
  phone: string;
  submissionDate: string;
  isActive: boolean;
  type: string;
}

export const fetchFeedbackList = createAsyncThunk<
  {
    data: FeedbackItem[];
    totalItems: number;
    totalPages: number;
    currentPage: number;
  },
  {
    search?: string;
    searchField?: string;
    page?: number;
    limit?: number;
    fromDate?: string;
    toDate?: string;
    type?: string;
    filters?: Record<string, any>;
  }
>(
  'feedback/fetchList',
  async (
    {
      search = '',
      filters = {},
      page = 0,
      limit = 10,
      fromDate = '',
      toDate = '',
      type = '',
    },
    { rejectWithValue }
  ) => {
    try {
      let endpoint = '';

      if (type === 'webuser') {
        endpoint = search ? 'cms/feedbackRoutes/getallwebuserfeedback' : 'cms/feedbackRoutes/getallwebuserfeedback';
      } else {
        endpoint = 'cms/adminfeedbackRoutes/all';
      }

      const res = await httpinstance.get(endpoint, {
        params: {
          page: page + 1,
          search,
          ...filters, // spread all filters as query params
          limit: limit.toString(),
          fromDate,
          toDate,
        },
      });

      //  extract feedbacks array from nested `data.feedbacks`
      let responseData: any[] = [];

      if (Array.isArray(res.data?.data)) {
        responseData = res.data.data; // for getdata
      } else if (Array.isArray(res.data?.data?.feedbacks)) {
        responseData = res.data.data.feedbacks; // for getallbuyerfeedback
      }

      const pagination = res.data?.pagination || {};

      const mapped: FeedbackItem[] = responseData.map((item: any) => ({
        id: item._id,
        // userName: item.userName || 'N/A',
        comment: item.comment || '',
        rating: item.rating || 0,
        userType: item.userType || 'N/A',
        phone: item.userId?.phone || item.phone || 'N/A',
        submissionDate: item.createdAt || '',
        isActive: item.isActive || false,
        userName: item.userId?.name,
        userEmail: item.userId?.email,
        type: type || '',
      }));

      return {
        data: mapped,
        totalItems: pagination.totalItems || 0,
        totalPages: pagination.totalPages || 1,
        currentPage: pagination.currentPage || 1,
      };
    } catch (err: any) {
      console.error('Fetch error:', err.response?.data || err.message);
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch feedback');
    }
  }
);




export const exportFeedbackList = createAsyncThunk<
  void,
  {
    fromDate?: string;
    toDate?: string;
    type?: string;
    exportType: 'csv' | 'pdf';
    search?: string;
  }
>(
  'feedback/exportList',
  async (
    { fromDate = '', toDate = '', type = '', exportType, search = '' },
    { rejectWithValue }
  ) => {
    try {
      const params = {
        fromDate,
        toDate,
        exportType,
        search,
      };

      const endpoint =
        type === 'webuser'
          ? 'cms/feedbackRoutes/getallwebuserfeedback'
          : 'cms/adminfeedbackRoutes/all';

      const res = await httpinstance.get(endpoint, { params });

      const fileUrl = res.data?.data?.downloadUrls?.[exportType];
      if (fileUrl) {
        const link = document.createElement('a');
        link.href = fileUrl;
        link.target = '_blank';
        link.setAttribute('download', `feedback-export.${exportType}`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (err: any) {
      console.error('Export error:', err.response?.data || err.message);
      return rejectWithValue(err.response?.data?.message || 'Failed to export feedback');
    }
  }
);




export const deleteFeedback = createAsyncThunk(
  'feedback/delete',
  async ({ id, type }: { id: string; type: string }, { rejectWithValue }) => {
    try {
      const endpoint =
        type === 'webuser'
          ? `cms/feedbackRoutes/${id}/isdelete`
          : `cms/adminfeedbackRoutes/${id}/isdelete`;
      await httpinstance.delete(endpoint);
      return id;
    } catch (err: any) {
      console.error("Delete error:", err);
      return rejectWithValue(err.response?.data?.message || 'Failed to delete feedback');
    }
  }
);


export const toggleFeedbackActiveStatus = createAsyncThunk(
  'feedback/toggleActive',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await httpinstance.patch(`cms/feedbackRoutes/${id}/toggle-active`);
      return { id, isActive: response.data?.data?.isActive };
    } catch (err: any) {
      console.error("Toggle error:", err);
      return rejectWithValue(err.response?.data?.message || 'Failed to toggle feedback status');
    }
  }
);



interface FeedbackState {
  feedbacks: any[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  loading: boolean;
  error: string | null;
}

const initialState: FeedbackState = {
  feedbacks: [],
  totalItems: 0,
  totalPages: 0,
  currentPage: 0,
  loading: false,
  error: null,
};

const societyfeedbackSlice = createSlice({
  name: 'societyfeedback',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeedbackList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFeedbackList.fulfilled, (state, action) => {
        state.loading = false;
        state.feedbacks = action.payload.data;
        state.totalItems = action.payload.totalItems;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
      })
      .addCase(fetchFeedbackList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteFeedback.fulfilled, (state, action) => {
        state.feedbacks = state.feedbacks.filter(fb => fb.id !== action.payload);
      })
      .addCase(toggleFeedbackActiveStatus.fulfilled, (state, action) => {
        const index = state.feedbacks.findIndex(fb => fb.id === action.payload.id);
        if (index !== -1) {
          state.feedbacks[index].isActive = action.payload.isActive;
        }
      })



  },
});

export default societyfeedbackSlice.reducer;

