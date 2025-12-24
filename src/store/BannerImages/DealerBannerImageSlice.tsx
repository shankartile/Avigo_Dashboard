import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { httpinstance } from '../../axios/api';


type DealerBannerImageState = {
    DealerBannerImage: DealerBannerImage[];
    totalItems: number;
    totalPages: number;
    currentPage: number;
    loading: boolean;
    error: string | null;
};



interface DealerBannerImage {
    _id: string;
    image: File | null;
    isActive: boolean;
}

const initialState: DealerBannerImageState = {
    DealerBannerImage: [],
    totalItems: 0,
    totalPages: 0,
    currentPage: 0,
    loading: false,
    error: null,
};


export interface AddDealerBannerImagePayload {
  
    image: File | null;
   

}

export interface UpdateDealerBannerImagePayload {
    _id: string;
    image: File | null;
   

}


export const fetchDealerBannerImage = createAsyncThunk(
    'DealerBannerImage/fetchDealerBannerImage',
    async (
        { search = '', page = 0, limit = 10 }: { search?: string; page?: number; limit?: number },
        { rejectWithValue }
    ) => {
        try {

            const response = await httpinstance.get(`admin/dealer_bannerRoute/getdata?&search=${search}&page=${page + 1}&limit=${limit}`);
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



export const addDealerBannerImage = createAsyncThunk<DealerBannerImage, AddDealerBannerImagePayload>(
    'DealerBannerImage/addDealerBannerImage',
    async (formData, { rejectWithValue }) => {
        try {
            const res = await httpinstance.post('admin/dealer_bannerRoute/add', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            return res.data.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to add tutorial ');
        }
    }
);


export const updateDealerBannerImage = createAsyncThunk<DealerBannerImage, UpdateDealerBannerImagePayload>(
    'DealerBannerImage/updateDealerBannerImage',
    async ({ _id, ...formData }, { rejectWithValue }) => {
        try {
            const response = await httpinstance.put(
                `admin/dealer_bannerRoute/${_id}/update`,
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


export const deleteDealerBannerImage = createAsyncThunk(
    'DealerBannerImages/deleteDealerBannerImage',
    async (_id: string, { rejectWithValue }) => {
        try {
            // Sending the ID as part of the URL
            await httpinstance.put(`admin/dealer_bannerRoute/${_id}/isdelete`, { isDeleted: true });
            return _id;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to delete Dealer tutorial ');
        }
    }
);




export const toggleDealerBannerImageStatus = createAsyncThunk(
    'DealerBannerImage/toggleStatus',
    async (
        { _id, isActive }: { _id: string; isActive: boolean },
        { rejectWithValue }
    ) => {
        try {
            const res = await httpinstance.put(
                `admin/dealer_bannerRoute/${_id}/isactive`,
                { isActive }
            );
            return res.data.data;
        } catch (err: any) {
            console.error('Toggle Status Error:', err.response?.data || err.message);
            return rejectWithValue(err.response?.data?.message || 'Failed to toggle status');
        }
    }
);

const DealerBannerImageSlice = createSlice({
    name: 'DealerBannerImage',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(fetchDealerBannerImage.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchDealerBannerImage.fulfilled, (state, action) => {
                state.loading = false;
                state.DealerBannerImage = action.payload.data.banners;
                state.totalItems = action.payload.totalItems;
                state.totalPages = action.payload.totalPages;
                state.currentPage = action.payload.currentPage;
            })


            .addCase(fetchDealerBannerImage.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            .addCase(addDealerBannerImage.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addDealerBannerImage.fulfilled, (state, action) => {
                state.DealerBannerImage.push(action.payload);
            })

            .addCase(addDealerBannerImage.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            .addCase(updateDealerBannerImage.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateDealerBannerImage.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.DealerBannerImage.findIndex(item => item._id === action.payload._id);
                if (index !== -1) {
                    state.DealerBannerImage[index] = action.payload;
                }
            })
            .addCase(updateDealerBannerImage.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
    },
});

export default DealerBannerImageSlice.reducer;