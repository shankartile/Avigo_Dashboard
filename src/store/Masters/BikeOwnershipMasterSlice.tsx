import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { httpinstance } from '../../axios/api';


type BikeOwnershipMasterState = {
    BikeOwnershipMaster: BikeOwnershipMaster[];
    totalItems: number;
    totalPages: number;
    currentPage: number;
    loading: boolean;
    error: string | null;
};

interface BikeOwnershipMaster {
    _id: string;
    ownership: string;
    isActive: boolean;
}

const initialState: BikeOwnershipMasterState = {
    BikeOwnershipMaster: [],
    totalItems: 0,
    totalPages: 0,
    currentPage: 0,
    loading: false,
    error: null,
};


export interface AddBikeOwnershipMasterPayload {
    ownership: string;

}

export interface UpdateBikeOwnershipMasterPayload {
    _id: string;
    ownership: string;
}


export const fetchBikeOwnershipMaster = createAsyncThunk(
    'BikeOwnershipMaster/fetchBikeOwnershipMaster',
    async (
        { search = '', page = 0, limit = 10 }: { search?: string; page?: number; limit?: number },
        { rejectWithValue }
    ) => {
        try {

            const response = await httpinstance.get(`product/bike_ownershipRoutes/getdata?&search=${search}&page=${page + 1}&limit=${limit}`);
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



export const addBikeOwnershipMaster = createAsyncThunk<BikeOwnershipMaster, AddBikeOwnershipMasterPayload>(
    'BikeOwnershipMaster/addBikeOwnershipMaster',
    async (formData, { rejectWithValue }) => {
        try {
            const res = await httpinstance.post('product/bike_ownershipRoutes/add', formData, {
                headers: { 'Content-Type': 'application/json' },
            });
            return res.data.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to add bike ownership ');
        }
    }
);


export const updateBikeOwnershipMaster = createAsyncThunk<BikeOwnershipMaster, UpdateBikeOwnershipMasterPayload>(
    'BikeOwnershipMaster/updateBikeOwnershipMaster',
    async ({ _id, ...formData }, { rejectWithValue }) => {
        try {
            const response = await httpinstance.put(
                `product/bike_ownershipRoutes/${_id}/update`,
                formData,
                {
                    headers: { 'Content-Type': 'application/json' },
                }
            );
            return response.data.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to update bike ownership ');
        }
    }
);


export const deleteBikeOwnershipMaster = createAsyncThunk(
    'BikeOwnershipMasters/deleteBikeOwnershipMaster',
    async (_id: string, { rejectWithValue }) => {
        try {
            // Sending the ID as part of the URL
            await httpinstance.put(`product/bike_ownershipRoutes/${_id}/isdelete`, { isDeleted: true });
            return _id;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to delete bike ownership ');
        }
    }
);




export const toggleBikeOwnershipMasterStatus = createAsyncThunk(
    'BikeOwnershipMaster/toggleStatus',
    async (
        { _id, isActive }: { _id: string; isActive: boolean },
        { rejectWithValue }
    ) => {
        try {
            const res = await httpinstance.put(
                `product/bike_ownershipRoutes/${_id}/isactive`,
                { isActive }
            );
            return res.data.data;
        } catch (err: any) {
            console.error('Toggle Status Error:', err.response?.data || err.message);
            return rejectWithValue(err.response?.data?.message || 'Failed to toggle status');
        }
    }
);

const BikeOwnershipMasterSlice = createSlice({
    name: 'BikeOwnershipMasters',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(fetchBikeOwnershipMaster.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchBikeOwnershipMaster.fulfilled, (state, action) => {
                state.loading = false;
                state.BikeOwnershipMaster = action.payload.data; 
                state.totalItems = action.payload.totalItems;
                state.totalPages = action.payload.totalPages;
                state.currentPage = action.payload.currentPage;
            })

            .addCase(fetchBikeOwnershipMaster.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            .addCase(addBikeOwnershipMaster.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addBikeOwnershipMaster.fulfilled, (state, action) => {
                state.BikeOwnershipMaster.push(action.payload);
            })

            .addCase(addBikeOwnershipMaster.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            .addCase(updateBikeOwnershipMaster.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateBikeOwnershipMaster.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.BikeOwnershipMaster.findIndex(item => item._id === action.payload._id);
                if (index !== -1) {
                    state.BikeOwnershipMaster[index] = action.payload;
                }
            })
            .addCase(updateBikeOwnershipMaster.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
    },
});

export default BikeOwnershipMasterSlice.reducer;