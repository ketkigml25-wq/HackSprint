import React, { useState } from 'react';
import { useCanteen } from '../../context/CanteenContext';
import { SlotPicker } from './SlotPicker';
import {
  X,
  Trash2,
  Plus,
  Minus,
  Clock,
  ShieldCheck,
  CreditCard,
  Wallet,
  ArrowRight
} from 'lucide-react';
import { calculateDynamicETA } from '../../services/queueEngine';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderSuccess: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  onOrderSuccess
}) => {
  const {
    cart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    placeOrder,
    activeWorkload,
    selectedSlotId,
    timeSlots
  } = useCanteen();

  const [studentName, setStudentName] = useState('Khushi S.');
  const [studentId, setStudentId] = useState('2024CS082');
  const [cookingNotes, setCookingNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'CAMPUS_CARD' | 'UPI'>('CAMPUS_CARD');

  if (!isOpen) return null;

  const totalAmount = cart.reduce((sum, c) => sum + c.item.price * c.quantity, 0);
  const totalItemCount = cart.reduce((sum, c) => sum + c.quantity, 0);
  const { estimatedTimeStr } = calculateDynamicETA(cart, activeWorkload);
  const currentSlot = timeSlots.find(s => s.id === selectedSlotId) || timeSlots[0];

  const handleCheckout = () => {
    if (cart.length === 0) return;
    const order = placeOrder(studentName, studentId, cookingNotes);
    if (order) {
      onOrderSuccess();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/80 backdrop-blur-md flex justify-end">
      <div className="w-full max-w-md bg-slate-900 border-l border-slate-800 h-full flex flex-col justify-between shadow-2xl relative animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-slate-100 text-base">Your Meal Cart</h3>
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400">
              {totalItemCount} items
            </span>
          </div>
          <div className="flex items-center gap-2">
            {cart.length > 0 && (
              <button
                onClick={clearCart}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 transition"
                title="Clear Cart"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-4 sm:p-5 flex-1 overflow-y-auto space-y-5">
          {cart.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-center p-6 space-y-3">
              <div className="w-16 h-16 rounded-2xl bg-slate-800/80 flex items-center justify-center text-2xl text-slate-500">
                🥪
              </div>
              <p className="text-sm font-semibold text-slate-300">Your cart is empty</p>
              <p className="text-xs text-slate-500">
                Explore the menu and add items to view dynamic kitchen prep ETA and slot booking!
              </p>
            </div>
          ) : (
            <>
              {/* Items List */}
              <div className="space-y-2.5">
                {cart.map(({ item, quantity }) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between gap-3"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 rounded-lg object-cover bg-slate-800 shrink-0"
                    />

                    <div className="flex-1 min-w-0">
                      <h5 className="font-bold text-xs text-slate-200 truncate">{item.name}</h5>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="font-mono text-xs text-emerald-400 font-semibold">
                          ₹{item.price}
                        </span>
                        <span className="text-[9px] uppercase font-bold text-slate-500">
                          {item.station}
                        </span>
                      </div>
                    </div>

                    {/* Quantity controls */}
                    <div className="flex items-center bg-slate-900 border border-slate-700 rounded-lg p-0.5">
                      <button
                        onClick={() => updateCartQuantity(item.id, -1)}
                        className="p-1 text-slate-400 hover:text-slate-200 transition"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2 font-mono font-bold text-xs text-slate-200">
                        {quantity}
                      </span>
                      <button
                        onClick={() => updateCartQuantity(item.id, 1)}
                        className="p-1 text-slate-400 hover:text-slate-200 transition"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-1 text-slate-500 hover:text-rose-400 transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Dynamic ETA Calculation Box */}
              <div className="p-3.5 rounded-xl bg-gradient-to-r from-emerald-950/40 via-teal-950/30 to-slate-950 border border-emerald-500/30 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300 flex items-center gap-1.5 font-semibold">
                    <Clock className="w-3.5 h-3.5 text-emerald-400" />
                    Estimated Kitchen Prep Time:
                  </span>
                  <span className="font-mono font-bold text-emerald-400 text-sm">
                    {estimatedTimeStr}
                  </span>
                </div>
                <p className="text-[10px] text-slate-400">
                  ⚡ Dynamically calculated based on recipe prep time + {activeWorkload} active items in kitchen queue.
                </p>
              </div>

              {/* Time Slot Picker */}
              <SlotPicker />

              {/* Student Details & Instructions */}
              <div className="space-y-2.5 pt-2 border-t border-slate-800">
                <label className="text-xs font-bold text-slate-200 block">Student Information</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Name"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:border-emerald-500 focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Roll No (e.g. 2024CS082)"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <input
                  type="text"
                  placeholder="Special instructions (e.g. Less mayo, extra napkins)"
                  value={cookingNotes}
                  onChange={(e) => setCookingNotes(e.target.value)}
                  className="w-full p-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              {/* Payment Methods */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <label className="text-xs font-bold text-slate-200 block">Payment Method</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setPaymentMethod('CAMPUS_CARD')}
                    className={`p-2.5 rounded-xl border flex items-center gap-2 text-xs font-semibold transition ${
                      paymentMethod === 'CAMPUS_CARD'
                        ? 'bg-emerald-950/40 border-emerald-500/60 text-emerald-300'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    <Wallet className="w-4 h-4 text-emerald-400" />
                    <span>Campus Card</span>
                  </button>

                  <button
                    onClick={() => setPaymentMethod('UPI')}
                    className={`p-2.5 rounded-xl border flex items-center gap-2 text-xs font-semibold transition ${
                      paymentMethod === 'UPI'
                        ? 'bg-emerald-950/40 border-emerald-500/60 text-emerald-300'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    <CreditCard className="w-4 h-4 text-cyan-400" />
                    <span>Instant UPI</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer Checkout Bar */}
        {cart.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-slate-800 bg-slate-950/90 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400 font-medium">Total Bill:</span>
              <span className="font-mono text-xl font-extrabold text-slate-100">
                ₹{totalAmount}
              </span>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-extrabold text-sm shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all transform active:scale-98"
            >
              <span>Confirm & Lock Pickup Slot ({currentSlot.startTime})</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <p className="text-[10px] text-slate-500 text-center flex items-center justify-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              Slot capacity guaranteed. Instant refund if cancelled.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
