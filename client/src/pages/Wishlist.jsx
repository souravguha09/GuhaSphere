import { Link } from 'react-router-dom';
import { ArrowRight, Heart } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import ProductGrid from '../components/ProductGrid';
export default function Wishlist() {
  const { wishlist } = useShop();
  return <main className="container wishlist-page"><div className="page-heading"><span className="eyebrow">THE KEEPERS</span><h1>Your wishlist<span className="title-dot">.</span></h1><p>The pieces you like enough to come back for.</p></div>{wishlist.length ? <ProductGrid products={wishlist} /> : <div className="empty-state"><Heart size={34} /><h3>Nothing saved. For now.</h3><p>Tap the heart on anything that catches your eye.</p><Link className="button button-dark" to="/shop">Find your favourites <ArrowRight size={16} /></Link></div>}</main>;
}
