import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowUpRight, LockKeyhole } from 'lucide-react';
import api, { getErrorMessage } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useShop } from '../context/ShopContext';
import { useToast } from '../context/ToastContext';

const money = (value) => `₹${Number(value).toLocaleString('en-IN')}`;
export default function Checkout() {
  const { user } = useAuth();
  const { cart, subtotal, discount, couponCode, clearCart } = useShop();
  const notify = useToast();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [address, setAddress] = useState({ name: user?.name || '', phone: '', line1: '', line2: '', city: '', state: '', postalCode: '' });
  const change = (key) => (event) => setAddress((current) => ({ ...current, [key]: event.target.value }));
  const shipping = subtotal >= 999 ? 0 : 79;
  const submit = async (event) => {
    event.preventDefault(); if (!cart.length) return;
    setLoading(true); setError('');
    try {
      const { data } = await api.post('/orders', { items: cart.map((item) => ({ productId: item.productId, quantity: item.quantity, size: item.size, color: item.color })), shippingAddress: address, paymentMethod, couponCode });
      clearCart(); notify('Order placed. Thanks for shopping Guhasphere.'); navigate(`/order-success/${data.order._id}`, { state: { order: data.order } });
    } catch (err) { setError(getErrorMessage(err)); }
    finally { setLoading(false); }
  };
  if (!user) return <main className="container checkout-empty"><h1>One quick step.</h1><p>Please sign in before placing your order, so we can keep your purchase details together.</p><Link className="button button-dark" to="/login" state={{ from: '/checkout' }}>Sign in to continue <ArrowUpRight size={16} /></Link></main>;
  if (!cart.length) return <main className="container checkout-empty"><h1>Your bag is empty.</h1><p>Find something you love first. We'll be right here.</p><Link className="button button-dark" to="/shop">Explore the edit</Link></main>;
  return <main className="container checkout-page"><div className="breadcrumb"><Link to="/bag"><ArrowLeft size={13} /> Your bag</Link><span>/</span><span>Checkout</span></div><div className="page-heading checkout-heading"><span className="eyebrow">ALMOST YOURS</span><h1>Make it <em>official.</em></h1><p>Delivery details and payment, all in one place.</p></div><form className="checkout-layout" onSubmit={submit}><section className="checkout-form"><div className="checkout-section"><div className="checkout-section-head"><span>01</span><div><h2>Where should we send it?</h2><p>Delivery address</p></div></div><div className="form-grid"><label className="full-field">FULL NAME<input required value={address.name} onChange={change('name')} placeholder="Name on the door" /></label><label>PHONE NUMBER<input required type="tel" pattern="[0-9+() -]{8,16}" value={address.phone} onChange={change('phone')} placeholder="10-digit mobile number" /></label><label>PIN CODE<input required pattern="[0-9]{6}" value={address.postalCode} onChange={change('postalCode')} placeholder="6-digit PIN" /></label><label className="full-field">ADDRESS LINE 1<input required value={address.line1} onChange={change('line1')} placeholder="House / flat / street" /></label><label className="full-field">LANDMARK / ADDRESS LINE 2 <span className="optional">OPTIONAL</span><input value={address.line2} onChange={change('line2')} placeholder="Apartment, landmark, etc." /></label><label>CITY<input required value={address.city} onChange={change('city')} placeholder="City" /></label><label>STATE<input required value={address.state} onChange={change('state')} placeholder="State" /></label></div></div><div className="checkout-section"><div className="checkout-section-head"><span>02</span><div><h2>How would you like to pay?</h2><p>Choose your preferred payment method</p></div></div><label className={`payment-option ${paymentMethod === 'COD' ? 'selected' : ''}`}><input type="radio" name="payment" value="COD" checked={paymentMethod === 'COD'} onChange={() => setPaymentMethod('COD')} /><span><strong>Cash on delivery</strong><small>Pay when your order arrives</small></span><b>COD</b></label><label className={`payment-option ${paymentMethod === 'DEMO' ? 'selected' : ''}`}><input type="radio" name="payment" value="DEMO" checked={paymentMethod === 'DEMO'} onChange={() => setPaymentMethod('DEMO')} /><span><strong>Demo prepaid checkout</strong><small>For local testing only — no real payment is processed</small></span><b>DEMO</b></label></div>{error && <div className="form-error">{error}</div>}<button className="button button-dark place-order mobile-place-order" disabled={loading}>{loading ? 'PLACING ORDER…' : 'PLACE MY ORDER'} <ArrowUpRight size={17} /></button></section>
      <aside className="order-summary checkout-summary"><span className="eyebrow">YOUR LITTLE LINE-UP</span><h2>Order summary</h2><div className="checkout-items">{cart.map((item) => <div key={item.key} className="checkout-item"><img src={item.product.images?.[0]} alt={item.product.name} /><div><strong>{item.product.name}</strong><small>{item.size} {item.color && `· ${item.color}`} · Qty {item.quantity}</small></div><b>{money(item.product.price * item.quantity)}</b></div>)}</div><div className="summary-divider" /><div className="summary-line"><span>Subtotal</span><strong>{money(subtotal)}</strong></div><div className="summary-line"><span>Delivery</span><strong>{shipping ? money(shipping) : 'FREE'}</strong></div>{discount > 0 && <div className="summary-line discount-line"><span>Promo ({couponCode})</span><strong>−{money(discount)}</strong></div>}<div className="summary-divider" /><div className="summary-line total-line"><span>Total</span><strong>{money(subtotal + shipping - discount)}</strong></div><button className="button button-dark place-order desktop-place-order" disabled={loading}>{loading ? 'PLACING ORDER…' : 'PLACE MY ORDER'} <ArrowUpRight size={17} /></button><div className="secure-note"><LockKeyhole size={13} /> Your checkout is secured with encrypted transport.</div></aside></form></main>;
}
