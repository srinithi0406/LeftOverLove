// src/components/AuthModal.jsx
// Login / Sign Up modal 
// Used AuthContext for show/hide state.

import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { login, signup } from '../services/authService';

export default function AuthModal() {
  const { showAuthModal, closeAuthModal } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    const success = await login(email, password);
    if (success) {
      setEmail('');
      setPassword('');
      closeAuthModal();
    }
  };

  const handleSignup = async () => {
    const success = await signup(email, password);
    if (success) {
      setEmail('');
      setPassword('');
      closeAuthModal();
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) closeAuthModal();
  };

  if (!showAuthModal) return null;

  return (
    <div
      className="auth-modal"
      id="authModal"
      style={{ display: 'flex' }}
      onClick={handleBackdropClick}
    >
      <div className="auth-box">
        <span id="closeModal" className="close" onClick={closeAuthModal}>
          &times;
        </span>
        <h2>Login / Sign Up</h2>
        <input
          type="email"
          id="email"
          placeholder="Email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          id="password"
          placeholder="Password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleLogin}>Login</button>
        <button onClick={handleSignup}>Sign Up</button>
      </div>
    </div>
  );
}
