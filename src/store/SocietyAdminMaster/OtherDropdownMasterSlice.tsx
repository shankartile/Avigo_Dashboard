// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import { httpinstance } from "../../axios/api";



// export interface OtherDropdownMaster {
//   _id: string;
//   master_type: string;        // relation_type | payment_method | unit_type etc
//   name: string;               // dropdown display value
//   description?: string;
//   isActive: boolean;
// }

// type OtherDropdownMasterState = {
//   list: OtherDropdownMaster[];
//   loading: boolean;
//   error: string | null;
// };

// const initialState: OtherDropdownMasterState = {
//   list: [],
//   loading: false,
//   error: null,
// };



// export const fetchOtherDropdownMasters = createAsyncThunk<
//   OtherDropdownMaster[],
//   { master_type: string; search?: string }
// >(
//   "OtherDropdownMaster/fetch",
//   async ({ master_type, search = "" }, { rejectWithValue }) => {
//     try {
//       const res = await httpinstance.get(
//         `society/other-dropdown/getdata?master_type=${master_type}&search=${search}`
//       );
//       return res.data.data;
//     } catch (err: any) {
//       return rejectWithValue(
//         err.response?.data?.message || "Failed to fetch dropdown data"
//       );
//     }
//   }
// );



// export const addOtherDropdownMaster = createAsyncThunk<
//   OtherDropdownMaster,
//   { master_type: string; name: string; description?: string }
// >(
//   "OtherDropdownMaster/add",
//   async (payload, { rejectWithValue }) => {
//     try {
//       const res = await httpinstance.post(
//         "society/other-dropdown/add",
//         payload,
//         { headers: { "Content-Type": "application/json" } }
//       );
//       return res.data.data;
//     } catch (err: any) {
//       return rejectWithValue(
//         err.response?.data?.message || "Failed to add dropdown value"
//       );
//     }
//   }
// );



// export const updateOtherDropdownMaster = createAsyncThunk<
//   OtherDropdownMaster,
//   { _id: string; name: string; description?: string }
// >(
//   "OtherDropdownMaster/update",
//   async ({ _id, ...payload }, { rejectWithValue }) => {
//     try {
//       const res = await httpinstance.put(
//         `society/other-dropdown/${_id}/update`,
//         payload,
//         { headers: { "Content-Type": "application/json" } }
//       );
//       return res.data.data;
//     } catch (err: any) {
//       return rejectWithValue(
//         err.response?.data?.message || "Failed to update dropdown value"
//       );
//     }
//   }
// );



// export const toggleOtherDropdownMasterStatus = createAsyncThunk<
//   OtherDropdownMaster,
//   { _id: string; isActive: boolean }
// >(
//   "OtherDropdownMaster/toggleStatus",
//   async ({ _id, isActive }, { rejectWithValue }) => {
//     try {
//       const res = await httpinstance.put(
//         `society/other-dropdown/${_id}/isactive`,
//         { isActive }
//       );
//       return res.data.data;
//     } catch (err: any) {
//       return rejectWithValue(
//         err.response?.data?.message || "Failed to toggle status"
//       );
//     }
//   }
// );



// export const deleteOtherDropdownMaster = createAsyncThunk<
//   string,
//   string
// >(
//   "OtherDropdownMaster/delete",
//   async (_id, { rejectWithValue }) => {
//     try {
//       await httpinstance.put(
//         `society/other-dropdown/${_id}/isdelete`,
//         { isDeleted: true }
//       );
//       return _id;
//     } catch (err: any) {
//       return rejectWithValue(
//         err.response?.data?.message || "Failed to delete dropdown value"
//       );
//     }
//   }
// );



// const OtherDropdownMasterSlice = createSlice({
//   name: "OtherDropdownMaster",
//   initialState,
//   reducers: {},
//   extraReducers: builder => {
//     builder

//       /* FETCH */
//       .addCase(fetchOtherDropdownMasters.pending, state => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchOtherDropdownMasters.fulfilled, (state, action) => {
//         state.loading = false;
//         state.list = action.payload;
//       })
//       .addCase(fetchOtherDropdownMasters.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string;
//       })

//       /* ADD */
//       .addCase(addOtherDropdownMaster.pending, state => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(addOtherDropdownMaster.fulfilled, (state, action) => {
//         state.loading = false;
//         state.list.push(action.payload);
//       })
//       .addCase(addOtherDropdownMaster.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string;
//       })

//       /* UPDATE */
//       .addCase(updateOtherDropdownMaster.pending, state => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(updateOtherDropdownMaster.fulfilled, (state, action) => {
//         state.loading = false;
//         const index = state.list.findIndex(
//           item => item._id === action.payload._id
//         );
//         if (index !== -1) {
//           state.list[index] = action.payload;
//         }
//       })
//       .addCase(updateOtherDropdownMaster.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string;
//       })

//       /* TOGGLE */
//       .addCase(toggleOtherDropdownMasterStatus.fulfilled, (state, action) => {
//         const index = state.list.findIndex(
//           item => item._id === action.payload._id
//         );
//         if (index !== -1) {
//           state.list[index] = action.payload;
//         }
//       })

