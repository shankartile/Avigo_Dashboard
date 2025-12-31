import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { httpinstance } from '../../axios/api';


type ComplaintNameMasterState = {
    ComplaintNameMaster: ComplaintNameMaster[];
    ComplaintCategoryMaster: ComplaintCategoryMaster[];
    ComplaintTypeMaster: ComplaintTypeMaster[];
    totalItems: number;
    totalPages: number;
    currentPage: number;
    loading: boolean;
    error: string | null;
};


interface ComplaintCategoryMaster {
    _id: string;
    complaint_category_name: string;
    complaint_type_name: string;
    isActive: boolean;
}


interface ComplaintNameMaster {
    _id: string;
    complaintname: string;
    complaint_type_id: string;
    complaint_type_name: string;
    complaint_category_id: string;
    isActive: boolean;
}

interface ComplaintTypeMaster {
    _id: string;
    complaint_type: string;
    isActive: boolean;
}

const initialState: ComplaintNameMasterState = {
    ComplaintNameMaster: [],
    ComplaintCategoryMaster: [],
    ComplaintTypeMaster: [],
    totalItems: 0,
    totalPages: 0,
    currentPage: 0,
    loading: false,
    error: null,
};


export interface AddComplaintNameMasterPayload {
    complaint_category_id: string;
    complaint_category_name: string;
    complaintname: string;
    complaint_type_id: string;

}

export interface UpdateComplaintNameMasterPayload {
    _id: string;
    complaint_category_id: string;
    complaintname: string;
    complaint_type_id: string;

}





export const fetchComplaintCategoryMaster = createAsyncThunk(
    'ComplaintCategoryMaster/fetchComplaintCategoryMaster',
    async (_, { rejectWithValue }) => {
        try {
            const response = await httpinstance.get(`society/complaint_categoryRoute/getdata?page=1&limit=1000`);
            return {
                data: response.data.data, // assuming this has `.brands`
            };
        } catch (error: any) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);




export const fetchComplaintNameMaster = createAsyncThunk(
    'ComplaintNameMaster/fetchComplaintNameMaster',
    async (
        { search = '', page = 0, limit = 10 }: { search?: string; page?: number; limit?: number },
        { rejectWithValue }
    ) => {
        try {

            const response = await httpinstance.get(`society/complaint_nameRoute/getdata?&search=${search}&page=${page + 1}&limit=${limit}`);
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


export const fetchComplainttype = createAsyncThunk(
    'ComplaintNameMaster/fetchComplainttype',
    async (
        { search = '', page = 0, limit = 10 }: { search?: string; page?: number; limit?: number },
        { rejectWithValue }
    ) => {
        try {

            const response = await httpinstance.get(`society/complaint_typeRoutes/getdata?&search=${search}&page=${page + 1}&limit=${limit}`);
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


export const addComplaintNameMaster = createAsyncThunk<ComplaintNameMaster, AddComplaintNameMasterPayload>(
    'ComplaintNameMaster/addComplaintNameMaster',
    async (formData, { rejectWithValue }) => {
        try {
            const res = await httpinstance.post('society/complaint_nameRoute/add', formData, {
                headers: { 'Content-Type': 'application/json' },
            });
            return res.data.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to add State');
        }
    }
);


export const updateComplaintNameMaster = createAsyncThunk<ComplaintNameMaster, UpdateComplaintNameMasterPayload>(
    'ComplaintNameMaster/updateComplaintNameMaster',
    async ({ _id, ...formData }, { rejectWithValue }) => {
        try {
            const response = await httpinstance.put(
                `society/complaint_nameRoute/${_id}/update`,
                formData,
                {
                    headers: { 'Content-Type': 'application/json' },
                }
            );
            return response.data.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to update State');
        }
    }
);


export const deleteComplaintNameMaster = createAsyncThunk(
    'ComplaintNameMasters/deleteComplaintNameMaster',
    async (_id: string, { rejectWithValue }) => {
        try {
            // Sending the ID as part of the URL
            await httpinstance.put(`society/complaint_nameRoute/${_id}/isdelete`, { isDeleted: true });
            return _id;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to delete Complaint Name');
        }
    }
);




export const toggleComplaintNameMasterStatus = createAsyncThunk(
    'ComplaintNameMaster/toggleStatus',
    async (
        { _id, isActive }: { _id: string; isActive: boolean },
        { rejectWithValue }
    ) => {
        try {
            const res = await httpinstance.put(
                `society/complaint_nameRoute/${_id}/isactive`,
                { isActive }
            );
            return res.data.data;
        } catch (err: any) {
            console.error('Toggle Status Error:', err.response?.data || err.message);
            return rejectWithValue(err.response?.data?.message || 'Failed to toggle status');
        }
    }
);

const ComplaintNameMasterSlice = createSlice({
    name: 'ComplaintNameMasters',
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
            })

            .addCase(fetchComplaintCategoryMaster.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // .addCase(fetchComplaintCategoryMaster.pending, state => {
            //     state.loading = true;
            //     state.error = null;
            // })
            .addCase(fetchComplaintNameMaster.fulfilled, (state, action) => {
                state.loading = false;
                state.ComplaintNameMaster = action.payload.data;
                state.ComplaintCategoryMaster = action.payload.data;
                state.totalItems = action.payload.totalItems;
                state.totalPages = action.payload.totalPages;
                state.currentPage = action.payload.currentPage;
            })


            .addCase(fetchComplaintNameMaster.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            .addCase(fetchComplainttype.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchComplainttype.fulfilled, (state, action) => {
                state.loading = false;
                state.ComplaintTypeMaster = action.payload.data.complaintTypes;
                state.totalItems = action.payload.totalItems;
                state.totalPages = action.payload.totalPages;
                state.currentPage = action.payload.currentPage;
            })


            .addCase(fetchComplainttype.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })


            .addCase(addComplaintNameMaster.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addComplaintNameMaster.fulfilled, (state, action) => {
                state.ComplaintNameMaster.push(action.payload);
            })

            .addCase(addComplaintNameMaster.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            .addCase(updateComplaintNameMaster.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateComplaintNameMaster.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.ComplaintNameMaster.findIndex(item => item._id === action.payload._id);
                if (index !== -1) {
                    state.ComplaintNameMaster[index] = action.payload;
                }
            })
            .addCase(updateComplaintNameMaster.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
    },
});

export default ComplaintNameMasterSlice.reducer;