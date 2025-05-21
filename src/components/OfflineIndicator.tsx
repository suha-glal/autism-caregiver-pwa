// src/components/OfflineIndicator.tsx
import { useNetworkStatus } from '../hooks/useNetworkStatus';

export function OfflineIndicator() {
  const isOnline = useNetworkStatus();
  
  if (isOnline) {
    return null;
  }
  
  return (
    <div className="offline-indicator">
      You are offline. Data will be saved locally and synced when you're back online.
    </div>
  );
}
