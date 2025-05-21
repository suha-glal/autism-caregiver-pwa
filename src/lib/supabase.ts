// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials. Please check your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// Types for our application
export interface LogEntry {
  id?: string;
  user_id?: string;
  label: string;
  note: string;
  timestamp: string;
  synced?: boolean;
}

export interface Label {
  id?: string;
  name: string;
  created_at?: string;
}

// Offline storage functions
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

export const removeOfflineEntry = (index: number): void => {
  const existingData = localStorage.getItem('offlineEntries');
  
  if (!existingData) return;
  
  const offlineEntries: LogEntry[] = JSON.parse(existingData);
  offlineEntries.splice(index, 1);
  
  localStorage.setItem('offlineEntries', JSON.stringify(offlineEntries));
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
