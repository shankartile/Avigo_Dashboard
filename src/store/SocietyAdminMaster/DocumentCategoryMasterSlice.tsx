import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { httpinstance } from '../../axios/api';


type DocumentCategoryMasterState = {
    DocumentCategoryMaster: DocumentCategoryMaster[];
    totalItems: number;
    totalPages: number;
    currentPage: number;
    loading: boolean;
    error: string | null;
};



interface DocumentCategoryMaster {
    _id: string;
    category: string;
    document_type: string;
    document_type_name: string;
    document_type_id: string;
    isActive: boolean;
}

const initialState: DocumentCategoryMasterState = {
    DocumentCategoryMaster: [],
    totalItems: 0,
    totalPages: 0,
    currentPage: 0,
    loading: false,
    error: null,
};


export interface AddDocumentCategoryMasterPayload {
    category: string;
    document_type_id: string;

}

export interface UpdateDocumentCategoryMasterPayload {
    _id: string;
    category: string;
    document_type_id: string;

}


export const fetchDocumentCategoryMaster = createAsyncThunk(
    'DocumentCategoryMaster/fetchDocumentCategoryMaster',
    async (
        { search = '', page = 0, limit = 10 }: { search?: string; page?: number; limit?: number },
        { rejectWithValue }
    ) => {
        try {

            const response = await httpinstance.get(`society/document_categoryRoutes/getdata?&search=${search}&page=${page + 1}&limit=${limit}`);
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



export const addDocumentCategoryMaster = createAsyncThunk<DocumentCategoryMaster, AddDocumentCategoryMasterPayload>(
    'DocumentCategoryMaster/addDocumentCategoryMaster',
    async (formData, { rejectWithValue }) => {
        try {
            const res = await httpinstance.post('society/document_categoryRoutes/add', formData, {
                headers: { 'Content-Type': 'application/json' },
            });
            return res.data.data;




        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to add Document Category. ');
        }
    }
);


export const updateDocumentCategoryMaster = createAsyncThunk<DocumentCategoryMaster, UpdateDocumentCategoryMasterPayload>(
    'DocumentCategoryMaster/updateDocumentCategoryMaster',
    async ({ _id, ...formData }, { rejectWithValue }) => {
        try {
            const response = await httpinstance.put(
                `society/document_categoryRoutes/${_id}/update`,
                formData,
                {
                    headers: { 'Content-Type': 'application/json' },
                }
            );
            return response.data.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to update Document Category ');
        }
    }
);


export const deleteDocumentCategoryMaster = createAsyncThunk(
    'DocumentCategoryMasters/deleteDocumentCategoryMaster',
    async (_id: string, { rejectWithValue }) => {
        try {
            // Sending the ID as part of the URL
            await httpinstance.put(`society/document_categoryRoutes/${_id}/isdelete`, { isDeleted: true });
            return _id;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to delete Document Category ');
        }
    }
);




export const toggleDocumentCategoryMasterStatus = createAsyncThunk(
    'DocumentCategoryMaster/toggleStatus',
    async (
        { _id, isActive }: { _id: string; isActive: boolean },
        { rejectWithValue }
    ) => {
        try {
            const res = await httpinstance.put(
                `society/document_categoryRoutes/${_id}/isactive`,
                { isActive }
            );
            return res.data.data;
        } catch (err: any) {
            console.error('Toggle Status Error:', err.response?.data || err.message);
            return rejectWithValue(err.response?.data?.message || 'Failed to toggle status');
        }
    }
);

const DocumentCategoryMasterSlice = createSlice({
    name: 'DocumentCategoryMasters',
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
                state.totalItems = action.payload.totalItems;
                state.totalPages = action.payload.totalPages;
                state.currentPage = action.payload.currentPage;
            })

            .addCase(fetchDocumentCategoryMaster.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            .addCase(addDocumentCategoryMaster.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addDocumentCategoryMaster.fulfilled, (state, action) => {
                state.DocumentCategoryMaster.push(action.payload);
            })

            .addCase(addDocumentCategoryMaster.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            .addCase(updateDocumentCategoryMaster.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateDocumentCategoryMaster.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.DocumentCategoryMaster.findIndex(item => item._id === action.payload._id);
                if (index !== -1) {
                    state.DocumentCategoryMaster[index] = action.payload;
                }
            })
            .addCase(updateDocumentCategoryMaster.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
    },
});

export default DocumentCategoryMasterSlice.reducer;