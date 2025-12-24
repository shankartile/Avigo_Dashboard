import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { httpinstance } from '../../axios/api';


type KilometerMasterState = {
    KilometerMaster: KilometerMaster[];
    totalItems: number;
    totalPages: number;
    currentPage: number;
    loading: boolean;
    error: string | null;
};



interface KilometerMaster {
    _id: string;
    year: string;
}

const initialState: KilometerMasterState = {
    KilometerMaster: [],
    totalItems: 0,
    totalPages: 0,
    currentPage: 0,
    loading: false,
    error: null,
};


export interface AddKilometerMasterPayload {
    kilometer: string;

}

export interface UpdateKilometerMasterPayload {
    _id: string;
    kilometer: string;
}


export const fetchKilometerMaster = createAsyncThunk(
    'KilometerMaster/fetchKilometerMaster',
    async (
        { search = '', page = 0, limit = 10 }: { search?: string; page?: number; limit?: number },
        { rejectWithValue }
    ) => {
        try {

            const response = await httpinstance.get(`product/carkilometerRoute/getdata?&search=${search}&page=${page + 1}&limit=${limit}`);
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



export const addKilometerMaster = createAsyncThunk<KilometerMaster, AddKilometerMasterPayload>(
    'KilometerMaster/addKilometerMaster',
    async (formData, { rejectWithValue }) => {
        try {
            const res = await httpinstance.post('product/carkilometerRoute/add', formData, {
                headers: { 'Content-Type': 'application/json' },
            });
            return res.data.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to add Year');
        }
    }
);


export const updateKilometerMaster = createAsyncThunk<KilometerMaster, UpdateKilometerMasterPayload>(
    'KilometerMaster/updateKilometerMaster',
    async ({ _id, ...formData }, { rejectWithValue }) => {
        try {
            const response = await httpinstance.put(
                `product/carkilometerRoute/${_id}/update`,
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


export const deleteKilometerMaster = createAsyncThunk(
    'KilometerMasters/deleteKilometerMaster',
    async (_id: string, { rejectWithValue }) => {
        try {
            // Sending the ID as part of the URL
            await httpinstance.put(`product/carkilometerRoute/${_id}/isdelete`, { isDeleted: true });
            return _id;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to delete Year');
        }
    }
);




export const toggleKilometerMasterStatus = createAsyncThunk(
    'KilometerMaster/toggleStatus',
    async (
        { _id, isActive }: { _id: string; isActive: boolean },
        { rejectWithValue }
    ) => {
        try {
            const res = await httpinstance.put(
                `product/carkilometerRoute/${_id}/isactive`,
                { isActive }
            );
            return res.data.data;
        } catch (err: any) {
            console.error('Toggle Status Error:', err.response?.data || err.message);
            return rejectWithValue(err.response?.data?.message || 'Failed to toggle status');
        }
    }
);

const KilometerSlice = createSlice({
    name: 'KilometerMasters',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(fetchKilometerMaster.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchKilometerMaster.fulfilled, (state, action) => {
                state.loading = false;
                state.KilometerMaster = action.payload.data.kilometers; 
                state.totalItems = action.payload.totalItems;
                state.totalPages = action.payload.totalPages;
                state.currentPage = action.payload.currentPage;
            })


            .addCase(fetchKilometerMaster.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            .addCase(addKilometerMaster.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addKilometerMaster.fulfilled, (state, action) => {
                state.KilometerMaster.push(action.payload);
            })

            .addCase(addKilometerMaster.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            .addCase(updateKilometerMaster.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateKilometerMaster.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.KilometerMaster.findIndex(item => item._id === action.payload._id);
                if (index !== -1) {
                    state.KilometerMaster[index] = action.payload;
                }
            })
            .addCase(updateKilometerMaster.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
    },
});

export default KilometerSlice.reducer;