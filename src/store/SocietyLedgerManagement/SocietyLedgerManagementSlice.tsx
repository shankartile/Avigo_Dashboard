import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { httpinstance } from "../../axios/api";
import { getActiveUser } from "../../utility/Cookies";

export interface SocietyLedger {
  _id: string;
  societyId: string;
  societyName?: string;

  entryDate: string;
  category: string;
  description: string;
  amount: number;

  entryType: "Income" | "Expense";
  paymentMode?: string;

  flatNo?: string;
  balance: number;

  isActive: boolean;
  isDeleted: boolean;

  createdAt: string;
  updatedAt: string;
}

interface SocietyLedgerState {
  ledger: SocietyLedger[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  loading: boolean;
  error: string | null;
}

const initialState: SocietyLedgerState = {
  ledger: [],
  totalItems: 0,
  totalPages: 0,
  currentPage: 0,
  loading: false,
  error: null,
};



export interface CreateLedgerPayload {
  societyId: string;
  entryDate: string;
  category: string;
  description: string;
  amount: number;
  entryType: "Income" | "Expense";
  paymentMode?: string;
  flatNo?: string;
}

export interface UpdateLedgerPayload extends CreateLedgerPayload {
  _id: string;
}

/* CREATE LEDGER ENTRY */
export const createLedgerEntry = createAsyncThunk(
  "societyLedger/create",
  async (data: CreateLedgerPayload, { rejectWithValue }) => {
    try {
      const token = getActiveUser()?.accessToken;

      const res = await httpinstance.post(
        "society-ledger",
        data,
        {
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        }
      );

      return res.data.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to create ledger entry"
      );
    }
  }
);

/* FETCH LEDGER */
export const fetchSocietyLedger = createAsyncThunk(
  "societyLedger/fetch",
  async (
    {
      search = "",
      page = 0,
      limit = 10,
      filters,
      fromDate,
      toDate,
      exportType,
      ledgerType,
    }: {
      search?: string;
      page?: number;
      limit?: number;
      filters?: Record<string, any>;
      fromDate?: string;
      toDate?: string;
      exportType?: "csv" | "pdf";
      ledgerType?: "Income" | "Expense";
    },
    { rejectWithValue }
  ) => {
    try {
      const params = new URLSearchParams();

      if (search) params.append("search", search);
      if (page !== undefined) params.append("page", String(page + 1));
      if (limit) params.append("limit", String(limit));

      if (fromDate) params.append("fromDate", fromDate);
      if (toDate) params.append("toDate", toDate);
      if (exportType) params.append("exportType", exportType);
      if (ledgerType) params.append("ledgerType", ledgerType);

      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== "") {
            params.append(`filters[${key}]`, String(value));
          }
        });
      }

      const res = await httpinstance.get(
        `society-ledger?${params.toString()}`
      );

      return {
        data: res.data.data,
        totalPages: res.data.pagination?.totalPages || 1,
        currentPage: res.data.pagination?.currentPage || 1,
        totalItems: res.data.pagination?.totalItems || 0,
      };
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch society ledger"
      );
    }
  }
);

/* UPDATE LEDGER */
export const updateLedgerEntry = createAsyncThunk<
  SocietyLedger,
  UpdateLedgerPayload
>(
  "societyLedger/update",
  async ({ _id, ...data }, { rejectWithValue }) => {
    try {
      const token = getActiveUser()?.accessToken;

      const res = await httpinstance.put(
        `society-ledger/${_id}`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        }
      );

      return res.data.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to update ledger entry"
      );
    }
  }
);

/* DELETE LEDGER */
export const deleteLedgerEntry = createAsyncThunk(
  "societyLedger/delete",
  async (_id: string, { rejectWithValue }) => {
    try {
      await httpinstance.delete(`society-ledger/${_id}`);
      return _id;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to delete ledger entry"
      );
    }
  }
);

/* TOGGLE STATUS */
export const toggleLedgerStatus = createAsyncThunk(
  "societyLedger/toggleStatus",
  async (_id: string, { rejectWithValue }) => {
    try {
      const res = await httpinstance.patch(
        `society-ledger/${_id}/toggle-status`
      );

      return {
        _id,
        isActive: res.data.data.isActive,
      };
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to toggle ledger status"
      );
    }
  }
);


const SocietyLedgerManagementSlice = createSlice({
  name: "societyLedger",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      /* CREATE */
      .addCase(createLedgerEntry.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createLedgerEntry.fulfilled, (state, action) => {
        state.loading = false;
        state.ledger.unshift(action.payload);
      })
      .addCase(createLedgerEntry.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      /* FETCH */
      .addCase(fetchSocietyLedger.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSocietyLedger.fulfilled, (state, action) => {
        state.loading = false;
        state.ledger = action.payload.data;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
        state.totalItems = action.payload.totalItems;
      })
      .addCase(fetchSocietyLedger.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      /* UPDATE */
      .addCase(updateLedgerEntry.fulfilled, (state, action) => {
        const index = state.ledger.findIndex(
          (l) => l._id === action.payload._id
        );
        if (index !== -1) {
          state.ledger[index] = action.payload;
        }
      })

      /* DELETE */
      .addCase(deleteLedgerEntry.fulfilled, (state, action) => {
        state.ledger = state.ledger.filter(
          (l) => l._id !== action.payload
        );
      })

      /* TOGGLE STATUS */
      .addCase(toggleLedgerStatus.fulfilled, (state, action) => {
        const index = state.ledger.findIndex(
          (l) => l._id === action.payload._id
        );
        if (index !== -1) {
          state.ledger[index].isActive = action.payload.isActive;
        }
      });
  },
});

export default SocietyLedgerManagementSlice.reducer;
