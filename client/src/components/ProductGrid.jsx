import ProductCard from './ProductCard';
export default function ProductGrid({ products = [] }) {
  if (!products.length) return <div className="empty-state"><span>✳</span><h3>Nothing in this edit. Yet.</h3><p>Try changing your filters or explore another category.</p></div>;
  return <div className="product-grid">{products.map((product, index) => <ProductCard key={product._id} product={product} index={index} />)}</div>;
}
