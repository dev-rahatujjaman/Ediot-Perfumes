import api from './api';

export const orderService = {
  createOrder: async (order) => {
    const response = await api.post('/api/orders', order);
    return response.data;
  },

  getOrderById: async (id) => {
    const response = await api.get(`/api/orders/${id}`);
    return response.data;
  },

  payOrder: async (orderId, paymentResult) => {
    const response = await api.put(`/api/orders/${orderId}/pay`, paymentResult);
    return response.data;
  },

  getMyOrders: async () => {
    const response = await api.get('/api/orders/myorders');
    return response.data;
  },

  // Admin APIs
  getAllOrders: async () => {
    const response = await api.get('/api/orders');
    return response.data;
  },

  deliverOrder: async (orderId) => {
    const response = await api.put(`/api/orders/${orderId}/deliver`);
    return response.data;
  },
};
