import React from 'react';
import { CAMPUS_RUSH_DATA } from '../../services/queueEngine';
import { Flame, Clock, Sparkles, TrendingUp, BookOpen } from 'lucide-react';

interface RushRadarProps {
  onOpenClassSync: () => void;
}

export const RushRadar: React.FC<RushRadarProps> = ({ onOpenClassSync }) => {
  return (
    <div className="bg-gradient-to-br from-slate-900/90 via-slate-900/70 to-slate-950/90 border border-slate-800 rounded-2xl p-4 sm:p-5 backdrop-blur-xl shadow-xl relative overflow-hidden">
      {/* Background glow decoration */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none" />

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <TrendingUp className="w-4 h-4" />
            </span>
            <h3 className="font-bold text-slate-100 text-sm sm:text-base flex items-center gap-2">
              Campus Rush Radar & Crowd Forecaster
            </h3>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 animate-pulse">
              Live AI Model
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time kitchen load based on class bell timetables & live order inflow
          </p>
        </div>

        {/* Sync with Timetable Button */}
        <button
          onClick={onOpenClassSync}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all transform active:scale-95 shrink-0"
        >
          <BookOpen className="w-3.5 h-3.5 text-slate-950" />
          <span>Sync My Class Schedule</span>
          <Sparkles className="w-3 h-3 text-slate-950" />
        </button>
      </div>

      {/* Visual Rush Bar Wave Chart */}
      <div className="grid grid-cols-6 gap-2 sm:gap-3 my-3">
        {CAMPUS_RUSH_DATA.map((point, index) => {
          const isHigh = point.crowdLevel >= 80;
          const isModerate = point.crowdLevel >= 40 && point.crowdLevel < 80;

          return (
            <div
              key={index}
              className={`p-2 sm:p-2.5 rounded-xl border flex flex-col justify-between transition-all duration-200 ${
                isHigh
                  ? 'bg-rose-950/20 border-rose-500/30 hover:border-rose-400/50'
                  : isModerate
                  ? 'bg-amber-950/20 border-amber-500/30 hover:border-amber-400/50'
                  : 'bg-emerald-950/20 border-emerald-500/30 hover:border-emerald-400/50'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono font-bold text-slate-300">
                  {point.time}
                </span>
                {isHigh && <Flame className="w-3.5 h-3.5 text-rose-400 animate-bounce" />}
              </div>

              {/* Progress bar fill */}
              <div className="my-2">
                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isHigh
                        ? 'bg-gradient-to-r from-amber-500 to-rose-500'
                        : isModerate
                        ? 'bg-gradient-to-r from-emerald-500 to-amber-500'
                        : 'bg-emerald-500'
                    }`}
                    style={{ width: `${point.crowdLevel}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-[10px]">
                <span className="font-semibold text-slate-400">{point.crowdLevel}% Load</span>
                <span
                  className={`font-bold ${
                    isHigh ? 'text-rose-400' : isModerate ? 'text-amber-400' : 'text-emerald-400'
                  }`}
                >
                  {isHigh ? 'Peak' : isModerate ? 'Medium' : 'Smooth'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Smart Prediction Banner */}
      <div className="mt-3 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-slate-300">
          <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>
            <strong className="text-emerald-300">Smart Advice:</strong> Order for{' '}
            <span className="font-mono text-emerald-400 font-bold">12:15 PM</span> or{' '}
            <span className="font-mono text-emerald-400 font-bold">01:15 PM</span> to skip the 180-student lecture hall rush.
          </span>
        </div>
      </div>
    </div>
  );
};
