import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { httpinstance } from '../../axios/api';


type NoticeNameMasterState = {
    NoticeNameMaster: NoticeNameMaster[];
    NoticeCategoryMaster: NoticeCategoryMaster[];
    NoticeTypeMaster: NoticeTypeMaster[];
    totalItems: number;
    totalPages: number;
    currentPage: number;
    loading: boolean;
    error: string | null;
};


interface NoticeCategoryMaster {
    _id: string;
    notice_category_name: string;
    notice_type_name: string;
    isActive: boolean;
}


interface NoticeNameMaster {
    _id: string;
    noticename: string;
    notice_type_id: string;
    notice_type_name: string;
    notice_category_id: string;
    isActive: boolean;
}

interface NoticeTypeMaster {
    _id: string;
    notice_type: string;
    isActive: boolean;
}

const initialState: NoticeNameMasterState = {
    NoticeNameMaster: [],
    NoticeCategoryMaster: [],
    NoticeTypeMaster: [],
    totalItems: 0,
    totalPages: 0,
    currentPage: 0,
    loading: false,
    error: null,
};


export interface AddNoticeNameMasterPayload {
    notice_category_id: string;
    notice_category_name: string;
    noticename: string;
    notice_type_id: string;

}

export interface UpdateNoticeNameMasterPayload {
    _id: string;
    notice_category_id: string;
    noticename: string;
    notice_type_id: string;

}





export const fetchNoticeCategoryMaster = createAsyncThunk(
    'NoticeCategoryMaster/fetchNoticeCategoryMaster',
    async (_, { rejectWithValue }) => {
        try {
            const response = await httpinstance.get(`society/notice_categoryRoute/getdata?page=1&limit=1000`);
            return {
                data: response.data.data, // assuming this has `.brands`
            };
        } catch (error: any) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);




export const fetchNoticeNameMaster = createAsyncThunk(
    'NoticeNameMaster/fetchNoticeNameMaster',
    async (
        { search = '', page = 0, limit = 10 }: { search?: string; page?: number; limit?: number },
        { rejectWithValue }
    ) => {
        try {

            const response = await httpinstance.get(`society/notice_nameRoute/getdata?&search=${search}&page=${page + 1}&limit=${limit}`);
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


export const fetchNoticetype = createAsyncThunk(
    'NoticeNameMaster/fetchNoticetype',
    async (
        { search = '', page = 0, limit = 10 }: { search?: string; page?: number; limit?: number },
        { rejectWithValue }
    ) => {
        try {

            const response = await httpinstance.get(`society/notice_typeRoutes/getdata?&search=${search}&page=${page + 1}&limit=${limit}`);
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


export const addNoticeNameMaster = createAsyncThunk<NoticeNameMaster, AddNoticeNameMasterPayload>(
    'NoticeNameMaster/addNoticeNameMaster',
    async (formData, { rejectWithValue }) => {
        try {
            const res = await httpinstance.post('society/notice_nameRoute/add', formData, {
                headers: { 'Content-Type': 'application/json' },
            });
            return res.data.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to add State');
        }
    }
);


export const updateNoticeNameMaster = createAsyncThunk<NoticeNameMaster, UpdateNoticeNameMasterPayload>(
    'NoticeNameMaster/updateNoticeNameMaster',
    async ({ _id, ...formData }, { rejectWithValue }) => {
        try {
            const response = await httpinstance.put(
                `society/notice_nameRoute/${_id}/update`,
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


export const deleteNoticeNameMaster = createAsyncThunk(
    'NoticeNameMasters/deleteNoticeNameMaster',
    async (_id: string, { rejectWithValue }) => {
        try {
            // Sending the ID as part of the URL
            await httpinstance.put(`society/notice_nameRoute/${_id}/isdelete`, { isDeleted: true });
            return _id;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to delete Notice Name');
        }
    }
);




export const toggleNoticeNameMasterStatus = createAsyncThunk(
    'NoticeNameMaster/toggleStatus',
    async (
        { _id, isActive }: { _id: string; isActive: boolean },
        { rejectWithValue }
    ) => {
        try {
            const res = await httpinstance.put(
                `society/notice_nameRoute/${_id}/isactive`,
                { isActive }
            );
            return res.data.data;
        } catch (err: any) {
            console.error('Toggle Status Error:', err.response?.data || err.message);
            return rejectWithValue(err.response?.data?.message || 'Failed to toggle status');
        }
    }
);

const NoticeNameMasterSlice = createSlice({
    name: 'NoticeNameMasters',
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
            })

            .addCase(fetchNoticeCategoryMaster.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // .addCase(fetchNoticeCategoryMaster.pending, state => {
            //     state.loading = true;
            //     state.error = null;
            // })
            .addCase(fetchNoticeNameMaster.fulfilled, (state, action) => {
                state.loading = false;
                state.NoticeNameMaster = action.payload.data;
                state.NoticeCategoryMaster = action.payload.data;
                state.totalItems = action.payload.totalItems;
                state.totalPages = action.payload.totalPages;
                state.currentPage = action.payload.currentPage;
            })


            .addCase(fetchNoticeNameMaster.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            .addCase(fetchNoticetype.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchNoticetype.fulfilled, (state, action) => {
                state.loading = false;
                state.NoticeTypeMaster = action.payload.data.noticeTypes;
                state.totalItems = action.payload.totalItems;
                state.totalPages = action.payload.totalPages;
                state.currentPage = action.payload.currentPage;
            })


            .addCase(fetchNoticetype.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })


            .addCase(addNoticeNameMaster.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addNoticeNameMaster.fulfilled, (state, action) => {
                state.NoticeNameMaster.push(action.payload);
            })

            .addCase(addNoticeNameMaster.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            .addCase(updateNoticeNameMaster.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateNoticeNameMaster.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.NoticeNameMaster.findIndex(item => item._id === action.payload._id);
                if (index !== -1) {
                    state.NoticeNameMaster[index] = action.payload;
                }
            })
            .addCase(updateNoticeNameMaster.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
    },
});

export default NoticeNameMasterSlice.reducer;