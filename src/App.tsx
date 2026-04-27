/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShoppingBag, 
  User, 
  Menu, 
  X, 
  ArrowRight, 
  ShieldCheck, 
  LayoutDashboard,
  LogOut,
  ChevronRight,
  Star,
  Search,
  Filter,
  Plus,
  Trash2,
  Package,
  CreditCard,
  TrendingUp,
  Users,
  CheckCircle2,
  Clock,
  AlertCircle
} from 'lucide-react';
import { cn } from './lib/utils';
import { Product, Order, Stats } from './types';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';

export default function App() {
  const [view, setView] = useState<'customer' | 'admin'>('customer');
  const [activeTab, setActiveTab] = useState<'home' | 'shop' | 'about' | 'contact'>('home');
  const [adminTab, setAdminTab] = useState<'dashboard' | 'products' | 'orders' | 'users'>('dashboard');
  const [cart, setCart] = useState<{product: Product, quantity: number}[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<Stats>({ totalSales: 0, orderCount: 0, productCount: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [prodRes, orderRes, statRes] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/orders'),
        fetch('/api/stats')
      ]);
      const [prods, ords, stts] = await Promise.all([
        prodRes.json(),
        orderRes.json(),
        statRes.json()
      ]);
      setProducts(prods);
      setOrders(ords);
      setStats(stts);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setIsLoading(false);
    }
  };

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.product.id !== id));
  };

  const updateOrder = async (id: string, status: string) => {
    await fetch(`/api/orders/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    fetchData();
  };

  const handleCheckout = async () => {
    const total = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    const orderData = {
      items: cart.map(i => ({ productId: i.product.id, name: i.product.name, price: i.product.price, quantity: i.quantity })),
      total,
      userId: 'test-user',
      customerName: 'Premium Customer',
      customerEmail: 'customer@example.com'
    };

    await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData)
    });

    setCart([]);
    setIsCartOpen(false);
    alert("Order placed successfully! Welcome to the vault.");
    fetchData();
  };

  return (
    <div className="min-h-screen text-neutral-100 selection:bg-gold/30">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-bg-deep/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-12">
            <h1 
              className="text-2xl font-serif tracking-tighter italic cursor-pointer text-gold"
              onClick={() => { setView('customer'); setActiveTab('home'); }}
            >
              AURELIAN
            </h1>
            <div className="hidden md:flex gap-8 items-center text-[10px] uppercase tracking-luxury font-medium opacity-40">
              <button 
                onClick={() => setActiveTab('home')}
                className={cn("hover:text-gold transition-colors", activeTab === 'home' && "text-gold opacity-100")}
              >
                Entrance
              </button>
              <button 
                onClick={() => setActiveTab('about')}
                className={cn("hover:text-gold transition-colors", activeTab === 'about' && "text-gold opacity-100")}
              >
                Heritage
              </button>
              <button 
                onClick={() => setActiveTab('shop')}
                className={cn("hover:text-gold transition-colors", activeTab === 'shop' && "text-gold opacity-100")}
              >
                Collection
              </button>
              <button 
                onClick={() => setActiveTab('contact')}
                className={cn("hover:text-gold transition-colors", activeTab === 'contact' && "text-gold opacity-100")}
              >
                Concierge
              </button>
              <button 
                onClick={() => setView('admin')}
                className="hover:text-gold transition-colors"
              >
                Admin Privileges
              </button>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <button 
              onClick={() => setView(view === 'admin' ? 'customer' : 'admin')}
              className="p-2 hover:bg-white/5 rounded-full transition-colors text-white/30 hover:text-gold"
            >
              {view === 'admin' ? <LogOut size={18} /> : <ShieldCheck size={18} />}
            </button>
            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 hover:bg-white/5 rounded-full transition-colors text-white/50"
            >
              <ShoppingBag size={18} />
              {cart.length > 0 && (
                <span className="absolute top-1 right-1 w-3 h-3 bg-gold text-black text-[8px] font-bold rounded-full flex items-center justify-center">
                  {cart.reduce((a, b) => a + b.quantity, 0)}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="pt-20">
        <AnimatePresence mode="wait">
          {view === 'customer' ? (
            <motion.div
              key="customer"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {activeTab === 'home' && <HomeHero onShop={() => setActiveTab('shop')} />}
              {activeTab === 'about' && <AboutPage />}
              {activeTab === 'contact' && <ContactPage />}
              {activeTab === 'shop' && (
                <div className="max-w-7xl mx-auto px-6 py-20">
                  <header className="mb-16">
                    <h2 className="text-5xl font-serif mb-4 italic">The Vault</h2>
                    <p className="text-neutral-500 uppercase tracking-widest text-xs">Curated Excellence for the Discerning</p>
                  </header>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                    {products.map(product => (
                      <div key={product.id}>
                        <ProductCard product={product} onAdd={() => addToCart(product)} />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          ) : (
            <AdminPanel 
              activeTab={adminTab} 
              setActiveTab={setAdminTab} 
              stats={stats} 
              products={products}
              orders={orders}
              updateOrder={updateOrder}
              refreshData={fetchData}
            />
          )}
        </AnimatePresence>
      </main>

      {/* Cart Drawer */}
      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        cart={cart}
        onRemove={removeFromCart}
        onCheckout={handleCheckout}
      />

      {/* Footer */}
      <footer className="border-t border-white/5 py-20 bg-neutral-950 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-2">
            <h2 className="text-2xl font-serif text-gold mb-6 uppercase tracking-widest">LuxeVault</h2>
            <p className="text-neutral-500 max-w-sm leading-relaxed">
              Redefining luxury e-commerce with exclusive collections and a commitment to timeless elegance. 
              Join the inner circle for early access to limited drops.
            </p>
          </div>
          <div>
            <h3 className="text-xs uppercase tracking-widest font-bold mb-6 text-white/40">Company</h3>
            <ul className="space-y-4 text-sm text-neutral-500">
              <li className="hover:text-gold cursor-pointer transition-colors text-gold">About Us</li>
              <li className="hover:text-gold cursor-pointer transition-colors">Concierge</li>
              <li className="hover:text-gold cursor-pointer transition-colors">Shipping</li>
            </ul>
          </div>
          <div>
            <h3 className="text-xs uppercase tracking-widest font-bold mb-6 text-white/40">Connect</h3>
            <ul className="space-y-4 text-sm text-neutral-500">
              <li className="hover:text-gold cursor-pointer transition-colors">Instagram</li>
              <li className="hover:text-gold cursor-pointer transition-colors">WhatsApp</li>
              <li className="hover:text-gold cursor-pointer transition-colors">Private Viewing</li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-[10px] uppercase tracking-[0.2em] text-neutral-600">
          <p>© 2026 LuxeVault Co. All Rights Reserved.</p>
          <div className="flex gap-8 mt-4 md:mt-0">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

function HomeHero({ onShop }: { onShop: () => void }) {
  return (
    <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=2000" 
          className="w-full h-full object-cover opacity-20 filter grayscale"
          alt="Luxury Workspace"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-bg-deep via-bg-deep/40 to-transparent" />
      </div>
      
      <div className="relative z-10 text-center max-w-4xl px-6">
        <motion.span 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-gold uppercase tracking-luxury text-[10px] font-bold mb-8 block"
        >
          Curated Excellence • Est. 2026
        </motion.span>
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-6xl md:text-8xl font-serif italic mb-8 leading-[1.1] tracking-tighter"
        >
          The Art of <br /> <span className="text-transparent border-b border-gold/30 bg-clip-text bg-gradient-to-r from-gold to-gold-light italic">Refined Acquisition</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-neutral-500 text-lg mb-12 max-w-2xl mx-auto font-light leading-relaxed"
        >
          A sanctuary for rare assets, bespoke craftsmanship, and the lifestyle of the modern estate.
        </motion.p>
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8 }}
          onClick={onShop}
          className="group relative px-12 py-5 bg-gold text-black uppercase tracking-widest text-[10px] font-bold hover:bg-gold-light transition-all gold-glow"
        >
          Access Collection
          <ArrowRight className="inline ml-2 group-hover:translate-x-2 transition-transform" size={14} />
        </motion.button>
      </div>
    </section>
  );
}

function ProductCard({ product, onAdd }: { product: Product, onAdd: () => void }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group"
    >
      <div className="relative aspect-[3/4] mb-6 overflow-hidden bg-neutral-900 border border-white/5">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <button 
            onClick={onAdd}
            className="px-8 py-3 bg-white text-black text-xs uppercase tracking-widest font-bold translate-y-4 group-hover:translate-y-0 transition-transform"
          >
            Add to Case
          </button>
        </div>
        <div className="absolute top-4 left-4">
          <span className="text-[10px] uppercase tracking-widest bg-black/60 backdrop-blur-md text-gold px-3 py-1 border border-gold/30">
            {product.category}
          </span>
        </div>
      </div>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-serif group-hover:text-gold transition-colors mb-1">{product.name}</h3>
          <p className="text-neutral-500 text-sm italic">{product.description.slice(0, 45)}...</p>
        </div>
        <span className="font-serif text-lg text-gold-light">${product.price.toLocaleString()}</span>
      </div>
    </motion.div>
  );
}

function CartDrawer({ isOpen, onClose, cart, onRemove, onCheckout }: any) {
  const total = cart.reduce((sum: number, item: any) => sum + item.product.price * item.quantity, 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60]"
          />
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-neutral-950 border-l border-white/10 z-[70] p-8 flex flex-col"
          >
            <div className="flex items-center justify-between mb-12">
              <h2 className="text-2xl font-serif italic flex items-center gap-3">
                <ShoppingBag className="text-gold" /> The Collection
              </h2>
              <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full"><X size={20} /></button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-8 pr-4">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-neutral-500 italic opacity-40">
                  <Package size={48} className="mb-4" />
                  <p>The vault is currently empty</p>
                </div>
              ) : (
                cart.map(({product, quantity}: any) => (
                  <div key={product.id} className="flex gap-4">
                    <div className="w-20 h-24 bg-neutral-900 border border-white/5 overflow-hidden">
                      <img src={product.image} className="w-full h-full object-cover" alt="" referrerPolicy="no-referrer" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between font-serif mb-1 uppercase text-xs tracking-widest opacity-60">
                         <span>{product.name}</span>
                         <button onClick={() => onRemove(product.id)} className="text-neutral-500 hover:text-red-500"><Trash2 size={14} /></button>
                      </div>
                      <div className="flex justify-between items-end">
                        <span className="text-xs text-neutral-500">Qty: {quantity}</span>
                        <span className="text-gold font-serif">${(product.price * quantity).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="pt-8 border-t border-white/5 space-y-6 mt-auto">
                <div className="flex justify-between items-center font-serif text-xl">
                  <span className="text-neutral-500 uppercase text-xs tracking-[0.3em]">Total Valuation</span>
                  <span className="text-gold-light">${total.toLocaleString()}</span>
                </div>
                <button 
                  onClick={onCheckout}
                  className="w-full bg-gold text-black py-4 uppercase tracking-[0.2em] text-xs font-bold hover:bg-gold-light transition-colors gold-glow"
                >
                  Secure Acquisition
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
function AdminPanel({ activeTab, setActiveTab, stats, products, orders, updateOrder, refreshData }: any) {
  const [isAddingAsset, setIsAddingAsset] = useState(false);
  const [newAsset, setNewAsset] = useState({ name: '', price: '', description: '', category: '', image: '', stock: '' });

  const chartData = [
    { name: 'Mon', sales: 4000 },
    { name: 'Tue', sales: 7000 },
    { name: 'Wed', sales: 5000 },
    { name: 'Thu', sales: 12000 },
    { name: 'Fri', sales: 9000 },
    { name: 'Sat', sales: 15000 },
    { name: 'Sun', sales: 18000 },
  ];

  return (
    <div className="max-w-7xl mx-auto flex flex-col lg:flex-row min-h-[calc(100vh-80px)] border-x border-white/5">
      {/* Sidebar - Matching aurelian reference */}
      <aside className="w-full lg:w-64 bg-bg-surface border-r border-white/5 flex flex-col pt-12">
        <div className="px-8 mb-12">
          <h2 className="text-2xl font-serif italic text-gold tracking-tighter">AURELIAN</h2>
          <p className="text-[10px] uppercase tracking-luxury text-white/40 mt-1">Admin Console</p>
        </div>
        
        <nav className="flex-1 px-4 space-y-2">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
            { id: 'products', label: 'Product Catalog', icon: Package },
            { id: 'orders', label: 'Order Management', icon: CreditCard },
            { id: 'users', label: 'Client Relations', icon: Users },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all",
                activeTab === item.id 
                  ? "bg-gold/10 text-gold font-medium" 
                  : "text-white/40 hover:bg-white/5"
              )}
            >
              <div className={cn("w-1.5 h-1.5 rounded-full", activeTab === item.id ? "bg-gold" : "bg-transparent")} />
              <span className="text-sm tracking-wide">{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* Main content area */}
      <div className="flex-1 p-10 flex flex-col bg-bg-deep">
        {activeTab === 'dashboard' && (
          <div className="space-y-10">
            <header className="flex justify-between items-end mb-4">
              <div>
                <p className="text-[11px] uppercase tracking-[0.2em] text-gold mb-2">Estate Performance</p>
                <h2 className="text-4xl font-serif text-white">Overview Portfolio</h2>
              </div>
              <div className="flex space-x-4">
                <button className="px-6 py-2 border border-gold/30 text-gold text-[10px] uppercase tracking-widest hover:bg-gold/10 transition-colors">Export PDF</button>
                <button className="px-6 py-2 bg-gold text-black text-[10px] font-bold uppercase tracking-widest">Add Asset</button>
              </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { label: 'Monthly Gross Revenue', value: `$${stats.totalSales.toLocaleString()}`, icon: TrendingUp, trend: '+12.4% From last month', trendColor: 'text-green-500' },
                { label: 'Total Active Orders', value: stats.orderCount, icon: ShoppingBag, trend: `${orders.filter((o:any) => o.status === 'pending').length} require processing`, trendColor: 'text-gold' },
                { label: 'Customer Loyalty Rate', value: '78.2%', icon: Users, trend: 'Averaged across 14k users', trendColor: 'text-white/20' },
              ].map((stat, i) => (
                <div key={i} className="bg-bg-surface p-6 border border-white/5">
                  <p className="text-[10px] uppercase tracking-luxury text-white/40 mb-1">{stat.label}</p>
                  <p className="text-3xl font-serif text-white">{stat.value}</p>
                  <p className={cn("text-[10px] mt-2", stat.trendColor)}>{stat.trend}</p>
                </div>
              ))}
            </div>

            <div className="bg-bg-surface border border-white/5 flex flex-col overflow-hidden">
               <div className="p-6 border-b border-white/5 flex justify-between items-center">
                  <h3 className="text-sm uppercase tracking-luxury font-semibold">Visual Trajectory</h3>
               </div>
               <div className="p-6 h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                        <defs>
                          <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#C5A059" stopOpacity={0.2}/>
                            <stop offset="95%" stopColor="#C5A059" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                        <XAxis dataKey="name" stroke="#444" fontSize={10} axisLine={false} tickLine={false} />
                        <YAxis stroke="#444" fontSize={10} axisLine={false} tickLine={false} />
                        <Tooltip contentStyle={{ backgroundColor: '#0F0F0F', border: '1px solid rgba(255,255,255,0.05)', fontSize: '12px' }} />
                        <Area type="monotone" dataKey="sales" stroke="#C5A059" fill="url(#colorSales)" strokeWidth={1.5} />
                    </AreaChart>
                  </ResponsiveContainer>
               </div>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="bg-bg-surface border border-white/5 flex flex-col overflow-hidden">
             <div className="p-6 border-b border-white/5 flex justify-between items-center">
                <h3 className="text-xs uppercase tracking-luxury font-semibold">Recent Luxury Transactions</h3>
                <span className="text-[10px] text-white/40 cursor-pointer hover:text-white uppercase tracking-widest">View Full Ledger →</span>
             </div>
             <table className="w-full text-left border-collapse">
                <thead className="text-[10px] uppercase tracking-[0.2em] text-white/30 border-b border-white/5">
                  <tr className="bg-white/[0.02]">
                    <th className="px-6 py-4">Order ID</th>
                    <th className="px-6 py-4">Client Name</th>
                    <th className="px-6 py-4 text-right">Valuation</th>
                    <th className="px-6 py-4 text-center">Status</th>
                    <th className="px-6 py-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="text-sm text-white/70">
                  {orders.map((order: any) => (
                    <tr key={order.id} className="border-b border-white/5 hover:bg-white/[0.01]">
                      <td className="px-6 py-4 font-mono text-xs">{order.id}</td>
                      <td className="px-6 py-4">{order.customerName}</td>
                      <td className="px-6 py-4 text-right text-white">${order.total.toLocaleString()}</td>
                      <td className="px-6 py-4 text-center">
                        <span className={cn(
                          "px-3 py-1 text-[10px] uppercase tracking-wider rounded-full",
                          order.status === 'shipped' && "bg-blue-500/10 text-blue-500",
                          order.status === 'delivered' && "bg-green-500/10 text-green-500",
                          order.status === 'pending' && "bg-gold/10 text-gold",
                          order.status === 'cancelled' && "bg-red-500/10 text-red-500",
                        )}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                         <div className="flex gap-2 justify-end">
                            <button onClick={() => updateOrder(order.id, 'shipped')} className="p-1 text-white/20 hover:text-gold transition-colors"><Clock size={14}/></button>
                            <button onClick={() => updateOrder(order.id, 'delivered')} className="p-1 text-white/20 hover:text-green-500 transition-colors"><CheckCircle2 size={14}/></button>
                         </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
             </table>
          </div>
        )}

        {activeTab === 'products' && (
           <div className="space-y-6">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-serif italic text-white">Vault Inventory</h2>
                <button 
                  onClick={() => setIsAddingAsset(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-gold text-black text-[10px] font-bold uppercase tracking-widest hover:bg-gold-light transition-colors"
                >
                  <Plus size={14}/> Curator's Addition
                </button>
              </div>

              {isAddingAsset && (
                <div className="bg-bg-surface border border-white/5 p-6 mb-8 animate-in fade-in slide-in-from-top-4">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-sm uppercase tracking-luxury font-semibold text-gold">New Acquisition</h3>
                    <button onClick={() => setIsAddingAsset(false)} className="text-white/40 hover:text-white"><X size={16} /></button>
                  </div>
                  <form 
                    className="space-y-6"
                    onSubmit={async (e) => {
                      e.preventDefault();
                      await fetch('/api/products', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          ...newAsset,
                          price: Number(newAsset.price) || 0,
                          stock: Number(newAsset.stock) || 0
                        })
                      });
                      setIsAddingAsset(false);
                      setNewAsset({ name: '', price: '', description: '', category: '', image: '', stock: '' });
                      refreshData();
                    }}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest text-white/40">Asset Name</label>
                        <input type="text" required value={newAsset.name} onChange={e => setNewAsset({...newAsset, name: e.target.value})} className="w-full bg-black/20 border-b border-white/10 p-2 text-sm focus:outline-none focus:border-gold text-white" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest text-white/40">Valuation ($)</label>
                        <input type="number" required value={newAsset.price} onChange={e => setNewAsset({...newAsset, price: e.target.value})} className="w-full bg-black/20 border-b border-white/10 p-2 text-sm focus:outline-none focus:border-gold text-white" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest text-white/40">Category</label>
                        <input type="text" required value={newAsset.category} onChange={e => setNewAsset({...newAsset, category: e.target.value})} className="w-full bg-black/20 border-b border-white/10 p-2 text-sm focus:outline-none focus:border-gold text-white" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest text-white/40">Stock Quantity</label>
                        <input type="number" required value={newAsset.stock} onChange={e => setNewAsset({...newAsset, stock: e.target.value})} className="w-full bg-black/20 border-b border-white/10 p-2 text-sm focus:outline-none focus:border-gold text-white" />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <label className="text-[10px] uppercase tracking-widest text-white/40">Image URL</label>
                        <input type="url" required value={newAsset.image} onChange={e => setNewAsset({...newAsset, image: e.target.value})} className="w-full bg-black/20 border-b border-white/10 p-2 text-sm focus:outline-none focus:border-gold text-white" />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <label className="text-[10px] uppercase tracking-widest text-white/40">Description</label>
                        <textarea required value={newAsset.description} onChange={e => setNewAsset({...newAsset, description: e.target.value})} rows={3} className="w-full bg-black/20 border-b border-white/10 p-2 text-sm focus:outline-none focus:border-gold text-white resize-none"></textarea>
                      </div>
                    </div>
                    <div className="flex justify-end gap-4 pt-4">
                      <button type="button" onClick={() => setIsAddingAsset(false)} className="px-6 py-2 border border-white/10 text-white/60 text-[10px] uppercase tracking-widest hover:bg-white/5 transition-colors">Cancel</button>
                      <button type="submit" className="px-6 py-2 bg-gold text-black text-[10px] font-bold uppercase tracking-widest hover:bg-gold-light transition-colors">Confirm Addition</button>
                    </div>
                  </form>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {products.map((p: any) => (
                  <div key={p.id} className="flex gap-4 p-4 bg-bg-surface border border-white/5 group relative overflow-hidden">
                    <img src={p.image} className="w-20 h-24 object-cover flex-shrink-0 grayscale group-hover:grayscale-0 transition-all duration-500" alt="" referrerPolicy="no-referrer" />
                    <div>
                      <h4 className="font-serif text-lg text-gold-light mb-1">{p.name}</h4>
                      <p className="text-white/40 text-[10px] uppercase tracking-luxury mb-2">{p.category}</p>
                      <div className="flex gap-4 items-center">
                        <span className="text-sm font-bold text-white">${p.price.toLocaleString()}</span>
                        <span className="text-[10px] uppercase tracking-widest text-white/20">Stk: {p.stock}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
           </div>
        )}

        {activeTab === 'users' && (
          <div className="h-full flex flex-col items-center justify-center text-white/20 italic">
             <Users size={64} className="mb-4 opacity-5" />
             <p className="uppercase tracking-[0.3em] text-[10px]">Accessing restricted client directories...</p>
          </div>
        )}
      </div>
    </div>
  );
}

function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-20 animate-in fade-in duration-1000">
      <header className="mb-20 text-center max-w-3xl mx-auto">
        <h2 className="text-5xl font-serif mb-6 italic">Our Heritage</h2>
        <p className="text-neutral-400 leading-relaxed">
          Founded in the pursuit of absolute perfection, Aurelian curates only the most exceptional
          artifacts, jewelry, and bespoke fashion. Every acquisition is a testament to timeless elegance.
        </p>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-20 items-center">
        <div>
          <img 
            src="https://images.unsplash.com/photo-1579547944212-c4f4961a8dd8?auto=format&fit=crop&q=80&w=1000" 
            className="w-full h-[600px] object-cover grayscale hover:grayscale-0 transition-all duration-700"
            alt="Craftsmanship" 
            referrerPolicy="no-referrer" 
          />
        </div>
        <div className="space-y-8">
          <div>
            <h3 className="text-sm uppercase tracking-[0.3em] text-gold mb-2">The Philosophy</h3>
            <h4 className="text-3xl font-serif italic mb-4">Beyond Commerce</h4>
            <p className="text-neutral-500 font-light leading-relaxed">
              We do not merely sell objects; we are the custodians of history, craftsmanship, and unparalleled luxury.
              Each item in our vault has been meticulously selected to represent the pinnacle of human creation.
            </p>
          </div>
          <div>
            <h3 className="text-sm uppercase tracking-[0.3em] text-gold mb-2">The Exclusivity</h3>
            <h4 className="text-3xl font-serif italic mb-4">A Private Sanctum</h4>
            <p className="text-neutral-500 font-light leading-relaxed">
              Access to our full catalog is reserved for our esteemed clientele. We believe true luxury 
              is intimate, personal, and profoundly exclusive.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ContactPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-20 animate-in fade-in duration-1000">
      <header className="mb-16 text-center">
        <h2 className="text-5xl font-serif mb-6 italic">The Concierge</h2>
        <p className="text-neutral-400 leading-relaxed uppercase text-[10px] tracking-widest max-w-xl mx-auto">
          Private viewings and bespoke inquiries are handled with the utmost discretion.
        </p>
      </header>
      <div className="bg-bg-surface border border-white/5 p-10 md:p-16">
        <form className="space-y-8" onSubmit={(e) => { e.preventDefault(); alert('Message sent exclusively to our Concierge desk.'); }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-luxury text-gold">Given Name</label>
              <input type="text" className="w-full bg-black/40 border-b border-white/10 p-3 text-sm focus:outline-none focus:border-gold transition-colors text-white" required />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-luxury text-gold">Surname</label>
              <input type="text" className="w-full bg-black/40 border-b border-white/10 p-3 text-sm focus:outline-none focus:border-gold transition-colors text-white" required />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-luxury text-gold">Direct Correspondence (Email)</label>
            <input type="email" className="w-full bg-black/40 border-b border-white/10 p-3 text-sm focus:outline-none focus:border-gold transition-colors text-white" required />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-luxury text-gold">Nature of Inquiry</label>
            <textarea rows={4} className="w-full bg-black/40 border-b border-white/10 p-3 text-sm focus:outline-none focus:border-gold transition-colors text-white resize-none" required></textarea>
          </div>
          <button type="submit" className="px-10 py-4 bg-gold text-black text-[10px] font-bold uppercase tracking-widest hover:bg-gold-light transition-colors w-full">
            Dispatch Communication
          </button>
        </form>
      </div>
    </div>
  );
}

