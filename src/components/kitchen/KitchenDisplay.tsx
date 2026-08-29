import React, { useState } from 'react';
import { useCanteen } from '../../context/CanteenContext';
import { CounterScannerModal } from './CounterScannerModal';
import {
  Clock,
  Flame,
  CheckCircle2,
  QrCode,
  Sparkles,
  ArrowRight,
  Ban
} from 'lucide-react';

export const KitchenDisplay: React.FC = () => {
  const {
    orders,
    menuItems,
    advanceOrderStatus,
    toggleItemStockKillSwitch,
    activeWorkload
  } = useCanteen();

  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [showStockManager, setShowStockManager] = useState(false);

  // Filter orders
  const queuedOrders = orders.filter(o => o.status === 'QUEUED');
  const preparingOrders = orders.filter(o => o.status === 'PREPARING');
  const readyOrders = orders.filter(o => o.status === 'READY_FOR_PICKUP');

  // Compute Smart Batch Cooking Aggregation across all active orders
  const batchSummary: { [name: string]: { count: number; station: string } } = {};
  [...queuedOrders, ...preparingOrders].forEach(ord => {
    ord.items.forEach(item => {
      if (!batchSummary[item.name]) {
        batchSummary[item.name] = { count: item.quantity, station: item.station };
      } else {
        batchSummary[item.name].count += item.quantity;
      }
    });
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top KDS Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-5 rounded-3xl bg-slate-900/90 border border-slate-800 backdrop-blur-xl shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold text-xl shadow-lg shadow-amber-500/10">
            👨‍🍳
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-extrabold text-slate-100 tracking-tight">
                Kitchen Master Display (KDS)
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                LIVE CHEF ENGINE
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Active Kitchen Workload: <strong className="text-amber-300 font-mono">{activeWorkload} items</strong> cooking
            </p>
          </div>
        </div>

        {/* Quick KDS Actions */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => setShowStockManager(!showStockManager)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition border ${
              showStockManager
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/50'
                : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
            }`}
          >
            <Ban className="w-4 h-4 text-rose-400" />
            <span>86 Stock Delister</span>
          </button>

          <button
            onClick={() => setIsScannerOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition transform active:scale-95"
          >
            <QrCode className="w-4 h-4" />
            <span>Counter Handover Scanner</span>
          </button>
        </div>
      </div>

      {/* 86 Stock Kill Switch Drawer (Collapsible) */}
      {showStockManager && (
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-rose-500/30 backdrop-blur-xl shadow-2xl space-y-3 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Ban className="w-4 h-4 text-rose-400" />
              <h4 className="text-sm font-bold text-rose-300">
                Instant 86 Kill-Switch (Delist out-of-stock items immediately)
              </h4>
            </div>
            <span className="text-[11px] text-slate-400">
              Changes sync in real time to all student phones!
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {menuItems.map(item => (
              <div
                key={item.id}
                className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-2"
              >
                <div className="min-w-0">
                  <span className="text-xs font-bold text-slate-200 block truncate">{item.name}</span>
                  <span className="text-[10px] text-slate-400 font-mono">Stock: {item.stock} left</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleItemStockKillSwitch(item.id)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase transition ${
                      item.isAvailable
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                    }`}
                  >
                    {item.isAvailable ? 'Active' : '86ed'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Smart Batch Cooking Aggregator Box */}
      {Object.keys(batchSummary).length > 0 && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/30 via-slate-900 to-slate-900 border border-amber-500/30 backdrop-blur-xl shadow-lg">
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30">
                <Flame className="w-4 h-4 text-amber-400" />
              </span>
              <h4 className="text-xs sm:text-sm font-bold text-amber-300">
                Smart Batch Cooking Aggregator (Active Slots Inflow)
              </h4>
            </div>
            <span className="text-[11px] text-slate-400">
              Cook similar recipes concurrently for maximum speed
            </span>
          </div>

          <div className="flex items-center gap-2.5 overflow-x-auto pb-1 no-scrollbar">
            {Object.entries(batchSummary).map(([name, data]) => (
              <div
                key={name}
                className="px-3 py-2 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center gap-2 shrink-0"
              >
                <span className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-300 font-mono font-extrabold flex items-center justify-center text-xs">
                  {data.count}x
                </span>
                <div>
                  <span className="text-xs font-bold text-slate-200 block truncate max-w-[140px]">
                    {name}
                  </span>
                  <span className="text-[9px] uppercase font-bold text-slate-500">
                    {data.station}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Kanban Board Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Column 1: Incoming / Queued */}
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-200">
                1. Incoming / Queued
              </h3>
            </div>
            <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-full bg-slate-800 text-cyan-300">
              {queuedOrders.length}
            </span>
          </div>

          <div className="space-y-3">
            {queuedOrders.length === 0 ? (
              <div className="p-6 rounded-2xl bg-slate-950/40 border border-dashed border-slate-800 text-center text-xs text-slate-500">
                No orders waiting in queue
              </div>
            ) : (
              queuedOrders.map(order => (
                <div
                  key={order.id}
                  className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 shadow-lg hover:border-cyan-500/50 transition"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-mono font-extrabold text-cyan-300">
                      #{order.token}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400 bg-slate-950 px-2 py-0.5 rounded">
                      Slot: {order.slotLabel}
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    {order.items.map((item, i) => (
                      <div key={i} className="flex items-center justify-between text-xs">
                        <span className="text-slate-200 font-semibold">
                          {item.quantity}x {item.name}
                        </span>
                        <span className="text-[10px] font-mono text-slate-500 uppercase font-bold">
                          {item.station}
                        </span>
                      </div>
                    ))}
                  </div>

                  {order.specialInstructions && (
                    <p className="text-[11px] text-amber-300 bg-amber-950/30 p-2 rounded-lg border border-amber-500/20 italic">
                      Note: {order.specialInstructions}
                    </p>
                  )}

                  <button
                    onClick={() => advanceOrderStatus(order.id, 'GRILL_WOK')}
                    className="w-full py-2 px-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-cyan-500/20 transition"
                  >
                    <span>Start Cooking</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Column 2: In Preparation */}
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-200">
                2. Sizzling / Prepping
              </h3>
            </div>
            <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-full bg-slate-800 text-amber-300">
              {preparingOrders.length}
            </span>
          </div>

          <div className="space-y-3">
            {preparingOrders.length === 0 ? (
              <div className="p-6 rounded-2xl bg-slate-950/40 border border-dashed border-slate-800 text-center text-xs text-slate-500">
                No tickets currently on stove/assembly
              </div>
            ) : (
              preparingOrders.map(order => (
                <div
                  key={order.id}
                  className="p-4 rounded-2xl bg-slate-900 border border-amber-500/40 space-y-3 shadow-lg shadow-amber-500/5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-mono font-extrabold text-amber-300">
                      #{order.token}
                    </span>
                    <span className="text-[11px] font-mono text-amber-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> ETA: {order.estimatedReadyTime}
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    {order.items.map((item, i) => (
                      <div key={i} className="flex items-center justify-between text-xs">
                        <span className="text-slate-200 font-semibold">
                          {item.quantity}x {item.name}
                        </span>
                        <span className="text-[10px] font-mono text-amber-400 uppercase font-bold">
                          {item.station}
                        </span>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => advanceOrderStatus(order.id, 'READY_LOCKER')}
                    className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/20 transition"
                  >
                    <span>Mark Ready & Place in {order.lockerNumber}</span>
                    <Sparkles className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Column 3: Ready for Handover at Shelves */}
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-200">
                3. In Pickup Shelves
              </h3>
            </div>
            <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-full bg-slate-800 text-emerald-300">
              {readyOrders.length}
            </span>
          </div>

          <div className="space-y-3">
            {readyOrders.length === 0 ? (
              <div className="p-6 rounded-2xl bg-slate-950/40 border border-dashed border-slate-800 text-center text-xs text-slate-500">
                Warming shelves currently clear
              </div>
            ) : (
              readyOrders.map(order => (
                <div
                  key={order.id}
                  className="p-4 rounded-2xl bg-slate-900 border border-emerald-500/40 space-y-3 shadow-lg shadow-emerald-500/10 relative overflow-hidden"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-mono font-extrabold text-emerald-300">
                      #{order.token}
                    </span>
                    <span className="px-2 py-0.5 rounded-md text-xs font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      {order.lockerNumber}
                    </span>
                  </div>

                  <div className="text-xs text-slate-300 font-medium">
                    Student: <strong>{order.studentName}</strong> ({order.studentId})
                  </div>

                  <button
                    onClick={() => advanceOrderStatus(order.id, 'COLLECTED')}
                    className="w-full py-2 px-3 rounded-xl bg-slate-950 hover:bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold text-xs flex items-center justify-center gap-1.5 transition"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Quick Release / Handover</span>
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Counter Scanner Modal */}
      <CounterScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
      />
    </div>
  );
};
