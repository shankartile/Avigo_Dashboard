import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { httpinstance } from '../../axios/api';


type BuyerTutorialManagementState = {
    BuyerTutorialManagement: BuyerTutorialManagement[];
    totalItems: number;
    totalPages: number;
    currentPage: number;
    loading: boolean;
    error: string | null;
};



interface BuyerTutorialManagement {
    _id: string;
    isFullImage: boolean;
    thumbnail_image: File | null;
    title: string;
    sub_title: string;
    description: string;
    full_image: File | null;
    isActive: boolean;
}

const initialState: BuyerTutorialManagementState = {
    BuyerTutorialManagement: [],
    totalItems: 0,
    totalPages: 0,
    currentPage: 0,
    loading: false,
    error: null,
};


export interface AddBuyerTutorialManagementPayload {
    isFullImage: boolean;
    thumbnail_image: File | null;
    title: string;
    sub_title: string;
    description: string;
    full_image: File | null;

}

export interface UpdateBuyerTutorialManagementPayload {
    _id: string;
    isFullImage: boolean;
    thumbnail_image: File | null;
    title: string;
    sub_title: string;
    description: string;
    full_image: File | null;

}


export const fetchBuyerTutorialManagement = createAsyncThunk(
    'BuyerTutorialManagement/fetchBuyerTutorialManagement',
    async (
        { search = '', page = 0, limit = 10 }: { search?: string; page?: number; limit?: number },
        { rejectWithValue }
    ) => {
        try {

            const response = await httpinstance.get(`admin/buyer_tutorialRoute/getdata?&search=${search}&page=${page + 1}&limit=${limit}`);
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



export const addBuyerTutorialManagement = createAsyncThunk<BuyerTutorialManagement, AddBuyerTutorialManagementPayload>(
    'BuyerTutorialManagement/addBuyerTutorialManagement',
    async (formData, { rejectWithValue }) => {
        try {
            const res = await httpinstance.post('admin/buyer_tutorialRoute/add', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            return res.data.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to add tutorial ');
        }
    }
);


export const updateBuyerTutorialManagement = createAsyncThunk<BuyerTutorialManagement, UpdateBuyerTutorialManagementPayload>(
    'BuyerTutorialManagement/updateBuyerTutorialManagement',
    async ({ _id, ...formData }, { rejectWithValue }) => {
        try {
            const response = await httpinstance.put(
                `admin/buyer_tutorialRoute/${_id}/update`,
                formData,
                {
                    headers: { 'Content-Type': 'multipart/form-data' },
                }
            );
            return response.data.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to update Buyer tutorial ');
        }
    }
);


export const deleteBuyerTutorialManagement = createAsyncThunk(
    'BuyerTutorialManagements/deleteBuyerTutorialManagement',
    async (_id: string, { rejectWithValue }) => {
        try {
            // Sending the ID as part of the URL
            await httpinstance.put(`admin/buyer_tutorialRoute/${_id}/isdelete`, { isDeleted: true });
            return _id;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to delete Buyer tutorial ');
        }
    }
);



export const toggleBuyerTutorialManagementStatus = createAsyncThunk<
    any,
    { _id: string; isActive: boolean },
    { rejectValue: { message: string; code?: string } }
>(
    'BuyerTutorialManagement/toggleStatus',
    async ({ _id, isActive }, { rejectWithValue }) => {
        try {
            const res = await httpinstance.put(
                `admin/buyer_tutorialRoute/${_id}/isactive`,
                { isActive }
            );
            return res.data.data;
        } catch (err: any) {

            const errorResponse = err?.response?.data;
            if (errorResponse) {
                return rejectWithValue({
                    message: errorResponse.message,
                    code: errorResponse.code
                });
            }
            return rejectWithValue({
                message: err?.message || 'Failed to toggle status.',
                code: 'UNKNOWN_ERROR'
            });
        }
    }
);





const BuyerTutorialManagementSlice = createSlice({
    name: 'BuyerTutorialManagement',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(fetchBuyerTutorialManagement.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchBuyerTutorialManagement.fulfilled, (state, action) => {
                state.loading = false;
                state.BuyerTutorialManagement = action.payload.data.tutorials;
                state.totalItems = action.payload.totalItems;
                state.totalPages = action.payload.totalPages;
                state.currentPage = action.payload.currentPage;
            })


            .addCase(fetchBuyerTutorialManagement.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            .addCase(addBuyerTutorialManagement.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addBuyerTutorialManagement.fulfilled, (state, action) => {
                state.BuyerTutorialManagement.push(action.payload);
            })

            .addCase(addBuyerTutorialManagement.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            .addCase(updateBuyerTutorialManagement.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateBuyerTutorialManagement.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.BuyerTutorialManagement.findIndex(item => item._id === action.payload._id);
                if (index !== -1) {
                    state.BuyerTutorialManagement[index] = action.payload;
                }
            })
            .addCase(updateBuyerTutorialManagement.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
    },
});

export default BuyerTutorialManagementSlice.reducer;