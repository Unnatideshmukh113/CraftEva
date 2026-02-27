import ProductCard from './ProductCard';
import './ProductList.css';

const ProductList = ({ products, loading }) => {
  if (loading) {
    return <div className="loading">Loading products...</div>;
  }

  if (!products || products.length === 0) {
    return <div className="no-products">No products available</div>;
  }

  return (
    <div className="product-list">
      {products.map((product) => (
        <ProductCard key={product.productId} product={product} />
      ))}
    </div>
  );
};

export default ProductList;
