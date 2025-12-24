import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { httpinstance } from "../../axios/api";

export interface Society {
  _id: string;
  societyName: string;
  state: string;
  city: string;
  address: string;
  totalWings: number;
  floorsPerWing: number;
  flatsPerFloor: number;
  adminName?: string;
  adminEmail?: string;
  adminPhone?: string;
  isActive: boolean;
  createdAt: string;
}

interface SocietyState {
  societies: Society[];
  totalItems: number;
  loading: boolean;
}

const initialState: SocietyState = {
  societies: [],
  totalItems: 0,
  loading: false,
};

/* THUNKS*/
export const addSocieties = createAsyncThunk(
  "society/add",
  async (payload: any) => {
    const res = await httpinstance.post("/society/add", payload);
    return res.data;
  }
);

export const updateSocieties = createAsyncThunk(
  "society/update",
  async (payload: any) => {
    const res = await httpinstance.put("/society/update", payload);
    return res.data;
  }
);

export const togglesocietyStatus = createAsyncThunk(
  'society/togglesocietyStatus',
  async ({ _id, isActive }: { _id: string; isActive: boolean }, { rejectWithValue }) => {
    try {
      await httpinstance.put(`society/update/${_id}/isactive`, { isActive: true });
      return { _id, isActive };
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to update society');
    }
  }
);

export const fetchSocieties = createAsyncThunk(
  "society/fetch",
  async (payload: any) => {
    const res = await httpinstance.post("/society/list", payload);
    return res.data;
  }
);

export const deleteSociety = createAsyncThunk(
  "society/delete",
  async (id: string) => {
    await httpinstance.delete(`/society/${id}`);
    return id;
  }
);


export const assignSocietyAdmin = createAsyncThunk(
  "society/assignAdmin",
  async (
    payload: {
      societyId: string;
      adminName: string;
      adminEmail: string;
      adminPhone: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const res = await httpinstance.put(
        `/society/${payload.societyId}/assign-admin`,
        payload
      );
      return res.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to assign society admin"
      );
    }
  }
);


/* SLICE*/
const SocietySlice = createSlice({
  name: "society",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSocieties.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSocieties.fulfilled, (state, action) => {
        state.loading = false;
        state.societies = action.payload.data || [];
        state.totalItems = action.payload.totalItems || 0;
      })
      .addCase(fetchSocieties.rejected, (state) => {
        state.loading = false;
      })
      .addCase(togglesocietyStatus.fulfilled, (state, action) => {
        const index = state.societies.findIndex(user => user._id === action.payload._id);
        if (index !== -1) {
          state.societies[index].isActive = action.payload.isActive;
        }
      })
      .addCase(assignSocietyAdmin.fulfilled, (state, action) => {
        const updatedSociety = action.payload.data;
        const index = state.societies.findIndex(
          (s) => s._id === updatedSociety._id
        );

        if (index !== -1) {
          state.societies[index] = {
            ...state.societies[index],
            adminName: updatedSociety.adminName,
            adminEmail: updatedSociety.adminEmail,
            adminPhone: updatedSociety.adminPhone,
          };
        }
      })
      .addCase(deleteSociety.fulfilled, (state, action) => {
        state.societies = state.societies.filter(
          (s) => s._id !== action.payload
        );
      });

},
});

export default SocietySlice.reducer;
