import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { httpinstance } from '../../axios/api';
import { removeTokenCookie, saveCookies } from '../../utility/Cookies';
import { jwtDecode } from 'jwt-decode';

type TokenPayload = {
  id: string;
  email: string;
  role: string;
  exp: number;
};

// --- Types ---
type Permission = {
  _id: string;
  permissionId: string;
  allowed: boolean;
  key: string;
  label: string;
};

type User = {
  data: {
    id: string;
    email: string;
    role: string;
    permissions: Permission[];
  };
};


type LoginCredentials = {
  email: string;
  password: string;
};

type OTPVerificationPayload = {
  phone: string;
  enteredOtp: string;
};

type AuthState = {
  user: User | null;
  loading: boolean;
  error: string | null;
  otpSent: boolean;
  phone: string | null;
};



// --- Initial State ---
const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
  otpSent: false,
  phone: null,
};

// // --- Thunk ---
// export const requestOtp = createAsyncThunk(
//   'auth/requestOtp',
//   async (creds: LoginCredentials, { rejectWithValue }) => {
//     try {
//       const res = await httpinstance.post('/admin/auth/request-otp', creds);

//       return res.data.data; // returns { message, phone }
//     } catch (err: any) {
//       return rejectWithValue(err.response?.data?.message || 'Failed to request OTP');
//     }
//   }
// );


export const requestOtp = createAsyncThunk(
  'auth/requestOtp',
  async (creds: LoginCredentials, { rejectWithValue }) => {
    try {
      const res = await httpinstance.post('/admin/auth/request-otp', creds);
      return res.data.data; // { message, phone, role }
    } catch (err: any) {
      // Pass the full backend response object
      return rejectWithValue(err.response?.data || {
        message: 'Failed to request OTP',
        code: 'UNKNOWN_ERROR'
      });
    }
  }
);


// export const verifyOtp = createAsyncThunk<
//   User,
//   { phone: string; enteredOtp: string },
//   { rejectValue: string }
// >(
//   'auth/verifyOtp',
//   async (payload, { rejectWithValue }) => {
//     try {
//       const res = await httpinstance.post('/admin/auth/verify-otp', payload);

//       const { accessToken, refreshToken, permissions, role } = res.data.data;

//       // Decode token to get ID
//       const decoded = jwtDecode<TokenPayload>(accessToken);
//       const id = decoded.id;
//       const email = decoded.email;

//       const userData: User = {
//         data: {
//           ...res.data.data,
//           id,
//           role,
//           email,
//           permissions: permissions || [],
//         },
//       };

//       //  Save flat object instead of nested "data"
//       saveCookies("user", {
//         id,
//         email,
//         role,
//         permissions: permissions || []
//       });

//       return userData;




//     } catch (err: any) {
//       return rejectWithValue(err.response?.data?.message || 'OTP verification failed');
//     }
//   }
// );

export const verifyOtp = createAsyncThunk<
  User,
  { phone: string; enteredOtp: string },
  { rejectValue: string }
>(
  'auth/verifyOtp',
  async (payload, { rejectWithValue }) => {
    try {
      const res = await httpinstance.post('/admin/auth/verify-otp', payload);

      const { accessToken, permissions, refreshToken, role } = res.data.data;

      const decoded = jwtDecode<TokenPayload>(accessToken);
      const id = decoded.id;
      const email = decoded.email;

      const userData: User = {
        data: {
          ...res.data.data,
          id,
          role,
          email,
          permissions: permissions || [],
        },
      };

      // Clear previous session for this role
      if (role === 'staff') {
        removeTokenCookie('staff_user');
      } else if (role === 'admin') {
        removeTokenCookie('admin_user');
      }

      // Save only role-specific cookie
      saveCookies(role, {
        id,
        email,
        role,
        accessToken,  
        refreshToken,
        permissions: permissions || [],
      });

      return userData;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'OTP verification failed');
    }
  }
);



// --- Slice ---
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    resetAuth: (state) => {
      state.loading = false;
      state.error = null;
      state.otpSent = false;
      state.phone = null;
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // OTP Request
      .addCase(requestOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(requestOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.otpSent = true;
        state.phone = action.payload.phone;
      })
      .addCase(requestOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // OTP Verification
      .addCase(verifyOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })


      .addCase(verifyOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});


export default authSlice.reducer;
