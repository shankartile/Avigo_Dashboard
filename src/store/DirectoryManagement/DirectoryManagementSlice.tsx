// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import { httpinstance } from "../../axios/api";
// import { getActiveUser } from "../../utility/Cookies";

// export interface Directory {
//     _id: string;
//     contact_name: string;
//     category: "Committee" | "Emergency" | "Vendor" | "Utility";
//     role_or_service: string;
//     phone: string;
//     alternate_phone?: string;
//     email?: string;
//     description?: string;
//     visibility: "admin" | "resident";
//     isActive: boolean;
//     isDeleted: boolean;
//     createdAt: string;
//     updatedAt: string;
// }

// interface DirectoryState {
//     directories: Directory[];
//     totalItems: number;
//     totalPages: number;
//     currentPage: number;
//     loading: boolean;
//     error: string | null;
// }

// const initialState: DirectoryState = {
//     directories: [],
//     totalItems: 0,
//     totalPages: 0,
//     currentPage: 0,
//     loading: false,
//     error: null,
// };

// export interface CreateDirectoryPayload {
//     contact_name: string;
//     category: string;
//     role_or_service: string;
//     phone: string;
//     alternate_phone?: string;
//     email?: string;
//     description?: string;
//     visibility: "admin" | "resident";
// }

// export interface UpdateDirectoryPayload {
//     _id: string;
//     data: CreateDirectoryPayload;
// }

// export const createDirectory = createAsyncThunk(
//     "directory/create",
//     async (data: CreateDirectoryPayload, { rejectWithValue }) => {
//         try {
//             const token = getActiveUser()?.accessToken;

//             const res = await httpinstance.post(
//                 "directory",
//                 data,
//                 {
//                     headers: {
//                         "Content-Type": "application/json",
//                         ...(token ? { Authorization: `Bearer ${token}` } : {}),
//                     },
//                 }
//             );

//             return res.data.data;
//         } catch (err: any) {
//             return rejectWithValue(
//                 err.response?.data?.message || "Failed to create directory contact"
//             );
//         }
//     }
// );


// export const fetchDirectories = createAsyncThunk(
//     "directory/fetch",
//     async (
//         {
//             search = "",
//             page = 0,
//             limit = 10,
//             filters,
//             fromDate,
//             toDate,
//             exportType,
//         }: {
//             search?: string;
//             page?: number;
//             limit?: number;
//             filters?: Record<string, any>;
//             fromDate?: string;
//             toDate?: string;
//             exportType?: "csv" | "pdf";
//         },

//         { rejectWithValue }
//     ) => {
//         try {
//             const params = new URLSearchParams();

//             if (search) params.append("search", search);
//             if (page !== undefined) params.append("page", String(page + 1));
//             if (limit) params.append("limit", String(limit));

//             if (fromDate) params.append("fromDate", fromDate);
//             if (toDate) params.append("toDate", toDate);
//             if (exportType) params.append("exportType", exportType);

//             if (filters) {
//                 Object.entries(filters).forEach(([key, value]) => {
//                     if (value !== undefined && value !== "") {
//                         params.append(`filters[${key}]`, String(value));
//                     }
//                 });
//             }



//             const res = await httpinstance.get(
//                 `directory?${params.toString()}`
//             );

//             return {
//                 data: res.data.data,
//                 totalPages: res.data.pagination?.totalPages || 1,
//                 currentPage: res.data.pagination?.currentPage || 1,
//                 totalItems: res.data.pagination?.totalItems || 0,
//             };
//         } catch (err: any) {
//             return rejectWithValue(
//                 err.response?.data?.message || "Failed to fetch directory"
//             );
//         }
//     }
// );


// export const updateDirectory = createAsyncThunk<
//     Directory,
//     UpdateDirectoryPayload
// >(
//     "directory/update",
//     async ({ _id, data }, { rejectWithValue }) => {
//         try {
//             const token = getActiveUser()?.accessToken;

//             const res = await httpinstance.put(
//                 `directory/${_id}`,
//                 data,
//                 {
//                     headers: {
//                         "Content-Type": "application/json",
//                         ...(token ? { Authorization: `Bearer ${token}` } : {}),
//                     },
//                 }
//             );

//             return res.data.data;
//         } catch (err: any) {
//             return rejectWithValue(
//                 err.response?.data?.message || "Failed to update directory contact"
//             );
//         }
//     }
// );

