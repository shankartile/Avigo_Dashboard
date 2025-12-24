import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { httpinstance } from '../../axios/api';


type BikeColorMasterState = {
    BikeColorMaster: BikeColorMaster[];
    totalItems: number;
    totalPages: number;
    currentPage: number;
    loading: boolean;
    error: string | null;
};

interface BikeColorMaster {
    _id: string;
    bike_color_name: string;
    isActive: boolean;
}

const initialState: BikeColorMasterState = {
    BikeColorMaster: [],
    totalItems: 0,
    totalPages: 0,
    currentPage: 0,
    loading: false,
    error: null,
};


export interface AddBikeColorMasterPayload {
    bike_color_name: string;
    bike_color_code: string;


}

export interface UpdateBikeColorMasterPayload {
    _id: string;
    bike_color_name: string;
    bike_color_code: string;

}


export const fetchBikeColorMaster = createAsyncThunk(
    'BikeColorMaster/fetchBikeColorMaster',
    async (
        { search = '', page = 0, limit = 10 }: { search?: string; page?: number; limit?: number },
        { rejectWithValue }
    ) => {
        try {

            const response = await httpinstance.get(`product/bikecolorRoute/getdata?&search=${search}&page=${page + 1}&limit=${limit}`);
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



export const addBikeColorMaster = createAsyncThunk<BikeColorMaster, AddBikeColorMasterPayload>(
    'BikeColorMaster/addBikeColorMaster',
    async (formData, { rejectWithValue }) => {
        try {
            const res = await httpinstance.post('product/bikecolorRoute/add', formData, {
                headers: { 'Content-Type': 'application/json' },
            });
            return res.data.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to add Category');
        }
    }
);


export const updateBikeColorMaster = createAsyncThunk<BikeColorMaster, UpdateBikeColorMasterPayload>(
    'BikeColorMaster/updateBikeColorMaster',
    async ({ _id, ...formData }, { rejectWithValue }) => {
        try {
            const response = await httpinstance.put(
                `product/bikecolorRoute/${_id}/update`,
                formData,
                {
                    headers: { 'Content-Type': 'application/json' },
                }
            );
            return response.data.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to update Category');
        }
    }
);


export const deleteBikeColorMaster = createAsyncThunk(
    'BikeColorMasters/deleteBikeColorMaster',
    async (_id: string, { rejectWithValue }) => {
        try {
            // Sending the ID as part of the URL
            await httpinstance.put(`product/bikecolorRoute/${_id}/isdelete`, { isDeleted: true });
            return _id;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to delete Category');
        }
    }
);




export const toggleBikeColorMasterStatus = createAsyncThunk(
    'BikeColorMaster/toggleStatus',
    async (
        { _id, isActive }: { _id: string; isActive: boolean },
        { rejectWithValue }
    ) => {
        try {
            const res = await httpinstance.put(
                `product/bikecolorRoute/${_id}/isactive`,
                { isActive }
            );
            return res.data.data;
        } catch (err: any) {
            console.error('Toggle Status Error:', err.response?.data || err.message);
            return rejectWithValue(err.response?.data?.message || 'Failed to toggle status');
        }
    }
);

const BikeColorMasterSlice = createSlice({
    name: 'BikeColorMasters',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(fetchBikeColorMaster.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchBikeColorMaster.fulfilled, (state, action) => {
                state.loading = false;
                state.BikeColorMaster = action.payload.data;
                state.totalItems = action.payload.totalItems;
                state.totalPages = action.payload.totalPages;
                state.currentPage = action.payload.currentPage;
            })


            .addCase(fetchBikeColorMaster.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            .addCase(addBikeColorMaster.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addBikeColorMaster.fulfilled, (state, action) => {
                state.BikeColorMaster.push(action.payload);
            })

            .addCase(addBikeColorMaster.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            .addCase(updateBikeColorMaster.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateBikeColorMaster.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.BikeColorMaster.findIndex(item => item._id === action.payload._id);
                if (index !== -1) {
                    state.BikeColorMaster[index] = action.payload;
                }
            })
            .addCase(updateBikeColorMaster.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
    },
});

export default BikeColorMasterSlice.reducer;