import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { httpinstance } from '../../axios/api';


type BikeYearMasterState = {
    BikeYearMaster: BikeYearMaster[];
    totalItems: number;
    totalPages: number;
    currentPage: number;
    loading: boolean;
    error: string | null;
};



interface BikeYearMaster {
    _id: string;
    year: string;
    isActive: boolean;
}

const initialState: BikeYearMasterState = {
    BikeYearMaster: [],
    totalItems: 0,
    totalPages: 0,
    currentPage: 0,
    loading: false,
    error: null,
};


export interface AddBikeYearMasterPayload {
    year: string;

}

export interface UpdateBikeYearMasterPayload {
    _id: string;
    year: string;
}


export const fetchBikeYearMaster = createAsyncThunk(
    'BikeYearMaster/fetchBikeYearMaster',
    async (
        { search = '', page = 0, limit = 10 }: { search?: string; page?: number; limit?: number },
        { rejectWithValue }
    ) => {
        try {

            const response = await httpinstance.get(`product/bikeyearRoute/getdata?&search=${search}&page=${page + 1}&limit=${limit}`);
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



export const addBikeYearMaster = createAsyncThunk<BikeYearMaster, AddBikeYearMasterPayload>(
    'BikeYearMaster/addBikeYearMaster',
    async (formData, { rejectWithValue }) => {
        try {
            const res = await httpinstance.post('product/bikeyearRoute/add', formData, {
                headers: { 'Content-Type': 'application/json' },
            });
            return res.data.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to add Year');
        }
    }
);


export const updateBikeYearMaster = createAsyncThunk<BikeYearMaster, UpdateBikeYearMasterPayload>(
    'BikeYearMaster/updateBikeYearMaster',
    async ({ _id, ...formData }, { rejectWithValue }) => {
        try {
            const response = await httpinstance.put(
                `product/bikeyearRoute/${_id}/update`,
                formData,
                {
                    headers: { 'Content-Type': 'application/json' },
                }
            );
            return response.data.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to update Year');
        }
    }
);


export const deleteBikeYearMaster = createAsyncThunk(
    'BikeYearMasters/deleteBikeYearMaster',
    async (_id: string, { rejectWithValue }) => {
        try {
            // Sending the ID as part of the URL
            await httpinstance.put(`product/bikeyearRoute/${_id}/isdelete`, { isDeleted: true });
            return _id;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to delete Year');
        }
    }
);




export const toggleBikeYearMasterStatus = createAsyncThunk(
    'BikeYearMaster/toggleStatus',
    async (
        { _id, isActive }: { _id: string; isActive: boolean },
        { rejectWithValue }
    ) => {
        try {
            const res = await httpinstance.put(
                `product/bikeyearRoute/${_id}/isactive`,
                { isActive }
            );
            return res.data.data;
        } catch (err: any) {
            console.error('Toggle Status Error:', err.response?.data || err.message);
            return rejectWithValue(err.response?.data?.message || 'Failed to toggle status');
        }
    }
);

const BikeYearMasterSlice = createSlice({
    name: 'BikeYearMasters',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(fetchBikeYearMaster.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchBikeYearMaster.fulfilled, (state, action) => {
                state.loading = false;
                state.BikeYearMaster = action.payload.data.years; 
                state.totalItems = action.payload.totalItems;
                state.totalPages = action.payload.totalPages;
                state.currentPage = action.payload.currentPage;
            })


            .addCase(fetchBikeYearMaster.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            .addCase(addBikeYearMaster.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addBikeYearMaster.fulfilled, (state, action) => {
                state.BikeYearMaster.push(action.payload);
            })

            .addCase(addBikeYearMaster.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            .addCase(updateBikeYearMaster.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateBikeYearMaster.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.BikeYearMaster.findIndex(item => item._id === action.payload._id);
                if (index !== -1) {
                    state.BikeYearMaster[index] = action.payload;
                }
            })
            .addCase(updateBikeYearMaster.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
    },
});

export default BikeYearMasterSlice.reducer;