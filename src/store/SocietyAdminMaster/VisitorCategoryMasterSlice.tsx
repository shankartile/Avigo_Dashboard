import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { httpinstance } from '../../axios/api';


type VisitorCategoryMasterState = {
    VisitorCategoryMaster: VisitorCategoryMaster[];
    totalItems: number;
    totalPages: number;
    currentPage: number;
    loading: boolean;
    error: string | null;
};



interface VisitorCategoryMaster {
    _id: string;
    category: string;
    visitor_type: string;
    visitor_type_name:string;
    visitor_type_id: string;
    isActive: boolean;
}

const initialState: VisitorCategoryMasterState = {
    VisitorCategoryMaster: [],
    totalItems: 0,
    totalPages: 0,
    currentPage: 0,
    loading: false,
    error: null,
};


export interface AddVisitorCategoryMasterPayload {
    category: string;
    visitor_type_id: string;

}

export interface UpdateVisitorCategoryMasterPayload {
    _id: string;
    category: string;
    visitor_type_id: string;

}


export const fetchVisitorCategoryMaster = createAsyncThunk(
    'VisitorCategoryMaster/fetchVisitorCategoryMaster',
    async (
        { search = '', page = 0, limit = 10 }: { search?: string; page?: number; limit?: number },
        { rejectWithValue }
    ) => {
        try {

            const response = await httpinstance.get(`society/visitor_categoryRoutes/getdata?&search=${search}&page=${page + 1}&limit=${limit}`);
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



export const addVisitorCategoryMaster = createAsyncThunk<VisitorCategoryMaster, AddVisitorCategoryMasterPayload>(
    'VisitorCategoryMaster/addVisitorCategoryMaster',
    async (formData, { rejectWithValue }) => {
        try {
            const res = await httpinstance.post('society/visitor_categoryRoutes/add', formData, {
                headers: { 'Content-Type': 'application/json' },
            });
            return res.data.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to add Visitor Category. ');
        }
    }
);


export const updateVisitorCategoryMaster = createAsyncThunk<VisitorCategoryMaster, UpdateVisitorCategoryMasterPayload>(
    'VisitorCategoryMaster/updateVisitorCategoryMaster',
    async ({ _id, ...formData }, { rejectWithValue }) => {
        try {
            const response = await httpinstance.put(
                `society/visitor_categoryRoutes/${_id}/update`,
                formData,
                {
                    headers: { 'Content-Type': 'application/json' },
                }
            );
            return response.data.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to update Visitor Category ');
        }
    }
);


export const deleteVisitorCategoryMaster = createAsyncThunk(
    'VisitorCategoryMasters/deleteVisitorCategoryMaster',
    async (_id: string, { rejectWithValue }) => {
        try {
            // Sending the ID as part of the URL
            await httpinstance.put(`society/visitor_categoryRoutes/${_id}/isdelete`, { isDeleted: true });
            return _id;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to delete Visitor Category ');
        }
    }
);




export const toggleVisitorCategoryMasterStatus = createAsyncThunk(
    'VisitorCategoryMaster/toggleStatus',
    async (
        { _id, isActive }: { _id: string; isActive: boolean },
        { rejectWithValue }
    ) => {
        try {
            const res = await httpinstance.put(
                `society/visitor_categoryRoutes/${_id}/isactive`,
                { isActive }
            );
            return res.data.data;
        } catch (err: any) {
            console.error('Toggle Status Error:', err.response?.data || err.message);
            return rejectWithValue(err.response?.data?.message || 'Failed to toggle status');
        }
    }
);

const VisitorCategoryMasterSlice = createSlice({
    name: 'VisitorCategoryMasters',
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
                state.totalItems = action.payload.totalItems;
                state.totalPages = action.payload.totalPages;
                state.currentPage = action.payload.currentPage;
            })

            .addCase(fetchVisitorCategoryMaster.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            .addCase(addVisitorCategoryMaster.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addVisitorCategoryMaster.fulfilled, (state, action) => {
                state.VisitorCategoryMaster.push(action.payload);
            })

            .addCase(addVisitorCategoryMaster.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            .addCase(updateVisitorCategoryMaster.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateVisitorCategoryMaster.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.VisitorCategoryMaster.findIndex(item => item._id === action.payload._id);
                if (index !== -1) {
                    state.VisitorCategoryMaster[index] = action.payload;
                }
            })
            .addCase(updateVisitorCategoryMaster.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
    },
});

export default VisitorCategoryMasterSlice.reducer;