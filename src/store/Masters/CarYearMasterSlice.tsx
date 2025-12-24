import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { httpinstance } from '../../axios/api';


type CarYearMasterState = {
    CarYearMaster: CarYearMaster[];
    totalItems: number;
    totalPages: number;
    currentPage: number;
    loading: boolean;
    error: string | null;
};



interface CarYearMaster {
    _id: string;
    year: string;
    isActive: boolean;
}

const initialState: CarYearMasterState = {
    CarYearMaster: [],
    totalItems: 0,
    totalPages: 0,
    currentPage: 0,
    loading: false,
    error: null,
};


export interface AddCarYearMasterPayload {
    year: string;

}

export interface UpdateCarYearMasterPayload {
    _id: string;
    year: string;
}


export const fetchCarYearMaster = createAsyncThunk(
    'CarYearMaster/fetchCarYearMaster',
    async (
        { search = '', page = 0, limit = 10 }: { search?: string; page?: number; limit?: number },
        { rejectWithValue }
    ) => {
        try {

            const response = await httpinstance.get(`product/caryearRoute/getdata?&search=${search}&page=${page + 1}&limit=${limit}`);
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



export const addCarYearMaster = createAsyncThunk<CarYearMaster, AddCarYearMasterPayload>(
    'CarYearMaster/addCarYearMaster',
    async (formData, { rejectWithValue }) => {
        try {
            const res = await httpinstance.post('product/caryearRoute/add', formData, {
                headers: { 'Content-Type': 'application/json' },
            });
            return res.data.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to add Year');
        }
    }
);


export const updateCarYearMaster = createAsyncThunk<CarYearMaster, UpdateCarYearMasterPayload>(
    'CarYearMaster/updateCarYearMaster',
    async ({ _id, ...formData }, { rejectWithValue }) => {
        try {
            const response = await httpinstance.put(
                `product/caryearRoute/${_id}/update`,
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


export const deleteCarYearMaster = createAsyncThunk(
    'CarYearMasters/deleteCarYearMaster',
    async (_id: string, { rejectWithValue }) => {
        try {
            // Sending the ID as part of the URL
            await httpinstance.put(`product/caryearRoute/${_id}/isdelete`, { isDeleted: true });
            return _id;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to delete Year');
        }
    }
);




export const toggleCarYearMasterStatus = createAsyncThunk(
    'CarYearMaster/toggleStatus',
    async (
        { _id, isActive }: { _id: string; isActive: boolean },
        { rejectWithValue }
    ) => {
        try {
            const res = await httpinstance.put(
                `product/caryearRoute/${_id}/isactive`,
                { isActive }
            );
            return res.data.data;
        } catch (err: any) {
            console.error('Toggle Status Error:', err.response?.data || err.message);
            return rejectWithValue(err.response?.data?.message || 'Failed to toggle status');
        }
    }
);

const CarYearMasterSlice = createSlice({
    name: 'CarYearMasters',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(fetchCarYearMaster.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCarYearMaster.fulfilled, (state, action) => {
                state.loading = false;
                state.CarYearMaster = action.payload.data.years; 
                state.totalItems = action.payload.totalItems;
                state.totalPages = action.payload.totalPages;
                state.currentPage = action.payload.currentPage;
            })


            .addCase(fetchCarYearMaster.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            .addCase(addCarYearMaster.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addCarYearMaster.fulfilled, (state, action) => {
                state.CarYearMaster.push(action.payload);
            })

            .addCase(addCarYearMaster.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            .addCase(updateCarYearMaster.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateCarYearMaster.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.CarYearMaster.findIndex(item => item._id === action.payload._id);
                if (index !== -1) {
                    state.CarYearMaster[index] = action.payload;
                }
            })
            .addCase(updateCarYearMaster.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
    },
});

export default CarYearMasterSlice.reducer;