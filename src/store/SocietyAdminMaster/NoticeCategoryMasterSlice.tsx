import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { httpinstance } from '../../axios/api';


type NoticeCategoryMasterState = {
     NoticeCategoryMaster:  NoticeCategoryMaster[];
    totalItems: number;
    totalPages: number;
    currentPage: number;
    loading: boolean;
    error: string | null;
};



interface  NoticeCategoryMaster {
    _id: string;
    category: string;
     notice_type: string;
     notice_type_name:string;
     notice_type_id: string;
    isActive: boolean;
}

const initialState:  NoticeCategoryMasterState = {
     NoticeCategoryMaster: [],
    totalItems: 0,
    totalPages: 0,
    currentPage: 0,
    loading: false,
    error: null,
};


export interface AddNoticeCategoryMasterPayload {
    category: string;
    notice_type_id: string;

}

export interface UpdateNoticeCategoryMasterPayload {
    _id: string;
    category: string;
    notice_type_id: string;

}


export const fetchNoticeCategoryMaster = createAsyncThunk(
    'NoticeCategoryMaster/fetchNoticeCategoryMaster',
    async (
        { search = '', page = 0, limit = 10 }: { search?: string; page?: number; limit?: number },
        { rejectWithValue }
    ) => {
        try {

            const response = await httpinstance.get(`society/notice_categoryRoutes/getdata?&search=${search}&page=${page + 1}&limit=${limit}`);
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



export const addNoticeCategoryMaster = createAsyncThunk<NoticeCategoryMaster, AddNoticeCategoryMasterPayload>(
    'NoticeCategoryMaster/addNoticeCategoryMaster',
    async (formData, { rejectWithValue }) => {
        try {
            const res = await httpinstance.post('society/notice_categoryRoutes/add', formData, {
                headers: { 'Content-Type': 'application/json' },
            });
            return res.data.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to add Notice Category. ');
        }
    }
);


export const updateNoticeCategoryMaster = createAsyncThunk<NoticeCategoryMaster, UpdateNoticeCategoryMasterPayload>(
    'NoticeCategoryMaster/updateNoticeCategoryMaster',
    async ({ _id, ...formData }, { rejectWithValue }) => {
        try {
            const response = await httpinstance.put(
                `society/notice_categoryRoutes/${_id}/update`,
                formData,
                {
                    headers: { 'Content-Type': 'application/json' },
                }
            );
            return response.data.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to update Notice Category ');
        }
    }
);


export const deleteNoticeCategoryMaster = createAsyncThunk(
    'NoticeCategoryMasters/deleteNoticeCategoryMaster',
    async (_id: string, { rejectWithValue }) => {
        try {
            // Sending the ID as part of the URL
            await httpinstance.put(`society/notice_categoryRoutes/${_id}/isdelete`, { isDeleted: true });
            return _id;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to delete Notice Category ');
        }
    }
);




export const toggleNoticeCategoryMasterStatus = createAsyncThunk(
    'NoticeCategoryMaster/toggleStatus',
    async (
        { _id, isActive }: { _id: string; isActive: boolean },
        { rejectWithValue }
    ) => {
        try {
            const res = await httpinstance.put(
                `society/notice_categoryRoutes/${_id}/isactive`,
                { isActive }
            );
            return res.data.data;
        } catch (err: any) {
            console.error('Toggle Status Error:', err.response?.data || err.message);
            return rejectWithValue(err.response?.data?.message || 'Failed to toggle status');
        }
    }
);

const NoticeCategoryMasterSlice = createSlice({
    name: 'NoticeCategoryMasters',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(fetchNoticeCategoryMaster.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchNoticeCategoryMaster.fulfilled, (state, action) => {
                state.loading = false;
                state.NoticeCategoryMaster = action.payload.data;
                state.totalItems = action.payload.totalItems;
                state.totalPages = action.payload.totalPages;
                state.currentPage = action.payload.currentPage;
            })

            .addCase(fetchNoticeCategoryMaster.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            .addCase(addNoticeCategoryMaster.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addNoticeCategoryMaster.fulfilled, (state, action) => {
                state.NoticeCategoryMaster.push(action.payload);
            })

            .addCase(addNoticeCategoryMaster.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            .addCase(updateNoticeCategoryMaster.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateNoticeCategoryMaster.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.NoticeCategoryMaster.findIndex(item => item._id === action.payload._id);
                if (index !== -1) {
                    state.NoticeCategoryMaster[index] = action.payload;
                }
            })
            .addCase(updateNoticeCategoryMaster.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
    },
});

export default NoticeCategoryMasterSlice.reducer;