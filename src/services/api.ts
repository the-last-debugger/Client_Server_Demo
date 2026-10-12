import { ApiResponse, HealthStatus, ServerAuditLog, Student } from '../types/student';

const BASE_URL = '/api';

export async function fetchHealth(): Promise<{ status: number; data: HealthStatus; durationMs: number }> {
  const start = performance.now();
  const response = await fetch(`${BASE_URL}/health`);
  const durationMs = Math.round(performance.now() - start);
  const data = await response.json();
  return { status: response.status, data, durationMs };
}

export async function fetchStudents(): Promise<{ status: number; data: ApiResponse<Student[]>; durationMs: number }> {
  const start = performance.now();
  const response = await fetch(`${BASE_URL}/students`);
  const durationMs = Math.round(performance.now() - start);
  const data = await response.json();
  return { status: response.status, data, durationMs };
}

export async function createStudent(payload: {
  studentName: string;
  course: string;
  studentId?: string;
  email?: string;
}): Promise<{ status: number; data: ApiResponse<Student>; durationMs: number }> {
  const start = performance.now();
  const response = await fetch(`${BASE_URL}/students`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  const durationMs = Math.round(performance.now() - start);
  const data = await response.json();
  return { status: response.status, data, durationMs };
}

export async function removeStudent(id: string): Promise<{ status: number; data: ApiResponse; durationMs: number }> {
  const start = performance.now();
  const response = await fetch(`${BASE_URL}/students/${id}`, {
    method: 'DELETE',
  });
  const durationMs = Math.round(performance.now() - start);
  const data = await response.json();
  return { status: response.status, data, durationMs };
}

export async function seedSampleStudents(): Promise<{ status: number; data: ApiResponse<Student[]>; durationMs: number }> {
  const start = performance.now();
  const response = await fetch(`${BASE_URL}/students/seed`, {
    method: 'POST',
  });
  const durationMs = Math.round(performance.now() - start);
  const data = await response.json();
  return { status: response.status, data, durationMs };
}

export async function fetchAuditLogs(): Promise<{ status: number; logs: ServerAuditLog[]; durationMs: number }> {
  const start = performance.now();
  const response = await fetch(`${BASE_URL}/audit-logs`);
  const durationMs = Math.round(performance.now() - start);
  const data = await response.json();
  return { status: response.status, logs: data.logs || [], durationMs };
}
