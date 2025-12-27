// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import { httpinstance } from "../../axios/api";
// import { getActiveUser } from "../../utility/Cookies";

// /* ================= TYPES ================= */

// export interface Resident {
//   _id: string;
//   societyId: string;
//   societyName?: string;

//   residentName: string;
//   residentType: string;
//   email: string;
//   mobile: string;

//   residentFlatsize: string;
//   residentFlatarea: string;
//   residentParkingname: string;

//   secondresidentName?: string;
//   secondresidentEmail?: string;
//   secondresidentMobile?: string;

//   isActive: boolean;
//   isDeleted: boolean;
//   createdAt: string;
//   updatedAt: string;
// }

// interface ResidentState {
//   residents: Resident[];
//   totalItems: number;
//   totalPages: number;
//   currentPage: number;
//   loading: boolean;
//   error: string | null;
// }

// /* ================= INITIAL STATE ================= */

// const initialState: ResidentState = {
//   residents: [],
//   totalItems: 0,
//   totalPages: 0,
//   currentPage: 0,
//   loading: false,
//   error: null,
// };

// /* ================= PAYLOADS ================= */

// export interface CreateResidentPayload {
//   societyId: string;
//   residentName: string;
//   residentType: string;
//   email: string;
//   mobile: string;
//   residentFlatsize: string;
//   residentFlatarea: string;
//   residentParkingname: string;
//   secondresidentName?: string;
//   secondresidentEmail?: string;
//   secondresidentMobile?: string;
// }

// export interface UpdateResidentPayload extends CreateResidentPayload {
//   _id: string;
// }

// /* ================= THUNKS ================= */

// /* CREATE */
// export const createResident = createAsyncThunk(
//   "resident/create",
//   async (data: CreateResidentPayload, { rejectWithValue }) => {
//     try {
//       const token = getActiveUser()?.accessToken;

//       const res = await httpinstance.post(
//         "resident",
//         data,
//         {
//           headers: {
//             "Content-Type": "application/json",
//             ...(token ? { Authorization: `Bearer ${token}` } : {}),
//           },
//         }
//       );

//       return res.data.data;
//     } catch (err: any) {
//       return rejectWithValue(
//         err.response?.data?.message || "Failed to create resident"
//       );
//     }
//   }
// );

// /* FETCH */
// export const fetchResidents = createAsyncThunk(
//   "resident/fetch",
//   async (
//     {
//       search = "",
//       page = 0,
//       limit = 10,
//       filters,
//       fromDate,
//       toDate,
//       exportType,
//     }: {
//       search?: string;
//       page?: number;
//       limit?: number;
//       filters?: Record<string, any>;
//       fromDate?: string;
//       toDate?: string;
//       exportType?: "csv" | "pdf";
//     },
//     { rejectWithValue }
//   ) => {
//     try {
//       const params = new URLSearchParams();

//       if (search) params.append("search", search);
//       if (page !== undefined) params.append("page", String(page + 1));
//       if (limit) params.append("limit", String(limit));

//       if (fromDate) params.append("fromDate", fromDate);
//       if (toDate) params.append("toDate", toDate);
//       if (exportType) params.append("exportType", exportType);

//       if (filters) {
//         Object.entries(filters).forEach(([key, value]) => {
//           if (value !== undefined && value !== "") {
//             params.append(`filters[${key}]`, String(value));
//           }
//         });
//       }

//       const res = await httpinstance.get(
//         `resident?${params.toString()}`
//       );

//       return {
//         data: res.data.data,
//         totalPages: res.data.pagination?.totalPages || 1,
//         currentPage: res.data.pagination?.currentPage || 1,
//         totalItems: res.data.pagination?.totalItems || 0,
//       };
//     } catch (err: any) {
//       return rejectWithValue(
//         err.response?.data?.message || "Failed to fetch residents"
//       );
//     }
//   }
// );

// /* UPDATE */
// export const updateResident = createAsyncThunk<
//   Resident,
//   UpdateResidentPayload
// >(
//   "resident/update",
//   async ({ _id, ...data }, { rejectWithValue }) => {
//     try {
//       const token = getActiveUser()?.accessToken;

//       const res = await httpinstance.put(
//         `resident/${_id}`,
//         data,
//         {
//           headers: {
//             "Content-Type": "application/json",
//             ...(token ? { Authorization: `Bearer ${token}` } : {}),
//           },
//         }
//       );

