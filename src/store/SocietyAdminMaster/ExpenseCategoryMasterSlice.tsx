import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { httpinstance } from '../../axios/api';


type ExpenseCategoryMasterState = {
    ExpenseCategoryMaster: ExpenseCategoryMaster[];
    totalItems: number;
    totalPages: number;
    currentPage: number;
    loading: boolean;
    error: string | null;
};



interface ExpenseCategoryMaster {
    _id: string;
    category: string;
    expense_type: string;
    expense_type_name:string;
    expense_type_id: string;
    isActive: boolean;
}

const initialState: ExpenseCategoryMasterState = {
    ExpenseCategoryMaster: [],
    totalItems: 0,
    totalPages: 0,
    currentPage: 0,
    loading: false,
    error: null,
};


export interface AddExpenseCategoryMasterPayload {
    category: string;
    expense_type_id: string;

}

export interface UpdateExpenseCategoryMasterPayload {
    _id: string;
    category: string;
    expense_type_id: string;

}


export const fetchExpenseCategoryMaster = createAsyncThunk(
    'ExpenseCategoryMaster/fetchExpenseCategoryMaster',
    async (
        { search = '', page = 0, limit = 10 }: { search?: string; page?: number; limit?: number },
        { rejectWithValue }
    ) => {
        try {

            const response = await httpinstance.get(`society/expense_categoryRoutes/getdata?&search=${search}&page=${page + 1}&limit=${limit}`);
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



export const addExpenseCategoryMaster = createAsyncThunk<ExpenseCategoryMaster, AddExpenseCategoryMasterPayload>(
    'ExpenseCategoryMaster/addExpenseCategoryMaster',
    async (formData, { rejectWithValue }) => {
        try {
            const res = await httpinstance.post('society/expense_categoryRoutes/add', formData, {
                headers: { 'Content-Type': 'application/json' },
            });
            return res.data.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to add Expense Category. ');
        }
    }
);


export const updateExpenseCategoryMaster = createAsyncThunk<ExpenseCategoryMaster, UpdateExpenseCategoryMasterPayload>(
    'ExpenseCategoryMaster/updateExpenseCategoryMaster',
    async ({ _id, ...formData }, { rejectWithValue }) => {
        try {
            const response = await httpinstance.put(
                `society/expense_categoryRoutes/${_id}/update`,
                formData,
                {
                    headers: { 'Content-Type': 'application/json' },
                }
            );
            return response.data.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to update Expense Category ');
        }
    }
);


export const deleteExpenseCategoryMaster = createAsyncThunk(
    'ExpenseCategoryMasters/deleteExpenseCategoryMaster',
    async (_id: string, { rejectWithValue }) => {
        try {
            // Sending the ID as part of the URL
            await httpinstance.put(`society/expense_categoryRoutes/${_id}/isdelete`, { isDeleted: true });
            return _id;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to delete Expense Category ');
        }
    }
);




export const toggleExpenseCategoryMasterStatus = createAsyncThunk(
    'ExpenseCategoryMaster/toggleStatus',
    async (
        { _id, isActive }: { _id: string; isActive: boolean },
        { rejectWithValue }
    ) => {
        try {
            const res = await httpinstance.put(
                `society/expense_categoryRoutes/${_id}/isactive`,
                { isActive }
            );
            return res.data.data;
        } catch (err: any) {
            console.error('Toggle Status Error:', err.response?.data || err.message);
            return rejectWithValue(err.response?.data?.message || 'Failed to toggle status');
        }
    }
);

const ExpenseCategoryMasterSlice = createSlice({
    name: 'ExpenseCategoryMasters',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(fetchExpenseCategoryMaster.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchExpenseCategoryMaster.fulfilled, (state, action) => {
                state.loading = false;
                state.ExpenseCategoryMaster = action.payload.data;
                state.totalItems = action.payload.totalItems;
                state.totalPages = action.payload.totalPages;
                state.currentPage = action.payload.currentPage;
            })

            .addCase(fetchExpenseCategoryMaster.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            .addCase(addExpenseCategoryMaster.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addExpenseCategoryMaster.fulfilled, (state, action) => {
                state.ExpenseCategoryMaster.push(action.payload);
            })

            .addCase(addExpenseCategoryMaster.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            .addCase(updateExpenseCategoryMaster.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateExpenseCategoryMaster.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.ExpenseCategoryMaster.findIndex(item => item._id === action.payload._id);
                if (index !== -1) {
                    state.ExpenseCategoryMaster[index] = action.payload;
                }
            })
            .addCase(updateExpenseCategoryMaster.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
    },
});

export default ExpenseCategoryMasterSlice.reducer;