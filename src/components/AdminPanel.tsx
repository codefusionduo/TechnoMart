import React, { useState, useEffect } from 'react';
import { Product, User } from '../types';
import { Edit2, Trash2, X, Plus, Save } from 'lucide-react';

interface AdminPanelProps {
  token: string;
  onClose: () => void;
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
}

export function AdminPanel({ token, onClose, products, setProducts }: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<'users' | 'products'>('products');
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (activeTab === 'users') {
      fetchUsers();
    }
  }, [activeTab]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) setUsers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    
    const isNew = !editingProduct._id;
    const url = isNew ? '/api/admin/products' : `/api/admin/products/${editingProduct._id}`;
    const method = isNew ? 'POST' : 'PUT';
    
    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(editingProduct)
      });
      
      const data = await res.json();
      if (res.ok) {
        if (isNew) {
          setProducts([...products, data]);
        } else {
          setProducts(products.map(p => p._id === data._id ? data : p));
        }
        setEditingProduct(null);
      } else {
        alert(data.error);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddProduct = () => {
    setEditingProduct({
      _id: '',
      name: '',
      description: '',
      price: 0,
      image: '',
      category: 'phone'
    } as any);
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setProducts(products.filter(p => p._id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex-1 bg-[#0A0A0A] p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
          <button onClick={onClose} className="px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700">
            Exit Admin
          </button>
        </div>
        
        <div className="flex justify-between items-center mb-8">
          <div className="flex gap-4">
            <button 
              onClick={() => setActiveTab('products')}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${activeTab === 'products' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'}`}
            >
              Products
            </button>
            <button 
              onClick={() => setActiveTab('users')}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${activeTab === 'users' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'}`}
            >
              Users
            </button>
          </div>
          {activeTab === 'products' && !editingProduct && (
            <button 
              onClick={handleAddProduct}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2 hover:bg-blue-500"
            >
              <Plus size={16} /> Add Product
            </button>
          )}
        </div>

        {activeTab === 'users' && (
          <div className="bg-[#111] border border-white/10 rounded-xl overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-[#1A1A1A] text-slate-400 text-sm">
                <tr>
                  <th className="p-4 font-semibold">Name</th>
                  <th className="p-4 font-semibold">Email</th>
                  <th className="p-4 font-semibold">Verified</th>
                  <th className="p-4 font-semibold">ID</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {loading ? (
                  <tr><td colSpan={4} className="p-4 text-center text-slate-500">Loading users...</td></tr>
                ) : users.map(u => (
                  <tr key={u._id} className="text-slate-300">
                    <td className="p-4">{u.name}</td>
                    <td className="p-4">{u.email}</td>
                    <td className="p-4">{u.isVerified ? 'Yes' : 'No'}</td>
                    <td className="p-4 font-mono text-xs">{u._id}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'products' && (
          <div className="space-y-6">
            {editingProduct && (
              <div className="bg-[#161616] p-6 rounded-xl border border-white/10 mb-8">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-white">{editingProduct._id ? 'Edit Product' : 'Add Product'}</h2>
                  <button onClick={() => setEditingProduct(null)} className="text-slate-400 hover:text-white">
                    <X size={20} />
                  </button>
                </div>
                <form onSubmit={handleUpdateProduct} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-slate-400 mb-1">Name</label>
                    <input type="text" value={editingProduct.name} onChange={e => setEditingProduct({...editingProduct, name: e.target.value})} className="w-full bg-[#0A0A0A] border border-white/10 rounded-lg p-2 text-white" />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-400 mb-1">Price</label>
                    <input type="number" step="0.01" value={editingProduct.price} onChange={e => setEditingProduct({...editingProduct, price: parseFloat(e.target.value)})} className="w-full bg-[#0A0A0A] border border-white/10 rounded-lg p-2 text-white" />
                  </div>
                  <div className="md:col-span-1">
                    <label className="block text-sm text-slate-400 mb-1">Image URL</label>
                    <input type="text" value={editingProduct.image} onChange={e => setEditingProduct({...editingProduct, image: e.target.value})} className="w-full bg-[#0A0A0A] border border-white/10 rounded-lg p-2 text-white" />
                  </div>
                  <div className="md:col-span-1">
                    <label className="block text-sm text-slate-400 mb-1">Category</label>
                    <select value={editingProduct.category} onChange={e => setEditingProduct({...editingProduct, category: e.target.value})} className="w-full bg-[#0A0A0A] border border-white/10 rounded-lg p-2 text-white">
                      <option value="phone">Phone</option>
                      <option value="earbud">Earbud</option>
                      <option value="tablet">Tablet</option>
                      <option value="accessory">Accessory</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm text-slate-400 mb-1">Description</label>
                    <textarea value={editingProduct.description} onChange={e => setEditingProduct({...editingProduct, description: e.target.value})} className="w-full bg-[#0A0A0A] border border-white/10 rounded-lg p-2 text-white h-24" />
                  </div>
                  <div className="md:col-span-2 flex justify-end gap-3 mt-4">
                    <button type="button" onClick={() => setEditingProduct(null)} className="px-4 py-2 bg-slate-800 text-white rounded-lg">Cancel</button>
                    <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2">
                      <Save size={16} /> Save Changes
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map(product => (
                <div key={product._id} className="bg-[#111] p-4 rounded-xl border border-white/10 flex flex-col">
                  <div className="flex gap-4 mb-4">
                    <img src={product.image} alt={product.name} className="w-20 h-20 object-cover rounded-lg bg-slate-800" />
                    <div>
                      <h3 className="font-bold text-white text-sm line-clamp-2">{product.name}</h3>
                      <p className="text-blue-400 font-bold mt-1">${product.price.toFixed(2)}</p>
                    </div>
                  </div>
                  <div className="mt-auto flex justify-end gap-2 pt-4 border-t border-white/5">
                    <button onClick={() => setEditingProduct(product)} className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => handleDeleteProduct(product._id)} className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
