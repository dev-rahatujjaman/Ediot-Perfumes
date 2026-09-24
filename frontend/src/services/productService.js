import api from './api';

export const productService = {
  getProducts: async (keyword = '', pageNumber = '') => {
    try {
      const response = await api.get(`/api/products?keyword=${keyword}&pageNumber=${pageNumber}`);
      return response.data;
    } catch (error) {
      // Fallback to mock data if MongoDB is not connected
      console.warn('API error, falling back to mock products data');
      const response = await api.get('/api/mock/products');
      return { products: response.data, page: 1, pages: 1 };
    }
  },

  getProductById: async (id) => {
    try {
      const response = await api.get(`/api/products/${id}`);
      return response.data;
    } catch (error) {
      // Fallback to mock data
      const response = await api.get(`/api/mock/products/${id}`);
      return response.data;
    }
  },

  getTopProducts: async () => {
    try {
      const response = await api.get('/api/products/top');
      return response.data;
    } catch (error) {
      const response = await api.get('/api/mock/products');
      return response.data;
    }
  },

  createProductReview: async (productId, review) => {
    const response = await api.post(`/api/products/${productId}/reviews`, review);
    return response.data;
  },

  // Admin APIs
  createProduct: async (productData = {}) => {
    const response = await api.post('/api/products', productData);
    return response.data;
  },

  updateProduct: async (idOrProduct, maybeProduct) => {
    const id = typeof idOrProduct === 'object' ? idOrProduct._id : idOrProduct;
    const data = typeof idOrProduct === 'object' ? idOrProduct : maybeProduct;
    const response = await api.put(`/api/products/${id}`, data);
    return response.data;
  },

  deleteProduct: async (id) => {
    const response = await api.delete(`/api/products/${id}`);
    return response.data;
  },

  uploadProductImage: async (formData) => {
    const response = await api.post('/api/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};
