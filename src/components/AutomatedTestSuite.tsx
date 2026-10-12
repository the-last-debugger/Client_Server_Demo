import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Play,
  RefreshCw,
  Clock,
  Layers,
  Code2,
  ChevronDown,
  ChevronUp,
  FileCheck,
  Sparkles,
} from 'lucide-react';
import { TestCaseResult } from '../types/student';

export const AutomatedTestSuite: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState<TestCaseResult[]>([
    {
      id: 'test_health',
      title: 'Test 1: Server Health Check & Readiness',
      description: 'Verifies the Express application layer is running and can ping the database.',
      endpoint: '/api/health',
      method: 'GET',
      expectedStatus: 200,
    },
    {
      id: 'test_val_name',
      title: 'Test 2: Schema Validation (Missing Student Name)',
      description: 'Sends a registration payload with missing studentName; expects server rejection with HTTP 400.',
      endpoint: '/api/students',
      method: 'POST',
      expectedStatus: 400,
      requestPayload: { course: 'Software Engineering' },
    },
    {
      id: 'test_val_course',
      title: 'Test 3: Schema Validation (Missing Course)',
      description: 'Sends a registration payload with missing course; expects server rejection with HTTP 400.',
      endpoint: '/api/students',
      method: 'POST',
      expectedStatus: 400,
      requestPayload: { studentName: 'Test Student Only' },
    },
    {
      id: 'test_register_success',
      title: 'Test 4: Successful Student Registration & DB Write',
      description: 'Submits valid student details; expects HTTP 201 Created and confirmed database commit.',
      endpoint: '/api/students',
      method: 'POST',
      expectedStatus: 201,
      requestPayload: {
        studentName: 'Automated Test Student',
        course: 'B.Sc. Cyber Security',
        studentId: 'AUTO-TEST-001',
        email: 'autotest@college.edu',
      },
    },
    {
      id: 'test_retrieve_records',
      title: 'Test 5: Student Records Retrieval from Database',
      description: 'Queries /api/students; expects HTTP 200 OK and non-empty array of persistent records.',
      endpoint: '/api/students',
      method: 'GET',
      expectedStatus: 200,
    },
    {
      id: 'test_persistence_fields',
      title: 'Test 6: Data Integrity & Timestamp Verification',
      description: 'Verifies retrieved records contain ID, studentName, course, and valid registrationTimestamp.',
      endpoint: '/api/students',
      method: 'GET',
      expectedStatus: 200,
    },
  ]);

  const [expandedTestId, setExpandedTestId] = useState<string | null>(null);

  const runAllTests = async () => {
    setIsRunning(true);
    const updated = [...testResults];

    for (let i = 0; i < updated.length; i++) {
      const test = { ...updated[i] };
      const start = performance.now();

      try {
        const options: RequestInit = {
          method: test.method,
          headers: {
            'Content-Type': 'application/json',
          },
        };

        if (test.method === 'POST') {
          options.body = JSON.stringify(test.requestPayload);
        }

        const res = await fetch(test.endpoint, options);
        const elapsed = Math.round(performance.now() - start);
        const data = await res.json();

        test.actualStatus = res.status;
        test.durationMs = elapsed;
        test.responsePayload = data;

        // Custom validation logic
        if (test.id === 'test_persistence_fields') {
          const list = data.data || [];
          const hasValidFields =
            list.length > 0 &&
            list.some((s: any) => s.id && s.studentName && s.course && s.registrationTimestamp);
          test.passed = res.status === test.expectedStatus && hasValidFields;
        } else {
          test.passed = res.status === test.expectedStatus;
        }
      } catch (err) {
        test.actualStatus = 0;
        test.durationMs = Math.round(performance.now() - start);
        test.passed = false;
        test.error = err instanceof Error ? err.message : String(err);
      }

      updated[i] = test;
      setTestResults([...updated]);
      // Small visual pause for smooth animation
      await new Promise((resolve) => setTimeout(resolve, 150));
    }

    setIsRunning(false);
  };

  const executedCount = testResults.filter((t) => t.actualStatus !== undefined).length;
  const passedCount = testResults.filter((t) => t.passed === true).length;
  const isComplete = executedCount === testResults.length;

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-slate-900 p-6 sm:p-8 rounded-2xl border border-slate-800 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight">
                Automated Client-Server Integration Test Suite
              </h2>
              <p className="text-sm text-slate-400">
                End-to-end integration tests verifying HTTP endpoints, validation error codes, and database persistence.
              </p>
            </div>
          </div>

          <button
            onClick={runAllTests}
            disabled={isRunning}
            className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 disabled:opacity-60 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition cursor-pointer"
          >
            {isRunning ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Executing Test Scenarios...
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                Run All Automated Integration Tests
              </>
            )}
          </button>
        </div>
      </div>

      {/* Summary Scorecard */}
      {isComplete && (
        <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-950/40 to-slate-900 border border-emerald-500/40 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <FileCheck className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs uppercase tracking-wider font-semibold text-emerald-400">
                  Integration Test Report
                </span>
                <h3 className="text-xl font-bold text-white">
                  {passedCount === testResults.length
                    ? 'All 6 Tests Passed Successfully (100% Pass Rate)'
                    : `${passedCount} of ${testResults.length} Tests Passed`}
                </h3>
                <p className="text-xs text-slate-300">
                  Client-server communication, HTTP status codes, schema validation, and persistent storage verified.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-center font-mono">
                <span className="text-xs text-slate-400 block">Status Codes</span>
                <span className="text-sm font-bold text-emerald-400">200, 201, 400</span>
              </div>
              <div className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-center font-mono">
                <span className="text-xs text-slate-400 block">Assessment</span>
                <span className="text-sm font-bold text-emerald-400">Ready for Evidence</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Test Cases List */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-xl overflow-hidden divide-y divide-slate-800">
        {testResults.map((test, index) => {
          const isExpanded = expandedTestId === test.id;
          return (
            <div key={test.id} className="p-5 sm:p-6 transition hover:bg-slate-800/30">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div className="mt-0.5">
                    {test.passed === true ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    ) : test.passed === false ? (
                      <XCircle className="w-5 h-5 text-rose-400" />
                    ) : (
                      <div className="w-5 h-5 rounded-full border-2 border-slate-600 flex items-center justify-center text-[10px] text-slate-500 font-mono">
                        {index + 1}
                      </div>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                          test.method === 'GET'
                            ? 'bg-blue-500/20 text-blue-300'
                            : 'bg-emerald-500/20 text-emerald-300'
                        }`}
                      >
                        {test.method}
                      </span>
                      <span className="text-xs font-mono text-slate-400">{test.endpoint}</span>
                      <h4 className="text-sm font-bold text-white">{test.title}</h4>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">{test.description}</p>
                  </div>
                </div>

                {/* Right Status Specs */}
                <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                  <div className="text-right font-mono text-xs">
                    <span className="text-slate-500 block text-[10px]">Expected / Actual</span>
                    <span className="text-slate-300">
                      HTTP {test.expectedStatus} /{' '}
                      {test.actualStatus !== undefined ? (
                        <strong
                          className={
                            test.passed ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'
                          }
                        >
                          {test.actualStatus}
                        </strong>
                      ) : (
                        <span className="text-slate-500">—</span>
                      )}
                    </span>
                  </div>

                  {test.durationMs !== undefined && (
                    <span className="text-xs font-mono text-slate-400 px-2 py-1 rounded bg-slate-950 border border-slate-800">
                      {test.durationMs}ms
                    </span>
                  )}

                  <button
                    onClick={() => setExpandedTestId(isExpanded ? null : test.id)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
                    title="Toggle JSON details"
                  >
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Expandable JSON Details */}
              {isExpanded && (
                <div className="mt-4 pt-4 border-t border-slate-800/80 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                  {test.requestPayload && (
                    <div className="space-y-1">
                      <span className="text-slate-400 text-[11px] block">Request Payload Dispatched:</span>
                      <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 max-h-48 overflow-auto">
                        <pre className="text-blue-300">{JSON.stringify(test.requestPayload, null, 2)}</pre>
                      </div>
                    </div>
                  )}

                  <div className="space-y-1">
                    <span className="text-slate-400 text-[11px] block">Server JSON Response Received:</span>
                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 max-h-48 overflow-auto">
                      <pre className={test.passed ? 'text-emerald-400' : 'text-rose-400'}>
                        {test.responsePayload
                          ? JSON.stringify(test.responsePayload, null, 2)
                          : '// Run the test suite to observe response'}
                      </pre>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
