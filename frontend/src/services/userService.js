import api from './api';

export const userService = {
  // Admin APIs
  getUsers: async () => {
    const response = await api.get('/api/users');
    return response.data;
  },

  getUserById: async (id) => {
    const response = await api.get(`/api/users/${id}`);
    return response.data;
  },

  updateUser: async (user) => {
    const response = await api.put(`/api/users/${user._id}`, user);
    return response.data;
  },

  deleteUser: async (id) => {
    const response = await api.delete(`/api/users/${id}`);
    return response.data;
  },
};
