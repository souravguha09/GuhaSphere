import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Search, Heart, ShoppingBag, UserRound, Menu, X, ArrowUpRight } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { useAuth } from '../context/AuthContext';

const navItems = [['New In', '/shop?tag=new-season'], ['Men', '/shop?gender=Men'], ['Women', '/shop?gender=Women'], ['Footwear', '/shop?category=Footwear'], ['Accessories', '/shop?category=Accessories'], ['Beauty & Home', '/shop?category=Beauty']];
export default function Header() {
  const [search, setSearch] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { cartCount, wishlist } = useShop();
  const { user } = useAuth();
  const submitSearch = (event) => { event.preventDefault(); navigate(`/shop?q=${encodeURIComponent(search.trim())}`); setSearch(''); setMenuOpen(false); };
  return <>
    <div className="announcement"><span>THE EVERYDAY EDIT</span><span>Fresh fits. Better finds. Free delivery over ₹999.</span><Link to="/shop">Explore the drop <ArrowUpRight size={12} /></Link></div>
    <header className="site-header">
      <div className="header-main container">
        <button className="icon-button mobile-menu-button" aria-label="Open menu" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</button>
        <Link className="brand-lockup" to="/"><span className="brand-mark">G<span>.</span></span><span className="brand-name">GUHASPHERE</span></Link>
        <nav className="desktop-nav">{navItems.map(([label, href]) => <NavLink key={label} to={href}>{label}</NavLink>)}</nav>
        <div className="header-actions">
          <form className="header-search" onSubmit={submitSearch}><Search size={17} /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search the edit" aria-label="Search products" /><kbd>↵</kbd></form>
          <Link className="icon-button account-icon" to={user ? '/account' : '/login'} aria-label="Account"><UserRound /></Link>
          <Link className="icon-button wish-icon" to="/wishlist" aria-label="Wishlist"><Heart /><span className="count-dot">{wishlist.length}</span></Link>
          <Link className="icon-button bag-icon" to="/bag" aria-label="Shopping bag"><ShoppingBag /><span className="count-dot">{cartCount}</span></Link>
        </div>
      </div>
      {menuOpen && <div className="mobile-nav">{navItems.map(([label, href]) => <NavLink key={label} to={href} onClick={() => setMenuOpen(false)}>{label}<ArrowUpRight size={15} /></NavLink>)}<form className="mobile-search" onSubmit={submitSearch}><Search size={17} /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search Guhasphere" /><button>Search</button></form></div>}
    </header>
  </>;
}
