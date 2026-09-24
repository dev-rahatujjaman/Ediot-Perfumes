import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { productService } from '../../services/productService';

// Async thunks
export const listProducts = createAsyncThunk(
  'product/listProducts',
  async ({ keyword = '', pageNumber = '' } = {}, { rejectWithValue }) => {
    try {
      const data = await productService.getProducts(keyword, pageNumber);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

export const getProductDetails = createAsyncThunk(
  'product/getProductDetails',
  async (id, { rejectWithValue }) => {
    try {
      const data = await productService.getProductById(id);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

export const createProductReview = createAsyncThunk(
  'product/createProductReview',
  async ({ productId, review }, { rejectWithValue }) => {
    try {
      const data = await productService.createProductReview(productId, review);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

export const deleteProduct = createAsyncThunk(
  'product/deleteProduct',
  async (id, { rejectWithValue }) => {
    try {
      await productService.deleteProduct(id);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

export const createProduct = createAsyncThunk(
  'product/createProduct',
  async (product, { rejectWithValue }) => {
    try {
      const data = await productService.createProduct(product);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

export const updateProduct = createAsyncThunk(
  'product/updateProduct',
  async ({ id, product }, { rejectWithValue }) => {
    try {
      const data = await productService.updateProduct(id, product);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

const initialState = {
  products: [],
  product: null,
  topProducts: [],
  loading: false,
  error: null,
  successReview: false,
  successDelete: false,
  successCreate: false,
  successUpdate: false,
  page: 1,
  pages: 1,
};

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetProductDetails: (state) => {
      state.product = null;
    },
    resetSuccess: (state) => {
      state.successReview = false;
      state.successDelete = false;
      state.successCreate = false;
      state.successUpdate = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // listProducts
      .addCase(listProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(listProducts.fulfilled, (state, action) => {
        state.loading = false;
        const p = action.payload?.products || action.payload?.data || action.payload;
        state.products = Array.isArray(p) ? p : [];
        state.page = action.payload?.page || 1;
        state.pages = action.payload?.pages || 1;
      })
      .addCase(listProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // getProductDetails
      .addCase(getProductDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProductDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.product = action.payload?.data || action.payload;
      })
      .addCase(getProductDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // createProductReview
      .addCase(createProductReview.pending, (state) => {
        state.loading = true;
        state.successReview = false;
      })
      .addCase(createProductReview.fulfilled, (state) => {
        state.loading = false;
        state.successReview = true;
      })
      .addCase(createProductReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.successReview = false;
      })
      // deleteProduct
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.successDelete = true;
        state.products = state.products.filter(p => p._id !== action.payload);
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // createProduct
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.successCreate = true;
        state.product = action.payload;
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // updateProduct
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.successUpdate = true;
        state.product = action.payload;
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, resetProductDetails, resetSuccess } = productSlice.actions;
export default productSlice.reducer;