// export const deleteDirectory = createAsyncThunk(
//     "directory/delete",
//     async (_id: string, { rejectWithValue }) => {
//         try {
//             await httpinstance.delete(`directory/${_id}`);
//             return _id;
//         } catch (err: any) {
//             return rejectWithValue(
//                 err.response?.data?.message || "Failed to delete directory contact"
//             );
//         }
//     }
// );


// export const toggleDirectoryStatus = createAsyncThunk(
//     "directory/toggleStatus",
//     async (_id: string, { rejectWithValue }) => {
//         try {
//             const res = await httpinstance.patch(
//                 `directory/${_id}/toggle-status`
//             );

//             return {
//                 _id,
//                 isActive: res.data.data.isActive,
//             };
//         } catch (err: any) {
//             return rejectWithValue(
//                 err.response?.data?.message || "Failed to toggle directory status"
//             );
//         }
//     }
// );


// const DirectoryManagementSlice = createSlice({
//     name: "directorymanagement",
//     initialState,
//     reducers: {},
//     extraReducers: (builder) => {
//         builder

//             /* CREATE */
//             .addCase(createDirectory.pending, (state) => {
//                 state.loading = true;
//                 state.error = null;
//             })
//             .addCase(createDirectory.fulfilled, (state, action) => {
//                 state.loading = false;
//                 state.directories.unshift(action.payload);
//             })
//             .addCase(createDirectory.rejected, (state, action) => {
//                 state.loading = false;
//                 state.error = action.payload as string;
//             })

//             /* FETCH */
//             .addCase(fetchDirectories.pending, (state) => {
//                 state.loading = true;
//                 state.error = null;
//             })
//             .addCase(fetchDirectories.fulfilled, (state, action) => {
//                 state.loading = false;
//                 state.directories = action.payload.data;
//                 state.totalPages = action.payload.totalPages;
//                 state.currentPage = action.payload.currentPage;
//                 state.totalItems = action.payload.totalItems;
//             })
//             .addCase(fetchDirectories.rejected, (state, action) => {
//                 state.loading = false;
//                 state.error = action.payload as string;
//             })

//             /* UPDATE */
//             .addCase(updateDirectory.pending, (state) => {
//                 state.loading = true;
//                 state.error = null;
//             })
//             .addCase(updateDirectory.fulfilled, (state, action) => {
//                 state.loading = false;
//                 const index = state.directories.findIndex(
//                     (d) => d._id === action.payload._id
//                 );
//                 if (index !== -1) {
//                     state.directories[index] = action.payload;
//                 }
//             })
//             .addCase(updateDirectory.rejected, (state, action) => {
//                 state.loading = false;
//                 state.error = action.payload as string;
//             })

//             /* DELETE */
//             .addCase(deleteDirectory.fulfilled, (state, action) => {
//                 state.loading = false;
//                 state.directories = state.directories.filter(
//                     (d) => d._id !== action.payload
//                 );
//             })

//             /* TOGGLE STATUS */
//             .addCase(toggleDirectoryStatus.fulfilled, (state, action) => {
//                 const index = state.directories.findIndex(
//                     (d) => d._id === action.payload._id
//                 );
//                 if (index !== -1) {
//                     state.directories[index].isActive = action.payload.isActive;
//                 }
//             });
//     },
// });

// export default DirectoryManagementSlice.reducer;






import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

/* ================= TYPES ================= */

export interface Directory {
    _id: string;
    contact_name: string;
    category: "Committee" | "Emergency" | "Vendor" | "Utility";
    role_or_service: string;
    phone: string;
    alternate_phone?: string;
    email?: string;
    description?: string;
    visibility: "admin" | "resident";
    isActive: boolean;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
}

interface DirectoryState {
    directories: Directory[];
    totalItems: number;
    totalPages: number;
    currentPage: number;
    loading: boolean;
    error: string | null;
}

/* ================= DUMMY DATA ================= */

