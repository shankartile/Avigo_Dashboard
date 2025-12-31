import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { httpinstance } from '../../axios/api';


type ComplaintCategoryMasterState = {
    ComplaintCategoryMaster: ComplaintCategoryMaster[];
    totalItems: number;
    totalPages: number;
    currentPage: number;
    loading: boolean;
    error: string | null;
};



interface ComplaintCategoryMaster {
    _id: string;
    category: string;
    complaint_type: string;
    complaint_type_name:string;
    complaint_type_id: string;
    isActive: boolean;
}

const initialState: ComplaintCategoryMasterState = {
    ComplaintCategoryMaster: [],
    totalItems: 0,
    totalPages: 0,
    currentPage: 0,
    loading: false,
    error: null,
};


export interface AddComplaintCategoryMasterPayload {
    category: string;
    complaint_type_id: string;

}

export interface UpdateComplaintCategoryMasterPayload {
    _id: string;
    category: string;
    complaint_type_id: string;

}


export const fetchComplaintCategoryMaster = createAsyncThunk(
    'ComplaintCategoryMaster/fetchComplaintCategoryMaster',
    async (
        { search = '', page = 0, limit = 10 }: { search?: string; page?: number; limit?: number },
        { rejectWithValue }
    ) => {
        try {

            const response = await httpinstance.get(`society/complaint_categoryRoutes/getdata?&search=${search}&page=${page + 1}&limit=${limit}`);
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



export const addComplaintCategoryMaster = createAsyncThunk<ComplaintCategoryMaster, AddComplaintCategoryMasterPayload>(
    'ComplaintCategoryMaster/addComplaintCategoryMaster',
    async (formData, { rejectWithValue }) => {
        try {
            const res = await httpinstance.post('society/complaint_categoryRoutes/add', formData, {
                headers: { 'Content-Type': 'application/json' },
            });
            return res.data.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to add Complaint Category. ');
        }
    }
);


export const updateComplaintCategoryMaster = createAsyncThunk<ComplaintCategoryMaster, UpdateComplaintCategoryMasterPayload>(
    'ComplaintCategoryMaster/updateComplaintCategoryMaster',
    async ({ _id, ...formData }, { rejectWithValue }) => {
        try {
            const response = await httpinstance.put(
                `society/complaint_categoryRoutes/${_id}/update`,
                formData,
                {
                    headers: { 'Content-Type': 'application/json' },
                }
            );
            return response.data.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to update Complaint Category ');
        }
    }
);


export const deleteComplaintCategoryMaster = createAsyncThunk(
    'ComplaintCategoryMasters/deleteComplaintCategoryMaster',
    async (_id: string, { rejectWithValue }) => {
        try {
            // Sending the ID as part of the URL
            await httpinstance.put(`society/complaint_categoryRoutes/${_id}/isdelete`, { isDeleted: true });
            return _id;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to delete Complaint Category ');
        }
    }
);




export const toggleComplaintCategoryMasterStatus = createAsyncThunk(
    'ComplaintCategoryMaster/toggleStatus',
    async (
        { _id, isActive }: { _id: string; isActive: boolean },
        { rejectWithValue }
    ) => {
        try {
            const res = await httpinstance.put(
                `society/complaint_categoryRoutes/${_id}/isactive`,
                { isActive }
            );
            return res.data.data;
        } catch (err: any) {
            console.error('Toggle Status Error:', err.response?.data || err.message);
            return rejectWithValue(err.response?.data?.message || 'Failed to toggle status');
        }
    }
);

const ComplaintCategoryMasterSlice = createSlice({
    name: 'ComplaintCategoryMasters',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(fetchComplaintCategoryMaster.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchComplaintCategoryMaster.fulfilled, (state, action) => {
                state.loading = false;
                state.ComplaintCategoryMaster = action.payload.data;
                state.totalItems = action.payload.totalItems;
                state.totalPages = action.payload.totalPages;
                state.currentPage = action.payload.currentPage;
            })

            .addCase(fetchComplaintCategoryMaster.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            .addCase(addComplaintCategoryMaster.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addComplaintCategoryMaster.fulfilled, (state, action) => {
                state.ComplaintCategoryMaster.push(action.payload);
            })

            .addCase(addComplaintCategoryMaster.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            .addCase(updateComplaintCategoryMaster.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateComplaintCategoryMaster.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.ComplaintCategoryMaster.findIndex(item => item._id === action.payload._id);
                if (index !== -1) {
                    state.ComplaintCategoryMaster[index] = action.payload;
                }
            })
            .addCase(updateComplaintCategoryMaster.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
    },
});

export default ComplaintCategoryMasterSlice.reducer;