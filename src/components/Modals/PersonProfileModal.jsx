import React from 'react';
import { X, MessageCircle, Briefcase, GraduationCap } from 'lucide-react';

export default function PersonProfileModal({ person, isOpen, onClose, onStartChat }) {
  if (!isOpen || !person) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-sheet person-profile-sheet" onClick={(e) => e.stopPropagation()}>
        {/* Header with close button */}
        <div className="modal-header">
          <span className="modal-title">Student Profile</span>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close profile">
            <X size={20} />
          </button>
        </div>

        {/* Profile Content */}
        <div className="person-sheet-content">
          {/* Avatar */}
          <div
            className="person-sheet-avatar"
            style={{ backgroundColor: person.avatarBg, color: person.avatarColor }}
          >
            <span>{person.initials}</span>
          </div>

          {/* Name */}
          <h3 className="person-sheet-name">{person.name}</h3>

          {/* Profession Card */}
          <div className="person-sheet-profession-card">
            <div className="person-profession-item">
              <Briefcase size={16} color="#2563EB" />
              <div className="person-profession-text">
                <span className="person-label">Profession</span>
                <span className="person-val">{person.role}</span>
              </div>
            </div>

            <div className="person-profession-item">
              <GraduationCap size={16} color="#2563EB" />
              <div className="person-profession-text">
                <span className="person-label">College</span>
                <span className="person-val">{person.college}</span>
              </div>
            </div>

            {person.skills && person.skills.length > 0 && (
              <div className="person-skills-section">
                <span className="person-label">Skills</span>
                <div className="person-skills-pill-row">
                  {person.skills.map((skill) => (
                    <span key={skill} className="person-sheet-skill-pill">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Chat Option Button */}
          <button
            id={`btn-chat-person-${person.id}`}
            className="person-sheet-chat-btn"
            onClick={() => onStartChat(person)}
          >
            <MessageCircle size={18} />
            <span>Chat with {person.name.split(' ')[0]}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
