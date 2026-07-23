import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Product } from '../data/products';

interface WishlistContextType {
  items: Product[];
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;
  removeFromWishlist: (productId: string) => void;
  clearWishlist: () => void;
  count: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<Product[]>(() => {
    const saved = localStorage.getItem('agrimadeeazy-wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('agrimadeeazy-wishlist', JSON.stringify(items));
  }, [items]);

  const toggleWishlist = (product: Product) => {
    setItems((prev) => {
      if (prev.some((p) => p.id === product.id)) return prev.filter((p) => p.id !== product.id);
      return [...prev, product];
    });
  };

  const isInWishlist = (productId: string) => items.some((p) => p.id === productId);
  const removeFromWishlist = (productId: string) => setItems((prev) => prev.filter((p) => p.id !== productId));
  const clearWishlist = () => setItems([]);

  return (
    <WishlistContext.Provider value={{ items, toggleWishlist, isInWishlist, removeFromWishlist, clearWishlist, count: items.length }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider');
  return ctx;
};
