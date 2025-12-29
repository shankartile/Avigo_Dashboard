// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import { httpinstance } from "../../axios/api";
// import { getActiveUser } from "../../utility/Cookies";



// export interface Document {
//   _id: string;

//   title: string;
// //   category: "General" | "Emergency" | "Finance" | "Event";
//   category: "Bylaws" | "Circulars" | "Certificates" | "Agreements";
//   description: string;

// //   acknowledgeRequired: boolean;
// //   readCount: number;

//   attachments?: string[];

//   isActive: boolean;
//   isDeleted: boolean;

//   createdAt: string;
//   updatedAt: string;
// }

// interface DocumentState {
//   documents: Document[];
//   totalItems: number;
//   totalPages: number;
//   currentPage: number;
//   loading: boolean;
//   error: string | null;
// }



// const initialState: DocumentState = {
//   documents: [],
//   totalItems: 0,
//   totalPages: 0,
//   currentPage: 0,
//   loading: false,
//   error: null,
// };



// export interface CreateDocumentPayload {
//   title: string;
//   category: string;
//   description: string;
// //   acknowledgeRequired: boolean;
//   attachments?: File[];
// }

// export interface UpdateDocumentPayload {
//   _id: string;
//   data: FormData;
// }



// /* CREATE Document */
// export const createDocument = createAsyncThunk(
//   "document/create",
//   async (data: FormData, { rejectWithValue }) => {
//     try {
//       const token = getActiveUser()?.accessToken;

//       const res = await httpinstance.post(
//         "document",
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
//         err.response?.data?.message || "Failed to create document"
//       );
//     }
//   }
// );

// /* FETCH NOTICES */
// export const fetchDocuments = createAsyncThunk(
//   "document/fetch",
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
//         `document?${params.toString()}`
//       );

//       return {
//         data: res.data.data,
//         totalPages: res.data.pagination?.totalPages || 1,
//         currentPage: res.data.pagination?.currentPage || 1,
//         totalItems: res.data.pagination?.totalItems || 0,
//       };
//     } catch (err: any) {
//       return rejectWithValue(
//         err.response?.data?.message || "Failed to fetch documents"
//       );
//     }
//   }
// );

// /* UPDATE DOCUMENTS */
// export const updateDocument = createAsyncThunk<
//   Document,
//   UpdateDocumentPayload
// >(
//   "document/update",
//   async ({ _id, data }, { rejectWithValue }) => {
//     try {
//       const token = getActiveUser()?.accessToken;

//       const res = await httpinstance.put(
//         `document/${_id}`,
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
//         err.response?.data?.message || "Failed to update document"
//       );
//     }
//   }
// );

// /* DELETE DOCUMENT */
// export const deleteDocument = createAsyncThunk(
//   "document/delete",
//   async (_id: string, { rejectWithValue }) => {
//     try {
//       await httpinstance.delete(`document/${_id}`);
//       return _id;
//     } catch (err: any) {
//       return rejectWithValue(
//         err.response?.data?.message || "Failed to delete document"
//       );
//     }
//   }
// );

// /* TOGGLE DOCUMENT STATUS */
// export const toggleDocumentStatus = createAsyncThunk(
//   "document/toggleStatus",
//   async (_id: string, { rejectWithValue }) => {
//     try {
//       const res = await httpinstance.patch(
//         `document/${_id}/toggle-status`
//       );

//       return {
//         _id,
//         isActive: res.data.data.isActive,
//       };
//     } catch (err: any) {
//       return rejectWithValue(
//         err.response?.data?.message || "Failed to toggle document status"
//       );
//     }
//   }
// );



// const DocumentVaultManagementSlice = createSlice({
//   name: "documentvaultmanagement",
//   initialState,
//   reducers: {},
//   extraReducers: (builder) => {
//     builder

//       /* CREATE */
//       .addCase(createDocument.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(createDocument.fulfilled, (state, action) => {
//         state.loading = false;
//         state.documents.unshift(action.payload);
//       })
//       .addCase(createDocument.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string;
//       })

//       /* FETCH */
//       .addCase(fetchDocuments.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchDocuments.fulfilled, (state, action) => {
//         state.loading = false;
//         state.documents = action.payload.data;
//         state.totalPages = action.payload.totalPages;
//         state.currentPage = action.payload.currentPage;
//         state.totalItems = action.payload.totalItems;
//       })
//       .addCase(fetchDocuments.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string;
//       })

//       /* UPDATE */
//       .addCase(updateDocument.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(updateDocument.fulfilled, (state, action) => {
//         state.loading = false;
//         const index = state.documents.findIndex(
//           (n) => n._id === action.payload._id
//         );
//         if (index !== -1) {
//           state.documents[index] = action.payload;
//         }
//       })
//       .addCase(updateDocument.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string;
//       })

//       /* DELETE */
//       .addCase(deleteDocument.fulfilled, (state, action) => {
//         state.loading = false;
//         state.documents = state.documents.filter(
//           (n) => n._id !== action.payload
//         );
//       })

//       /* TOGGLE STATUS */
//       .addCase(toggleDocumentStatus.fulfilled, (state, action) => {
//         const index = state.documents.findIndex(
//           (n) => n._id === action.payload._id
//         );
//         if (index !== -1) {
//           state.documents[index].isActive = action.payload.isActive;
//         }
//       });
//   },
// });

// export default DocumentVaultManagementSlice.reducer;





import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

/* =======================
   TYPES
======================= */

