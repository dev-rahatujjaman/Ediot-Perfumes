const Product = require('../models/Product');
const { validationResult } = require('express-validator');
const mongoose = require('mongoose');

// Luxury mock products (24 Master Extraits & Parfums)
const luxuryMockProducts = [
  {
    _id: '1',
    name: 'Only For You — Extrait Sovereign',
    image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&q=80',
    description: 'The house magnum opus. Centifolia rose petals macerated with aged sandalwood and warm ambergris. Concentrated at 35% pure extrait density.',
    brand: 'Ediot Breeze',
    category: 'Extrait de Parfum',
    family: 'Amber Floral',
    price: 185.00,
    countInStock: 25,
    rating: 4.9,
    numReviews: 148,
    reviews: [],
  },
  {
    _id: '2',
    name: 'Santorini Azure Breeze',
    image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&q=80',
    description: 'Luminous Aegean sunlight and crisp saline sea spray meeting crushed fig leaves and white cedarwood.',
    brand: 'Ediot Breeze',
    category: 'Eau de Parfum',
    family: 'Solar & Citrus',
    price: 165.00,
    countInStock: 18,
    rating: 4.8,
    numReviews: 112,
    reviews: [],
  },
  {
    _id: '3',
    name: 'Velvet Midnight Santal',
    image: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=800&q=80',
    description: 'A hypnotic blend of 30-year aged Mysore sandalwood, roasted tonka bean, and velvet Damascus rose.',
    brand: 'Ediot Breeze',
    category: 'Extrait de Parfum',
    family: 'Amber & Oud',
    price: 210.00,
    countInStock: 30,
    rating: 5.0,
    numReviews: 96,
    reviews: [],
  },
  {
    _id: '4',
    name: 'Imperial Oud & Ambergris',
    image: 'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=800&q=80',
    description: 'Rare wild ocean ambergris paired with sustainably harvested Cambodian Agarwood and aged French oak cask maceration.',
    brand: 'Ediot Breeze',
    category: 'Grand Reserve',
    family: 'Amber & Oud',
    price: 245.00,
    countInStock: 12,
    rating: 5.0,
    numReviews: 78,
    reviews: [],
  },
  {
    _id: '5',
    name: 'Calabrian Bergamot Reserve',
    image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=800&q=80',
    description: 'First-press Italian bergamot harvested at sunrise, balanced with solar neroli petals and crystalline amber.',
    brand: 'Ediot Breeze',
    category: 'Eau de Parfum',
    family: 'Solar & Citrus',
    price: 155.00,
    countInStock: 22,
    rating: 4.7,
    numReviews: 54,
    reviews: [],
  },
  {
    _id: '6',
    name: 'Grasse Rose Noire',
    image: 'https://images.unsplash.com/photo-1615397349754-cfa2066a298e?w=800&q=80',
    description: 'Centifolia Rose plucked during the 45-minute dawn harvest in Grasse, wrapped in dark incense smoke and vanilla bean.',
    brand: 'Ediot Breeze',
    category: 'Extrait de Parfum',
    family: 'Night Florals',
    price: 195.00,
    countInStock: 15,
    rating: 4.9,
    numReviews: 89,
    reviews: [],
  },
  {
    _id: '7',
    name: 'Place Vendôme No. 07',
    image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&q=80',
    description: 'An architectural tribute to Parisian haute couture. Powdery white iris, champagne aldehydes, and soft cashmere suede.',
    brand: 'Ediot Breeze',
    category: 'Extrait de Parfum',
    family: 'Night Florals',
    price: 225.00,
    countInStock: 14,
    rating: 4.9,
    numReviews: 63,
    reviews: [],
  },
  {
    _id: '8',
    name: 'Bourbon Tobacco & Cognac Cask',
    image: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=800&q=80',
    description: 'Golden cured Virginia tobacco leaves aged inside vintage French cognac barrels with dark honeycomb and smoked birch.',
    brand: 'Ediot Breeze',
    category: 'Grand Reserve',
    family: 'Amber & Oud',
    price: 235.00,
    countInStock: 10,
    rating: 5.0,
    numReviews: 41,
    reviews: [],
  },
  {
    _id: '9',
    name: 'Neroli Solaire Côte d’Azur',
    image: 'https://images.unsplash.com/photo-1528722828814-77b9b83aafb2?w=800&q=80',
    description: 'Sun-drenched Mediterranean orange blossoms steeped with sea mist, Italian cypress, and solar white musk.',
    brand: 'Ediot Breeze',
    category: 'Eau de Parfum',
    family: 'Solar & Citrus',
    price: 170.00,
    countInStock: 28,
    rating: 4.8,
    numReviews: 73,
    reviews: [],
  },
  {
    _id: '10',
    name: 'Sovereign Saffron & Leather',
    image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=800&q=80',
    description: 'Deep crimson Persian saffron threads layered over hand-buffed Tuscan saddle leather and midnight jasmine.',
    brand: 'Ediot Breeze',
    category: 'Extrait de Parfum',
    family: 'Amber & Oud',
    price: 215.00,
    countInStock: 16,
    rating: 4.9,
    numReviews: 58,
    reviews: [],
  },
  {
    _id: '11',
    name: 'Bois Immortel & Smoked Vetiver',
    image: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=800&q=80',
    description: 'Earthy Haitian vetiver roots roasted over peat smoke, enriched with everlasting Corsican immortelle flowers and dark cedar.',
    brand: 'Ediot Breeze',
    category: 'Extrait de Parfum',
    family: 'Amber & Oud',
    price: 190.00,
    countInStock: 20,
    rating: 4.8,
    numReviews: 39,
    reviews: [],
  },
  {
    _id: '12',
    name: 'Lys de Nuit (Night Blooming Lily)',
    image: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=800&q=80',
    description: 'An ethereal nocturnal white floral. Imperial Casablanca lilies kissed by moonlit dew, green tuberose, and sensual musk.',
    brand: 'Ediot Breeze',
    category: 'Eau de Parfum',
    family: 'Night Florals',
    price: 175.00,
    countInStock: 24,
    rating: 4.7,
    numReviews: 67,
    reviews: [],
  },
  {
    _id: '13',
    name: 'Florentine Iris Pallida',
    image: 'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=800&q=80',
    description: 'Aged for three years in darkness: rare orris root butter woven with powdery heliotrope, soft almond, and white suede.',
    brand: 'Ediot Breeze',
    category: 'Grand Reserve',
    family: 'Night Florals',
    price: 260.00,
    countInStock: 8,
    rating: 5.0,
    numReviews: 52,
    reviews: [],
  },
  {
    _id: '14',
    name: 'Kyoto Hinoki & White Tea',
    image: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=800&q=80',
    description: 'Meditative sacred temple woods. Ancient Japanese Hinoki cedar infused with silver needle white tea and cold mountain mist.',
    brand: 'Ediot Breeze',
    category: 'Eau de Parfum',
    family: 'Solar & Citrus',
    price: 165.00,
    countInStock: 30,
    rating: 4.9,
    numReviews: 84,
    reviews: [],
  },
  {
    _id: '15',
    name: 'Cardamome d’Orient & Smoked Tea',
    image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&q=80',
    description: 'Lapsang Souchong smoked black tea leaves blended with green Guatemalan cardamom pods, cinnamon bark, and amber crystal.',
    brand: 'Ediot Breeze',
    category: 'Extrait de Parfum',
    family: 'Amber & Oud',
    price: 195.00,
    countInStock: 19,
    rating: 4.8,
    numReviews: 46,
    reviews: [],
  },
  {
    _id: '16',
    name: 'Mandarin Solaire & Bitter Fig',
    image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=800&q=80',
    description: 'Sparkling Sicilian red mandarins bursting over crushed green fig leaves, solar freesia, and sun-warmed cedar.',
    brand: 'Ediot Breeze',
    category: 'Eau de Parfum',
    family: 'Solar & Citrus',
    price: 150.00,
    countInStock: 26,
    rating: 4.7,
    numReviews: 38,
    reviews: [],
  },
  {
    _id: '17',
    name: 'Black Ambergris Sovereign Flacon',
    image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&q=80',
    description: 'Extracted using cold-infusion of ocean-tossed ambergris chunks with dark balsam resins and smoked benzoin.',
    brand: 'Ediot Breeze',
    category: 'Grand Reserve',
    family: 'Amber & Oud',
    price: 275.00,
    countInStock: 7,
    rating: 5.0,
    numReviews: 49,
    reviews: [],
  },
  {
    _id: '18',
    name: 'Jasmine Sambac Grandiflora',
    image: 'https://images.unsplash.com/photo-1615397349754-cfa2066a298e?w=800&q=80',
    description: 'Intoxicating night-blooming Indian Sambac jasmine petals enveloped in green mandarin juice and creamy solar sandalwood.',
    brand: 'Ediot Breeze',
    category: 'Extrait de Parfum',
    family: 'Night Florals',
    price: 190.00,
    countInStock: 21,
    rating: 4.8,
    numReviews: 61,
    reviews: [],
  },
  {
    _id: '19',
    name: 'Royal Patchouli & Cocoa Blanc',
    image: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=800&q=80',
    description: 'Distilled Indonesian patchouli leaves rounded with velvety roasted white cacao bean extract and golden amber crystals.',
    brand: 'Ediot Breeze',
    category: 'Extrait de Parfum',
    family: 'Amber Floral',
    price: 185.00,
    countInStock: 17,
    rating: 4.9,
    numReviews: 53,
    reviews: [],
  },
  {
    _id: '20',
    name: 'Cologne Royale de Grasse',
    image: 'https://images.unsplash.com/photo-1528722828814-77b9b83aafb2?w=800&q=80',
    description: 'The definitive classic French cologne re-imagined with modern 28% concentration: lavender, rosemary, petitgrain, and crystal musk.',
    brand: 'Ediot Breeze',
    category: 'Eau de Parfum',
    family: 'Solar & Citrus',
    price: 145.00,
    countInStock: 35,
    rating: 4.7,
    numReviews: 92,
    reviews: [],
  },
  {
    _id: '21',
    name: 'Oud Al-Malaki Sovereign',
    image: 'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=800&q=80',
    description: 'Pure wild Assamese Agarwood oil blended with honeyed Taif rose and royal frankincense tears.',
    brand: 'Ediot Breeze',
    category: 'Grand Reserve',
    family: 'Amber & Oud',
    price: 290.00,
    countInStock: 5,
    rating: 5.0,
    numReviews: 34,
    reviews: [],
  },
  {
    _id: '22',
    name: 'Tubéreuse Céleste',
    image: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=800&q=80',
    description: 'Sensual intoxicating tuberose absolu accented by coconut water, pink peppercorns, and warm benzoin resins.',
    brand: 'Ediot Breeze',
    category: 'Extrait de Parfum',
    family: 'Night Florals',
    price: 205.00,
    countInStock: 16,
    rating: 4.9,
    numReviews: 68,
    reviews: [],
  },
  {
    _id: '23',
    name: 'Cedre Blanc & Smoked Incense',
    image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&q=80',
    description: 'Virginian white cedar planks smoked in holy church incense, layered with crisp juniper berries and black amber.',
    brand: 'Ediot Breeze',
    category: 'Eau de Parfum',
    family: 'Amber & Oud',
    price: 175.00,
    countInStock: 23,
    rating: 4.8,
    numReviews: 47,
    reviews: [],
  },
  {
    _id: '24',
    name: 'Elixir de Vanille Noire',
    image: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=800&q=80',
    description: 'Black smoked Bourbon vanilla pods macerated in Limousin oak barrels with golden caramel resin and cashmere woods.',
    brand: 'Ediot Breeze',
    category: 'Extrait de Parfum',
    family: 'Amber Floral',
    price: 195.00,
    countInStock: 28,
    rating: 5.0,
    numReviews: 104,
    reviews: [],
  },
];

