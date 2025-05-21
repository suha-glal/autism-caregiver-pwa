// src/api/types.ts
export interface LogEntry {
  id?: string;
  user_id?: string;
  label: string;
  note: string;
  timestamp: string;
  synced?: boolean;
}

export interface AuthResponse {
  user: User | null;
  error: Error | null;
}

export interface User {
  id: string;
  email: string;
}

export interface Error {
  message: string;
}

export interface SyncResult {
  syncedCount: number;
  failedCount: number;
}
