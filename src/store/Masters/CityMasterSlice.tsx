import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { httpinstance } from '../../axios/api';


type StateMasterState = {
    StateMaster: StateMaster[];
    CountryMaster: CountryMaster[];
    CityMaster: CityMaster[];
    totalItems: number;
    totalPages: number;
    currentPage: number;
    loading: boolean;
    error: string | null;
};


interface CountryMaster {
    _id: string;
    country_name: string;
    isActive: boolean
}


interface StateMaster {
    _id: string;
    state_id: string;
    state_name: string;
    isActive: boolean
}
interface CityMaster {
    _id: string;
    city_name: string;
    isActive: boolean
}

const initialState: StateMasterState = {
    StateMaster: [],
    CountryMaster: [],
    CityMaster: [],
    totalItems: 0,
    totalPages: 0,
    currentPage: 0,
    loading: false,
    error: null,
};


export interface AddCityMasterPayload {
    istopcities?: string;
    country_id: string;
    country_name: string;
    state_id: string;
    state_name: string;
    city_name: string;
    image?: string | File;


}

export interface UpdateCityMasterPayload {
    _id: string;
    istopcities?: string;
    country_id?: string;
    country_name?: string;
    state_id?: string;
    state_name?: string;
    city_name?: string;
    image?: string | File;


}


export const fetchCityMaster = createAsyncThunk(
    'Citymaster/fetchCitymaster',
    async (
        { search = '', page = 0, limit = 10 }: { search?: string; page?: number; limit?: number },
        { rejectWithValue }
    ) => {
        try {

            const response = await httpinstance.get(`admin/cityRoute/getdata?&search=${search}&page=${page + 1}&limit=${limit}`);
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




export const fetchStateMaster = createAsyncThunk(
    'StateMaster/fetchStateMaster',
    async (
        { search = '', page = 0, limit = 10000 }: { search?: string; page?: number; limit?: number },
        { rejectWithValue }
    ) => {
        try {

            const response = await httpinstance.get(`admin/stateRoute/getdata?&search=${search}&page=${page + 1}&limit=${limit}`);
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



export const addCityMaster = createAsyncThunk<CityMaster, AddCityMasterPayload>(
    'CityMaster/addCityMaster',
    async (formData, { rejectWithValue }) => {
        try {
            const res = await httpinstance.post('/admin/cityRoute/add', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
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


export const updateCityMaster = createAsyncThunk<CityMaster, UpdateCityMasterPayload>(
    'CityMaster/updateCityMaster',
    async ({ _id, ...formData }, { rejectWithValue }) => {
        try {
            const response = await httpinstance.put(
                `admin/cityRoute/${_id}/update`,
                formData,
                {
                    headers: { 'Content-Type': 'multipart/form-data' },
                }
            );
            return response.data.data;
        } catch (err: any) {
            // Prefer meta.errors if exists
            const errorMessage =
                err.response?.data?.meta?.errors?.[0]?.message ||
                err.response?.data?.message ||
                'Failed to update City';

            return rejectWithValue(errorMessage);
        }
    }
);


export const deleteCityMaster = createAsyncThunk(
    'CityMasters/deleteCityMaster',
    async (_id: string, { rejectWithValue }) => {
        try {
            // Sending the ID as part of the URL
            await httpinstance.put(`admin/cityRoute/${_id}/isdelete`, { isDeleted: true });
            return _id;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to delete City');
        }
    }
);




export const toggleCityMasterStatus = createAsyncThunk(
    'CityMaster/toggleStatus',
    async (
        { _id, isActive }: { _id: string; isActive: boolean },
        { rejectWithValue }
    ) => {
        try {
            const res = await httpinstance.put(
                `admin/cityRoute/${_id}/isactive`,
                { isActive }
            );
            return res.data.data;
        } catch (err: any) {
            console.error('Toggle Status Error:', err.response?.data || err.message);
            return rejectWithValue(err.response?.data?.message || 'Failed to toggle status');
        }
    }
);

const CityMasterSlice = createSlice({
    name: 'CityMasters',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(fetchCityMaster.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCityMaster.fulfilled, (state, action) => {
                state.loading = false;
                state.CityMaster = action.payload.data;
                state.totalItems = action.payload.totalItems;
                state.totalPages = action.payload.totalPages;
                state.currentPage = action.payload.currentPage;
            })
            .addCase(fetchCityMaster.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })


            .addCase(fetchCountryMaster.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCountryMaster.fulfilled, (state, action) => {
                state.loading = false;
                state.CountryMaster = action.payload.data.countries;
            })
            .addCase(fetchCountryMaster.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })


            .addCase(fetchStateMaster.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchStateMaster.fulfilled, (state, action) => {
                state.loading = false;
                state.StateMaster = action.payload.data;
            })
            .addCase(fetchStateMaster.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })


            .addCase(addCityMaster.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addCityMaster.fulfilled, (state, action) => {
                state.CityMaster.push(action.payload);
            })

            .addCase(addCityMaster.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            .addCase(updateCityMaster.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateCityMaster.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.CityMaster.findIndex(item => item._id === action.payload._id);
                if (index !== -1) {
                    state.CityMaster[index] = action.payload;
                }
            })
            .addCase(updateCityMaster.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
    },
});

export default CityMasterSlice.reducer;