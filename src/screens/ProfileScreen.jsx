import React, { useState } from 'react';
import { LogOut, Plus, X } from 'lucide-react';
import { profilesService, DUMMY_STUDENT_ID } from '../lib/supabaseClient';

export default function ProfileScreen({
  userProfile,
  connectedCount,
  onSelectProject,
  onLogout,
  onShowToast
}) {
  const [skills, setSkills] = useState(userProfile.skills);
  const [newSkillInput, setNewSkillInput] = useState('');
  const [showAddSkill, setShowAddSkill] = useState(false);

  const totalConnections = userProfile.initialConnectionsCount + connectedCount;

  const handleAddSkill = async (e) => {
    e.preventDefault();
    const trimmed = newSkillInput.trim();
    if (!trimmed) return;
    if (skills.includes(trimmed)) {
      onShowToast('Skill already in your profile', 'alert');
      return;
    }
    const updatedSkills = [...skills, trimmed];
    setSkills(updatedSkills);
    setNewSkillInput('');
    setShowAddSkill(false);
    onShowToast(`Added "${trimmed}" to your skills!`, 'success');

    // Persist to Supabase
    try {
      const studentId = userProfile.id || DUMMY_STUDENT_ID;
      await profilesService.updateProfile(studentId, { skills: updatedSkills });
    } catch (err) {
      console.warn('Profile skill sync notice:', err);
    }
  };

  const handleRemoveSkill = async (skillToRemove) => {
    const updatedSkills = skills.filter((s) => s !== skillToRemove);
    setSkills(updatedSkills);
    onShowToast(`Removed ${skillToRemove}`, 'alert');

    // Persist to Supabase
    try {
      const studentId = userProfile.id || DUMMY_STUDENT_ID;
      await profilesService.updateProfile(studentId, { skills: updatedSkills });
    } catch (err) {
      console.warn('Profile skill sync notice:', err);
    }
  };

  return (
    <div className="profile-screen-wrap">
      {/* App Header with Logout option */}
      <div className="app-header">
        <div style={{ width: 36 }} />
        <span className="app-header-title">Profile</span>
        <button
          className="header-action-btn"
          onClick={onLogout}
          title="Sign Out / Switch Account"
          aria-label="Log Out"
        >
          <LogOut size={19} color="#6B7280" />
        </button>
      </div>

      <div className="screen-scroll-container">
        {/* Profile Hero Header */}
        <div className="profile-hero-card">
          <div className="profile-avatar-large">
            <span className="profile-avatar-letters">VK</span>
          </div>

          <h2 className="profile-user-name">{userProfile.name}</h2>
          <span className="profile-user-role">{userProfile.role}</span>
          <span className="profile-user-college">{userProfile.college}</span>

          {/* Stats Bar */}
          <div className="profile-stats-bar">
            <div className="stat-item">
              <span className="stat-number">{totalConnections}</span>
              <span className="stat-label">Connections</span>
            </div>
            <div className="stat-divider" />
            <div className="stat-item">
              <span className="stat-number">{userProfile.projectsCount}</span>
              <span className="stat-label">Projects</span>
            </div>
            <div className="stat-divider" />
            <div className="stat-item">
              <span className="stat-number">{skills.length}</span>
              <span className="stat-label">Skills</span>
            </div>
          </div>
        </div>

        {/* Section: About Me */}
        <div className="profile-content-section">
          <h3 className="profile-section-title">About Me</h3>
          <p className="profile-bio-text">{userProfile.bio}</p>
        </div>

        {/* Section: Skills */}
        <div className="profile-content-section">
          <div className="profile-section-header-row">
            <h3 className="profile-section-title">Skills</h3>
            <button
              className="add-skill-toggle-btn"
              onClick={() => setShowAddSkill(!showAddSkill)}
            >
              {showAddSkill ? <X size={15} /> : <Plus size={15} />}
              <span>{showAddSkill ? 'Cancel' : 'Add Skill'}</span>
            </button>
          </div>

          {showAddSkill && (
            <form onSubmit={handleAddSkill} className="add-skill-inline-form">
              <input
                type="text"
                className="add-skill-input"
                placeholder="e.g. Next.js, Flutter, AWS"
                value={newSkillInput}
                onChange={(e) => setNewSkillInput(e.target.value)}
                autoFocus
              />
              <button type="submit" className="add-skill-submit-btn">
                Add
              </button>
            </form>
          )}

          <div className="profile-skills-cloud">
            {skills.map((skill) => (
              <span key={skill} className="profile-skill-tag" onClick={() => handleRemoveSkill(skill)}>
                <span>{skill}</span>
                <span className="skill-remove-hint">×</span>
              </span>
            ))}
          </div>
        </div>

        {/* Section: My Projects */}
        <div className="profile-content-section" style={{ paddingBottom: '32px' }}>
          <h3 className="profile-section-title">My Projects</h3>
          <div className="profile-projects-list">
            {userProfile.myProjects?.map((proj) => (
              <div
                key={proj.id}
                className="profile-project-card"
                onClick={() => onSelectProject(proj.id)}
              >
                <div className="profile-proj-top">
                  <span className="profile-proj-title">{proj.title}</span>
                  <span className={`status-badge status-${proj.status.toLowerCase()}`}>
                    {proj.status}
                  </span>
                </div>
                <p className="profile-proj-desc">{proj.description}</p>
                <div className="project-tech-tags-row">
                  {proj.techStack.map((t) => (
                    <span key={t} className="tech-tag-pill">{t}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
