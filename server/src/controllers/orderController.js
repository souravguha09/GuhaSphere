import Order from '../models/Order.js';
import Product from '../models/Product.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const createOrder = asyncHandler(async (req, res) => {
  const { items, shippingAddress, paymentMethod = 'COD', couponCode = '' } = req.body;
  if (!Array.isArray(items) || items.length === 0) return res.status(400).json({ message: 'Your bag is empty.' });
  const requiredAddress = ['name', 'phone', 'line1', 'city', 'state', 'postalCode'];
  if (!shippingAddress || requiredAddress.some((key) => !String(shippingAddress[key] || '').trim())) {
    return res.status(400).json({ message: 'Please complete all required delivery address fields.' });
  }
  const ids = items.map((item) => item.productId);
  const products = await Product.find({ _id: { $in: ids }, isActive: true });
  const productMap = new Map(products.map((product) => [String(product._id), product]));
  const normalizedItems = [];
  for (const item of items) {
    const product = productMap.get(String(item.productId));
    const qty = Math.max(1, Math.floor(Number(item.quantity) || 1));
    if (!product) return res.status(400).json({ message: 'One of the products is no longer available. Refresh your bag.' });
    if (product.stock < qty) return res.status(400).json({ message: `${product.name} has only ${product.stock} item(s) left.` });
    if (product.sizes.length && !product.sizes.includes(item.size)) return res.status(400).json({ message: `Choose a valid size for ${product.name}.` });
    normalizedItems.push({ product: product._id, name: product.name, image: product.images[0] || '', price: product.price, quantity: qty, size: item.size || '', color: item.color || '' });
  }
  const subtotal = normalizedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal >= 999 ? 0 : 79;
  const normalizedCoupon = String(couponCode).trim().toUpperCase();
  const discount = normalizedCoupon === 'SPHERE10' && subtotal >= 999 ? Math.round(subtotal * 0.10) : 0;
  if (normalizedCoupon && normalizedCoupon !== 'SPHERE10') return res.status(400).json({ message: 'That promo code is not valid.' });
  if (normalizedCoupon === 'SPHERE10' && subtotal < 999) return res.status(400).json({ message: 'SPHERE10 is available on orders of ₹999 or more.' });
  const order = await Order.create({ user: req.user._id, items: normalizedItems, shippingAddress, paymentMethod, paymentStatus: paymentMethod === 'DEMO' ? 'Paid' : 'Pending', subtotal, shipping, discount, total: subtotal + shipping - discount });
  await Promise.all(normalizedItems.map((item) => Product.updateOne({ _id: item.product }, { $inc: { stock: -item.quantity } })));
  res.status(201).json({ order });
});

export const myOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json({ orders });
});

export const allOrders = asyncHandler(async (_req, res) => {
  const orders = await Order.find().populate('user', 'name email').sort({ createdAt: -1 });
  res.json({ orders });
});

export const updateOrderStatus = asyncHandler(async (req, res) => {
  const allowed = ['Confirmed', 'Packed', 'Shipped', 'Delivered', 'Cancelled'];
  if (!allowed.includes(req.body.status)) return res.status(400).json({ message: 'Invalid order status.' });
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: 'Order not found.' });
  if (order.status === 'Cancelled' || order.status === 'Delivered') return res.status(400).json({ message: 'This order can no longer be updated.' });
  if (req.body.status === 'Cancelled' && order.status !== 'Cancelled') {
    await Promise.all(order.items.map((item) => Product.updateOne({ _id: item.product }, { $inc: { stock: item.quantity } })));
  }
  order.status = req.body.status;
  await order.save();
  res.json({ order });
});
