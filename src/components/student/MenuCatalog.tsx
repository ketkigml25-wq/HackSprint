import React, { useState } from 'react';
import { useCanteen } from '../../context/CanteenContext';
import type { FoodCategory } from '../../types';
import {
  Search,
  Flame,
  Clock,
  Sparkles,
  Plus,
  Minus,
  Tag,
  AlertCircle,
  Leaf
} from 'lucide-react';

const CATEGORIES: FoodCategory[] = [
  'All',
  'Quick Bites',
  'Hot Meals',
  'Beverages',
  'Healthy & Salads',
  'Desserts'
];

export const MenuCatalog: React.FC = () => {
  const { menuItems, cart, addToCart, updateCartQuantity } = useCanteen();
  const [selectedCategory, setSelectedCategory] = useState<FoodCategory>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [onlyVeg, setOnlyVeg] = useState(false);
  const [onlyFlash, setOnlyFlash] = useState(false);

  // Filter items
  const filteredItems = menuItems.filter(item => {
    if (selectedCategory !== 'All' && item.category !== selectedCategory) return false;
    if (onlyVeg && !item.isVeg) return false;
    if (onlyFlash && !item.isFlashDiscount) return false;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      return item.name.toLowerCase().includes(q) || item.description.toLowerCase().includes(q);
    }
    return true;
  });

  const flashItems = menuItems.filter(item => item.isFlashDiscount && item.isAvailable);

  return (
    <div className="space-y-5">
      {/* Anti-Waste Flash Drops Banner */}
      {flashItems.length > 0 && (
        <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-purple-500/10 border border-amber-500/30 backdrop-blur-xl relative overflow-hidden shadow-lg">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
            <div className="flex items-center gap-2.5">
              <span className="p-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse">
                <Tag className="w-4 h-4" />
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-xs sm:text-sm font-bold text-amber-300">
                    ⚡ Anti-Waste Flash Drops Active
                  </h4>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                    Up to 25% OFF
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 mt-0.5">
                  Surplus fresh prep discounted dynamically to guarantee zero food waste!
                </p>
              </div>
            </div>

            <button
              onClick={() => setOnlyFlash(!onlyFlash)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                onlyFlash
                  ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20'
                  : 'bg-slate-900/80 text-amber-300 border border-amber-500/40 hover:bg-amber-500/20'
              }`}
            >
              {onlyFlash ? 'Showing Flash Deals' : 'View Flash Deals'}
            </button>
          </div>
        </div>
      )}

      {/* Search & Category Filter Navigation */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row gap-2.5">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search burgers, wraps, shakes, bowls..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-800 focus:border-emerald-500 focus:outline-none text-xs text-slate-100 placeholder:text-slate-500 transition"
            />
          </div>

          {/* Quick Dietary Filter Badges */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setOnlyVeg(!onlyVeg)}
              className={`flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-semibold border transition ${
                onlyVeg
                  ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <Leaf className="w-3.5 h-3.5 text-emerald-400" />
              <span>Veg Only</span>
            </button>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                  : 'bg-slate-900/60 text-slate-400 border border-slate-800/80 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Menu Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredItems.map((item) => {
          const inCart = cart.find(c => c.item.id === item.id);
          const isLowStock = item.stock <= 4 && item.stock > 0;
          const isOutOfStock = !item.isAvailable || item.stock === 0;

          return (
            <div
              key={item.id}
              className={`group bg-slate-900/70 border rounded-2xl overflow-hidden flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/5 ${
                isOutOfStock
                  ? 'border-slate-800/50 opacity-60'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Image & Badges */}
              <div className="relative h-40 w-full overflow-hidden bg-slate-950">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />

                {/* Dietary & Flash Badges */}
                <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5">
                  <span
                    className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 backdrop-blur-md ${
                      item.isVeg
                        ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/40'
                        : 'bg-rose-950/80 text-rose-400 border border-rose-500/40'
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${item.isVeg ? 'bg-emerald-400' : 'bg-rose-400'}`} />
                    {item.isVeg ? 'Veg' : 'Non-Veg'}
                  </span>

                  {item.isSpicy && (
                    <span className="p-1 rounded-md bg-rose-950/80 text-rose-400 border border-rose-500/40">
                      <Flame className="w-3 h-3" />
                    </span>
                  )}
                </div>

                {/* Prep Station & Time Badge */}
                <div className="absolute top-2.5 right-2.5">
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-semibold bg-slate-950/80 text-teal-300 border border-teal-500/30 backdrop-blur-md flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {item.prepTimeMinutes}m
                  </span>
                </div>

                {/* Flash Drop Badge */}
                {item.isFlashDiscount && (
                  <div className="absolute bottom-2 left-2.5">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-slate-950 shadow-md flex items-center gap-1 animate-pulse">
                      <Sparkles className="w-3 h-3" />
                      Flash Drop: ₹{item.price}
                    </span>
                  </div>
                )}
              </div>

              {/* Card Details */}
              <div className="p-3.5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-1">
                    <h4 className="text-xs sm:text-sm font-bold text-slate-100 line-clamp-1 group-hover:text-emerald-400 transition">
                      {item.name}
                    </h4>
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-2 mt-1">
                    {item.description}
                  </p>
                </div>

                {/* Stock status indicator */}
                <div className="mt-2.5 flex items-center justify-between text-[11px] pt-2 border-t border-slate-800/80">
                  <div className="flex items-center gap-1.5">
                    {isOutOfStock ? (
                      <span className="text-rose-400 font-semibold flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> Out of stock (86ed)
                      </span>
                    ) : isLowStock ? (
                      <span className="text-amber-400 font-semibold flex items-center gap-1">
                        <Flame className="w-3 h-3" /> Only {item.stock} left
                      </span>
                    ) : (
                      <span className="text-emerald-400 font-semibold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        {item.stock} available
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">{item.calories} kcal</span>
                </div>

                {/* Price & Add to Cart button */}
                <div className="mt-3 flex items-center justify-between gap-2">
                  <div>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-base font-extrabold text-slate-100">
                        ₹{item.price}
                      </span>
                      {item.originalPrice && (
                        <span className="text-xs text-slate-500 line-through">
                          ₹{item.originalPrice}
                        </span>
                      )}
                    </div>
                    <span className="text-[9px] uppercase font-bold text-slate-500 tracking-wider">
                      {item.station} STATION
                    </span>
                  </div>

                  {/* Add / Quantity Controller */}
                  {isOutOfStock ? (
                    <button
                      disabled
                      className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-500 text-xs font-semibold cursor-not-allowed"
                    >
                      Sold Out
                    </button>
                  ) : inCart ? (
                    <div className="flex items-center bg-emerald-950/80 border border-emerald-500/50 rounded-xl p-0.5 shadow-sm">
                      <button
                        onClick={() => updateCartQuantity(item.id, -1)}
                        className="p-1 rounded-lg text-emerald-400 hover:bg-emerald-500/20 transition"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-2 font-mono font-bold text-xs text-emerald-300">
                        {inCart.quantity}
                      </span>
                      <button
                        onClick={() => updateCartQuantity(item.id, 1)}
                        className="p-1 rounded-lg text-emerald-400 hover:bg-emerald-500/20 transition"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => addToCart(item)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20 transition active:scale-95"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
