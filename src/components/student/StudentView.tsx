import React, { useState } from 'react';
import { useCanteen } from '../../context/CanteenContext';
import { RushRadar } from './RushRadar';
import { ClassSyncModal } from './ClassSyncModal';
import { MenuCatalog } from './MenuCatalog';
import { CartDrawer } from './CartDrawer';
import { OrderTracker } from './OrderTracker';
import {
  Compass,
  Layers,
  ArrowRight
} from 'lucide-react';

export const StudentView: React.FC<{ isMobileFrame: boolean }> = ({ isMobileFrame }) => {
  const { cart, orders } = useCanteen();
  const [activeTab, setActiveTab] = useState<'MENU' | 'TRACKER'>('MENU');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isClassSyncOpen, setIsClassSyncOpen] = useState(false);

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotalAmount = cart.reduce((sum, item) => sum + (item.item.price * item.quantity), 0);
  const activeOrders = orders.filter(o => o.status !== 'COLLECTED' && o.status !== 'CANCELLED');

  const content = (
    <div className="space-y-6 pb-24">
      {/* Top Banner & Sub-Navigation */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-100 tracking-tight flex items-center gap-2">
            <span>Campus Dining OS</span>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Live & Workload-Aware
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Pre-order smart, beat peak hour queues, and pick up your hot meal on time.
          </p>
        </div>

        {/* View Switcher: Menu vs Live Tracker */}
        <div className="flex items-center bg-slate-900/90 p-1 rounded-xl border border-slate-800 self-stretch sm:self-auto shadow-inner">
          <button
            onClick={() => setActiveTab('MENU')}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'MENU'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Browse Menu</span>
          </button>

          <button
            onClick={() => setActiveTab('TRACKER')}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all relative ${
              activeTab === 'TRACKER'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Track Orders</span>
            {activeOrders.length > 0 && (
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping absolute -top-0.5 -right-0.5" />
            )}
          </button>
        </div>
      </div>

      {/* Rush Radar always accessible on Menu tab */}
      {activeTab === 'MENU' && (
        <>
          <RushRadar onOpenClassSync={() => setIsClassSyncOpen(true)} />
          <MenuCatalog />
        </>
      )}

      {/* Order Tracker Tab */}
      {activeTab === 'TRACKER' && <OrderTracker />}

      {/* Floating Bottom Cart Bar when items added */}
      {cartItemCount > 0 && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-11/12 max-w-lg">
          <button
            onClick={() => setIsCartOpen(true)}
            className="w-full p-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-slate-950 font-extrabold shadow-2xl shadow-emerald-500/30 flex items-center justify-between transition-all transform hover:scale-[1.02] active:scale-98"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-slate-950/20 flex items-center justify-center text-xs font-black">
                {cartItemCount}
              </div>
              <div className="text-left">
                <span className="text-xs block font-bold leading-tight">View Cart & Reserve Slot</span>
                <span className="text-[10px] opacity-80 font-mono">₹{cartTotalAmount} total</span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-xs font-black">
              <span>Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </button>
        </div>
      )}

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onOrderSuccess={() => setActiveTab('TRACKER')}
      />

      {/* Class Schedule Reverse Sync Modal */}
      <ClassSyncModal
        isOpen={isClassSyncOpen}
        onClose={() => setIsClassSyncOpen(false)}
      />
    </div>
  );

  if (isMobileFrame) {
    return (
      <div className="py-6 flex justify-center items-center">
        <div className="w-full max-w-[420px] bg-slate-950 border-[6px] border-slate-800 rounded-[42px] shadow-2xl overflow-hidden p-4 min-h-[820px] relative">
          {/* Phone notch */}
          <div className="w-32 h-4 bg-slate-800 rounded-full mx-auto mb-4" />
          {content}
        </div>
      </div>
    );
  }

  return <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">{content}</div>;
};
