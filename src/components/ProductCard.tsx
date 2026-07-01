import React, { useState } from 'react';
import { Product } from '../types';
import { ShoppingCart, Heart } from 'lucide-react';
import { motion } from 'motion/react';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const [isLiked, setIsLiked] = useState(false);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5 }}
      className="bg-[#161616] p-5 rounded-2xl border border-white/5 flex flex-col group hover:border-white/10 transition-colors"
    >
      <div className="w-full aspect-square bg-slate-800/50 rounded-xl mb-4 overflow-hidden relative">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-2 left-2">
          <span className="px-2 py-1 text-[10px] font-bold bg-blue-500/20 text-blue-400 rounded uppercase tracking-wider">
            {product.category}
          </span>
        </div>
        <div className="absolute top-2 right-2">
          <button 
            onClick={() => setIsLiked(!isLiked)}
            className="p-2 rounded-full bg-black/40 hover:bg-black/60 transition-colors backdrop-blur-sm"
          >
            <Heart 
              size={16} 
              className={`transition-colors ${isLiked ? 'fill-red-500 text-red-500' : 'text-white'}`} 
            />
          </button>
        </div>
      </div>
      <div className="flex flex-col flex-1">
        <h3 className="font-bold text-white mb-1 truncate">
          {product.name}
        </h3>
        <p className="text-xs text-slate-500 mb-4 italic line-clamp-2">
          {product.description}
        </p>
        <div className="mt-auto flex items-center justify-between">
          <span className="text-blue-400 font-bold text-lg">
            ${product.price.toFixed(2)}
          </span>
          <div className="flex gap-2">
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onAddToCart(product)}
              className="p-2 bg-slate-800 text-slate-300 rounded-lg hover:bg-blue-600 hover:text-white transition-colors"
            >
              <ShoppingCart size={18} />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