//       /* DELETE */
//       .addCase(deleteOtherDropdownMaster.fulfilled, (state, action) => {
//         state.list = state.list.filter(
//           item => item._id !== action.payload
//         );
//       });
//   },
// });

// export default OtherDropdownMasterSlice.reducer;




import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// ❌ API disabled for now
// import { httpinstance } from "../../axios/api";

/* ================= TYPES ================= */

export interface OtherDropdownMaster {
  _id: string;
  master_type: string;        // relation_type | payment_method | unit_type etc
  name: string;               // dropdown display value
  description?: string;
  isActive: boolean;
}

type OtherDropdownMasterState = {
  list: OtherDropdownMaster[];
  loading: boolean;
  error: string | null;
};

/* ================= DUMMY DATA ================= */

const dummyData: OtherDropdownMaster[] = [
  {
    _id: "1",
    master_type: "relation_type",
    name: "Owner",
    description: "Flat Owner",
    isActive: true,
  },
  {
    _id: "2",
    master_type: "relation_type",
    name: "Tenant",
    description: "Rented Resident",
    isActive: true,
  },
  {
    _id: "3",
    master_type: "payment_method",
    name: "UPI",
    description: "Online Payment",
    isActive: true,
  },
  {
    _id: "4",
    master_type: "payment_method",
    name: "Cash",
    description: "Cash Payment",
    isActive: false,
  },
  {
    _id: "5",
    master_type: "unit_type",
    name: "2 BHK",
    description: "Two Bedroom Hall Kitchen",
    isActive: true,
  },
];

/* ================= INITIAL STATE ================= */

const initialState: OtherDropdownMasterState = {
  list: dummyData, // 👈 dummy data loaded here
  loading: false,
  error: null,
};

/* ================= FETCH (DUMMY) ================= */

export const fetchOtherDropdownMasters = createAsyncThunk<
  OtherDropdownMaster[],
  { master_type: string; search?: string }
>(
  "OtherDropdownMaster/fetch",
  async ({ master_type, search = "" }) => {
    // simulate API delay
    await new Promise(res => setTimeout(res, 300));

    return dummyData.filter(
      item =>
        item.master_type === master_type &&
        item.name.toLowerCase().includes(search.toLowerCase())
    );
  }
);

/* ================= ADD (DUMMY) ================= */

export const addOtherDropdownMaster = createAsyncThunk<
  OtherDropdownMaster,
  { master_type: string; name: string; description?: string }
>(
  "OtherDropdownMaster/add",
  async payload => {
    await new Promise(res => setTimeout(res, 300));

    return {
      _id: Date.now().toString(),
      master_type: payload.master_type,
      name: payload.name,
      description: payload.description,
      isActive: true,
    };
  }
);

/* ================= UPDATE (DUMMY) ================= */

export const updateOtherDropdownMaster = createAsyncThunk<
  OtherDropdownMaster,
  { _id: string; name: string; description?: string }
>(
  "OtherDropdownMaster/update",
  async payload => {
    await new Promise(res => setTimeout(res, 300));

    return {
      _id: payload._id,
      name: payload.name,
      description: payload.description,
    } as OtherDropdownMaster;
  }
);


/* ================= TOGGLE (DUMMY) ================= */

export const toggleOtherDropdownMasterStatus = createAsyncThunk<
  OtherDropdownMaster,
  { _id: string; isActive: boolean }
>(
  "OtherDropdownMaster/toggleStatus",
  async payload => {
    await new Promise(res => setTimeout(res, 300));

    return payload as any;
  }
);


/* ================= DELETE (DUMMY) ================= */

export const deleteOtherDropdownMaster = createAsyncThunk<
  string,
  string
>(
  "OtherDropdownMaster/delete",
  async _id => {
    await new Promise(res => setTimeout(res, 300));
    return _id;
  }
);

/* ================= SLICE ================= */

const OtherDropdownMasterSlice = createSlice({
  name: "OtherDropdownMaster",
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder

      /* FETCH */
      .addCase(fetchOtherDropdownMasters.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOtherDropdownMasters.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchOtherDropdownMasters.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || null;
      })

      /* ADD */
      .addCase(addOtherDropdownMaster.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })

      /* UPDATE */
      .addCase(updateOtherDropdownMaster.fulfilled, (state, action) => {
        const index = state.list.findIndex(i => i._id === action.payload._id);
        if (index !== -1) {
          state.list[index] = {
            ...state.list[index],
            ...action.payload,
          };
        }
      })

      /* TOGGLE */
      .addCase(toggleOtherDropdownMasterStatus.fulfilled, (state, action) => {
        const index = state.list.findIndex(i => i._id === action.payload._id);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
      })

      /* DELETE */
      .addCase(deleteOtherDropdownMaster.fulfilled, (state, action) => {
        state.list = state.list.filter(i => i._id !== action.payload);
      });
  },
});

export default OtherDropdownMasterSlice.reducer;
