import React, { useState } from 'react';
import { useCanteen } from '../../context/CanteenContext';
import { CLASS_SCHEDULE_PRESETS } from '../../services/queueEngine';
import {
  X,
  BookOpen,
  Sparkles,
  CheckCircle2,
  Clock,
  MapPin,
  ArrowRight
} from 'lucide-react';
import { soundFx } from '../../services/audioService';

interface ClassSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ClassSyncModal: React.FC<ClassSyncModalProps> = ({ isOpen, onClose }) => {
  const { setSelectedSlotId, timeSlots } = useCanteen();
  const [selectedClassId, setSelectedClassId] = useState<string>('c1');
  const [syncedSuccess, setSyncedSuccess] = useState(false);

  if (!isOpen) return null;

  const currentClass = CLASS_SCHEDULE_PRESETS.find(c => c.id === selectedClassId) || CLASS_SCHEDULE_PRESETS[0];
  const targetSlot = timeSlots.find(s => s.id === currentClass.suggestedSlotId) || timeSlots[0];

  const handleApplySync = () => {
    setSelectedSlotId(targetSlot.id);
    soundFx.playChime();
    setSyncedSuccess(true);
    setTimeout(() => {
      setSyncedSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-slate-900 border border-emerald-500/30 rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-2xl relative overflow-hidden">
        {/* Glow decoration */}
        <div className="absolute -top-12 -right-12 w-40 h-40 bg-emerald-500/10 rounded-full blur-2xl" />

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                Class Timetable Reverse Sync
              </h3>
              <p className="text-xs text-slate-400">Zero wait pickup coordinated with your lecture bell</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Class Selection Cards */}
        <div className="my-4 space-y-2.5">
          <label className="text-xs font-semibold text-slate-300 block">
            Select Your Ongoing / Next Class:
          </label>
          <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
            {CLASS_SCHEDULE_PRESETS.map((item) => {
              const isSelected = selectedClassId === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedClassId(item.id)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-emerald-950/40 border-emerald-500/60 shadow-lg shadow-emerald-500/10'
                      : 'bg-slate-950/50 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                        {item.courseCode}
                      </span>
                      <span className="font-semibold text-xs text-slate-200">{item.courseName}</span>
                    </div>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                  </div>

                  <div className="flex items-center gap-4 mt-2 text-[11px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-500" />
                      {item.room}
                    </span>
                    <span className="flex items-center gap-1 font-mono text-slate-300">
                      <Clock className="w-3 h-3 text-emerald-400" />
                      Class Ends: {item.endTime}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Reverse ETA Calculation Box */}
        <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">Lecture End Time:</span>
            <span className="font-mono font-bold text-slate-200">{currentClass.endTime}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">Kitchen Dispatch Trigger:</span>
            <span className="font-mono font-bold text-emerald-400 flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> 8 mins before bell
            </span>
          </div>
          <div className="flex items-center justify-between text-xs pt-1.5 border-t border-slate-800/80">
            <span className="text-slate-300 font-semibold">Assigned Pickup Window:</span>
            <span className="font-mono font-bold text-teal-300">{targetSlot.label}</span>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-5 flex gap-2.5">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition"
          >
            Cancel
          </button>
          <button
            onClick={handleApplySync}
            disabled={syncedSuccess}
            className={`flex-2 py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
              syncedSuccess
                ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/30'
                : 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950'
            }`}
          >
            {syncedSuccess ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Slot Synced Successfully!</span>
              </>
            ) : (
              <>
                <span>Sync & Reserve {targetSlot.startTime} Slot</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
