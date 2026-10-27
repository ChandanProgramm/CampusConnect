import React, { useState } from 'react';
import { ChevronLeft, Search, UserPlus, Check, UserCheck } from 'lucide-react';

export default function PeopleScreen({
  people,
  onToggleConnect,
  onSelectPerson,
  onNavigateBack
}) {
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filterOptions = ['All', 'Developers', 'Designers', 'Marketing'];

  const filteredPeople = people.filter((person) => {
    // Filter by Category
    if (activeFilter !== 'All' && person.category !== activeFilter) {
      return false;
    }
    // Filter by Search
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase().trim();
    const matchesName = person.name.toLowerCase().includes(query);
    const matchesRole = person.role.toLowerCase().includes(query);
    const matchesCollege = person.college.toLowerCase().includes(query);
    const matchesSkill = person.skills.some((s) => s.toLowerCase().includes(query));
    return matchesName || matchesRole || matchesCollege || matchesSkill;
  });

  return (
    <div className="people-screen-wrap">
      {/* Header */}
      <div className="app-header">
        <button
          className="header-action-btn"
          onClick={onNavigateBack}
          aria-label="Back"
        >
          <ChevronLeft size={24} color="#111827" />
        </button>
        <span className="app-header-title">People</span>
        <div style={{ width: 36 }} />
      </div>

      <div className="screen-scroll-container">
        {/* Search Bar */}
        <div className="app-search-wrapper">
          <div className="app-search-box">
            <Search size={18} color="#9CA3AF" />
            <input
              type="text"
              className="app-search-input"
              placeholder="Search by name, skills, college..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="people-filter-pills-row">
          {filterOptions.map((filter) => (
            <button
              key={filter}
              className={`filter-pill-btn ${activeFilter === filter ? 'active' : ''}`}
              onClick={() => setActiveFilter(filter)}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* People List */}
        <div className="people-list-container">
          {filteredPeople.length > 0 ? (
            filteredPeople.map((person) => {
              const isConnected = person.connected;
              return (
                <div
                  key={person.id}
                  className="people-card-item"
                  onClick={() => onSelectPerson && onSelectPerson(person)}
                >
                  {/* Initials Avatar */}
                  <div
                    className="user-avatar-circle"
                    style={{ backgroundColor: person.avatarBg, color: person.avatarColor }}
                  >
                    <span>{person.initials}</span>
                  </div>

                  {/* Info */}
                  <div className="people-card-details">
                    <span className="people-card-name">{person.name}</span>
                    <span className="people-card-sub">
                      {person.role} · {person.college}
                    </span>
                    <div className="people-skills-tags">
                      {person.skills.map((skill) => (
                        <span key={skill} className="people-skill-pill">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Connect Action Button matching blueprint icon */}
                  <button
                    id={`connect-btn-${person.id}`}
                    className={`people-connect-btn ${isConnected ? 'connected' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleConnect(person.id);
                    }}
                    title={isConnected ? 'Connected' : 'Connect'}
                  >
                    {isConnected ? (
                      <Check size={18} strokeWidth={2.4} color="#2563EB" />
                    ) : (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                        <circle cx="9" cy="7" r="4"></circle>
                        <line x1="19" y1="8" x2="19" y2="14"></line>
                        <line x1="22" y1="11" x2="16" y2="11"></line>
                      </svg>
                    )}
                  </button>
                </div>
              );
            })
          ) : (
            <div className="people-empty-state">
              <p>No students found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
