import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { httpinstance } from '../../axios/api';


type BikeFueltypeMasterState = {
    BikeFueltypeMaster: BikeFueltypeMaster[];
    totalItems: number;
    totalPages: number;
    currentPage: number;
    loading: boolean;
    error: string | null;
};



interface BikeFueltypeMaster {
    _id: string;
    fueltype: string;
    isActive: boolean;
}

const initialState: BikeFueltypeMasterState = {
    BikeFueltypeMaster: [],
    totalItems: 0,
    totalPages: 0,
    currentPage: 0,
    loading: false,
    error: null,
};


export interface AddBikeFueltypeMasterPayload {
    fueltype: string;

}

export interface UpdateBikeFueltypeMasterPayload {
    _id: string;
    fueltype: string;
}


export const fetchBikeFueltypeMaster = createAsyncThunk(
    'BikeFueltypeMaster/fetchBikeFueltypeMaster',
    async (
        { search = '', page = 0, limit = 10 }: { search?: string; page?: number; limit?: number },
        { rejectWithValue }
    ) => {
        try {

            const response = await httpinstance.get(`product/bike_fueltypeRoutes/getdata?&search=${search}&page=${page + 1}&limit=${limit}`);
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



export const addBikeFueltypeMaster = createAsyncThunk<BikeFueltypeMaster, AddBikeFueltypeMasterPayload>(
    'BikeFueltypeMaster/addBikeFueltypeMaster',
    async (formData, { rejectWithValue }) => {
        try {
            const res = await httpinstance.post('product/bike_fueltypeRoutes/add', formData, {
                headers: { 'Content-Type': 'application/json' },
            });
            return res.data.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to add bike fueltype ');
        }
    }
);


export const updateBikeFueltypeMaster = createAsyncThunk<BikeFueltypeMaster, UpdateBikeFueltypeMasterPayload>(
    'BikeFueltypeMaster/updateBikeFueltypeMaster',
    async ({ _id, ...formData }, { rejectWithValue }) => {
        try {
            const response = await httpinstance.put(
                `product/bike_fueltypeRoutes/${_id}/update`,
                formData,
                {
                    headers: { 'Content-Type': 'application/json' },
                }
            );
            return response.data.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to update bike fueltype ');
        }
    }
);


export const deleteBikeFueltypeMaster = createAsyncThunk(
    'BikeFueltypeMasters/deleteBikeFueltypeMaster',
    async (_id: string, { rejectWithValue }) => {
        try {
            // Sending the ID as part of the URL
            await httpinstance.put(`product/bike_fueltypeRoutes/${_id}/isdelete`, { isDeleted: true });
            return _id;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to delete bike fueltype ');
        }
    }
);




export const toggleBikeFueltypeMasterStatus = createAsyncThunk(
    'BikeFueltypeMaster/toggleStatus',
    async (
        { _id, isActive }: { _id: string; isActive: boolean },
        { rejectWithValue }
    ) => {
        try {
            const res = await httpinstance.put(
                `product/bike_fueltypeRoutes/${_id}/isactive`,
                { isActive }
            );
            return res.data.data;
        } catch (err: any) {
            console.error('Toggle Status Error:', err.response?.data || err.message);
            return rejectWithValue(err.response?.data?.message || 'Failed to toggle status');
        }
    }
);

const BikeFueltypeMasterSlice = createSlice({
    name: 'BikeFueltypeMasters',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(fetchBikeFueltypeMaster.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchBikeFueltypeMaster.fulfilled, (state, action) => {
                state.loading = false;
                state.BikeFueltypeMaster = action.payload.data; 
                state.totalItems = action.payload.totalItems;
                state.totalPages = action.payload.totalPages;
                state.currentPage = action.payload.currentPage;
            })


            .addCase(fetchBikeFueltypeMaster.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            .addCase(addBikeFueltypeMaster.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addBikeFueltypeMaster.fulfilled, (state, action) => {
                state.BikeFueltypeMaster.push(action.payload);
            })

            .addCase(addBikeFueltypeMaster.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            .addCase(updateBikeFueltypeMaster.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateBikeFueltypeMaster.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.BikeFueltypeMaster.findIndex(item => item._id === action.payload._id);
                if (index !== -1) {
                    state.BikeFueltypeMaster[index] = action.payload;
                }
            })
            .addCase(updateBikeFueltypeMaster.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
    },
});

export default BikeFueltypeMasterSlice.reducer;