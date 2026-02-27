import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import api from '../api/axios';
import Invoice from '../components/invoice/Invoice';
import './Payment.css';

const Payment = () => {
  const { user, isBuyer } = useAuth();
  const { cartItems, cartOrderId, getCartTotal, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false); // State for mock payment modal
  const navigate = useNavigate();

  if (!isBuyer) {
    return <div className="payment-page">Access denied. Please login as a buyer.</div>;
  }

  if (cartItems.length === 0) {
    return (
      <div className="payment-page">
        <div className="payment-container">
          <p>Your cart is empty. Please add items to cart first.</p>
          <button onClick={() => navigate('/')}>Go to Home</button>
        </div>
      </div>
    );
  }

  const handlePayment = async () => {
    setLoading(true);
    setError('');

    // Mock payment simulation
    setTimeout(() => {
      setLoading(false);
      setShowModal(true); // Show success modal
    }, 1500);
  };

  const handleCloseModal = () => {
    // Frontend-only persistence: Save order to local history
    // This bridges the gap between Mock Payment and Order History without backend changes
    try {
      const currentOrder = {
        orderId: cartOrderId || Math.floor(Math.random() * 100000), // Use real ID if available, else random
        orderDate: new Date().toISOString(),
        totalAmount: getCartTotal(),
        status: 'PAID', // Payment successful
        items: cartItems
      };

      const existingHistory = JSON.parse(localStorage.getItem('craftEva_order_history') || '[]');
      // Avoid duplicates
      if (!existingHistory.some(o => o.orderId === currentOrder.orderId)) {
        const updatedHistory = [currentOrder, ...existingHistory];
        localStorage.setItem('craftEva_order_history', JSON.stringify(updatedHistory));
      }
    } catch (err) {
      console.error('Error saving order to local history:', err);
    }

    clearCart(); // Clear cart only after user acknowledges payment
    setShowModal(false);
    navigate('/order-history'); // Redirect to order history page
  };

  return (
    <div className="payment-page">
      <div className="payment-container">
        <h2>Payment</h2>
        {error && <div className="error-message">{error}</div>}
        <div className="order-summary">
          <h3>Order Summary</h3>
          <div className="summary-items">
            {cartItems.map((item) => (
              <div key={item.orderItemId} className="summary-item">
                <span>{item.product?.productName || 'Product'}</span>
                <span>₹{item.price?.toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="summary-total">
            <strong>Total: ₹{getCartTotal().toFixed(2)}</strong>
          </div>
        </div>
        <div className="payment-actions">
          <button
            onClick={() => navigate('/cart')}
            className="back-btn"
            disabled={loading}
          >
            Back to Cart
          </button>
          <button
            onClick={handlePayment}
            className="pay-btn"
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Make Payment'}
          </button>
        </div>
      </div>

      {/* Mock Payment Success Modal with Invoice */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content invoice-modal">
            <h3>Payment Successful</h3>
            <p>Your payment has been processed successfully.</p>

            <Invoice
              orderId={Math.floor(Math.random() * 100000) + 1} // Generate a random order ID for display
              items={cartItems}
              totalAmount={getCartTotal()}
              date={new Date().toLocaleDateString()}
            />

            <button onClick={handleCloseModal} className="modal-close-btn">
              Close & Go to Order History
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Payment;
