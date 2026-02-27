import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import './Orders.css'; // Reusing existing styles for consistency

const OrderHistory = () => {
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

            // 1. Fetch backend orders (if any)
            let backendOrders = [];
            try {
                const response = await api.get(`/orders/history/${user.userId}`);
                if (Array.isArray(response.data)) {
                    backendOrders = response.data;
                }
            } catch (apiErr) {
                console.warn('Backend order fetch failed or empty, relying on local history:', apiErr);
            }

            // 2. Fetch local frontend-only orders (from mock payments)
            let localOrders = [];
            try {
                const stored = localStorage.getItem('craftEva_order_history');
                if (stored) {
                    localOrders = JSON.parse(stored);
                    // Filter to ensure they belong to current user (optional, but good practice if we stored userId)
                    // For now, assume consistent usage on single device
                }
            } catch (localErr) {
                console.error('Local history parse error:', localErr);
            }

            // 3. Merge and Deduplicate
            // Prioritize backend if IDs conflict, or combine. 
            // Since mock IDs might overlap with real ones in a real scenario, we'll just check specific ID.
            const allOrders = [...localOrders, ...backendOrders];

            // Remove duplicates by ID
            const uniqueOrders = Array.from(new Map(allOrders.map(item => [item.orderId, item])).values());

            // Sort by date new to old
            uniqueOrders.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));

            setOrders(uniqueOrders);
            setError(null);
        } catch (err) {
            setError('Failed to load order history');
            console.error('Error fetching orders:', err);
        } finally {
            setLoading(false);
        }
    };

    if (!isBuyer) {
        return <div className="orders-page">Access denied. Please login as a buyer.</div>;
    }

    if (loading) {
        return <div className="orders-page">Loading history...</div>;
    }

    return (
        <div className="orders-page">
            <div className="orders-container">
                <h2>Order History</h2>
                {error && <div className="error-message">{error}</div>}
                {orders.length === 0 ? (
                    <p className="no-orders">No past orders found.</p>
                ) : (
                    <div className="orders-list">
                        {orders.map((order) => (
                            <div key={order.orderId} className="order-card history-card">
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
                                    {/* Cancel button removed for Read-Only History View */}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrderHistory;
