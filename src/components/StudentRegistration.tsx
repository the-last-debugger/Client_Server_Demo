import React, { useState, useEffect } from 'react';
import {
  UserPlus,
  Users,
  CheckCircle2,
  AlertCircle,
  Clock,
  Trash2,
  RefreshCw,
  Search,
  Sparkles,
  Database,
  ArrowRight,
  Code2,
  Calendar,
  BookOpen,
  User,
  Hash,
  Mail,
  ShieldCheck,
  Check,
} from 'lucide-react';
import { ApiResponse, Student } from '../types/student';
import { createStudent, fetchStudents, removeStudent, seedSampleStudents } from '../services/api';

interface StudentRegistrationProps {
  onTransactionComplete?: () => void;
}

export const StudentRegistration: React.FC<StudentRegistrationProps> = ({ onTransactionComplete }) => {
  // Form State
  const [studentName, setStudentName] = useState('');
  const [course, setCourse] = useState('');
  const [studentId, setStudentId] = useState('');
  const [email, setEmail] = useState('');

  // UI & Loading States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingStudents, setIsLoadingStudents] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Response Feedback
  const [lastResponse, setLastResponse] = useState<{
    status: number;
    data: ApiResponse;
    durationMs: number;
    timestamp: string;
  } | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [showJsonInspector, setShowJsonInspector] = useState(false);

  // Registered Students List State
  const [students, setStudents] = useState<Student[]>([]);
  const [storageEngine, setStorageEngine] = useState<string>('Firebase Firestore');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourseFilter, setSelectedCourseFilter] = useState('ALL');

  // Load registered students on initial mount
  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    setIsLoadingStudents(true);
    try {
      const res = await fetchStudents();
      if (res.data.data) {
        setStudents(res.data.data);
      }
      if (res.data.storageEngine) {
        setStorageEngine(res.data.storageEngine);
      }
      if (onTransactionComplete) onTransactionComplete();
    } catch (err) {
      console.error('Error fetching students:', err);
    } finally {
      setIsLoadingStudents(false);
    }
  };

  // Handle Form Submission (Register Student)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Client-side quick check
    if (!studentName.trim()) {
      setFormError('Please enter the student name.');
      return;
    }
    if (!course.trim()) {
      setFormError('Please enter the enrolled course.');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        studentName: studentName.trim(),
        course: course.trim(),
        studentId: studentId.trim() || undefined,
        email: email.trim() || undefined,
      };

      const result = await createStudent(payload);

      setLastResponse({
        status: result.status,
        data: result.data,
        durationMs: result.durationMs,
        timestamp: new Date().toLocaleTimeString(),
      });

      if (result.status === 201 && result.data.success) {
        // Clear form inputs
        setStudentName('');
        setCourse('');
        setStudentId('');
        setEmail('');
        setFormError(null);
        // Refresh registered students list from database
        await loadStudents();
      } else {
        setFormError(result.data.error || 'Server rejected registration request.');
      }
    } catch (err) {
      console.error('Registration failed:', err);
      setFormError('Network communication error: Unable to reach the server.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Record Deletion
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this student record from the database?')) {
      return;
    }
    setDeletingId(id);
    try {
      const res = await removeStudent(id);
      setLastResponse({
        status: res.status,
        data: res.data,
        durationMs: res.durationMs,
        timestamp: new Date().toLocaleTimeString(),
      });
      await loadStudents();
    } catch (err) {
      console.error('Delete error:', err);
    } finally {
      setDeletingId(null);
    }
  };

  // Handle Quick Pre-fill
  const handlePrefill = (preset: 'cs' | 'se' | 'ds') => {
    const presets = {
      cs: {
        name: 'Jordan Miller',
        course: 'B.Sc. Computer Science',
        id: `CS-${Math.floor(1000 + Math.random() * 9000)}`,
        email: 'jordan.miller@campus.edu',
      },
      se: {
        name: 'Elena Rostova',
        course: 'B.Eng. Software Engineering',
        id: `SE-${Math.floor(1000 + Math.random() * 9000)}`,
        email: 'elena.rostova@campus.edu',
      },
      ds: {
        name: 'Kwame Mensah',
        course: 'B.Sc. Data Science & Analytics',
        id: `DS-${Math.floor(1000 + Math.random() * 9000)}`,
        email: 'kwame.mensah@campus.edu',
      },
    };
    const chosen = presets[preset];
    setStudentName(chosen.name);
    setCourse(chosen.course);
    setStudentId(chosen.id);
    setEmail(chosen.email);
    setFormError(null);
  };

  // Handle Seeding Sample Data
  const handleSeed = async () => {
    setIsSeeding(true);
    try {
      const res = await seedSampleStudents();
      setLastResponse({
        status: res.status,
        data: res.data,
        durationMs: res.durationMs,
        timestamp: new Date().toLocaleTimeString(),
      });
      await loadStudents();
    } catch (err) {
      console.error('Seed error:', err);
    } finally {
      setIsSeeding(false);
    }
  };

  // Scroll to registered students section
  const handleScrollToStudents = () => {
    loadStudents();
    const el = document.getElementById('students-records-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Filter students
  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.course.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.studentId && s.studentId.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (s.email && s.email.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCourse =
      selectedCourseFilter === 'ALL' || s.course.toLowerCase() === selectedCourseFilter.toLowerCase();

    return matchesSearch && matchesCourse;
  });

  const uniqueCourses = Array.from(new Set(students.map((s) => s.course)));

  return (
    <div className="space-y-8">
      {/* Overview Banner */}
      <div className="bg-gradient-to-r from-blue-900/40 via-indigo-900/30 to-slate-900 p-6 rounded-2xl border border-blue-800/50 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                Layer 1: Presentation Layer
              </span>
              <span className="text-xs text-slate-400">React Client Interface</span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Student Registration Portal
            </h2>
            <p className="text-sm text-slate-300 max-w-2xl">
              Register students using the validated form below. Upon submission, an HTTP POST request is dispatched to the Express server, validated, and permanently written to the cloud Firestore database.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleScrollToStudents}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium text-sm flex items-center gap-2 transition shadow-sm"
            >
              <Users className="w-4 h-4 text-blue-400" />
              View Registered Students ({students.length})
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Form + Live Protocol Trace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Registration Form (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-xl p-6 sm:p-8">
            <div className="flex items-center justify-between pb-5 border-b border-slate-800 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Register New Student</h3>
                  <p className="text-xs text-slate-400">Enter student details to initiate server-side registration</p>
                </div>
              </div>

              {/* Sample Pre-fill Pills */}
              <div className="hidden sm:flex items-center gap-1.5 text-xs">
                <span className="text-slate-400 mr-1 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-400" /> Pre-fill:
                </span>
                <button
                  type="button"
                  onClick={() => handlePrefill('cs')}
                  className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition border border-slate-700"
                >
                  CS
                </button>
                <button
                  type="button"
                  onClick={() => handlePrefill('se')}
                  className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition border border-slate-700"
                >
                  SE
                </button>
                <button
                  type="button"
                  onClick={() => handlePrefill('ds')}
                  className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition border border-slate-700"
                >
                  DS
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Field 1: Student Name */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-blue-400" />
                  Student Full Name <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Alexander Hamilton"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-white placeholder-slate-500 text-sm transition outline-none"
                />
                <p className="mt-1 text-xs text-slate-500">
                  Required field. Verified by server-side validation rules (min 2 characters).
                </p>
              </div>

              {/* Field 2: Course / Program */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-blue-400" />
                  Academic Course / Program <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., B.Sc. Computer Science"
                  value={course}
                  onChange={(e) => setCourse(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-white placeholder-slate-500 text-sm transition outline-none"
                />
                <p className="mt-1 text-xs text-slate-500">
                  Required field. The academic degree or diploma program.
                </p>
              </div>

              {/* Field 3 & 4 (Grid): Student ID & College Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2 flex items-center gap-1.5">
                    <Hash className="w-3.5 h-3.5 text-indigo-400" />
                    Student ID Code <span className="text-slate-500 text-[10px]">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., STU-2024-0492"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-white placeholder-slate-500 text-sm transition outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-indigo-400" />
                    College Email <span className="text-slate-500 text-[10px]">(Optional)</span>
                  </label>
                  <input
                    type="email"
                    placeholder="e.g., student@college.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-white placeholder-slate-500 text-sm transition outline-none"
                  />
                </div>
              </div>

              {/* Error Alert Banner */}
              {formError && (
                <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold block">Registration Rejected</span>
                    <span>{formError}</span>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-3">
                <div className="flex items-center gap-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 sm:flex-none px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 active:bg-blue-700 disabled:opacity-60 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Communicating with Server...
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-4 h-4" />
                        Register Student
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setStudentName('');
                      setCourse('');
                      setStudentId('');
                      setEmail('');
                      setFormError(null);
                    }}
                    className="px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium transition"
                  >
                    Clear
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleScrollToStudents}
                  className="px-4 py-3 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-blue-400 hover:text-blue-300 border border-slate-700 text-sm font-medium flex items-center justify-center gap-2 transition"
                >
                  <Users className="w-4 h-4" />
                  View Registered Students
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Column: Real-time Communication & Confirmation Panel (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-xl p-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Server Response Status</h3>
                  <p className="text-[11px] text-slate-400">Live HTTP Transaction Confirmation</p>
                </div>
              </div>
              {lastResponse && (
                <span
                  className={`px-2.5 py-1 rounded text-xs font-mono font-bold ${
                    lastResponse.status === 201 || lastResponse.status === 200
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                  }`}
                >
                  HTTP {lastResponse.status}
                </span>
              )}
            </div>

            {lastResponse ? (
              <div className="space-y-4">
                {/* Result Status Message */}
                <div
                  className={`p-4 rounded-xl border ${
                    lastResponse.status === 201 || lastResponse.status === 200
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200'
                      : 'bg-rose-500/10 border-rose-500/30 text-rose-200'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {lastResponse.status === 201 || lastResponse.status === 200 ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <h4 className="font-semibold text-sm">
                        {lastResponse.data.message || (lastResponse.data.success ? 'Success' : 'Error')}
                      </h4>
                      {lastResponse.data.error && (
                        <p className="text-xs text-rose-300 mt-1">{lastResponse.data.error}</p>
                      )}
                      {lastResponse.data.data && (
                        <p className="text-xs text-slate-300 mt-1">
                          Student <strong className="text-white">{lastResponse.data.data.studentName}</strong> registered for{' '}
                          <strong className="text-white">{lastResponse.data.data.course}</strong>
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Transaction Specs */}
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs space-y-2 font-mono">
                  <div className="flex justify-between items-center text-slate-400">
                    <span>Protocol:</span>
                    <span className="text-slate-200">HTTP/1.1 REST</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-400">
                    <span>Server Latency:</span>
                    <span className="text-emerald-400 font-semibold">{lastResponse.durationMs} ms</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-400">
                    <span>Database Engine:</span>
                    <span className="text-amber-300">{storageEngine}</span>
                  </div>
                  {lastResponse.data.databaseOperation && (
                    <div className="flex justify-between items-center text-slate-400">
                      <span>DB Transaction:</span>
                      <span className="text-blue-400 font-semibold">
                        {lastResponse.data.databaseOperation.status || 'COMMITTED'}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between items-center text-slate-400">
                    <span>Server Timestamp:</span>
                    <span className="text-slate-300 text-[10px]">
                      {lastResponse.data.serverTimestamp || lastResponse.timestamp}
                    </span>
                  </div>
                </div>

                {/* Inspect JSON Toggle */}
                <div>
                  <button
                    type="button"
                    onClick={() => setShowJsonInspector(!showJsonInspector)}
                    className="w-full py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono flex items-center justify-center gap-2 transition"
                  >
                    <Code2 className="w-3.5 h-3.5 text-blue-400" />
                    {showJsonInspector ? 'Hide Raw JSON Payload' : 'Inspect Server JSON Response'}
                  </button>
                  {showJsonInspector && (
                    <div className="mt-2 p-3 rounded-xl bg-slate-950 border border-slate-800 max-h-56 overflow-auto">
                      <pre className="text-[11px] font-mono text-emerald-400">
                        {JSON.stringify(lastResponse.data, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="py-8 px-4 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-slate-800 text-slate-400 mx-auto flex items-center justify-center">
                  <Database className="w-6 h-6 text-slate-500" />
                </div>
                <h4 className="text-sm font-semibold text-slate-300">Awaiting Request</h4>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  Submit the student registration form on the left to observe live HTTP communication, status codes, and database write confirmation.
                </p>
              </div>
            )}
          </div>

          {/* Quick Academic Notice Box */}
          <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 text-xs text-slate-400 space-y-1.5">
            <div className="flex items-center gap-1.5 text-slate-200 font-semibold">
              <Database className="w-3.5 h-3.5 text-amber-400" />
              Persistence Guarantee
            </div>
            <p>
              Registered student records are committed directly to Firebase Firestore. You can refresh or reload the page at any time to verify that saved records persist.
            </p>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* REGISTERED STUDENTS LIST / DATA LAYER TABLE */}
      {/* ============================================================== */}
      <div id="students-records-section" className="bg-slate-900 rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
        {/* Table Header & Controls */}
        <div className="p-6 border-b border-slate-800 bg-slate-900/80">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Layer 3: Data Layer
                </span>
                <span className="text-xs text-slate-400 font-mono">Engine: {storageEngine}</span>
              </div>
              <h3 className="text-xl font-bold text-white mt-1 flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-400" />
                Registered Students Directory
                <span className="text-xs font-normal px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  {students.length} Total
                </span>
              </h3>
            </div>

            <div className="flex items-center flex-wrap gap-2">
              <button
                onClick={loadStudents}
                disabled={isLoadingStudents}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium flex items-center gap-1.5 transition"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-blue-400 ${isLoadingStudents ? 'animate-spin' : ''}`} />
                Refresh Records
              </button>

              <button
                onClick={handleSeed}
                disabled={isSeeding}
                className="px-3.5 py-2 rounded-xl bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-200 border border-indigo-500/40 text-xs font-medium flex items-center gap-1.5 transition"
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
                {isSeeding ? 'Seeding...' : 'Seed Sample Students'}
              </button>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="mt-5 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search registered students by name, course, ID, or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm text-white placeholder-slate-500 outline-none transition"
              />
            </div>

            {uniqueCourses.length > 0 && (
              <select
                value={selectedCourseFilter}
                onChange={(e) => setSelectedCourseFilter(e.target.value)}
                className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 text-xs outline-none focus:border-blue-500"
              >
                <option value="ALL">All Courses ({students.length})</option>
                {uniqueCourses.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>

        {/* Table Content */}
        {isLoadingStudents ? (
          <div className="py-16 text-center space-y-3">
            <RefreshCw className="w-8 h-8 text-blue-400 animate-spin mx-auto" />
            <p className="text-sm text-slate-400">Querying Firestore database records...</p>
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="py-16 px-4 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-slate-800 text-slate-500 mx-auto flex items-center justify-center">
              <Users className="w-7 h-7" />
            </div>
            <div>
              <h4 className="text-base font-bold text-white">No Student Records Found</h4>
              <p className="text-xs text-slate-400 max-w-md mx-auto mt-1">
                {searchQuery || selectedCourseFilter !== 'ALL'
                  ? 'No students matched your search criteria. Clear your search filter or add a student.'
                  : 'The database currently has no registered students. Use the form above to register a student or click "Seed Sample Students" for instant test data.'}
              </p>
            </div>
            <div className="flex justify-center gap-3">
              <button
                onClick={handleSeed}
                disabled={isSeeding}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md flex items-center gap-2 transition"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Seed Sample Students
              </button>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-950/80 text-slate-400 text-xs uppercase tracking-wider font-semibold border-b border-slate-800">
                <tr>
                  <th scope="col" className="px-6 py-3.5">Student</th>
                  <th scope="col" className="px-6 py-3.5">Course / Program</th>
                  <th scope="col" className="px-6 py-3.5">Student ID</th>
                  <th scope="col" className="px-6 py-3.5">Registration Timestamp</th>
                  <th scope="col" className="px-6 py-3.5 text-right">Database Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-slate-300">
                {filteredStudents.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-800/40 transition">
                    {/* Student Info */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-sm">
                          {s.studentName.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-semibold text-white">{s.studentName}</div>
                          {s.email ? (
                            <div className="text-xs text-slate-400 flex items-center gap-1">
                              <Mail className="w-3 h-3 text-slate-500" />
                              {s.email}
                            </div>
                          ) : (
                            <div className="text-[11px] text-slate-500 font-mono">Doc: {s.id.slice(0, 14)}...</div>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Course */}
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium bg-blue-500/10 text-blue-300 border border-blue-500/20">
                        <BookOpen className="w-3 h-3 text-blue-400" />
                        {s.course}
                      </span>
                    </td>

                    {/* Student ID */}
                    <td className="px-6 py-4">
                      <span className="font-mono text-xs text-slate-300 px-2 py-1 rounded bg-slate-950 border border-slate-800">
                        {s.studentId || s.id}
                      </span>
                    </td>

                    {/* Timestamp */}
                    <td className="px-6 py-4">
                      <div className="text-xs text-slate-300 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-500" />
                        {new Date(s.registrationTimestamp).toLocaleDateString()} at{' '}
                        {new Date(s.registrationTimestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono">
                        {s.registrationTimestamp}
                      </div>
                    </td>

                    {/* Action */}
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDelete(s.id)}
                        disabled={deletingId === s.id}
                        title="Delete student from database"
                        className="p-2 rounded-lg bg-slate-800 hover:bg-rose-900/50 text-slate-400 hover:text-rose-300 border border-slate-700 hover:border-rose-700/50 transition"
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

        {/* Persistence Proof Footer */}
        <div className="p-4 bg-slate-950/80 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>
              Showing <strong className="text-slate-200">{filteredStudents.length}</strong> of{' '}
              <strong className="text-slate-200">{students.length}</strong> saved records from database.
            </span>
          </div>
          <div className="text-slate-500 font-mono text-[11px]">
            Target Collection: <span className="text-amber-400">/students</span> (Firestore)
          </div>
        </div>
      </div>
    </div>
  );
};
