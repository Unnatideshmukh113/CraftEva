import React from 'react';
import './Invoice.css';

const Invoice = ({ orderId, items, totalAmount, date }) => {
    return (
        <div className="invoice-container">
            <div className="invoice-header">
                <h2>Invoice</h2>
                <div className="invoice-status">PAID</div>
            </div>

            <div className="invoice-details">
                <p><strong>Order ID:</strong> #{orderId}</p>
                <p><strong>Date:</strong> {date}</p>
            </div>

            <div className="invoice-items-wrapper">
                <table className="invoice-items">
                    <thead>
                        <tr>
                            <th>Product</th>
                            <th>Qty</th>
                            <th>Price</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item, index) => (
                            <tr key={index}>
                                <td>{item.product?.productName || 'Product'}</td>
                                <td>1</td> {/* Assuming Qty 1 based on Cart implementation logic observed so far */}
                                <td>₹{item.price?.toFixed(2)}</td>
                                <td>₹{item.price?.toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colSpan="3" className="total-label">Total Amount:</td>
                            <td className="total-amount">₹{totalAmount.toFixed(2)}</td>
                        </tr>
                    </tfoot>
                </table>
            </div>

            <div className="invoice-footer">
                <p>Thank you for shopping with CraftEva!</p>
            </div>
        </div>
    );
};

export default Invoice;
