import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { httpinstance } from '../../axios/api';


type CarFueltypeMasterState = {
    CarFueltypeMaster: CarFueltypeMaster[];
    totalItems: number;
    totalPages: number;
    currentPage: number;
    loading: boolean;
    error: string | null;
};



interface CarFueltypeMaster {
    _id: string;
    fueltype: string;
    isActive: boolean;
}

const initialState: CarFueltypeMasterState = {
    CarFueltypeMaster: [],
    totalItems: 0,
    totalPages: 0,
    currentPage: 0,
    loading: false,
    error: null,
};


export interface AddCarFueltypeMasterPayload {
    fueltype: string;

}

export interface UpdateCarFueltypeMasterPayload {
    _id: string;
    fueltype: string;
}


export const fetchCarFueltypeMaster = createAsyncThunk(
    'CarFueltypeMaster/fetchCarFueltypeMaster',
    async (
        { search = '', page = 0, limit = 10 }: { search?: string; page?: number; limit?: number },
        { rejectWithValue }
    ) => {
        try {

            const response = await httpinstance.get(`product/car_fueltypeRoutes/getdata?&search=${search}&page=${page + 1}&limit=${limit}`);
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



export const addCarFueltypeMaster = createAsyncThunk<CarFueltypeMaster, AddCarFueltypeMasterPayload>(
    'CarFueltypeMaster/addCarFueltypeMaster',
    async (formData, { rejectWithValue }) => {
        try {
            const res = await httpinstance.post('product/car_fueltypeRoutes/add', formData, {
                headers: { 'Content-Type': 'application/json' },
            });
            return res.data.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to add Car fueltype ');
        }
    }
);


export const updateCarFueltypeMaster = createAsyncThunk<CarFueltypeMaster, UpdateCarFueltypeMasterPayload>(
    'CarFueltypeMaster/updateCarFueltypeMaster',
    async ({ _id, ...formData }, { rejectWithValue }) => {
        try {
            const response = await httpinstance.put(
                `product/car_fueltypeRoutes/${_id}/update`,
                formData,
                {
                    headers: { 'Content-Type': 'application/json' },
                }
            );
            return response.data.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to update Car fueltype ');
        }
    }
);


export const deleteCarFueltypeMaster = createAsyncThunk(
    'CarFueltypeMasters/deleteCarFueltypeMaster',
    async (_id: string, { rejectWithValue }) => {
        try {
            // Sending the ID as part of the URL
            await httpinstance.put(`product/car_fueltypeRoutes/${_id}/isdelete`, { isDeleted: true });
            return _id;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to delete Car fueltype ');
        }
    }
);




export const toggleCarFueltypeMasterStatus = createAsyncThunk(
    'CarFueltypeMaster/toggleStatus',
    async (
        { _id, isActive }: { _id: string; isActive: boolean },
        { rejectWithValue }
    ) => {
        try {
            const res = await httpinstance.put(
                `product/car_fueltypeRoutes/${_id}/isactive`,
                { isActive }
            );
            return res.data.data;
        } catch (err: any) {
            console.error('Toggle Status Error:', err.response?.data || err.message);
            return rejectWithValue(err.response?.data?.message || 'Failed to toggle status');
        }
    }
);

const CarFueltypeMasterSlice = createSlice({
    name: 'CarFueltypeMasters',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(fetchCarFueltypeMaster.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCarFueltypeMaster.fulfilled, (state, action) => {
                state.loading = false;
                state.CarFueltypeMaster = action.payload.data; 
                state.totalItems = action.payload.totalItems;
                state.totalPages = action.payload.totalPages;
                state.currentPage = action.payload.currentPage;
            })


            .addCase(fetchCarFueltypeMaster.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            .addCase(addCarFueltypeMaster.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addCarFueltypeMaster.fulfilled, (state, action) => {
                state.CarFueltypeMaster.push(action.payload);
            })

            .addCase(addCarFueltypeMaster.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            .addCase(updateCarFueltypeMaster.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateCarFueltypeMaster.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.CarFueltypeMaster.findIndex(item => item._id === action.payload._id);
                if (index !== -1) {
                    state.CarFueltypeMaster[index] = action.payload;
                }
            })
            .addCase(updateCarFueltypeMaster.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
    },
});

export default CarFueltypeMasterSlice.reducer;