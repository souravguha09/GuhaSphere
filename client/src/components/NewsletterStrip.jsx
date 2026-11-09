import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
export default function NewsletterStrip() {
  return <section className="newsletter-strip container"><div className="newsletter-copy"><span className="eyebrow">A GOOD PLACE TO START</span><h2>Make room for<br /><em>something new.</em></h2><p>Discover pieces that feel like you. And then some.</p><Link className="button button-light" to="/shop">Shop the edit <ArrowUpRight size={16} /></Link></div><div className="newsletter-art"><img src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1100&q=85" alt="Friends exploring a fashion collection" loading="lazy" /><span className="round-stamp">YOUR<br />STYLE<br />YOUR<br />RULES</span></div></section>;
}
