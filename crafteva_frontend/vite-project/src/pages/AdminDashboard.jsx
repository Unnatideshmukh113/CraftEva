import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { user, isAdmin } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalPayments: 0,
    totalRevenue: 0
  });
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    if (isAdmin) {
      loadDashboardData();
    }
  }, [isAdmin]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // 1. Fetch Products from public API
      let productCount = 0;
      let fetchedProducts = [];
      try {
        const prodResponse = await api.get('/products');
        if (Array.isArray(prodResponse.data)) {
          fetchedProducts = prodResponse.data;
          productCount = fetchedProducts.length;
          setProducts(fetchedProducts);
        }
      } catch (err) {
        console.error('Failed to fetch products for dashboard:', err);
      }

      // 2. Load Orders from Local Storage (Frontend Persistence)
      let localOrders = [];
      try {
        const stored = localStorage.getItem('craftEva_order_history');
        if (stored) {
          localOrders = JSON.parse(stored);
        }
      } catch (err) {
        console.error('Failed to parse local orders:', err);
      }
      setOrders(localOrders);

      // 3. Calculate Stats
      const totalOrders = localOrders.length;
      const totalRevenue = localOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);

      // Since we can't fetch real users, we mock count (Admin + known Buyers from orders)
      // This is a "best effort" estimation for frontend-only mode
      const uniqueBuyers = new Set(localOrders.map(o => o.buyer?.userId || 'unknown')).size;
      const totalUsers = uniqueBuyers + 1; // +1 for the Admin yourself

      setStats({
        totalUsers,
        totalProducts: productCount,
        totalOrders,
        totalPayments: totalOrders, // Assuming all local history orders are paid
        totalRevenue
      });

      setError('');
    } catch (err) {
      setError('Failed to load dashboard statistics');
      console.error('Error loading dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    // Data is already loaded, just switching view
  };

  if (!isAdmin) {
    return <div className="admin-dashboard">Access denied. Admin access required.</div>;
  }

  if (loading) {
    return <div className="admin-dashboard">Loading dashboard...</div>;
  }

  return (
    <div className="admin-dashboard">
      <div className="dashboard-container">
        <h2>Admin Dashboard</h2>
        {error && <div className="error-message">{error}</div>}

        {/* Tabs */}
        <div className="admin-tabs">
          <button
            className={activeTab === 'dashboard' ? 'active' : ''}
            onClick={() => handleTabChange('dashboard')}
          >
            Dashboard
          </button>
          <button
            className={activeTab === 'products' ? 'active' : ''}
            onClick={() => handleTabChange('products')}
          >
            Products
          </button>
          <button
            className={activeTab === 'orders' ? 'active' : ''}
            onClick={() => handleTabChange('orders')}
          >
            Orders
          </button>
        </div>

        {/* Dashboard Stats */}
        {activeTab === 'dashboard' && stats && (
          <div className="stats-grid">
            <div className="stat-card">
              <h3>Total Products</h3>
              <p className="stat-value">{stats.totalProducts}</p>
            </div>
            <div className="stat-card">
              <h3>Total Orders</h3>
              <p className="stat-value">{stats.totalOrders}</p>
            </div>
            <div className="stat-card revenue">
              <h3>Total Revenue</h3>
              <p className="stat-value">₹{stats.totalRevenue?.toFixed(2)}</p>
            </div>
            <div className="stat-card">
              <h3>Active Users (Est.)</h3>
              <p className="stat-value">{stats.totalUsers}</p>
            </div>
          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div className="admin-table-container">
            <h3>All Products</h3>
            {products.length === 0 ? (
              <p>No products found</p>
            ) : (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Price</th>
                    <th>Category</th>
                    <th>Seller</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.productId}>
                      <td>{product.productId}</td>
                      <td>{product.productName}</td>
                      <td>₹{product.price?.toFixed(2)}</td>
                      <td>{product.category}</td>
                      <td>{product.seller?.email || 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="admin-table-container">
            <h3>Recent Orders (Local History)</h3>
            {orders.length === 0 ? (
              <p>No orders found in local history</p>
            ) : (
              <div className="orders-list">
                {orders.map((order) => (
                  <div key={order.orderId} className="order-card">
                    <div className="order-header">
                      <h4>Order #{order.orderId}</h4>
                      <span className={`status ${order.status?.toLowerCase()}`}>
                        {order.status}
                      </span>
                    </div>
                    <p><strong>Date:</strong> {new Date(order.orderDate).toLocaleDateString()}</p>
                    <p><strong>Amount:</strong> ₹{order.totalAmount?.toFixed(2)}</p>
                    <p><strong>Items:</strong> {order.items?.length || 0}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
