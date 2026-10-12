import React, { useState } from 'react';
import {
  Layers,
  Monitor,
  Server,
  Database,
  ArrowRight,
  ArrowDown,
  CheckCircle2,
  Shield,
  Cpu,
  FileCode,
  Network,
  Lock,
  Globe,
  Radio,
  ExternalLink,
} from 'lucide-react';

export const ArchitectureDiagram: React.FC = () => {
  const [selectedLayer, setSelectedLayer] = useState<'client' | 'http' | 'server' | 'database'>('server');

  const layers = [
    {
      id: 'client' as const,
      name: 'Layer 1: Presentation Layer (Client)',
      shortName: 'Client / UI',
      icon: Monitor,
      tech: 'React 19, TypeScript, Tailwind CSS, Vite',
      role: 'User Interface & State Management',
      color: 'blue',
      borderColor: 'border-blue-500/40',
      bgColor: 'bg-blue-500/10',
      textColor: 'text-blue-400',
      description:
        'The Presentation Layer runs entirely in the client’s web browser. It renders the responsive student registration form, captures user input (student name and course), performs preliminary form checking, and displays real-time feedback and tables.',
      responsibilities: [
        'Collects student name and course from input fields',
        'Dispatches asynchronous HTTP fetch requests to /api/students',
        'Renders success notifications, error alerts, and registered students table',
        'Never accesses database credentials directly, keeping credentials safe',
      ],
      inputOutput: 'Input: User keystrokes / clicks ➔ Output: HTTP JSON request over network',
    },
    {
      id: 'http' as const,
      name: 'Layer 2: Communication & Protocol Layer',
      shortName: 'HTTP / REST API',
      icon: Network,
      tech: 'HTTP/1.1 REST Protocol, JSON Serialization',
      role: 'Client-Server Message Passing',
      color: 'purple',
      borderColor: 'border-purple-500/40',
      bgColor: 'bg-purple-500/10',
      textColor: 'text-purple-400',
      description:
        'The communication bridge facilitating request-response transactions between the browser client and the backend server. Structured as RESTful endpoints with standard HTTP verbs (GET, POST, DELETE) and JSON serialization.',
      responsibilities: [
        'Encapsulates requests with Content-Type: application/json',
        'Transmits HTTP POST /api/students with student registration payload',
        'Transmits HTTP GET /api/students to query saved student records',
        'Transports status codes: 200 OK, 201 Created, 400 Bad Request, 500 Server Error',
      ],
      inputOutput: 'Input: JSON over TCP/IP ➔ Output: Formatted HTTP Response with status code',
    },
    {
      id: 'server' as const,
      name: 'Layer 3: Application / Logic Layer (Server)',
      shortName: 'Server / Business Logic',
      icon: Server,
      tech: 'Express 4.21, Node.js runtime, tsx',
      role: 'Request Processing, Validation & Database Orchestration',
      color: 'emerald',
      borderColor: 'border-emerald-500/40',
      bgColor: 'bg-emerald-500/10',
      textColor: 'text-emerald-400',
      description:
        'The core engine running on Node.js (port 3000). It receives HTTP requests, enforces strict schema validation (rejecting missing or short student names and courses), generates unique IDs and timestamps, and communicates directly with the persistent database.',
      responsibilities: [
        'Exposes RESTful endpoints: /api/health, /api/students, /api/audit-logs',
        'Validates that studentName is at least 2 characters (returns 400 on failure)',
        'Validates that course is at least 2 characters (returns 400 on failure)',
        'Generates persistent document ID and ISO 8601 registration timestamp',
        'Communicates directly with Firebase Firestore using cloud SDK',
      ],
      inputOutput: 'Input: Incoming HTTP Request ➔ Output: Database query & HTTP 201/200/400 JSON',
    },
    {
      id: 'database' as const,
      name: 'Layer 4: Data / Persistence Layer',
      shortName: 'Database / Firestore',
      icon: Database,
      tech: 'Google Cloud Firebase Firestore (NoSQL Document Store)',
      role: 'Durable Data Storage & Querying',
      color: 'amber',
      borderColor: 'border-amber-500/40',
      bgColor: 'bg-amber-500/10',
      textColor: 'text-amber-400',
      description:
        'The persistence layer responsible for long-term data durability. Student records are stored in the /students collection. Records survive browser reloads, server restarts, and concurrent requests.',
      responsibilities: [
        'Stores student entity: { id, studentName, course, studentId, email, registrationTimestamp }',
        'Enforces Firestore Security Rules to prevent unauthorized schema tampering',
        'Executes atomic setDoc mutations when new students register',
        'Ensures records remain 100% available when users refresh their browser',
      ],
      inputOutput: 'Input: Document write mutation ➔ Output: Committed document snapshot',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-slate-900 p-6 sm:p-8 rounded-2xl border border-slate-800 shadow-xl">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              3-Tier Layered Architecture Specification
            </h2>
            <p className="text-sm text-slate-400">
              Clear separation of concerns: Presentation Layer ➔ Communication Protocol ➔ Application Server ➔ Database
            </p>
          </div>
        </div>
      </div>

      {/* Visual Flow Pipeline */}
      <div className="bg-slate-900 p-6 sm:p-8 rounded-2xl border border-slate-800 shadow-xl">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-6 flex items-center gap-2">
          <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
          Interactive Architectural Flow Diagram
        </h3>

        {/* 4 Cards Pipeline */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
          {layers.map((layer, idx) => {
            const Icon = layer.icon;
            const isSelected = selectedLayer === layer.id;
            return (
              <div key={layer.id} className="relative flex flex-col">
                <button
                  type="button"
                  onClick={() => setSelectedLayer(layer.id)}
                  className={`text-left p-5 rounded-2xl border transition-all h-full cursor-pointer ${
                    isSelected
                      ? `${layer.bgColor} ${layer.borderColor} ring-2 ring-blue-500/40 shadow-lg scale-[1.02]`
                      : 'bg-slate-950/80 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div
                      className={`w-10 h-10 rounded-xl ${layer.bgColor} border ${layer.borderColor} flex items-center justify-center ${layer.textColor}`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      Tier {idx + 1}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-white mb-1">{layer.shortName}</h4>
                  <div className="text-[11px] text-slate-400 mb-2 font-mono line-clamp-1">{layer.tech}</div>
                  <p className="text-xs text-slate-300 line-clamp-2">{layer.role}</p>

                  <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                    <span className={isSelected ? layer.textColor : 'text-slate-400'}>
                      {isSelected ? 'Viewing Details' : 'Click to inspect'}
                    </span>
                    <ArrowRight className={`w-3.5 h-3.5 ${isSelected ? layer.textColor : 'text-slate-500'}`} />
                  </div>
                </button>

                {/* Arrow connector for desktop */}
                {idx < layers.length - 1 && (
                  <div className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-6 h-6 rounded-full bg-slate-800 border border-slate-700 items-center justify-center text-slate-400">
                    <ArrowRight className="w-3 h-3" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Selected Layer Deep Dive Card */}
        {(() => {
          const active = layers.find((l) => l.id === selectedLayer)!;
          const ActiveIcon = active.icon;
          return (
            <div className={`mt-8 p-6 sm:p-8 rounded-2xl border ${active.borderColor} ${active.bgColor} transition-all`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800/60 mb-6">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-xl bg-slate-900 border ${active.borderColor} flex items-center justify-center ${active.textColor}`}>
                    <ActiveIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs font-mono font-semibold text-slate-400 uppercase tracking-wider">
                      Selected Architecture Component
                    </span>
                    <h3 className="text-xl font-bold text-white">{active.name}</h3>
                  </div>
                </div>

                <div className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300">
                  Tech: <span className={active.textColor}>{active.tech}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                <div className="md:col-span-7 space-y-4">
                  <h4 className="text-sm font-bold text-white">Layer Description</h4>
                  <p className="text-sm text-slate-300 leading-relaxed">{active.description}</p>

                  <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 text-xs font-mono text-slate-300">
                    <span className="text-slate-400 block mb-1">Data Exchange Pattern:</span>
                    <span className="text-emerald-400">{active.inputOutput}</span>
                  </div>
                </div>

                <div className="md:col-span-5 space-y-3">
                  <h4 className="text-sm font-bold text-white">Core Responsibilities</h4>
                  <ul className="space-y-2">
                    {active.responsibilities.map((resp, i) => (
                      <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{resp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          );
        })()}
      </div>

      {/* Step-by-Step Transaction Walkthrough */}
      <div className="bg-slate-900 p-6 sm:p-8 rounded-2xl border border-slate-800 shadow-xl space-y-6">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <FileCode className="w-5 h-5 text-blue-400" />
          End-to-End Registration Request Lifecycle
        </h3>
        <p className="text-sm text-slate-400">
          Trace how a single student registration flows across all three layers from browser input to persistent cloud storage:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-blue-400 font-bold">Step 1</span>
              <span className="text-slate-500">Presentation</span>
            </div>
            <h4 className="text-sm font-semibold text-white">User Form Entry</h4>
            <p className="text-xs text-slate-400">
              Student enters Name (&quot;Jordan Miller&quot;) and Course (&quot;B.Sc. Computer Science&quot;) and clicks &quot;Register Student&quot;.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-purple-400 font-bold">Step 2</span>
              <span className="text-slate-500">Communication</span>
            </div>
            <h4 className="text-sm font-semibold text-white">HTTP POST Dispatch</h4>
            <p className="text-xs text-slate-400">
              Client sends <code className="text-emerald-400 text-[11px]">POST /api/students</code> with JSON payload <code className="text-slate-300 text-[11px]">&#123;&quot;studentName&quot;:..., &quot;course&quot;:...&#125;</code>.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-emerald-400 font-bold">Step 3</span>
              <span className="text-slate-500">Application</span>
            </div>
            <h4 className="text-sm font-semibold text-white">Server-side Validation</h4>
            <p className="text-xs text-slate-400">
              Express server verifies name and course are strings &ge; 2 chars. If invalid, aborts with HTTP 400 Bad Request.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-amber-400 font-bold">Step 4</span>
              <span className="text-slate-500">Database</span>
            </div>
            <h4 className="text-sm font-semibold text-white">Persistent Firestore Write</h4>
            <p className="text-xs text-slate-400">
              Server executes <code className="text-amber-400 text-[11px]">setDoc()</code> to collection <code className="text-slate-300 text-[11px]">/students</code>. Cloud Firestore safely persists record to disk.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-emerald-400 font-bold">Step 5</span>
              <span className="text-slate-500">Application</span>
            </div>
            <h4 className="text-sm font-semibold text-white">HTTP 201 Response</h4>
            <p className="text-xs text-slate-400">
              Upon database confirmation, Express returns <code className="text-emerald-400 text-[11px]">201 Created</code> with confirmed record and timestamp.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-blue-400 font-bold">Step 6</span>
              <span className="text-slate-500">Presentation</span>
            </div>
            <h4 className="text-sm font-semibold text-white">UI State Synchronization</h4>
            <p className="text-xs text-slate-400">
              React client receives 201 Created, shows green success banner, clears form, and appends student to directory table.
            </p>
          </div>
        </div>
      </div>

      {/* Academic Importance: Why 3-Tier Layered Architecture? */}
      <div className="bg-slate-900 p-6 sm:p-8 rounded-2xl border border-slate-800 shadow-xl space-y-5">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Shield className="w-5 h-5 text-indigo-400" />
          Academic Rationale: Why 3-Tier Architecture?
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-300">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <h4 className="font-bold text-white text-sm flex items-center gap-1.5 text-blue-400">
              <Lock className="w-4 h-4" /> 1. Security & Isolation
            </h4>
            <p className="text-slate-400">
              In a 2-tier design, database credentials or direct access are exposed to the client browser. In our 3-tier system, only the trusted Express server interacts directly with Firestore, completely protecting database credentials.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <h4 className="font-bold text-white text-sm flex items-center gap-1.5 text-emerald-400">
              <CheckCircle2 className="w-4 h-4" /> 2. Authoritative Validation
            </h4>
            <p className="text-slate-400">
              Client-side validation can be bypassed by an attacker using Postman or curl. By placing business rules and validations inside the Express Application Layer, data integrity is guaranteed before reaching storage.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <h4 className="font-bold text-white text-sm flex items-center gap-1.5 text-amber-400">
              <Cpu className="w-4 h-4" /> 3. Modularity & Scalability
            </h4>
            <p className="text-slate-400">
              Each tier can be modified, tested, and scaled independently. If the frontend changes from React to a Mobile App, the Express HTTP API remains unchanged. If the database engine changes, the client is unaffected.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
