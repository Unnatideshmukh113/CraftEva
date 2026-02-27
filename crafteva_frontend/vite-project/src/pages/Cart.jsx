import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import CartItem from '../components/cart/CartItem';
import './Cart.css';

const Cart = () => {
  const { cartItems, getCartTotal, loading } = useCart();
  const { isBuyer } = useAuth();
  const navigate = useNavigate();

  if (!isBuyer) {
    return <div className="cart-page">Access denied. Please login as a buyer.</div>;
  }

  if (loading) {
    return (
      <div className="cart-page">
        <div className="cart-container">
          <h2>Your Cart</h2>
          <p>Loading cart...</p>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="cart-page">
        <div className="cart-container">
          <h2>Your Cart</h2>
          <p className="empty-cart">Your cart is empty</p>
          <button onClick={() => navigate('/')} className="continue-shopping-btn">
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-container">
        <h2>Your Cart</h2>
        <div className="cart-items">
          {cartItems.map((item) => (
            <CartItem key={item.orderItemId} item={item} />
          ))}
        </div>
        <div className="cart-summary">
          <div className="total">
            <strong>Total: ₹{getCartTotal().toFixed(2)}</strong>
          </div>
          <button
            onClick={() => navigate('/payment')}
            className="checkout-btn"
          >
            Proceed to Payment
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
