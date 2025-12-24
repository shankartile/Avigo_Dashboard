import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { httpinstance } from '../../axios/api';


type CarBrandMasterState = {
    CarBrandMaster: CarBrandMaster[];
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

const initialState: CarBrandMasterState = {
    CarBrandMaster: [],
    totalItems: 0,
    totalPages: 0,
    currentPage: 0,
    loading: false,
    error: null,
};


export interface AddCarBrandMasterPayload {
    car_brand_name: string;

}

export interface UpdateCarBrandMasterPayload {
    _id: string;
    car_brand_name: string;
}


export const fetchCarBrandMaster = createAsyncThunk(
    'CarBrandMaster/fetchCarBrandMaster',
    async (
        { search = '', page = 0, limit = 10 }: { search?: string; page?: number; limit?: number },
        { rejectWithValue }
    ) => {
        try {

            const response = await httpinstance.get(`product/carbrandRoute/getdata?&search=${search}&page=${page + 1}&limit=${limit}`);
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



export const addCarBrandMaster = createAsyncThunk<CarBrandMaster, AddCarBrandMasterPayload>(
    'CarBrandMaster/addCarBrandMaster',
    async (formData, { rejectWithValue }) => {
        try {
            const res = await httpinstance.post('product/carbrandRoute/add', formData, {
                headers: { 'Content-Type': 'application/json' },
            });
            return res.data.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to add Car Brand ');
        }
    }
);


export const updateCarBrandMaster = createAsyncThunk<CarBrandMaster, UpdateCarBrandMasterPayload>(
    'CarBrandMaster/updateCarBrandMaster',
    async ({ _id, ...formData }, { rejectWithValue }) => {
        try {
            const response = await httpinstance.put(
                `product/carbrandRoute/${_id}/update`,
                formData,
                {
                    headers: { 'Content-Type': 'application/json' },
                }
            );
            return response.data.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to update Car Brand ');
        }
    }
);


export const deleteCarBrandMaster = createAsyncThunk(
    'CarBrandMasters/deleteCarBrandMaster',
    async (_id: string, { rejectWithValue }) => {
        try {
            // Sending the ID as part of the URL
            await httpinstance.put(`product/carbrandRoute/${_id}/isdelete`, { isDeleted: true });
            return _id;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to delete Car Brand ');
        }
    }
);




export const toggleCarBrandMasterStatus = createAsyncThunk(
    'CarBrandMaster/toggleStatus',
    async (
        { _id, isActive }: { _id: string; isActive: boolean },
        { rejectWithValue }
    ) => {
        try {
            const res = await httpinstance.put(
                `product/carbrandRoute/${_id}/isactive`,
                { isActive }
            );
            return res.data.data;
        } catch (err: any) {
            console.error('Toggle Status Error:', err.response?.data || err.message);
            return rejectWithValue(err.response?.data?.message || 'Failed to toggle status');
        }
    }
);

const CarBrandMasterSlice = createSlice({
    name: 'CarBrandMasters',
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
                state.totalItems = action.payload.totalItems;
                state.totalPages = action.payload.totalPages;
                state.currentPage = action.payload.currentPage;
            })


            .addCase(fetchCarBrandMaster.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            .addCase(addCarBrandMaster.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addCarBrandMaster.fulfilled, (state, action) => {
                state.CarBrandMaster.push(action.payload);
            })

            .addCase(addCarBrandMaster.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            .addCase(updateCarBrandMaster.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateCarBrandMaster.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.CarBrandMaster.findIndex(item => item._id === action.payload._id);
                if (index !== -1) {
                    state.CarBrandMaster[index] = action.payload;
                }
            })
            .addCase(updateCarBrandMaster.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
    },
});

export default CarBrandMasterSlice.reducer;