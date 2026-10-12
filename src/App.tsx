import React, { useState, useEffect } from 'react';
import { StudentRegistrationCard } from './components/StudentRegistrationCard';
import { RegisteredStudentsModal } from './components/RegisteredStudentsModal';
import { HealthStatus } from './types/student';
import { fetchHealth } from './services/api';
import { Database } from 'lucide-react';

export default function App() {
  const [isStudentsModalOpen, setIsStudentsModalOpen] = useState(false);
  const [health, setHealth] = useState<HealthStatus | null>(null);

  const checkHealth = async () => {
    try {
      const res = await fetchHealth();
      setHealth(res.data);
    } catch (err) {
      console.error('Failed to query health endpoint:', err);
    }
  };

  useEffect(() => {
    checkHealth();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-blue-600 selection:text-white font-sans relative">
      {/* Discreet Minimalist Header */}
      <header className="w-full max-w-5xl mx-auto px-4 py-4 flex items-center">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="text-xs font-mono text-slate-400">
            Activity 3: Client-Server Application
          </span>
        </div>
      </header>

      {/* Main Centerpiece: Focused Student Registration Card with Fields */}
      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <StudentRegistrationCard
          onViewRegisteredStudents={() => setIsStudentsModalOpen(true)}
          onStudentRegistered={checkHealth}
        />
      </main>

      {/* Clean Minimalist Footer */}
      <footer className="w-full max-w-5xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 font-mono gap-2">
        <span>Student Registration System • Port 3000 (Express)</span>
        <div className="flex items-center gap-2 text-slate-400">
          <Database className="w-3 h-3 text-amber-400" />
          <span>Firebase Firestore Connected</span>
        </div>
      </footer>

      {/* Abstracted Modal: View Registered Students */}
      <RegisteredStudentsModal
        isOpen={isStudentsModalOpen}
        onClose={() => setIsStudentsModalOpen(false)}
        onRecordChanged={checkHealth}
      />
    </div>
  );
}
