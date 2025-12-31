import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { httpinstance } from '../../axios/api';

type VendorCategoryMasterState = {
    VendorCategoryMaster: VendorCategoryMaster[];
    totalItems: number;
    totalPages: number;
    currentPage: number;
    loading: boolean;
    error: string | null;
};

interface VendorCategoryMaster {
    _id: string;
    vendorName: string;
    gstNumber: string;
    contact: string;
    purpose: string;
    isActive: boolean;
}


const initialState: VendorCategoryMasterState = {
    VendorCategoryMaster: [],
    totalItems: 0,
    totalPages: 0,
    currentPage: 0,
    loading: false,
    error: null,
};


export interface AddVendorCategoryMasterPayload {
    vendorName: string;
    gstNumber: string;
    contact: string;
    purpose: string;
}

export interface UpdateVendorCategoryMasterPayload {
    _id: string;
    vendorName: string;
    gstNumber: string;
    contact: string;
    purpose: string;
}


export const fetchVendorCategoryMaster = createAsyncThunk(
    'VendorCategoryMaster/fetchVendorCategoryMaster',
    async (
        { search = '', page = 0, limit = 10 }: { search?: string; page?: number; limit?: number },
        { rejectWithValue }
    ) => {
        try {
            const response = await httpinstance.get(
                `society/vendor_category_master/getdata?search=${search}&page=${page + 1}&limit=${limit}`
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

export const addVendorCategoryMaster = createAsyncThunk<
    VendorCategoryMaster,
    AddVendorCategoryMasterPayload
>(
    'VendorCategoryMaster/addVendorCategoryMaster',
    async (formData, { rejectWithValue }) => {
        try {
            const res = await httpinstance.post(
                'society/vendor_category_master/add',
                formData,
                { headers: { 'Content-Type': 'application/json' } }
            );
            return res.data.data;
        } catch (err: any) {
            return rejectWithValue(
                err.response?.data?.message || 'Failed to add Vendor Category'
            );
        }
    }
);

export const updateVendorCategoryMaster = createAsyncThunk<
    VendorCategoryMaster,
    UpdateVendorCategoryMasterPayload
>(
    'VendorCategoryMaster/updateVendorCategoryMaster',
    async ({ _id, ...formData }, { rejectWithValue }) => {
        try {
            const response = await httpinstance.put(
                `society/vendor_category_master/${_id}/update`,
                formData,
                { headers: { 'Content-Type': 'application/json' } }
            );
            return response.data.data;
        } catch (err: any) {
            return rejectWithValue(
                err.response?.data?.message || 'Failed to update Vendor Category'
            );
        }
    }
);

export const deleteVendorCategoryMaster = createAsyncThunk(
    'VendorCategoryMasters/deleteVendorCategoryMaster',
    async (_id: string, { rejectWithValue }) => {
        try {
            await httpinstance.put(
                `society/vendor_category_master/${_id}/isdelete`,
                { isDeleted: true }
            );
            return _id;
        } catch (err: any) {
            return rejectWithValue(
                err.response?.data?.message || 'Failed to delete Vendor Category'
            );
        }
    }
);

export const toggleVendorCategoryMasterStatus = createAsyncThunk(
    'VendorCategoryMaster/toggleStatus',
    async (
        { _id, isActive }: { _id: string; isActive: boolean },
        { rejectWithValue }
    ) => {
        try {
            const res = await httpinstance.put(
                `society/vendor_category_master/${_id}/isactive`,
                { isActive }
            );
            return res.data.data;
        } catch (err: any) {
            return rejectWithValue(
                err.response?.data?.message || 'Failed to toggle status'
            );
        }
    }
);


const VendorCategoryMasterSlice = createSlice({
    name: 'VendorCategoryMasters',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(fetchVendorCategoryMaster.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchVendorCategoryMaster.fulfilled, (state, action) => {
                state.loading = false;
                state.VendorCategoryMaster = action.payload.data;
                state.totalItems = action.payload.totalItems;
                state.totalPages = action.payload.totalPages;
                state.currentPage = action.payload.currentPage;
            })
            .addCase(fetchVendorCategoryMaster.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            .addCase(addVendorCategoryMaster.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addVendorCategoryMaster.fulfilled, (state, action) => {
                state.VendorCategoryMaster.push(action.payload);
            })
            .addCase(addVendorCategoryMaster.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            .addCase(updateVendorCategoryMaster.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateVendorCategoryMaster.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.VendorCategoryMaster.findIndex(
                    item => item._id === action.payload._id
                );
                if (index !== -1) {
                    state.VendorCategoryMaster[index] = action.payload;
                }
            })
            .addCase(updateVendorCategoryMaster.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export default VendorCategoryMasterSlice.reducer;
