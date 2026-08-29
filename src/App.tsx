import React, { useState } from 'react';
import { CanteenProvider, useCanteen } from './context/CanteenContext';
import { Header } from './components/common/Header';
import { LiveSimulationPanel } from './components/common/LiveSimulationPanel';
import { StudentView } from './components/student/StudentView';
import { KitchenDisplay } from './components/kitchen/KitchenDisplay';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AccessDenied } from './components/common/AccessDenied';

const AppContent: React.FC = () => {
  const { role, isKitchenAuthorized } = useCanteen();
  const [isMobileFrame, setIsMobileFrame] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-emerald-500 selection:text-slate-950 relative overflow-x-hidden">
      {/* Top Header */}
      <Header isMobileFrame={isMobileFrame} setIsMobileFrame={setIsMobileFrame} />

      {/* Main Dynamic View based on Active Role with Access Guard */}
      <main className="flex-1">
        {role === 'STUDENT' && <StudentView isMobileFrame={isMobileFrame} />}
        {role === 'KITCHEN' && (
          isKitchenAuthorized ? <KitchenDisplay /> : <AccessDenied />
        )}
        {role === 'ADMIN' && <AdminDashboard />}
      </main>

      {/* Interactive Simulation & Testbench Floating Lab */}
      <LiveSimulationPanel />

      {/* Modern Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-4 px-4 sm:px-8 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span className="font-semibold text-slate-400">ByteBite OS v2.4</span>
          <span>• Smart Canteen & Workload Engine</span>
        </div>
        <div>Role-Based Security • Zero Waiting Queues • Live Workload Balancing</div>
      </footer>
    </div>
  );
};

export function App() {
  return (
    <CanteenProvider>
      <AppContent />
    </CanteenProvider>
  );
}

export default App;
