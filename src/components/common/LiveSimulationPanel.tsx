import React, { useState } from 'react';
import { useCanteen } from '../../context/CanteenContext';
import {
  SlidersHorizontal,
  Flame,
  ClockAlert,
  Boxes,
  RotateCcw,
  ChevronUp,
  ChevronDown,
  Sparkles
} from 'lucide-react';

export const LiveSimulationPanel: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const {
    menuItems,
    addToCart,
    placeOrder,
    simulateRushSurge,
    simulateTimeoutWaste,
    orders,
    addBulkOrderRequest,
    resetAllData
  } = useCanteen();

  const handleQuickTestOrder = () => {
    const randomItem = menuItems.find(m => m.stock > 0) || menuItems[0];
    addToCart(randomItem);
    setTimeout(() => {
      placeOrder('Riya Sen', '2024CS109', 'Extra spicy please');
    }, 150);
  };

  const handleQuickBulkOrder = () => {
    addBulkOrderRequest({
      requesterName: 'Robotics Club (Prof. Verma)',
      department: 'Robotics & AI Lab',
      eventName: 'RoboWars Workshop Dinner',
      eventDate: 'Today, 29 Aug',
      pickupTime: '07:30 PM',
      items: [
        { name: 'Schezwan Crispy Chicken Wrap', quantity: 30, price: 140 },
        { name: 'Fresh Dragonfruit Basil Lemonade', quantity: 30, price: 60 }
      ],
      totalAmount: 6000,
      notes: 'Please pack in 6 large insulated crates.'
    });
  };

  const handleSimulateTimeout = () => {
    const readyOrder = orders.find(o => o.status === 'READY_FOR_PICKUP') || orders[0];
    if (readyOrder) {
      simulateTimeoutWaste(readyOrder.id);
    } else {
      alert('No active order available to timeout. Place an order first!');
    }
  };

  return (
    <div className="fixed bottom-3 right-4 z-50">
      <div className="bg-slate-900/95 backdrop-blur-xl border border-emerald-500/30 rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 w-80 sm:w-96">
        {/* Toggle Bar */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-4 py-2.5 flex items-center justify-between bg-gradient-to-r from-emerald-950/80 via-slate-900 to-slate-900 hover:from-emerald-900/80 transition-colors text-xs font-bold text-emerald-400 border-b border-emerald-500/20"
        >
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Interactive Rush & Edge Case Lab</span>
          </div>
          {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
        </button>

        {/* Content */}
        {isOpen && (
          <div className="p-3.5 space-y-2 text-xs">
            <p className="text-[11px] text-slate-400">
              1-click test scenarios to evaluate queue balancing, slot bottlenecks, and edge cases:
            </p>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleQuickTestOrder}
                className="flex items-center gap-1.5 p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition text-left"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="truncate">Instant Order</span>
              </button>

              <button
                onClick={simulateRushSurge}
                className="flex items-center gap-1.5 p-2 rounded-lg bg-slate-800 hover:bg-rose-950/40 text-rose-300 border border-rose-800/40 transition text-left"
              >
                <Flame className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                <span className="truncate">Trigger Rush Surge</span>
              </button>

              <button
                onClick={handleSimulateTimeout}
                className="flex items-center gap-1.5 p-2 rounded-lg bg-slate-800 hover:bg-amber-950/40 text-amber-300 border border-amber-800/40 transition text-left"
              >
                <ClockAlert className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="truncate">Uncollected Expire</span>
              </button>

              <button
                onClick={handleQuickBulkOrder}
                className="flex items-center gap-1.5 p-2 rounded-lg bg-slate-800 hover:bg-cyan-950/40 text-cyan-300 border border-cyan-800/40 transition text-left"
              >
                <Boxes className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span className="truncate">Submit Fest Bulk</span>
              </button>
            </div>

            <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
              <span className="text-[10px] text-slate-500 font-mono">ByteBite v2.0 Engine</span>
              <button
                onClick={resetAllData}
                className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-rose-400 transition"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset All Data</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
