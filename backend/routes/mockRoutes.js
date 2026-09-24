const express = require('express');
const router = express.Router();

// Mock products data for testing without MongoDB
const mockProducts = [
  {
    _id: '1',
    name: 'Only For You - Signature Edition',
    image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&q=80',
    description: 'Inspired by moments that linger — warmth, closeness, confidence.',
    brand: 'Ediot Breeze',
    category: 'Fragrance',
    price: 120.00,
    countInStock: 25,
    rating: 4.9,
    numReviews: 128,
    reviews: [],
  },
  {
    _id: '2',
    name: 'Midnight Amber',
    image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&q=80',
    description: 'A deep, mysterious blend of rich amber and smoked cedarwood.',
    brand: 'Ediot Breeze',
    category: 'Fragrance',
    price: 135.00,
    countInStock: 15,
    rating: 4.8,
    numReviews: 94,
    reviews: [],
  },
  {
    _id: '3',
    name: 'Velvet Vanilla & Spice',
    image: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=800&q=80',
    description: 'Creamy Madagascar vanilla infused with subtle cardamom.',
    brand: 'Ediot Breeze',
    category: 'Fragrance',
    price: 110.00,
    countInStock: 30,
    rating: 4.7,
    numReviews: 76,
    reviews: [],
  },
  {
    _id: '4',
    name: 'Royal Oud & Leather',
    image: 'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=800&q=80',
    description: 'Majestic Agarwood paired with supple Italian leather.',
    brand: 'Ediot Breeze',
    category: 'Fragrance',
    price: 160.00,
    countInStock: 10,
    rating: 5.0,
    numReviews: 62,
    reviews: [],
  },
  {
    _id: '5',
    name: 'Citrus Solaire',
    image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=800&q=80',
    description: 'Sparkling Italian bergamot with clean white musk.',
    brand: 'Ediot Breeze',
    category: 'Fragrance',
    price: 95.00,
    countInStock: 20,
    rating: 4.6,
    numReviews: 45,
    reviews: [],
  },
  {
    _id: '6',
    name: 'Smoky Rose & Patchouli',
    image: 'https://images.unsplash.com/photo-1615397349754-cfa2066a298e?w=800&q=80',
    description: 'Damascus rose enveloped in dark patchouli and incense.',
    brand: 'Ediot Breeze',
    category: 'Fragrance',
    price: 125.00,
    countInStock: 18,
    rating: 4.9,
    numReviews: 83,
    reviews: [],
  },
];

// @route   GET /api/mock/products
// @desc    Get all mock products
// @access  Public
router.get('/products', (req, res) => {
  res.json(mockProducts);
});

// @route   GET /api/mock/products/:id
// @desc    Get single mock product
// @access  Public
router.get('/products/:id', (req, res) => {
  const product = mockProducts.find(p => p._id === req.params.id);
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
});

module.exports = router;
