export interface Student {
  id: string;
  studentName: string;
  course: string;
  studentId?: string;
  email?: string;
  registrationTimestamp: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  error?: string;
  field?: string;
  count?: number;
  data?: T;
  storageEngine?: string;
  executionTimeMs?: number;
  serverTimestamp?: string;
  databaseOperation?: {
    operation?: string;
    collection?: string;
    documentId?: string;
    status?: string;
    note?: string;
  };
}

export interface HealthStatus {
  status: string;
  service: string;
  uptimeSeconds: number;
  timestamp: string;
  layer: string;
  environment: string;
  port: number | string;
  database: {
    type: string;
    databaseId: string;
    status: string;
    recordsCount: number;
  };
  latencyMs: number;
}

export interface ServerAuditLog {
  id: string;
  timestamp: string;
  method: string;
  endpoint: string;
  statusCode: number;
  dbOperation: string;
  durationMs: number;
  details: string;
}

export interface TestCaseResult {
  id: string;
  title: string;
  description: string;
  endpoint: string;
  method: 'GET' | 'POST' | 'DELETE';
  expectedStatus: number;
  actualStatus?: number;
  passed?: boolean;
  requestPayload?: any;
  responsePayload?: any;
  durationMs?: number;
  error?: string;
}
