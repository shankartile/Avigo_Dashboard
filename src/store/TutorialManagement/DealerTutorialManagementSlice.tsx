import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { httpinstance } from '../../axios/api';


type DealerTutorialManagementState = {
    DealerTutorialManagement: DealerTutorialManagement[];
    totalItems: number;
    totalPages: number;
    currentPage: number;
    loading: boolean;
    error: string | null;
};



interface DealerTutorialManagement {
    _id: string;
    isFullImage: boolean;
    thumbnail_image: File | null;
    title: string;
    sub_title: string;
    description: string;
    full_image: File | null;
    isActive: boolean;
}

const initialState: DealerTutorialManagementState = {
    DealerTutorialManagement: [],
    totalItems: 0,
    totalPages: 0,
    currentPage: 0,
    loading: false,
    error: null,
};


export interface AddDealerTutorialManagementPayload {
    isFullImage: boolean;
    thumbnail_image: File | null;
    title: string;
    sub_title: string;
    description: string;
    full_image: File | null;

}

export interface UpdateDealerTutorialManagementPayload {
    _id: string;
    isFullImage: boolean;
    thumbnail_image: File | null;
    title: string;
    sub_title: string;
    description: string;
    full_image: File | null;

}


export const fetchDealerTutorialManagement = createAsyncThunk(
    'DealerTutorialManagement/fetchDealerTutorialManagement',
    async (
        { search = '', page = 0, limit = 10 }: { search?: string; page?: number; limit?: number },
        { rejectWithValue }
    ) => {
        try {

            const response = await httpinstance.get(`admin/dealer_tutorialRoute/getdata?&search=${search}&page=${page + 1}&limit=${limit}`);
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



export const addDealerTutorialManagement = createAsyncThunk<DealerTutorialManagement, AddDealerTutorialManagementPayload>(
    'DealerTutorialManagement/addDealerTutorialManagement',
    async (formData, { rejectWithValue }) => {
        try {
            const res = await httpinstance.post('admin/dealer_tutorialRoute/add', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            return res.data.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to add tutorial ');
        }
    }
);


export const updateDealerTutorialManagement = createAsyncThunk<DealerTutorialManagement, UpdateDealerTutorialManagementPayload>(
    'DealerTutorialManagement/updateDealerTutorialManagement',
    async ({ _id, ...formData }, { rejectWithValue }) => {
        try {
            const response = await httpinstance.put(
                `admin/dealer_tutorialRoute/${_id}/update`,
                formData,
                {
                    headers: { 'Content-Type': 'multipart/form-data' },
                }
            );
            return response.data.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to update Dealer tutorial ');
        }
    }
);


export const deleteDealerTutorialManagement = createAsyncThunk(
    'DealerTutorialManagements/deleteDealerTutorialManagement',
    async (_id: string, { rejectWithValue }) => {
        try {
            // Sending the ID as part of the URL
            await httpinstance.put(`admin/dealer_tutorialRoute/${_id}/isdelete`, { isDeleted: true });
            return _id;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to delete Dealer tutorial ');
        }
    }
);




export const toggleDealerTutorialManagementStatus = createAsyncThunk(
    'DealerTutorialManagement/toggleStatus',
    async (
        { _id, isActive }: { _id: string; isActive: boolean },
        { rejectWithValue }
    ) => {
        try {
            const res = await httpinstance.put(
                `admin/dealer_tutorialRoute/${_id}/isactive`,
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

const DealerTutorialManagementSlice = createSlice({
    name: 'DealerTutorialManagement',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(fetchDealerTutorialManagement.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchDealerTutorialManagement.fulfilled, (state, action) => {
                state.loading = false;
                state.DealerTutorialManagement = action.payload.data.tutorials;
                state.totalItems = action.payload.totalItems;
                state.totalPages = action.payload.totalPages;
                state.currentPage = action.payload.currentPage;
            })


            .addCase(fetchDealerTutorialManagement.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            .addCase(addDealerTutorialManagement.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addDealerTutorialManagement.fulfilled, (state, action) => {
                state.DealerTutorialManagement.push(action.payload);
            })

            .addCase(addDealerTutorialManagement.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            .addCase(updateDealerTutorialManagement.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateDealerTutorialManagement.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.DealerTutorialManagement.findIndex(item => item._id === action.payload._id);
                if (index !== -1) {
                    state.DealerTutorialManagement[index] = action.payload;
                }
            })
            .addCase(updateDealerTutorialManagement.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
    },
});

export default DealerTutorialManagementSlice.reducer;