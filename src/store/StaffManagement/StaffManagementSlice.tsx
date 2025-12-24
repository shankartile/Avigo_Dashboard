import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { httpinstance } from '../../axios/api';

type StaffState = {
  staff: Staff[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  loading: boolean;
  error: string | null;
  permissions: { _id: string; key: string; label: string }[];
  passwordChangeStatus?: 'idle' | 'loading' | 'success' | 'error';
};



interface Staff {
  _id: string;
  name?: string;
  email: string;
  role?: string;
  phone: string;
  createdAt: string;
  updatedAt: string;
  is_verified: boolean;
  is_profile_completed: boolean;
  isActive: boolean;
  isDelete: boolean;
}

export interface AddStaffPayload {
  phone: string;
  email: string;
  password: string;
  name: string;
  permissions: { permissionId: string; allowed: boolean }[];

}

export interface updateStaffPayload {
  _id: string;
  phone: string;
  email: string;
  name: string;
  permissions: { permissionId: string; allowed: boolean }[];
}

export interface ChangePasswordPayload {
  newPassword: string;
  confirmPassword: string;
}

export interface ChangePasswordParams {
  _id: string;
  formData: ChangePasswordPayload;
}


const initialState: StaffState = {
  staff: [],
  permissions: [],
  totalItems: 0,
  totalPages: 0,
  currentPage: 0,
  loading: false,
  error: null,
  passwordChangeStatus: 'idle',
};

export const fetchStaff = createAsyncThunk(
  'staff/fetchStaff',
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
      search?: string;
      filters?: Record<string, any>;

      page?: number;
      limit?: number;
      fromDate?: string;
      toDate?: string;
      exportType?: 'csv' | 'pdf';
    },
    { rejectWithValue }
  ) => {
    try {
      //  1. If exportType exists, trigger export
      if (exportType) {
        const exportRes = await httpinstance.get('admin/staffRoutes/staff', {
          params: {
            search,
            ...filters, // spread all filters as query params

            page: page + 1,
            limit,
            fromDate,
            toDate,
            exportType,
          },
        });

        const fileUrl = exportRes.data?.data?.downloadUrls?.[exportType];
        if (fileUrl) {
          const link = document.createElement('a');
          link.href = fileUrl;
          link.target = '_blank';
          link.setAttribute('download', `staff-export.${exportType}`);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      }

      //  2. Always fetch paginated staff list for table
      const response = await httpinstance.get('admin/staffRoutes/staff', {
        params: {
          search,
          ...filters, // spread all filters as query params

          page: page + 1,
          limit,
          fromDate,
          toDate,
        },
      });

      return {
        data: response.data.data,
        totalItems: response.data.pagination.totalItems,
        totalPages: response.data.pagination?.totalPages ?? 0,
        currentPage: response.data.pagination?.currentPage ?? 0,
      };
    } catch (error: any) {
      console.error('Staff fetch/export error:', error.response?.data || error.message);
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch staff data');
    }
  }
);


export const fetchPermissions = createAsyncThunk(
  'staff/fetchPermissions',
  async (_, { rejectWithValue }) => {
    try {
      const response = await httpinstance.get('admin/permissionRoute/getdata', {
        params: {
          page: 1,
          limit: 100 // fetch all permissions or increase as needed
        }
      });
      return response.data.data.permissions;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch permissions');
    }
  }
);


export const addStaff = createAsyncThunk<Staff, AddStaffPayload>(
  'Staff/addStaff',
  async (formData, { rejectWithValue }) => {
    try {
      const res = await httpinstance.post('admin/staffRoutes/register', formData, {
        headers: { 'Content-Type': 'application/json' },
      });
      return res.data.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to add Staff');
    }
  }
);

export const updateStaff = createAsyncThunk<Staff, updateStaffPayload>(
  'staff/updateStaff',
  async ({ _id, ...formData }, { rejectWithValue }) => {
    try {
      const response = await httpinstance.put(
        `admin/staffRoutes/staff/${_id}/updateaccess`,
        formData,
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );
      return response.data.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to update Staff');
    }
  }
);



//   Delete User
export const deleteStaff = createAsyncThunk(
  'staff/deleteStaff',
  async (_id: string, { rejectWithValue }) => {
    try {
      await httpinstance.delete(`admin/staffRoutes/${_id}/isdelete`,);
      return _id;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to delete Staff');
    }
  }
);

//  Toggle User Active/Inactive
export const togglestaffStatus = createAsyncThunk(
  'staff/togglestaffStatus',
  async ({ _id, isActive }: { _id: string; isActive: boolean }, { rejectWithValue }) => {
    try {
      await httpinstance.put(`admin/staffRoutes/${_id}/isactive`, { isActive: true });
      return { _id, isActive };
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to update user Staff');
    }
  }
);

export const changeStaffPassword = createAsyncThunk<
  any, // response type
  ChangePasswordParams, // params passed to thunk
  { rejectValue: string }
>(
  'staff/changeStaffPassword',
  async ({ _id, formData }, { rejectWithValue }) => {
    try {
      const res = await httpinstance.patch(
        `admin/staffRoutes/staff/${_id}/password`,
        formData,
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );
      return res.data; // or res.data.data if API wraps response
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to change password');
    }
  }
);

const stafflice = createSlice({
  name: 'staff',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchStaff.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStaff.fulfilled, (state, action) => {
        state.loading = false;
        state.staff = action.payload.data;
        state.totalItems = action.payload.totalItems;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
      })


      .addCase(fetchStaff.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(fetchPermissions.fulfilled, (state, action) => {
        state.permissions = action.payload;
      })



      // Handle user deletion
      .addCase(deleteStaff.fulfilled, (state, action) => {
        state.staff = state.staff.filter(user => user._id !== action.payload);
      })

      // Handle active/inactive toggle
      .addCase(togglestaffStatus.fulfilled, (state, action) => {
        const index = state.staff.findIndex(user => user._id === action.payload._id);
        if (index !== -1) {
          state.staff[index].isActive = action.payload.isActive;
        }
      })

      .addCase(changeStaffPassword.pending, (state) => {
        state.loading = true;
        state.passwordChangeStatus = 'loading';
      })
      .addCase(changeStaffPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.passwordChangeStatus = 'success';
      })
      .addCase(changeStaffPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Password change failed';
        state.passwordChangeStatus = 'error';
      });
  },
});

export default stafflice.reducer;