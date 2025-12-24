import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { httpinstance } from '../../axios/api';



type TermsandConditionState = {
    termsandcondition: TermsandCondition[];
    selectedTermsandcondition: TermsandCondition | null;
    totalPages: number;
    currentPage: number;
    loading: boolean;
    error: string | null;
};


interface TermsandCondition {
    _id: string;
    title: string;
    type: 'Application' | 'gadiloadmin';
    description: string;


}

const termsAndConditionsInitialState: TermsandConditionState = {
    termsandcondition: [],
    selectedTermsandcondition: null,
    totalPages: 0,
    currentPage: 1,
    loading: false,
    error: null,
};




export interface UpdateTermsandConditionPayload {
    _id: string;
    title: string;
    type: string;
    description: string;
}




// Async thunk to fetch terms and conditions from the API
// export const fetchTermsandConditions = createAsyncThunk<TermsandCondition[]>(
//     'termsandconditions/fetchtermsandconditions',
//     async (_, { rejectWithValue }) => {
//         try {
//             const response = await httpinstance.post(`cms/cmstcRoutes/list`);
//             return response.data.data;
//         } catch (error: any) {
//             return rejectWithValue(error.response?.data || error.message);
//         }
//     }
// );

export const fetchTermsandConditions = createAsyncThunk<
  { data: TermsandCondition[]; totalPages: number; currentPage: number },
  { search?: string; page?: number; limit?: number }
>(
  'termsandconditions/fetchtermsandconditions',
  async ({ search = '', page = 0, limit = 10 }, { rejectWithValue }) => {
    try {
      const response = await httpinstance.get(`/cms/cmstcRoutes/?page=${page + 1}&limit=${limit}`);
      return {
        data: response.data.data.termsandconditions,
        totalPages: response.data.data.pagination.totalPages,
        currentPage: response.data.data.pagination.currentPage,
      };
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);




// Async thunk to update terms and conditions in the API
export const updateTermsandCondition = createAsyncThunk<TermsandCondition, UpdateTermsandConditionPayload>(
    'termsandcondition/updateTermsandCondition',
    async ({ _id, ...formData }, { rejectWithValue }) => {
        try {
            const response = await httpinstance.post(
                `superadmin/termcondition/update?_id=${_id}`,
                formData,
                {
                    headers: { 'Content-Type': 'application/json' },
                }
            );
            return response.data.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to update Terms and Conditions');
        }
    }
);

const termsandconditionslice = createSlice({
    name: 'termsandcondition',
    initialState: termsAndConditionsInitialState,
    reducers: {},
    extraReducers: builder => {
        builder

            .addCase(fetchTermsandConditions.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTermsandConditions.fulfilled, (state, action) => {
                state.loading = false;
                state.termsandcondition = action.payload.data;
                state.totalPages = action.payload.totalPages;
                state.currentPage = action.payload.currentPage;
            })

            .addCase(fetchTermsandConditions.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            .addCase(updateTermsandCondition.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateTermsandCondition.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.termsandcondition.findIndex(TermsandCondition => TermsandCondition._id === action.payload._id);
                if (index !== -1) {
                    state.termsandcondition[index] = action.payload;
                }
            })
            .addCase(updateTermsandCondition.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })



    },


});

export default termsandconditionslice.reducer;