//       return res.data.data;
//     } catch (err: any) {
//       return rejectWithValue(
//         err.response?.data?.message || "Failed to update resident"
//       );
//     }
//   }
// );

// /* DELETE */
// export const deleteResident = createAsyncThunk(
//   "resident/delete",
//   async (_id: string, { rejectWithValue }) => {
//     try {
//       await httpinstance.delete(`resident/${_id}`);
//       return _id;
//     } catch (err: any) {
//       return rejectWithValue(
//         err.response?.data?.message || "Failed to delete resident"
//       );
//     }
//   }
// );

// /* TOGGLE STATUS */
// export const toggleResidentStatus = createAsyncThunk(
//   "resident/toggleStatus",
//   async (_id: string, { rejectWithValue }) => {
//     try {
//       const res = await httpinstance.patch(
//         `resident/${_id}/toggle-status`
//       );

//       return {
//         _id,
//         isActive: res.data.data.isActive,
//       };
//     } catch (err: any) {
//       return rejectWithValue(
//         err.response?.data?.message || "Failed to toggle resident status"
//       );
//     }
//   }
// );

// /* ================= SLICE ================= */

// const AddResidentSlice = createSlice({
//   name: "adminresident",
//   initialState,
//   reducers: {},
//   extraReducers: (builder) => {
//     builder

//       /* CREATE */
//       .addCase(createResident.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(createResident.fulfilled, (state, action) => {
//         state.loading = false;
//         state.residents.unshift(action.payload);
//       })
//       .addCase(createResident.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string;
//       })

//       /* FETCH */
//       .addCase(fetchResidents.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchResidents.fulfilled, (state, action) => {
//         state.loading = false;
//         state.residents = action.payload.data;
//         state.totalPages = action.payload.totalPages;
//         state.currentPage = action.payload.currentPage;
//         state.totalItems = action.payload.totalItems;
//       })
//       .addCase(fetchResidents.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string;
//       })

//       /* UPDATE */
//       .addCase(updateResident.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(updateResident.fulfilled, (state, action) => {
//         state.loading = false;
//         const index = state.residents.findIndex(
//           (r) => r._id === action.payload._id
//         );
//         if (index !== -1) {
//           state.residents[index] = action.payload;
//         }
//       })
//       .addCase(updateResident.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string;
//       })

//       /* DELETE */
//       .addCase(deleteResident.fulfilled, (state, action) => {
//         state.loading = false;
//         state.residents = state.residents.filter(
//           (r) => r._id !== action.payload
//         );
//       })

//       /* TOGGLE STATUS */
//       .addCase(toggleResidentStatus.fulfilled, (state, action) => {
//         const index = state.residents.findIndex(
//           (r) => r._id === action.payload._id
//         );
//         if (index !== -1) {
//           state.residents[index].isActive = action.payload.isActive;
//         }
//       });
//   },
// });

// export default AddResidentSlice.reducer;





import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { httpinstance } from "../../axios/api";
import { getActiveUser } from "../../utility/Cookies";

/* ================= CONFIG ================= */

// 🔥 toggle this when backend not ready
const USE_DUMMY_DATA = true;

/* ================= TYPES ================= */

export interface Resident {
  _id: string;
  societyId: string;
  societyName?: string;

  residentName: string;
  residentType: string;
  email: string;
  mobile: string;

  residentFlatsize: string;
  residentFlatarea: string;
  residentParkingname: string;

  secondresidentName?: string;
  secondresidentEmail?: string;
  secondresidentMobile?: string;

