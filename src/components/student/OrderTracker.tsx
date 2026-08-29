import React from 'react';
import { useCanteen } from '../../context/CanteenContext';
import type { KitchenStationType } from '../../types';
import {
  Clock,
  ShieldCheck,
  Volume2,
  XCircle,
  ChefHat
} from 'lucide-react';
import { soundFx } from '../../services/audioService';

const STATIONS: { key: KitchenStationType; label: string; icon: string; desc: string }[] = [
  { key: 'PREP', label: 'Order Queued', icon: '📥', desc: 'Ticket assigned & ingredients staged' },
  { key: 'GRILL_WOK', label: 'Cooking & Grill', icon: '🍳', desc: 'Active sizzle at chef station' },
  { key: 'ASSEMBLY_PACK', label: 'Plating & Pack', icon: '🥪', desc: 'Insulated packaging & condiments' },
  { key: 'READY_LOCKER', label: 'Ready for Pickup', icon: '🛎️', desc: 'Placed in warming pickup shelf' },
  { key: 'COLLECTED', label: 'Handed Over', icon: '✨', desc: 'Verified & collected by student' }
];

export const OrderTracker: React.FC = () => {
  const { orders, activeOrder, setActiveOrder, cancelOrder } = useCanteen();

  if (orders.length === 0) {
    return (
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 text-center space-y-3">
        <div className="w-14 h-14 rounded-2xl bg-slate-800 flex items-center justify-center text-2xl mx-auto text-slate-500">
          📦
        </div>
        <h4 className="text-sm font-bold text-slate-200">No Orders in Queue</h4>
        <p className="text-xs text-slate-400 max-w-sm mx-auto">
          Place an order from the menu to track its real-time journey through kitchen cooking stations!
        </p>
      </div>
    );
  }

  const currentOrder = activeOrder || orders[0];

  const getStationIndex = (station: KitchenStationType) => {
    switch (station) {
      case 'PREP': return 0;
      case 'GRILL_WOK': return 1;
      case 'ASSEMBLY_PACK': return 2;
      case 'READY_LOCKER': return 3;
      case 'COLLECTED': return 4;
      default: return 0;
    }
  };

  const currentIndex = getStationIndex(currentOrder.currentStation);
  const isReady = currentOrder.status === 'READY_FOR_PICKUP';
  const isCollected = currentOrder.status === 'COLLECTED';
  const isCancelled = currentOrder.status === 'CANCELLED';
  const isExpired = currentOrder.status === 'EXPIRED';

  const handleChimeTest = () => {
    if (isReady) soundFx.playOrderReady();
    else soundFx.playKitchenAlert();
  };

  return (
    <div className="space-y-6">
      {/* Multi-Order Tabs if student has multiple active orders */}
      {orders.length > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          <span className="text-xs text-slate-400 font-semibold shrink-0">Your Orders:</span>
          {orders.map((ord) => (
            <button
              key={ord.id}
              onClick={() => setActiveOrder(ord)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                currentOrder.id === ord.id
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'
              }`}
            >
              <span>{ord.token}</span>
              <span className="text-[10px] font-sans font-normal opacity-80">
                ({ord.status.replace('_', ' ')})
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Main Order Card */}
      <div className="bg-gradient-to-br from-slate-900/90 via-slate-900/80 to-slate-950 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-2xl backdrop-blur-xl relative overflow-hidden">
        {/* Glow ambient background */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top summary row */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="text-2xl sm:text-3xl font-extrabold font-mono text-emerald-400 tracking-wider">
                TOKEN #{currentOrder.token}
              </span>
              <span
                className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider ${
                  isReady
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 animate-pulse'
                    : isCollected
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : isCancelled || isExpired
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                }`}
              >
                {currentOrder.status.replace(/_/g, ' ')}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Ordered for pickup slot:{' '}
              <strong className="text-slate-200 font-mono">{currentOrder.slotLabel}</strong>
            </p>
          </div>

          {/* Shelf / Pickup Counter Destination Banner */}
          <div className="px-4 py-2.5 rounded-2xl bg-slate-950/80 border border-emerald-500/30 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-sm">
              🛎️
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
                Pickup Destination
              </span>
              <span className="text-sm font-extrabold text-emerald-300 font-mono">
                {currentOrder.lockerNumber}
              </span>
            </div>
          </div>
        </div>

        {/* Visual Animated Kitchen Station Pipeline */}
        <div className="my-8">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <ChefHat className="w-4 h-4 text-emerald-400" />
              <span>Live Visual Kitchen Pipeline</span>
            </h4>
            <span className="text-xs font-mono text-emerald-400 font-semibold flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> ETA: {currentOrder.estimatedReadyTime}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {STATIONS.map((station, idx) => {
              const isPast = idx < currentIndex;
              const isCurrent = idx === currentIndex && !isCancelled && !isExpired;

              return (
                <div
                  key={station.key}
                  className={`p-3.5 rounded-2xl border flex flex-col justify-between transition-all duration-300 relative ${
                    isCurrent
                      ? 'bg-emerald-950/40 border-emerald-400 shadow-lg shadow-emerald-500/20 scale-[1.02]'
                      : isPast
                      ? 'bg-slate-950/60 border-emerald-500/30 text-slate-300'
                      : 'bg-slate-950/30 border-slate-800/60 opacity-50'
                  }`}
                >
                  {/* Step counter */}
                  <div className="flex items-center justify-between">
                    <span className="text-xl">{station.icon}</span>
                    <span
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono font-bold ${
                        isCurrent
                          ? 'bg-emerald-400 text-slate-950 animate-bounce'
                          : isPast
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-slate-800 text-slate-500'
                      }`}
                    >
                      {idx + 1}
                    </span>
                  </div>

                  <div className="mt-3">
                    <h5
                      className={`text-xs font-bold ${
                        isCurrent ? 'text-emerald-300' : isPast ? 'text-slate-200' : 'text-slate-400'
                      }`}
                    >
                      {station.label}
                    </h5>
                    <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-2">{station.desc}</p>
                  </div>

                  {isCurrent && (
                    <div className="mt-2 h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-400 rounded-full animate-pulse w-full" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Dynamic Holographic Pickup Pass Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-6 border-t border-slate-800/80">
          {/* Holographic Security QR Pass Card */}
          <div className="relative rounded-2xl p-5 bg-gradient-to-tr from-slate-950 via-slate-900 to-emerald-950/40 border border-emerald-500/40 holo-card overflow-hidden shadow-2xl flex flex-col items-center justify-center text-center">
            {/* Hologram scan line */}
            <div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent scan-line pointer-events-none opacity-80" />

            <div className="flex items-center justify-between w-full mb-3 text-xs">
              <span className="flex items-center gap-1 text-emerald-400 font-mono font-bold">
                <ShieldCheck className="w-4 h-4" /> Secure Dynamic Token
              </span>
              <span className="font-mono text-slate-400 text-[11px]">{currentOrder.qrCodeHash.slice(0, 14)}...</span>
            </div>

            {/* Dynamic QR Graphic Box */}
            <div className="p-3.5 bg-slate-950 rounded-2xl border border-emerald-500/50 shadow-inner my-2 relative">
              <div className="w-36 h-36 bg-slate-900 rounded-xl flex flex-col items-center justify-center p-2 border border-slate-800 relative overflow-hidden">
                {/* SVG QR Code Simulation */}
                <div className="grid grid-cols-5 gap-1.5 w-full h-full p-1 opacity-90">
                  {Array.from({ length: 25 }).map((_, i) => (
                    <div
                      key={i}
                      className={`rounded-xs ${
                        (i % 2 === 0 || i % 3 === 0) && i !== 12
                          ? 'bg-emerald-400'
                          : 'bg-transparent'
                      }`}
                    />
                  ))}
                </div>
                {/* Center token badge */}
                <div className="absolute inset-0 m-auto w-10 h-10 rounded-lg bg-slate-950 border border-emerald-400 flex items-center justify-center font-mono font-extrabold text-xs text-emerald-400 shadow-lg">
                  {currentOrder.token}
                </div>
              </div>
            </div>

            <p className="text-[11px] text-slate-300 mt-2 font-medium">
              Flash this pass at <strong className="text-emerald-400">{currentOrder.lockerNumber}</strong> to collect
            </p>

            <button
              onClick={handleChimeTest}
              className="mt-3 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950/80 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-300 transition"
            >
              <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Test Audio Ring</span>
            </button>
          </div>

          {/* Order Details & Summary */}
          <div className="space-y-3.5 flex flex-col justify-between">
            <div>
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2.5">
                Ordered Items
              </h4>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {currentOrder.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 font-mono font-bold flex items-center justify-center text-xs">
                        {item.quantity}x
                      </span>
                      <span className="font-semibold text-slate-200">{item.name}</span>
                    </div>
                    <span className="font-mono text-slate-300 font-bold">
                      ₹{item.price * item.quantity}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Total summary */}
            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1 text-xs">
              <div className="flex items-center justify-between text-slate-400">
                <span>Student:</span>
                <span className="font-medium text-slate-200">
                  {currentOrder.studentName} ({currentOrder.studentId})
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>Placed At:</span>
                <span className="font-mono text-slate-200">{currentOrder.placedAt}</span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-slate-800 font-bold text-sm text-slate-100">
                <span>Total Paid:</span>
                <span className="font-mono text-emerald-400 font-extrabold text-base">
                  ₹{currentOrder.totalAmount}
                </span>
              </div>
            </div>

            {/* Cancel Button if early stage */}
            {!isReady && !isCollected && !isCancelled && !isExpired && (
              <button
                onClick={() => cancelOrder(currentOrder.id, 'Student cancelled via app')}
                className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-rose-950/30 hover:bg-rose-900/40 text-rose-300 border border-rose-800/40 text-xs font-semibold transition"
              >
                <XCircle className="w-3.5 h-3.5" />
                <span>Cancel Order & Refund</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
