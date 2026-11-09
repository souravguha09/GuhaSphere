import { useEffect, useState } from 'react';
import { ArrowRight, ArrowUpRight, MoveRight, ShieldCheck, Truck, RefreshCw, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import api, { getErrorMessage } from '../services/api';
import ProductGrid from '../components/ProductGrid';
import NewsletterStrip from '../components/NewsletterStrip';

const categories = [
  { label: 'THE NEW WARDROBE', sub: 'Clothing with a point of view', image: 'photo-1483985988355-763728e1935b', link: '/shop?category=Clothing' },
  { label: 'STEP OUT', sub: 'Sneakers, slides & more', image: 'photo-1542291026-7eec264c27ff', link: '/shop?category=Footwear' },
  { label: 'LITTLE EXTRAS', sub: 'The details make the look', image: 'photo-1548036328-c9fa89d128fa', link: '/shop?category=Accessories' }
];
export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [newIn, setNewIn] = useState([]);
  const [error, setError] = useState('');
  useEffect(() => {
    Promise.all([api.get('/products?limit=4&sort=featured'), api.get('/products?limit=4&sort=newest')])
      .then(([a, b]) => { setFeatured(a.data.products); setNewIn(b.data.products); })
      .catch((err) => setError(getErrorMessage(err)));
  }, []);
  return <main>
    <section className="hero container">
      <h1>Make your<br /><em>own orbit.</em></h1>

<p>
  Independent finds, unexpected details and pieces that feel like you.
  No uniform. No rulebook. Just your next favourite thing.
</p>
      <div className="hero-copy"><span className="eyebrow hero-eyebrow"><span /> THE GUHASPHERE POINT OF VIEW</span><h1>Find your<br /><em>everyday</em><br />extraordinary.</h1><p>Good design. Better details. Pieces that move with you, wherever the day goes.</p><div className="hero-actions"><Link className="button button-dark" to="/shop">Explore the edit <ArrowUpRight size={17} /></Link><Link className="text-link" to="/shop?tag=new-season">What's new <MoveRight size={16} /></Link></div><div className="hero-footnote"><span>01 / 03</span><span>CURATED FOR THE CURIOUS</span></div></div>
      <div className="hero-image"><img src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1500&q=90" alt="Editorial fashion look from the Guhasphere collection" /><div className="hero-image-caption"><span>THE NEW SEASON</span><span>VOL. 06 — 2026</span></div><div className="hero-sticker">STYLE<br />WITHOUT<br />THE SCRIPT<span>✳</span></div></div>
    </section>
    <section className="benefit-bar container"><div><Truck /><span><strong>Free shipping</strong><small>On orders above ₹999</small></span></div><div><RefreshCw /><span><strong>Easy 7-day returns</strong><small>Hassle-free exchanges</small></span></div><div><ShieldCheck /><span><strong>Secure checkout</strong><small>Your details stay safe</small></span></div><div><Sparkles /><span><strong>Fresh edits often</strong><small>New finds, every week</small></span></div></section>
    <section className="section-block container"><div className="section-heading"><div><span className="eyebrow">A LITTLE SOMETHING FOR EVERY MOOD</span><h2>What's your <em>next move?</em></h2></div><Link className="text-link" to="/shop">View all categories <ArrowRight size={16} /></Link></div><div className="category-grid">{categories.map((item, i) => <Link className={`category-tile category-${i}`} to={item.link} key={item.label}><img src={`https://images.unsplash.com/${item.image}?auto=format&fit=crop&w=1000&q=85`} alt={item.label} loading="lazy" /><div className="category-shade" /><div className="category-content"><span>0{i + 1} / THE EDIT</span><h3>{item.label}</h3><p>{item.sub}</p></div><span className="category-arrow"><ArrowUpRight /></span></Link>)}</div></section>
    <section className="section-block container"><div className="section-heading"><div><span className="eyebrow">THE ONES EVERYONE'S TALKING ABOUT</span><h2>Good things, <em>on repeat.</em></h2></div><Link className="text-link" to="/shop?sort=featured">Shop bestsellers <ArrowRight size={16} /></Link></div>{error ? <p className="inline-error">{error} — check that the API and database are running.</p> : <ProductGrid products={featured} />}</section>
    <NewsletterStrip />
    <section className="section-block container last-section"><div className="section-heading"><div><span className="eyebrow">JUST LANDED, JUST IN TIME</span><h2>New in. <em>Not like the rest.</em></h2></div><Link className="text-link" to="/shop?sort=newest">See the latest <ArrowRight size={16} /></Link></div><ProductGrid products={newIn} /></section>
  </main>;
}
