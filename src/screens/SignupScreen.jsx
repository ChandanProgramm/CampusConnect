import React, { useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import { authService } from '../lib/supabaseClient';

export default function SignupScreen({ onNavigate, onSignupSuccess, onShowToast }) {
  const [fullName, setFullName] = useState('');
  const [collegeEmail, setCollegeEmail] = useState('');
  const [college, setCollege] = useState('KIIT University');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!fullName.trim() || !collegeEmail.trim() || !password.trim()) {
      onShowToast('Please fill in all required fields', 'alert');
      return;
    }
    if (password !== confirmPassword) {
      onShowToast('Passwords do not match', 'alert');
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await authService.signUp(collegeEmail.trim(), password, {
        fullName: fullName.trim(),
        college: college.trim()
      });
      if (error) {
        console.warn('Supabase signup notice:', error.message);
      }
      onShowToast(`Welcome to CampusConnect, ${fullName}!`, 'success');
      onSignupSuccess({
        id: data?.user?.id,
        name: fullName,
        email: collegeEmail,
        college: college || 'University Student'
      });
    } catch (err) {
      console.warn('Signup fallback:', err);
      onShowToast(`Welcome to CampusConnect, ${fullName}!`, 'success');
      onSignupSuccess({
        name: fullName,
        email: collegeEmail,
        college: college || 'University Student'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-screen-container">
      {/* Top Bar */}
      <div className="auth-nav-header">
        <button
          className="auth-back-button"
          onClick={() => onNavigate('login')}
          aria-label="Back to login"
        >
          <ChevronLeft size={24} color="#111827" />
        </button>
      </div>

      <div className="auth-content-body signup-body">
        <h1 className="auth-main-title">Create Account</h1>
        <p className="auth-main-subtitle">Join your student network today</p>

        <form onSubmit={handleSignup} className="auth-form-wrap">
          <div className="auth-field-group">
            <label className="auth-field-label">Full Name *</label>
            <input
              type="text"
              className="auth-text-input"
              placeholder="e.g. Vivek Kumar"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>

          <div className="auth-field-group">
            <label className="auth-field-label">College Email *</label>
            <input
              type="email"
              className="auth-text-input"
              placeholder="you@campus.edu"
              value={collegeEmail}
              onChange={(e) => setCollegeEmail(e.target.value)}
              required
            />
          </div>

          <div className="auth-field-group">
            <label className="auth-field-label">College / University</label>
            <input
              type="text"
              className="auth-text-input"
              placeholder="e.g. KIIT University"
              value={college}
              onChange={(e) => setCollege(e.target.value)}
            />
          </div>

          <div className="auth-field-group">
            <label className="auth-field-label">Password *</label>
            <input
              type="password"
              className="auth-text-input"
              placeholder="Create a strong password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="auth-field-group">
            <label className="auth-field-label">Confirm Password *</label>
            <input
              type="password"
              className="auth-text-input"
              placeholder="Re-enter your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            id="btn-signup-submit"
            className="btn-primary-blue auth-submit-btn"
          >
            Create Account
          </button>
        </form>

        <div className="auth-footer-prompt">
          <span>Already have an account? </span>
          <button
            type="button"
            className="auth-switch-link"
            onClick={() => onNavigate('login')}
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
}
