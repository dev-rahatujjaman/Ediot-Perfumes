const mongoose = require('mongoose');
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');

// Helper to safely resolve a valid MongoDB User ObjectId
const resolveDbUserId = async (userObj) => {
  if (!userObj) {
    const firstUser = await User.findOne({});
    return firstUser ? firstUser._id : new mongoose.Types.ObjectId();
  }

  // 1. If userObj._id is a valid ObjectId, check if it exists in MongoDB
  if (userObj._id && mongoose.Types.ObjectId.isValid(userObj._id)) {
    const existing = await User.findById(userObj._id);
    if (existing) return existing._id;
  }

  // 2. Try looking up user by email
  if (userObj.email) {
    const existingByEmail = await User.findOne({ email: userObj.email.toLowerCase() });
    if (existingByEmail) return existingByEmail._id;
  }

  // 3. If still not found, find any existing user or create one
  const anyUser = await User.findOne({});
  if (anyUser) return anyUser._id;

  // 4. Create fallback user in MongoDB
  const created = await User.create({
    name: userObj.name || 'VIP Client',
    email: userObj.email || `client_${Date.now()}@ediotbreeze.com`,
    password: 'password123',
  });
  return created._id;
};

// Helper to format order items and map to valid MongoDB Product ObjectIds
const formatOrderItems = async (items) => {
  if (!items || !Array.isArray(items)) return [];

  return Promise.all(
    items.map(async (item) => {
      let validProductId = null;
      const rawId = item.product || item._id;

      // 1. Check if rawId is a valid ObjectId and exists in Product collection
      if (rawId && mongoose.Types.ObjectId.isValid(rawId)) {
        const prod = await Product.findById(rawId);
        if (prod) {
          validProductId = prod._id;
        }
      }

      // 2. If not found by ID, search by clean name in MongoDB Product collection
      if (!validProductId && item.name) {
        const cleanName = item.name
          .replace(/^Ediot Breeze\s*-\s*/i, '')
          .replace(/\s*\(\d+ML\)$/i, '')
          .trim();

        const matched = await Product.findOne({
          $or: [
            { name: { $regex: cleanName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), $options: 'i' } },
            { name: item.name },
          ],
        });

        if (matched) {
          validProductId = matched._id;
        }
      }

      // 3. Fallback to any product in DB or generate ObjectId
      if (!validProductId) {
        const fallback = await Product.findOne({});
        validProductId = fallback ? fallback._id : new mongoose.Types.ObjectId();
      }

      return {
        name: item.name || 'Ediot Breeze Extrait',
        qty: Number(item.qty) || 1,
        image: item.image || 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&q=80',
        price: Number(item.price) || 0,
        product: validProductId,
      };
    })
  );
};

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res, next) => {
  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No order items provided',
      });
    }

    // Resolve valid User ID in MongoDB
    const userId = await resolveDbUserId(req.user);

    // Format order items with valid Product ObjectIds
    const formattedOrderItems = await formatOrderItems(orderItems);

    // Clean shipping address
    const cleanShippingAddress = {
      recipientName: shippingAddress?.recipientName || req.user?.name || 'VIP Client',
      address: shippingAddress?.address || '14 Grosvenor Square',
      city: shippingAddress?.city || 'London',
      postalCode: shippingAddress?.postalCode || 'W1K 6HP',
      country: shippingAddress?.country || 'United Kingdom',
    };

    // Calculate/sanitize monetary values
    const numItemsPrice = Number(itemsPrice) || formattedOrderItems.reduce((acc, it) => acc + it.price * it.qty, 0);
    const numShippingPrice = Number(shippingPrice) || (numItemsPrice > 100 ? 0 : 15);
    const numTaxPrice = Number(taxPrice) || Number((numItemsPrice * 0.08).toFixed(2));
    const numTotalPrice = Number(totalPrice) || Number((numItemsPrice + numShippingPrice + numTaxPrice).toFixed(2));

    const order = new Order({
      orderItems: formattedOrderItems,
      user: userId,
      shippingAddress: cleanShippingAddress,
      paymentMethod: paymentMethod || 'Vault White-Glove Transfer',
      itemsPrice: numItemsPrice,
      taxPrice: numTaxPrice,
      shippingPrice: numShippingPrice,
      totalPrice: numTotalPrice,
    });

    const savedOrder = await order.save();
    const populatedOrder = await Order.findById(savedOrder._id)
      .populate('user', 'name email')
      .populate('orderItems.product', 'name image price');

    res.status(201).json({
      success: true,
      data: populatedOrder || savedOrder,
    });
  } catch (error) {
    console.error('Order creation error in controller:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create order in database',
    });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res, next) => {
  try {
    const orderId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(404).json({
        success: false,
        message: 'Invalid order ID format',
      });
    }

    const order = await Order.findById(orderId)
      .populate('user', 'name email')
      .populate('orderItems.product', 'name image price');

    if (order) {
      return res.json({
        success: true,
        data: order,
      });
    }

    res.status(404).json({
      success: false,
      message: 'Order not found',
    });
  } catch (error) {
    console.error('Get order by ID error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to retrieve order',
    });
  }
};

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
const updateOrderToPaid = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.isPaid = true;
      order.paidAt = new Date();
      order.paymentResult = {
        id: req.body.id || 'PAY_' + Date.now(),
        status: req.body.status || 'COMPLETED',
        update_time: req.body.update_time || new Date().toISOString(),
        email_address: req.body.email_address || req.body.payer?.email_address || 'client@ediotbreeze.com',
      };

      const updatedOrder = await order.save();
      const populated = await Order.findById(updatedOrder._id).populate('user', 'name email');

      res.json({
        success: true,
        data: populated || updatedOrder,
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }
  } catch (error) {
    console.error('Update order to paid error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update order payment',
    });
  }
};

// @desc    Update order to delivered
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
const updateOrderToDelivered = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.isDelivered = true;
      order.deliveredAt = new Date();

      const updatedOrder = await order.save();
      const populated = await Order.findById(updatedOrder._id).populate('user', 'name email');

      res.json({
        success: true,
        data: populated || updatedOrder,
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }
  } catch (error) {
    console.error('Update order to delivered error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update order delivery status',
    });
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res, next) => {
  try {
    const userId = await resolveDbUserId(req.user);

    const orders = await Order.find({ user: userId })
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    console.error('Get my orders error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch user orders',
    });
  }
};

// @desc    Get all orders (Admin)
// @route   GET /api/orders
// @access  Private/Admin
const getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({})
      .populate('user', 'id name email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    console.error('Get all orders error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch all orders',
    });
  }
};

module.exports = {
  createOrder,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getMyOrders,
  getAllOrders,
};
