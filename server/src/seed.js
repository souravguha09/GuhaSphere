import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDB } from './config/db.js';
import Product from './models/Product.js';
import User from './models/User.js';

const photo = (id, w = 900) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=85`;
const products = [
  { name: 'The Everyday Heavyweight Tee', slug: 'everyday-heavyweight-tee', brand: 'Guhasphere Studio', category: 'Clothing', subcategory: 'T-shirts', gender: 'Men', price: 799, mrp: 1299, images: [photo('photo-1521572163474-6864f9cf17ab'), photo('photo-1503342217505-b0a15ec3261c')], colors: ['Ivory', 'Black', 'Olive'], sizes: ['S', 'M', 'L', 'XL', 'XXL'], tags: ['essentials', 'bestseller', 'everyday'], stock: 42, rating: 4.7, numReviews: 128, featured: true },
  { name: 'City Muse Oversized Shirt', slug: 'city-muse-oversized-shirt', brand: 'North Edit', category: 'Clothing', subcategory: 'Shirts', gender: 'Women', price: 1499, mrp: 2499, images: [photo('photo-1598554747436-c9293d6a588f'), photo('photo-1551232864-3f0890e580d9')], colors: ['Sky Blue', 'White'], sizes: ['XS', 'S', 'M', 'L', 'XL'], tags: ['new-season', 'workwear'], stock: 24, rating: 4.5, numReviews: 64, featured: true, isNew: true },
  { name: 'Retro Court Sneakers', slug: 'retro-court-sneakers', brand: 'Offbeat', category: 'Footwear', subcategory: 'Sneakers', gender: 'Unisex', price: 2299, mrp: 3499, images: [photo('photo-1542291026-7eec264c27ff'), photo('photo-1495555961986-6d4c1ecb7be3')], colors: ['Chalk White', 'Red'], sizes: ['6', '7', '8', '9', '10', '11'], tags: ['sneakers', 'streetwear', 'bestseller'], stock: 18, rating: 4.6, numReviews: 89, featured: true },
  { name: 'Soft Form Knit Co-ord', slug: 'soft-form-knit-coord', brand: 'Morrow', category: 'Clothing', subcategory: 'Co-ord Sets', gender: 'Women', price: 2199, mrp: 3299, images: [photo('photo-1515886657613-9f3515b0c78f'), photo('photo-1529139574466-a303027c1d8b')], colors: ['Sand', 'Charcoal'], sizes: ['XS', 'S', 'M', 'L'], tags: ['new-season', 'lounge'], stock: 13, rating: 4.8, numReviews: 37, featured: true, isNew: true },
  { name: 'Utility Canvas Crossbody', slug: 'utility-canvas-crossbody', brand: 'Guhasphere Objects', category: 'Accessories', subcategory: 'Bags', gender: 'Unisex', price: 1199, mrp: 1799, images: [photo('photo-1548036328-c9fa89d128fa'), photo('photo-1584917865442-de89df76afd3')], colors: ['Stone', 'Black'], sizes: ['One Size'], tags: ['bags', 'everyday'], stock: 31, rating: 4.4, numReviews: 51, featured: false },
  { name: 'Weekend Denim Jacket', slug: 'weekend-denim-jacket', brand: 'North Edit', category: 'Clothing', subcategory: 'Jackets', gender: 'Men', price: 2599, mrp: 3999, images: [photo('photo-1591047139829-d91aecb6caea'), photo('photo-1523398002811-999ca8dec234')], colors: ['Washed Blue', 'Black'], sizes: ['S', 'M', 'L', 'XL'], tags: ['denim', 'layering'], stock: 17, rating: 4.5, numReviews: 43, featured: true },
  { name: 'Sculpt Minimal Watch', slug: 'sculpt-minimal-watch', brand: 'Second Hand', category: 'Accessories', subcategory: 'Watches', gender: 'Unisex', price: 1899, mrp: 2999, images: [photo('photo-1523275335684-37898b6baf30'), photo('photo-1524805444758-089113d48a6d')], colors: ['Silver', 'Gold'], sizes: ['One Size'], tags: ['watches', 'minimal'], stock: 9, rating: 4.3, numReviews: 29, featured: false, isNew: true },
  { name: 'Cloud Nine Running Shoes', slug: 'cloud-nine-running-shoes', brand: 'Offbeat', category: 'Footwear', subcategory: 'Running', gender: 'Unisex', price: 2799, mrp: 4299, images: [photo('photo-1542291026-7eec264c27ff'), photo('photo-1495555961986-6d4c1ecb7be3')], colors: ['Coral', 'White'], sizes: ['6', '7', '8', '9', '10', '11'], tags: ['running', 'activewear'], stock: 15, rating: 4.6, numReviews: 74, featured: true },
  { name: 'Sunday Linen Trousers', slug: 'sunday-linen-trousers', brand: 'Morrow', category: 'Clothing', subcategory: 'Trousers', gender: 'Women', price: 1699, mrp: 2499, images: [photo('photo-1490481651871-ab68de25d43d'), photo('photo-1503342217505-b0a15ec3261c')], colors: ['Oat', 'Black'], sizes: ['XS', 'S', 'M', 'L', 'XL'], tags: ['linen', 'summer'], stock: 32, rating: 4.5, numReviews: 46, featured: false },
  { name: 'Archive Graphic Sweatshirt', slug: 'archive-graphic-sweatshirt', brand: 'Guhasphere Studio', category: 'Clothing', subcategory: 'Sweatshirts', gender: 'Unisex', price: 1399, mrp: 2199, images: [photo('photo-1556821840-3a63f95609a7'), photo('photo-1551028719-00167b16eac5')], colors: ['Heather Grey', 'Forest'], sizes: ['S', 'M', 'L', 'XL', 'XXL'], tags: ['graphic', 'streetwear'], stock: 29, rating: 4.7, numReviews: 92, featured: true },
  { name: 'Everyday Ribbed Tank', slug: 'everyday-ribbed-tank', brand: 'Morrow', category: 'Clothing', subcategory: 'Tops', gender: 'Women', price: 599, mrp: 999, images: [photo('photo-1503342217505-b0a15ec3261c'), photo('photo-1515886657613-9f3515b0c78f')], colors: ['White', 'Black', 'Mocha'], sizes: ['XS', 'S', 'M', 'L'], tags: ['basics', 'essentials'], stock: 45, rating: 4.4, numReviews: 62, featured: false },
  { name: 'Everywhere Leather Belt', slug: 'everywhere-leather-belt', brand: 'Guhasphere Objects', category: 'Accessories', subcategory: 'Belts', gender: 'Unisex', price: 899, mrp: 1399, images: [photo('photo-1624222247344-550fb8f5b6a0'), photo('photo-1553062407-98eeb64c6a62')], colors: ['Tan', 'Black'], sizes: ['S', 'M', 'L'], tags: ['accessories', 'essentials'], stock: 26, rating: 4.2, numReviews: 19, featured: false },
  { name: 'Daybreak Floral Midi Dress', slug: 'daybreak-floral-midi-dress', brand: 'North Edit', category: 'Clothing', subcategory: 'Dresses', gender: 'Women', price: 1899, mrp: 2899, images: [photo('photo-1539109136881-3be0616acf4b'), photo('photo-1483985988355-763728e1935b')], colors: ['Floral Mix', 'Blue'], sizes: ['XS', 'S', 'M', 'L'], tags: ['dresses', 'occasion'], stock: 21, rating: 4.8, numReviews: 58, featured: true, isNew: true },
  { name: 'Everyday Low-Top Canvas', slug: 'everyday-low-top-canvas', brand: 'Offbeat', category: 'Footwear', subcategory: 'Casual Shoes', gender: 'Unisex', price: 1299, mrp: 1999, images: [photo('photo-1525966222134-fcfa99b8ae77'), photo('photo-1495555961986-6d4c1ecb7be3')], colors: ['Natural', 'Black'], sizes: ['6', '7', '8', '9', '10'], tags: ['canvas', 'everyday'], stock: 35, rating: 4.3, numReviews: 41, featured: false },
  { name: 'Satin Finish Lip Tint', slug: 'satin-finish-lip-tint', brand: 'Bare Theory', category: 'Beauty', subcategory: 'Lips', gender: 'Women', price: 499, mrp: 699, images: [photo('photo-1586495777744-4413f21062fa')], colors: ['Rose', 'Berry'], sizes: ['One Size'], tags: ['beauty', 'makeup'], stock: 50, rating: 4.1, numReviews: 33, featured: false },
  { name: 'Ridge Ceramic Coffee Set', slug: 'ridge-ceramic-coffee-set', brand: 'Guhasphere Home', category: 'Home', subcategory: 'Tableware', gender: 'Unisex', price: 1499, mrp: 2199, images: [photo('photo-1514228742587-6b1558fcca3d'), photo('photo-1495474472287-4d71bcdd2085')], colors: ['Cream', 'Terracotta'], sizes: ['Set of 2'], tags: ['home', 'living'], stock: 14, rating: 4.6, numReviews: 22, featured: false },
  { name: 'Classic Straight Fit Jeans', slug: 'classic-straight-fit-jeans', brand: 'North Edit', category: 'Clothing', subcategory: 'Jeans', gender: 'Men', price: 1799, mrp: 2799, images: [photo('photo-1542272604-787c3835535d'), photo('photo-1512436991641-6745cdb1723f')], colors: ['Mid Blue', 'Black'], sizes: ['28', '30', '32', '34', '36'], tags: ['denim', 'bestseller'], stock: 38, rating: 4.5, numReviews: 87, featured: true },
  { name: 'Sculpted Daily Tote', slug: 'sculpted-daily-tote', brand: 'Morrow', category: 'Accessories', subcategory: 'Bags', gender: 'Women', price: 1599, mrp: 2399, images: [photo('photo-1584917865442-de89df76afd3'), photo('photo-1548036328-c9fa89d128fa')], colors: ['Cognac', 'Black'], sizes: ['One Size'], tags: ['bags', 'workwear'], stock: 19, rating: 4.7, numReviews: 53, featured: true },
  { name: 'Motion Studio Track Pants', slug: 'motion-studio-track-pants', brand: 'Guhasphere Studio', category: 'Clothing', subcategory: 'Activewear', gender: 'Unisex', price: 1199, mrp: 1899, images: [photo('photo-1552902865-b72c031ac5ea'), photo('photo-1551488831-00ddcb6c6bd3')], colors: ['Graphite', 'Black'], sizes: ['S', 'M', 'L', 'XL'], tags: ['activewear', 'comfort'], stock: 27, rating: 4.4, numReviews: 31, featured: false },
  { name: 'Soft Touch Hand Cream Duo', slug: 'soft-touch-hand-cream-duo', brand: 'Bare Theory', category: 'Beauty', subcategory: 'Skincare', gender: 'Unisex', price: 549, mrp: 799, images: [photo('photo-1608248543803-ba4f8c70ae0b'), photo('photo-1601049541289-9b1b7bbbfe19')], colors: ['Unscented'], sizes: ['2 x 50 ml'], tags: ['beauty', 'skincare'], stock: 43, rating: 4.2, numReviews: 27, featured: false }
];

try {
  await connectDB();
  const operations = products.map((item) => ({ updateOne: { filter: { slug: item.slug }, update: { $set: item }, upsert: true } }));
  await Product.bulkWrite(operations);
  const adminEmail = process.env.SEED_ADMIN_EMAIL || 'admin@guhasphere.dev';
  const adminPassword = process.env.SEED_ADMIN_PASSWORD;
  if (adminPassword && adminPassword.length >= 8) {
    const existing = await User.findOne({ email: adminEmail });
    if (!existing) await User.create({ name: 'Guhasphere Admin', email: adminEmail, password: adminPassword, role: 'admin' });
    console.log(`Admin account ready for ${adminEmail}.`);
  } else {
    console.log('Admin account skipped. Set SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD (8+ chars) to create one.');
  }
  console.log(`Seeded ${products.length} products.`);
} catch (error) {
  console.error(error);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
