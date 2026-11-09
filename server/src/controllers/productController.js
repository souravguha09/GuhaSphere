import Product from '../models/Product.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const listProducts = asyncHandler(async (req, res) => {
  const { q, category, gender, size, color, brand, rating, minPrice, maxPrice, sort = 'featured', page = 1, limit = 12, tag } = req.query;
  const filter = { isActive: true };
  if (category) filter.category = category;
  if (gender && gender !== 'All') filter.gender = { $in: [gender, 'Unisex'] };
  if (size) filter.sizes = size;
  if (color) filter.colors = color;
  if (brand) filter.brand = brand;
  if (rating) filter.rating = { $gte: Number(rating) };
  if (tag) filter.tags = tag;
  if (q?.trim()) filter.$text = { $search: q.trim() };
  if (minPrice || maxPrice) filter.price = { ...(minPrice ? { $gte: Number(minPrice) } : {}), ...(maxPrice ? { $lte: Number(maxPrice) } : {}) };
  const sortMap = {
    featured: { featured: -1, createdAt: -1 }, newest: { createdAt: -1 },
    price_low: { price: 1 }, price_high: { price: -1 },
    rating: { rating: -1 }, discount: { mrp: -1 }
  };
  const pageNum = Math.max(1, Number(page) || 1);
  const pageSize = Math.min(48, Math.max(1, Number(limit) || 12));
  const [products, total] = await Promise.all([
    Product.find(filter).sort(sortMap[sort] || sortMap.featured).skip((pageNum - 1) * pageSize).limit(pageSize),
    Product.countDocuments(filter)
  ]);
  res.json({ products, pagination: { page: pageNum, pages: Math.ceil(total / pageSize), total } });
});

export const getProduct = asyncHandler(async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug, isActive: true });
  if (!product) return res.status(404).json({ message: 'Product not found.' });
  const related = await Product.find({ _id: { $ne: product._id }, category: product.category, isActive: true }).limit(4);
  res.json({ product, related });
});

export const createProduct = asyncHandler(async (req, res) => {
  const product = await Product.create(req.body);
  res.status(201).json({ product });
});

export const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!product) return res.status(404).json({ message: 'Product not found.' });
  res.json({ product });
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
  if (!product) return res.status(404).json({ message: 'Product not found.' });
  res.json({ message: 'Product archived.' });
});
