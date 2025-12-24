import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { httpinstance } from '../../axios/api';


type YearofManufactureMasterState = {
    YearofManufactureMaster: YearofManufactureMaster[];
    totalItems: number;
    totalPages: number;
    currentPage: number;
    loading: boolean;
    error: string | null;
};

interface YearofManufactureMaster {
    _id: string;
    year_of_manufacture: string;
    isActive: boolean;
}

const initialState: YearofManufactureMasterState = {
    YearofManufactureMaster: [],
    totalItems: 0,
    totalPages: 0,
    currentPage: 0,
    loading: false,
    error: null,
};


export interface AddYearofManufactureMasterPayload {
    year_of_manufacture: string;

}

export interface UpdateYearofManufactureMasterPayload {
    _id: string;
    year_of_manufacture: string;
}


export const fetchYearofManufactureMaster = createAsyncThunk(
    'YearofManufactureMaster/fetchYearofManufactureMaster',
    async (
        { search = '', page = 0, limit = 10 }: { search?: string; page?: number; limit?: number },
        { rejectWithValue }
    ) => {
        try {

            const response = await httpinstance.get(`product/spareyear_of_manufactureRoute/getdata?&search=${search}&page=${page + 1}&limit=${limit}`);
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



export const addYearofManufactureMaster = createAsyncThunk<YearofManufactureMaster, AddYearofManufactureMasterPayload>(
    'YearofManufactureMaster/addYearofManufactureMaster',
    async (formData, { rejectWithValue }) => {
        try {
            const res = await httpinstance.post('product/spareyear_of_manufactureRoute/add', formData, {
                headers: { 'Content-Type': 'application/json' },
            });
            return res.data.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to add year_of_manufacture ');
        }
    }
);

     

export const updateYearofManufactureMaster = createAsyncThunk<YearofManufactureMaster, UpdateYearofManufactureMasterPayload>(
    'YearofManufactureMaster/updateYearofManufactureMaster',
    async ({ _id, ...formData }, { rejectWithValue }) => {
        try {
            const response = await httpinstance.put(
                `product/spareyear_of_manufactureRoute/${_id}/update`,
                formData,
                {
                    headers: { 'Content-Type': 'application/json' },
                }
            );
            return response.data.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to update year_of_manufacture ');
        }
    }
);


export const deleteYearofManufactureMaster = createAsyncThunk(
    'YearofManufactureMasters/deleteYearofManufactureMaster',
    async (_id: string, { rejectWithValue }) => {
        try {
            // Sending the ID as part of the URL
            await httpinstance.put(`product/spareyear_of_manufactureRoute/${_id}/isdelete`, { isDeleted: true });
            return _id;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to delete year_of_manufacture ');
        }
    }
);




export const toggleYearofManufactureMasterStatus = createAsyncThunk(
    'YearofManufactureMaster/toggleStatus',
    async (
        { _id, isActive }: { _id: string; isActive: boolean },
        { rejectWithValue }
    ) => {
        try {
            const res = await httpinstance.put(
                `product/spareyear_of_manufactureRoute/${_id}/isactive`,
                { isActive }
            );
            return res.data.data;
        } catch (err: any) {
            console.error('Toggle Status Error:', err.response?.data || err.message);
            return rejectWithValue(err.response?.data?.message || 'Failed to toggle status');
        }
    }
);

const YearofManufactureMasterSlice = createSlice({
    name: 'YearofManufactureMasters',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(fetchYearofManufactureMaster.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchYearofManufactureMaster.fulfilled, (state, action) => {
                state.loading = false;
                state.YearofManufactureMaster = action.payload.data.years;
                state.totalItems = action.payload.totalItems;
                state.totalPages = action.payload.totalPages;
                state.currentPage = action.payload.currentPage;
            })
            .addCase(fetchYearofManufactureMaster.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            .addCase(addYearofManufactureMaster.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addYearofManufactureMaster.fulfilled, (state, action) => {
                state.YearofManufactureMaster.push(action.payload);
            })

            .addCase(addYearofManufactureMaster.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            .addCase(updateYearofManufactureMaster.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateYearofManufactureMaster.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.YearofManufactureMaster.findIndex(item => item._id === action.payload._id);
                if (index !== -1) {
                    state.YearofManufactureMaster[index] = action.payload;
                }
            })
            .addCase(updateYearofManufactureMaster.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
    },
});

export default YearofManufactureMasterSlice.reducer;