let DUMMY_DIRECTORIES: Directory[] = [
    {
        _id: "1",
        contact_name: "Shubham Patil",
        category: "Committee",
        role_or_service: "Chairman",
        phone: "9876543210",
        alternate_phone: "9123456780",
        email: "chairman@society.com",
        description: "Head of society committee",
        visibility: "resident",
        isActive: true,
        isDeleted: false,
        createdAt: "2024-01-10T10:30:00Z",
        updatedAt: "2024-01-12T12:00:00Z",
    },
    {
        _id: "2",
        contact_name: "City Ambulance",
        category: "Emergency",
        role_or_service: "Ambulance Service",
        phone: "108",
        description: "24x7 emergency ambulance service",
        visibility: "resident",
        isActive: true,
        isDeleted: false,
        createdAt: "2024-01-05T09:00:00Z",
        updatedAt: "2024-01-05T09:00:00Z",
    },
];

/* ================= INITIAL STATE ================= */

const initialState: DirectoryState = {
    directories: [],
    totalItems: 0,
    totalPages: 1,
    currentPage: 1,
    loading: false,
    error: null,
};

/* ================= THUNKS ================= */

/* FETCH */
export const fetchDirectories = createAsyncThunk(
    "directory/fetch",
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
        }
    ) => {
        await new Promise((res) => setTimeout(res, 300));

        let data = [...DUMMY_DIRECTORIES];

        if (search) {
            data = data.filter((d) =>
                d.contact_name.toLowerCase().includes(search.toLowerCase())
            );
        }

        if (filters) {
            Object.entries(filters).forEach(([key, value]) => {
                data = data.filter((item: any) => item[key] === value);
            });
        }

        return {
            data,
            totalItems: data.length,
            totalPages: 1,
            currentPage: page + 1,
        };
    }
);

/* CREATE */
export const createDirectory = createAsyncThunk(
    "directory/create",
    async (data: any) => {
        const newItem: Directory = {
            ...data,
            _id: Date.now().toString(),
            isActive: true,
            isDeleted: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        DUMMY_DIRECTORIES.unshift(newItem);
        return newItem;
    }
);

/* UPDATE */
export const updateDirectory = createAsyncThunk(
    "directory/update",
    async ({ _id, data }: { _id: string; data: any }) => {
        const index = DUMMY_DIRECTORIES.findIndex((d) => d._id === _id);
        if (index !== -1) {
            DUMMY_DIRECTORIES[index] = {
                ...DUMMY_DIRECTORIES[index],
                ...data,
                updatedAt: new Date().toISOString(),
            };
        }
        return DUMMY_DIRECTORIES[index];
    }
);

/* DELETE */
export const deleteDirectory = createAsyncThunk(
    "directory/delete",
    async (_id: string) => {
        DUMMY_DIRECTORIES = DUMMY_DIRECTORIES.filter((d) => d._id !== _id);
        return _id;
    }
);

/* TOGGLE STATUS */
export const toggleDirectoryStatus = createAsyncThunk(
    "directory/toggleStatus",
    async (_id: string) => {
        const index = DUMMY_DIRECTORIES.findIndex((d) => d._id === _id);
        if (index !== -1) {
            DUMMY_DIRECTORIES[index].isActive =
                !DUMMY_DIRECTORIES[index].isActive;
        }
        return {
            _id,
            isActive: DUMMY_DIRECTORIES[index].isActive,
        };
    }
);

/* ================= SLICE ================= */

const DirectoryManagementSlice = createSlice({
    name: "directorymanagement",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder

            /* FETCH */
            .addCase(fetchDirectories.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchDirectories.fulfilled, (state, action) => {
                state.loading = false;
                state.directories = action.payload.data;
                state.totalItems = action.payload.totalItems;
            })

            /* CREATE */
            .addCase(createDirectory.fulfilled, (state, action) => {
                state.directories.unshift(action.payload);
            })

            /* UPDATE */
            .addCase(updateDirectory.fulfilled, (state, action) => {
                const index = state.directories.findIndex(
                    (d) => d._id === action.payload._id
                );
                if (index !== -1) {
                    state.directories[index] = action.payload;
                }
            })

            /* DELETE */
            .addCase(deleteDirectory.fulfilled, (state, action) => {
                state.directories = state.directories.filter(
                    (d) => d._id !== action.payload
                );
            })

            /* TOGGLE */
            .addCase(toggleDirectoryStatus.fulfilled, (state, action) => {
                const index = state.directories.findIndex(
                    (d) => d._id === action.payload._id
                );
                if (index !== -1) {
                    state.directories[index].isActive =
                        action.payload.isActive;
                }
            });
    },
});

export default DirectoryManagementSlice.reducer;
