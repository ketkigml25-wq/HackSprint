import React, { useState } from 'react';
import { useCanteen } from '../../context/CanteenContext';
import { BulkOrderModal } from './BulkOrderModal';
import {
  Clock,
  Zap,
  Sliders,
  Trash2,
  CheckCircle2,
  XCircle,
  DollarSign,
  Plus
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
    orders,
    timeSlots,
    bulkRequests,
    wasteRecords,
    approveBulkOrder,
    rejectBulkOrder,
    activeWorkload
  } = useCanteen();

  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'SLOTS' | 'BULK' | 'WASTE'>('OVERVIEW');

  // KPI calculations
  const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const totalCompleted = orders.filter(o => o.status === 'COLLECTED').length;
  const totalWasteLoss = wasteRecords.reduce((sum, w) => sum + w.totalLostValue, 0);
  const pendingBulkCount = bulkRequests.filter(b => b.status === 'PENDING').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-5 rounded-3xl bg-slate-900/90 border border-slate-800 backdrop-blur-xl shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center font-bold text-xl shadow-lg shadow-cyan-500/10">
            📊
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-extrabold text-slate-100 tracking-tight">
                Canteen Manager Command Center
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                ADMIN ENGINE
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Workload throttling, bulk catering approvals, and food waste audit registry
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab('OVERVIEW')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              activeTab === 'OVERVIEW'
                ? 'bg-cyan-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Metrics
          </button>
          <button
            onClick={() => setActiveTab('SLOTS')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              activeTab === 'SLOTS'
                ? 'bg-cyan-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Slot Throttles
          </button>
          <button
            onClick={() => setActiveTab('BULK')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition relative ${
              activeTab === 'BULK'
                ? 'bg-cyan-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Bulk Orders
            {pendingBulkCount > 0 && (
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping absolute -top-0.5 -right-0.5" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('WASTE')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              activeTab === 'WASTE'
                ? 'bg-cyan-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Waste Audit
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
          <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
            <DollarSign className="w-3.5 h-3.5 text-emerald-400" /> Revenue Today
          </span>
          <div className="font-mono text-2xl font-black text-slate-100">₹{totalRevenue}</div>
          <span className="text-[10px] text-emerald-400 font-semibold">+18.4% vs yesterday</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
          <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-cyan-400" /> Avg Prep Time
          </span>
          <div className="font-mono text-2xl font-black text-slate-100">5.8 mins</div>
          <span className="text-[10px] text-cyan-400 font-semibold">Fastest: Beverages (2m)</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
          <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" /> Handed Over
          </span>
          <div className="font-mono text-2xl font-black text-slate-100">{totalCompleted} orders</div>
          <span className="text-[10px] text-teal-400 font-semibold">Zero lost queue tokens</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
          <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
            <Trash2 className="w-3.5 h-3.5 text-rose-400" /> Uncollected Waste
          </span>
          <div className="font-mono text-2xl font-black text-rose-400">₹{totalWasteLoss}</div>
          <span className="text-[10px] text-rose-400 font-semibold">{wasteRecords.length} timeout records</span>
        </div>
      </div>

      {/* Tab: Overview & Analytics */}
      {activeTab === 'OVERVIEW' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Workload Inflow & Staff Capacity Radar */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-200 flex items-center gap-2">
                <Zap className="w-4 h-4 text-emerald-400" />
                <span>Real-Time Kitchen Load Balancing</span>
              </h3>
              <span className="text-xs font-mono text-emerald-400 font-bold">
                {activeWorkload} Active Cooking Items
              </span>
            </div>

            <div className="space-y-3">
              {timeSlots.map(slot => (
                <div key={slot.id} className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="font-mono text-slate-300">{slot.label}</span>
                    <span className="font-mono font-semibold text-slate-400">
                      {slot.currentLoad} / {slot.maxCapacity} items booked
                    </span>
                  </div>
                  <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        slot.currentLoad >= slot.maxCapacity
                          ? 'bg-rose-500'
                          : slot.currentLoad >= slot.maxCapacity * 0.7
                          ? 'bg-amber-500'
                          : 'bg-emerald-500'
                      }`}
                      style={{ width: `${Math.min(100, (slot.currentLoad / slot.maxCapacity) * 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions & Policy Card */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
            <h3 className="font-bold text-sm text-slate-200 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-cyan-400" />
              <span>Smart Engine Policies & Guardrails</span>
            </h3>

            <div className="space-y-2.5 text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="font-bold text-slate-200">🛡️ Fair Use & Grace Period</span>
                <p className="text-slate-400">
                  Ready meals are held for 15 mins in heated shelves. At T+20m, order is logged as uncollected waste and student receives penalty warning.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="font-bold text-slate-200">⚡ Dynamic Flash Drop Rules</span>
                <p className="text-slate-400">
                  Perishables with &gt;10 stock remaining at 01:30 PM automatically trigger a 20% flash discount to prevent day-end food wastage.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="font-bold text-slate-200">📦 Dedicated Bulk Channel</span>
                <p className="text-slate-400">
                  Orders &gt;15 items are separated from regular student queues so single-coffee orders are never choked during fests.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Slot Capacity Throttles */}
      {activeTab === 'SLOTS' && (
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-slate-200">
                10-Minute Discrete Slot Capacity Controls
              </h3>
              <p className="text-xs text-slate-400">
                Adjust maximum concurrent meal items allowed per slot based on active kitchen staff count
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {timeSlots.map(slot => (
              <div
                key={slot.id}
                className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-xs text-slate-200">
                    {slot.label}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      slot.isAvailable ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                    }`}
                  >
                    {slot.isAvailable ? 'OPEN' : 'LOCKED'}
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Current Load:</span>
                    <span className="font-mono font-bold text-slate-200">
                      {slot.currentLoad} / {slot.maxCapacity} items
                    </span>
                  </div>

                  <input
                    type="range"
                    min="10"
                    max="50"
                    value={slot.maxCapacity}
                    readOnly
                    className="w-full accent-cyan-400"
                  />
                </div>

                <p className="text-[10px] text-slate-500 font-mono">
                  Lecture tag: {slot.lectureBreakTag || 'Standard window'}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Bulk Order Approvals */}
      {activeTab === 'BULK' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-slate-200">
                Bulk Catering & Department Event Hub
              </h3>
              <p className="text-xs text-slate-400">
                Review large quantity requests for hackathons, club meetings, and college festivals
              </p>
            </div>

            <button
              onClick={() => setIsBulkModalOpen(true)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 transition"
            >
              <Plus className="w-4 h-4" />
              <span>Submit New Bulk Request</span>
            </button>
          </div>

          <div className="space-y-3">
            {bulkRequests.map(req => (
              <div
                key={req.id}
                className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-lg"
              >
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2.5">
                    <span className="font-bold text-sm text-slate-100">{req.eventName}</span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        req.status === 'APPROVED'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : req.status === 'REJECTED'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      }`}
                    >
                      {req.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-400">
                    Coordinator: <strong className="text-slate-300">{req.requesterName}</strong> • {req.department}
                  </p>

                  <div className="flex flex-wrap gap-2 pt-1">
                    {req.items.map((item, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-md bg-slate-950 text-[11px] text-slate-300 border border-slate-800"
                      >
                        {item.quantity}x {item.name}
                      </span>
                    ))}
                  </div>

                  {req.notes && (
                    <p className="text-[11px] text-cyan-300 italic mt-1">Note: {req.notes}</p>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row items-end md:items-center gap-3 shrink-0">
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block">Total Quote</span>
                    <span className="font-mono font-extrabold text-base text-cyan-300">
                      ₹{req.totalAmount}
                    </span>
                  </div>

                  {req.status === 'PENDING' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => approveBulkOrder(req.id)}
                        className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Approve & Allot Batch</span>
                      </button>

                      <button
                        onClick={() => rejectBulkOrder(req.id)}
                        className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-rose-950/40 text-rose-300 text-xs font-semibold transition"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Decline</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Food Waste & Timeout Audit */}
      {activeTab === 'WASTE' && (
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div>
            <h3 className="font-bold text-base text-slate-200">
              Uncollected Meals & Food Waste Audit Registry
            </h3>
            <p className="text-xs text-slate-400">
              Automatic log of orders exceeding the 20-min pickup grace period with reason attribution
            </p>
          </div>

          <div className="space-y-2.5">
            {wasteRecords.length === 0 ? (
              <div className="p-6 rounded-2xl bg-slate-950 text-center text-xs text-slate-500">
                Zero food waste logged today! 100% pickup efficiency.
              </div>
            ) : (
              wasteRecords.map(w => (
                <div
                  key={w.id}
                  className="p-3.5 rounded-xl bg-slate-950 border border-rose-500/20 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-rose-400">{w.token}</span>
                      <span className="font-semibold text-slate-200">{w.itemsSummary}</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-rose-950 text-rose-300 border border-rose-800">
                        {w.reason.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      User: {w.studentName} • Logged at: {w.timestamp}
                    </p>
                  </div>

                  <div className="text-right font-mono font-extrabold text-rose-400 text-sm">
                    -₹{w.totalLostValue}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Submit Bulk Modal */}
      <BulkOrderModal
        isOpen={isBulkModalOpen}
        onClose={() => setIsBulkModalOpen(false)}
      />
    </div>
  );
};
