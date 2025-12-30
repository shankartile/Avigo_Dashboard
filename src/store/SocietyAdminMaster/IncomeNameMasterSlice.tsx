import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { httpinstance } from '../../axios/api';


type IncomeNameMasterState = {
    IncomeNameMaster: IncomeNameMaster[];
    IncomeCategoryMaster: IncomeCategoryMaster[];
    IncomeTypeMaster: IncomeTypeMaster[];
    totalItems: number;
    totalPages: number;
    currentPage: number;
    loading: boolean;
    error: string | null;
};


interface IncomeCategoryMaster {
    _id: string;
    income_category_name: string;
    income_type_name: string;
    isActive: boolean;
}


interface IncomeNameMaster {
    _id: string;
    incomename: string;
    income_type_id: string;
    income_type_name: string;
    income_category_id: string;
    isActive: boolean;
}

interface IncomeTypeMaster {
    _id: string;
    income_type: string;
    isActive: boolean;
}

const initialState: IncomeNameMasterState = {
    IncomeNameMaster: [],
    IncomeCategoryMaster: [],
    IncomeTypeMaster: [],
    totalItems: 0,
    totalPages: 0,
    currentPage: 0,
    loading: false,
    error: null,
};


export interface AddIncomeNameMasterPayload {
    income_category_id: string;
    income_category_name: string;
    incomename: string;
    income_type_id: string;

}

export interface UpdateIncomeNameMasterPayload {
    _id: string;
    income_category_id: string;
    incomename: string;
    income_type_id: string;

}





export const fetchIncomeCategoryMaster = createAsyncThunk(
    'IncomeCategoryMaster/fetchIncomeCategoryMaster',
    async (_, { rejectWithValue }) => {
        try {
            const response = await httpinstance.get(`society/income_categoryRoute/getdata?page=1&limit=1000`);
            return {
                data: response.data.data, // assuming this has `.brands`
            };
        } catch (error: any) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);




export const fetchIncomeNameMaster = createAsyncThunk(
    'IncomeNameMaster/fetchIncomeNameMaster',
    async (
        { search = '', page = 0, limit = 10 }: { search?: string; page?: number; limit?: number },
        { rejectWithValue }
    ) => {
        try {

            const response = await httpinstance.get(`society/income_nameRoute/getdata?&search=${search}&page=${page + 1}&limit=${limit}`);
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


export const fetchIncometype = createAsyncThunk(
    'IncomeNameMaster/fetchIncometype',
    async (
        { search = '', page = 0, limit = 10 }: { search?: string; page?: number; limit?: number },
        { rejectWithValue }
    ) => {
        try {

            const response = await httpinstance.get(`society/income_typeRoutes/getdata?&search=${search}&page=${page + 1}&limit=${limit}`);
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


export const addIncomeNameMaster = createAsyncThunk<IncomeNameMaster, AddIncomeNameMasterPayload>(
    'IncomeNameMaster/addIncomeNameMaster',
    async (formData, { rejectWithValue }) => {
        try {
            const res = await httpinstance.post('society/income_nameRoute/add', formData, {
                headers: { 'Content-Type': 'application/json' },
            });
            return res.data.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to add State');
        }
    }
);


export const updateIncomeNameMaster = createAsyncThunk<IncomeNameMaster, UpdateIncomeNameMasterPayload>(
    'IncomeNameMaster/updateIncomeNameMaster',
    async ({ _id, ...formData }, { rejectWithValue }) => {
        try {
            const response = await httpinstance.put(
                `society/income_nameRoute/${_id}/update`,
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


export const deleteIncomeNameMaster = createAsyncThunk(
    'IncomeNameMasters/deleteIncomeNameMaster',
    async (_id: string, { rejectWithValue }) => {
        try {
            // Sending the ID as part of the URL
            await httpinstance.put(`society/income_nameRoute/${_id}/isdelete`, { isDeleted: true });
            return _id;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to delete Income Name');
        }
    }
);




export const toggleIncomeNameMasterStatus = createAsyncThunk(
    'IncomeNameMaster/toggleStatus',
    async (
        { _id, isActive }: { _id: string; isActive: boolean },
        { rejectWithValue }
    ) => {
        try {
            const res = await httpinstance.put(
                `society/income_nameRoute/${_id}/isactive`,
                { isActive }
            );
            return res.data.data;
        } catch (err: any) {
            console.error('Toggle Status Error:', err.response?.data || err.message);
            return rejectWithValue(err.response?.data?.message || 'Failed to toggle status');
        }
    }
);

const IncomeNameMasterSlice = createSlice({
    name: 'IncomeNameMasters',
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
            })

            .addCase(fetchIncomeCategoryMaster.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // .addCase(fetchIncomeCategoryMaster.pending, state => {
            //     state.loading = true;
            //     state.error = null;
            // })
            .addCase(fetchIncomeNameMaster.fulfilled, (state, action) => {
                state.loading = false;
                state.IncomeNameMaster = action.payload.data;
                state.IncomeCategoryMaster = action.payload.data;
                state.totalItems = action.payload.totalItems;
                state.totalPages = action.payload.totalPages;
                state.currentPage = action.payload.currentPage;
            })


            .addCase(fetchIncomeNameMaster.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            .addCase(fetchIncometype.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchIncometype.fulfilled, (state, action) => {
                state.loading = false;
                state.IncomeTypeMaster = action.payload.data.incomeTypes;
                state.totalItems = action.payload.totalItems;
                state.totalPages = action.payload.totalPages;
                state.currentPage = action.payload.currentPage;
            })


            .addCase(fetchIncometype.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })


            .addCase(addIncomeNameMaster.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addIncomeNameMaster.fulfilled, (state, action) => {
                state.IncomeNameMaster.push(action.payload);
            })

            .addCase(addIncomeNameMaster.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            .addCase(updateIncomeNameMaster.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateIncomeNameMaster.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.IncomeNameMaster.findIndex(item => item._id === action.payload._id);
                if (index !== -1) {
                    state.IncomeNameMaster[index] = action.payload;
                }
            })
            .addCase(updateIncomeNameMaster.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
    },
});

export default IncomeNameMasterSlice.reducer;