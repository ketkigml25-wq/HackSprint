import React, { useState } from 'react';
import { useCanteen } from '../../context/CanteenContext';
import {
  X,
  Boxes,
  Plus,
  Minus
} from 'lucide-react';

interface BulkOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BulkOrderModal: React.FC<BulkOrderModalProps> = ({ isOpen, onClose }) => {
  const { menuItems, addBulkOrderRequest } = useCanteen();
  const [requesterName, setRequesterName] = useState('');
  const [department, setDepartment] = useState('');
  const [eventName, setEventName] = useState('');
  const [eventDate, setEventDate] = useState('Today, 29 Aug');
  const [pickupTime, setPickupTime] = useState('06:00 PM');
  const [selectedItemQuantities, setSelectedItemQuantities] = useState<{ [id: string]: number }>({
    'item-1': 20,
    'item-5': 20
  });

  if (!isOpen) return null;

  const handleUpdateQty = (id: string, delta: number) => {
    setSelectedItemQuantities(prev => {
      const curr = prev[id] || 0;
      const next = Math.max(0, curr + delta);
      return { ...prev, [id]: next };
    });
  };

  const selectedItems = Object.entries(selectedItemQuantities)
    .filter(([_, qty]) => qty > 0)
    .map(([id, qty]) => {
      const item = menuItems.find(m => m.id === id);
      return {
        name: item ? item.name : 'Item',
        quantity: qty,
        price: item ? item.price : 100
      };
    });

  const totalAmount = selectedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!requesterName || !department || !eventName || selectedItems.length === 0) {
      alert('Please fill all fields and select at least one item.');
      return;
    }

    addBulkOrderRequest({
      requesterName,
      department,
      eventName,
      eventDate,
      pickupTime,
      items: selectedItems,
      totalAmount
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-slate-900 border border-cyan-500/30 rounded-3xl max-w-lg w-full p-5 sm:p-6 shadow-2xl relative overflow-hidden">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Boxes className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">Submit Campus Bulk Request</h3>
              <p className="text-xs text-slate-400">For fests, clubs, workshops, and department meetings</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="my-4 space-y-3.5">
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">Coordinator Name</label>
              <input
                type="text"
                placeholder="Prof. or Club Lead"
                value={requesterName}
                onChange={e => setRequesterName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:border-cyan-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">Department / Society</label>
              <input
                type="text"
                placeholder="e.g. IEEE Student Branch"
                value={department}
                onChange={e => setDepartment(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:border-cyan-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-300 block mb-1">Event / Purpose</label>
            <input
              type="text"
              placeholder="e.g. Annual Tech Symposium Lunch"
              value={eventName}
              onChange={e => setEventName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">Target Date</label>
              <input
                type="text"
                value={eventDate}
                onChange={e => setEventDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:border-cyan-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">Pickup Time</label>
              <input
                type="text"
                value={pickupTime}
                onChange={e => setPickupTime(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:border-cyan-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Select Items for Bulk Prep */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <label className="text-[11px] font-bold text-slate-200 block">Select Quantities (min 15 items)</label>
            <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
              {menuItems.slice(0, 4).map(item => {
                const qty = selectedItemQuantities[item.id] || 0;
                return (
                  <div
                    key={item.id}
                    className="p-2 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs"
                  >
                    <span className="font-semibold text-slate-200 truncate max-w-[180px]">
                      {item.name} (₹{item.price})
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleUpdateQty(item.id, -5)}
                        className="p-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-300"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="font-mono font-bold text-xs text-cyan-300 w-6 text-center">
                        {qty}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleUpdateQty(item.id, 5)}
                        className="p-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-300"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Total */}
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-400 font-medium">Estimated Total Quote:</span>
            <span className="font-mono text-base font-extrabold text-cyan-300">
              ₹{totalAmount}
            </span>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 transition"
          >
            Submit for Canteen Manager Approval
          </button>
        </form>
      </div>
    </div>
  );
};
