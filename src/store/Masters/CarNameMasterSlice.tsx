import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { httpinstance } from '../../axios/api';


type CarNameMasterState = {
    CarNameMaster: CarNameMaster[];
    CarBrandMaster: CarBrandMaster[];
    CarTransmission: CarTransmission[];
    totalItems: number;
    totalPages: number;
    currentPage: number;
    loading: boolean;
    error: string | null;
};


interface CarBrandMaster {
    _id: string;
    car_brand_name: string;
    isActive: boolean;
}


interface CarNameMaster {
    _id: string;
    car_name: string;
    car_brand_id: string;
    isActive: boolean;
}

interface CarTransmission {
    _id: string;
    car_transmission: string;
    isActive: boolean;
}


const initialState: CarNameMasterState = {
    CarNameMaster: [],
    CarBrandMaster: [],
    CarTransmission: [],
    totalItems: 0,
    totalPages: 0,
    currentPage: 0,
    loading: false,
    error: null,
};


export interface AddCarNameMasterPayload {
    car_brand_id: string;
    car_brand_name: string;
    car_name: string;

}

export interface UpdateCarNameMasterPayload {
    _id: string;
    car_brand_id: string;
    car_name: string;
}





export const fetchCarBrandMaster = createAsyncThunk(
    'CarBrandMaster/fetchCarBrandMaster',
    async (
        { search = '', page = 0, limit = 10 }: { search?: string; page?: number; limit?: number },
        { rejectWithValue }
    ) => {
        try {

            const response = await httpinstance.get(`product/carbrandRoute/getdata?&search=${search}&page=${page + 1}&limit=${10000}`);
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




export const fetchCarNameMaster = createAsyncThunk(
    'CarNameMaster/fetchCarNameMaster',
    async (
        { search = '', page = 0, limit = 10 }: { search?: string; page?: number; limit?: number },
        { rejectWithValue }
    ) => {
        try {

            const response = await httpinstance.get(`product/carnameRoute/getdata?&search=${search}&page=${page + 1}&limit=${limit}`);
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




export const fetchCarTransmission = createAsyncThunk(
    'CarNameMaster/fetchCarTransmission',
    async (
        { search = '', page = 0, limit = 10 }: { search?: string; page?: number; limit?: number },
        { rejectWithValue }
    ) => {
        try {

            const response = await httpinstance.get(`product/cartransmission/getdata?&search=${search}&page=${page + 1}&limit=${limit}`);
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




export const addCarNameMaster = createAsyncThunk<CarNameMaster, AddCarNameMasterPayload>(
    'CarNameMaster/addCarNameMaster',
    async (formData, { rejectWithValue }) => {
        try {
            const res = await httpinstance.post('product/carnameRoute/add', formData, {
                headers: { 'Content-Type': 'application/json' },
            });
            return res.data.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to add Car Name');
        }
    }
);


export const updateCarNameMaster = createAsyncThunk<CarNameMaster, UpdateCarNameMasterPayload>(
    'CarNameMaster/updateCarNameMaster',
    async ({ _id, ...formData }, { rejectWithValue }) => {
        try {
            const response = await httpinstance.put(
                `product/carnameRoute/${_id}/update`,
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


export const deleteCarNameMaster = createAsyncThunk(
    'CarNameMasters/deleteCarNameMaster',
    async (_id: string, { rejectWithValue }) => {
        try {
            // Sending the ID as part of the URL
            await httpinstance.put(`product/carnameRoute/${_id}/isdelete`, { isDeleted: true });
            return _id;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to delete Car Name');
        }
    }
);




export const toggleCarNameMasterStatus = createAsyncThunk(
    'CarNameMaster/toggleStatus',
    async (
        { _id, isActive }: { _id: string; isActive: boolean },
        { rejectWithValue }
    ) => {
        try {
            const res = await httpinstance.put(
                `product/carnameRoute/${_id}/isactive`,
                { isActive }
            );
            return res.data.data;
        } catch (err: any) {
            console.error('Toggle Status Error:', err.response?.data || err.message);
            return rejectWithValue(err.response?.data?.message || 'Failed to toggle status');
        }
    }
);

const CarNameMasterSlice = createSlice({
    name: 'CarNameMasters',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(fetchCarBrandMaster.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCarBrandMaster.fulfilled, (state, action) => {
                state.loading = false;
                state.CarBrandMaster = action.payload.data;
            })
            .addCase(fetchCarBrandMaster.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })


            .addCase(fetchCarTransmission.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCarTransmission.fulfilled, (state, action) => {
                state.loading = false;
                state.CarTransmission = action.payload.data.cartransmissions;
                state.totalItems = action.payload.totalItems;
                state.totalPages = action.payload.totalPages;
                state.currentPage = action.payload.currentPage;
            })
            .addCase(fetchCarTransmission.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })


            .addCase(fetchCarNameMaster.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCarNameMaster.fulfilled, (state, action) => {
                state.loading = false;
                state.CarNameMaster = action.payload.data;
                state.totalItems = action.payload.totalItems;
                state.totalPages = action.payload.totalPages;
                state.currentPage = action.payload.currentPage;
            })
            .addCase(fetchCarNameMaster.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })


            .addCase(addCarNameMaster.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addCarNameMaster.fulfilled, (state, action) => {
                state.CarNameMaster.push(action.payload);
            })
            .addCase(addCarNameMaster.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            
            .addCase(updateCarNameMaster.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateCarNameMaster.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.CarNameMaster.findIndex(item => item._id === action.payload._id);
                if (index !== -1) {
                    state.CarNameMaster[index] = action.payload;
                }
            })
            .addCase(updateCarNameMaster.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
    },
});

export default CarNameMasterSlice.reducer;