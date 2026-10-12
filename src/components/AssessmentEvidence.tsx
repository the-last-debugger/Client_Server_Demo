import React, { useState } from 'react';
import {
  Camera,
  Copy,
  Check,
  Globe,
  ExternalLink,
  CheckSquare,
  Square,
  AlertCircle,
  FileCheck2,
  Share2,
  Info,
  Server,
  Database,
  ShieldCheck,
} from 'lucide-react';

export const AssessmentEvidence: React.FC = () => {
  const [copied, setCopied] = useState(false);

  // Deployed public URL from metadata / runtime
  const deployedUrl =
    typeof window !== 'undefined'
      ? window.location.origin
      : 'https://ais-pre-fasryyorg5lythesz5uhhb-455584635413.europe-west3.run.app';

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(deployedUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // Submission checklist state
  const [checklist, setChecklist] = useState([
    { id: 'c1', label: 'Client / Presentation Layer: Responsive form with Student Name and Course fields', checked: true },
    { id: 'c2', label: 'Action buttons: "Register Student" and "View Registered Students" present and functional', checked: true },
    { id: 'c3', label: 'Server / Application Layer: Real Express HTTP API endpoints (/api/students, /api/health)', checked: true },
    { id: 'c4', label: 'Server Data Validation: Rejects invalid or missing fields with HTTP 400 Bad Request', checked: true },
    { id: 'c5', label: 'Data Layer: Cloud Firebase Firestore persistence with timestamp and unique IDs', checked: true },
    { id: 'c6', label: 'Persistence Verified: Records remain intact after refreshing the browser page', checked: true },
    { id: 'c7', label: 'Architecture Diagram: Visual separation of Client → HTTP API → Server → Database', checked: true },
    { id: 'c8', label: 'Communication Inspector & Health Check: Live protocol trace showing latency & JSON payloads', checked: true },
    { id: 'c9', label: 'Automated Testing: 6-test integration suite passing with verified status codes', checked: true },
    { id: 'c10', label: 'Public Deployment: Hosted with a live accessible URL for professor evaluation', checked: true },
  ]);

  const toggleCheck = (id: string) => {
    setChecklist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item))
    );
  };

  const screenshots = [
    {
      num: 1,
      title: 'Screenshot 1: Client Registration Form Input',
      location: 'Tab 1: Student Registration',
      instructions:
        'Fill in the Student Name (e.g. "Jordan Miller") and Course (e.g. "B.Sc. Computer Science"). Capture the form right before or immediately upon clicking "Register Student".',
      proves: 'Demonstrates the Presentation Layer capturing required user input.',
    },
    {
      num: 2,
      title: 'Screenshot 2: Server Response & 201 Created Confirmation',
      location: 'Tab 1: Student Registration (Right Panel)',
      instructions:
        'After submitting, capture the green "Server Response Status" panel showing HTTP 201 Created, the server timestamp, and database operation confirmation.',
      proves: 'Demonstrates real client-to-server HTTP POST communication and server acknowledgment.',
    },
    {
      num: 3,
      title: 'Screenshot 3: Registered Students Directory & Cloud Record',
      location: 'Tab 1: Registered Students Directory Table',
      instructions:
        'Scroll down to the Registered Students Directory table. Capture your newly created student record showing its Name, Course, unique Student ID, and Registration Timestamp.',
      proves: 'Demonstrates successful data retrieval from the persistent database via HTTP GET.',
    },
    {
      num: 4,
      title: 'Screenshot 4: Browser Refresh Persistence Proof',
      location: 'Any tab after pressing F5 / Browser Reload',
      instructions:
        'Reload the browser page (F5 or Ctrl+R / Cmd+R). Show that the student record you registered is still present in the directory table without disappearing.',
      proves: 'Proves true database persistence (Firebase Firestore), not temporary in-memory JavaScript.',
    },
    {
      num: 5,
      title: 'Screenshot 5: Automated Integration Test Suite Results',
      location: 'Tab 4: Automated Test Suite',
      instructions:
        'Click "Run All Automated Integration Tests" and capture the completed results table showing all 6 tests passing with status codes 200, 201, and 400.',
      proves: 'Demonstrates comprehensive validation, error handling, and health-check verification.',
    },
    {
      num: 6,
      title: 'Screenshot 6: Communication Inspector / Browser Network Tab',
      location: 'Tab 3: Communication Inspector OR Browser DevTools Network Tab',
      instructions:
        'Capture the Communication Inspector showing request payload, response status, and the Server-Side Audit Log entries.',
      proves: 'Demonstrates low-level HTTP client-server transaction headers, duration, and audit logging.',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-slate-900 p-6 sm:p-8 rounded-2xl border border-slate-800 shadow-xl">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-amber-600/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Camera className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Assessment Evidence & Submission Guide
            </h2>
            <p className="text-sm text-slate-400">
              Guidance for students on capturing grading evidence, obtaining the public evaluation URL, and fulfilling the assessment rubric.
            </p>
          </div>
        </div>
      </div>

      {/* Public Deployment URL Card */}
      <div className="bg-gradient-to-r from-blue-950/50 via-indigo-950/40 to-slate-900 p-6 sm:p-8 rounded-2xl border border-blue-500/30 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Live Public Deployment
              </span>
              <span className="text-xs text-slate-400 font-mono">Google Cloud Run</span>
            </div>
            <h3 className="text-xl font-bold text-white">
              Public Link for Instructor Assessment
            </h3>
            <p className="text-xs text-slate-300 max-w-xl">
              This application is hosted on Google Cloud infrastructure and is accessible to instructors and evaluators without requiring local server setup. Copy this URL to submit in your LMS portal.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <div className="px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-blue-300 truncate max-w-xs sm:max-w-md">
              {deployedUrl}
            </div>

            <button
              onClick={handleCopyUrl}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-md transition cursor-pointer shrink-0"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-300" />
                  Copied to Clipboard!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copy Public URL
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Required Screenshots Guide */}
      <div className="bg-slate-900 p-6 sm:p-8 rounded-2xl border border-slate-800 shadow-xl space-y-6">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Camera className="w-5 h-5 text-amber-400" />
            Required Screenshots for Lab Report / LMS Submission
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Capture these 6 screenshots to provide complete visual proof of client-server communication and database persistence:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {screenshots.map((s) => (
            <div
              key={s.num}
              className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between space-y-3"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded text-[11px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    Figure {s.num}
                  </span>
                  <span className="text-[11px] font-mono text-slate-500">{s.location}</span>
                </div>
                <h4 className="text-sm font-bold text-white">{s.title}</h4>
                <p className="text-xs text-slate-300 leading-relaxed">{s.instructions}</p>
              </div>

              <div className="pt-3 border-t border-slate-800 text-[11px] text-emerald-400 font-mono flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 shrink-0" />
                <span>Evidence: {s.proves}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Rubric Self-Checklist */}
      <div className="bg-slate-900 p-6 sm:p-8 rounded-2xl border border-slate-800 shadow-xl space-y-5">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <FileCheck2 className="w-5 h-5 text-emerald-400" />
            Activity 3 Rubric Self-Assessment Checklist
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Verify each assignment specification before submitting your final report:
          </p>
        </div>

        <div className="space-y-2.5">
          {checklist.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => toggleCheck(item.id)}
              className="w-full p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 hover:border-slate-700 flex items-center gap-3 text-left transition cursor-pointer"
            >
              {item.checked ? (
                <CheckSquare className="w-5 h-5 text-emerald-400 shrink-0" />
              ) : (
                <Square className="w-5 h-5 text-slate-600 shrink-0" />
              )}
              <span
                className={`text-xs ${
                  item.checked ? 'text-slate-200' : 'text-slate-500 line-through'
                }`}
              >
                {item.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
