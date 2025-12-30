import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { httpinstance } from '../../axios/api';


type ExpenseNameMasterState = {
    ExpenseNameMaster: ExpenseNameMaster[];
    ExpenseCategoryMaster: ExpenseCategoryMaster[];
    ExpenseTypeMaster: ExpenseTypeMaster[];
    totalItems: number;
    totalPages: number;
    currentPage: number;
    loading: boolean;
    error: string | null;
};


interface ExpenseCategoryMaster {
    _id: string;
    expense_category_name: string;
    expense_type_name: string;
    isActive: boolean;
}


interface ExpenseNameMaster {
    _id: string;
    expensename: string;
    expense_type_id: string;
    expense_type_name: string;
    expense_category_id: string;
    isActive: boolean;
}

interface ExpenseTypeMaster {
    _id: string;
    expense_type: string;
    isActive: boolean;
}

const initialState: ExpenseNameMasterState = {
    ExpenseNameMaster: [],
    ExpenseCategoryMaster: [],
    ExpenseTypeMaster: [],
    totalItems: 0,
    totalPages: 0,
    currentPage: 0,
    loading: false,
    error: null,
};


export interface AddExpenseNameMasterPayload {
    expense_category_id: string;
    expense_category_name: string;
    expensename: string;
    expense_type_id: string;

}

export interface UpdateExpenseNameMasterPayload {
    _id: string;
    expense_category_id: string;
    expensename: string;
    expense_type_id: string;

}





export const fetchExpenseCategoryMaster = createAsyncThunk(
    'ExpenseCategoryMaster/fetchExpenseCategoryMaster',
    async (_, { rejectWithValue }) => {
        try {
            const response = await httpinstance.get(`society/expense_categoryRoutes/getdata?page=1&limit=1000`);
            return {
                data: response.data.data, // assuming this has `.brands`
            };
        } catch (error: any) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);




export const fetchExpenseNameMaster = createAsyncThunk(
    'ExpenseNameMaster/fetchExpenseNameMaster',
    async (
        { search = '', page = 0, limit = 10 }: { search?: string; page?: number; limit?: number },
        { rejectWithValue }
    ) => {
        try {

            const response = await httpinstance.get(`society/expense_nameRoutes/getdata?&search=${search}&page=${page + 1}&limit=${limit}`);
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


export const fetchExpensetype = createAsyncThunk(
    'ExpenseNameMaster/fetchExpensetype',
    async (
        { search = '', page = 0, limit = 10 }: { search?: string; page?: number; limit?: number },
        { rejectWithValue }
    ) => {
        try {

            const response = await httpinstance.get(`society/expense_typeRoutes/getdata?&search=${search}&page=${page + 1}&limit=${limit}`);
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


export const addExpenseNameMaster = createAsyncThunk<ExpenseNameMaster, AddExpenseNameMasterPayload>(
    'ExpenseNameMaster/addExpenseNameMaster',
    async (formData, { rejectWithValue }) => {
        try {
            const res = await httpinstance.post('society/expense_nameRoutes/add', formData, {
                headers: { 'Content-Type': 'application/json' },
            });
            return res.data.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to add State');
        }
    }
);


export const updateExpenseNameMaster = createAsyncThunk<ExpenseNameMaster, UpdateExpenseNameMasterPayload>(
    'ExpenseNameMaster/updateExpenseNameMaster',
    async ({ _id, ...formData }, { rejectWithValue }) => {
        try {
            const response = await httpinstance.put(
                `society/expense_nameRoutes/${_id}/update`,
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


export const deleteExpenseNameMaster = createAsyncThunk(
    'ExpenseNameMasters/deleteExpenseNameMaster',
    async (_id: string, { rejectWithValue }) => {
        try {
            // Sending the ID as part of the URL
            await httpinstance.put(`society/expense_nameRoutes/${_id}/isdelete`, { isDeleted: true });
            return _id;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to delete Expense Name');
        }
    }
);




export const toggleExpenseNameMasterStatus = createAsyncThunk(
    'ExpenseNameMaster/toggleStatus',
    async (
        { _id, isActive }: { _id: string; isActive: boolean },
        { rejectWithValue }
    ) => {
        try {
            const res = await httpinstance.put(
                `society/expense_nameRoutes/${_id}/isactive`,
                { isActive }
            );
            return res.data.data;
        } catch (err: any) {
            console.error('Toggle Status Error:', err.response?.data || err.message);
            return rejectWithValue(err.response?.data?.message || 'Failed to toggle status');
        }
    }
);

const ExpenseNameMasterSlice = createSlice({
    name: 'ExpenseNameMasters',
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
            })

            .addCase(fetchExpenseCategoryMaster.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // .addCase(fetchExpenseCategoryMaster.pending, state => {
            //     state.loading = true;
            //     state.error = null;
            // })
            .addCase(fetchExpenseNameMaster.fulfilled, (state, action) => {
                state.loading = false;
                state.ExpenseNameMaster = action.payload.data;
                state.ExpenseCategoryMaster = action.payload.data;
                state.totalItems = action.payload.totalItems;
                state.totalPages = action.payload.totalPages;
                state.currentPage = action.payload.currentPage;
            })


            .addCase(fetchExpenseNameMaster.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            .addCase(fetchExpensetype.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchExpensetype.fulfilled, (state, action) => {
                state.loading = false;
                state.ExpenseTypeMaster = action.payload.data.expenseTypes;
                state.totalItems = action.payload.totalItems;
                state.totalPages = action.payload.totalPages;
                state.currentPage = action.payload.currentPage;
            })


            .addCase(fetchExpensetype.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })


            .addCase(addExpenseNameMaster.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addExpenseNameMaster.fulfilled, (state, action) => {
                state.ExpenseNameMaster.push(action.payload);
            })

            .addCase(addExpenseNameMaster.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            .addCase(updateExpenseNameMaster.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateExpenseNameMaster.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.ExpenseNameMaster.findIndex(item => item._id === action.payload._id);
                if (index !== -1) {
                    state.ExpenseNameMaster[index] = action.payload;
                }
            })
            .addCase(updateExpenseNameMaster.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
    },
});

export default ExpenseNameMasterSlice.reducer;