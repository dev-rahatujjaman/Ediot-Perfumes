import { createSlice } from '@reduxjs/toolkit';

const getStoredUserInfo = () => {
  try {
    const item = localStorage.getItem('userInfo');
    if (!item) return null;
    const parsed = JSON.parse(item);
    return parsed?.data || parsed;
  } catch (e) {
    return null;
  }
};

const initialState = {
  userInfo: getStoredUserInfo(),
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      const userPayload = action.payload?.data || action.payload;
      state.userInfo = userPayload;
      localStorage.setItem('userInfo', JSON.stringify(userPayload));
    },
    loginFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.userInfo = null;
      localStorage.removeItem('userInfo');
      localStorage.removeItem('cartItems');
      localStorage.removeItem('shippingAddress');
      localStorage.removeItem('paymentMethod');
    },
    registerRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    registerSuccess: (state, action) => {
      state.loading = false;
      const userPayload = action.payload?.data || action.payload;
      state.userInfo = userPayload;
      localStorage.setItem('userInfo', JSON.stringify(userPayload));
    },
    registerFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    updateProfileRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    updateProfileSuccess: (state, action) => {
      state.loading = false;
      const userPayload = action.payload?.data || action.payload;
      state.userInfo = userPayload;
      localStorage.setItem('userInfo', JSON.stringify(userPayload));
    },
    updateProfileFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  loginRequest,
  loginSuccess,
  loginFail,
  logout,
  registerRequest,
  registerSuccess,
  registerFail,
  updateProfileRequest,
  updateProfileSuccess,
  updateProfileFail,
  clearError,
} = authSlice.actions;

export default authSlice.reducer;
