import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { httpinstance } from '../../axios/api';


type VisitorNameMasterState = {
    VisitorNameMaster: VisitorNameMaster[];
    VisitorCategoryMaster: VisitorCategoryMaster[];
    VisitorTypeMaster: VisitorTypeMaster[];
    totalItems: number;
    totalPages: number;
    currentPage: number;
    loading: boolean;
    error: string | null;
};


interface VisitorCategoryMaster {
    _id: string;
    visitor_category_name: string;
    visitor_type_name: string;
    isActive: boolean;
}


interface VisitorNameMaster {
    _id: string;
    visitorname: string;
    visitor_type_id: string;
    visitor_type_name: string;
    visitor_category_id: string;
    isActive: boolean;
}

interface VisitorTypeMaster {
    _id: string;
    visitor_type: string;
    isActive: boolean;
}

const initialState: VisitorNameMasterState = {
    VisitorNameMaster: [],
    VisitorCategoryMaster: [],
    VisitorTypeMaster: [],
    totalItems: 0,
    totalPages: 0,
    currentPage: 0,
    loading: false,
    error: null,
};


export interface AddVisitorNameMasterPayload {
    visitor_category_id: string;
    visitor_category_name: string;
    visitorname: string;
    visitor_type_id: string;

}

export interface UpdateVisitorNameMasterPayload {
    _id: string;
    visitor_category_id: string;
    visitorname: string;
    visitor_type_id: string;

}





export const fetchVisitorCategoryMaster = createAsyncThunk(
    'VisitorCategoryMaster/fetchVisitorCategoryMaster',
    async (_, { rejectWithValue }) => {
        try {
            const response = await httpinstance.get(`society/visitor_categoryRoute/getdata?page=1&limit=1000`);
            return {
                data: response.data.data, // assuming this has `.category`
            };
        } catch (error: any) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);




export const fetchVisitorNameMaster = createAsyncThunk(
    'VisitorNameMaster/fetchVisitorNameMaster',
    async (
        { search = '', page = 0, limit = 10 }: { search?: string; page?: number; limit?: number },
        { rejectWithValue }
    ) => {
        try {

            const response = await httpinstance.get(`society/visitor_nameRoute/getdata?&search=${search}&page=${page + 1}&limit=${limit}`);
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


export const fetchVisitortype = createAsyncThunk(
    'VisitorNameMaster/fetchVisitortype',
    async (
        { search = '', page = 0, limit = 10 }: { search?: string; page?: number; limit?: number },
        { rejectWithValue }
    ) => {
        try {

            const response = await httpinstance.get(`society/visitor_typeRoutes/getdata?&search=${search}&page=${page + 1}&limit=${limit}`);
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


export const addVisitorNameMaster = createAsyncThunk<VisitorNameMaster, AddVisitorNameMasterPayload>(
    'VisitorNameMaster/addVisitorNameMaster',
    async (formData, { rejectWithValue }) => {
        try {
            const res = await httpinstance.post('society/visitor_nameRoute/add', formData, {
                headers: { 'Content-Type': 'application/json' },
            });
            return res.data.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to add State');
        }
    }
);


export const updateVisitorNameMaster = createAsyncThunk<VisitorNameMaster, UpdateVisitorNameMasterPayload>(
    'VisitorNameMaster/updateVisitorNameMaster',
    async ({ _id, ...formData }, { rejectWithValue }) => {
        try {
            const response = await httpinstance.put(
                `society/visitor_nameRoute/${_id}/update`,
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


export const deleteVisitorNameMaster = createAsyncThunk(
    'VisitorNameMasters/deleteVisitorNameMaster',
    async (_id: string, { rejectWithValue }) => {
        try {
            // Sending the ID as part of the URL
            await httpinstance.put(`society/visitor_nameRoute/${_id}/isdelete`, { isDeleted: true });
            return _id;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to delete Visitor Name');
        }
    }
);




export const toggleVisitorNameMasterStatus = createAsyncThunk(
    'VisitorNameMaster/toggleStatus',
    async (
        { _id, isActive }: { _id: string; isActive: boolean },
        { rejectWithValue }
    ) => {
        try {
            const res = await httpinstance.put(
                `society/visitor_nameRoute/${_id}/isactive`,
                { isActive }
            );
            return res.data.data;
        } catch (err: any) {
            console.error('Toggle Status Error:', err.response?.data || err.message);
            return rejectWithValue(err.response?.data?.message || 'Failed to toggle status');
        }
    }
);

const VisitorNameMasterSlice = createSlice({
    name: 'VisitorNameMasters',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder

            .addCase(fetchVisitorCategoryMaster.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchVisitorCategoryMaster.fulfilled, (state, action) => {
                state.loading = false;
                state.VisitorCategoryMaster = action.payload.data;
            })

            .addCase(fetchVisitorCategoryMaster.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // .addCase(fetchVisitorCategoryMaster.pending, state => {
            //     state.loading = true;
            //     state.error = null;
            // })
            .addCase(fetchVisitorNameMaster.fulfilled, (state, action) => {
                state.loading = false;
                state.VisitorNameMaster = action.payload.data;
                state.VisitorCategoryMaster = action.payload.data;
                state.totalItems = action.payload.totalItems;
                state.totalPages = action.payload.totalPages;
                state.currentPage = action.payload.currentPage;
            })


            .addCase(fetchVisitorNameMaster.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            .addCase(fetchVisitortype.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchVisitortype.fulfilled, (state, action) => {
                state.loading = false;
                state.VisitorTypeMaster = action.payload.data.visitorTypes;
                state.totalItems = action.payload.totalItems;
                state.totalPages = action.payload.totalPages;
                state.currentPage = action.payload.currentPage;
            })


            .addCase(fetchVisitortype.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })


            .addCase(addVisitorNameMaster.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addVisitorNameMaster.fulfilled, (state, action) => {
                state.VisitorNameMaster.push(action.payload);
            })

            .addCase(addVisitorNameMaster.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            .addCase(updateVisitorNameMaster.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateVisitorNameMaster.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.VisitorNameMaster.findIndex(item => item._id === action.payload._id);
                if (index !== -1) {
                    state.VisitorNameMaster[index] = action.payload;
                }
            })
            .addCase(updateVisitorNameMaster.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
    },
});

export default VisitorNameMasterSlice.reducer;