import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { httpinstance } from '../../axios/api';



export interface OtherDropdownNameMaster {
  _id: string;
  master_type: string;     // relation_type | payment_method | unit_type etc
  name: string;            // dropdown value
  description?: string;
  isActive: boolean;
}

type OtherDropdownNameMasterState = {
  OtherDropdownNameMaster: OtherDropdownNameMaster[];
  loading: boolean;
  error: string | null;
};

const initialState: OtherDropdownNameMasterState = {
  OtherDropdownNameMaster: [],
  loading: false,
  error: null,
};



export const fetchOtherDropdownNameMaster = createAsyncThunk(
  'OtherDropdownNameMaster/fetch',
  async (
    { master_type, search = '' }: { master_type: string; search?: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await httpinstance.get(
        `society/other-dropdown/getdata?master_type=${master_type}&search=${search}`
      );
      return res.data.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Fetch failed');
    }
  }
);



export const addOtherDropdownNameMaster = createAsyncThunk<
  OtherDropdownNameMaster,
  { master_type: string; name: string; description?: string }
>(
  'OtherDropdownNameMaster/add',
  async (payload, { rejectWithValue }) => {
    try {
      const res = await httpinstance.post(
        'society/other-dropdown/add',
        payload,
        { headers: { 'Content-Type': 'application/json' } }
      );
      return res.data.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Add failed');
    }
  }
);



export const updateOtherDropdownNameMaster = createAsyncThunk<
  OtherDropdownNameMaster,
  { _id: string; name: string; description?: string }
>(
  'OtherDropdownNameMaster/update',
  async ({ _id, ...payload }, { rejectWithValue }) => {
    try {
      const res = await httpinstance.put(
        `society/other-dropdown/${_id}/update`,
        payload,
        { headers: { 'Content-Type': 'application/json' } }
      );
      return res.data.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Update failed');
    }
  }
);



export const toggleOtherDropdownNameMasterStatus = createAsyncThunk(
  'OtherDropdownNameMaster/toggleStatus',
  async (
    { _id, isActive }: { _id: string; isActive: boolean },
    { rejectWithValue }
  ) => {
    try {
      const res = await httpinstance.put(
        `society/other-dropdown/${_id}/isactive`,
        { isActive }
      );
      return res.data.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Toggle failed');
    }
  }
);


export const deleteOtherDropdownNameMaster = createAsyncThunk(
  'OtherDropdownNameMaster/delete',
  async (_id: string, { rejectWithValue }) => {
    try {
      await httpinstance.put(
        `society/other-dropdown/${_id}/isdelete`,
        { isDeleted: true }
      );
      return _id;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Delete failed');
    }
  }
);



const OtherDropdownNameMasterSlice = createSlice({
  name: 'OtherDropdownNameMaster',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder

      /* FETCH */
      .addCase(fetchOtherDropdownNameMaster.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOtherDropdownNameMaster.fulfilled, (state, action) => {
        state.loading = false;
        state.OtherDropdownNameMaster = action.payload;
      })
      .addCase(fetchOtherDropdownNameMaster.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      /* ADD */
      .addCase(addOtherDropdownNameMaster.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addOtherDropdownNameMaster.fulfilled, (state, action) => {
        state.loading = false;
        state.OtherDropdownNameMaster.push(action.payload);
      })
      .addCase(addOtherDropdownNameMaster.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      /* UPDATE */
      .addCase(updateOtherDropdownNameMaster.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateOtherDropdownNameMaster.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.OtherDropdownNameMaster.findIndex(
          item => item._id === action.payload._id
        );
        if (index !== -1) {
          state.OtherDropdownNameMaster[index] = action.payload;
        }
      })
      .addCase(updateOtherDropdownNameMaster.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      /* TOGGLE */
      .addCase(toggleOtherDropdownNameMasterStatus.fulfilled, (state, action) => {
        const index = state.OtherDropdownNameMaster.findIndex(
          item => item._id === action.payload._id
        );
        if (index !== -1) {
          state.OtherDropdownNameMaster[index] = action.payload;
        }
      })

      /* DELETE */
      .addCase(deleteOtherDropdownNameMaster.fulfilled, (state, action) => {
        state.OtherDropdownNameMaster = state.OtherDropdownNameMaster.filter(
          item => item._id !== action.payload
        );
      });
  },
});

export default OtherDropdownNameMasterSlice.reducer;
