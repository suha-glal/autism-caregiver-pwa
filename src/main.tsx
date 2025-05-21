import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

// PWA registration will be handled in production
// For now, we'll use a simple console message
console.log('PWA functionality will be enabled in production');

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
