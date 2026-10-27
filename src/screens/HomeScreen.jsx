import React, { useState } from 'react';
import { Menu, Bell, Search, Plus, Check, Trophy, Clock, Sparkles, ExternalLink } from 'lucide-react';

export default function HomeScreen({
  people,
  projects,
  hackathons = [],
  onSelectHackathon,
  onRegisterHackathon,
  onToggleConnect,
  onSelectProject,
  onSelectPerson,
  onNavigateTab,
  onOpenNotifications,
  unreadNotificationsCount
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [hackathonFilter, setHackathonFilter] = useState('all'); // 'all', 'live', 'ready'

  // Filter hackathon ads
  const filteredHackathons = hackathons.filter((hack) => {
    if (hackathonFilter === 'live' && hack.status !== 'live') return false;
    if (hackathonFilter === 'ready' && hack.status !== 'ready') return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      hack.title.toLowerCase().includes(q) ||
      hack.organizer.toLowerCase().includes(q) ||
      (hack.tags && hack.tags.some((t) => t.toLowerCase().includes(q)))
    );
  });

  // Suggestions list
  const suggestedPeople = people.slice(0, 4).filter((p) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.role.toLowerCase().includes(q) ||
      p.skills.some((s) => s.toLowerCase().includes(q))
    );
  });

  // Recent projects list
  const recentProjects = projects.slice(0, 3).filter((proj) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      proj.title.toLowerCase().includes(q) ||
      proj.description.toLowerCase().includes(q) ||
      proj.techStack.some((t) => t.toLowerCase().includes(q))
    );
  });

  return (
    <div className="home-screen-wrap">
      {/* Top Header */}
      <div className="app-header">
        <button
          className="header-action-btn"
          onClick={() => onNavigateTab('profile')}
          aria-label="Menu"
        >
          <Menu size={22} color="#111827" />
        </button>

        <span className="app-header-title">Home</span>

        <button
          className="header-action-btn"
          onClick={onOpenNotifications}
          aria-label="Notifications"
        >
          <Bell size={21} color="#111827" />
          {unreadNotificationsCount > 0 && (
            <span className="header-badge-count">{unreadNotificationsCount}</span>
          )}
        </button>
      </div>

      <div className="screen-scroll-container">
        {/* Search Bar */}
        <div className="app-search-wrapper">
          <div className="app-search-box">
            <Search size={18} color="#9CA3AF" />
            <input
              type="text"
              className="app-search-input"
              placeholder="Search people, skills, hackathons..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Hero Banner */}
        <div className="home-hero-card">
          <div className="home-hero-content">
            <h2 className="home-hero-title">
              Find People.<br />
              Build Teams.<br />
              Create Impact.
            </h2>
            <button
              id="hero-explore-btn"
              className="home-hero-cta-btn"
              onClick={() => onNavigateTab('people')}
            >
              Explore people
            </button>
          </div>
        </div>

        {/* ========================================================
            HACKATHON ADS SECTION (LIVE & READY FOR REGISTRATION)
            ======================================================== */}
        <div className="home-section-container hackathon-ads-section">
          <div className="home-section-header">
            <div className="section-title-with-ad-badge">
              <h3 className="home-section-title">Hackathon Ads</h3>
              <span className="ad-sponsored-badge">SPONSORED</span>
            </div>
            <span className="hackathon-sub-count">
              {filteredHackathons.length} Active
            </span>
          </div>

          {/* Hackathon Filter Tabs */}
          <div className="hackathon-tabs-pills">
            <button
              className={`hack-filter-tab ${hackathonFilter === 'all' ? 'active' : ''}`}
              onClick={() => setHackathonFilter('all')}
            >
              All Ads ({hackathons.length})
            </button>
            <button
              className={`hack-filter-tab live-tab ${hackathonFilter === 'live' ? 'active' : ''}`}
              onClick={() => setHackathonFilter('live')}
            >
              <span className="live-dot-icon" />
              Live Now
            </button>
            <button
              className={`hack-filter-tab ready-tab ${hackathonFilter === 'ready' ? 'active' : ''}`}
              onClick={() => setHackathonFilter('ready')}
            >
              <Sparkles size={12} />
              Open for Reg
            </button>
          </div>

          {/* Hackathon Ad Cards List */}
          <div className="hackathon-cards-list">
            {filteredHackathons.length > 0 ? (
              filteredHackathons.map((hack) => {
                const isLive = hack.status === 'live';
                const isRegistered = hack.registered;

                return (
                  <div
                    key={hack.id}
                    className={`hackathon-ad-card ${isLive ? 'card-live' : 'card-ready'}`}
                    onClick={() => onSelectHackathon && onSelectHackathon(hack)}
                  >
                    {/* Top Row: Tag & Status */}
                    <div className="hack-card-top">
                      <div className="hack-badge-group">
                        <span className="ad-mini-tag">AD</span>
                        <span className={`hack-status-badge ${isLive ? 'live' : 'ready'}`}>
                          {isLive ? (
                            <>
                              <span className="live-pulse-dot" />
                              LIVE NOW
                            </>
                          ) : (
                            <>
                              <Sparkles size={11} />
                              REGISTRATION OPEN
                            </>
                          )}
                        </span>
                      </div>
                      <span className="hack-mode-pill">{hack.mode}</span>
                    </div>

                    {/* Hackathon Name & Organizer */}
                    <h4 className="hack-card-title">{hack.title}</h4>
                    <span className="hack-card-organizer">{hack.organizer}</span>
                    <p className="hack-card-tagline">{hack.tagline}</p>

                    {/* Highlights: Prize & Timing */}
                    <div className="hack-card-meta-row">
                      <div className="hack-meta-item prize">
                        <Trophy size={14} color="#D97706" />
                        <span>{hack.prizePool}</span>
                      </div>
                      <div className="hack-meta-item timing">
                        <Clock size={14} color={isLive ? '#DC2626' : '#2563EB'} />
                        <span>{hack.deadline}</span>
                      </div>
                    </div>

                    {/* Card Footer Actions */}
                    <div className="hack-card-footer">
                      <button
                        className={`hack-card-action-btn ${isRegistered ? 'registered' : ''}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onRegisterHackathon) onRegisterHackathon(hack.id);
                        }}
                      >
                        {isRegistered ? (
                          <>
                            <Check size={14} strokeWidth={2.4} />
                            <span>Registered</span>
                          </>
                        ) : (
                          <>
                            <ExternalLink size={14} />
                            <span>{isLive ? 'Enter Hackathon' : 'Register Now'}</span>
                          </>
                        )}
                      </button>

                      <button
                        className="hack-card-details-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onSelectHackathon) onSelectHackathon(hack);
                        }}
                      >
                        Details
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="hackathons-empty-state">
                <p>No hackathons matching current filter.</p>
              </div>
            )}
          </div>
        </div>

        {/* Section: Suggestions for you */}
        <div className="home-section-container">
          <div className="home-section-header">
            <h3 className="home-section-title">Suggestions for you</h3>
            <button
              className="home-view-all-link"
              onClick={() => onNavigateTab('people')}
            >
              View all
            </button>
          </div>

          <div className="home-suggestions-list">
            {suggestedPeople.map((person) => {
              const isConnected = person.connected;
              return (
                <div
                  key={person.id}
                  className="home-user-card"
                  onClick={() => onSelectPerson && onSelectPerson(person)}
                >
                  {/* Avatar Initials Circle */}
                  <div
                    className="user-avatar-circle"
                    style={{ backgroundColor: person.avatarBg, color: person.avatarColor }}
                  >
                    <span>{person.initials}</span>
                  </div>

                  {/* Info */}
                  <div className="home-user-info">
                    <span className="home-user-name">{person.name}</span>
                    <span className="home-user-role">{person.role}</span>
                    <span className="home-user-skills">{person.skills.join(', ')}</span>
                  </div>

                  {/* Connect Action Button */}
                  <button
                    className={`connect-circle-btn ${isConnected ? 'connected' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleConnect(person.id);
                    }}
                    aria-label={isConnected ? `Connected with ${person.name}` : `Connect with ${person.name}`}
                  >
                    {isConnected ? (
                      <Check size={18} strokeWidth={2.6} />
                    ) : (
                      <Plus size={18} strokeWidth={2.6} />
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section: Recent Projects */}
        <div className="home-section-container" style={{ paddingBottom: '24px' }}>
          <div className="home-section-header">
            <h3 className="home-section-title">Recent Projects</h3>
            <button
              className="home-view-all-link"
              onClick={() => onNavigateTab('projects')}
            >
              View all
            </button>
          </div>

          <div className="home-projects-list">
            {recentProjects.map((project) => (
              <div
                key={project.id}
                className="home-project-card"
                onClick={() => onSelectProject(project.id)}
              >
                <div className="project-card-top-row">
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
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
