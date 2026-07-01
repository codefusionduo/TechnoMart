import React from 'react';
import { ShoppingBag, LogIn, LogOut, User as UserIcon, Search } from 'lucide-react';
import { User } from '../types';

interface NavbarProps {
  user: User | null;
  onLogout: () => void;
  onLoginClick: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  cartItemsCount: number;
  onCartClick: () => void;
  onAdminClick: () => void;
}

export function Navbar({ user, onLogout, onLoginClick, searchQuery, onSearchChange, cartItemsCount, onCartClick, onAdminClick }: NavbarProps) {
  return (
    <nav className="sticky top-0 z-50 bg-[#0A0A0A]/90 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2 cursor-pointer">
            <div className="w-8 h-8 bg-blue-600 rounded-sm flex items-center justify-center font-bold text-lg italic text-white">T</div>
            <span className="text-xl font-bold tracking-tighter uppercase text-white">
              Technomart
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
            <button onClick={() => { onSearchChange('phone'); document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' }); }} className={`${searchQuery === 'phone' ? 'text-blue-500' : 'hover:text-white'} transition-colors`}>Smartphones</button>
            <button onClick={() => { onSearchChange('earbud'); document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' }); }} className={`${searchQuery === 'earbud' ? 'text-blue-500' : 'hover:text-white'} transition-colors`}>Audio</button>
            <button onClick={() => { onSearchChange('tablet'); document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' }); }} className={`${searchQuery === 'tablet' ? 'text-blue-500' : 'hover:text-white'} transition-colors`}>Tablets</button>
          </div>

          <div className="hidden md:flex items-center flex-1 max-w-sm mx-8 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-slate-500" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="block w-full bg-[#1A1A1A] border border-white/10 rounded-full py-1.5 pl-9 pr-3 text-sm placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all text-white"
              placeholder="Search products..."
            />
          </div>
            
          <div className="flex items-center gap-4">
            <button
              onClick={onCartClick}
              className="relative p-2 text-slate-400 hover:text-white transition-colors"
            >
              <ShoppingBag size={20} />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 text-[10px] font-bold text-white bg-blue-600 rounded-full border-2 border-[#0A0A0A]">
                  {cartItemsCount}
                </span>
              )}
            </button>
            
            {user ? (
              <div className="flex items-center gap-4">
                {(user.email === 'codefusionduo@gmail.com' || user.email === 'aahanamagar267@gmail.com') && (
                  <button 
                    onClick={onAdminClick} 
                    className="text-sm font-bold text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    Admin Panel
                  </button>
                )}
                <div className="flex items-center gap-2 text-slate-300">
                  <UserIcon size={18} />
                  <span className="font-medium text-sm">{user.name}</span>
                </div>
                <button
                  onClick={onLogout}
                  className="flex items-center gap-2 text-slate-400 hover:text-red-400 transition-colors"
                >
                  <LogOut size={18} />
                  <span className="text-sm font-semibold hidden sm:inline">Logout</span>
                </button>
              </div>
            ) : (
              <button
                onClick={onLoginClick}
                className="px-5 py-2 bg-white text-black text-sm font-bold rounded-full hover:bg-blue-500 hover:text-white transition-all hidden sm:block"
              >
                Register
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
