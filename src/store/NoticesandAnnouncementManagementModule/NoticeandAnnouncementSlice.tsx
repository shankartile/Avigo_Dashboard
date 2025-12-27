// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import { httpinstance } from "../../axios/api";
// import { getActiveUser } from "../../utility/Cookies";



// export interface Notice {
//   _id: string;

//   title: string;
//   category: "General" | "Emergency" | "Finance" | "Event";
//   description: string;

//   acknowledgeRequired: boolean;
//   readCount: number;

//   attachments?: string[];

//   isActive: boolean;
//   isDeleted: boolean;

//   createdAt: string;
//   updatedAt: string;
// }

// interface NoticeState {
//   notices: Notice[];
//   totalItems: number;
//   totalPages: number;
//   currentPage: number;
//   loading: boolean;
//   error: string | null;
// }



// const initialState: NoticeState = {
//   notices: [],
//   totalItems: 0,
//   totalPages: 0,
//   currentPage: 0,
//   loading: false,
//   error: null,
// };



// export interface CreateNoticePayload {
//   title: string;
//   category: string;
//   description: string;
//   acknowledgeRequired: boolean;
//   attachments?: File[];
// }

// export interface UpdateNoticePayload {
//   _id: string;
//   data: FormData;
// }



// /* CREATE NOTICE */
// export const createNotice = createAsyncThunk(
//   "notice/create",
//   async (data: FormData, { rejectWithValue }) => {
//     try {
//       const token = getActiveUser()?.accessToken;

//       const res = await httpinstance.post(
//         "notice",
//         data,
//         {
//           headers: {
//             "Content-Type": "multipart/form-data",
//             ...(token ? { Authorization: `Bearer ${token}` } : {}),
//           },
//         }
//       );

//       return res.data.data;
//     } catch (err: any) {
//       return rejectWithValue(
//         err.response?.data?.message || "Failed to create notice"
//       );
//     }
//   }
// );

// /* FETCH NOTICES */
// export const fetchNotices = createAsyncThunk(
//   "notice/fetch",
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
//         `notice?${params.toString()}`
//       );

//       return {
//         data: res.data.data,
//         totalPages: res.data.pagination?.totalPages || 1,
//         currentPage: res.data.pagination?.currentPage || 1,
//         totalItems: res.data.pagination?.totalItems || 0,
//       };
//     } catch (err: any) {
//       return rejectWithValue(
//         err.response?.data?.message || "Failed to fetch notices"
//       );
//     }
//   }
// );

// /* UPDATE NOTICE */
// export const updateNotice = createAsyncThunk<
//   Notice,
//   UpdateNoticePayload
// >(
//   "notice/update",
//   async ({ _id, data }, { rejectWithValue }) => {
//     try {
//       const token = getActiveUser()?.accessToken;

//       const res = await httpinstance.put(
//         `notice/${_id}`,
//         data,
//         {
//           headers: {
//             "Content-Type": "multipart/form-data",
//             ...(token ? { Authorization: `Bearer ${token}` } : {}),
//           },
//         }
//       );

//       return res.data.data;
//     } catch (err: any) {
//       return rejectWithValue(
//         err.response?.data?.message || "Failed to update notice"
//       );
//     }
//   }
// );

// /* DELETE NOTICE */
// export const deleteNotice = createAsyncThunk(
//   "notice/delete",
//   async (_id: string, { rejectWithValue }) => {
//     try {
//       await httpinstance.delete(`notice/${_id}`);
//       return _id;
//     } catch (err: any) {
//       return rejectWithValue(
//         err.response?.data?.message || "Failed to delete notice"
//       );
//     }
//   }
// );

// /* TOGGLE NOTICE STATUS */
// export const toggleNoticeStatus = createAsyncThunk(
//   "notice/toggleStatus",
//   async (_id: string, { rejectWithValue }) => {
//     try {
//       const res = await httpinstance.patch(
//         `notice/${_id}/toggle-status`
//       );

//       return {
//         _id,
//         isActive: res.data.data.isActive,
//       };
//     } catch (err: any) {
//       return rejectWithValue(
//         err.response?.data?.message || "Failed to toggle notice status"
//       );
//     }
//   }
// );



// const NoticeandAnnouncementSlice = createSlice({
//   name: "noticesandannouncement",
//   initialState,
//   reducers: {},
//   extraReducers: (builder) => {
//     builder

//       /* CREATE */
//       .addCase(createNotice.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(createNotice.fulfilled, (state, action) => {
//         state.loading = false;
//         state.notices.unshift(action.payload);
//       })
//       .addCase(createNotice.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string;
//       })

//       /* FETCH */
//       .addCase(fetchNotices.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchNotices.fulfilled, (state, action) => {
//         state.loading = false;
//         state.notices = action.payload.data;
//         state.totalPages = action.payload.totalPages;
//         state.currentPage = action.payload.currentPage;
//         state.totalItems = action.payload.totalItems;
//       })
//       .addCase(fetchNotices.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string;
//       })

//       /* UPDATE */
//       .addCase(updateNotice.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(updateNotice.fulfilled, (state, action) => {
//         state.loading = false;
//         const index = state.notices.findIndex(
//           (n) => n._id === action.payload._id
//         );
//         if (index !== -1) {
//           state.notices[index] = action.payload;
//         }
//       })
//       .addCase(updateNotice.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string;
//       })

//       /* DELETE */
//       .addCase(deleteNotice.fulfilled, (state, action) => {
//         state.loading = false;
//         state.notices = state.notices.filter(
//           (n) => n._id !== action.payload
//         );
//       })

