// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import { httpinstance } from "../../axios/api";
// import { getActiveUser } from "../../utility/Cookies";



// export interface VisitorLog {
//   _id: string;
//   name: string;
//   mobile: string;
//   flatNumber: string;
//   type: "Guest" | "Delivery" | "Vendor";
//   purpose: string;
//   reason?: string;
//   entryTime: string;
//   exitTime?: string;
//   photo?: string;
//   createdAt: string;
//   updatedAt: string;
// }

// interface VisitorLogState {
//   visitors: VisitorLog[];
//   totalItems: number;
//   totalPages: number;
//   currentPage: number;
//   summary: {
//     visitors: number;
//     deliveries: number;
//   };
//   loading: boolean;
//   error: string | null;
// }



// const initialState: VisitorLogState = {
//   visitors: [],
//   totalItems: 0,
//   totalPages: 0,
//   currentPage: 0,
//   summary: {
//     visitors: 0,
//     deliveries: 0,
//   },
//   loading: false,
//   error: null,
// };


// export const fetchVisitorLogs = createAsyncThunk(
//   "visitorLogs/fetch",
//   async (
//     {
//       search = "",
//       page = 0,
//       limit = 10,
//       filters,
//       fromDate,
//       toDate,
//     }: {
//       search?: string;
//       page?: number;
//       limit?: number;
//       filters?: Record<string, any>;
//       fromDate?: string;
//       toDate?: string;
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

//       if (filters) {
//         Object.entries(filters).forEach(([key, value]) => {
//           if (value !== undefined && value !== "") {
//             params.append(`filters[${key}]`, String(value));
//           }
//         });
//       }

//       const token = getActiveUser()?.accessToken;

//       const res = await httpinstance.get(
//         `visitor-logs?${params.toString()}`,
//         {
//           headers: {
//             ...(token ? { Authorization: `Bearer ${token}` } : {}),
//           },
//         }
//       );

//       return {
//         data: res.data.data,
//         summary: res.data.summary,
//         totalPages: res.data.pagination?.totalPages || 1,
//         currentPage: res.data.pagination?.currentPage || 1,
//         totalItems: res.data.pagination?.totalItems || 0,
//       };
//     } catch (err: any) {
//       return rejectWithValue(
//         err.response?.data?.message || "Failed to fetch visitor logs"
//       );
//     }
//   }
// );


// const visitorLogsSlice = createSlice({
//   name: "visitorLogs",
//   initialState,
//   reducers: {},
//   extraReducers: (builder) => {
//     builder

//       /* FETCH */
//       .addCase(fetchVisitorLogs.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchVisitorLogs.fulfilled, (state, action) => {
//         state.loading = false;
//         state.visitors = action.payload.data;
//         state.summary = action.payload.summary;
//         state.totalPages = action.payload.totalPages;
//         state.currentPage = action.payload.currentPage;
//         state.totalItems = action.payload.totalItems;
//       })
//       .addCase(fetchVisitorLogs.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string;
//       });
//   },
// });

// export default visitorLogsSlice.reducer;



import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

/* =======================
   TYPES
======================= */

export interface VisitorLog {
  _id: string;
  name: string;
  mobile: string;
  flatNumber: string;
  type: "Guest" | "Delivery" | "Vendor";
  purpose: string;
  reason?: string;
  entryTime: string;
  exitTime?: string;
  photo?: string;
  createdAt: string;
  updatedAt: string;
}

