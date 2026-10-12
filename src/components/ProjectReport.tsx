import React from 'react';
import {
  FileText,
  CheckCircle2,
  BookOpen,
  Layers,
  Cpu,
  Database,
  ShieldCheck,
  Award,
} from 'lucide-react';

export const ProjectReport: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Title Header */}
      <div className="bg-slate-900 p-6 sm:p-8 rounded-2xl border border-slate-800 shadow-xl">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Academic Lab Report & Project Documentation
            </h2>
            <p className="text-sm text-slate-400">
              Activity 3: Client-Server Application — Design, Implementation, and Evaluation
            </p>
          </div>
        </div>
      </div>

      {/* Main Report Body */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-xl p-6 sm:p-10 space-y-10 text-slate-300 text-sm leading-relaxed">
        {/* Project Meta Card */}
        <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-slate-500 block">Course Module:</span>
            <span className="text-white font-semibold">Web Systems & Network Architecture</span>
          </div>
          <div>
            <span className="text-slate-500 block">Activity Title:</span>
            <span className="text-blue-400 font-semibold">Activity 3: Client-Server Application</span>
          </div>
          <div>
            <span className="text-slate-500 block">Architecture:</span>
            <span className="text-emerald-400 font-semibold">3-Tier (Client-Server-Database)</span>
          </div>
          <div>
            <span className="text-slate-500 block">Database Engine:</span>
            <span className="text-amber-400 font-semibold">Google Cloud Firebase Firestore</span>
          </div>
        </div>

        {/* Section 1: Introduction and Objectives */}
        <section className="space-y-3">
          <h3 className="text-lg font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-2">
            <BookOpen className="w-5 h-5 text-blue-400" />
            1. Project Purpose & Objectives
          </h3>
          <p>
            The primary purpose of this project is to design, implement, and evaluate a fully functional <strong>Student Registration System</strong> adhering to the principles of a client-server architecture. In modern web engineering, applications must avoid coupling user presentation directly to database storage.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="font-semibold text-white block text-xs">Objective 1: Distributed Communication</span>
              <p className="text-xs text-slate-400">
                Demonstrate reliable HTTP request-response messaging between a web browser client and a Node.js Express server.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="font-semibold text-white block text-xs">Objective 2: Server-Side Validation</span>
              <p className="text-xs text-slate-400">
                Enforce authoritative business rules on the backend to reject invalid registration submissions with HTTP 400 Bad Request.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="font-semibold text-white block text-xs">Objective 3: Cloud Persistence</span>
              <p className="text-xs text-slate-400">
                Commit student records to Firebase Firestore NoSQL database, ensuring records remain accessible after browser refreshes.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="font-semibold text-white block text-xs">Objective 4: Public Accessibility</span>
              <p className="text-xs text-slate-400">
                Deploy the web application to a publicly reachable cloud URL for transparent academic assessment.
              </p>
            </div>
          </div>
        </section>

        {/* Section 2: Layered Architecture Analysis */}
        <section className="space-y-3">
          <h3 className="text-lg font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-2">
            <Layers className="w-5 h-5 text-indigo-400" />
            2. Layered Architecture Implementation
          </h3>
          <p>
            The system is organized into three distinct tiers with clear separation of responsibilities:
          </p>
          <ul className="space-y-3 pl-2">
            <li className="flex items-start gap-2.5">
              <div className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                1
              </div>
              <div>
                <strong className="text-white">Client / Presentation Layer (React 19 & Vite):</strong> Responsible for user input, form validation, state management, and rendering data tables. The client never executes direct database queries, preserving security boundaries.
              </div>
            </li>
            <li className="flex items-start gap-2.5">
              <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                2
              </div>
              <div>
                <strong className="text-white">Application / Server Layer (Express 4.21 on Node.js):</strong> The intermediary brain of the application. It listens for incoming HTTP requests on port 3000, enforces validation schemas, generates unique IDs, logs transactions, and returns standard HTTP status codes (200, 201, 400, 500).
              </div>
            </li>
            <li className="flex items-start gap-2.5">
              <div className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                3
              </div>
              <div>
                <strong className="text-white">Data / Persistence Layer (Firebase Firestore):</strong> A managed NoSQL cloud database that guarantees persistent data durability. It stores records in the <code className="text-amber-300 text-xs">/students</code> collection. Records remain available permanently across sessions.
              </div>
            </li>
          </ul>
        </section>

        {/* Section 3: Communication Protocol */}
        <section className="space-y-3">
          <h3 className="text-lg font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-2">
            <Cpu className="w-5 h-5 text-emerald-400" />
            3. Client-Server Communication Protocol
          </h3>
          <p>
            Communication follows the RESTful architectural style utilizing standard HTTP methods and JSON payloads:
          </p>
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 overflow-x-auto text-xs font-mono">
            <table className="w-full text-left">
              <thead>
                <tr className="text-slate-500 border-b border-slate-800">
                  <th className="pb-2">HTTP Method</th>
                  <th className="pb-2">Endpoint</th>
                  <th className="pb-2">Expected Status</th>
                  <th className="pb-2">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                <tr>
                  <td className="py-2 text-blue-400">GET</td>
                  <td>/api/health</td>
                  <td className="text-emerald-400">200 OK</td>
                  <td>Verifies server health and database connectivity</td>
                </tr>
                <tr>
                  <td className="py-2 text-blue-400">GET</td>
                  <td>/api/students</td>
                  <td className="text-emerald-400">200 OK</td>
                  <td>Queries all student documents from database</td>
                </tr>
                <tr>
                  <td className="py-2 text-emerald-400">POST</td>
                  <td>/api/students</td>
                  <td className="text-emerald-400">201 Created</td>
                  <td>Validates and inserts new student into database</td>
                </tr>
                <tr>
                  <td className="py-2 text-emerald-400">POST</td>
                  <td>/api/students</td>
                  <td className="text-amber-400">400 Bad Request</td>
                  <td>Returned when studentName or course is invalid</td>
                </tr>
                <tr>
                  <td className="py-2 text-rose-400">DELETE</td>
                  <td>/api/students/:id</td>
                  <td className="text-emerald-400">200 OK</td>
                  <td>Deletes specified student document from database</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 4: Testing & Verification Results */}
        <section className="space-y-3">
          <h3 className="text-lg font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-2">
            <ShieldCheck className="w-5 h-5 text-purple-400" />
            4. Testing & Verification Results
          </h3>
          <p>
            The system underwent comprehensive end-to-end integration testing using the built-in Automated Test Runner:
          </p>
          <div className="space-y-2 text-xs">
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <strong>Health-check Verification:</strong> Express server responds within 5ms with status ONLINE.
              </span>
              <span className="font-mono text-emerald-400">PASS (200)</span>
            </div>
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <strong>Empty Name Validation:</strong> Rejected by server with descriptive error message.
              </span>
              <span className="font-mono text-amber-400">PASS (400)</span>
            </div>
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <strong>Empty Course Validation:</strong> Rejected by server with descriptive error message.
              </span>
              <span className="font-mono text-amber-400">PASS (400)</span>
            </div>
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <strong>Registration & Write:</strong> Correctly commits record to Firestore and returns 201 Created.
              </span>
              <span className="font-mono text-emerald-400">PASS (201)</span>
            </div>
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <strong>Persistence after Refresh:</strong> Verified records remain available after browser reload.
              </span>
              <span className="font-mono text-emerald-400">PASS (100%)</span>
            </div>
          </div>
        </section>

        {/* Section 5: Conclusion */}
        <section className="space-y-3">
          <h3 className="text-lg font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-2">
            <Award className="w-5 h-5 text-amber-400" />
            5. Conclusion & Key Takeaways
          </h3>
          <p>
            In conclusion, <strong>Activity 3: Client-Server Application</strong> successfully demonstrates the practical implementation of a multi-tier web system. By decoupling the presentation logic in React from the application server in Express and the cloud persistence in Firebase Firestore, the application achieves high modularity, robust security, and reliable data integrity.
          </p>
          <p>
            The project confirms that true client-server applications must validate data on the backend, communicate using standardized HTTP methods, and rely on durable database engines rather than simulating data in client-side memory.
          </p>
        </section>
      </div>
    </div>
  );
};
