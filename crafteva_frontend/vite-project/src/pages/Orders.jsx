import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import './Orders.css';

const Orders = () => {
  const { user, isBuyer } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user && isBuyer) {
      fetchOrders();
    }
  }, [user, isBuyer]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/orders/history/${user.userId}`);
      setOrders(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load orders');
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) {
      return;
    }

    try {
      await api.put(`/orders/cancel/${orderId}`);
      alert('Order cancelled successfully');
      fetchOrders(); // Refresh orders list
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel order');
      console.error('Error cancelling order:', err);
    }
  };

  if (!isBuyer) {
    return <div className="orders-page">Access denied. Please login as a buyer.</div>;
  }

  if (loading) {
    return <div className="orders-page">Loading orders...</div>;
  }

  return (
    <div className="orders-page">
      <div className="orders-container">
        <h2>Order History</h2>
        {error && <div className="error-message">{error}</div>}
        {orders.length === 0 ? (
          <p className="no-orders">No orders found</p>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <div key={order.orderId} className="order-card">
                <div className="order-header">
                  <h3>Order #{order.orderId}</h3>
                  <span className={`status ${order.status?.toLowerCase()}`}>
                    {order.status}
                  </span>
                </div>
                <div className="order-details">
                  <p>
                    <strong>Date:</strong>{' '}
                    {new Date(order.orderDate).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>Total Amount:</strong> ₹{order.totalAmount?.toFixed(2)}
                  </p>
                  {order.status === 'PLACED' && (
                    <button
                      onClick={() => handleCancelOrder(order.orderId)}
                      className="cancel-order-btn"
                    >
                      Cancel Order
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
