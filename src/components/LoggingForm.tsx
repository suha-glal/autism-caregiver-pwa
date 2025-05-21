// src/components/LoggingForm.tsx
import React, { useState, useEffect } from 'react';
import { useOfflineSync } from '../hooks/useOfflineSync';
import { useLabels } from '../hooks/useLabels';
import { LogEntry } from '../lib/supabase';

interface LoggingFormProps {
  userId: string;
}

export function LoggingForm({ userId }: LoggingFormProps) {
  const [label, setLabel] = useState('');
  const [note, setNote] = useState('');
  const { isOnline, saveEntry, syncStatus } = useOfflineSync();
  const { labels, loading: labelsLoading, error: labelsError } = useLabels();
  
  // Reset label if selected label no longer exists
  useEffect(() => {
    if (label && labels.length > 0 && !labels.some(l => l.name === label)) {
      setLabel('');
    }
  }, [labels, label]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!label) {
      return;
    }

    const newEntry: LogEntry = {
      user_id: userId,
      label,
      note,
      timestamp: new Date().toISOString(),
    };

    // Save entry using the offline sync hook
    await saveEntry(newEntry);

    // Reset form
    setLabel('');
    setNote('');
  };
  
  return (
    <div className="form-container">
      <h2>Log Emotional/Behavioral State</h2>
      {labelsError && <p className="error-message">{labelsError}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="label" className="form-label">State Label</label>
          <select
            id="label"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            className="form-select"
            aria-required="true"
            disabled={labelsLoading}
          >
            <option value="">Select a state</option>
            {labels.map(labelOption => (
              <option key={labelOption.id} value={labelOption.name}>
                {labelOption.name}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="note" className="form-label">Notes (Optional)</label>
          <textarea
            id="note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="form-textarea"
            rows={4}
            placeholder="Add any additional notes here..."
          ></textarea>
        </div>
        <button type="submit" className="form-button" disabled={!label}>
          Save Entry
        </button>
        {syncStatus && <p className={`status-message ${isOnline ? 'status-saved' : 'status-pending'}`}>{syncStatus}</p>}
      </form>
    </div>
  );
}
