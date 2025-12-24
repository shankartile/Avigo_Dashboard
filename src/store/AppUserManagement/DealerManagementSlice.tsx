import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { httpinstance } from '../../axios/api';
import { DealerManagementType } from '../../components/superadmin/DealerManagement/DealerManagement';


type DealerState = {
  dealerList: DealerManagement[];
  selectedDealer: DealerManagementType | null;
  dealerListings: any[];
  dealerSubscription: any[];                      // for car/bike listings
  dealerActivity: any[];                          // for dealer activity logs
  dealerLeads: any[];
  CityMaster: any[];                           // for dealer leads
  kycDetails: any | null;
  totalItems: number;
  totalPages: number;
  currentPage: number;
  loading: boolean;
  error: string | null;
};

type CityMasterState = {
  CityMasterState: CityMasterState[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  loading: boolean;
  error: string | null;
};
interface CityMaster {
  _id: string;
  city_name: string;
  isActive: boolean
}

interface DealerManagement {
  _id: string;
  name?: string;
  email: string;
  phone: string;
  createdAt: string;
  updatedAt: string;
  aadhar_no: string;
  is_verified: boolean;
  is_profile_completed: boolean;
  isActive: boolean;
  isDelete: boolean;
}


export interface updateDealerProfilePayload {
  userId: string;
  phone: string;
  email: string;
  name: string;
}


export interface updateDealerBusinessDetailsPayload {
  userId: string;
  business_name: string;
  address: string;
  business_contact_no: string;
  business_whatsapp_no: string;
}




const initialState: DealerState = {
  dealerList: [], // for fetchDealer
  selectedDealer: null,
  dealerListings: [], // for car/bike listings
  dealerSubscription: [], // for dealer subscriptions
  dealerActivity: [], // for dealer activity logs
  dealerLeads: [], // for dealer leads
  CityMaster: [],
  kycDetails: null,
  totalItems: 0,
  totalPages: 0,
  currentPage: 0,
  loading: false,
  error: null,
};

// export const fetchDealer = createAsyncThunk(
//   'Dealer/fetchDealer',
//   async (
//     {
//       search = '',
//       searchField = '',
//       page = 0,
//       limit = 10,
//       fromDate = '',
//       toDate = '',
//       isActive, // 
//       exportType,
//     }: {
//       search?: string;
//       searchField?: string;
//       page?: number;
//       limit?: number;
//       fromDate?: string;
//       toDate?: string;
//       isActive?: boolean; //
//       exportType?: 'csv' | 'pdf';
//     },
//     { rejectWithValue }
//   ) => {
//     try {
//       const params: any = {
//         search,
//         searchField,
//         page: page + 1,
//         limit,
//         fromDate,
//         toDate,
//       };

//       //  Add isActive if provided
//       if (isActive !== undefined) {
//         params.isActive = isActive;
//       }

//       if (exportType) {
//         const exportRes = await httpinstance.get('dealer/auth/get-all-dealers', {
//           params: { ...params, exportType },
//         });

//         const fileUrl = exportRes.data?.data?.downloadUrls?.[exportType];
//         if (fileUrl) {
//           const link = document.createElement('a');
//           link.href = fileUrl;
//           link.target = '_blank';
//           link.setAttribute('download', `dealer-export.${exportType}`);
//           document.body.appendChild(link);
//           link.click();
//           document.body.removeChild(link);
//         }
//       }

//       const response = await httpinstance.get('dealer/auth/get-all-dealers', {
//         params,
//       });

//       const payload = response.data;
//       return {
//         data: payload.data,
//         totalItems: payload.pagination?.totalItems ?? 0,
//         totalPages: payload.pagination?.totalPages ?? 0,
//         currentPage: payload.pagination?.currentPage ?? 0,
//       };

//     } catch (error: any) {
//       console.error('Dealer fetch/export error:', error.response?.data || error.message);
//       return rejectWithValue(error.response?.data?.message || 'Failed to fetch dealer data');
//     }
//   }
// );



export const fetchDealer = createAsyncThunk(
  'Dealer/fetchDealer',
  async (
    {
      search = '',
      filters = {},
      page = 0,
      limit = 10,
      fromDate = '',
      toDate = '',
      exportType,
    }: {
      filters?: Record<string, any>;
      search?: string;
      page?: number;
      limit?: number;
      fromDate?: string;
      toDate?: string;
      exportType?: 'csv' | 'pdf';
    },
    { rejectWithValue }
  ) => {
    try {
      const params: any = {
        page: page + 1,
        limit,
        fromDate,
        search,
        toDate,
        ...filters, // spread all filters as query params
      };

      if (exportType) {
        const exportRes = await httpinstance.get('dealer/auth/get-all-dealers', {
          params: { ...params, exportType },
        });

        const fileUrl = exportRes.data?.downloadUrls?.[exportType];
        if (fileUrl) {
          const link = document.createElement('a');
          link.href = fileUrl;
          link.target = '_blank';
          link.setAttribute('download', `dealer-export.${exportType}`);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      }

      const response = await httpinstance.get('dealer/auth/get-all-dealers', {
        params,
      });

      const payload = response.data;
      return {
        data: payload.data,
        totalItems: payload.pagination?.totalItems ?? 0,
        totalPages: payload.pagination?.totalPages ?? 0,
        currentPage: payload.pagination?.currentPage ?? 0,
      };
    } catch (error: any) {
      console.error('Dealer fetch/export error:', error.response?.data || error.message);
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch dealer data');
    }
  }
);



export const fetchDealerById = createAsyncThunk(
  "dealer/fetchById",
  async (dealerId: string, { rejectWithValue }) => {
    try {
      const response = await httpinstance.get(`dealer/auth/get-all-dealers/${dealerId}`);
      return response.data.data.user;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);



export const fetchCarListingbydealer = createAsyncThunk(
  'Dealer/fetchCarListingbydealer',
  async (
    {
      search = '',
      page = 0,
      limit = 10,
      type = '',
      userId,
    }: { search?: string; page?: number; limit?: number; type?: string; userId: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await httpinstance.post(
        `product/carRoutes/cars_by_dealerid_for_admin`,
        { user_id: userId }, // POST body
        {
          params: {
            search,
            page: page + 1,
            limit,
          },
        }
      );

      return {
        data: response.data.data.cars ?? [],
        totalItems: response.data.pagination?.totalItems ?? 0,
        totalPages: response.data.pagination?.totalPages ?? 0,
        currentPage: response.data.pagination?.currentPage ?? 0,
      };
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);


export const fetchBikeListingbydealer = createAsyncThunk(
  'Dealer/fetchBikeListingbydealer',
  async (
    {
      search = '',
      page = 0,
      limit = 10,
      type = '',
      userId,
    }: { search?: string; page?: number; limit?: number; type?: string; userId: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await httpinstance.post(`product/bikeRoute/bikes_by_dealerid_for_admin`, { user_id: userId }, // POST body
        {
          params: {
            search,
            page: page + 1,
            limit,
          },
        });

      return {
        data: response.data.data.bikes ?? [],
        totalItems: response.data.pagination?.totalItems ?? 0,
        totalPages: response.data.pagination?.totalPages ?? 0,
        currentPage: response.data.pagination?.currentPage ?? 0,
      };
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);


export const fetchSparepartListingbydealer = createAsyncThunk(
  'Dealer/fetchSparepartListingbydealer',
  async (
    {
      search = '',
      page = 0,
      limit = 10,
      type = '',
      userId,
    }: { search?: string; page?: number; limit?: number; type?: string; userId: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await httpinstance.post(`product/spareRoute/spare_by_dealerid_for_admin`, { user_id: userId }, // POST body
        {
          params: {
            search,
            page: page + 1,
            limit,
          },
        });

      return {
        data: response.data.data.spares ?? [],
        totalItems: response.data.pagination?.totalItems ?? 0,
        totalPages: response.data.pagination?.totalPages ?? 0,
        currentPage: response.data.pagination?.currentPage ?? 0,
      };
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);



export const fetchSubscriptionbydealer = createAsyncThunk(
  'Dealer/fetchSubscriptionbydealer',
  async (
    {
      search = '',
      page = 0,
      limit = 10,
      type = '',
      userId,
    }: { search?: string; page?: number; limit?: number; type?: string; userId: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await httpinstance.get(
        `dealer/dealerSubscriptionRoute/dealer_foradmin/${userId}`,
        {
          params: {
            search,
            page: page + 1,
            limit,
          },
        }
      );

      return {
        data: response.data.data.subscriptions ?? [],
        totalItems: response.data.pagination?.totalItems ?? 0,
        totalPages: response.data.pagination?.totalPages ?? 0,
        currentPage: response.data.pagination?.currentPage ?? 0,
      };
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);



export const fetchActivitybydealer = createAsyncThunk(
  'Dealer/fetchActivitybydealer',
  async (
    {
      search = '',
      page = 0,
      limit = 10,
      userId,
      exportType,
    }: {
      search?: string;
      page?: number;
      limit?: number;
      userId: string;
      exportType?: 'csv' | 'pdf';
    },
    { rejectWithValue }
  ) => {
    try {
      const params: any = {
        search,
        page: page + 1,
        limit,

      };

      const endpoint = `dealer/deaeractivityogRoute/for_adimn_activity_logs/${userId}`;

      // Handle Export
      if (exportType) {
        const exportRes = await httpinstance.get(endpoint, {
          params: { ...params, exportType },
        });

        const fileUrl = exportRes.data?.data?.downloads?.[exportType];
        if (fileUrl) {
          const link = document.createElement('a');
          link.href = fileUrl;
          link.target = '_blank';
          link.setAttribute('download', `dealer-activity-export.${exportType}`);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }

        // Return empty state for store when exporting
        return { data: [], totalItems: 0, totalPages: 0, currentPage: 0 };
      }

      // Normal Fetch
      const response = await httpinstance.get(endpoint, {
        params,
      });

      const payload = response.data?.data || {};
      return {
        data: payload.data ?? [],
        totalItems: payload.pagination?.totalItems ?? 0,
        totalPages: payload.pagination?.totalPages ?? 0,
        currentPage: payload.pagination?.currentPage ?? 0,
      };
    } catch (error: any) {
      console.error('Dealer Activity fetch/export error:', error.response?.data || error.message);
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch dealer activity logs');
    }
  }
);


export const fetchLeads = createAsyncThunk(
  'Dealer/fetchLeads',
  async (
    {
      search = '',
      page = 0,
      limit = 10,
      userId,
    }: { search?: string; page?: number; limit?: number; userId: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await httpinstance.get(
        `dealer/dealerleadRoute/getall_leads_bydelerid_for_admin/${userId}`,
        {
          params: {
            search,
            page: page + 1,
            limit,
          },
        }
      );

      return {
        data: response.data.data.leads ?? [],
        totalItems: response.data.pagination?.totalItems ?? 0,
        totalPages: response.data.pagination?.totalPages ?? 0,
        currentPage: response.data.pagination?.currentPage ?? 0,
      };
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchKycDetails = createAsyncThunk(
  'Dealer/fetchKycDetails',
  async ({ dealerId }: { dealerId: string }, { rejectWithValue }) => {
    try {
      const response = await httpinstance.get(`dealer/auth/kycdetails/${dealerId}`);

      const result = response.data?.data?.dealer?.result?.[0];
      if (!result) return null;

      return {
        pdfUrl: result.pdfUrl,
        CertificateData: result.data_json?.Certificate?.CertificateData || null,
      };
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch KYC details');
    }
  }
);




export const updateDealerProfile = createAsyncThunk<DealerManagement, updateDealerProfilePayload>(
  'Dealer/updateDealer',
  async (payload, { rejectWithValue }) => {
    try {
      const formData = {
        ...payload,
      };

      const response = await httpinstance.put(
        `dealer/auth/update-profile-byadmin`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );
      return response.data.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to update Dealer');
    }
  }
);

export const updateDealerBusinessDetails = createAsyncThunk<any, updateDealerBusinessDetailsPayload>(
  'Dealer/updateDealerBusinessDetails',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await httpinstance.put(
        `dealer/auth/update-business-byadmin`,
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to update business details');
    }
  }
);

//   Delete User
export const deleteDealer = createAsyncThunk(
  'Dealer/deleteDealer',
  async (_id: string, { rejectWithValue }) => {
    try {
      await httpinstance.put(`dealer/auth/${_id}/isdelete`,);
      return _id;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to delete Dealer');
    }
  }
);

//  Toggle User Active/Inactive
export const toggleDealerStatus = createAsyncThunk(
  'Dealer/toggleDealerStatus',
  async ({ _id, isActive }: { _id: string; isActive: boolean }, { rejectWithValue }) => {
    try {
      await httpinstance.put(`dealer/auth/${_id}/isactive`, { isActive: true });
      return { _id, isActive };
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to update user Dealer');
    }
  }
);


export const fetchCityMaster = createAsyncThunk(
  'Citymaster/fetchCitymaster',
  async (
    { search = '', page = 0, limit = 100000 }: { search?: string; page?: number; limit?: number },
    { rejectWithValue }
  ) => {
    try {

      const response = await httpinstance.get(`admin/cityRoute/getdata?&search=${search}&page=${page + 1}&limit=${limit}`);
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



const DealerManagementSlice = createSlice({
  name: 'Dealer',
  initialState,
  reducers: {
    setSelectedDealer: (state, action: PayloadAction<DealerManagementType | null>) => {
      state.selectedDealer = action.payload;
    },
  },
  extraReducers: builder => {
    builder

      .addCase(fetchDealer.pending, state => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchDealer.fulfilled, (state, action) => {
        state.loading = false;
        state.dealerList = action.payload.data;
        state.totalItems = action.payload.totalItems;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
      })


      .addCase(fetchDealerById.fulfilled, (state, action) => {
        state.selectedDealer = action.payload;
      })
      .addCase(fetchDealerById.rejected, (state, action) => {
        state.selectedDealer = null;
        state.error = action.payload as string;
      })

      .addCase(fetchCarListingbydealer.pending, state => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchCarListingbydealer.fulfilled, (state, action) => {
        state.loading = false;
        state.dealerListings = action.payload.data.map((item: any) => ({
          ...item,
          type: 'car',
        }));
        state.totalItems = action.payload.totalItems;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
      })

      .addCase(fetchCarListingbydealer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(fetchBikeListingbydealer.pending, state => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchBikeListingbydealer.fulfilled, (state, action) => {
        state.loading = false;
        state.dealerListings = action.payload.data.map((item: any) => ({
          ...item,
          type: 'bike',
        }));
        state.totalItems = action.payload.totalItems;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
      })

      .addCase(fetchBikeListingbydealer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })



      .addCase(fetchSparepartListingbydealer.pending, state => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchSparepartListingbydealer.fulfilled, (state, action) => {
        state.loading = false;
        state.dealerListings = action.payload.data.map((item: any) => ({
          ...item,
          type: 'sparepart',
        }));
        state.totalItems = action.payload.totalItems;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
      })

      .addCase(fetchSparepartListingbydealer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchSubscriptionbydealer.pending, state => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchSubscriptionbydealer.fulfilled, (state, action) => {
        state.loading = false;
        state.dealerSubscription = action.payload.data;
        state.totalItems = action.payload.totalItems;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
      })

      .addCase(fetchSubscriptionbydealer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })


      .addCase(fetchActivitybydealer.pending, state => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchActivitybydealer.fulfilled, (state, action) => {
        state.loading = false;
        state.dealerActivity = action.payload.data;
        state.totalItems = action.payload.totalItems;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
      })

      .addCase(fetchActivitybydealer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })


      .addCase(fetchLeads.pending, state => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchLeads.fulfilled, (state, action) => {
        state.loading = false;
        state.dealerLeads = action.payload.data;
        state.totalItems = action.payload.totalItems;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
      })

      .addCase(fetchLeads.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchKycDetails.pending, state => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchKycDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.kycDetails = action.payload;   // now has pdfUrl + CertificateData
      })

      .addCase(fetchKycDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.kycDetails = null;
      })





      .addCase(deleteDealer.fulfilled, (state, action) => {
        state.dealerList = state.dealerList.filter(user => user._id !== action.payload);
      })

      // Handle active/inactive toggle
      .addCase(toggleDealerStatus.fulfilled, (state, action) => {
        const index = state.dealerList.findIndex(user => user._id === action.payload._id);
        if (index !== -1) {
          state.dealerList[index].isActive = action.payload.isActive;
        }
      })


      .addCase(fetchCityMaster.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCityMaster.fulfilled, (state, action) => {
        state.loading = false;
        state.CityMaster = action.payload.data;
        state.totalItems = action.payload.totalItems;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
      })
      .addCase(fetchCityMaster.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });


  },
});

export default DealerManagementSlice.reducer;
export const { setSelectedDealer } = DealerManagementSlice.actions;
