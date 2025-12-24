import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { httpinstance } from "../../axios/api";
import { getActiveUser } from "../../utility/Cookies";

/* TYPES*/

export interface SocietyAdmin {
  _id: string;
  societyId: string;
  societyName?: string;
  name: string;
  email: string;
  mobile: string;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

interface AssignSocietyAdminState {
  admins: SocietyAdmin[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  loading: boolean;
  error: string | null;
}

/* INITIAL STATE */

const initialState: AssignSocietyAdminState = {
  admins: [],
  totalItems: 0,
  totalPages: 0,
  currentPage: 0,
  loading: false,
  error: null,
};

/* PAYLOADS */

export interface CreateAdminPayload {
  societyId: string;
  name: string;
  email: string;
  mobile: string;
}

export interface UpdateAdminPayload {
  _id: string;
  name: string;
  email: string;
  mobile: string;
}

/*THUNKS */

/* CREATE */
export const createSocietyAdmin = createAsyncThunk(
  "societyAdmin/create",
  async (data: CreateAdminPayload, { rejectWithValue }) => {
    try {
      const token = getActiveUser()?.accessToken;

      const res = await httpinstance.post(
        "society-admin",
        data,
        {
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        }
      );

      return res.data.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to create society admin"
      );
    }
  }
);

/* FETCH */
// export const fetchSocietyAdmins = createAsyncThunk(
//   "societyAdmin/fetch",
//   async (
//     { search = "", page = 0, limit = 10 }:
//     { search?: string; page?: number; limit?: number; },
//     { rejectWithValue }
//   ) => {
//     try {
//       const res = await httpinstance.get(
//         `society-admin?search=${search}&page=${page + 1}&limit=${limit}`
//       );

//       return {
//         data: res.data.data,
//         totalPages: res.data.pagination?.totalPages || 1,
//         currentPage: res.data.pagination?.currentPage || 1,
//         totalItems: res.data.pagination?.totalItems || 0,
//       };
//     } catch (err: any) {
//       return rejectWithValue(
//         err.response?.data?.message || "Failed to fetch society admins"
//       );
//     }
//   }
// );


export const fetchSocietyAdmins = createAsyncThunk(
  "societyAdmin/fetch",
  async (
    {
      search = "",
      page = 0,
      limit = 10,
      filters,
      fromDate,
      toDate,
      exportType,
    }: {
      search?: string;
      page?: number;
      limit?: number;
      filters?: Record<string, any>;
      fromDate?: string;
      toDate?: string;
      exportType?: "csv" | "pdf";
    },
    { rejectWithValue }
  ) => {
    try {
      const params = new URLSearchParams();

      if (search) params.append("search", search);
      if (page !== undefined) params.append("page", String(page + 1));
      if (limit) params.append("limit", String(limit));

      if (fromDate) params.append("fromDate", fromDate);
      if (toDate) params.append("toDate", toDate);

      if (exportType) params.append("exportType", exportType);

      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== "") {
            params.append(`filters[${key}]`, String(value));
          }
        });
      }

      const res = await httpinstance.get(
        `society-admin?${params.toString()}`
      );

      return {
        data: res.data.data,
        totalPages: res.data.pagination?.totalPages || 1,
        currentPage: res.data.pagination?.currentPage || 1,
        totalItems: res.data.pagination?.totalItems || 0,
      };
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch society admins"
      );
    }
  }
);


/* UPDATE */
export const updateSocietyAdmin = createAsyncThunk<
  SocietyAdmin,
  UpdateAdminPayload
>(
  "societyAdmin/update",
  async ({ _id, ...data }, { rejectWithValue }) => {
    try {
      const token = getActiveUser()?.accessToken;

      const res = await httpinstance.put(
        `society-admin/${_id}`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        }
      );

      return res.data.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to update admin"
      );
    }
  }
);

/* DELETE */
export const deleteSocietyAdmin = createAsyncThunk(
  "societyAdmin/delete",
  async (_id: string, { rejectWithValue }) => {
    try {
      await httpinstance.delete(`society-admin/${_id}`);
      return _id;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to delete admin"
      );
    }
  }
);

/* TOGGLE STATUS */
export const toggleSocietyAdminStatus = createAsyncThunk(
  "societyAdmin/toggleStatus",
  async (_id: string, { rejectWithValue }) => {
    try {
      const res = await httpinstance.patch(
        `society-admin/${_id}/toggle-status`
      );

      return {
        _id,
        isActive: res.data.data.isActive,
      };
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to toggle status"
      );
    }
  }
);

/* SLICE */

const AssignSocietyAdminSlice = createSlice({
  name: "societyAdmin",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      /* CREATE */
      .addCase(createSocietyAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createSocietyAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.admins.unshift(action.payload);
      })
      .addCase(createSocietyAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      /* FETCH */
      .addCase(fetchSocietyAdmins.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSocietyAdmins.fulfilled, (state, action) => {
        state.loading = false;
        state.admins = action.payload.data;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
        state.totalItems = action.payload.totalItems;
      })
      .addCase(fetchSocietyAdmins.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      /* UPDATE */
      .addCase(updateSocietyAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSocietyAdmin.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.admins.findIndex(
          (a) => a._id === action.payload._id
        );
        if (index !== -1) {
          state.admins[index] = action.payload;
        }
      })
      .addCase(updateSocietyAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      /* DELETE */
      .addCase(deleteSocietyAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.admins = state.admins.filter(
          (a) => a._id !== action.payload
        );
      })

      /* TOGGLE STATUS */
      .addCase(toggleSocietyAdminStatus.fulfilled, (state, action) => {
        const index = state.admins.findIndex(
          (a) => a._id === action.payload._id
        );
        if (index !== -1) {
          state.admins[index].isActive = action.payload.isActive;
        }
      });
  },
});

export default AssignSocietyAdminSlice.reducer;
