import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { httpinstance } from '../../axios/api';


type BikeNameMasterState = {
    BikeNameMaster: BikeNameMaster[];
    BikeBrandMaster: BikeBrandMaster[];
    BikeTypeMaster: BikeTypeMaster[];
    totalItems: number;
    totalPages: number;
    currentPage: number;
    loading: boolean;
    error: string | null;
};


interface BikeBrandMaster {
    _id: string;
    bike_brand_name: string;
    bike_type_name: string;
    isActive: boolean;
}


interface BikeNameMaster {
    _id: string;
    bikename: string;
    bike_type_id: string;
    bike_type_name: string;
    bike_brand_id: string;
    isActive: boolean;
}

interface BikeTypeMaster {
    _id: string;
    bike_type: string;
    isActive: boolean;
}

const initialState: BikeNameMasterState = {
    BikeNameMaster: [],
    BikeBrandMaster: [],
    BikeTypeMaster: [],
    totalItems: 0,
    totalPages: 0,
    currentPage: 0,
    loading: false,
    error: null,
};


export interface AddBikeNameMasterPayload {
    bike_brand_id: string;
    bike_brand_name: string;
    bikename: string;
    bike_type_id: string;

}

export interface UpdateBikeNameMasterPayload {
    _id: string;
    bike_brand_id: string;
    bikename: string;
    bike_type_id: string;

}





export const fetchBikeBrandMaster = createAsyncThunk(
    'BikeBrandMaster/fetchBikeBrandMaster',
    async (_, { rejectWithValue }) => {
        try {
            const response = await httpinstance.get(`product/bike_brandRoutes/getdata?page=1&limit=1000`);
            return {
                data: response.data.data, // assuming this has `.brands`
            };
        } catch (error: any) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);




export const fetchBikeNameMaster = createAsyncThunk(
    'BikeNameMaster/fetchBikeNameMaster',
    async (
        { search = '', page = 0, limit = 10 }: { search?: string; page?: number; limit?: number },
        { rejectWithValue }
    ) => {
        try {

            const response = await httpinstance.get(`product/bike_nameRoutes/getdata?&search=${search}&page=${page + 1}&limit=${limit}`);
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


export const fetchBiketype = createAsyncThunk(
    'CarNameMaster/fetchBiketype',
    async (
        { search = '', page = 0, limit = 10 }: { search?: string; page?: number; limit?: number },
        { rejectWithValue }
    ) => {
        try {

            const response = await httpinstance.get(`product/bike_typeRoutes/getdata?&search=${search}&page=${page + 1}&limit=${limit}`);
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


export const addBikeNameMaster = createAsyncThunk<BikeNameMaster, AddBikeNameMasterPayload>(
    'BikeNameMaster/addBikeNameMaster',
    async (formData, { rejectWithValue }) => {
        try {
            const res = await httpinstance.post('product/bike_nameRoutes/add', formData, {
                headers: { 'Content-Type': 'application/json' },
            });
            return res.data.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to add State');
        }
    }
);


export const updateBikeNameMaster = createAsyncThunk<BikeNameMaster, UpdateBikeNameMasterPayload>(
    'BikeNameMaster/updateBikeNameMaster',
    async ({ _id, ...formData }, { rejectWithValue }) => {
        try {
            const response = await httpinstance.put(
                `product/bike_nameRoutes/${_id}/update`,
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


export const deleteBikeNameMaster = createAsyncThunk(
    'BikeNameMasters/deleteBikeNameMaster',
    async (_id: string, { rejectWithValue }) => {
        try {
            // Sending the ID as part of the URL
            await httpinstance.put(`product/bike_nameRoutes/${_id}/isdelete`, { isDeleted: true });
            return _id;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to delete Car Name');
        }
    }
);




export const toggleBikeNameMasterStatus = createAsyncThunk(
    'BikeNameMaster/toggleStatus',
    async (
        { _id, isActive }: { _id: string; isActive: boolean },
        { rejectWithValue }
    ) => {
        try {
            const res = await httpinstance.put(
                `product/bike_nameRoutes/${_id}/isactive`,
                { isActive }
            );
            return res.data.data;
        } catch (err: any) {
            console.error('Toggle Status Error:', err.response?.data || err.message);
            return rejectWithValue(err.response?.data?.message || 'Failed to toggle status');
        }
    }
);

const BikeNameMasterSlice = createSlice({
    name: 'BikeNameMasters',
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
            })

            .addCase(fetchBikeBrandMaster.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            .addCase(fetchBikeNameMaster.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchBikeNameMaster.fulfilled, (state, action) => {
                state.loading = false;
                state.BikeNameMaster = action.payload.data;
                state.BikeBrandMaster = action.payload.data;
                state.totalItems = action.payload.totalItems;
                state.totalPages = action.payload.totalPages;
                state.currentPage = action.payload.currentPage;
            })


            .addCase(fetchBikeNameMaster.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            .addCase(fetchBiketype.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchBiketype.fulfilled, (state, action) => {
                state.loading = false;
                state.BikeTypeMaster = action.payload.data.bikeTypes;
                state.totalItems = action.payload.totalItems;
                state.totalPages = action.payload.totalPages;
                state.currentPage = action.payload.currentPage;
            })


            .addCase(fetchBiketype.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })


            .addCase(addBikeNameMaster.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addBikeNameMaster.fulfilled, (state, action) => {
                state.BikeNameMaster.push(action.payload);
            })

            .addCase(addBikeNameMaster.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            .addCase(updateBikeNameMaster.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateBikeNameMaster.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.BikeNameMaster.findIndex(item => item._id === action.payload._id);
                if (index !== -1) {
                    state.BikeNameMaster[index] = action.payload;
                }
            })
            .addCase(updateBikeNameMaster.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
    },
});

export default BikeNameMasterSlice.reducer;