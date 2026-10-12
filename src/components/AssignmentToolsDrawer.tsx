import React, { useState } from 'react';
import {
  X,
  Layers,
  Send,
  ShieldCheck,
  Camera,
  FileText,
  Server,
  Database,
  CheckCircle2,
} from 'lucide-react';
import { ArchitectureDiagram } from './ArchitectureDiagram';
import { CommunicationInspector } from './CommunicationInspector';
import { AutomatedTestSuite } from './AutomatedTestSuite';
import { AssessmentEvidence } from './AssessmentEvidence';
import { ProjectReport } from './ProjectReport';
import { HealthStatus } from '../types/student';

interface AssignmentToolsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  health: HealthStatus | null;
}

export const AssignmentToolsDrawer: React.FC<AssignmentToolsDrawerProps> = ({
  isOpen,
  onClose,
  health,
}) => {
  const [tab, setTab] = useState<'architecture' | 'inspector' | 'tests' | 'evidence' | 'report'>('architecture');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-6xl h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Drawer Header */}
        <div className="p-4 sm:p-6 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/95">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Activity 3: Client-Server Application
              </span>
              <span className="text-xs text-slate-400 font-mono">Architecture, Tests & Evidence</span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-white mt-1">
              Assignment Architecture & Testing Panel
            </h3>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center">
            {/* System Status Pill */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Express (Port 3000)</span>
              <span>•</span>
              <span className="text-amber-400">Firestore Connected</span>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="px-4 sm:px-6 bg-slate-950/60 border-b border-slate-800 flex gap-2 overflow-x-auto py-2.5 scrollbar-none">
          <button
            onClick={() => setTab('architecture')}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium flex items-center gap-2 transition whitespace-nowrap cursor-pointer ${
              tab === 'architecture'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Layers className="w-4 h-4" />
            3-Tier Architecture
          </button>
          <button
            onClick={() => setTab('inspector')}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium flex items-center gap-2 transition whitespace-nowrap cursor-pointer ${
              tab === 'inspector'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Send className="w-4 h-4" />
            Communication Inspector
          </button>
          <button
            onClick={() => setTab('tests')}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium flex items-center gap-2 transition whitespace-nowrap cursor-pointer ${
              tab === 'tests'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            Automated Tests
          </button>
          <button
            onClick={() => setTab('evidence')}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium flex items-center gap-2 transition whitespace-nowrap cursor-pointer ${
              tab === 'evidence'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Camera className="w-4 h-4" />
            Assessment Evidence
          </button>
          <button
            onClick={() => setTab('report')}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium flex items-center gap-2 transition whitespace-nowrap cursor-pointer ${
              tab === 'report'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <FileText className="w-4 h-4" />
            Academic Report
          </button>
        </div>

        {/* Drawer Content */}
        <div className="flex-1 overflow-auto p-4 sm:p-8 bg-slate-950/30">
          {tab === 'architecture' && <ArchitectureDiagram />}
          {tab === 'inspector' && <CommunicationInspector />}
          {tab === 'tests' && <AutomatedTestSuite />}
          {tab === 'evidence' && <AssessmentEvidence />}
          {tab === 'report' && <ProjectReport />}
        </div>
      </div>
    </div>
  );
};
