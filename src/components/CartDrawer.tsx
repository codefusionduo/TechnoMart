import React from 'react';
import { X, Minus, Plus, ShoppingBag } from 'lucide-react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, newQuantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onCheckout: () => void;
}

export function CartDrawer({ isOpen, onClose, cartItems, onUpdateQuantity, onRemoveItem, onCheckout }: CartDrawerProps) {
  const total = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 w-full sm:w-[400px] bg-[#111] border-l border-white/10 z-50 flex flex-col transform transition-transform duration-300 ease-in-out shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <ShoppingBag className="text-blue-500" size={24} />
            <h2 className="text-xl font-bold text-white tracking-tight">Your Cart</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-4">
              <ShoppingBag size={48} className="opacity-20" />
              <p>Your cart is empty.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {cartItems.map((item) => (
                <div key={item.product._id} className="flex gap-4">
                  <div className="w-20 h-20 bg-slate-800/50 rounded-xl overflow-hidden flex-shrink-0">
                    <img 
                      src={item.product.image} 
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 flex flex-col">
                    <div className="flex justify-between items-start">
                      <h3 className="text-sm font-bold text-white line-clamp-1">{item.product.name}</h3>
                      <button 
                        onClick={() => onRemoveItem(item.product._id)}
                        className="text-slate-500 hover:text-red-400 transition-colors"
                      >
                        <X size={16} />
                      </button>
                    </div>
                    <p className="text-blue-400 font-bold text-sm mt-1">
                      ${item.product.price.toFixed(2)}
                    </p>
                    <div className="mt-auto flex items-center gap-3">
                      <div className="flex items-center bg-black/50 rounded-lg border border-white/10 overflow-hidden">
                        <button 
                          onClick={() => onUpdateQuantity(item.product._id, item.quantity - 1)}
                          className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                          disabled={item.quantity <= 1}
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-8 text-center text-sm font-semibold text-white">
                          {item.quantity}
                        </span>
                        <button 
                          onClick={() => onUpdateQuantity(item.product._id, item.quantity + 1)}
                          className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="p-6 border-t border-white/10 bg-[#0A0A0A]">
            <div className="flex items-center justify-between mb-4">
              <span className="text-slate-400 font-medium">Subtotal</span>
              <span className="text-xl font-bold text-white">${total.toFixed(2)}</span>
            </div>
            <p className="text-xs text-slate-500 mb-6">Shipping and taxes calculated at checkout.</p>
            <button 
              onClick={onCheckout}
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-colors shadow-lg shadow-blue-900/20"
            >
              Checkout
            </button>
          </div>
        )}
      </div>
    </>
  );
}