//       /* TOGGLE STATUS */
//       .addCase(toggleNoticeStatus.fulfilled, (state, action) => {
//         const index = state.notices.findIndex(
//           (n) => n._id === action.payload._id
//         );
//         if (index !== -1) {
//           state.notices[index].isActive = action.payload.isActive;
//         }
//       });
//   },
// });

// export default NoticeandAnnouncementSlice.reducer;






import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { httpinstance } from "../../axios/api";
import { getActiveUser } from "../../utility/Cookies";

/* ================= TYPES ================= */

export interface Notice {
  _id: string;
  title: string;
  category: "General" | "Emergency" | "Finance" | "Event";
  description: string;
  acknowledgeRequired: boolean;
  readCount: number;
  attachments?: string[];
  isActive: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

interface NoticeState {
  notices: Notice[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  loading: boolean;
  error: string | null;
}

/* ================= INITIAL STATE ================= */

const initialState: NoticeState = {
  notices: [],
  totalItems: 0,
  totalPages: 0,
  currentPage: 0,
  loading: false,
  error: null,
};

/* ================= DUMMY DATA ================= */

const dummyNotices: Notice[] = [
  {
    _id: "1",
    title: "Water Supply Interruption",
    category: "Emergency",
    description: "<p>Water supply will be unavailable from 10 AM to 4 PM.</p>",
    acknowledgeRequired: true,
    readCount: 23,
    attachments: [],
    isActive: true,
    isDeleted: false,
    createdAt: "2025-01-10",
    updatedAt: "2025-01-10",
  },
  {
    _id: "2",
    title: "Monthly Maintenance Due",
    category: "Finance",
    description: "<p>Please pay maintenance before 15th Jan.</p>",
    acknowledgeRequired: false,
    readCount: 41,
    attachments: [],
    isActive: true,
    isDeleted: false,
    createdAt: "2025-01-05",
    updatedAt: "2025-01-05",
  },
  {
    _id: "3",
    title: "Republic Day Celebration",
    category: "Event",
    description: "<p>Flag hoisting at 8 AM near clubhouse.</p>",
    acknowledgeRequired: false,
    readCount: 68,
    attachments: [],
    isActive: false,
    isDeleted: false,
    createdAt: "2024-12-28",
    updatedAt: "2024-12-28",
  },
];

/* ================= PAYLOADS ================= */

export interface CreateNoticePayload {
  title: string;
  category: string;
  description: string;
  acknowledgeRequired: boolean;
  attachments?: File[];
}

export interface UpdateNoticePayload {
  _id: string;
  data: FormData;
}

/* ================= THUNKS ================= */

/* CREATE NOTICE (REAL API – UNCHANGED) */
export const createNotice = createAsyncThunk(
  "notice/create",
  async (data: FormData, { rejectWithValue }) => {
    try {
      const token = getActiveUser()?.accessToken;

      const res = await httpinstance.post(
        "notice",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        }
      );

      return res.data.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to create notice"
      );
    }
  }
);

/* FETCH NOTICES (DUMMY DATA ONLY) */
export const fetchNotices = createAsyncThunk(
  "notice/fetch",
  async (
    {
      search = "",
      page = 0,
      limit = 10,
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
      let data = [...dummyNotices];

      if (search) {
        data = data.filter((n) =>
          n.title.toLowerCase().includes(search.toLowerCase())
        );
      }

      return {
        data,
        totalPages: 1,
        currentPage: 1,
        totalItems: data.length,
      };
    } catch {
      return rejectWithValue("Failed to fetch notices");
    }
  }
);

/* UPDATE NOTICE (LOCAL UPDATE) */
export const updateNotice = createAsyncThunk<
  Notice,
  UpdateNoticePayload
>(
  "notice/update",
  async ({ _id, data }, { rejectWithValue }) => {
    try {
      return {
        _id,
        title: data.get("title") as string,
        category: data.get("category") as any,
        description: data.get("description") as string,
        acknowledgeRequired: data.get("acknowledgeRequired") === "true",
        readCount: 50,
        attachments: [],
        isActive: true,
        isDeleted: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    } catch {
      return rejectWithValue("Failed to update notice");
    }
  }
);

/* DELETE NOTICE */
export const deleteNotice = createAsyncThunk(
  "notice/delete",
  async (_id: string) => _id
);

/* TOGGLE NOTICE STATUS */
export const toggleNoticeStatus = createAsyncThunk(
  "notice/toggleStatus",
  async (_id: string) => ({ _id })
);

/* ================= SLICE ================= */

const NoticeandAnnouncementSlice = createSlice({
  name: "noticesandannouncement",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      /* CREATE */
      .addCase(createNotice.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createNotice.fulfilled, (state, action) => {
        state.loading = false;
        state.notices.unshift(action.payload);
      })
      .addCase(createNotice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      /* FETCH */
      .addCase(fetchNotices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotices.fulfilled, (state, action) => {
        state.loading = false;
        state.notices = action.payload.data;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
        state.totalItems = action.payload.totalItems;
      })
      .addCase(fetchNotices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      /* UPDATE */
      .addCase(updateNotice.fulfilled, (state, action) => {
        const index = state.notices.findIndex(
          (n) => n._id === action.payload._id
        );
        if (index !== -1) {
          state.notices[index] = action.payload;
        }
      })

      /* DELETE */
      .addCase(deleteNotice.fulfilled, (state, action) => {
        state.notices = state.notices.filter(
          (n) => n._id !== action.payload
        );
      })

      /* TOGGLE STATUS */
      .addCase(toggleNoticeStatus.fulfilled, (state, action) => {
        const index = state.notices.findIndex(
          (n) => n._id === action.payload._id
        );
        if (index !== -1) {
          state.notices[index].isActive =
            !state.notices[index].isActive;
        }
      });
  },
});

export default NoticeandAnnouncementSlice.reducer;
