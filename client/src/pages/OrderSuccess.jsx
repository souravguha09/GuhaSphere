import { Link, useLocation, useParams } from 'react-router-dom';
import { Check, ArrowUpRight, PackageCheck } from 'lucide-react';
export default function OrderSuccess() {
  const { id } = useParams();
  const { state } = useLocation();
  const order = state?.order;
  return <main className="container success-page"><div className="success-mark"><Check size={32} /></div><span className="eyebrow">THAT'S A WRAP</span><h1>Good choice.<br /><em>It's on its way.</em></h1><p>Your order has been placed. We'll keep you posted as it makes its way to you.</p><div className="success-order-card"><div><span>ORDER REFERENCE</span><strong>#{id.slice(-8).toUpperCase()}</strong></div><div><span>ORDER TOTAL</span><strong>₹{Number(order?.total || 0).toLocaleString('en-IN')}</strong></div><div><span>PAYMENT</span><strong>{order?.paymentMethod === 'DEMO' ? 'Demo prepaid' : 'Cash on delivery'}</strong></div><div><span>STATUS</span><strong className="status-placed">PLACED</strong></div></div><div className="success-help"><PackageCheck /><span><strong>What's next?</strong><small>Your order will appear in your account. You can track its progress from your order history.</small></span></div><div className="success-actions"><Link className="button button-dark" to="/orders">View my orders <ArrowUpRight size={16} /></Link><Link className="text-link" to="/shop">Keep exploring</Link></div></main>;
}
