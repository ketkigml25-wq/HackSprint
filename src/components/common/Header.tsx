import React, { useState } from 'react';
import { useCanteen } from '../../context/CanteenContext';
import {
  Zap,
  ShoppingBag,
  ChefHat,
  BarChart3,
  Volume2,
  VolumeX,
  Clock,
  Flame,
  Sparkles,
  Smartphone,
  Lock,
  UserCheck,
  ChevronDown
} from 'lucide-react';
import type { AccountRole } from '../../types';

export const Header: React.FC<{ isMobileFrame: boolean; setIsMobileFrame: (val: boolean) => void }> = ({
  isMobileFrame,
  setIsMobileFrame
}) => {
  const {
    role,
    setRole,
    currentUser,
    switchUserAccount,
    isKitchenAuthorized,
    cart,
    orders,
    currentClock,
    activeWorkload,
    isMuted,
    toggleMute,
    bulkRequests
  } = useCanteen();

  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const activeOrdersCount = orders.filter(o => o.status === 'QUEUED' || o.status === 'PREPARING').length;
  const pendingBulkCount = bulkRequests.filter(b => b.status === 'PENDING').length;

  const getRushBadge = () => {
    if (activeWorkload > 20) {
      return (
        <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/20 text-rose-400 border border-rose-500/30 animate-pulse">
          <Flame className="w-3.5 h-3.5 text-rose-400" />
          Rush Surge: {activeWorkload} items in queue
        </span>
      );
    }
    if (activeWorkload > 10) {
      return (
        <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
          <Zap className="w-3.5 h-3.5 text-amber-400" />
          Moderate Rush: {activeWorkload} items
        </span>
      );
    }
    return (
      <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
        <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
        Kitchen Optimal: Fast Prep
      </span>
    );
  };

  const handleAccountSwitch = (newRole: AccountRole) => {
    switchUserAccount(newRole);
    setShowUserDropdown(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-400 p-0.5 shadow-lg shadow-emerald-500/20 flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Zap className="w-5 h-5 text-emerald-400 fill-emerald-400/30" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-extrabold tracking-tight bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
                  ByteBite OS
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Smart Canteen
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">Workload & Slot Allocation Engine</p>
            </div>
          </div>

          {/* Rush status indicator & Simulated Clock */}
          <div className="hidden md:flex items-center gap-3">
            {getRushBadge()}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs text-slate-300 font-mono">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              {currentClock}
            </div>
          </div>

          {/* Role Navigation Switcher */}
          <div className="flex items-center bg-slate-900/90 p-1 rounded-xl border border-slate-800 shadow-inner">
            <button
              onClick={() => setRole('STUDENT')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                role === 'STUDENT'
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Student</span>
              {totalCartCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-slate-950 text-emerald-300">
                  {totalCartCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setRole('KITCHEN')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 relative ${
                role === 'KITCHEN'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <ChefHat className="w-3.5 h-3.5" />
              <span>Kitchen KDS</span>
              {!isKitchenAuthorized && (
                <Lock className="w-3 h-3 text-rose-400" />
              )}
              {activeOrdersCount > 0 && isKitchenAuthorized && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-slate-950 text-amber-300">
                  {activeOrdersCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setRole('ADMIN')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                role === 'ADMIN'
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Manager</span>
              {pendingBulkCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping" />
              )}
            </button>
          </div>

          {/* User Account / Identity Switcher & Tools */}
          <div className="flex items-center gap-2">
            {/* User Profile Badge with Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs text-slate-300 transition"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="font-semibold text-slate-200 hidden sm:inline">{currentUser.name}</span>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-slate-800 text-slate-400 border border-slate-700">
                  {currentUser.role}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
              </button>

              {showUserDropdown && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-2 z-50 animate-in fade-in duration-150">
                  <div className="px-3 py-2 border-b border-slate-800 mb-1">
                    <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">
                      Active Account
                    </span>
                    <span className="text-xs font-bold text-slate-200 block">{currentUser.name}</span>
                    <span className="text-[11px] text-slate-400 font-mono">ID: {currentUser.rollOrEmpId}</span>
                  </div>

                  <span className="text-[10px] uppercase font-bold text-slate-500 px-3 py-1 block">
                    Switch Persona:
                  </span>

                  <button
                    onClick={() => handleAccountSwitch('STUDENT')}
                    className={`w-full px-3 py-2 rounded-xl text-xs flex items-center justify-between text-left transition ${
                      currentUser.role === 'STUDENT'
                        ? 'bg-emerald-500/20 text-emerald-300 font-bold'
                        : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <span>Khushi S. (Student)</span>
                    {currentUser.role === 'STUDENT' && <UserCheck className="w-3.5 h-3.5 text-emerald-400" />}
                  </button>

                  <button
                    onClick={() => handleAccountSwitch('STAFF')}
                    className={`w-full px-3 py-2 rounded-xl text-xs flex items-center justify-between text-left transition ${
                      currentUser.role === 'STAFF'
                        ? 'bg-amber-500/20 text-amber-300 font-bold'
                        : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <span>Chef Vikram (Staff)</span>
                    {currentUser.role === 'STAFF' && <UserCheck className="w-3.5 h-3.5 text-amber-400" />}
                  </button>

                  <button
                    onClick={() => handleAccountSwitch('MANAGER')}
                    className={`w-full px-3 py-2 rounded-xl text-xs flex items-center justify-between text-left transition ${
                      currentUser.role === 'MANAGER'
                        ? 'bg-cyan-500/20 text-cyan-300 font-bold'
                        : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <span>Dr. Sengupta (Manager)</span>
                    {currentUser.role === 'MANAGER' && <UserCheck className="w-3.5 h-3.5 text-cyan-400" />}
                  </button>
                </div>
              )}
            </div>

            {/* Mobile frame toggle */}
            {role === 'STUDENT' && (
              <button
                onClick={() => setIsMobileFrame(!isMobileFrame)}
                title="Toggle Mobile Simulator Frame"
                className={`p-2 rounded-lg border transition-all ${
                  isMobileFrame
                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                }`}
              >
                <Smartphone className="w-4 h-4" />
              </button>
            )}

            {/* Sound toggle */}
            <button
              onClick={toggleMute}
              title={isMuted ? 'Unmute Sound FX' : 'Mute Sound FX'}
              className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
