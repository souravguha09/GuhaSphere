import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ArrowUpRight, Heart, Minus, Plus, RotateCcw, ShieldCheck, Truck } from 'lucide-react';
import api, { getErrorMessage } from '../services/api';
import { useShop } from '../context/ShopContext';
import { useToast } from '../context/ToastContext';
import ProductGrid from '../components/ProductGrid';

const money = (value) => `₹${Number(value).toLocaleString('en-IN')}`;
export default function ProductDetail() {
  const { slug } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [imageIndex, setImageIndex] = useState(0);
  const [size, setSize] = useState('');
  const [color, setColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const { addToCart, toggleWishlist, isWishlisted } = useShop();
  const notify = useToast();
  useEffect(() => { setData(null); setImageIndex(0); setSize(''); setColor(''); api.get(`/products/${slug}`).then(({ data: result }) => { setData(result); setSize(result.product.sizes?.[0] || ''); setColor(result.product.colors?.[0] || ''); }).catch((err) => setError(getErrorMessage(err))); }, [slug]);
  if (error) return <main className="container detail-error"><h2>We couldn't find that piece.</h2><p>{error}</p><Link className="button button-dark" to="/shop">Back to the edit</Link></main>;
  if (!data) return <main className="container detail-loading">Loading the details<span>✳</span></main>;
  const { product, related } = data;
  const discount = Math.round((1 - product.price / product.mrp) * 100);
  const selectedImage = product.images?.[imageIndex] || product.images?.[0];
  const add = () => { addToCart(product, size, color); for (let i = 1; i < quantity; i++) addToCart(product, size, color); notify('Added to your bag. Good choice.'); };
  return <main className="container detail-page">
    <div className="breadcrumb"><Link to="/">Home</Link><span>/</span><Link to="/shop">Shop</Link><span>/</span><span>{product.name}</span></div>
    <div className="detail-layout"><div className="detail-gallery"><div className="detail-thumbs">{product.images?.map((image, i) => <button key={image} className={imageIndex === i ? 'active' : ''} onClick={() => setImageIndex(i)}><img src={image} alt={`${product.name} view ${i + 1}`} /></button>)}</div><div className="detail-main-image"><img src={selectedImage} alt={product.name} /><span className="image-index">0{imageIndex + 1} / 0{product.images?.length || 1}</span></div></div>
      <div className="detail-copy"><span className="eyebrow">{product.brand} / {product.category}</span><h1>{product.name}</h1><div className="detail-rating"><span>★ {Number(product.rating).toFixed(1)}</span><span>{product.numReviews || 0} customer reviews</span></div><div className="detail-price"><strong>{money(product.price)}</strong><del>{money(product.mrp)}</del><span>{discount}% OFF</span></div><p className="tax-note">Inclusive of all taxes. Shipping calculated at checkout.</p><div className="detail-divider" />
        {product.colors?.length > 0 && <div className="option-group"><div className="option-heading"><strong>COLOUR</strong><span>{color}</span></div><div className="color-options">{product.colors.map((item, i) => <button key={item} className={color === item ? 'active' : ''} onClick={() => setColor(item)} title={item}><span className={`swatch swatch-${i}`} /></button>)}</div></div>}
        {product.sizes?.length > 0 && <div className="option-group"><div className="option-heading"><strong>SELECT SIZE</strong><button className="size-guide" onClick={() => notify('Size guide: choose your usual fit. More details coming soon.', 'info')}>SIZE GUIDE ↗</button></div><div className="detail-size-options">{product.sizes.map((item) => <button key={item} className={size === item ? 'active' : ''} onClick={() => setSize(item)}>{item}</button>)}</div></div>}
        <div className="detail-quantity"><strong>QUANTITY</strong><div><button onClick={() => setQuantity(Math.max(1, quantity - 1))}><Minus size={14} /></button><span>{quantity}</span><button onClick={() => setQuantity(Math.min(10, quantity + 1))}><Plus size={14} /></button></div><small>{product.stock > 0 ? `${product.stock} available` : 'Out of stock'}</small></div>
        <div className="detail-actions"><button className="button button-dark add-bag-button" disabled={!product.stock} onClick={add}>ADD TO BAG <ArrowUpRight size={17} /></button><button className={`detail-wishlist ${isWishlisted(product._id) ? 'active' : ''}`} onClick={() => { toggleWishlist(product); notify(isWishlisted(product._id) ? 'Removed from wishlist' : 'Saved to wishlist'); }}><Heart fill={isWishlisted(product._id) ? 'currentColor' : 'none'} /></button></div>
        <div className="delivery-points"><div><Truck /><span><strong>Delivery in 3–7 days</strong><small>Free above ₹999</small></span></div><div><RotateCcw /><span><strong>Easy 7-day returns</strong><small>On eligible, unused items</small></span></div><div><ShieldCheck /><span><strong>Secure payments</strong><small>Safe checkout, always</small></span></div></div>
        <div className="product-description"><h3>A little about this piece</h3><p>{product.description || `${product.name} is part of our considered edit: versatile, easy to style and made to find a place in your everyday rotation.`}</p></div>
      </div></div>
    {related?.length > 0 && <section className="section-block related-products"><div className="section-heading"><div><span className="eyebrow">MORE FROM THIS WORLD</span><h2>You might <em>also like.</em></h2></div><Link className="text-link" to="/shop">Explore all <ArrowLeft size={15} /></Link></div><ProductGrid products={related} /></section>}
  </main>;
}
