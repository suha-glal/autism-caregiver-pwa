// src/hooks/useOfflineSync.ts
import { useState, useEffect } from 'react';
import { useNetworkStatus } from './useNetworkStatus';
import { LogEntry, supabase, getOfflineEntries, clearSyncedEntries, saveToLocalStorage } from '../lib/supabase';

export function useOfflineSync() {
  const isOnline = useNetworkStatus();
  const [syncStatus, setSyncStatus] = useState<string>('');
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  // Sync offline entries when coming back online
  useEffect(() => {
    if (isOnline) {
      syncOfflineData();
    }
  }, [isOnline]);

  // Save entry (online or offline)
  const saveEntry = async (entry: LogEntry): Promise<boolean> => {
    // Always save to local storage first for offline-first behavior
    saveToLocalStorage(entry);
    
    // If online, try to sync immediately
    if (isOnline) {
      try {
        const { error } = await supabase
          .from('logs')
          .insert([
            { 
              label: entry.label, 
              note: entry.note, 
              timestamp: entry.timestamp 
            }
          ]);
        
        if (error) throw error;
        
        setSyncStatus('Entry saved and synced successfully!');
        return true;
      } catch (error: any) {
        setSyncStatus(`Entry saved locally. Sync failed: ${error.message}`);
        return false;
      }
    } else {
      setSyncStatus('Saved offline. Will sync when online.');
      return false;
    }
  };

  // Sync all offline data
  const syncOfflineData = async (): Promise<void> => {
    const offlineEntries = getOfflineEntries();
    
    if (offlineEntries.length === 0) return;
    
    setIsSyncing(true);
    setSyncStatus(`Syncing ${offlineEntries.length} offline entries...`);
    
    const syncedIndices: number[] = [];
    
    for (let i = 0; i < offlineEntries.length; i++) {
      const entry = offlineEntries[i];
      
      try {
        const { error } = await supabase
          .from('logs')
          .insert([
            { 
              label: entry.label, 
              note: entry.note, 
              timestamp: entry.timestamp 
            }
          ]);
        
        if (!error) {
          syncedIndices.push(i);
        }
      } catch (error) {
        console.error('Error syncing entry:', error);
      }
    }
    
    // Clear synced entries from localStorage
    if (syncedIndices.length > 0) {
      clearSyncedEntries(syncedIndices);
    }
    
    const failedCount = offlineEntries.length - syncedIndices.length;
    
    if (failedCount === 0) {
      setSyncStatus(`All ${syncedIndices.length} entries synced successfully!`);
    } else {
      setSyncStatus(`Synced ${syncedIndices.length} entries. ${failedCount} failed.`);
    }
    
    setIsSyncing(false);
  };

  // Get count of offline entries
  const getOfflineCount = (): number => {
    return getOfflineEntries().length;
  };

  return {
    isOnline,
    syncStatus,
    isSyncing,
    saveEntry,
    syncOfflineData,
    getOfflineCount
  };
}
