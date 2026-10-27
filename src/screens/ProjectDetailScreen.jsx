import React from 'react';
import { ChevronLeft, MessageSquare, Check, Users, ShieldCheck } from 'lucide-react';

export default function ProjectDetailScreen({
  project,
  onNavigateBack,
  onRequestJoin,
  onChatWithTeam
}) {
  if (!project) return null;

  return (
    <div className="project-detail-wrap">
      {/* Header */}
      <div className="app-header">
        <button
          className="header-action-btn"
          onClick={onNavigateBack}
          aria-label="Back to projects"
        >
          <ChevronLeft size={24} color="#111827" />
        </button>
        <span className="app-header-title">Project Details</span>
        <div style={{ width: 36 }} />
      </div>

      <div className="screen-scroll-container">
        <div className="project-detail-body">
          {/* Top Title & Status */}
          <div className="project-detail-hero">
            <div className="project-detail-title-row">
              <h2 className="project-detail-title">{project.title}</h2>
              <span className={`status-badge status-${project.status.toLowerCase()}`}>
                {project.status}
              </span>
            </div>
            <p className="project-detail-tagline">{project.description}</p>
          </div>

          {/* Tech Stack */}
          <div className="detail-section">
            <h4 className="detail-section-title">Tech Stack</h4>
            <div className="detail-tech-pills">
              {project.techStack.map((tech) => (
                <span key={tech} className="detail-stack-pill">{tech}</span>
              ))}
            </div>
          </div>

          {/* About */}
          <div className="detail-section">
            <h4 className="detail-section-title">About</h4>
            <p className="detail-about-text">
              {project.about || project.description}
            </p>
          </div>

          {/* Project Lead */}
          <div className="detail-section">
            <h4 className="detail-section-title">Project Lead</h4>
            <div className="detail-member-card lead-card">
              <div className="user-avatar-circle" style={{ backgroundColor: '#DBEAFE', color: '#1E40AF' }}>
                <span>{project.lead?.initials || project.lead?.name?.charAt(0) || 'L'}</span>
              </div>
              <div className="detail-member-info">
                <span className="detail-member-name">{project.lead?.name || 'Project Lead'}</span>
                <span className="detail-member-role">{project.lead?.role || 'Lead'} · {project.lead?.college || 'University'}</span>
              </div>
              <span className="lead-tag-badge">Lead</span>
            </div>
          </div>

          {/* Team Members */}
          <div className="detail-section">
            <h4 className="detail-section-title">Team Members</h4>
            <div className="detail-members-list">
              {project.members && project.members.length > 0 ? (
                project.members.map((member, idx) => (
                  <div key={idx} className="detail-member-card">
                    <div
                      className="user-avatar-circle"
                      style={{ backgroundColor: '#F1F5F9', color: '#475569' }}
                    >
                      <span>{member.initials || member.name.charAt(0)}</span>
                    </div>
                    <div className="detail-member-info">
                      <span className="detail-member-name">{member.name}</span>
                      <span className="detail-member-role">{member.role}</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="detail-muted-note">Looking for team collaborators.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Detail Bottom Actions */}
      <div className="project-detail-bottom-actions">
        <button
          id="btn-request-join"
          className={`btn-action-primary ${project.requested ? 'requested' : ''}`}
          onClick={() => onRequestJoin(project.id)}
          disabled={project.requested}
        >
          {project.requested ? (
            <>
              <Check size={18} strokeWidth={2.4} />
              <span>Request Sent</span>
            </>
          ) : (
            <>
              <Users size={18} />
              <span>Request to Join</span>
            </>
          )}
        </button>

        <button
          id="btn-chat-team"
          className="btn-action-secondary"
          onClick={() => onChatWithTeam(project)}
        >
          <MessageSquare size={18} />
          <span>Chat with Team</span>
        </button>
      </div>
    </div>
  );
}
