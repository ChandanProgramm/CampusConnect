import React from 'react';
import { Home, Users, Briefcase, MessageCircle, User } from 'lucide-react';

export default function BottomNav({ activeTab, onSelectTab, unreadChatCount }) {
  const tabs = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'people', label: 'People', icon: Users },
    { id: 'projects', label: 'Projects', icon: Briefcase },
    { id: 'chats', label: 'Chats', icon: MessageCircle, badgeCount: unreadChatCount },
    { id: 'profile', label: 'Profile', icon: User }
  ];

  return (
    <nav className="bottom-nav-bar" aria-label="Bottom Navigation">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            id={`tab-button-${tab.id}`}
            className={`nav-tab-item ${isActive ? 'active' : ''}`}
            onClick={() => onSelectTab(tab.id)}
            aria-label={tab.label}
          >
            <div className="nav-tab-icon-wrapper">
              <Icon size={22} strokeWidth={isActive ? 2.4 : 1.9} />
              {tab.badgeCount > 0 && <span className="nav-badge-dot" />}
            </div>
            <span className="nav-tab-label">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
