import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { httpinstance } from '../../axios/api';


type BuyerBannerImageState = {
    BuyerBannerImage: BuyerBannerImage[];
    totalItems: number;
    totalPages: number;
    currentPage: number;
    loading: boolean;
    error: string | null;
};



interface BuyerBannerImage {
    _id: string;
    image: File | null;
    isActive: boolean;
}

const initialState: BuyerBannerImageState = {
    BuyerBannerImage: [],
    totalItems: 0,
    totalPages: 0,
    currentPage: 0,
    loading: false,
    error: null,
};


export interface AddBuyerBannerImagePayload {
  
    image: File | null;
   

}

export interface UpdateBuyerBannerImagePayload {
    _id: string;
    image: File | null;
   

}


export const fetchBuyerBannerImage = createAsyncThunk(
    'BuyerBannerImage/fetchBuyerBannerImage',
    async (
        { search = '', page = 0, limit = 10 }: { search?: string; page?: number; limit?: number },
        { rejectWithValue }
    ) => {
        try {

            const response = await httpinstance.get(`admin/buyer_bannerRoute/getdata?&search=${search}&page=${page + 1}&limit=${limit}`);
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



export const addBuyerBannerImage = createAsyncThunk<BuyerBannerImage, AddBuyerBannerImagePayload>(
    'BuyerBannerImage/addBuyerBannerImage',
    async (formData, { rejectWithValue }) => {
        try {
            const res = await httpinstance.post('admin/buyer_bannerRoute/add', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            return res.data.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to add tutorial ');
        }
    }
);


export const updateBuyerBannerImage = createAsyncThunk<BuyerBannerImage, UpdateBuyerBannerImagePayload>(
    'BuyerBannerImage/updateBuyerBannerImage',
    async ({ _id, ...formData }, { rejectWithValue }) => {
        try {
            const response = await httpinstance.put(
                `admin/buyer_bannerRoute/${_id}/update`,
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


export const deleteBuyerBannerImage = createAsyncThunk(
    'BuyerBannerImages/deleteBuyerBannerImage',
    async (_id: string, { rejectWithValue }) => {
        try {
            // Sending the ID as part of the URL
            await httpinstance.put(`admin/buyer_bannerRoute/${_id}/isdelete`, { isDeleted: true });
            return _id;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to delete Buyer tutorial ');
        }
    }
);




export const toggleBuyerBannerImageStatus = createAsyncThunk(
    'BuyerBannerImage/toggleStatus',
    async (
        { _id, isActive }: { _id: string; isActive: boolean },
        { rejectWithValue }
    ) => {
        try {
            const res = await httpinstance.put(
                `admin/buyer_bannerRoute/${_id}/isactive`,
                { isActive }
            );
            return res.data.data;
        } catch (err: any) {
            console.error('Toggle Status Error:', err.response?.data || err.message);
            return rejectWithValue(err.response?.data?.message || 'Failed to toggle status');
        }
    }
);

const BuyerBannerImageSlice = createSlice({
    name: 'BuyerBannerImage',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(fetchBuyerBannerImage.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchBuyerBannerImage.fulfilled, (state, action) => {
                state.loading = false;
                state.BuyerBannerImage = action.payload.data.banners;
                state.totalItems = action.payload.totalItems;
                state.totalPages = action.payload.totalPages;
                state.currentPage = action.payload.currentPage;
            })


            .addCase(fetchBuyerBannerImage.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            .addCase(addBuyerBannerImage.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addBuyerBannerImage.fulfilled, (state, action) => {
                state.BuyerBannerImage.push(action.payload);
            })

            .addCase(addBuyerBannerImage.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            .addCase(updateBuyerBannerImage.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateBuyerBannerImage.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.BuyerBannerImage.findIndex(item => item._id === action.payload._id);
                if (index !== -1) {
                    state.BuyerBannerImage[index] = action.payload;
                }
            })
            .addCase(updateBuyerBannerImage.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
    },
});

export default BuyerBannerImageSlice.reducer;