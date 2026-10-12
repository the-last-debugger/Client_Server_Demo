import React, { useState } from 'react';
import {
  UserPlus,
  Users,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  BookOpen,
  User,
} from 'lucide-react';
import { ApiResponse, Student } from '../types/student';
import { createStudent } from '../services/api';

interface StudentRegistrationCardProps {
  onViewRegisteredStudents: () => void;
  onStudentRegistered?: () => void;
}

export const StudentRegistrationCard: React.FC<StudentRegistrationCardProps> = ({
  onViewRegisteredStudents,
  onStudentRegistered,
}) => {
  const [studentName, setStudentName] = useState('');
  const [course, setCourse] = useState('');

  // Status & Feedback States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<{
    text: string;
    student: Student;
    timestamp: string;
    status: number;
  } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Handle Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    // Client preliminary check
    if (!studentName.trim()) {
      setErrorMessage('Please enter the student name.');
      return;
    }
    if (!course.trim()) {
      setErrorMessage('Please enter the course.');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        studentName: studentName.trim(),
        course: course.trim(),
      };

      const result = await createStudent(payload);

      if (result.status === 201 && result.data.success && result.data.data) {
        setSuccessMessage({
          text: result.data.message || 'Student successfully registered and saved to database.',
          student: result.data.data,
          timestamp: new Date().toLocaleTimeString(),
          status: result.status,
        });
        // Clear fields
        setStudentName('');
        setCourse('');
        if (onStudentRegistered) onStudentRegistered();
      } else {
        setErrorMessage(result.data.error || 'Server rejected registration request.');
      }
    } catch (err) {
      console.error('Registration failed:', err);
      setErrorMessage('Network error: Unable to communicate with the server.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6">
      {/* Card Header */}
      <div className="flex items-center gap-3 border-b border-slate-800 pb-5">
        <div className="w-12 h-12 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
          <UserPlus className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Student Registration
          </h2>
          <p className="text-xs text-slate-400">
            Enter student details to register into the system
          </p>
        </div>
      </div>

      {/* Success Notification Alert */}
      {successMessage && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-200 text-xs sm:text-sm animate-in fade-in duration-300">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-emerald-300">Registration Successful</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  HTTP {successMessage.status} Created
                </span>
              </div>
              <p className="text-slate-300 text-xs">{successMessage.text}</p>
              <div className="pt-2 text-[11px] font-mono text-slate-400 border-t border-emerald-500/20">
                Registered: <span className="text-white font-semibold">{successMessage.student.studentName}</span> (
                <span className="text-blue-300">{successMessage.student.course}</span>)
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Error Notification Alert */}
      {errorMessage && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-200 text-xs sm:text-sm animate-in fade-in duration-300">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-semibold text-rose-300 block">Registration Error</span>
              <p className="text-rose-200 text-xs">{errorMessage}</p>
            </div>
          </div>
        </div>
      )}

      {/* Registration Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Field 1: Student Name */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-blue-400" />
            Student Name <span className="text-rose-400">*</span>
          </label>
          <input
            type="text"
            required
            placeholder="Enter student name (e.g. Jordan Miller)"
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-white placeholder-slate-500 text-sm transition outline-none"
          />
        </div>

        {/* Field 2: Course */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-blue-400" />
            Course <span className="text-rose-400">*</span>
          </label>
          <input
            type="text"
            required
            placeholder="Enter course name (e.g. Computer Science)"
            value={course}
            onChange={(e) => setCourse(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-white placeholder-slate-500 text-sm transition outline-none"
          />
        </div>

        {/* Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row gap-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 active:bg-blue-700 disabled:opacity-60 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Registering...
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
            onClick={onViewRegisteredStudents}
            className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 font-medium text-sm flex items-center justify-center gap-2 transition cursor-pointer"
          >
            <Users className="w-4 h-4 text-blue-400" />
            View Registered Students
          </button>
        </div>
      </form>
    </div>
  );
};
