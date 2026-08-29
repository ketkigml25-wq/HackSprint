import React, { useState } from 'react';
import { useCanteen } from '../../context/CanteenContext';
import {
  ShieldAlert,
  Lock,
  KeyRound,
  ArrowLeft,
  ChefHat,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';
import { soundFx } from '../../services/audioService';

export const AccessDenied: React.FC = () => {
  const { setRole, currentUser, switchUserAccount } = useCanteen();
  const [pinInput, setPinInput] = useState('');
  const [showPinModal, setShowPinModal] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === '7788' || pinInput === '1234' || pinInput === '9999') {
      soundFx.playScannerSuccess();
      switchUserAccount('STAFF');
      setShowPinModal(false);
      setErrorMsg('');
    } else {
      soundFx.playWarning();
      setErrorMsg('Invalid Security PIN! (Demo PIN: 7788 or 1234)');
    }
  };

  const handleQuickDemoStaff = () => {
    soundFx.playScannerSuccess();
    switchUserAccount('STAFF');
  };

  const handleQuickDemoManager = () => {
    soundFx.playScannerSuccess();
    switchUserAccount('MANAGER');
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 flex flex-col items-center justify-center min-h-[70vh]">
      <div className="w-full bg-gradient-to-b from-slate-900/90 via-slate-900/80 to-slate-950 border border-rose-500/30 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-xl relative overflow-hidden text-center">
        {/* Glow ambient background */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-72 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Shield Icon with Animated Lock */}
        <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-rose-950/60 border border-rose-500/40 text-rose-400 mb-6 shadow-lg shadow-rose-500/20">
          <ShieldAlert className="w-10 h-10 animate-pulse" />
          <div className="absolute -bottom-1 -right-1 p-1.5 rounded-xl bg-slate-950 border border-rose-500/50 text-rose-400">
            <Lock className="w-4 h-4" />
          </div>
        </div>

        {/* Access Denied Header */}
        <div className="space-y-2 max-w-lg mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40">
            <AlertTriangle className="w-3.5 h-3.5" />
            403 • SECURITY CLEARANCE REQUIRED
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
            Kitchen KDS Access Denied
          </h2>

          <p className="text-sm text-slate-400">
            The Kitchen Display System (KDS) and cooking queue terminal are strictly restricted to{' '}
            <strong className="text-slate-200">Staff</strong> and <strong className="text-slate-200">Manager</strong> roles.
          </p>
        </div>

        {/* Current Active Role Box */}
        <div className="my-6 p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800/80 max-w-md mx-auto flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-left">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center font-bold">
              👤
            </div>
            <div>
              <span className="font-bold text-slate-200 block">{currentUser.name}</span>
              <span className="text-[11px] text-slate-400">ID: {currentUser.rollOrEmpId}</span>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold uppercase bg-slate-800 text-slate-300 border border-slate-700">
            Role: {currentUser.role}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 max-w-md mx-auto">
          <button
            onClick={() => setRole('STUDENT')}
            className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition border border-slate-700 shadow-md"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Student Portal</span>
          </button>

          <button
            onClick={() => setShowPinModal(true)}
            className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-amber-500/20 transition transform active:scale-95"
          >
            <KeyRound className="w-4 h-4" />
            <span>Staff Passcode Unlock</span>
          </button>
        </div>

        {/* Quick Demo Bypass Credentials */}
        <div className="mt-8 pt-6 border-t border-slate-800/80 max-w-md mx-auto">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-2.5">
            Quick Role Switcher (Evaluation & Demo)
          </span>
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={handleQuickDemoStaff}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-amber-950/40 border border-slate-800 hover:border-amber-500/40 text-xs font-semibold text-amber-300 transition"
            >
              <ChefHat className="w-3.5 h-3.5" />
              <span>Switch to Chef Vikram (Staff)</span>
            </button>

            <button
              onClick={handleQuickDemoManager}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-cyan-950/40 border border-slate-800 hover:border-cyan-500/40 text-xs font-semibold text-cyan-300 transition"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Switch to Manager</span>
            </button>
          </div>
        </div>
      </div>

      {/* Staff PIN Passcode Modal */}
      {showPinModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-amber-500/30 rounded-3xl max-w-sm w-full p-6 shadow-2xl relative text-center">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center mx-auto mb-3">
              <KeyRound className="w-6 h-6" />
            </div>

            <h3 className="text-base font-bold text-slate-100">Staff Terminal Authentication</h3>
            <p className="text-xs text-slate-400 mt-1 mb-4">
              Enter 4-digit Kitchen Security PIN to unlock live KDS queue
            </p>

            <form onSubmit={handlePinSubmit} className="space-y-3">
              <input
                type="password"
                maxLength={4}
                autoFocus
                placeholder="• • • •"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                className="w-full text-center tracking-widest text-2xl font-mono py-2.5 px-4 rounded-xl bg-slate-950 border border-slate-800 focus:border-amber-500 focus:outline-none text-amber-300"
              />

              {errorMsg && (
                <p className="text-xs text-rose-400 font-semibold">{errorMsg}</p>
              )}

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPinModal(false)}
                  className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition"
                >
                  Verify & Enter
                </button>
              </div>

              <span className="text-[10px] text-slate-500 block pt-1 font-mono">
                Hint: Demo PIN is <strong>7788</strong> or <strong>1234</strong>
              </span>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
