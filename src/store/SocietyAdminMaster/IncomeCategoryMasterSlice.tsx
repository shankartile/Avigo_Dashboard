import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { httpinstance } from '../../axios/api';


type IncomeCategoryMasterState = {
    IncomeCategoryMaster: IncomeCategoryMaster[];
    totalItems: number;
    totalPages: number;
    currentPage: number;
    loading: boolean;
    error: string | null;
};



interface IncomeCategoryMaster {
    _id: string;
    category: string;
    income_type: string;
    income_type_name:string;
    income_type_id: string;
    isActive: boolean;
}

const initialState: IncomeCategoryMasterState = {
    IncomeCategoryMaster: [],
    totalItems: 0,
    totalPages: 0,
    currentPage: 0,
    loading: false,
    error: null,
};


export interface AddIncomeCategoryMasterPayload {
    category: string;
    income_type_id: string;

}

export interface UpdateIncomeCategoryMasterPayload {
    _id: string;
    category: string;
    income_type_id: string;

}


export const fetchIncomeCategoryMaster = createAsyncThunk(
    'IncomeCategoryMaster/fetchIncomeCategoryMaster',
    async (
        { search = '', page = 0, limit = 10 }: { search?: string; page?: number; limit?: number },
        { rejectWithValue }
    ) => {
        try {

            const response = await httpinstance.get(`society/income_categoryRoutes/getdata?&search=${search}&page=${page + 1}&limit=${limit}`);
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



export const addIncomeCategoryMaster = createAsyncThunk<IncomeCategoryMaster, AddIncomeCategoryMasterPayload>(
    'IncomeCategoryMaster/addIncomeCategoryMaster',
    async (formData, { rejectWithValue }) => {
        try {
            const res = await httpinstance.post('society/income_categoryRoutes/add', formData, {
                headers: { 'Content-Type': 'application/json' },
            });
            return res.data.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to add Income Category. ');
        }
    }
);


export const updateIncomeCategoryMaster = createAsyncThunk<IncomeCategoryMaster, UpdateIncomeCategoryMasterPayload>(
    'IncomeCategoryMaster/updateIncomeCategoryMaster',
    async ({ _id, ...formData }, { rejectWithValue }) => {
        try {
            const response = await httpinstance.put(
                `society/income_categoryRoutes/${_id}/update`,
                formData,
                {
                    headers: { 'Content-Type': 'application/json' },
                }
            );
            return response.data.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to update Income Category ');
        }
    }
);


export const deleteIncomeCategoryMaster = createAsyncThunk(
    'IncomeCategoryMasters/deleteIncomeCategoryMaster',
    async (_id: string, { rejectWithValue }) => {
        try {
            // Sending the ID as part of the URL
            await httpinstance.put(`society/income_categoryRoutes/${_id}/isdelete`, { isDeleted: true });
            return _id;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to delete Income Category ');
        }
    }
);




export const toggleIncomeCategoryMasterStatus = createAsyncThunk(
    'IncomeCategoryMaster/toggleStatus',
    async (
        { _id, isActive }: { _id: string; isActive: boolean },
        { rejectWithValue }
    ) => {
        try {
            const res = await httpinstance.put(
                `society/income_categoryRoutes/${_id}/isactive`,
                { isActive }
            );
            return res.data.data;
        } catch (err: any) {
            console.error('Toggle Status Error:', err.response?.data || err.message);
            return rejectWithValue(err.response?.data?.message || 'Failed to toggle status');
        }
    }
);

const IncomeCategoryMasterSlice = createSlice({
    name: 'IncomeCategoryMasters',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(fetchIncomeCategoryMaster.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchIncomeCategoryMaster.fulfilled, (state, action) => {
                state.loading = false;
                state.IncomeCategoryMaster = action.payload.data;
                state.totalItems = action.payload.totalItems;
                state.totalPages = action.payload.totalPages;
                state.currentPage = action.payload.currentPage;
            })

            .addCase(fetchIncomeCategoryMaster.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            .addCase(addIncomeCategoryMaster.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addIncomeCategoryMaster.fulfilled, (state, action) => {
                state.IncomeCategoryMaster.push(action.payload);
            })

            .addCase(addIncomeCategoryMaster.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            .addCase(updateIncomeCategoryMaster.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateIncomeCategoryMaster.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.IncomeCategoryMaster.findIndex(item => item._id === action.payload._id);
                if (index !== -1) {
                    state.IncomeCategoryMaster[index] = action.payload;
                }
            })
            .addCase(updateIncomeCategoryMaster.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
    },
});

export default IncomeCategoryMasterSlice.reducer;