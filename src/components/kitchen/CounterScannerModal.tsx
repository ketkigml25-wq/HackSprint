import React, { useState } from 'react';
import { useCanteen } from '../../context/CanteenContext';
import {
  X,
  QrCode,
  CheckCircle2,
  AlertCircle,
  Scan
} from 'lucide-react';
import { soundFx } from '../../services/audioService';

interface CounterScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CounterScannerModal: React.FC<CounterScannerModalProps> = ({ isOpen, onClose }) => {
  const { orders, advanceOrderStatus } = useCanteen();
  const [manualTokenInput, setManualTokenInput] = useState('');
  const [scanResult, setScanResult] = useState<{ success: boolean; message: string; orderToken?: string } | null>(null);

  if (!isOpen) return null;

  const readyOrders = orders.filter(o => o.status === 'READY_FOR_PICKUP');

  const handleVerifyToken = (tokenToVerify: string) => {
    const clean = tokenToVerify.trim().toUpperCase();
    const matched = orders.find(o => o.token.toUpperCase() === clean || o.qrCodeHash.includes(clean));

    if (matched) {
      if (matched.status === 'COLLECTED') {
        soundFx.playWarning();
        setScanResult({ success: false, message: `Token ${matched.token} was ALREADY collected at ${matched.collectedAt}!` });
        return;
      }

      advanceOrderStatus(matched.id, 'COLLECTED');
      setScanResult({
        success: true,
        message: `Order #${matched.token} Verified! Handed over to ${matched.studentName}.`,
        orderToken: matched.token
      });
      setManualTokenInput('');
    } else {
      soundFx.playWarning();
      setScanResult({ success: false, message: `Token "${tokenToVerify}" not found in active order registry!` });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-slate-900 border border-emerald-500/30 rounded-3xl max-w-md w-full p-5 sm:p-6 shadow-2xl relative overflow-hidden">
        {/* Glow decoration */}
        <div className="absolute -top-12 -right-12 w-40 h-40 bg-emerald-500/10 rounded-full blur-2xl" />

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Scan className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">Counter Pickup Scanner</h3>
              <p className="text-xs text-slate-400">Scan student pass or enter token to release food</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Visual Scanner Camera Area */}
        <div className="my-5 flex flex-col items-center">
          <div className="w-48 h-48 rounded-2xl bg-slate-950 border-2 border-dashed border-emerald-500/50 flex flex-col items-center justify-center relative overflow-hidden shadow-inner">
            {/* Scan animation line */}
            <div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent scan-line" />
            <QrCode className="w-16 h-16 text-emerald-400/40" />
            <span className="text-[11px] font-mono text-emerald-400/80 mt-2">
              Align Pass inside box
            </span>
          </div>
        </div>

        {/* Quick Ready Orders List to 1-click verify */}
        <div className="space-y-2 mb-4">
          <span className="text-xs font-bold text-slate-300 block">
            Orders Awaiting Handover ({readyOrders.length}):
          </span>
          <div className="flex flex-wrap gap-2 max-h-28 overflow-y-auto pr-1">
            {readyOrders.length === 0 ? (
              <span className="text-xs text-slate-500 italic">No orders in ready shelves right now.</span>
            ) : (
              readyOrders.map(ord => (
                <button
                  key={ord.id}
                  onClick={() => handleVerifyToken(ord.token)}
                  className="px-2.5 py-1.5 rounded-xl bg-slate-950 border border-emerald-500/30 hover:bg-emerald-500/20 text-xs font-mono font-bold text-emerald-300 flex items-center gap-1.5 transition"
                >
                  <span>{ord.token}</span>
                  <span className="text-[10px] text-slate-400 font-sans">({ord.lockerNumber})</span>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Manual Token Input */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-300 block">Manual Token Verification</label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="e.g. B-14"
              value={manualTokenInput}
              onChange={(e) => setManualTokenInput(e.target.value)}
              className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 focus:border-emerald-500 focus:outline-none font-mono text-sm uppercase text-slate-100 placeholder:text-slate-500"
            />
            <button
              onClick={() => handleVerifyToken(manualTokenInput)}
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition"
            >
              Verify
            </button>
          </div>
        </div>

        {/* Scan Result Feedback */}
        {scanResult && (
          <div
            className={`mt-4 p-3 rounded-xl border text-xs flex items-center gap-2.5 ${
              scanResult.success
                ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300'
                : 'bg-rose-950/40 border-rose-500/50 text-rose-300'
            }`}
          >
            {scanResult.success ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            )}
            <span className="font-semibold">{scanResult.message}</span>
          </div>
        )}
      </div>
    </div>
  );
};
