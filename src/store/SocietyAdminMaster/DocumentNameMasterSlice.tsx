import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { httpinstance } from '../../axios/api';


type DocumentNameMasterState = {
    DocumentNameMaster: DocumentNameMaster[];
    DocumentCategoryMaster: DocumentCategoryMaster[];
    DocumentTypeMaster: DocumentTypeMaster[];
    totalItems: number;
    totalPages: number;
    currentPage: number;
    loading: boolean;
    error: string | null;
};


interface DocumentCategoryMaster {
    _id: string;
    document_category_name: string;
    document_type_name: string;
    isActive: boolean;
}


interface DocumentNameMaster {
    _id: string;
    documentname: string;
    document_type_id: string;
    document_type_name: string;
    document_category_id: string;
    isActive: boolean;
}

interface DocumentTypeMaster {
    _id: string;
    document_type: string;
    isActive: boolean;
}

const initialState: DocumentNameMasterState = {
    DocumentNameMaster: [],
    DocumentCategoryMaster: [],
    DocumentTypeMaster: [],
    totalItems: 0,
    totalPages: 0,
    currentPage: 0,
    loading: false,
    error: null,
};


export interface AddDocumentNameMasterPayload {
    document_category_id: string;
    document_category_name: string;
    documentname: string;
    document_type_id: string;

}

export interface UpdateDocumentNameMasterPayload {
    _id: string;
    document_category_id: string;
    documentname: string;
    document_type_id: string;

}





export const fetchDocumentCategoryMaster = createAsyncThunk(
    'DocumentCategoryMaster/fetchDocumentCategoryMaster',
    async (_, { rejectWithValue }) => {
        try {
            const response = await httpinstance.get(`society/document_categoryRoute/getdata?page=1&limit=1000`);
            return {
                data: response.data.data, // assuming this has `.category`
            };
        } catch (error: any) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);




export const fetchDocumentNameMaster = createAsyncThunk(
    'DocumentNameMaster/fetchDocumentNameMaster',
    async (
        { search = '', page = 0, limit = 10 }: { search?: string; page?: number; limit?: number },
        { rejectWithValue }
    ) => {
        try {

            const response = await httpinstance.get(`society/document_nameRoute/getdata?&search=${search}&page=${page + 1}&limit=${limit}`);
            return {
                data: response.data.data,
                totalItems: response.data.pagination.totalItems,
                totalPages: response.data.data.pagination?.totalPages ?? 0,
                currentPage: response.data.data.pagination?.currentPage ?? 0,
            };
        } catch (error: any) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);


export const fetchDocumenttype = createAsyncThunk(
    'DocumentNameMaster/fetchDocumenttype',
    async (
        { search = '', page = 0, limit = 10 }: { search?: string; page?: number; limit?: number },
        { rejectWithValue }
    ) => {
        try {

            const response = await httpinstance.get(`society/document_typeRoutes/getdata?&search=${search}&page=${page + 1}&limit=${limit}`);
            return {
                data: response.data.data,
                totalItems: response.data.pagination.totalItems,
                totalPages: response.data.data.pagination?.totalPages ?? 0,
                currentPage: response.data.data.pagination?.currentPage ?? 0,
            };
        } catch (error: any) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);


export const addDocumentNameMaster = createAsyncThunk<DocumentNameMaster, AddDocumentNameMasterPayload>(
    'DocumentNameMaster/addDocumentNameMaster',
    async (formData, { rejectWithValue }) => {
        try {
            const res = await httpinstance.post('society/document_nameRoute/add', formData, {
                headers: { 'Content-Type': 'application/json' },
            });
            return res.data.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to add State');
        }
    }
);


export const updateDocumentNameMaster = createAsyncThunk<DocumentNameMaster, UpdateDocumentNameMasterPayload>(
    'DocumentNameMaster/updateDocumentNameMaster',
    async ({ _id, ...formData }, { rejectWithValue }) => {
        try {
            const response = await httpinstance.put(
                `society/document_nameRoute/${_id}/update`,
                formData,
                {
                    headers: { 'Content-Type': 'application/json' },
                }
            );
            return response.data.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to update State');
        }
    }
);


export const deleteDocumentrNameMaster = createAsyncThunk(
    'DocumentNameMasters/deleteDocumentNameMaster',
    async (_id: string, { rejectWithValue }) => {
        try {
            // Sending the ID as part of the URL
            await httpinstance.put(`society/document_nameRoute/${_id}/isdelete`, { isDeleted: true });
            return _id;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to delete Document Name');
        }
    }
);




export const toggleDocumentNameMasterStatus = createAsyncThunk(
    'DocumentNameMaster/toggleStatus',
    async (
        { _id, isActive }: { _id: string; isActive: boolean },
        { rejectWithValue }
    ) => {
        try {
            const res = await httpinstance.put(
                `society/document_nameRoute/${_id}/isactive`,
                { isActive }
            );
            return res.data.data;
        } catch (err: any) {
            console.error('Toggle Status Error:', err.response?.data || err.message);
            return rejectWithValue(err.response?.data?.message || 'Failed to toggle status');
        }
    }
);

const DocumentNameMasterSlice = createSlice({
    name: 'DocumentNameMasters',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder

            .addCase(fetchDocumentCategoryMaster.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchDocumentCategoryMaster.fulfilled, (state, action) => {
                state.loading = false;
                state.DocumentCategoryMaster = action.payload.data;
            })

            .addCase(fetchDocumentCategoryMaster.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // .addCase(fetchDocumentCategoryMaster.pending, state => {
            //     state.loading = true;
            //     state.error = null;
            // })
            .addCase(fetchDocumentNameMaster.fulfilled, (state, action) => {
                state.loading = false;
                state.DocumentNameMaster = action.payload.data;
                state.DocumentCategoryMaster = action.payload.data;
                state.totalItems = action.payload.totalItems;
                state.totalPages = action.payload.totalPages;
                state.currentPage = action.payload.currentPage;
            })


            .addCase(fetchDocumentNameMaster.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            .addCase(fetchDocumenttype.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchDocumenttype.fulfilled, (state, action) => {
                state.loading = false;
                state.DocumentTypeMaster = action.payload.data.documentTypes;
                state.totalItems = action.payload.totalItems;
                state.totalPages = action.payload.totalPages;
                state.currentPage = action.payload.currentPage;
            })


            .addCase(fetchDocumenttype.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })


            .addCase(addDocumentNameMaster.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addDocumentNameMaster.fulfilled, (state, action) => {
                state.DocumentNameMaster.push(action.payload);
            })

            .addCase(addDocumentNameMaster.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            .addCase(updateDocumentNameMaster.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateDocumentNameMaster.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.DocumentNameMaster.findIndex(item => item._id === action.payload._id);
                if (index !== -1) {
                    state.DocumentNameMaster[index] = action.payload;
                }
            })
            .addCase(updateDocumentNameMaster.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
    },
});

export default DocumentNameMasterSlice.reducer;