  isActive: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ResidentState {
  residents: Resident[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  loading: boolean;
  error: string | null;
}

/* ================= DUMMY DATA ================= */

const dummyResidents: Resident[] = [
  {
    _id: "r1",
    societyId: "soc1",
    societyName: "Avigo Heights",
    residentName: "Rahul Sharma",
    residentType: "Owner",
    email: "rahul@gmail.com",
    mobile: "9876543210",
    residentFlatsize: "2 BHK",
    residentFlatarea: "A-101",
    residentParkingname: "P1",
    isActive: true,
    isDeleted: false,
    createdAt: "2025-01-10T10:00:00Z",
    updatedAt: "2025-01-10T10:00:00Z",
  },
  {
    _id: "r2",
    societyId: "soc1",
    societyName: "Avigo Heights",
    residentName: "Amit Verma",
    residentType: "Tenant",
    email: "amit@gmail.com",
    mobile: "9988776655",
    residentFlatsize: "1 BHK",
    residentFlatarea: "B-204",
    residentParkingname: "P3",
    secondresidentName: "Neha Verma",
    secondresidentEmail: "neha@gmail.com",
    secondresidentMobile: "8899776655",
    isActive: true,
    isDeleted: false,
    createdAt: "2025-01-09T09:30:00Z",
    updatedAt: "2025-01-09T09:30:00Z",
  },
];

/* ================= INITIAL STATE ================= */

const initialState: ResidentState = {
  residents: [],
  totalItems: 0,
  totalPages: 0,
  currentPage: 1,
  loading: false,
  error: null,
};

/* ================= PAYLOADS ================= */

export interface CreateResidentPayload {
  societyId: string;
  residentName: string;
  residentType: string;
  email: string;
  mobile: string;
  residentFlatsize: string;
  residentFlatarea: string;
  residentParkingname: string;
  secondresidentName?: string;
  secondresidentEmail?: string;
  secondresidentMobile?: string;
}

export interface UpdateResidentPayload extends CreateResidentPayload {
  _id: string;
}

/* ================= THUNKS ================= */

/* CREATE */
export const createResident = createAsyncThunk(
  "resident/create",
  async (data: CreateResidentPayload, { rejectWithValue }) => {
    try {
      if (USE_DUMMY_DATA) {
        return {
          ...data,
          _id: Date.now().toString(),
          isActive: true,
          isDeleted: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
      }

      const token = getActiveUser()?.accessToken;

      const res = await httpinstance.post("resident", data, {
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      return res.data.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to create resident"
      );
    }
  }
);

/* FETCH */
export const fetchResidents = createAsyncThunk(
  "resident/fetch",
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
      if (USE_DUMMY_DATA) {
        let data = [...dummyResidents];

        if (search) {
          data = data.filter(
            (r) =>
              r.residentName.toLowerCase().includes(search.toLowerCase()) ||
              r.email.toLowerCase().includes(search.toLowerCase()) ||
              r.mobile.includes(search)
          );
        }

        const start = page * limit;
        const paginated = data.slice(start, start + limit);

        return {
          data: paginated,
          totalItems: data.length,
          totalPages: Math.ceil(data.length / limit),
          currentPage: page + 1,
        };
      }

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

      const res = await httpinstance.get(`resident?${params.toString()}`);

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

/* UPDATE */
export const updateResident = createAsyncThunk<Resident, UpdateResidentPayload>(
  "resident/update",
  async ({ _id, ...data }, { rejectWithValue }) => {
    try {
      if (USE_DUMMY_DATA) {
        return {
          ...data,
          _id,
          isActive: true,
          isDeleted: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        } as Resident;
      }

      const token = getActiveUser()?.accessToken;

      const res = await httpinstance.put(`resident/${_id}`, data, {
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      return res.data.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to update resident"
      );
    }
  }
);

/* DELETE */
export const deleteResident = createAsyncThunk(
  "resident/delete",
  async (_id: string, { rejectWithValue }) => {
    try {
      if (USE_DUMMY_DATA) return _id;

      await httpinstance.delete(`resident/${_id}`);
      return _id;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to delete resident"
      );
    }
  }
);

/* TOGGLE STATUS */
export const toggleResidentStatus = createAsyncThunk(
  "resident/toggleStatus",
  async (_id: string, { rejectWithValue }) => {
    try {
      if (USE_DUMMY_DATA) {
        return { _id, isActive: false };
      }

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

/* ================= SLICE ================= */

const AddResidentSlice = createSlice({
  name: "adminresident",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      .addCase(createResident.fulfilled, (state, action) => {
        state.residents.unshift(action.payload as Resident);
      })

      .addCase(fetchResidents.fulfilled, (state, action) => {
        state.residents = action.payload.data;
        state.totalItems = action.payload.totalItems;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
      })

      .addCase(updateResident.fulfilled, (state, action) => {
        const index = state.residents.findIndex(
          (r) => r._id === action.payload._id
        );
        if (index !== -1) state.residents[index] = action.payload;
      })

      .addCase(deleteResident.fulfilled, (state, action) => {
        state.residents = state.residents.filter(
          (r) => r._id !== action.payload
        );
      })

      .addCase(toggleResidentStatus.fulfilled, (state, action) => {
        const index = state.residents.findIndex(
          (r) => r._id === action.payload._id
        );
        if (index !== -1) {
          state.residents[index].isActive = action.payload.isActive;
        }
      });
  },
});

export default AddResidentSlice.reducer;
