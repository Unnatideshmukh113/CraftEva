import { useState, useEffect } from 'react';
import api from '../api/axios';
import ProductList from '../components/product/ProductList';
import './Home.css';

const CATEGORIES = [
  'ALL',
  'HANDMADE_JEWELRY',
  'HOME_DECOR',
  'POTTERY',
  'PAPER_CRAFT',
  'PAINTINGS',
  'FASHION_ACCESSORIES',
];

const Home = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (selectedCategory === 'ALL') {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(products.filter(p => p.category === selectedCategory));
    }
  }, [selectedCategory, products]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await api.get('/products');
      setProducts(response.data);
      setFilteredProducts(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load products');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryLabel = (category) => {
    return category
      .split('_')
      .map(word => word.charAt(0) + word.slice(1).toLowerCase())
      .join(' ');
  };

  return (
    <div className="home">
      <div className="home-container">
        <h1>Welcome to CraftEVA</h1>
        <p className="subtitle">Discover unique handmade products</p>
        
        {/* Category Filter */}
        <div className="category-filter">
          <label htmlFor="category-select">Filter by Category: </label>
          <select
            id="category-select"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="category-select"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {getCategoryLabel(cat)}
              </option>
            ))}
          </select>
        </div>

        {error && <div className="error-message">{error}</div>}
        <ProductList products={filteredProducts} loading={loading} />
      </div>
    </div>
  );
};

export default Home;
