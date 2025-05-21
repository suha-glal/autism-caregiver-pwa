// src/components/LabelManager.tsx
import React, { useState } from 'react';
import { useLabels } from '../hooks/useLabels';
import { Label } from '../lib/supabase';

export function LabelManager() {
  const [newLabelName, setNewLabelName] = useState('');
  const { labels, loading, error, addLabel, deleteLabel } = useLabels();
  const [actionStatus, setActionStatus] = useState('');
  
  const handleAddLabel = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newLabelName.trim()) {
      return;
    }
    
    const success = await addLabel(newLabelName.trim());
    
    if (success) {
      setNewLabelName('');
      setActionStatus('Label added successfully');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setActionStatus('');
      }, 3000);
    }
  };
  
  const handleDeleteLabel = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this label? Existing logs with this label will keep the label.')) {
      const success = await deleteLabel(id);
      
      if (success) {
        setActionStatus('Label deleted successfully');
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          setActionStatus('');
        }, 3000);
      }
    }
  };
  
  return (
    <div className="label-manager">
      <h2>Manage Labels</h2>
      
      {error && <p className="error-message">{error}</p>}
      {actionStatus && <p className="status-message">{actionStatus}</p>}
      
      <form onSubmit={handleAddLabel} className="add-label-form">
        <div className="form-group">
          <label htmlFor="newLabel" className="form-label">New Label</label>
          <div className="input-with-button">
            <input
              type="text"
              id="newLabel"
              value={newLabelName}
              onChange={(e) => setNewLabelName(e.target.value)}
              className="form-input"
              placeholder="Enter new label name"
            />
            <button type="submit" className="form-button">Add</button>
          </div>
        </div>
      </form>
      
      <div className="labels-list">
        <h3>Current Labels</h3>
        {loading ? (
          <p>Loading labels...</p>
        ) : labels.length === 0 ? (
          <p>No labels found. Add your first label above.</p>
        ) : (
          <ul className="labels-grid">
            {labels.map((label: Label) => (
              <li key={label.id} className="label-item">
                <span className="label-name">{label.name}</span>
                <button 
                  onClick={() => handleDeleteLabel(label.id!)} 
                  className="delete-button"
                  aria-label={`Delete ${label.name}`}
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
