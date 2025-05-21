// src/hooks/useLabels.ts
import { useState, useEffect } from 'react';
import { supabase, Label } from '../lib/supabase';

export function useLabels() {
  const [labels, setLabels] = useState<Label[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all labels
  const fetchLabels = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('labels')
        .select('*')
        .order('name', { ascending: true });
      
      if (error) throw error;
      
      setLabels(data || []);
    } catch (err: any) {
      console.error('Error fetching labels:', err);
      setError(err.message || 'Failed to fetch labels');
    } finally {
      setLoading(false);
    }
  };

  // Add a new label
  const addLabel = async (name: string) => {
    try {
      setError(null);
      
      // Check if label already exists
      const exists = labels.some(label => 
        label.name.toLowerCase() === name.toLowerCase()
      );
      
      if (exists) {
        setError('A label with this name already exists');
        return false;
      }
      
      const { error } = await supabase
        .from('labels')
        .insert([{ name }]);
      
      if (error) throw error;
      
      // Refresh labels
      await fetchLabels();
      return true;
    } catch (err: any) {
      console.error('Error adding label:', err);
      setError(err.message || 'Failed to add label');
      return false;
    }
  };

  // Delete a label
  const deleteLabel = async (id: string) => {
    try {
      setError(null);
      
      const { error } = await supabase
        .from('labels')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      // Refresh labels
      await fetchLabels();
      return true;
    } catch (err: any) {
      console.error('Error deleting label:', err);
      setError(err.message || 'Failed to delete label');
      return false;
    }
  };

  // Load labels on component mount
  useEffect(() => {
    fetchLabels();
  }, []);

  return {
    labels,
    loading,
    error,
    fetchLabels,
    addLabel,
    deleteLabel
  };
}
