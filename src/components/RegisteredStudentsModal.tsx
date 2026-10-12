import React, { useState, useEffect } from 'react';
import {
  X,
  Users,
  RefreshCw,
  Trash2,
  Clock,
  BookOpen,
  Search,
  Sparkles,
  Database,
  CheckCircle2,
} from 'lucide-react';
import { Student } from '../types/student';
import { fetchStudents, removeStudent, seedSampleStudents } from '../services/api';

interface RegisteredStudentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRecordChanged?: () => void;
}

export const RegisteredStudentsModal: React.FC<RegisteredStudentsModalProps> = ({
  isOpen,
  onClose,
  onRecordChanged,
}) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [storageEngine, setStorageEngine] = useState('Firebase Firestore');

  const loadData = async () => {
    setIsLoading(true);
    try {
      const res = await fetchStudents();
      if (res.data.data) {
        setStudents(res.data.data);
      }
      if (res.data.storageEngine) {
        setStorageEngine(res.data.storageEngine);
      }
    } catch (err) {
      console.error('Error fetching students:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this student record from the database?')) {
      return;
    }
    setDeletingId(id);
    try {
      await removeStudent(id);
      await loadData();
      if (onRecordChanged) onRecordChanged();
    } catch (err) {
      console.error('Delete error:', err);
    } finally {
      setDeletingId(null);
    }
  };

  const handleSeed = async () => {
    setIsSeeding(true);
    try {
      await seedSampleStudents();
      await loadData();
      if (onRecordChanged) onRecordChanged();
    } catch (err) {
      console.error('Seed error:', err);
    } finally {
      setIsSeeding(false);
    }
  };

  if (!isOpen) return null;

  const filtered = students.filter(
    (s) =>
      s.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.course.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.studentId && s.studentId.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white">Registered Students</h3>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  {students.length} Records
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">
                Source: <span className="text-amber-400">{storageEngine}</span> (Retrieved via HTTP GET /api/students)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={loadData}
              disabled={isLoading}
              title="Refresh list from database"
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-blue-400' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Search & Actions Bar */}
        <div className="p-4 bg-slate-950/50 border-b border-slate-800 flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by student name or course..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-700 focus:border-blue-500 text-xs text-white placeholder-slate-500 outline-none transition"
            />
          </div>

          <button
            onClick={handleSeed}
            disabled={isSeeding}
            className="w-full sm:w-auto px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-indigo-300 border border-slate-700 text-xs font-medium flex items-center justify-center gap-1.5 transition"
          >
            <Sparkles className="w-3.5 h-3.5" />
            {isSeeding ? 'Seeding...' : 'Seed Sample Students'}
          </button>
        </div>

        {/* Modal Table Body */}
        <div className="flex-1 overflow-auto p-4 sm:p-6">
          {isLoading ? (
            <div className="py-16 text-center space-y-3">
              <RefreshCw className="w-8 h-8 text-blue-400 animate-spin mx-auto" />
              <p className="text-xs text-slate-400">Loading student records from persistent database...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-800 text-slate-500 mx-auto flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-semibold text-white">No Registered Students Found</h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                {searchQuery
                  ? 'No records matched your search query.'
                  : 'No student records have been saved yet. Use the registration card to add a student or click "Seed Sample Students".'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-slate-800">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                  <tr>
                    <th className="px-4 py-3">Student Name</th>
                    <th className="px-4 py-3">Course</th>
                    <th className="px-4 py-3">Registration Timestamp</th>
                    <th className="px-4 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  {filtered.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-800/40 transition">
                      <td className="px-4 py-3.5 font-semibold text-white">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-lg bg-blue-600/30 text-blue-300 font-bold flex items-center justify-center text-[10px]">
                            {s.studentName.slice(0, 2).toUpperCase()}
                          </div>
                          <span>{s.studentName}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-blue-500/10 text-blue-300 border border-blue-500/20 font-medium">
                          <BookOpen className="w-3 h-3 text-blue-400" />
                          {s.course}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-slate-400 font-mono text-[11px]">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3 h-3 text-slate-500" />
                          {new Date(s.registrationTimestamp).toLocaleDateString()} at{' '}
                          {new Date(s.registrationTimestamp).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <button
                          onClick={() => handleDelete(s.id)}
                          disabled={deletingId === s.id}
                          title="Delete from database"
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-900/50 text-slate-400 hover:text-rose-300 border border-slate-700 hover:border-rose-700/50 transition"
                        >
                          {deletingId === s.id ? (
                            <RefreshCw className="w-3.5 h-3.5 animate-spin text-rose-400" />
                          ) : (
                            <Trash2 className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Records permanently saved in Firestore database.</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
