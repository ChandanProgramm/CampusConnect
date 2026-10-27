import React, { useState } from 'react';
import { X, Plus, Sparkles } from 'lucide-react';

export default function NewProjectModal({ isOpen, onClose, onCreateProject }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [about, setAbout] = useState('');
  const [techStackInput, setTechStackInput] = useState('');
  const [status, setStatus] = useState('Planning');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const stackList = techStackInput
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const newProject = {
      id: Date.now(),
      title,
      description: description || "Innovative student collaborative initiative.",
      about: about || description || "Detailed student project ready for campus team collaboration.",
      status,
      techStack: stackList.length > 0 ? stackList : ["React", "JavaScript"],
      membersCount: 1,
      ownership: "My Projects",
      lead: {
        name: "Vivek Kumar",
        initials: "VK",
        role: "Lead",
        college: "KIIT University"
      },
      members: [
        { name: "Vivek Kumar", initials: "VK", role: "Project Lead", college: "KIIT University" }
      ],
      requested: false,
      chatId: `proj-${Date.now()}`
    };

    onCreateProject(newProject);
    setTitle('');
    setDescription('');
    setAbout('');
    setTechStackInput('');
    setStatus('Planning');
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-header-title-wrap">
            <span className="modal-title">Create New Project</span>
            <span className="modal-subtitle">Share your idea with fellow students</span>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label className="form-label">Project Title *</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. AI Study Companion"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Short Tagline *</label>
            <input
              type="text"
              className="form-input"
              placeholder="Brief 1-sentence summary"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Technologies (comma separated)</label>
            <input
              type="text"
              className="form-input"
              placeholder="React, Python, Firebase, Figma"
              value={techStackInput}
              onChange={(e) => setTechStackInput(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Initial Status</label>
            <div className="status-select-pills">
              {['Planning', 'Active', 'Completed'].map((s) => (
                <button
                  type="button"
                  key={s}
                  className={`status-pill-opt ${status === s ? 'active' : ''}`}
                  onClick={() => setStatus(s)}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <button type="submit" className="primary-btn-submit">
            <Plus size={18} />
            <span>Launch Project</span>
          </button>
        </form>
      </div>
    </div>
  );
}