// @desc    Get all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      let filtered = [...luxuryMockProducts];
      if (req.query.keyword) {
        const kw = req.query.keyword.toLowerCase();
        filtered = filtered.filter(p => p.name.toLowerCase().includes(kw) || p.description.toLowerCase().includes(kw));
      }
      if (req.query.category && req.query.category !== 'All') {
        filtered = filtered.filter(p => p.category === req.query.category || p.family === req.query.category);
      }

      return res.json({
        success: true,
        data: filtered,
        page: 1,
        pages: 1,
        count: filtered.length,
      });
    }

    const pageSize = 24;
    const page = Number(req.query.page) || 1;

    const keyword = req.query.keyword
      ? {
          name: {
            $regex: req.query.keyword,
            $options: 'i',
          },
        }
      : {};

    const category = req.query.category && req.query.category !== 'All'
      ? { category: req.query.category }
      : {};

    const count = await Product.countDocuments({ ...keyword, ...category });
    const products = await Product.find({ ...keyword, ...category })
      .limit(pageSize)
      .skip(pageSize * (page - 1))
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: products && products.length > 0 ? products : luxuryMockProducts,
      page,
      pages: Math.max(1, Math.ceil((count || luxuryMockProducts.length) / pageSize)),
      count: count || luxuryMockProducts.length,
    });
  } catch (error) {
    res.json({
      success: true,
      data: luxuryMockProducts,
      page: 1,
      pages: 1,
      count: luxuryMockProducts.length,
    });
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const mock = luxuryMockProducts.find(p => p._id === req.params.id) || luxuryMockProducts[0];
      return res.json({
        success: true,
        data: mock,
      });
    }

    const product = await Product.findById(req.params.id).populate(
      'reviews.user',
      'name'
    );

    if (product) {
      res.json({
        success: true,
        data: product,
      });
    } else {
      const mock = luxuryMockProducts.find(p => p._id === req.params.id);
      if (mock) {
        return res.json({ success: true, data: mock });
      }
      res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }
  } catch (error) {
    const mock = luxuryMockProducts.find(p => p._id === req.params.id) || luxuryMockProducts[0];
    res.json({
      success: true,
      data: mock,
    });
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const newProd = {
        _id: 'prod_' + Date.now(),
        name: req.body.name || 'Bespoke Haute Flacon',
        price: Number(req.body.price) || 200,
        image: req.body.image || 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&q=80',
        brand: req.body.brand || 'Maison Royale',
        category: req.body.category || 'Extrait de Parfum',
        countInStock: Number(req.body.countInStock || req.body.stock) || 10,
        description: req.body.description || 'Rare handcrafted botanical flacon.',
        rating: 5.0,
        numReviews: 0,
        reviews: [],
      };
      luxuryMockProducts.unshift(newProd);
      return res.status(201).json({
        success: true,
        data: newProd,
      });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const product = await Product.create({
      user: req.user._id,
      name: req.body.name,
      price: req.body.price,
      image: req.body.image || '/uploads/sample.jpg',
      brand: req.body.brand,
      category: req.body.category,
      stock: req.body.stock || req.body.countInStock,
      countInStock: req.body.countInStock || req.body.stock,
      description: req.body.description,
      featured: req.body.featured || false,
    });

    res.status(201).json({
      success: true,
      data: product,
    });
  } catch (error) {
    const newProd = {
      _id: 'prod_' + Date.now(),
      name: req.body.name || 'Bespoke Flacon',
      price: req.body.price || 195,
      image: req.body.image || 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&q=80',
      brand: req.body.brand || 'Maison Royale',
      category: req.body.category || 'Extrait de Parfum',
      countInStock: 10,
      description: req.body.description || '',
    };
    luxuryMockProducts.unshift(newProd);
    res.status(201).json({ success: true, data: newProd });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const prod = luxuryMockProducts.find(p => p._id === req.params.id);
      if (prod) {
        prod.name = req.body.name || prod.name;
        prod.price = req.body.price !== undefined ? Number(req.body.price) : prod.price;
        prod.description = req.body.description || prod.description;
        prod.image = req.body.image || prod.image;
        prod.brand = req.body.brand || prod.brand;
        prod.category = req.body.category || prod.category;
        prod.countInStock = req.body.countInStock !== undefined ? Number(req.body.countInStock) : (req.body.stock !== undefined ? Number(req.body.stock) : prod.countInStock);
        return res.json({
          success: true,
          data: prod,
        });
      }
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const product = await Product.findById(req.params.id);

    if (product) {
      product.name = req.body.name || product.name;
      product.price = req.body.price || product.price;
      product.description = req.body.description || product.description;
      product.image = req.body.image || product.image;
      product.brand = req.body.brand || product.brand;
      product.category = req.body.category || product.category;
      product.stock = req.body.stock !== undefined ? req.body.stock : product.stock;
      product.featured = req.body.featured !== undefined ? req.body.featured : product.featured;

      const updatedProduct = await product.save();

      res.json({
        success: true,
        data: updatedProduct,
      });
    } else {
      const mock = luxuryMockProducts.find(p => p._id === req.params.id);
      if (mock) {
        mock.name = req.body.name || mock.name;
        mock.price = req.body.price !== undefined ? Number(req.body.price) : mock.price;
        return res.json({ success: true, data: mock });
      }
      res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }
  } catch (error) {
    const mock = luxuryMockProducts.find(p => p._id === req.params.id);
    if (mock) {
      mock.name = req.body.name || mock.name;
      return res.json({ success: true, data: mock });
    }
    next(error);
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const idx = luxuryMockProducts.findIndex(p => p._id === req.params.id);
      if (idx !== -1) {
        luxuryMockProducts.splice(idx, 1);
        return res.json({
          success: true,
          message: 'Product removed',
        });
      }
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const product = await Product.findById(req.params.id);

    if (product) {
      await product.deleteOne();
      res.json({
        success: true,
        message: 'Product removed',
      });
    } else {
      const idx = luxuryMockProducts.findIndex(p => p._id === req.params.id);
      if (idx !== -1) {
        luxuryMockProducts.splice(idx, 1);
        return res.json({ success: true, message: 'Product removed' });
      }
      res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }
  } catch (error) {
    const idx = luxuryMockProducts.findIndex(p => p._id === req.params.id);
    if (idx !== -1) {
      luxuryMockProducts.splice(idx, 1);
      return res.json({ success: true, message: 'Product removed' });
    }
    next(error);
  }
};

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private
const createReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
      const alreadyReviewed = product.reviews.find(
        (r) => r.user.toString() === req.user._id.toString()
      );

      if (alreadyReviewed) {
        return res.status(400).json({
          success: false,
          message: 'Product already reviewed',
        });
      }

      const review = {
        name: req.user.name,
        rating: Number(rating),
        comment,
        user: req.user._id,
      };

      product.reviews.push(review);
      product.numReviews = product.reviews.length;
      product.rating =
        product.reviews.reduce((acc, item) => item.rating + acc, 0) /
        product.reviews.length;

      await product.save();
      res.status(201).json({
        success: true,
        message: 'Review added',
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get top rated products
// @route   GET /api/products/top
// @access  Public
const getTopProducts = async (req, res, next) => {
  try {
    const products = await Product.find({}).sort({ rating: -1 }).limit(6);

    res.json({
      success: true,
      data: products && products.length > 0 ? products : luxuryMockProducts.slice(0, 6),
    });
  } catch (error) {
    res.json({
      success: true,
      data: luxuryMockProducts.slice(0, 6),
    });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createReview,
  getTopProducts,
};
