// src/api/apiClient.ts
import { LogEntry, AuthResponse, SyncResult } from './types';

// API base URL - will be configured based on environment
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

// Store auth token in localStorage
const getAuthToken = (): string | null => {
  return localStorage.getItem('authToken');
};

const setAuthToken = (token: string): void => {
  localStorage.setItem('authToken', token);
};

const clearAuthToken = (): void => {
  localStorage.removeItem('authToken');
};

// Helper for making authenticated requests
const fetchWithAuth = async (endpoint: string, options: RequestInit = {}): Promise<Response> => {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers
  };

  return fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers
  });
};

// Auth API
export const signIn = async (email: string, password: string): Promise<AuthResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/signin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (!response.ok) {
      return { user: null, error: { message: data.message || 'Login failed' } };
    }

    // Store the token
    if (data.token) {
      setAuthToken(data.token);
    }

    return { user: data.user, error: null };
  } catch (error) {
    return { user: null, error: { message: 'Network error' } };
  }
};

export const signUp = async (email: string, password: string): Promise<AuthResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (!response.ok) {
      return { user: null, error: { message: data.message || 'Signup failed' } };
    }

    return { user: null, error: null };
  } catch (error) {
    return { user: null, error: { message: 'Network error' } };
  }
};

export const signOut = async (): Promise<void> => {
  clearAuthToken();
};

export const getCurrentUser = async (): Promise<AuthResponse> => {
  try {
    const response = await fetchWithAuth('/auth/user');
    
    if (!response.ok) {
      clearAuthToken();
      return { user: null, error: { message: 'Session expired' } };
    }

    const data = await response.json();
    return { user: data.user, error: null };
  } catch (error) {
    return { user: null, error: { message: 'Network error' } };
  }
};

// Logs API
export const saveLogEntry = async (entry: LogEntry): Promise<{ success: boolean, error?: string }> => {
  try {
    const response = await fetchWithAuth('/logs', {
      method: 'POST',
      body: JSON.stringify(entry)
    });

    if (!response.ok) {
      const data = await response.json();
      return { success: false, error: data.message || 'Failed to save entry' };
    }

    return { success: true };
  } catch (error) {
    return { success: false, error: 'Network error' };
  }
};

export const syncOfflineEntries = async (entries: LogEntry[]): Promise<SyncResult> => {
  try {
    const response = await fetchWithAuth('/logs/sync', {
      method: 'POST',
      body: JSON.stringify({ entries })
    });

    if (!response.ok) {
      return { syncedCount: 0, failedCount: entries.length };
    }

    const data = await response.json();
    return data;
  } catch (error) {
    return { syncedCount: 0, failedCount: entries.length };
  }
};

// Offline storage
export const saveToLocalStorage = (entry: LogEntry): void => {
  const existingData = localStorage.getItem('offlineEntries');
  let offlineEntries: LogEntry[] = [];
  
  if (existingData) {
    offlineEntries = JSON.parse(existingData);
  }
  
  offlineEntries.push(entry);
  localStorage.setItem('offlineEntries', JSON.stringify(offlineEntries));
};

export const getOfflineEntries = (): LogEntry[] => {
  const existingData = localStorage.getItem('offlineEntries');
  
  if (!existingData) return [];
  
  return JSON.parse(existingData);
};

export const clearSyncedEntries = (syncedIndices: number[]): void => {
  const existingData = localStorage.getItem('offlineEntries');
  
  if (!existingData) return;
  
  const offlineEntries: LogEntry[] = JSON.parse(existingData);
  const remainingEntries = offlineEntries.filter((_, index) => !syncedIndices.includes(index));
  
  localStorage.setItem('offlineEntries', JSON.stringify(remainingEntries));
};

export const getOfflineEntriesCount = (): number => {
  const entries = getOfflineEntries();
  return entries.length;
};
