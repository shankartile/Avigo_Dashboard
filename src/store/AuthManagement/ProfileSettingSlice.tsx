import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { httpinstance } from '../../axios/api';

type OtpStatus = 'idle' | 'loading' | 'success' | 'error';

interface ProfileState {
  profilesetting: profilesetting[];
  loading: boolean;
  error: string | null;
  otpMessage?: string;
  successMessage?: string;
  passwordChangeStatus?: OtpStatus;
  requestEmailOtpStatus?: OtpStatus;
  verifyEmailOtpStatus?: OtpStatus;
  requestPasswordOtpStatus?: OtpStatus;
  verifyPasswordOtpStatus?: OtpStatus;
}

interface profilesetting {
  _id: string;
  name?: string;
  email: string;
  phone: string;
  createdAt: string;
  updatedAt: string;
  is_verified: boolean;
  is_profile_completed: boolean;
  isActive: boolean;
  isDelete: boolean;
}

const initialState: ProfileState = {
  profilesetting: [],
  loading: false,
  error: null,
  passwordChangeStatus: 'idle',
  requestEmailOtpStatus: 'idle',
  verifyEmailOtpStatus: 'idle',
  requestPasswordOtpStatus: 'idle',
  verifyPasswordOtpStatus: 'idle',
};


// // Request email change OTP
// export const requestEmailChangeOtp = createAsyncThunk(
//   'profile/requestEmailChangeOtp',
//   async ({ adminId, oldEmail, newEmail }: { adminId: string; oldEmail: string; newEmail: string }, { rejectWithValue }) => {
//     try {
//       const res = await httpinstance.post('admin/auth/request-email-change-otp', {
//         adminId, oldEmail, newEmail
//       });
//       return res.data;
//     } catch (err: any) {
//       return rejectWithValue(err.response?.data?.message || 'Failed to request email change OTP');
//     }
//   }
// );

// Request email change OTP
export const requestEmailChangeOtp = createAsyncThunk(
  'profile/requestEmailChangeOtp',
  async (
    { adminId, oldEmail, newEmail }: { adminId: string; oldEmail: string; newEmail: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await httpinstance.post('admin/auth/request-email-change-otp', {
        adminId,
        oldEmail,
        newEmail,
      });
      return res.data;
    } catch (err: any) {
      // pass full error payload instead of only message
      return rejectWithValue(
        err.response?.data || { message: 'Failed to request email change OTP' }
      );
    }
  }
);



// Verify email change OTP
export const verifyEmailChangeOtp = createAsyncThunk(
  'profile/verifyEmailChangeOtp',
  async ({ adminId, newEmail, enteredOtp }: { adminId: string; newEmail: string; enteredOtp: string }, { rejectWithValue }) => {
    try {
      const res = await httpinstance.post('admin/auth/verify-email-change-otp', {
        adminId, newEmail, enteredOtp
      });
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to verify email OTP');
    }
  }
);


// // Request password change OTP
// export const requestPasswordChangeOtp = createAsyncThunk(
//   'profile/requestPasswordChangeOtp',
//   async (
//     { adminId, newPassword, confirmNewPassword }: {
//       adminId: string,
//       newPassword: string,
//       confirmNewPassword: string
//     },
//     { rejectWithValue }
//   ) => {
//     try {
//       const res = await httpinstance.post('admin/auth/request-password-change-otp', {
//         adminId,
//         newPassword,
//         confirmNewPassword
//       });
//       return res.data;
//     } catch (err: any) {
//       return rejectWithValue(err.response?.data?.message || 'Failed to request password OTP');
//     }
//   }
// );

export const requestPasswordChangeOtp = createAsyncThunk(
  'profile/requestPasswordChangeOtp',
  async (
    { email, newPassword, confirmNewPassword }: {

      email: string,
      newPassword: string,
      confirmNewPassword: string
    },
    { rejectWithValue }
  ) => {
    try {
      const res = await httpinstance.post('admin/auth/request-password-change-otp', {

        email,
        newPassword,
        confirmNewPassword,
      });
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || {
        message: 'Failed to request password OTP',
      });
    }
  }
);




// Verify password change OTP
export const verifyPasswordChangeOtp = createAsyncThunk(
  'profile/verifyPasswordChangeOtp',
  async ({ email, enteredOtp, newPassword, confirmNewPassword }: { email: string, enteredOtp: string; newPassword: string; confirmNewPassword: string }, { rejectWithValue }) => {
    try {
      const res = await httpinstance.post('admin/auth/verify-password-change-otp', {
        email, enteredOtp, newPassword, confirmNewPassword
      });
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to verify password OTP');
    }
  }
);



// SLICE
const profilesettingslice = createSlice({
  name: 'profilesetting',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      // Email Change OTP
      .addCase(requestEmailChangeOtp.pending, (state) => {
        state.requestEmailOtpStatus = 'loading';
      })
      .addCase(requestEmailChangeOtp.fulfilled, (state) => {
        state.requestEmailOtpStatus = 'success';
      })
      .addCase(requestEmailChangeOtp.rejected, (state, action) => {
        state.requestEmailOtpStatus = 'error';
        state.error = action.payload as string;
      })

      .addCase(verifyEmailChangeOtp.pending, (state) => {
        state.verifyEmailOtpStatus = 'loading';
      })
      .addCase(verifyEmailChangeOtp.fulfilled, (state, action) => {
        state.verifyEmailOtpStatus = 'success';

        // Update email in profile
        if (state.profilesetting.length > 0) {
          state.profilesetting = state.profilesetting.map(profile =>
            profile._id === action.meta.arg.adminId
              ? { ...profile, email: action.meta.arg.newEmail }
              : profile
          );
        }

        // Optional success message
        state.successMessage = action.payload.data?.message || 'Email updated successfully';
      })

      .addCase(verifyEmailChangeOtp.rejected, (state, action) => {
        state.verifyEmailOtpStatus = 'error';
        state.error = action.payload as string;
      })

      // Password Change OTP
      .addCase(requestPasswordChangeOtp.pending, (state) => {
        state.requestPasswordOtpStatus = 'loading';
      })
      .addCase(requestPasswordChangeOtp.fulfilled, (state) => {
        state.requestPasswordOtpStatus = 'success';
      })
      .addCase(requestPasswordChangeOtp.rejected, (state, action) => {
        state.requestPasswordOtpStatus = 'error';
        state.error = action.payload as string;
      })

      .addCase(verifyPasswordChangeOtp.pending, (state) => {
        state.verifyPasswordOtpStatus = 'loading';
      })
      .addCase(verifyPasswordChangeOtp.fulfilled, (state) => {
        state.verifyPasswordOtpStatus = 'success';
      })
      .addCase(verifyPasswordChangeOtp.rejected, (state, action) => {
        state.verifyPasswordOtpStatus = 'error';
        state.error = action.payload as string;
      });
  }
});

export default profilesettingslice.reducer;
