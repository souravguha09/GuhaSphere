import { Link, useNavigate } from 'react-router-dom';
import { ArrowUpRight, LogOut, Package, UserRound, Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useShop } from '../context/ShopContext';
import { useToast } from '../context/ToastContext';
export default function Account() {
  const { user, logout } = useAuth();
  const { wishlist, cartCount } = useShop();
  const navigate = useNavigate();
  const notify = useToast();
  if (!user) return <main className="container checkout-empty"><h1>Your space awaits.</h1><p>Sign in to manage your account, orders and saved pieces.</p><Link className="button button-dark" to="/login">Sign in <ArrowUpRight size={16} /></Link></main>;
  return <main className="container account-page"><div className="page-heading"><span className="eyebrow">YOUR GUHASPHERE SPACE</span><h1>Hello, {user.name.split(' ')[0]}<span className="title-dot">.</span></h1><p>Good to have you here. Here's your corner of the edit.</p></div><div className="account-grid"><section className="account-profile"><div className="profile-avatar"><UserRound size={30} /></div><span className="eyebrow">YOUR PROFILE</span><h2>{user.name}</h2><p>{user.email}</p><span className="member-since">MEMBER OF THE CLUB</span><button className="logout-button" onClick={() => { logout(); notify('You have been signed out.'); navigate('/'); }}><LogOut size={16} /> Sign out</button></section><div className="account-shortcuts"><Link to="/orders" className="shortcut-card"><span className="shortcut-icon"><Package /></span><div><h3>Your orders</h3><p>Track deliveries and revisit your purchases.</p></div><ArrowUpRight /></Link><Link to="/wishlist" className="shortcut-card"><span className="shortcut-icon"><Heart /></span><div><h3>Your wishlist <small>{wishlist.length} saved</small></h3><p>All the pieces you've got your eye on.</p></div><ArrowUpRight /></Link><Link to="/bag" className="shortcut-card"><span className="shortcut-icon"><Package /></span><div><h3>Your bag <small>{cartCount} items</small></h3><p>You're only a few clicks away from the good stuff.</p></div><ArrowUpRight /></Link></div></div></main>;
}
