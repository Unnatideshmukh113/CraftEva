import React from 'react';
import { useWishlist } from '../context/WishlistContext';
import ProductCard from '../components/product/ProductCard';
import './Wishlist.css';

const Wishlist = () => {
    const { wishlist, getWishlistCount } = useWishlist();

    return (
        <div className="wishlist-page">
            <div className="wishlist-container">
                <h2>My Wishlist ({getWishlistCount()})</h2>
                {wishlist.length === 0 ? (
                    <p className="no-items">Your wishlist is empty.</p>
                ) : (
                    <div className="wishlist-grid">
                        {wishlist.map((product) => (
                            <ProductCard key={product.productId} product={product} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Wishlist;
