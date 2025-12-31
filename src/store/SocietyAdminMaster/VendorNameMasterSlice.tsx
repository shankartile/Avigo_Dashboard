import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { httpinstance } from '../../axios/api';


type VendorNameMasterState = {
    VendorNameMaster: VendorNameMaster[];
    totalItems: number;
    totalPages: number;
    currentPage: number;
    loading: boolean;
    error: string | null;
};

interface VendorNameMaster {
    _id: string;
    vendorName: string;
    gstNumber: string;
    contact: string;
    purpose: string;
    isActive: boolean;
}

const initialState: VendorNameMasterState = {
    VendorNameMaster: [],
    totalItems: 0,
    totalPages: 0,
    currentPage: 0,
    loading: false,
    error: null,
};


export interface AddVendorNameMasterPayload {
    vendorName: string;
    gstNumber: string;
    contact: string;
    purpose: string;
}

export interface UpdateVendorNameMasterPayload {
    _id: string;
    vendorName: string;
    gstNumber: string;
    contact: string;
    purpose: string;
}


export const fetchVendorNameMaster = createAsyncThunk(
    'VendorNameMaster/fetchVendorNameMaster',
    async (
        { search = '', page = 0, limit = 10 }: { search?: string; page?: number; limit?: number },
        { rejectWithValue }
    ) => {
        try {
            const response = await httpinstance.get(
                `society/vendor_master/getdata?search=${search}&page=${page + 1}&limit=${limit}`
            );

            return {
                data: response.data.data,
                totalItems: response.data.pagination.totalItems,
                totalPages: response.data.pagination.totalPages,
                currentPage: response.data.pagination.currentPage,
            };
        } catch (error: any) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const addVendorNameMaster = createAsyncThunk<VendorNameMaster, AddVendorNameMasterPayload>(
    'VendorNameMaster/addVendorNameMaster',
    async (formData, { rejectWithValue }) => {
        try {
            const res = await httpinstance.post(
                'society/vendor_master/add',
                formData,
                { headers: { 'Content-Type': 'application/json' } }
            );
            return res.data.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to add Vendor');
        }
    }
);

export const updateVendorNameMaster = createAsyncThunk<
    VendorNameMaster,
    UpdateVendorNameMasterPayload
>(
    'VendorNameMaster/updateVendorNameMaster',
    async ({ _id, ...formData }, { rejectWithValue }) => {
        try {
            const response = await httpinstance.put(
                `society/vendor_master/${_id}/update`,
                formData,
                { headers: { 'Content-Type': 'application/json' } }
            );
            return response.data.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to update Vendor');
        }
    }
);

export const deleteVendorNameMaster = createAsyncThunk(
    'VendorNameMaster/deleteVendorNameMaster',
    async (_id: string, { rejectWithValue }) => {
        try {
            await httpinstance.put(
                `society/vendor_master/${_id}/isdelete`,
                { isDeleted: true }
            );
            return _id;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to delete Vendor');
        }
    }
);

export const toggleVendorNameMasterStatus = createAsyncThunk(
    'VendorNameMaster/toggleStatus',
    async (
        { _id, isActive }: { _id: string; isActive: boolean },
        { rejectWithValue }
    ) => {
        try {
            const res = await httpinstance.put(
                `society/vendor_master/${_id}/isactive`,
                { isActive }
            );
            return res.data.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to toggle status');
        }
    }
);


const VendorNameMasterSlice = createSlice({
    name: 'VendorNameMaster',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder

            /* FETCH */
            .addCase(fetchVendorNameMaster.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchVendorNameMaster.fulfilled, (state, action) => {
                state.loading = false;
                state.VendorNameMaster = action.payload.data;
                state.totalItems = action.payload.totalItems;
                state.totalPages = action.payload.totalPages;
                state.currentPage = action.payload.currentPage;
            })
            .addCase(fetchVendorNameMaster.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            /* ADD */
            .addCase(addVendorNameMaster.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addVendorNameMaster.fulfilled, (state, action) => {
                state.loading = false;
                state.VendorNameMaster.push(action.payload);
            })
            .addCase(addVendorNameMaster.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            /* UPDATE */
            .addCase(updateVendorNameMaster.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateVendorNameMaster.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.VendorNameMaster.findIndex(
                    item => item._id === action.payload._id
                );
                if (index !== -1) {
                    state.VendorNameMaster[index] = action.payload;
                }
            })
            .addCase(updateVendorNameMaster.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export default VendorNameMasterSlice.reducer;
