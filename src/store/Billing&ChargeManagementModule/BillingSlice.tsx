import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { httpinstance } from "../../axios/api";

interface Bill {
  _id: string;
  billMonth: string;
  billYear: string;
  flatType: string;
  billType: string;
  amount: number;
  status: "Draft" | "Published";
}

interface BillingState {
  bills: Bill[];
  totalItems: number;
  loading: boolean;
}

const initialState: BillingState = {
  bills: [],
  totalItems: 0,
  loading: false,
};

export const fetchBills = createAsyncThunk(
  "billing/fetch",
  async ({ search, filters, page = 0, limit = 10 }: any) => {
    const res = await httpinstance.get("billing", {
      params: { search, filters, page: page + 1, limit },
    });
    return res.data;
  }
);

export const publishBill = createAsyncThunk(
  "billing/publish",
  async (billId: string) => {
    const res = await httpinstance.patch(`billing/${billId}/publish`);
    return res.data;
  }
);

const BillingSlice = createSlice({
  name: "billing",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBills.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchBills.fulfilled, (state, action) => {
        state.loading = false;
        state.bills = action.payload.data;
        state.totalItems = action.payload.pagination.totalItems;
      })
      .addCase(publishBill.fulfilled, (state, action) => {
        const index = state.bills.findIndex(
          (b) => b._id === action.payload._id
        );
        if (index !== -1) {
          state.bills[index].status = "Published";
        }
      });
  },
});

export default BillingSlice.reducer;
