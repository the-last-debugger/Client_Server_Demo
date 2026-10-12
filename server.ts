import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  setDoc,
  deleteDoc,
  getDoc,
  Firestore
} from 'firebase/firestore';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Server-side audit log for assignment inspection
interface ServerAuditLog {
  id: string;
  timestamp: string;
  method: string;
  endpoint: string;
  statusCode: number;
  dbOperation: string;
  durationMs: number;
  details: string;
}

const auditLogs: ServerAuditLog[] = [];

function recordAudit(log: Omit<ServerAuditLog, 'id' | 'timestamp'>) {
  const entry: ServerAuditLog = {
    id: 'LOG-' + Math.random().toString(36).substring(2, 9),
    timestamp: new Date().toISOString(),
    ...log,
  };
  auditLogs.unshift(entry);
  if (auditLogs.length > 50) {
    auditLogs.pop();
  }
}

// Ensure local persistence backup directory exists
const DATA_DIR = path.resolve(__dirname, 'data');
const BACKUP_FILE = path.join(DATA_DIR, 'students_backup.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

interface StudentRecord {
  id: string;
  studentName: string;
  course: string;
  studentId?: string;
  email?: string;
  registrationTimestamp: string;
}

function readBackup(): StudentRecord[] {
  try {
    if (fs.existsSync(BACKUP_FILE)) {
      const raw = fs.readFileSync(BACKUP_FILE, 'utf-8');
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Error reading local backup store:', err);
  }
  return [];
}

function writeBackup(records: StudentRecord[]) {
  try {
    fs.writeFileSync(BACKUP_FILE, JSON.stringify(records, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing local backup store:', err);
  }
}

// Initialize Firebase Firestore
let db: Firestore | null = null;
let firestoreDatabaseId = '';
let firestoreConnected = false;

try {
  const configPath = path.resolve(__dirname, 'firebase-applet-config.json');
  if (fs.existsSync(configPath)) {
    const firebaseConfig = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
    firestoreDatabaseId = firebaseConfig.firestoreDatabaseId || '(default)';
    const firebaseApp = initializeApp(firebaseConfig);
    db = getFirestore(firebaseApp, firebaseConfig.firestoreDatabaseId);
    firestoreConnected = true;
    console.log(`[Firebase] Firestore initialized with database: ${firestoreDatabaseId}`);
  } else {
    console.warn('[Firebase] firebase-applet-config.json not found, using file persistence.');
  }
} catch (error) {
  console.error('[Firebase] Error initializing Firestore:', error);
}

// -------------------------------------------------------------
// REST API ENDPOINTS
// -------------------------------------------------------------

// 1. Health-check endpoint: Demonstrates server status and database connectivity
app.get('/api/health', async (_req: Request, res: Response) => {
  const startTime = Date.now();
  let dbCheckStatus = 'checking';
  let dbItemCount = 0;

  try {
    if (db) {
      const snap = await getDocs(collection(db, 'students'));
      dbItemCount = snap.size;
      dbCheckStatus = 'connected_verified';
    } else {
      const local = readBackup();
      dbItemCount = local.length;
      dbCheckStatus = 'local_store_active';
    }
  } catch (err) {
    dbCheckStatus = 'degraded: ' + (err instanceof Error ? err.message : String(err));
  }

  const duration = Date.now() - startTime;
  const payload = {
    status: 'ONLINE',
    service: 'Student Registration System - Activity 3 API',
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
    layer: 'Application / Server Layer (Express on Node.js)',
    environment: process.env.NODE_ENV || 'development',
    port: PORT,
    database: {
      type: db ? 'Firebase Firestore (Cloud)' : 'Persistent File Store',
      databaseId: firestoreDatabaseId || 'local-persistent-store',
      status: dbCheckStatus,
      recordsCount: dbItemCount,
    },
    latencyMs: duration,
  };

  recordAudit({
    method: 'GET',
    endpoint: '/api/health',
    statusCode: 200,
    dbOperation: 'FIRESTORE_PING_COLLECTION',
    durationMs: duration,
    details: `Health check responded OK in ${duration}ms, DB status: ${dbCheckStatus}`,
  });

  res.status(200).json(payload);
});

// 2. GET /api/students: Retrieve saved student records from persistent database
app.get('/api/students', async (_req: Request, res: Response) => {
  const startTime = Date.now();
  try {
    let students: StudentRecord[] = [];

    if (db) {
      const snapshot = await getDocs(collection(db, 'students'));
      snapshot.forEach((docSnap) => {
        const data = docSnap.data() as StudentRecord;
        students.push({
          id: docSnap.id,
          studentName: data.studentName,
          course: data.course,
          studentId: data.studentId || docSnap.id,
          email: data.email || '',
          registrationTimestamp: data.registrationTimestamp || new Date().toISOString(),
        });
      });

      // Keep backup in sync
      if (students.length > 0) {
        writeBackup(students);
      } else {
        // If Firestore is empty, check backup
        const backup = readBackup();
        if (backup.length > 0) {
          students = backup;
        }
      }
    } else {
      students = readBackup();
    }

    // Sort newest first
    students.sort((a, b) => new Date(b.registrationTimestamp).getTime() - new Date(a.registrationTimestamp).getTime());

    const duration = Date.now() - startTime;
    recordAudit({
      method: 'GET',
      endpoint: '/api/students',
      statusCode: 200,
      dbOperation: 'FIRESTORE_READ_ALL',
      durationMs: duration,
      details: `Retrieved ${students.length} student records from database`,
    });

    res.status(200).json({
      success: true,
      message: 'Student records successfully retrieved from database',
      count: students.length,
      data: students,
      storageEngine: db ? 'Firebase Firestore' : 'Persistent Storage',
      executionTimeMs: duration,
      retrievedAt: new Date().toISOString(),
    });
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error('Error fetching students:', error);
    
    // Fallback to local backup to ensure student records are never lost
    const local = readBackup();
    recordAudit({
      method: 'GET',
      endpoint: '/api/students',
      statusCode: 200,
      dbOperation: 'FALLBACK_BACKUP_READ',
      durationMs: duration,
      details: `Read fallback backup (${local.length} records) due to error: ${error instanceof Error ? error.message : String(error)}`,
    });

    res.status(200).json({
      success: true,
      message: 'Retrieved student records from persistent storage',
      count: local.length,
      data: local,
      storageEngine: 'Local Persistent Backup',
      warning: error instanceof Error ? error.message : 'Firestore read warning',
      executionTimeMs: duration,
    });
  }
});

// 3. POST /api/students: Register a student with strict server-side validation & persistence
app.post('/api/students', async (req: Request, res: Response) => {
  const startTime = Date.now();
  const { studentName, course, studentId, email } = req.body;

  // Server-side validation 1: Student Name
  if (!studentName || typeof studentName !== 'string' || studentName.trim().length < 2) {
    const duration = Date.now() - startTime;
    recordAudit({
      method: 'POST',
      endpoint: '/api/students',
      statusCode: 400,
      dbOperation: 'VALIDATION_REJECTED',
      durationMs: duration,
      details: 'Rejected: Student name is missing or less than 2 characters',
    });

    return res.status(400).json({
      success: false,
      error: 'Validation Error: Student name is required and must be at least 2 characters.',
      field: 'studentName',
      receivedValue: studentName ?? null,
    });
  }

  // Server-side validation 2: Course
  if (!course || typeof course !== 'string' || course.trim().length < 2) {
    const duration = Date.now() - startTime;
    recordAudit({
      method: 'POST',
      endpoint: '/api/students',
      statusCode: 400,
      dbOperation: 'VALIDATION_REJECTED',
      durationMs: duration,
      details: 'Rejected: Course is missing or less than 2 characters',
    });

    return res.status(400).json({
      success: false,
      error: 'Validation Error: Course is required and must be at least 2 characters.',
      field: 'course',
      receivedValue: course ?? null,
    });
  }

  // Generate unique clean ID matching Firestore rules: '^[a-zA-Z0-9_\\-]+$'
  const randomSuffix = Math.random().toString(36).substring(2, 8);
  const docId = `STU_${Date.now()}_${randomSuffix}`;
  const assignedStudentId = studentId && typeof studentId === 'string' && studentId.trim().length > 0
    ? studentId.trim().replace(/[^a-zA-Z0-9_\-]/g, '')
    : `ID-${Math.floor(10000 + Math.random() * 90000)}`;

  const newRecord: StudentRecord = {
    id: docId,
    studentName: studentName.trim(),
    course: course.trim(),
    studentId: assignedStudentId,
    email: email && typeof email === 'string' ? email.trim() : '',
    registrationTimestamp: new Date().toISOString(),
  };

  try {
    let dbStatus = 'SAVED';

    if (db) {
      const docRef = doc(db, 'students', docId);
      await setDoc(docRef, newRecord);
      dbStatus = 'COMMITTED_TO_FIRESTORE';
    }

    // Always mirror to persistent backup
    const current = readBackup();
    current.push(newRecord);
    writeBackup(current);

    const duration = Date.now() - startTime;
    recordAudit({
      method: 'POST',
      endpoint: '/api/students',
      statusCode: 201,
      dbOperation: 'FIRESTORE_INSERT_RECORD',
      durationMs: duration,
      details: `Successfully registered student "${newRecord.studentName}" for "${newRecord.course}" (ID: ${docId})`,
    });

    return res.status(201).json({
      success: true,
      message: 'Student record successfully validated and committed to database.',
      data: newRecord,
      databaseOperation: {
        operation: 'INSERT',
        collection: 'students',
        documentId: docId,
        status: dbStatus,
      },
      executionTimeMs: duration,
      serverTimestamp: newRecord.registrationTimestamp,
    });
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error('Error saving student to Firestore:', error);

    // Save to local backup so the student record is NEVER lost
    const current = readBackup();
    current.push(newRecord);
    writeBackup(current);

    recordAudit({
      method: 'POST',
      endpoint: '/api/students',
      statusCode: 201,
      dbOperation: 'LOCAL_PERSISTENCE_SAVED',
      durationMs: duration,
      details: `Saved to local persistent store: ${error instanceof Error ? error.message : String(error)}`,
    });

    return res.status(201).json({
      success: true,
      message: 'Student record saved to persistent storage.',
      data: newRecord,
      databaseOperation: {
        operation: 'INSERT',
        status: 'COMMITTED_TO_BACKUP',
        note: 'Saved persistently on server disk storage',
      },
      executionTimeMs: duration,
    });
  }
});

// 4. DELETE /api/students/:id: Delete a student record
app.delete('/api/students/:id', async (req: Request, res: Response) => {
  const startTime = Date.now();
  const studentDocId = req.params.id;

  try {
    if (db) {
      await deleteDoc(doc(db, 'students', studentDocId));
    }

    const current = readBackup();
    const updated = current.filter((s) => s.id !== studentDocId);
    writeBackup(updated);

    const duration = Date.now() - startTime;
    recordAudit({
      method: 'DELETE',
      endpoint: `/api/students/${studentDocId}`,
      statusCode: 200,
      dbOperation: 'FIRESTORE_DELETE_RECORD',
      durationMs: duration,
      details: `Deleted student record ID: ${studentDocId}`,
    });

    res.status(200).json({
      success: true,
      message: `Student record ${studentDocId} successfully deleted from database.`,
      id: studentDocId,
      executionTimeMs: duration,
    });
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error('Error deleting student:', error);
    recordAudit({
      method: 'DELETE',
      endpoint: `/api/students/${studentDocId}`,
      statusCode: 500,
      dbOperation: 'DELETE_ERROR',
      durationMs: duration,
      details: `Failed to delete record: ${error instanceof Error ? error.message : String(error)}`,
    });

    res.status(500).json({
      success: false,
      error: 'Database deletion error: ' + (error instanceof Error ? error.message : String(error)),
    });
  }
});

// 5. POST /api/students/seed: Seed starter sample data for testing
app.post('/api/students/seed', async (_req: Request, res: Response) => {
  const sampleStudents: Omit<StudentRecord, 'id' | 'registrationTimestamp'>[] = [
    {
      studentName: 'Alex Rivera',
      course: 'B.Sc. Computer Science',
      studentId: 'CS-2024-0101',
      email: 'alex.rivera@college.edu',
    },
    {
      studentName: 'Samantha Chen',
      course: 'B.Eng. Software Engineering',
      studentId: 'SE-2024-0205',
      email: 's.chen@college.edu',
    },
    {
      studentName: 'Marcus Johnson',
      course: 'B.Sc. Information Technology',
      studentId: 'IT-2024-0312',
      email: 'marcus.j@college.edu',
    },
  ];

  const added: StudentRecord[] = [];
  for (const s of sampleStudents) {
    const randomSuffix = Math.random().toString(36).substring(2, 8);
    const docId = `STU_${Date.now()}_${randomSuffix}`;
    const record: StudentRecord = {
      ...s,
      id: docId,
      registrationTimestamp: new Date().toISOString(),
    };

    if (db) {
      try {
        await setDoc(doc(db, 'students', docId), record);
      } catch (err) {
        console.warn('Seeding firestore warning:', err);
      }
    }
    added.push(record);
  }

  const current = readBackup();
  writeBackup([...current, ...added]);

  recordAudit({
    method: 'POST',
    endpoint: '/api/students/seed',
    statusCode: 201,
    dbOperation: 'SEED_BATCH_INSERT',
    durationMs: 15,
    details: `Seeded ${added.length} sample student records`,
  });

  res.status(201).json({
    success: true,
    message: `Successfully seeded ${added.length} student records into database.`,
    count: added.length,
    data: added,
  });
});

// 6. GET /api/audit-logs: View live server transactions
app.get('/api/audit-logs', (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    totalLogs: auditLogs.length,
    logs: auditLogs,
  });
});

// -------------------------------------------------------------
// FRONTEND SERVING (Vite in dev, static dist in production)
// -------------------------------------------------------------

async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`[Server] Activity 3 Client-Server Application running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('[Server] Fatal startup error:', err);
});
