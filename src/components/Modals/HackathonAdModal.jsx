import React from 'react';
import { X, Trophy, Clock, Users, Globe, CheckCircle2, Sparkles, ExternalLink, UserPlus } from 'lucide-react';

export default function HackathonAdModal({
  hackathon,
  isOpen,
  onClose,
  onRegister,
  onFindTeammates
}) {
  if (!isOpen || !hackathon) return null;

  const isLive = hackathon.status === 'live';
  const isRegistered = hackathon.registered;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-sheet hackathon-ad-sheet" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div className="hackathon-modal-header-tag">
            <span className="hackathon-ad-promoted-pill">SPONSORED AD</span>
            <span className="modal-title" style={{ fontSize: 16 }}>Hackathon Details</span>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        {/* Modal Scroll Content */}
        <div className="hackathon-modal-scroll">
          {/* Hero Banner */}
          <div
            className="hackathon-modal-hero"
            style={{ background: hackathon.bannerGradient || 'linear-gradient(135deg, #1E1B4B 0%, #312E81 100%)' }}
          >
            <div className="hackathon-modal-hero-top">
              <span className={`hackathon-status-pill ${isLive ? 'live' : 'ready'}`}>
                {isLive ? (
                  <>
                    <span className="live-pulse-dot" />
                    LIVE NOW
                  </>
                ) : (
                  <>
                    <Sparkles size={12} />
                    REGISTRATION OPEN
                  </>
                )}
              </span>
              <span className="hackathon-mode-badge">{hackathon.mode}</span>
            </div>

            <h2 className="hackathon-modal-hero-title">{hackathon.title}</h2>
            <p className="hackathon-modal-hero-organizer">Presented by {hackathon.organizer}</p>
          </div>

          {/* Quick Metrics Grid */}
          <div className="hackathon-metrics-grid">
            <div className="hackathon-metric-card">
              <div className="metric-icon-wrap trophy">
                <Trophy size={18} color="#D97706" />
              </div>
              <div className="metric-details">
                <span className="metric-label">Prize Pool</span>
                <span className="metric-val prize">{hackathon.prizePool}</span>
              </div>
            </div>

            <div className="hackathon-metric-card">
              <div className="metric-icon-wrap clock">
                <Clock size={18} color={isLive ? '#DC2626' : '#2563EB'} />
              </div>
              <div className="metric-details">
                <span className="metric-label">{isLive ? 'Live Status' : 'Deadline'}</span>
                <span className="metric-val">{hackathon.deadline}</span>
              </div>
            </div>

            <div className="hackathon-metric-card">
              <div className="metric-icon-wrap team">
                <Users size={18} color="#7C3AED" />
              </div>
              <div className="metric-details">
                <span className="metric-label">Team Size</span>
                <span className="metric-val">{hackathon.teamSize}</span>
              </div>
            </div>

            <div className="hackathon-metric-card">
              <div className="metric-icon-wrap location">
                <Globe size={18} color="#059669" />
              </div>
              <div className="metric-details">
                <span className="metric-label">Location / Mode</span>
                <span className="metric-val">{hackathon.location}</span>
              </div>
            </div>
          </div>

          {/* About Section */}
          <div className="hackathon-modal-section">
            <h4 className="hackathon-modal-section-title">About this Hackathon</h4>
            <p className="hackathon-modal-desc">{hackathon.about}</p>
          </div>

          {/* Tracks / Tags */}
          <div className="hackathon-modal-section">
            <h4 className="hackathon-modal-section-title">Focus Tracks & Technologies</h4>
            <div className="hackathon-tags-wrap">
              {hackathon.tags?.map((tag) => (
                <span key={tag} className="hackathon-tag-pill">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Live Engagement Stat */}
          <div className="hackathon-stat-callout">
            <Users size={16} color="#4B5563" />
            <span><strong>{hackathon.participantsCount}</strong> are already engaging with this event!</span>
          </div>

          {/* Actions */}
          <div className="hackathon-modal-actions">
            <button
              id={`btn-register-hack-${hackathon.id}`}
              className={`hackathon-btn-primary ${isRegistered ? 'registered' : ''}`}
              onClick={() => {
                if (onRegister) onRegister(hackathon.id);
              }}
            >
              {isRegistered ? (
                <>
                  <CheckCircle2 size={18} />
                  <span>Registered for Hackathon</span>
                </>
              ) : (
                <>
                  <ExternalLink size={18} />
                  <span>{isLive ? 'Enter Live Hackathon / Register' : 'Register for Hackathon'}</span>
                </>
              )}
            </button>

            <button
              className="hackathon-btn-secondary"
              onClick={() => {
                onClose();
                if (onFindTeammates) onFindTeammates();
              }}
            >
              <UserPlus size={18} />
              <span>Find Teammates on CampusConnect</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
