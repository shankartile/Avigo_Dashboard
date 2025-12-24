import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { httpinstance } from "../../axios/api";
import { getActiveUser } from "../../utility/Cookies";

/* TYPES */

export interface ResidentUser {
  _id: string;
  societyId: string;
  flatId?: string;

  residentName: string;
  residentType: "Owner" | "Tenant";
  flatType: "1RK" | "1BHK" | "2BHK" | "3BHK" | "4BHK" | "5BHK" | "6BHK";
  flatSizeSqFt: number;

  mobile: string;
  email: string;

  secondaryResidentName?: string;
  secondaryResidentMobile?: string;
  secondaryResidentEmail?: string;

  isActive: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ResidentUserState {
  residents: ResidentUser[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  loading: boolean;
  error: string | null;
}

/* INITIAL STATE*/

const initialState: ResidentUserState = {
  residents: [],
  totalItems: 0,
  totalPages: 0,
  currentPage: 0,
  loading: false,
  error: null,
};

/*  PAYLOADS */

export interface CreateResidentPayload {
  societyId: string;

  residentName: string;
  residentType: "Owner" | "Tenant";
  flatType: "1RK" | "1BHK" | "2BHK" | "3BHK" | "4BHK" | "5BHK" | "6BHK";
  flatSizeSqFt: number;

  mobile: string;
  email: string;

  secondaryResidentName?: string;
  secondaryResidentMobile?: string;
  secondaryResidentEmail?: string;
}

export interface UpdateResidentPayload extends CreateResidentPayload {
  _id: string;
}

/* THUNKS */

/* CREATE RESIDENT */
export const createResidentUser = createAsyncThunk(
  "resident/create",
  async (data: CreateResidentPayload, { rejectWithValue }) => {
    try {
      const token = getActiveUser()?.accessToken;

      const res = await httpinstance.post(
        "resident",
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
        err.response?.data?.message || "Failed to create resident"
      );
    }
  }
);

/* FETCH RESIDENTS */
export const fetchResidentUsers = createAsyncThunk(
  "resident/fetch",
  async (
    {
      societyId,
      search = "",
      page = 0,
      limit = 10,
    }: {
      societyId: string;
      search?: string;
      page?: number;
      limit?: number;
    },
    { rejectWithValue }
  ) => {
    try {
      const res = await httpinstance.get(
        `resident?societyId=${societyId}&search=${search}&page=${page + 1}&limit=${limit}`
      );

      return {
        data: res.data.data,
        totalPages: res.data.pagination?.totalPages || 1,
        currentPage: res.data.pagination?.currentPage || 1,
        totalItems: res.data.pagination?.totalItems || 0,
      };
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch residents"
      );
    }
  }
);

/* UPDATE RESIDENT */
export const updateResidentUser = createAsyncThunk<
  ResidentUser,
  UpdateResidentPayload
>(
  "resident/update",
  async ({ _id, ...data }, { rejectWithValue }) => {
    try {
      const token = getActiveUser()?.accessToken;

      const res = await httpinstance.put(
        `resident/${_id}`,
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
        err.response?.data?.message || "Failed to update resident"
      );
    }
  }
);

/* DELETE RESIDENT */
export const deleteResidentUser = createAsyncThunk(
  "resident/delete",
  async (_id: string, { rejectWithValue }) => {
    try {
      await httpinstance.delete(`resident/${_id}`);
      return _id;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to delete resident"
      );
    }
  }
);

/* TOGGLE RESIDENT STATUS */
export const toggleResidentUserStatus = createAsyncThunk(
  "resident/toggleStatus",
  async (_id: string, { rejectWithValue }) => {
    try {
      const res = await httpinstance.patch(
        `resident/${_id}/toggle-status`
      );

      return {
        _id,
        isActive: res.data.data.isActive,
      };
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to toggle resident status"
      );
    }
  }
);

/* SLICE */

const AddResidentUserSlice = createSlice({
  name: "resident",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      /* CREATE */
      .addCase(createResidentUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createResidentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.residents.unshift(action.payload);
      })
      .addCase(createResidentUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      /* FETCH */
      .addCase(fetchResidentUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchResidentUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.residents = action.payload.data;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
        state.totalItems = action.payload.totalItems;
      })
      .addCase(fetchResidentUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      /* UPDATE */
      .addCase(updateResidentUser.fulfilled, (state, action) => {
        const index = state.residents.findIndex(
          (r) => r._id === action.payload._id
        );
        if (index !== -1) {
          state.residents[index] = action.payload;
        }
      })

      /* DELETE */
      .addCase(deleteResidentUser.fulfilled, (state, action) => {
        state.residents = state.residents.filter(
          (r) => r._id !== action.payload
        );
      })

      /* TOGGLE STATUS */
      .addCase(toggleResidentUserStatus.fulfilled, (state, action) => {
        const index = state.residents.findIndex(
          (r) => r._id === action.payload._id
        );
        if (index !== -1) {
          state.residents[index].isActive = action.payload.isActive;
        }
      });
  },
});

export default AddResidentUserSlice.reducer;
