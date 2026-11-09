import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { SlidersHorizontal, X, ChevronDown, ArrowUpRight } from 'lucide-react';
import api, { getErrorMessage } from '../services/api';
import ProductGrid from '../components/ProductGrid';

const categories = ['Clothing', 'Footwear', 'Accessories', 'Beauty', 'Home'];
const genders = ['Men', 'Women', 'Unisex'];
const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '6', '7', '8', '9', '10', 'One Size'];
const colors = ['Black', 'White', 'Ivory', 'Olive', 'Blue', 'Sand'];
const brands = ['Guhasphere Studio', 'North Edit', 'Offbeat', 'Morrow', 'Guhasphere Objects', 'Bare Theory'];
const sorts = [{ value: 'featured', label: 'Featured' }, { value: 'newest', label: 'Latest arrivals' }, { value: 'price_low', label: 'Price: low to high' }, { value: 'price_high', label: 'Price: high to low' }, { value: 'rating', label: 'Top rated' }];
export default function Shop() {
  const [params, setParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const category = params.get('category') || '';
  const gender = params.get('gender') || '';
  const sort = params.get('sort') || 'featured';
  const q = params.get('q') || '';
  const selectedSize = params.get('size') || '';
  const selectedColor = params.get('color') || '';
  const selectedBrand = params.get('brand') || '';
  const selectedRating = params.get('rating') || '';
  const selectedTag = params.get('tag') || '';
  const update = (key, value) => { const next = new URLSearchParams(params); if (value) next.set(key, value); else next.delete(key); next.delete('page'); setParams(next); };
  const reset = () => setParams(q ? { q } : {});
  useEffect(() => {
    setLoading(true); setError('');
    api.get(`/products?${params.toString()}&limit=24`).then(({ data }) => { setProducts(data.products); setPagination(data.pagination); }).catch((err) => setError(getErrorMessage(err))).finally(() => setLoading(false));
  }, [params.toString()]);
  const activeCount = [category, gender, selectedSize, selectedColor, selectedBrand, selectedRating, selectedTag].filter(Boolean).length;
  const title = q ? `Search: “${q}”` : gender ? `${gender}'s edit` : category || (selectedTag === 'new-season' ? 'Just landed' : 'The whole edit');
  return <main className="shop-page container">
    <div className="breadcrumb"><Link to="/">Home</Link><span>/</span><span>Shop</span>{category && <><span>/</span><span>{category}</span></>}</div>
    <div className="shop-title-row"><div><span className="eyebrow">THOUGHTFULLY PICKED. NEVER ORDINARY.</span><h1>{title}<span className="title-dot">.</span></h1><p>{pagination.total} pieces to make your own.</p></div><div className="shop-sort"><label htmlFor="sort-select">SORT BY</label><div className="select-wrap"><select id="sort-select" value={sort} onChange={(e) => update('sort', e.target.value)}>{sorts.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select><ChevronDown size={15} /></div></div></div>
    <div className="shop-toolbar"><button className="filter-trigger" onClick={() => setFiltersOpen(!filtersOpen)}><SlidersHorizontal size={16} /> FILTER & SORT {activeCount > 0 && <span>{activeCount}</span>}</button><div className="active-filter-row">{[[category, 'category'], [gender, 'gender'], [selectedSize, 'size'], [selectedColor, 'color'], [selectedBrand, 'brand'], [selectedRating && `${selectedRating}+ stars`, 'rating'], [selectedTag, 'tag']].filter(([value]) => value).map(([value, key]) => <button key={key} onClick={() => update(key, '')}>{value}<X size={12} /></button>)}{activeCount > 0 && <button className="clear-filter" onClick={reset}>Clear all</button>}</div><span className="result-count">{pagination.total} RESULTS</span></div>
    <div className="shop-layout">
      <aside className={`filter-sidebar ${filtersOpen ? 'filters-open' : ''}`}>
        <div className="filter-head"><strong>REFINE YOUR EDIT</strong><button onClick={() => setFiltersOpen(false)}><X /></button></div>
        <div className="filter-group"><h4>Department</h4>{genders.map((item) => <label key={item} className="check-row"><input type="radio" name="gender" checked={gender === item} onChange={() => update('gender', gender === item ? '' : item)} />{item}</label>)}</div>
        <div className="filter-group"><h4>Category</h4>{categories.map((item) => <label key={item} className="check-row"><input type="checkbox" checked={category === item} onChange={() => update('category', category === item ? '' : item)} />{item}</label>)}</div>
        <div className="filter-group"><h4>Size</h4><div className="size-filter-grid">{sizes.map((item) => <button key={item} className={selectedSize === item ? 'selected' : ''} onClick={() => update('size', selectedSize === item ? '' : item)}>{item}</button>)}</div></div>
        <div className="filter-group"><h4>Colour</h4><div className="colour-filter-grid">{colors.map((item, i) => <button key={item} className={selectedColor === item ? 'selected' : ''} onClick={() => update('color', selectedColor === item ? '' : item)}><span className={`swatch swatch-${i}`} />{item}</button>)}</div></div>
        <div className="filter-group"><h4>Brand</h4>{brands.map((item) => <label key={item} className="check-row"><input type="radio" name="brand" checked={selectedBrand === item} onChange={() => update('brand', selectedBrand === item ? '' : item)} />{item}</label>)}</div>
        <div className="filter-group"><h4>Customer rating</h4><label className="check-row"><input type="radio" name="rating" checked={selectedRating === '4'} onChange={() => update('rating', selectedRating === '4' ? '' : '4')} />4★ & above</label><label className="check-row"><input type="radio" name="rating" checked={selectedRating === '3'} onChange={() => update('rating', selectedRating === '3' ? '' : '3')} />3★ & above</label></div>
        <div className="filter-group"><h4>Price range</h4><div className="price-filter"><button onClick={() => { update('minPrice', ''); update('maxPrice', ''); }}>All prices</button><button onClick={() => { const next = new URLSearchParams(params); next.set('maxPrice', '999'); next.delete('minPrice'); setParams(next); }}>Under ₹999</button><button onClick={() => { const next = new URLSearchParams(params); next.set('minPrice', '1000'); next.set('maxPrice', '1999'); setParams(next); }}>₹1,000 – ₹1,999</button><button onClick={() => { const next = new URLSearchParams(params); next.set('minPrice', '2000'); next.delete('maxPrice'); setParams(next); }}>₹2,000 & above</button></div></div>
        <div className="filter-group"><h4>Collection</h4><label className="check-row"><input type="checkbox" checked={selectedTag === 'new-season'} onChange={() => update('tag', selectedTag ? '' : 'new-season')} />New season</label></div>
        <button className="button button-dark filter-apply" onClick={() => setFiltersOpen(false)}>Show {pagination.total} pieces <ArrowUpRight size={15} /></button>
      </aside>
      <section className="shop-results">{loading ? <div className="loading-grid">{Array.from({ length: 8 }).map((_, i) => <div className="skeleton-card" key={i}><div /><span /><span /></div>)}</div> : error ? <div className="empty-state"><h3>We couldn't load the edit.</h3><p>{error}</p></div> : <ProductGrid products={products} />}
        {!loading && pagination.pages > 1 && <div className="pagination"><button disabled={(Number(params.get('page')) || 1) <= 1} onClick={() => update('page', String(Math.max(1, (Number(params.get('page')) || 1) - 1)))}>Previous</button><span>Page {params.get('page') || 1} of {pagination.pages}</span><button disabled={(Number(params.get('page')) || 1) >= pagination.pages} onClick={() => update('page', String((Number(params.get('page')) || 1) + 1))}>Next</button></div>}
      </section>
    </div>
  </main>;
}
