import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true },
  brand: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  category: { type: String, required: true, enum: ['Clothing', 'Footwear', 'Accessories', 'Beauty', 'Home'] },
  subcategory: { type: String, default: '' },
  gender: { type: String, enum: ['Men', 'Women', 'Unisex'], default: 'Unisex' },
  price: { type: Number, required: true, min: 0 },
  mrp: { type: Number, required: true, min: 0 },
  images: [{ type: String }],
  colors: [{ type: String }],
  sizes: [{ type: String }],
  tags: [{ type: String }],
  stock: { type: Number, default: 20, min: 0 },
  rating: { type: Number, default: 4.2, min: 0, max: 5 },
  numReviews: { type: Number, default: 0 },
  featured: { type: Boolean, default: false },
  isNew: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

productSchema.index({ name: 'text', brand: 'text', description: 'text', tags: 'text' });
productSchema.index({ category: 1, gender: 1, price: 1 });

export default mongoose.model('Product', productSchema);
