import React from 'react';
import { Users, Sparkles, Rocket } from 'lucide-react';

export default function OnboardingScreen({ onNavigate }) {
  return (
    <div className="onboarding-screen-container">
      <div className="onboarding-top-content">
        {/* Blue Logo Badge */}
        <div className="onboarding-logo-badge">
          <div className="onboarding-logo-icon">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <line x1="19" y1="8" x2="19" y2="14"></line>
              <line x1="22" y1="11" x2="16" y2="11"></line>
            </svg>
          </div>
        </div>

        {/* Brand Titles */}
        <h1 className="onboarding-brand-title">CampusConnect</h1>
        <p className="onboarding-tagline">Connect • Collaborate • Create</p>

        {/* 3 Feature Cards */}
        <div className="onboarding-cards-grid">
          <div className="onboarding-card-item">
            <div className="onboarding-card-icon-wrap">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <line x1="19" y1="8" x2="19" y2="14"></line>
                <line x1="22" y1="11" x2="16" y2="11"></line>
              </svg>
            </div>
            <span className="onboarding-card-label">Connect</span>
          </div>

          <div className="onboarding-card-item">
            <div className="onboarding-card-icon-wrap">
              <Sparkles size={24} color="#2563EB" strokeWidth={2.2} />
            </div>
            <span className="onboarding-card-label">Collaborate</span>
          </div>

          <div className="onboarding-card-item">
            <div className="onboarding-card-icon-wrap">
              <Rocket size={24} color="#2563EB" strokeWidth={2.2} />
            </div>
            <span className="onboarding-card-label">Create</span>
          </div>
        </div>

        {/* Description paragraph */}
        <p className="onboarding-description">
          The student networking platform to build connections and achieve more together.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="onboarding-bottom-actions">
        <button
          id="btn-get-started"
          className="btn-primary-blue"
          onClick={() => onNavigate('signup')}
        >
          Get Started
        </button>
        <button
          id="btn-already-account"
          className="btn-secondary-outlined"
          onClick={() => onNavigate('login')}
        >
          I Already Have an Account
        </button>
      </div>
    </div>
  );
}
