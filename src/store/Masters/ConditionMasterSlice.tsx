import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { httpinstance } from '../../axios/api';


type ConditionMasterState = {
    ConditionMaster: ConditionMaster[];
    totalItems: number;
    totalPages: number;
    currentPage: number;
    loading: boolean;
    error: string | null;
};



interface ConditionMaster {
    _id: string;
    condition: string;
    isActive: boolean;
}

const initialState: ConditionMasterState = {
    ConditionMaster: [],
    totalItems: 0,
    totalPages: 0,
    currentPage: 0,
    loading: false,
    error: null,
};


export interface AddConditionMasterPayload {
    condition: string;

}

export interface UpdateConditionMasterPayload {
    _id: string;
    condition: string;
}


export const fetchConditionMaster = createAsyncThunk(
    'ConditionMaster/fetchConditionMaster',
    async (
        { search = '', page = 0, limit = 10 }: { search?: string; page?: number; limit?: number },
        { rejectWithValue }
    ) => {
        try {

            const response = await httpinstance.get(`product/spareconditionRoute/getdata?&search=${search}&page=${page + 1}&limit=${limit}`);
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



export const addConditionMaster = createAsyncThunk<ConditionMaster, AddConditionMasterPayload>(
    'ConditionMaster/addConditionMaster',
    async (formData, { rejectWithValue }) => {
        try {
            const res = await httpinstance.post('product/spareconditionRoute/add', formData, {
                headers: { 'Content-Type': 'application/json' },
            });
            return res.data.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to add condition ');
        }
    }
);

     

export const updateConditionMaster = createAsyncThunk<ConditionMaster, UpdateConditionMasterPayload>(
    'ConditionMaster/updateConditionMaster',
    async ({ _id, ...formData }, { rejectWithValue }) => {
        try {
            const response = await httpinstance.put(
                `product/spareconditionRoute/${_id}/update`,
                formData,
                {
                    headers: { 'Content-Type': 'application/json' },
                }
            );
            return response.data.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to update condition ');
        }
    }
);


export const deleteConditionMaster = createAsyncThunk(
    'ConditionMasters/deleteConditionMaster',
    async (_id: string, { rejectWithValue }) => {
        try {
            // Sending the ID as part of the URL
            await httpinstance.put(`product/spareconditionRoute/${_id}/isdelete`, { isDeleted: true });
            return _id;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to delete condition ');
        }
    }
);




export const toggleConditionMasterStatus = createAsyncThunk(
    'ConditionMaster/toggleStatus',
    async (
        { _id, isActive }: { _id: string; isActive: boolean },
        { rejectWithValue }
    ) => {
        try {
            const res = await httpinstance.put(
                `product/spareconditionRoute/${_id}/isactive`,
                { isActive }
            );
            return res.data.data;
        } catch (err: any) {
            console.error('Toggle Status Error:', err.response?.data || err.message);
            return rejectWithValue(err.response?.data?.message || 'Failed to toggle status');
        }
    }
);

const ConditionMasterSlice = createSlice({
    name: 'ConditionMasters',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(fetchConditionMaster.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchConditionMaster.fulfilled, (state, action) => {
                state.loading = false;
                state.ConditionMaster = action.payload.data.conditions;
                state.totalItems = action.payload.totalItems;
                state.totalPages = action.payload.totalPages;
                state.currentPage = action.payload.currentPage;
            })


            .addCase(fetchConditionMaster.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            .addCase(addConditionMaster.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addConditionMaster.fulfilled, (state, action) => {
                state.ConditionMaster.push(action.payload);
            })

            .addCase(addConditionMaster.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            .addCase(updateConditionMaster.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateConditionMaster.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.ConditionMaster.findIndex(item => item._id === action.payload._id);
                if (index !== -1) {
                    state.ConditionMaster[index] = action.payload;
                }
            })
            .addCase(updateConditionMaster.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
    },
});

export default ConditionMasterSlice.reducer;