interface VisitorLogState {
  visitors: VisitorLog[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  summary: {
    guests: number;
    deliveries: number;
    vendors: number;
  };
  loading: boolean;
  error: string | null;
}

/* =======================
   DUMMY DATA
======================= */

const dummyVisitorLogs: VisitorLog[] = [
  {
    _id: "v1",
    name: "Rahul Sharma",
    mobile: "9876543210",
    flatNumber: "A-101",
    type: "Guest",
    purpose: "Family Visit",
    reason: "Visiting relatives",
    entryTime: "10:15 AM",
    exitTime: "12:30 PM",
    photo: "https://i.pravatar.cc/150?img=1",
    createdAt: "2025-01-11T10:15:00.000Z",
    updatedAt: "2025-01-11T12:30:00.000Z",
  },
  {
    _id: "v2",
    name: "Amazon Delivery",
    mobile: "9001234567",
    flatNumber: "B-204",
    type: "Delivery",
    purpose: "Parcel Delivery",
    reason: "Amazon order",
    entryTime: "11:00 AM",
    photo: "https://i.pravatar.cc/150?img=2",
    createdAt: "2025-01-11T11:00:00.000Z",
    updatedAt: "2025-01-11T11:10:00.000Z",
  },
  {
    _id: "v3",
    name: "Electrician",
    mobile: "8899776655",
    flatNumber: "C-302",
    type: "Vendor",
    purpose: "Maintenance",
    reason: "Fan repair",
    entryTime: "09:45 AM",
    exitTime: "10:30 AM",
    photo: "https://i.pravatar.cc/150?img=3",
    createdAt: "2025-01-11T09:45:00.000Z",
    updatedAt: "2025-01-11T10:30:00.000Z",
  },
  {
    _id: "v4",
    name: "Swiggy Delivery",
    mobile: "9012345678",
    flatNumber: "A-105",
    type: "Delivery",
    purpose: "Food Delivery",
    reason: "Lunch order",
    entryTime: "01:10 PM",
    photo: "https://i.pravatar.cc/150?img=4",
    createdAt: "2025-01-10T13:10:00.000Z",
    updatedAt: "2025-01-10T13:20:00.000Z",
  },
  {
    _id: "v5",
    name: "Amit Verma",
    mobile: "9988776655",
    flatNumber: "B-110",
    type: "Guest",
    purpose: "Friend Visit",
    reason: "Meeting friend",
    entryTime: "04:00 PM",
    photo: "https://i.pravatar.cc/150?img=5",
    createdAt: "2025-01-10T16:00:00.000Z",
    updatedAt: "2025-01-10T18:00:00.000Z",
  },
];

/* =======================
   INITIAL STATE
======================= */

const initialState: VisitorLogState = {
  visitors: [],
  totalItems: 0,
  totalPages: 0,
  currentPage: 1,
  summary: {
    guests: 0,
    deliveries: 0,
    vendors: 0,
  },
  loading: false,
  error: null,
};

/* =======================
   FETCH VISITOR LOGS (DUMMY)
======================= */

export const fetchVisitorLogs = createAsyncThunk(
  "visitorLogs/fetch",
  async (
    {
      search = "",
      page = 0,
      limit = 10,
      filters,
      fromDate,
      toDate,
    }: {
      search?: string;
      page?: number;
      limit?: number;
      filters?: Record<string, any>;
      fromDate?: string;
      toDate?: string;
    }
  ) => {
    let data = [...dummyVisitorLogs];

    /* SEARCH */
    if (search) {
      data = data.filter(
        (v) =>
          v.name.toLowerCase().includes(search.toLowerCase()) ||
          v.mobile.includes(search)
      );
    }

    /* FILTER BY TYPE */
    if (filters?.type) {
      data = data.filter((v) => v.type === filters.type);
    }

    /* DATE FILTER */
    if (fromDate || toDate) {
      data = data.filter((v) => {
        const created = new Date(v.createdAt).getTime();
        if (fromDate && created < new Date(fromDate).setHours(0, 0, 0, 0))
          return false;
        if (toDate && created > new Date(toDate).setHours(23, 59, 59, 999))
          return false;
        return true;
      });
    }

    /* ===== TODAY SUMMARY ===== */
    const todayStart = new Date().setHours(0, 0, 0, 0);
    const todayEnd = new Date().setHours(23, 59, 59, 999);

    const todayData = dummyVisitorLogs.filter((v) => {
      const created = new Date(v.createdAt).getTime();
      return created >= todayStart && created <= todayEnd;
    });

    const summary = {
      guests: todayData.filter((v) => v.type === "Guest").length,
      deliveries: todayData.filter((v) => v.type === "Delivery").length,
      vendors: todayData.filter((v) => v.type === "Vendor").length,
    };

    /* PAGINATION */
    const start = page * limit;
    const paginatedData = data.slice(start, start + limit);

    return {
      data: paginatedData,
      summary,
      totalItems: data.length,
      totalPages: Math.ceil(data.length / limit),
      currentPage: page + 1,
    };
  }
);

/* =======================
   SLICE
======================= */

const visitorLogsSlice = createSlice({
  name: "visitorLogs",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchVisitorLogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVisitorLogs.fulfilled, (state, action) => {
        state.loading = false;
        state.visitors = action.payload.data;
        state.summary = action.payload.summary;
        state.totalItems = action.payload.totalItems;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
      })
      .addCase(fetchVisitorLogs.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || "Failed to fetch visitor logs";
      });
  },
});

export default visitorLogsSlice.reducer;
