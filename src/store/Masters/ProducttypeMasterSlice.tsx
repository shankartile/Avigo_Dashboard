import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { httpinstance } from '../../axios/api';


type producttypeMasterState = {
    producttypeMaster: producttypeMaster[];
    subproducttypeMaster: subproducttypeMaster[];

    totalItems: number;
    totalPages: number;
    currentPage: number;
    loading: boolean;
    error: string | null;
};



interface producttypeMaster {
    _id: string;
    product_type_id: string;
    product_type: string;
    isActive: boolean;
}




type subproducttypeMasterState = {
    subproducttypeMaster: subproducttypeMaster[];
    totalItems: number;
    totalPages: number;
    currentPage: number;
    loading: boolean;
    error: string | null;
};



interface subproducttypeMaster {
    _id: string;
    listing_id: string;
    subproduct_type_id: string;
    product_type_id: string;
    product_type: string;
    subproduct_type: string;
    isActive: boolean;
}

const initialState: producttypeMasterState = {
    producttypeMaster: [],
    subproducttypeMaster: [],
    totalItems: 0,
    totalPages: 0,
    currentPage: 0,
    loading: false,
    error: null,
};


export interface AddproducttypeMasterPayload {
    product_type: string;

}

export interface UpdateproducttypeMasterPayload {
    _id: string;
    product_type: string;
}



export const fetchproducttypeMaster = createAsyncThunk(
    'producttypeMaster/fetchproducttypeMaster',
    async (
        { search = '', page = 0, limit = 10 }: { search?: string; page?: number; limit?: number },
        { rejectWithValue }
    ) => {
        try {

            const response = await httpinstance.get(`product/spareproducttypeRoute/getdata?&search=${search}&page=${page + 1}&limit=${limit}`);
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






export const fetchsubproducttypeMaster = createAsyncThunk(
    'producttypeMaster/fetchsubproducttypeMaster',
    async (
        { search = '', page = 0, limit = 10 }: { search?: string; page?: number; limit?: number },
        { rejectWithValue }
    ) => {
        try {

            const response = await httpinstance.get(`product/subspareproducttypeRoute/getdata-by-buyer-dealer?&search=${search}&page=${page + 1}&limit=${limit}`);
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



export const addproducttypeMaster = createAsyncThunk<producttypeMaster, AddproducttypeMasterPayload>(
    'producttypeMaster/addproducttypeMaster',
    async (formData, { rejectWithValue }) => {
        try {
            const res = await httpinstance.post('product/spareproducttypeRoute/add', formData, {
                headers: { 'Content-Type': 'application/json' },
            });
            return res.data.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to add product_type ');
        }
    }
);



export const updateproducttypeMaster = createAsyncThunk<producttypeMaster, UpdateproducttypeMasterPayload>(
    'producttypeMaster/updateproducttypeMaster',
    async ({ _id, ...formData }, { rejectWithValue }) => {
        try {
            const response = await httpinstance.put(
                `product/spareproducttypeRoute/${_id}/update`,
                formData,
                {
                    headers: { 'Content-Type': 'application/json' },
                }
            );
            return response.data.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to update product_type ');
        }
    }
);


export const deleteproducttypeMaster = createAsyncThunk(
    'producttypeMasters/deleteproducttypeMaster',
    async (_id: string, { rejectWithValue }) => {
        try {
            // Sending the ID as part of the URL
            await httpinstance.put(`product/spareproducttypeRoute/${_id}/isdelete`, { isDeleted: true });
            return _id;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to delete product_type ');
        }
    }
);




export const toggleproducttypeMasterStatus = createAsyncThunk(
    'producttypeMaster/toggleStatus',
    async (
        { _id, isActive }: { _id: string; isActive: boolean },
        { rejectWithValue }
    ) => {
        try {
            const res = await httpinstance.put(
                `product/spareproducttypeRoute/${_id}/isactive`,
                { isActive }
            );
            return res.data.data;
        } catch (err: any) {
            console.error('Toggle Status Error:', err.response?.data || err.message);
            return rejectWithValue(err.response?.data?.message || 'Failed to toggle status');
        }
    }
);



const producttypeMasterSlice = createSlice({
    name: 'producttypeMasters',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(fetchproducttypeMaster.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchproducttypeMaster.fulfilled, (state, action) => {
                state.loading = false;
                state.producttypeMaster = action.payload.data.products;
                state.totalItems = action.payload.totalItems;
                state.totalPages = action.payload.totalPages;
                state.currentPage = action.payload.currentPage;
            })
            .addCase(fetchproducttypeMaster.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })


            .addCase(fetchsubproducttypeMaster.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchsubproducttypeMaster.fulfilled, (state, action) => {
                state.loading = false;
                state.subproducttypeMaster = action.payload.data.products;
                state.totalItems = action.payload.totalItems;
                state.totalPages = action.payload.totalPages;
                state.currentPage = action.payload.currentPage;
            })
            .addCase(fetchsubproducttypeMaster.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            .addCase(addproducttypeMaster.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addproducttypeMaster.fulfilled, (state, action) => {
                state.producttypeMaster.push(action.payload);
            })

            .addCase(addproducttypeMaster.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            .addCase(updateproducttypeMaster.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateproducttypeMaster.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.producttypeMaster.findIndex(item => item._id === action.payload._id);
                if (index !== -1) {
                    state.producttypeMaster[index] = action.payload;
                }
            })
            .addCase(updateproducttypeMaster.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
    },
});

export default producttypeMasterSlice.reducer;