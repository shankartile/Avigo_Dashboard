import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { httpinstance } from '../../axios/api';


type CarColorMasterState = {
    CarColorMaster: CarColorMaster[];
    totalItems: number;
    totalPages: number;
    currentPage: number;
    loading: boolean;
    error: string | null;
};

interface CarColorMaster {
    _id: string;
    color_name: string;
    isActive: boolean;
}

const initialState: CarColorMasterState = {
    CarColorMaster: [],
    totalItems: 0,
    totalPages: 0,
    currentPage: 0,
    loading: false,
    error: null,
};


export interface AddCarColorMasterPayload {
    color_name: string;
    color_code: string;


}

export interface UpdateCarColorMasterPayload {
    _id: string;
    color_name: string;
    color_code: string;

}


export const fetchCarColorMaster = createAsyncThunk(
    'CarColorMaster/fetchCarColorMaster',
    async (
        { search = '', page = 0, limit = 10 }: { search?: string; page?: number; limit?: number },
        { rejectWithValue }
    ) => {
        try {

            const response = await httpinstance.get(`product/colorRoute/getdata?&search=${search}&page=${page + 1}&limit=${limit}`);
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



export const addCarColorMaster = createAsyncThunk<CarColorMaster, AddCarColorMasterPayload>(
    'CarColorMaster/addCarColorMaster',
    async (formData, { rejectWithValue }) => {
        try {
            const res = await httpinstance.post('product/colorRoute/add', formData, {
                headers: { 'Content-Type': 'application/json' },
            });
            return res.data.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to add Category');
        }
    }
);


export const updateCarColorMaster = createAsyncThunk<CarColorMaster, UpdateCarColorMasterPayload>(
    'CarColorMaster/updateCarColorMaster',
    async ({ _id, ...formData }, { rejectWithValue }) => {
        try {
            const response = await httpinstance.put(
                `product/colorRoute/${_id}/update`,
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


export const deleteCarColorMaster = createAsyncThunk(
    'CarColorMasters/deleteCarColorMaster',
    async (_id: string, { rejectWithValue }) => {
        try {
            // Sending the ID as part of the URL
            await httpinstance.put(`product/colorRoute/${_id}/isdelete`, { isDeleted: true });
            return _id;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to delete Category');
        }
    }
);




export const toggleCarColorMasterStatus = createAsyncThunk(
    'CarColorMaster/toggleStatus',
    async (
        { _id, isActive }: { _id: string; isActive: boolean },
        { rejectWithValue }
    ) => {
        try {
            const res = await httpinstance.put(
                `product/colorRoute/${_id}/isactive`,
                { isActive }
            );
            return res.data.data;
        } catch (err: any) {
            console.error('Toggle Status Error:', err.response?.data || err.message);
            return rejectWithValue(err.response?.data?.message || 'Failed to toggle status');
        }
    }
);

const CarColorMasterSlice = createSlice({
    name: 'CarColorMasters',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(fetchCarColorMaster.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCarColorMaster.fulfilled, (state, action) => {
                state.loading = false;
                state.CarColorMaster = action.payload.data;
                state.totalItems = action.payload.totalItems;
                state.totalPages = action.payload.totalPages;
                state.currentPage = action.payload.currentPage;
            })


            .addCase(fetchCarColorMaster.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            .addCase(addCarColorMaster.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addCarColorMaster.fulfilled, (state, action) => {
                state.CarColorMaster.push(action.payload);
            })

            .addCase(addCarColorMaster.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            .addCase(updateCarColorMaster.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateCarColorMaster.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.CarColorMaster.findIndex(item => item._id === action.payload._id);
                if (index !== -1) {
                    state.CarColorMaster[index] = action.payload;
                }
            })
            .addCase(updateCarColorMaster.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
    },
});

export default CarColorMasterSlice.reducer;