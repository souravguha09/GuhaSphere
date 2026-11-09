import { Link } from 'react-router-dom';
import { Instagram, ArrowUpRight, Send } from 'lucide-react';
export default function Footer() {
  return <footer className="site-footer">
    <div className="container footer-top">
      <div className="footer-brand"><Link className="brand-lockup footer-lockup" to="/"><span className="brand-mark">G<span>.</span></span><span className="brand-name">GUHASPHERE</span></Link><p>Wear your point of view.<br />A little less ordinary, every day.</p><a className="social-link" href="https://instagram.com" target="_blank" rel="noreferrer"><Instagram size={17} /> Instagram <ArrowUpRight size={13} /></a></div>
      <div className="footer-column"><h4>THE EDIT</h4><Link to="/shop?tag=new-season">New arrivals</Link><Link to="/shop?gender=Men">Shop men</Link><Link to="/shop?gender=Women">Shop women</Link><Link to="/shop?category=Footwear">Footwear</Link><Link to="/shop?category=Accessories">Accessories</Link><Link to="/shop?category=Beauty">Beauty</Link><Link to="/shop?category=Home">Home & living</Link></div>
      <div className="footer-column"><h4>HELP DESK</h4><Link to="/account">Your account</Link><Link to="/orders">Track an order</Link><a href="mailto:hello@guhasphere.in">Contact us</a><a href="mailto:hello@guhasphere.in">Returns & exchanges</a><Link to="/faq">FAQs</Link></div>
      <div className="footer-newsletter"><h4>GOOD THINGS, IN YOUR INBOX.</h4><p>New drops, little surprises and first dibs. No noise.</p><form onSubmit={(e) => { e.preventDefault(); window.alert('Thanks for joining the Guhasphere list!'); }}><input type="email" required placeholder="Your email address" aria-label="Email address" /><button aria-label="Subscribe"><Send size={17} /></button></form><small>By subscribing, you agree to receive Guhasphere updates.</small></div>
    </div>
    <div className="container footer-bottom"><span>© {new Date().getFullYear()} GUHASPHERE. ALL RIGHTS RESERVED.</span><span>MADE FOR YOUR EVERYDAY.</span><div><Link to="/privacy">Privacy</Link><Link to="/terms">Terms</Link><a href="https://github.com" target="_blank" rel="noreferrer">Open-source project</a></div></div>
  </footer>;
}
