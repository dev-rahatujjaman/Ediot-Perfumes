import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  order: null,
  orders: [],
  myOrders: [],
  loading: false,
  error: null,
  success: false,
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    orderCreateRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    orderCreateSuccess: (state, action) => {
      state.loading = false;
      state.success = true;
      state.order = action.payload?.data || action.payload;
    },
    orderCreateFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    orderCreateReset: (state) => {
      state.order = null;
      state.success = false;
    },
    orderDetailsRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    orderDetailsSuccess: (state, action) => {
      state.loading = false;
      state.order = action.payload?.data || action.payload;
    },
    orderDetailsFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    orderPayRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    orderPaySuccess: (state) => {
      state.loading = false;
      state.success = true;
    },
    orderPayFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    orderPayReset: (state) => {
      state.success = false;
    },
    myOrderListRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    myOrderListSuccess: (state, action) => {
      state.loading = false;
      const orders = action.payload?.data || action.payload;
      state.myOrders = Array.isArray(orders) ? orders : [];
    },
    myOrderListFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    orderListRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    orderListSuccess: (state, action) => {
      state.loading = false;
      const orders = action.payload?.data || action.payload;
      state.orders = Array.isArray(orders) ? orders : [];
    },
    orderListFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    orderDeliverRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    orderDeliverSuccess: (state) => {
      state.loading = false;
      state.success = true;
    },
    orderDeliverFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    orderDeliverReset: (state) => {
      state.success = false;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  orderCreateRequest,
  orderCreateSuccess,
  orderCreateFail,
  orderCreateReset,
  orderDetailsRequest,
  orderDetailsSuccess,
  orderDetailsFail,
  orderPayRequest,
  orderPaySuccess,
  orderPayFail,
  orderPayReset,
  myOrderListRequest,
  myOrderListSuccess,
  myOrderListFail,
  orderListRequest,
  orderListSuccess,
  orderListFail,
  orderDeliverRequest,
  orderDeliverSuccess,
  orderDeliverFail,
  orderDeliverReset,
  clearError,
} = orderSlice.actions;

export default orderSlice.reducer;
