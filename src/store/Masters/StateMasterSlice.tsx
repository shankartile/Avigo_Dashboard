import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { httpinstance } from '../../axios/api';


type StateMasterState = {
    StateMaster: StateMaster[];
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
    isActive: boolean
}


interface StateMaster {
    _id: string;
    state_name: string;
    state_id: string;
    isActive: boolean
}

const initialState: StateMasterState = {
    StateMaster: [],
    CountryMaster: [],
    totalItems: 0,
    totalPages: 0,
    currentPage: 0,
    loading: false,
    error: null,
};


export interface AddStateMasterPayload {
    country_id: string;
    country_name: string;
    state_name: string;

}

export interface UpdateStateMasterPayload {
    _id: string;
    country_id: string;
    state_name: string;
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




export const fetchStateMaster = createAsyncThunk(
    'StateMaster/fetchStateMaster',
    async (
        { search = '', page = 0, limit = 10}: { search?: string; page?: number; limit?: number },
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



export const addStateMaster = createAsyncThunk<StateMaster, AddStateMasterPayload>(
    'StateMaster/addStateMaster',
    async (formData, { rejectWithValue }) => {
        try {
            const res = await httpinstance.post('/admin/stateRoute/add', formData, {
                headers: { 'Content-Type': 'application/json' },
            });
            return res.data.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to add State');
        }
    }
);


export const updateStateMaster = createAsyncThunk<StateMaster, UpdateStateMasterPayload>(
    'StateMaster/updateStateMaster',
    async ({ _id, ...formData }, { rejectWithValue }) => {
        try {
            const response = await httpinstance.put(
                `admin/stateRoute/${_id}/update`,
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


export const deleteStateMaster = createAsyncThunk(
    'StateMasters/deleteStateMaster',
    async (_id: string, { rejectWithValue }) => {
        try {
            // Sending the ID as part of the URL
            await httpinstance.put(`admin/stateRoute/${_id}/isdelete`, { isDeleted: true });
            return _id;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to delete State');
        }
    }
);




export const toggleStateMasterStatus = createAsyncThunk(
    'StateMaster/toggleStatus',
    async (
        { _id, isActive }: { _id: string; isActive: boolean },
        { rejectWithValue }
    ) => {
        try {
            const res = await httpinstance.put(
                `admin/stateRoute/${_id}/isactive`,
                { isActive }
            );
            return res.data.data;
        } catch (err: any) {
            console.error('Toggle Status Error:', err.response?.data || err.message);
            return rejectWithValue(err.response?.data?.message || 'Failed to toggle status');
        }
    }
);

const StateMasterSlice = createSlice({
    name: 'StateMasters',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(fetchStateMaster.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchStateMaster.fulfilled, (state, action) => {
                state.loading = false;
                state.StateMaster = action.payload.data;
                state.totalItems = action.payload.totalItems;
                state.totalPages = action.payload.totalPages;
                state.currentPage = action.payload.currentPage;
            })
            .addCase(fetchStateMaster.rejected, (state, action) => {
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


            .addCase(addStateMaster.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addStateMaster.fulfilled, (state, action) => {
                state.StateMaster.push(action.payload);
            })
            .addCase(addStateMaster.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            .addCase(updateStateMaster.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateStateMaster.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.StateMaster.findIndex(item => item._id === action.payload._id);
                if (index !== -1) {
                    state.StateMaster[index] = action.payload;
                }
            })
            .addCase(updateStateMaster.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
    },
});

export default StateMasterSlice.reducer;