import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import './SellerDashboard.css';

const SellerDashboard = () => {
  const { user, isSeller } = useAuth();
  const [products, setProducts] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [activeTab, setActiveTab] = useState('products');
  const [formData, setFormData] = useState({
    productName: '',
    description: '',
    price: '',
    imageUrl: '',
    category: 'HANDMADE_JEWELRY',
  });

  useEffect(() => {
    if (isSeller) {
      if (activeTab === 'products') {
        fetchProducts();
      } else if (activeTab === 'payments') {
        fetchPayments();
      }
    }
  }, [isSeller, activeTab]);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/payments/seller/${user.userId}`);
      setPayments(response.data);
      setError('');
    } catch (err) {
      setError('Failed to load payments');
      console.error('Error fetching payments:', err);
    } finally {
      setLoading(false);
    }
  };

  const downloadInvoice = async (orderId) => {
    try {
      const response = await api.get(`/invoices/order/${orderId}`, {
        responseType: 'blob',
      });
      
      // Create a blob URL and download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `invoice-order-${orderId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert('Failed to download invoice');
      console.error('Error downloading invoice:', err);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await api.get('/products');
      // Filter products by current seller (if backend doesn't filter)
      setProducts(response.data);
      setError('');
    } catch (err) {
      setError('Failed to load products');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (editingProduct) {
        // Update product
        await api.put(`/products/${editingProduct.productId}`, {
          productName: formData.productName,
          description: formData.description,
          price: parseFloat(formData.price),
          imageUrl: formData.imageUrl,
          category: formData.category,
        });
      } else {
        // Add new product
        await api.post('/products', {
          productName: formData.productName,
          description: formData.description,
          price: parseFloat(formData.price),
          imageUrl: formData.imageUrl,
          category: formData.category,
          seller: { userId: user.userId },
        });
      }
      setShowAddForm(false);
      setEditingProduct(null);
      setFormData({
        productName: '',
        description: '',
        price: '',
        imageUrl: '',
        category: 'HANDMADE_JEWELRY',
      });
      fetchProducts();
    } catch (err) {
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.error || 
                          err.message || 
                          'Failed to save product';
      setError(errorMessage);
      console.error('Product save error:', err.response?.data || err);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      productName: product.productName,
      description: product.description,
      price: product.price.toString(),
      imageUrl: product.imageUrl || '',
      category: product.category || 'ELECTRONICS',
    });
    setShowAddForm(true);
  };

  const handleDelete = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      await api.delete(`/products/${productId}`);
      fetchProducts();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete product');
    }
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setEditingProduct(null);
    setFormData({
      productName: '',
      description: '',
      price: '',
      imageUrl: '',
      category: 'HANDMADE_JEWELRY',
    });
  };

  if (!isSeller) {
    return <div className="seller-dashboard">Access denied. Please login as a seller.</div>;
  }

  return (
    <div className="seller-dashboard">
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h2>Seller Dashboard</h2>
          <button
            onClick={() => setShowAddForm(true)}
            className="add-product-btn"
          >
            Add Product
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <>
            {showAddForm && (
          <div className="product-form-container">
            <h3>{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
            <form onSubmit={handleSubmit} className="product-form">
              <div className="form-group">
                <label>Product Name</label>
                <input
                  type="text"
                  name="productName"
                  value={formData.productName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Price</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  required
                />
              </div>
              <div className="form-group">
                <label>Image URL</label>
                <input
                  type="url"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                >
                  <option value="HANDMADE_JEWELRY">Handmade Jewelry</option>
                  <option value="HOME_DECOR">Home Decor</option>
                  <option value="POTTERY">Pottery</option>
                  <option value="PAPER_CRAFT">Paper Craft</option>
                  <option value="PAINTINGS">Paintings</option>
                  <option value="FASHION_ACCESSORIES">Fashion Accessories</option>
                </select>
              </div>
              <div className="form-actions">
                <button type="submit" className="submit-btn">
                  {editingProduct ? 'Update' : 'Add'} Product
                </button>
                <button type="button" onClick={handleCancel} className="cancel-btn">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {loading ? (
          <div>Loading products...</div>
        ) : (
          <div className="products-list">
            {products.length === 0 ? (
              <p className="no-products">No products found. Add your first product!</p>
            ) : (
              products.map((product) => (
                <div key={product.productId} className="product-item">
                  <div className="product-info">
                    <h4>{product.productName}</h4>
                    <p>{product.description}</p>
                    <div className="product-meta">
                      <span className="price">₹{product.price?.toFixed(2)}</span>
                      <span className="category">{product.category}</span>
                    </div>
                  </div>
                  <div className="product-actions">
                    <button
                      onClick={() => handleEdit(product)}
                      className="edit-btn"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product.productId)}
                      className="delete-btn"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
          </>
        )}

        {/* Payments Tab */}
        {activeTab === 'payments' && (
          <div className="payments-container">
            <h3>Your Payments</h3>
            {loading ? (
              <div>Loading payments...</div>
            ) : payments.length === 0 ? (
              <p className="no-payments">No payments found</p>
            ) : (
              <div className="payments-list">
                {payments.map((payment) => (
                  <div key={payment.paymentId} className="payment-card">
                    <div className="payment-header">
                      <h4>Payment #{payment.paymentId}</h4>
                      <span className={`payment-status ${payment.paymentStatus?.toLowerCase()}`}>
                        {payment.paymentStatus}
                      </span>
                    </div>
                    <div className="payment-details">
                      <p><strong>Amount:</strong> ₹{payment.amount?.toFixed(2)}</p>
                      <p><strong>Order ID:</strong> {payment.order?.orderId}</p>
                      {payment.order?.orderId && (
                        <button
                          onClick={() => downloadInvoice(payment.order.orderId)}
                          className="invoice-btn"
                        >
                          Download Invoice
                        </button>
                      )}
                    </div>
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

export default SellerDashboard;
