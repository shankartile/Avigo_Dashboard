import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { httpinstance } from '../../axios/api';


type CategoryMasterState = {
    CategoryMaster: CategoryMaster[];
    totalItems: number;
    totalPages: number;
    currentPage: number;
    loading: boolean;
    isActive: boolean;
    error: string | null;
};



interface CategoryMaster {
    _id: string;
    category_name: string;
      isActive: boolean

}

const initialState: CategoryMasterState = {
    CategoryMaster: [],
    totalItems: 0,
    totalPages: 0,
    currentPage: 0,
    isActive: false,
    loading: false,
    error: null,
};


export interface AddCategoryMasterPayload {
    category_name: string;

}

export interface UpdateCategoryMasterPayload {
    _id: string;
    category_name: string;
}


export const fetchCategoryMaster = createAsyncThunk(
    'CategoryMaster/fetchCategoryMaster',
    async (
        { search = '', page = 0, limit = 10 }: { search?: string; page?: number; limit?: number },
        { rejectWithValue }
    ) => {
        try {

            const response = await httpinstance.get(`admin/categoryRoute/getdata?&search=${search}&page=${page + 1}&limit=${limit}`);
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



export const addCategoryMaster = createAsyncThunk<CategoryMaster, AddCategoryMasterPayload>(
    'CategoryMaster/addCategoryMaster',
    async (formData, { rejectWithValue }) => {
        try {
            const res = await httpinstance.post('admin/categoryRoute/add', formData, {
                headers: { 'Content-Type': 'application/json' },
            });
            return res.data.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to add Category');
        }
    }
);


export const updateCategoryMaster = createAsyncThunk<CategoryMaster, UpdateCategoryMasterPayload>(
    'CategoryMaster/updateCategoryMaster',
    async ({ _id, ...formData }, { rejectWithValue }) => {
        try {
            const response = await httpinstance.put(
                `admin/categoryRoute/${_id}/update`,
                formData,
                {
                    headers: { 'Content-Type': 'application/json' },
                }
            );
            return response.data.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to update Category');
        }
    }
);


export const deleteCategoryMaster = createAsyncThunk(
    'CategoryMasters/deleteCategoryMaster',
    async (_id: string, { rejectWithValue }) => {
        try {
            // Sending the ID as part of the URL
            await httpinstance.put(`admin/categoryRoute/${_id}/isdelete`, { isDeleted: true });
            return _id;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to delete Category');
        }
    }
);




export const toggleCategoryMasterStatus = createAsyncThunk(
    'CategoryMaster/toggleStatus',
    async (
        { _id, isActive }: { _id: string; isActive: boolean },
        { rejectWithValue }
    ) => {
        try {
            const res = await httpinstance.put(
                `admin/categoryRoute/${_id}/isactive`,
                { isActive }
            );
            return res.data.data;
        } catch (err: any) {
            console.error('Toggle Status Error:', err.response?.data || err.message);
            return rejectWithValue(err.response?.data?.message || 'Failed to toggle status');
        }
    }
);

const CategoryMasterSlice = createSlice({
    name: 'CategoryMasters',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(fetchCategoryMaster.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCategoryMaster.fulfilled, (state, action) => {
                state.loading = false;
                state.CategoryMaster = action.payload.data.categories; 
                state.totalItems = action.payload.totalItems;
                state.totalPages = action.payload.totalPages;
                state.currentPage = action.payload.currentPage;
            })


            .addCase(fetchCategoryMaster.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            .addCase(addCategoryMaster.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addCategoryMaster.fulfilled, (state, action) => {
                state.CategoryMaster.push(action.payload);
            })

            .addCase(addCategoryMaster.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            .addCase(updateCategoryMaster.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateCategoryMaster.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.CategoryMaster.findIndex(item => item._id === action.payload._id);
                if (index !== -1) {
                    state.CategoryMaster[index] = action.payload;
                }
            })
            .addCase(updateCategoryMaster.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
    },
});

export default CategoryMasterSlice.reducer;