export interface Document {
  _id: string;
  title: string;
  category: "Bylaws" | "Circulars" | "Certificates" | "Agreements";
  description: string;
  attachments?: string[];
  isActive: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

interface DocumentState {
  documents: Document[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  loading: boolean;
  error: string | null;
}

/* =======================
   DUMMY DATA
======================= */

const DUMMY_DOCUMENTS: Document[] = [
  {
    _id: "1",
    title: "Society Bylaws 2024",
    category: "Bylaws",
    description: "Official society bylaws document Official society bylaws document Official society bylaws document Official society bylaws document Official society bylaws document Official society bylaws document Official society bylaws document Official society bylaws document Official society bylaws document",
    attachments: ["bylaws.pdf"],
    isActive: true,
    isDeleted: false,
    createdAt: "2024-01-10",
    updatedAt: "2024-01-10",
  },
  {
    _id: "2",
    title: "Fire Safety Circular",
    category: "Circulars",
    description: "Important fire safety instructions",
    attachments: ["fire-safety.pdf"],
    isActive: true,
    isDeleted: false,
    createdAt: "2024-02-15",
    updatedAt: "2024-02-15",
  },
  {
    _id: "3",
    title: "Completion Certificate",
    category: "Certificates",
    description: "Building completion certificate",
    attachments: ["certificate.pdf"],
    isActive: false,
    isDeleted: false,
    createdAt: "2024-03-20",
    updatedAt: "2024-03-20",
  },
  {
    _id: "4",
    title: "Vendor Agreement",
    category: "Agreements",
    description: "Lift maintenance agreement",
    attachments: ["agreement.pdf"],
    isActive: true,
    isDeleted: false,
    createdAt: "2024-04-05",
    updatedAt: "2024-04-05",
  },
];

/* =======================
   INITIAL STATE
======================= */

const initialState: DocumentState = {
  documents: [],
  totalItems: 0,
  totalPages: 0,
  currentPage: 1,
  loading: false,
  error: null,
};

/* =======================
   THUNKS (MOCKED)
======================= */

/* FETCH DOCUMENTS */
export const fetchDocuments = createAsyncThunk(
  "document/fetch",
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
    let data = [...DUMMY_DOCUMENTS];

    /* SEARCH */
    if (search) {
      data = data.filter((d) =>
        d.title.toLowerCase().includes(search.toLowerCase())
      );
    }

    /* CATEGORY FILTER */
    if (filters?.category) {
      data = data.filter((d) => d.category === filters.category);
    }

    /* DATE FILTER */
    if (fromDate) {
      data = data.filter(
        (d) => new Date(d.createdAt) >= new Date(fromDate)
      );
    }

    if (toDate) {
      data = data.filter(
        (d) => new Date(d.createdAt) <= new Date(toDate)
      );
    }

    /* EXPORT MOCK (NO API CALL) */
    if (exportType) {
      console.log(`Mock export triggered: ${exportType}`, data);
      return {
        data: [],
        totalItems: 0,
        totalPages: 1,
        currentPage: 1,
      };
    }

    const totalItems = data.length;
    const totalPages = Math.ceil(totalItems / limit);
    const start = page * limit;
    const paginatedData = data.slice(start, start + limit);

    return {
      data: paginatedData,
      totalItems,
      totalPages,
      currentPage: page + 1,
    };
  }
);


/* CREATE DOCUMENT */
export const createDocument = createAsyncThunk(
  "document/create",
  async (payload: any) => {
    const newDoc: Document = {
      _id: Date.now().toString(),
      title: payload.title,
      category: payload.category,
      description: payload.description,
      attachments: [],
      isActive: true,
      isDeleted: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return newDoc;
  }
);

/* UPDATE DOCUMENT */
export const updateDocument = createAsyncThunk(
  "document/update",
  async ({ _id, data }: { _id: string; data: any }) => {
    return {
      _id,
      ...data,
      updatedAt: new Date().toISOString(),
    };
  }
);

/* DELETE DOCUMENT */
export const deleteDocument = createAsyncThunk(
  "document/delete",
  async (_id: string) => _id
);

/* TOGGLE STATUS */
export const toggleDocumentStatus = createAsyncThunk(
  "document/toggleStatus",
  async (_id: string, { getState }: any) => {
    const state = getState().documentvaultmanagement;
    const doc = state.documents.find((d: Document) => d._id === _id);

    return {
      _id,
      isActive: !doc.isActive,
    };
  }
);

/* =======================
   SLICE
======================= */

const DocumentVaultManagementSlice = createSlice({
  name: "documentvaultmanagement",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      /* FETCH */
      .addCase(fetchDocuments.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDocuments.fulfilled, (state, action) => {
        state.loading = false;
        state.documents = action.payload.data;
        state.totalItems = action.payload.totalItems;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
      })

      /* CREATE */
      .addCase(createDocument.fulfilled, (state, action) => {
        state.documents.unshift(action.payload);
        state.totalItems += 1;
      })

      /* UPDATE */
      .addCase(updateDocument.fulfilled, (state, action) => {
        const index = state.documents.findIndex(
          (d) => d._id === action.payload._id
        );
        if (index !== -1) {
          state.documents[index] = {
            ...state.documents[index],
            ...action.payload,
          };
        }
      })

      /* DELETE */
      .addCase(deleteDocument.fulfilled, (state, action) => {
        state.documents = state.documents.filter(
          (d) => d._id !== action.payload
        );
        state.totalItems -= 1;
      })

      /* TOGGLE STATUS */
      .addCase(toggleDocumentStatus.fulfilled, (state, action) => {
        const index = state.documents.findIndex(
          (d) => d._id === action.payload._id
        );
        if (index !== -1) {
          state.documents[index].isActive = action.payload.isActive;
        }
      });
  },
});

export default DocumentVaultManagementSlice.reducer;
