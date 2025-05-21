// src/components/AuthForm.tsx
import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

export function AuthForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const { signIn, signUp } = useAuth();
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    
    const { error } = await signIn(email, password);
    
    if (error) {
      setAuthError(error.message || 'Login failed');
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    
    const { error } = await signUp(email, password);
    
    if (error) {
      setAuthError(error.message || 'Signup failed');
    } else {
      setAuthError('Check your email for the confirmation link');
    }
  };
  
  return (
    <div className="auth-container">
      <h2>Login or Sign Up</h2>
      {authError && <p className="auth-error">{authError}</p>}
      <form onSubmit={handleLogin} className="auth-form">
        <div className="form-group">
          <label htmlFor="email" className="form-label">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="password" className="form-label">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="form-input"
          />
        </div>
        <div className="auth-buttons">
          <button type="submit" className="form-button">Login</button>
          <button type="button" onClick={handleSignup} className="form-button secondary">Sign Up</button>
        </div>
      </form>
    </div>
  );
}
