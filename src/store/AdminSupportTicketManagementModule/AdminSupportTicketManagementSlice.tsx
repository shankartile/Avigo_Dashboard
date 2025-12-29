import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { httpinstance } from '../../axios/api';

type SupportticketState = {
  supportticket: supportticket[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  loading: boolean;
  error: string | null;
  currentTicket: supportticket | null;

};


interface Reply {
  _id: string;
  sender: string;
  message: string;
  attachments?: string[];
  createdAt: string;
}

interface User {
  _id: string;
  phone: string;
  name: string;
  email: string;
}

interface supportticket {
  _id: string;
  userId: User; // previously: string
  userType: string;
  name: string;
  subject: string;
  description: string;
  status: string;
  attachments?: File[]; // explicitly define as array of strings
  replies?: Reply[];
  internalNotes?: string[];
  createdAt?: string;
  updatedAt?: string;

}


const initialState: SupportticketState = {
  supportticket: [],
  totalItems: 0,
  totalPages: 0,
  currentPage: 0,
  loading: false,
  error: null,
  currentTicket: null,
};


export interface AddsupportticketPayload {
  userId: string;
  userType: string;
  subject: string;
  description: string;
  attachments?: string | File[];

}

export interface UpdatesupportticketPayload {
  _id: string;
  userId: string;
  userType: string;
  subject: string;
  description: string;
  attachments?: string | File[];
}


export const fetchTicketById = createAsyncThunk(
  'adminsupportticket/fetchById',
  async ({ id, userType }: { id: string; userType: string }, { rejectWithValue }) => {
    try {
      const endpoint =
        userType === 'Webuser'
          ? `webuser/support_ticketRoute/getbyId/${id}`
          : `admin/support_ticketRoutes/getbyId/${id}`;

      const res = await httpinstance.get(endpoint);
      return res.data.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch ticket');
    }
  }
);


export const fetchsupportticket = createAsyncThunk(
  'adminsupportticket/fetchsupportticket',
  async (
    {
      search = '',
      filters = {},
      page = 0,
      limit = 10,
      type = '',
      fromDate = '',
      toDate = '',
      exportType,
    }: {
      search?: string;
      filters?: Record<string, any>;
      page?: number;
      limit?: number;
      type?: string;
      fromDate?: string;
      toDate?: string;
      exportType?: 'csv' | 'pdf';
    },
    { rejectWithValue }
  ) => {

    try {
      let endpoint = type?.toLowerCase() === 'webuser'
        ? 'webuser/support_ticketRoute/getall'
        : 'admin/support_TicketRoutes/getall';

      const params: Record<string, any> = {
        search,
        page: page + 1,
        limit,
        fromDate,
        toDate,
        ...filters, // spread all filters as query params

      };
      if (exportType) {
        params.exportType = exportType;
        const exportRes = await httpinstance.get(endpoint, { params });
        const fileUrl =
          exportRes.data?.downloadUrls?.[exportType] ||
          exportRes.data?.data?.downloadUrls?.[exportType];

        if (fileUrl) {
          const link = document.createElement('a');
          link.href = fileUrl;
          link.target = '_blank';
          link.setAttribute('download', `support-ticket-export.${exportType}`);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }

        //  Prevent empty export response from overwriting table
        return {
          data: [],
          totalItems: 0,
          totalPages: 1,
          currentPage: 1,
        };
      }



      const response = await httpinstance.get(endpoint, { params });
      const result = response.data?.data || [];
      const pagination = response.data?.pagination ?? {};

      return {
        data: result,
        totalItems: pagination.totalItems || 0,
        totalPages: pagination.totalPages || 1,
        currentPage: pagination.currentPage || 1,
      };
    } catch (error: any) {
      console.error('Support ticket fetch/export error:', error.response?.data || error.message);
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch or export support tickets');
    }
  }
);



export const deleteItem = createAsyncThunk(
  'adminsupportticket/deleteItem',
  async (_id: string, { rejectWithValue }) => {
    try {
      // Sending the ID as part of the URL
      await httpinstance.delete(`webuser/support_ticketRoute/${_id}/delete`);
      return _id;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to delete supportticket');
    }
  }
);


// PATCH - Update Ticket Status
export const updateTicketStatus = createAsyncThunk(
  'adminsupportticket/updateStatus',
  async (
    { id, status, userType }: { id: string; status: string; userType: string },
    { rejectWithValue }
  ) => {
    try {
      const endpoint =
        userType === 'Admin'
          ? `admin/support_TicketRoutes/${id}/status`
          : `webuser/support_ticketRoute/${id}/status`;

      const res = await httpinstance.patch(endpoint, { status });
      return { id, status };
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to update ticket status');
    }
  }
);


// POST - Add Internal Note
export const addTicketNote = createAsyncThunk(
  'adminsupportticket/addNote',
  async (
    { id, note, userType }: { id: string; note: string; userType: string },
    { rejectWithValue }
  ) => {
    try {
      const endpoint =
        userType === 'Admin'
          ? `admin/support_TicketRoutes/${id}/note`
          : `webuser/support_ticketRoute/${id}/note`;

      await httpinstance.post(endpoint, { note });
      return { id, note };
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to add internal note');
    }
  }
);




// POST - Reply message to Ticket (dealer or buyer)
export const sendMessageToTicket = createAsyncThunk(
  'adminsupportticket/sendMessage',
  async (
    {
      id,
      userType,
      message,
      attachments,
    }: { id: string; userType: string; message: string; attachments?: File | File[] },
    { rejectWithValue }
  ) => {
    try {
      const formData = new FormData();
      formData.append('message', message);
      formData.append('sender', 'Admin');

      if (attachments) {
        const files = Array.isArray(attachments) ? attachments : [attachments];
        files.forEach(file => formData.append('attachments', file));
      }

      const endpoint =
        userType === 'Admin'
          ? `admin/support_TicketRoutes/support-tickets/${id}/messages`
          : `webuser/support_ticketRoute/support-tickets/${id}/messages`;

      const res = await httpinstance.post(endpoint, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      return {
        id,
        replies: res.data?.data?.replies || [],
        message: res.data?.data?.message || message,
        attachments: res.data?.data?.attachments || [],
      };
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to send message');
    }
  }
);




const AdminSupportTicketManagementSlice = createSlice({
  name: 'adminsupportticket',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchsupportticket.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchsupportticket.fulfilled, (state, action) => {
        state.loading = false;
        state.supportticket = action.payload.data;
        state.totalItems = action.payload.totalItems;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;

      })
      .addCase(fetchsupportticket.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })


      .addCase(fetchTicketById.fulfilled, (state, action) => {
        state.currentTicket = action.payload;
      })

      .addCase(sendMessageToTicket.fulfilled, (state, action) => {
        const { id, replies } = action.payload;

        // Update list (if showing all tickets)
        const ticket = state.supportticket.find(t => t._id === id);
        if (ticket) {
          ticket.replies = replies;
        }

        //  Also update currentTicket (used in detailed view)
        if (state.currentTicket?._id === id) {
          state.currentTicket.replies = replies;
        }
      })


      .addCase(updateTicketStatus.fulfilled, (state, action) => {
        const { id, status } = action.payload;

        // Update in list view
        const ticket = state.supportticket.find(t => t._id === id);
        if (ticket) {
          ticket.status = status;
        }

        //  Also update currentTicket for instant UI reflection
        if (state.currentTicket?._id === id) {
          state.currentTicket.status = status;
        }
      })


      .addCase(addTicketNote.fulfilled, (state, action) => {
        const { id, note } = action.payload;
        const ticket = state.supportticket.find(t => t._id === id);
        if (ticket) {
          if (!ticket.internalNotes) ticket.internalNotes = [];
          ticket.internalNotes.push(note);
        }

        if (state.currentTicket?._id === id) {
          if (!state.currentTicket.internalNotes) state.currentTicket.internalNotes = [];
          state.currentTicket.internalNotes.push(note);
        }
      });


  },
});

export default AdminSupportTicketManagementSlice.reducer;