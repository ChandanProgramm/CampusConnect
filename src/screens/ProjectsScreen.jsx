import React, { useState } from 'react';
import { Plus, Users, FolderKanban } from 'lucide-react';

export default function ProjectsScreen({
  projects,
  onSelectProject,
  onOpenNewProjectModal
}) {
  const [activeTab, setActiveTab] = useState('All');

  const tabs = ['All', 'My Projects', 'Joined'];

  const filteredProjects = projects.filter((project) => {
    if (activeTab === 'All') return true;
    if (activeTab === 'My Projects') {
      return project.ownership === 'My Projects' || project.lead?.name === 'Vivek Kumar';
    }
    if (activeTab === 'Joined') {
      return project.ownership === 'Joined';
    }
    return true;
  });

  return (
    <div className="projects-screen-wrap">
      {/* Header */}
      <div className="app-header">
        <span className="app-header-title">Projects</span>
        <button
          id="btn-new-project-open"
          className="btn-header-primary"
          onClick={onOpenNewProjectModal}
        >
          <Plus size={16} strokeWidth={2.5} />
          <span>New Project</span>
        </button>
      </div>

      <div className="screen-scroll-container">
        {/* Filter Tabs */}
        <div className="projects-filter-tabs-row">
          {tabs.map((tab) => (
            <button
              key={tab}
              id={`tab-project-${tab.toLowerCase().replace(' ', '-')}`}
              className={`project-tab-btn ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Project Cards List */}
        <div className="projects-list-container">
          {filteredProjects.length > 0 ? (
            filteredProjects.map((project) => (
              <div
                key={project.id}
                id={`project-card-${project.id}`}
                className="project-hub-card"
                onClick={() => onSelectProject(project.id)}
              >
                <div className="project-card-header">
                  <span className="project-card-title">{project.title}</span>
                  <span className={`status-badge status-${project.status.toLowerCase()}`}>
                    {project.status}
                  </span>
                </div>

                <p className="project-card-desc">{project.description}</p>

                <div className="project-tech-tags-row">
                  {project.techStack.map((tech) => (
                    <span key={tech} className="tech-tag-pill">{tech}</span>
                  ))}
                </div>

                <div className="project-card-footer">
                  <div className="project-members-meta">
                    <Users size={15} color="#6B7280" />
                    <span>{project.membersCount || project.members?.length || 2} members</span>
                  </div>
                  {project.requested && (
                    <span className="project-requested-flag">Request Sent</span>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="projects-empty-state">
              <FolderKanban size={36} color="#9CA3AF" />
              <p>No projects found in this tab.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
