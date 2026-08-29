import React from 'react';
import { useCanteen } from '../../context/CanteenContext';
import { Clock, Users, Flame, CheckCircle } from 'lucide-react';
import { soundFx } from '../../services/audioService';

export const SlotPicker: React.FC = () => {
  const { timeSlots, selectedSlotId, setSelectedSlotId, cart } = useCanteen();
  const cartItemCount = cart.reduce((sum, c) => sum + c.quantity, 0);

  const handleSelectSlot = (slotId: string, isAvailable: boolean) => {
    if (!isAvailable) {
      soundFx.playWarning();
      return;
    }
    soundFx.playTap();
    setSelectedSlotId(slotId);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-emerald-400" />
          <span>Select Food Pickup Time Slot</span>
        </label>
        <span className="text-[11px] text-slate-400 font-mono">
          Cart Items: <strong className="text-emerald-400">{cartItemCount}</strong>
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
        {timeSlots.map((slot) => {
          const isSelected = selectedSlotId === slot.id;
          const loadPercent = Math.min(100, Math.round((slot.currentLoad / slot.maxCapacity) * 100));
          const wouldExceed = slot.currentLoad + cartItemCount > slot.maxCapacity;
          const isAvailable = slot.isAvailable && !wouldExceed;

          return (
            <div
              key={slot.id}
              onClick={() => handleSelectSlot(slot.id, isAvailable)}
              className={`p-3 rounded-xl border transition-all relative overflow-hidden cursor-pointer ${
                !isAvailable
                  ? 'bg-slate-950/40 border-slate-800/60 opacity-60 cursor-not-allowed'
                  : isSelected
                  ? 'bg-emerald-950/40 border-emerald-500/70 shadow-lg shadow-emerald-500/10'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Header */}
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-xs text-slate-100">
                  {slot.startTime}
                </span>
                {isSelected ? (
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                ) : !isAvailable ? (
                  <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300">
                    FULL
                  </span>
                ) : slot.isPeak ? (
                  <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 flex items-center gap-0.5">
                    <Flame className="w-2.5 h-2.5" /> Surge
                  </span>
                ) : null}
              </div>

              {/* Lecture Break Tag */}
              {slot.lectureBreakTag && (
                <p className="text-[10px] text-slate-400 truncate mt-1">
                  {slot.lectureBreakTag}
                </p>
              )}

              {/* Kitchen Workload Bar */}
              <div className="mt-2.5 space-y-1">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-slate-500 flex items-center gap-1">
                    <Users className="w-2.5 h-2.5" /> Kitchen Load:
                  </span>
                  <span
                    className={`font-mono font-semibold ${
                      loadPercent >= 90
                        ? 'text-rose-400'
                        : loadPercent >= 60
                        ? 'text-amber-400'
                        : 'text-emerald-400'
                    }`}
                  >
                    {slot.currentLoad}/{slot.maxCapacity} items
                  </span>
                </div>

                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      loadPercent >= 90
                        ? 'bg-rose-500'
                        : loadPercent >= 60
                        ? 'bg-amber-500'
                        : 'bg-emerald-500'
                    }`}
                    style={{ width: `${loadPercent}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
