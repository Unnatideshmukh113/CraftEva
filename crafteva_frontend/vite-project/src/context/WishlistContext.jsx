import { createContext, useContext, useState, useEffect } from 'react';

const WishlistContext = createContext();

export const useWishlist = () => {
    return useContext(WishlistContext);
};

export const WishlistProvider = ({ children }) => {
    const [wishlist, setWishlist] = useState(() => {
        // Initialize from localStorage
        try {
            const storedWishlist = localStorage.getItem('craftEva_wishlist');
            return storedWishlist ? JSON.parse(storedWishlist) : [];
        } catch (error) {
            console.error('Error reading wishlist from localStorage:', error);
            return [];
        }
    });

    // Persist to localStorage whenever wishlist changes
    useEffect(() => {
        localStorage.setItem('craftEva_wishlist', JSON.stringify(wishlist));
    }, [wishlist]);

    const addToWishlist = (product) => {
        if (!isInWishlist(product.productId)) {
            setWishlist((prev) => [...prev, product]);
        }
    };

    const removeFromWishlist = (productId) => {
        setWishlist((prev) => prev.filter((item) => item.productId !== productId));
    };

    const isInWishlist = (productId) => {
        return wishlist.some((item) => item.productId === productId);
    };

    const toggleWishlist = (product) => {
        if (isInWishlist(product.productId)) {
            removeFromWishlist(product.productId);
        } else {
            addToWishlist(product);
        }
    };

    const getWishlistCount = () => wishlist.length;

    const value = {
        wishlist,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        toggleWishlist,
        getWishlistCount
    };

    return (
        <WishlistContext.Provider value={value}>
            {children}
        </WishlistContext.Provider>
    );
};
