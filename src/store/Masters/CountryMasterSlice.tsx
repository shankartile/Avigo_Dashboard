import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { httpinstance } from '../../axios/api';


type CountryMasterState = {
    CountryMaster: CountryMaster[];
    totalItems: number;
    totalPages: number;
    currentPage: number;
    loading: boolean;
    error: string | null;
};



interface CountryMaster {
    _id: string;
    country_name: string;
    isActive: boolean;
}

const initialState: CountryMasterState = {
    CountryMaster: [],
    totalItems: 0,
    totalPages: 0,
    currentPage: 0,
    loading: false,
    error: null,
};


export interface AddCountryMasterPayload {
    country_name: string;

}

export interface UpdateCountryMasterPayload {
    _id: string;
    country_name: string;
}


export const fetchCountryMaster = createAsyncThunk(
    'CountryMaster/fetchCountryMaster',
    async (
        { search = '', page = 0, limit = 10 }: { search?: string; page?: number; limit?: number },
        { rejectWithValue }
    ) => {
        try {

            const response = await httpinstance.get(`admin/countryRoute/getdata?&search=${search}&page=${page + 1}&limit=${limit}`);
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



export const addCountryMaster = createAsyncThunk<CountryMaster, AddCountryMasterPayload>(
    'CountryMaster/addCountryMaster',
    async (formData, { rejectWithValue }) => {
        try {
            const res = await httpinstance.post('/admin/countryRoute/add', formData, {
                headers: { 'Content-Type': 'application/json' },
            });
            return res.data.data;
        } catch (err: any) {
            // Prefer meta.errors if exists
            const errorMessage =
                err.response?.data?.meta?.errors?.[0]?.message ||
                err.response?.data?.message ||
                'Failed to update Country';

            return rejectWithValue(errorMessage);
        }
    }
);


export const updateCountryMaster = createAsyncThunk<
    CountryMaster,
    UpdateCountryMasterPayload,
    { rejectValue: string }
>(
    'CountryMaster/updateCountryMaster',
    async ({ _id, ...formData }, { rejectWithValue }) => {
        try {
            const response = await httpinstance.put(
                `admin/countryRoute/${_id}/update`,
                formData,
                {
                    headers: { 'Content-Type': 'application/json' },
                }
            );
            return response.data.data;
        } catch (err: any) {
            // Prefer meta.errors if exists
            const errorMessage =
                err.response?.data?.meta?.errors?.[0]?.message ||
                err.response?.data?.message ||
                'Failed to update Country';

            return rejectWithValue(errorMessage);
        }
    }
);


export const deleteCountryMaster = createAsyncThunk(
    'CountryMasters/deleteCountryMaster',
    async (_id: string, { rejectWithValue }) => {
        try {
            // Sending the ID as part of the URL
            await httpinstance.put(`admin/countryRoute/${_id}/isdelete`, { isDeleted: true });
            return _id;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to delete Country');
        }
    }
);




export const toggleCountryMasterStatus = createAsyncThunk(
    'CountryMaster/toggleStatus',
    async (
        { _id, isActive }: { _id: string; isActive: boolean },
        { rejectWithValue }
    ) => {
        try {
            const res = await httpinstance.put(
                `admin/countryRoute/${_id}/isactive`,
                { isActive }
            );
            return res.data.data;
        } catch (err: any) {
            console.error('Toggle Status Error:', err.response?.data || err.message);
            return rejectWithValue(err.response?.data?.message || 'Failed to toggle status');
        }
    }
);

const CountryMasterSlice = createSlice({
    name: 'CountryMasters',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(fetchCountryMaster.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCountryMaster.fulfilled, (state, action) => {
                state.loading = false;
                state.CountryMaster = action.payload.data.countries;
                state.totalItems = action.payload.totalItems;
                state.totalPages = action.payload.totalPages;
                state.currentPage = action.payload.currentPage;
            })


            .addCase(fetchCountryMaster.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            .addCase(addCountryMaster.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addCountryMaster.fulfilled, (state, action) => {
                state.CountryMaster.push(action.payload);
            })

            .addCase(addCountryMaster.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            .addCase(updateCountryMaster.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateCountryMaster.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.CountryMaster.findIndex(item => item._id === action.payload._id);
                if (index !== -1) {
                    state.CountryMaster[index] = action.payload;
                }
            })
            .addCase(updateCountryMaster.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
    },
});

export default CountryMasterSlice.reducer;