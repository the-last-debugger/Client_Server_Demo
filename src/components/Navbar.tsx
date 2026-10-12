import React from 'react';
import { Server, Database, CheckCircle2, AlertCircle, RefreshCw, Layers, ShieldCheck, FileText, Send, Camera } from 'lucide-react';
import { HealthStatus } from '../types/student';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  health: HealthStatus | null;
  healthLoading: boolean;
  onRefreshHealth: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  health,
  healthLoading,
  onRefreshHealth,
}) => {
  const tabs = [
    { id: 'registration', label: 'Student Registration', icon: Server },
    { id: 'architecture', label: '3-Tier Architecture', icon: Layers },
    { id: 'inspector', label: 'Communication Inspector', icon: Send },
    { id: 'tests', label: 'Automated Test Suite', icon: ShieldCheck },
    { id: 'evidence', label: 'Assessment Evidence', icon: Camera },
    { id: 'report', label: 'Academic Report', icon: FileText },
  ];

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white shadow-xl sticky top-0 z-50">
      {/* Top Academic Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Activity 3: Client-Server Application
              </span>
              <span className="text-xs text-slate-400 font-mono">
                Port: 3000 | Full-Stack
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white mt-1">
              Student Registration System
            </h1>
            <p className="text-xs text-slate-400">
              Demonstrating 3-Tier Layered Architecture (Client → HTTP API → Express Server → Firebase Firestore)
            </p>
          </div>

          {/* System Health Status Badges */}
          <div className="flex items-center flex-wrap gap-2 text-xs">
            {/* Server Badge */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/80">
              <Server className="w-3.5 h-3.5 text-blue-400" />
              <span className="text-slate-300">Server:</span>
              {health?.status === 'ONLINE' ? (
                <span className="inline-flex items-center gap-1 font-semibold text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  Online (Express)
                </span>
              ) : healthLoading ? (
                <span className="text-amber-400">Connecting...</span>
              ) : (
                <span className="text-rose-400">Offline</span>
              )}
            </div>

            {/* Database Badge */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/80">
              <Database className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-slate-300">Database:</span>
              {health?.database.status.includes('connected') || health?.database.status.includes('active') ? (
                <span className="inline-flex items-center gap-1 font-semibold text-emerald-400">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  Firestore Connected
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 font-semibold text-amber-400">
                  <AlertCircle className="w-3 h-3 text-amber-400" />
                  Local Sync
                </span>
              )}
            </div>

            {/* Refresh Health Button */}
            <button
              onClick={onRefreshHealth}
              disabled={healthLoading}
              title="Re-verify server and database health"
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${healthLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-slate-950/60 border-t border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-1 sm:space-x-2 overflow-x-auto py-2 scrollbar-none" aria-label="Tabs">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-900/40'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
};
