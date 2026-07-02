/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { Navbar } from './components/Navbar';
import { ProductCard } from './components/ProductCard';
import { AuthModal } from './components/AuthModal';
import { CartDrawer } from './components/CartDrawer';
import { AdminPanel } from './components/AdminPanel';
import { PrivacyPolicy, TermsOfService, Support } from './components/LegalPages';
import { CategoryFilter } from './components/CategoryFilter';
import { Product, User, AuthResponse, CartItem } from './types';
import { AlertCircle, ServerCrash, RefreshCw, ShoppingBag, ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';

export default function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [user, setUser] = useState<User | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  
  const [isAdminView, setIsAdminView] = useState(false);
  const [isPaymentView, setIsPaymentView] = useState(false);
  const [activePage, setActivePage] = useState<'home' | 'privacy' | 'terms' | 'support'>('home');
  const [sortOrder, setSortOrder] = useState<'default' | 'low-to-high' | 'high-to-low'>('default');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const handleCheckout = () => {
    if (!user) {
      setIsCartOpen(false);
      setIsAuthModalOpen(true);
    } else {
      setIsCartOpen(false);
      setIsPaymentView(true);
    }
  };

  useEffect(() => {
    // Check for saved user session
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        // Ignore parse error
      }
    }
    
    // Load cart from local storage
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (e) {
        // Ignore parse error
      }
    }
    
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/products');
      if (!res.ok) {
        throw new Error('Database connection failed. Did you configure MONGODB_URI in the backend?');
      }
      const data = await res.json();
      setProducts(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSeed = async () => {
    setIsSeeding(true);
    try {
      const res = await fetch('/api/products/seed', { method: 'POST' });
      if (res.ok) {
        fetchProducts();
      }
    } catch (err) {
      console.error('Failed to seed:', err);
    } finally {
      setIsSeeding(false);
    }
  };

  const handleAuthSuccess = (res: AuthResponse) => {
    setUser(res.user);
    localStorage.setItem('token', res.token);
    localStorage.setItem('user', JSON.stringify(res.user));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const handleAddToCart = (product: Product) => {
    setCartItems(prev => {
      const existingItem = prev.find(item => item.product._id === product._id);
      if (existingItem) {
        return prev.map(item => 
          item.product._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    setCartItems(prev => prev.map(item => 
      item.product._id === productId ? { ...item, quantity } : item
    ));
  };

  const handleRemoveItem = (productId: string) => {
    setCartItems(prev => prev.filter(item => item.product._id !== productId));
  };

  const cartItemsCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const categories = Array.from(new Set(products.map(p => p.category).filter(Boolean))) as string[];

  const filteredProducts = products.filter(product => 
    (selectedCategory === 'All' || product.category === selectedCategory) &&
    (product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (product.category && product.category.toLowerCase().includes(searchQuery.toLowerCase())))
  ).sort((a, b) => {
    if (sortOrder === 'low-to-high') {
      return a.price - b.price;
    } else if (sortOrder === 'high-to-low') {
      return b.price - a.price;
    }
    return 0; // 'default'
  });

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-slate-100 font-sans selection:bg-blue-900/50 flex flex-col overflow-x-hidden relative">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-blue-500 rounded-full filter blur-[100px] opacity-30 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-purple-500 rounded-full filter blur-[100px] opacity-30 animate-blob" style={{ animationDelay: '2s' }}></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full filter blur-[100px] opacity-30 animate-blob" style={{ animationDelay: '4s' }}></div>
      </div>
      
      {/* Content wrapper with z-index to stay above background */}
      <div className="relative z-10 flex flex-col min-h-screen">
      <Navbar 
        user={user} 
        onLoginClick={() => setIsAuthModalOpen(true)} 
        onLogout={handleLogout} 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        cartItemsCount={cartItemsCount}
        onCartClick={() => setIsCartOpen(true)}
        onAdminClick={() => setIsAdminView(true)}
      />
      
      {isAdminView ? (
        <AdminPanel 
          token={localStorage.getItem('token') || ''} 
          onClose={() => setIsAdminView(false)} 
          products={products}
          setProducts={setProducts}
        />
      ) : isPaymentView ? (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-[#0D0D0D]">
          <ShoppingBag className="text-blue-500 mb-6" size={64} />
          <h2 className="text-3xl font-bold text-white mb-4">Checkout</h2>
          <p className="text-slate-400 mb-8 max-w-md">
            You are logged in and ready to pay. Please proceed with the payment for your {cartItems.length} item(s) totaling ${cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0).toFixed(2)}.
          </p>
          <div className="flex gap-4">
            <button 
              onClick={() => setIsPaymentView(false)}
              className="px-6 py-3 border border-white/20 hover:bg-white/5 text-white rounded-lg font-bold transition-colors"
            >
              Back to Shop
            </button>
            <button 
              onClick={() => {
                alert('Payment successful!');
                setCartItems([]);
                setIsPaymentView(false);
              }}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition-colors shadow-lg shadow-blue-900/20"
            >
              Pay Now
            </button>
          </div>
        </div>
      ) : activePage !== 'home' ? (
        <div className="flex-1 max-w-4xl mx-auto px-8 py-20 w-full">
          <button 
            onClick={() => setActivePage('home')} 
            className="mb-8 flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors font-medium"
          >
            <ArrowLeft size={20} />
            Back to Shop
          </button>
          {activePage === 'privacy' && <PrivacyPolicy />}
          {activePage === 'terms' && <TermsOfService />}
          {activePage === 'support' && <Support />}
        </div>
      ) : (
        <>
          <main className="flex-1 flex flex-col">
            {/* Hero Section */}
        <section className="relative overflow-hidden border-b border-white/10 flex-1 flex items-center min-h-[600px]">
          <div className="max-w-7xl mx-auto px-8 py-20 flex flex-col lg:flex-row items-center relative z-10 w-full">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="w-full lg:w-1/2 z-10"
            >
              <span className="inline-block px-3 py-1 mb-4 border border-blue-500/50 text-blue-400 text-[10px] uppercase tracking-widest font-bold rounded">
                Featured Collection
              </span>
              <h1 className="text-5xl lg:text-7xl font-light leading-none mb-4 text-white">
                Galaxy <br className="hidden sm:block" />
                <span className="font-bold">Ecosystem</span>
              </h1>
              <p className="text-slate-400 text-lg mb-8 max-w-md">
                Experience the new era of mobile AI. Discover the latest smartphones and immersive earbuds.
              </p>
              <div className="flex gap-4">
                <motion.a 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  href="#products" 
                  className="px-8 py-4 bg-blue-600 text-white font-bold rounded-lg shadow-lg shadow-blue-900/20 hover:bg-blue-500 transition-colors"
                >
                  Shop Latest
                </motion.a>
                <motion.a 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  href="#products" 
                  className="px-8 py-4 border border-white/20 hover:bg-white/5 text-white rounded-lg font-bold transition-colors"
                >
                  Learn More
                </motion.a>
              </div>
            </motion.div>
            
            {/* Hero Image */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="hidden lg:flex w-full lg:w-1/2 justify-end mt-12 lg:mt-0 relative"
            >
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-900/20 blur-[120px] rounded-full"></div>
              <motion.img 
                animate={{ y: [0, -20, 0] }}
                transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                src="https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&q=80&w=1000" 
                alt="Smartphone" 
                className="w-80 h-[500px] object-cover rounded-[40px] border-[6px] border-slate-600 shadow-2xl relative z-10"
              />
            </motion.div>
          </div>
        </section>

        {/* Products Section */}
        <section id="products" className="px-8 py-16 lg:px-12 bg-[#0D0D0D] border-t border-white/5">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8">
              <h2 className="text-sm uppercase tracking-widest font-bold text-slate-500">Latest Ecosystem</h2>
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <CategoryFilter 
                  categories={categories}
                  selectedCategory={selectedCategory}
                  onSelectCategory={setSelectedCategory}
                />

                <div className="flex items-center gap-2">
                  <label htmlFor="price-filter" className="text-sm text-slate-400">Sort by:</label>
                  <select 
                    id="price-filter"
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value as 'default' | 'low-to-high' | 'high-to-low')}
                    className="bg-black/50 border border-white/10 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2 outline-none"
                  >
                    <option value="default">Default</option>
                    <option value="low-to-high">Price: Low to High</option>
                    <option value="high-to-low">Price: High to Low</option>
                  </select>
                </div>

                {!loading && !error && products.length === 0 && (
                  <button 
                    onClick={handleSeed}
                    disabled={isSeeding}
                    className="text-xs text-blue-500 hover:underline flex items-center gap-2 disabled:opacity-50"
                  >
                    <RefreshCw size={14} className={isSeeding ? "animate-spin" : ""} />
                    Seed Demo Data
                  </button>
                )}
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : error ? (
              <div className="bg-[#161616] rounded-2xl p-8 flex flex-col items-center text-center max-w-2xl mx-auto border border-red-900/50">
                <ServerCrash className="h-12 w-12 text-red-500 mb-4" />
                <h3 className="text-lg font-semibold text-red-400 mb-2">Could not load products</h3>
                <p className="text-red-300/80 mb-6">{error}</p>
                <div className="bg-[#0A0A0A] p-4 rounded-xl text-sm text-left w-full border border-white/5 text-slate-300">
                  <p className="font-mono text-slate-200 flex items-center gap-2 mb-2">
                    <AlertCircle size={16} className="text-orange-500"/>
                    <strong>Required:</strong> Configure MongoDB
                  </p>
                  <ol className="list-decimal pl-5 mt-2 text-slate-400 space-y-1">
                    <li>Open <strong>Settings &gt; Secrets</strong></li>
                    <li>Add <code className="bg-white/10 px-1.5 py-0.5 rounded text-white text-xs">MONGODB_URI</code></li>
                    <li>Restart the dev server</li>
                  </ol>
                </div>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-20 text-slate-500">
                {searchQuery ? 'No products match your search.' : 'No products found in the database.'}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map(product => (
                  <ProductCard key={product._id} product={product} onAddToCart={handleAddToCart} />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <footer className="px-8 lg:px-12 py-6 bg-[#0A0A0A] flex flex-col sm:flex-row justify-between items-center text-[10px] text-slate-600 border-t border-white/5 gap-4">
        <p>© 2026 Technomart Inc. Built with React & MongoDB.</p>
        <div className="flex gap-6 uppercase tracking-widest">
           <button onClick={() => setActivePage('privacy')} className="hover:text-slate-400 transition-colors uppercase tracking-widest">Privacy</button>
           <button onClick={() => setActivePage('terms')} className="hover:text-slate-400 transition-colors uppercase tracking-widest">Terms</button>
           <button onClick={() => setActivePage('support')} className="hover:text-slate-400 transition-colors uppercase tracking-widest">Support</button>
        </div>
      </footer>
      </>
      )}

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onCheckout={handleCheckout}
      />
      </div>
    </div>
  );
}
