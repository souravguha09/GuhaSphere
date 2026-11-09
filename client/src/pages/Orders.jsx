import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Package } from 'lucide-react';
import api, { getErrorMessage } from '../services/api';
import { useAuth } from '../context/AuthContext';

const money = (value) => `₹${Number(value).toLocaleString('en-IN')}`;
export default function Orders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  useEffect(() => { if (user) api.get('/orders/mine').then(({ data }) => setOrders(data.orders)).catch((err) => setError(getErrorMessage(err))).finally(() => setLoading(false)); }, [user]);
  if (!user) return <main className="container checkout-empty"><h1>Your orders live here.</h1><p>Sign in to see your Guhasphere purchases.</p><Link to="/login" className="button button-dark">Sign in <ArrowUpRight size={16} /></Link></main>;
  return <main className="container account-page"><div className="page-heading"><span className="eyebrow">THE PAPER TRAIL</span><h1>Your orders<span className="title-dot">.</span></h1><p>Every good find, in one place.</p></div>{loading ? <p>Loading your orders…</p> : error ? <div className="form-error">{error}</div> : !orders.length ? <div className="empty-state"><Package size={32} /><h3>No orders yet.</h3><p>Every great wardrobe starts somewhere.</p><Link className="button button-dark" to="/shop">Start exploring</Link></div> : <div className="orders-list">{orders.map((order) => <article className="order-card" key={order._id}><div className="order-card-top"><div><span>ORDER PLACED</span><strong>{new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</strong></div><div><span>ORDER ID</span><strong>#{order._id.slice(-8).toUpperCase()}</strong></div><div><span>TOTAL</span><strong>{money(order.total)}</strong></div><span className={`order-status status-${order.status.toLowerCase()}`}>{order.status}</span></div><div className="order-card-items">{order.items.map((item, index) => <div key={`${order._id}-${index}`} className="order-line-item"><img src={item.image} alt={item.name} /><div><strong>{item.name}</strong><small>{item.size} {item.color && `· ${item.color}`} · Qty {item.quantity}</small></div><b>{money(item.price * item.quantity)}</b></div>)}</div><div className="order-card-bottom"><span>{order.paymentMethod === 'COD' ? 'Cash on delivery' : 'Demo prepaid'} · Payment {order.paymentStatus.toLowerCase()}</span><strong>Delivery status: {order.status}</strong></div></article>)}</div>}</main>;
}
