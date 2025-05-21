// src/App.tsx
import React, { useState, useEffect } from 'react';
import './App.css';
import { OfflineIndicator } from './components/OfflineIndicator';
import { AuthForm } from './components/AuthForm';
import { LoggingForm } from './components/LoggingForm';
import { LabelManager } from './components/LabelManager';
import { useAuth } from './hooks/useAuth';
import { useOfflineSync } from './hooks/useOfflineSync';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState<'log' | 'labels'>('log');
  const { user, loading, signOut } = useAuth();
  const { syncOfflineData } = useOfflineSync();

  // Check for dark mode preference
  useEffect(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDarkMode(prefersDark);
  }, []);

  // Apply dark mode class to body
  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="app">
      <OfflineIndicator />
      
      <header className="app-header">
        <h1>Autism Caregiver App</h1>
        <button 
          onClick={toggleDarkMode} 
          className="theme-toggle"
          aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          {isDarkMode ? "☀️" : "🌙"}
        </button>
      </header>
      
      <main className="app-main">
        {!user ? (
          <AuthForm />
        ) : (
          <div>
            <div className="user-controls">
              <button onClick={signOut} className="logout-button">Logout</button>
              <button onClick={syncOfflineData} className="sync-button">Sync Now</button>
            </div>
            
            <div className="tabs">
              <button 
                className={`tab-button ${activeTab === 'log' ? 'active' : ''}`}
                onClick={() => setActiveTab('log')}
              >
                Log Entry
              </button>
              <button 
                className={`tab-button ${activeTab === 'labels' ? 'active' : ''}`}
                onClick={() => setActiveTab('labels')}
              >
                Manage Labels
              </button>
            </div>
            
            {activeTab === 'log' ? (
              <LoggingForm userId={user.id} />
            ) : (
              <LabelManager />
            )}
          </div>
        )}
      </main>
      
      <footer className="app-footer">
        <p>© {new Date().getFullYear()} Autism Caregiver PWA</p>
      </footer>
    </div>
  );
}

export default App;
