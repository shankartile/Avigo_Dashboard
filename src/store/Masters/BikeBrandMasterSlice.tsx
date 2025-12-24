import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { httpinstance } from '../../axios/api';


type BikeBrandMasterState = {
    BikeBrandMaster: BikeBrandMaster[];
    totalItems: number;
    totalPages: number;
    currentPage: number;
    loading: boolean;
    error: string | null;
};



interface BikeBrandMaster {
    _id: string;
    brand: string;
    bike_type: string;
    bike_type_name:string;
    bike_type_id: string;
    isActive: boolean;
}

const initialState: BikeBrandMasterState = {
    BikeBrandMaster: [],
    totalItems: 0,
    totalPages: 0,
    currentPage: 0,
    loading: false,
    error: null,
};


export interface AddBikeBrandMasterPayload {
    brand: string;
    bike_type_id: string;

}

export interface UpdateBikeBrandMasterPayload {
    _id: string;
    brand: string;
    bike_type_id: string;

}


export const fetchBikeBrandMaster = createAsyncThunk(
    'BikeBrandMaster/fetchBikeBrandMaster',
    async (
        { search = '', page = 0, limit = 10 }: { search?: string; page?: number; limit?: number },
        { rejectWithValue }
    ) => {
        try {

            const response = await httpinstance.get(`product/bike_brandRoutes/getdata?&search=${search}&page=${page + 1}&limit=${limit}`);
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



export const addBikeBrandMaster = createAsyncThunk<BikeBrandMaster, AddBikeBrandMasterPayload>(
    'BikeBrandMaster/addBikeBrandMaster',
    async (formData, { rejectWithValue }) => {
        try {
            const res = await httpinstance.post('product/bike_brandRoutes/add', formData, {
                headers: { 'Content-Type': 'application/json' },
            });
            return res.data.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to add bike Brand ');
        }
    }
);


export const updateBikeBrandMaster = createAsyncThunk<BikeBrandMaster, UpdateBikeBrandMasterPayload>(
    'BikeBrandMaster/updateBikeBrandMaster',
    async ({ _id, ...formData }, { rejectWithValue }) => {
        try {
            const response = await httpinstance.put(
                `product/bike_brandRoutes/${_id}/update`,
                formData,
                {
                    headers: { 'Content-Type': 'application/json' },
                }
            );
            return response.data.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to update bike Brand ');
        }
    }
);


export const deleteBikeBrandMaster = createAsyncThunk(
    'BikeBrandMasters/deleteBikeBrandMaster',
    async (_id: string, { rejectWithValue }) => {
        try {
            // Sending the ID as part of the URL
            await httpinstance.put(`product/bike_brandRoutes/${_id}/isdelete`, { isDeleted: true });
            return _id;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to delete bike Brand ');
        }
    }
);




export const toggleBikeBrandMasterStatus = createAsyncThunk(
    'BikeBrandMaster/toggleStatus',
    async (
        { _id, isActive }: { _id: string; isActive: boolean },
        { rejectWithValue }
    ) => {
        try {
            const res = await httpinstance.put(
                `product/bike_brandRoutes/${_id}/isactive`,
                { isActive }
            );
            return res.data.data;
        } catch (err: any) {
            console.error('Toggle Status Error:', err.response?.data || err.message);
            return rejectWithValue(err.response?.data?.message || 'Failed to toggle status');
        }
    }
);

const BikeBrandMasterSlice = createSlice({
    name: 'BikeBrandMasters',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(fetchBikeBrandMaster.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchBikeBrandMaster.fulfilled, (state, action) => {
                state.loading = false;
                state.BikeBrandMaster = action.payload.data;
                state.totalItems = action.payload.totalItems;
                state.totalPages = action.payload.totalPages;
                state.currentPage = action.payload.currentPage;
            })

            .addCase(fetchBikeBrandMaster.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            .addCase(addBikeBrandMaster.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addBikeBrandMaster.fulfilled, (state, action) => {
                state.BikeBrandMaster.push(action.payload);
            })

            .addCase(addBikeBrandMaster.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            .addCase(updateBikeBrandMaster.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateBikeBrandMaster.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.BikeBrandMaster.findIndex(item => item._id === action.payload._id);
                if (index !== -1) {
                    state.BikeBrandMaster[index] = action.payload;
                }
            })
            .addCase(updateBikeBrandMaster.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
    },
});

export default BikeBrandMasterSlice.reducer;