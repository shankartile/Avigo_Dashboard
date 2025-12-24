import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { httpinstance } from '../../axios/api';


type CarOwnershipMasterState = {
    CarOwnershipMaster: CarOwnershipMaster[];
    totalItems: number;
    totalPages: number;
    currentPage: number;
    loading: boolean;
    error: string | null;
};

interface CarOwnershipMaster {
    _id: string;
    ownership: string;
    isActive: boolean;
}

const initialState: CarOwnershipMasterState = {
    CarOwnershipMaster: [],
    totalItems: 0,
    totalPages: 0,
    currentPage: 0,
    loading: false,
    error: null,
};


export interface AddCarOwnershipMasterPayload {
    ownership: string;

}

export interface UpdateCarOwnershipMasterPayload {
    _id: string;
    ownership: string;
}


export const fetchCarOwnershipMaster = createAsyncThunk(
    'CarOwnershipMaster/fetchCarOwnershipMaster',
    async (
        { search = '', page = 0, limit = 10 }: { search?: string; page?: number; limit?: number },
        { rejectWithValue }
    ) => {
        try {

            const response = await httpinstance.get(`product/car_ownershipRoutes/getdata?&search=${search}&page=${page + 1}&limit=${limit}`);
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



export const addCarOwnershipMaster = createAsyncThunk<CarOwnershipMaster, AddCarOwnershipMasterPayload>(
    'CarOwnershipMaster/addCarOwnershipMaster',
    async (formData, { rejectWithValue }) => {
        try {
            const res = await httpinstance.post('product/car_ownershipRoutes/add', formData, {
                headers: { 'Content-Type': 'application/json' },
            });
            return res.data.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to add Car ownership ');
        }
    }
);


export const updateCarOwnershipMaster = createAsyncThunk<CarOwnershipMaster, UpdateCarOwnershipMasterPayload>(
    'CarOwnershipMaster/updateCarOwnershipMaster',
    async ({ _id, ...formData }, { rejectWithValue }) => {
        try {
            const response = await httpinstance.put(
                `product/car_ownershipRoutes/${_id}/update`,
                formData,
                {
                    headers: { 'Content-Type': 'application/json' },
                }
            );
            return response.data.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to update Car ownership ');
        }
    }
);


export const deleteCarOwnershipMaster = createAsyncThunk(
    'CarOwnershipMasters/deleteCarOwnershipMaster',
    async (_id: string, { rejectWithValue }) => {
        try {
            // Sending the ID as part of the URL
            await httpinstance.put(`product/car_ownershipRoutes/${_id}/isdelete`, { isDeleted: true });
            return _id;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to delete Car ownership ');
        }
    }
);




export const toggleCarOwnershipMasterStatus = createAsyncThunk(
    'CarOwnershipMaster/toggleStatus',
    async (
        { _id, isActive }: { _id: string; isActive: boolean },
        { rejectWithValue }
    ) => {
        try {
            const res = await httpinstance.put(
                `product/car_ownershipRoutes/${_id}/isactive`,
                { isActive }
            );
            return res.data.data;
        } catch (err: any) {
            console.error('Toggle Status Error:', err.response?.data || err.message);
            return rejectWithValue(err.response?.data?.message || 'Failed to toggle status');
        }
    }
);

const CarOwnershipMasterSlice = createSlice({
    name: 'CarOwnershipMasters',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(fetchCarOwnershipMaster.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCarOwnershipMaster.fulfilled, (state, action) => {
                state.loading = false;
                state.CarOwnershipMaster = action.payload.data; 
                state.totalItems = action.payload.totalItems;
                state.totalPages = action.payload.totalPages;
                state.currentPage = action.payload.currentPage;
            })

            .addCase(fetchCarOwnershipMaster.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            .addCase(addCarOwnershipMaster.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addCarOwnershipMaster.fulfilled, (state, action) => {
                state.CarOwnershipMaster.push(action.payload);
            })

            .addCase(addCarOwnershipMaster.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            .addCase(updateCarOwnershipMaster.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateCarOwnershipMaster.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.CarOwnershipMaster.findIndex(item => item._id === action.payload._id);
                if (index !== -1) {
                    state.CarOwnershipMaster[index] = action.payload;
                }
            })
            .addCase(updateCarOwnershipMaster.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
    },
});

export default CarOwnershipMasterSlice.reducer;