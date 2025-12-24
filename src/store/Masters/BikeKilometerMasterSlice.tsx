import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { httpinstance } from '../../axios/api';


type BikekilometerMasterState = {
    BikekilometerMaster: BikekilometerMaster[];
    totalItems: number;
    totalPages: number;
    currentPage: number;
    loading: boolean;
    error: string | null;
};



interface BikekilometerMaster {
    _id: string;
    year: string;
}

const initialState: BikekilometerMasterState = {
    BikekilometerMaster: [],
    totalItems: 0,
    totalPages: 0,
    currentPage: 0,
    loading: false,
    error: null,
};


export interface AddBikekilometerMasterPayload {
    kilometer: string;

}

export interface UpdateBikekilometerMasterPayload {
    _id: string;
    kilometer: string;
}


export const fetchBikekilometerMaster = createAsyncThunk(
    'BikekilometerMaster/fetchBikekilometerMaster',
    async (
        { search = '', page = 0, limit = 10 }: { search?: string; page?: number; limit?: number },
        { rejectWithValue }
    ) => {
        try {

            const response = await httpinstance.get(`product/bikekilometerRoute/getdata?&search=${search}&page=${page + 1}&limit=${limit}`);
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



export const addBikekilometerMaster = createAsyncThunk<BikekilometerMaster, AddBikekilometerMasterPayload>(
    'BikekilometerMaster/addBikekilometerMaster',
    async (formData, { rejectWithValue }) => {
        try {
            const res = await httpinstance.post('product/bikekilometerRoute/add', formData, {
                headers: { 'Content-Type': 'application/json' },
            });
            return res.data.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to add Year');
        }
    }
);


export const updateBikekilometerMaster = createAsyncThunk<BikekilometerMaster, UpdateBikekilometerMasterPayload>(
    'BikekilometerMaster/updateBikekilometerMaster',
    async ({ _id, ...formData }, { rejectWithValue }) => {
        try {
            const response = await httpinstance.put(
                `product/bikekilometerRoute/${_id}/update`,
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


export const deleteBikekilometerMaster = createAsyncThunk(
    'BikekilometerMasters/deleteBikekilometerMaster',
    async (_id: string, { rejectWithValue }) => {
        try {
            // Sending the ID as part of the URL
            await httpinstance.put(`product/bikekilometerRoute/${_id}/isdelete`, { isDeleted: true });
            return _id;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to delete Year');
        }
    }
);




export const toggleBikekilometerMasterStatus = createAsyncThunk(
    'BikekilometerMaster/toggleStatus',
    async (
        { _id, isActive }: { _id: string; isActive: boolean },
        { rejectWithValue }
    ) => {
        try {
            const res = await httpinstance.put(
                `product/bikekilometerRoute/${_id}/isactive`,
                { isActive }
            );
            return res.data.data;
        } catch (err: any) {
            console.error('Toggle Status Error:', err.response?.data || err.message);
            return rejectWithValue(err.response?.data?.message || 'Failed to toggle status');
        }
    }
);

const BikeKilometerMasterSlice = createSlice({
    name: 'BikekilometerMasters',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(fetchBikekilometerMaster.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchBikekilometerMaster.fulfilled, (state, action) => {
                state.loading = false;
                state.BikekilometerMaster = action.payload.data.kilometers; 
                state.totalItems = action.payload.totalItems;
                state.totalPages = action.payload.totalPages;
                state.currentPage = action.payload.currentPage;
            })


            .addCase(fetchBikekilometerMaster.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            .addCase(addBikekilometerMaster.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addBikekilometerMaster.fulfilled, (state, action) => {
                state.BikekilometerMaster.push(action.payload);
            })

            .addCase(addBikekilometerMaster.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            .addCase(updateBikekilometerMaster.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateBikekilometerMaster.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.BikekilometerMaster.findIndex(item => item._id === action.payload._id);
                if (index !== -1) {
                    state.BikekilometerMaster[index] = action.payload;
                }
            })
            .addCase(updateBikekilometerMaster.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
    },
});

export default BikeKilometerMasterSlice.reducer;