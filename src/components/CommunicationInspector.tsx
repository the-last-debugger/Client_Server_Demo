import React, { useState, useEffect } from 'react';
import {
  Send,
  Server,
  Database,
  ArrowRight,
  Code2,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Clock,
  Activity,
  FileJson,
  Layers,
  Terminal,
  Play,
} from 'lucide-react';
import { ServerAuditLog } from '../types/student';
import { fetchAuditLogs } from '../services/api';

interface PresetTest {
  id: string;
  name: string;
  description: string;
  method: 'GET' | 'POST' | 'DELETE';
  endpoint: string;
  body?: string;
  expectedStatus: string;
}

export const CommunicationInspector: React.FC = () => {
  const presets: PresetTest[] = [
    {
      id: 'health',
      name: '1. Server Health Check',
      description: 'Pings /api/health to verify Express server status, uptime, and Firestore connectivity.',
      method: 'GET',
      endpoint: '/api/health',
      expectedStatus: '200 OK',
    },
    {
      id: 'get_students',
      name: '2. Query All Students',
      description: 'Calls GET /api/students to retrieve all saved records from the persistent database.',
      method: 'GET',
      endpoint: '/api/students',
      expectedStatus: '200 OK',
    },
    {
      id: 'post_valid',
      name: '3. Valid Registration (POST)',
      description: 'Sends valid student data to verify server validation and database insertion.',
      method: 'POST',
      endpoint: '/api/students',
      body: JSON.stringify(
        {
          studentName: 'Morgan Freeman',
          course: 'B.Sc. Artificial Intelligence',
          studentId: 'AI-2024-8831',
          email: 'm.freeman@college.edu',
        },
        null,
        2
      ),
      expectedStatus: '201 Created',
    },
    {
      id: 'post_invalid_name',
      name: '4. Validation Test: Missing Name',
      description: 'Sends payload with missing studentName to verify server returns 400 Bad Request.',
      method: 'POST',
      endpoint: '/api/students',
      body: JSON.stringify(
        {
          course: 'B.Sc. Computer Science',
          email: 'anon@college.edu',
        },
        null,
        2
      ),
      expectedStatus: '400 Bad Request',
    },
    {
      id: 'post_invalid_course',
      name: '5. Validation Test: Missing Course',
      description: 'Sends payload with missing course to verify server returns 400 Bad Request.',
      method: 'POST',
      endpoint: '/api/students',
      body: JSON.stringify(
        {
          studentName: 'Sarah Connor',
          studentId: 'SC-2024-001',
        },
        null,
        2
      ),
      expectedStatus: '400 Bad Request',
    },
  ];

  // Active Request State
  const [selectedPresetId, setSelectedPresetId] = useState<string>('health');
  const [method, setMethod] = useState<'GET' | 'POST' | 'DELETE'>('GET');
  const [endpoint, setEndpoint] = useState<string>('/api/health');
  const [requestBody, setRequestBody] = useState<string>('');

  // Execution & Response State
  const [isExecuting, setIsExecuting] = useState(false);
  const [responseStatus, setResponseStatus] = useState<number | null>(null);
  const [statusText, setStatusText] = useState<string>('');
  const [responseHeaders, setResponseHeaders] = useState<Record<string, string>>({});
  const [responseData, setResponseData] = useState<any>(null);
  const [durationMs, setDurationMs] = useState<number | null>(null);
  const [lastExecutedTime, setLastExecutedTime] = useState<string | null>(null);

  // Server Audit Logs State
  const [auditLogs, setAuditLogs] = useState<ServerAuditLog[]>([]);
  const [isLoadingLogs, setIsLoadingLogs] = useState(false);

  // On preset select
  const handleSelectPreset = (p: PresetTest) => {
    setSelectedPresetId(p.id);
    setMethod(p.method);
    setEndpoint(p.endpoint);
    setRequestBody(p.body || '');
  };

  // Execute HTTP Request
  const handleExecuteRequest = async () => {
    setIsExecuting(true);
    setResponseStatus(null);
    setResponseData(null);
    const startTime = performance.now();

    try {
      const options: RequestInit = {
        method,
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      };

      if (method === 'POST' && requestBody.trim()) {
        options.body = requestBody;
      }

      const res = await fetch(endpoint, options);
      const elapsed = Math.round(performance.now() - startTime);

      let parsedBody: any;
      try {
        parsedBody = await res.json();
      } catch {
        parsedBody = await res.text();
      }

      const headersObj: Record<string, string> = {};
      res.headers.forEach((val, key) => {
        headersObj[key] = val;
      });

      setResponseStatus(res.status);
      setStatusText(res.statusText || (res.status === 200 ? 'OK' : res.status === 201 ? 'Created' : 'Bad Request'));
      setResponseHeaders(headersObj);
      setResponseData(parsedBody);
      setDurationMs(elapsed);
      setLastExecutedTime(new Date().toLocaleTimeString());

      // Refresh server logs
      loadAuditLogs();
    } catch (err) {
      const elapsed = Math.round(performance.now() - startTime);
      setResponseStatus(0);
      setStatusText('Network Error');
      setResponseData({ error: err instanceof Error ? err.message : String(err) });
      setDurationMs(elapsed);
    } finally {
      setIsExecuting(false);
    }
  };

  // Load Server Audit Logs
  const loadAuditLogs = async () => {
    setIsLoadingLogs(true);
    try {
      const res = await fetchAuditLogs();
      setAuditLogs(res.logs);
    } catch (err) {
      console.error('Error fetching server logs:', err);
    } finally {
      setIsLoadingLogs(false);
    }
  };

  useEffect(() => {
    loadAuditLogs();
  }, []);

  return (
    <div className="space-y-8">
      {/* Overview Banner */}
      <div className="bg-slate-900 p-6 sm:p-8 rounded-2xl border border-slate-800 shadow-xl">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <Send className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Live Communication Inspector & Protocol Tester
            </h2>
            <p className="text-sm text-slate-400">
              Inspect HTTP client-server communication, JSON payloads, response status codes, and server-side database operation logs in real time.
            </p>
          </div>
        </div>
      </div>

      {/* Preset Selector */}
      <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
          <Activity className="w-4 h-4 text-purple-400" />
          Select Assignment Communication Test Scenario:
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {presets.map((preset) => {
            const isSelected = selectedPresetId === preset.id;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => handleSelectPreset(preset)}
                className={`p-3.5 rounded-xl border text-left transition flex flex-col justify-between cursor-pointer ${
                  isSelected
                    ? 'bg-purple-600/15 border-purple-500/50 ring-2 ring-purple-500/30'
                    : 'bg-slate-950/80 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                        preset.method === 'GET'
                          ? 'bg-blue-500/20 text-blue-300'
                          : preset.method === 'POST'
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : 'bg-rose-500/20 text-rose-300'
                      }`}
                    >
                      {preset.method}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">{preset.expectedStatus}</span>
                  </div>
                  <h4 className="text-xs font-bold text-white">{preset.name}</h4>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">{preset.description}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Two-Column Request & Response Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: HTTP Request Details (6 cols) */}
        <div className="lg:col-span-6 bg-slate-900 rounded-2xl border border-slate-800 shadow-xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-blue-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  HTTP Client Request (Client ➔ Server)
                </h3>
              </div>
              <span className="text-[11px] font-mono text-slate-400">REST API</span>
            </div>

            {/* Method & Endpoint Inputs */}
            <div className="space-y-4">
              <div className="flex gap-2">
                <select
                  value={method}
                  onChange={(e) => setMethod(e.target.value as any)}
                  className="px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-xs font-bold focus:border-blue-500 outline-none"
                >
                  <option value="GET">GET</option>
                  <option value="POST">POST</option>
                  <option value="DELETE">DELETE</option>
                </select>

                <input
                  type="text"
                  value={endpoint}
                  onChange={(e) => setEndpoint(e.target.value)}
                  placeholder="/api/..."
                  className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-xs focus:border-blue-500 outline-none"
                />
              </div>

              {/* Request Headers Preview */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono space-y-1">
                <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Request Headers</div>
                <div className="text-slate-300">Content-Type: <span className="text-emerald-400">application/json</span></div>
                <div className="text-slate-300">Accept: <span className="text-emerald-400">application/json</span></div>
              </div>

              {/* Request Payload Editor */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center justify-between">
                  <span>JSON Request Body</span>
                  {method === 'GET' && <span className="text-slate-500 lowercase">(not used for GET)</span>}
                </label>
                <textarea
                  rows={method === 'GET' ? 4 : 8}
                  disabled={method === 'GET'}
                  value={requestBody}
                  onChange={(e) => setRequestBody(e.target.value)}
                  placeholder={method === 'GET' ? '// GET requests do not include a request body' : '{\n  "studentName": "...",\n  "course": "..."\n}'}
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-emerald-400 font-mono text-xs outline-none focus:border-blue-500 disabled:opacity-40 transition"
                />
              </div>
            </div>
          </div>

          {/* Execute Button */}
          <div className="mt-6 pt-4 border-t border-slate-800">
            <button
              onClick={handleExecuteRequest}
              disabled={isExecuting}
              className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 active:bg-blue-700 disabled:opacity-60 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition cursor-pointer"
            >
              {isExecuting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Transmitting over HTTP/1.1...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  Send HTTP Request to Server
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: HTTP Server Response Details (6 cols) */}
        <div className="lg:col-span-6 bg-slate-900 rounded-2xl border border-slate-800 shadow-xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <FileJson className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  HTTP Server Response (Server ➔ Client)
                </h3>
              </div>
              {responseStatus !== null && (
                <span
                  className={`px-2.5 py-1 rounded text-xs font-mono font-bold ${
                    responseStatus === 200 || responseStatus === 201
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                  }`}
                >
                  {responseStatus} {statusText}
                </span>
              )}
            </div>

            {responseStatus !== null ? (
              <div className="space-y-4">
                {/* Latency & Protocol Metadata */}
                <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-slate-500 block text-[10px]">Round-trip Latency</span>
                    <span className="text-emerald-400 font-bold text-sm">{durationMs} ms</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-slate-500 block text-[10px]">Timestamp</span>
                    <span className="text-slate-300 font-semibold">{lastExecutedTime}</span>
                  </div>
                </div>

                {/* Formatted JSON Response Viewer */}
                <div>
                  <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                    <span>Parsed Server Response Body</span>
                    <span className="text-[11px] font-mono text-slate-500">application/json</span>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 max-h-72 overflow-auto">
                    <pre className="text-xs font-mono text-emerald-400">
                      {JSON.stringify(responseData, null, 2)}
                    </pre>
                  </div>
                </div>

                {/* DB Operation Tag */}
                {responseData?.databaseOperation && (
                  <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/30 text-xs text-blue-300 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Database className="w-3.5 h-3.5 text-blue-400" />
                      Database Operation:
                    </span>
                    <span className="font-mono font-semibold text-white">
                      {responseData.databaseOperation.status || 'COMMITTED'}
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <div className="py-16 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-slate-800 text-slate-400 mx-auto flex items-center justify-center">
                  <Send className="w-5 h-5 text-slate-500" />
                </div>
                <h4 className="text-sm font-semibold text-slate-300">Ready to Dispatch</h4>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  Click &quot;Send HTTP Request to Server&quot; on the left to see live HTTP status codes, headers, and parsed JSON payload.
                </p>
              </div>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800 text-xs text-slate-500 flex items-center justify-between">
            <span>HTTP/1.1 Standard Compliance</span>
            <span className="font-mono">Port 3000 (Express)</span>
          </div>
        </div>
      </div>

      {/* Real Server Audit Log Table */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="text-base font-bold text-white">Server-Side Transaction Audit Log</h3>
              <p className="text-xs text-slate-400">
                Real server-side audit entries recorded by the Express backend for each HTTP transaction
              </p>
            </div>
          </div>

          <button
            onClick={loadAuditLogs}
            disabled={isLoadingLogs}
            className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium flex items-center gap-1.5 transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-blue-400 ${isLoadingLogs ? 'animate-spin' : ''}`} />
            Refresh Logs
          </button>
        </div>

        {auditLogs.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-500">
            No server transactions recorded yet. Make a request above to log events.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="px-5 py-3">Timestamp</th>
                  <th className="px-5 py-3">Method</th>
                  <th className="px-5 py-3">Endpoint</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">DB Operation</th>
                  <th className="px-5 py-3">Duration</th>
                  <th className="px-5 py-3">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {auditLogs.slice(0, 10).map((log) => (
                  <tr key={log.id} className="hover:bg-slate-800/40 transition">
                    <td className="px-5 py-3 text-slate-500 text-[11px]">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          log.method === 'GET'
                            ? 'bg-blue-500/20 text-blue-400'
                            : log.method === 'POST'
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : 'bg-rose-500/20 text-rose-400'
                        }`}
                      >
                        {log.method}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-white font-semibold">{log.endpoint}</td>
                    <td className="px-5 py-3">
                      <span
                        className={`font-bold ${
                          log.statusCode === 200 || log.statusCode === 201
                            ? 'text-emerald-400'
                            : log.statusCode === 400
                            ? 'text-amber-400'
                            : 'text-rose-400'
                        }`}
                      >
                        {log.statusCode}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-blue-300 text-[11px]">{log.dbOperation}</td>
                    <td className="px-5 py-3 text-slate-400">{log.durationMs}ms</td>
                    <td className="px-5 py-3 text-slate-400 max-w-xs truncate" title={log.details}>
                      {log.details}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
