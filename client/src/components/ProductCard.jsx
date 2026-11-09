import { Heart, Star, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { useToast } from '../context/ToastContext';

const money = (value) => `₹${Number(value).toLocaleString('en-IN')}`;
export default function ProductCard({ product, index = 0 }) {
  const { toggleWishlist, isWishlisted, addToCart } = useShop();
  const notify = useToast();
  const discount = Math.max(0, Math.round((1 - product.price / product.mrp) * 100));
  const firstSize = product.sizes?.[0] || '';
  const image = product.images?.[0] || 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=80';
  return <article className="product-card" style={{ '--card-index': index }}>
    <div className="product-image-wrap">
      <Link to={`/product/${product.slug}`} className="product-image-link"><img className="product-image" src={image} alt={product.name} loading="lazy" /></Link>
      <div className="product-card-badges">{product.isNew && <span className="tag-new">JUST IN</span>}{discount >= 25 && <span className="tag-sale">-{discount}%</span>}</div>
      <button className={`wishlist-toggle ${isWishlisted(product._id) ? 'is-active' : ''}`} aria-label={isWishlisted(product._id) ? 'Remove from wishlist' : 'Add to wishlist'} onClick={() => { toggleWishlist(product); notify(isWishlisted(product._id) ? 'Removed from your wishlist' : 'Saved to your wishlist'); }}><Heart size={18} fill={isWishlisted(product._id) ? 'currentColor' : 'none'} /></button>
      <button className="quick-add" onClick={() => { addToCart(product, firstSize); notify(`${product.name} added to your bag`); }}>QUICK ADD <span>+</span></button>
    </div>
    <div className="product-info">
      <div className="product-brand-row"><span className="product-brand">{product.brand}</span><span className="product-rating"><Star size={12} fill="currentColor" /> {Number(product.rating || 0).toFixed(1)}</span></div>
      <Link className="product-name" to={`/product/${product.slug}`}>{product.name}</Link>
      <div className="product-prices"><strong>{money(product.price)}</strong><del>{money(product.mrp)}</del><span>{discount}% off</span></div>
      <div className="swatch-row">{(product.colors || []).slice(0, 4).map((color, i) => <span key={color} title={color} className={`swatch swatch-${i}`} />)}<span className="color-count">{product.colors?.length || 0} colours</span></div>
    </div>
  </article>;
}
