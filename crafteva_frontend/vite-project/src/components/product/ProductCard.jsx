import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const { isBuyer } = useAuth();
  const { addToCart, loading } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [adding, setAdding] = useState(false);

  const handleAddToCart = async () => {
    if (adding || loading) {
      return; // Prevent multiple clicks
    }
    if (!product || !product.productId) {
      alert('Invalid product. Please refresh the page and try again.');
      console.error('Invalid product:', product);
      return;
    }

    setAdding(true);
    try {
      const result = await addToCart(product.productId, 1);
      if (result.success) {
        alert('Product added to cart successfully!');
      } else {
        const errorMsg = result.error || 'Failed to add to cart. Please try again.';
        alert(errorMsg);
        console.error('Add to cart failed:', result);
      }
    } catch (error) {
      alert('An error occurred while adding to cart. Please check console for details.');
      console.error('Add to cart exception:', error);
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="product-card">
      <div className="product-image">
        {product.imageUrl ? (
          <img src={product.imageUrl} alt={product.productName} />
        ) : (
          <div className="placeholder-image">No Image</div>
        )}
      </div>
      <div className="product-info">
        <h3 className="product-name">{product.productName}</h3>
        <p className="product-description">{product.description}</p>
        <div className="product-details">
          <span className="product-category">{product.category}</span>
          <span className="product-price">₹{(product.price || 0).toFixed(2)}</span>
        </div>
        {isBuyer && (
          <div className="card-actions">
            <button
              onClick={handleAddToCart}
              className="add-to-cart-btn"
              disabled={adding || loading}
            >
              {adding || loading ? 'Adding...' : 'Add to Cart'}
            </button>
            <button
              onClick={() => toggleWishlist(product)}
              className={`wishlist-btn ${isInWishlist(product.productId) ? 'active' : ''}`}
              title={isInWishlist(product.productId) ? "Remove from Wishlist" : "Add to Wishlist"}
            >
              ♥
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
